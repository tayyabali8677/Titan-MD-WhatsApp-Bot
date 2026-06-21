const { bot } = require('../lib');
const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

bot({ pattern: 'whatmusic', desc: 'Identify a song from audio/video (Shazam-like)', type: 'utility' }, async (msg, match, ctx) => {
  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply('_[mock] Song: Never Gonna Give You Up - Rick Astley_');
  }

  const ctxInfo = msg.raw?.message?.extendedTextMessage?.contextInfo;
  const quotedMsg = ctxInfo?.quotedMessage;
  const audioMsg = quotedMsg?.audioMessage || quotedMsg?.videoMessage;

  if (!audioMsg) return msg.reply('_Reply to an audio or video message to identify the song._');

  try {
    await msg.reply('_Identifying song... please wait_');

    const type = quotedMsg?.audioMessage ? 'audio' : 'video';
    const stream = await downloadContentFromMessage(audioMsg, type);
    const chunks = []; for await (const c of stream) chunks.push(c);
    const buffer = Buffer.concat(chunks);

    const apiKey = ctx?.config?.AUDD_KEY || '';
    const form = new FormData();
    if (apiKey) form.append('api_token', apiKey);
    form.append('audio', buffer.toString('base64'));
    form.append('return', 'apple_music,spotify');

    const { data } = await axios.post('https://api.audd.io/', form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    if (!data.result) {
      return msg.reply('_Could not identify the song. Try a clearer audio clip (10-30 seconds)._\n_Add AUDD_KEY to config for better accuracy._');
    }

    const r = data.result;
    const spotify = r.spotify;
    const apple = r.apple_music;

    let text = `🎵 *Song Identified!*\n\n` +
      `🎶 *Title:* ${r.title}\n` +
      `👤 *Artist:* ${r.artist}\n` +
      `💿 *Album:* ${r.album || 'N/A'}\n` +
      `📅 *Release:* ${r.release_date || 'N/A'}\n` +
      `⏱ *Timecode:* ${r.timecode || 'N/A'}`;

    if (spotify?.external_urls?.spotify) {
      text += `\n\n🟢 *Spotify:* ${spotify.external_urls.spotify}`;
    }
    if (apple?.url) {
      text += `\n🍎 *Apple Music:* ${apple.url}`;
    }

    return msg.reply(text);
  } catch (e) {
    return msg.reply('_Music identification failed: ' + (e.message || e) + '_');
  }
});
