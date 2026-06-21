const { bot, lang } = require('../lib');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

bot({ pattern: 'revive', desc: 'Reveal a view-once message', type: 'utility' }, async (msg) => {
  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply('_[mock] view-once media revealed_');
  }

  const ctxInfo = msg.raw?.message?.extendedTextMessage?.contextInfo;
  if (!ctxInfo) return msg.reply('_Reply to a view-once message._');

  const quoted = ctxInfo.quotedMessage;
  if (!quoted) return msg.reply('_No quoted message found._');

  const voMsg =
    quoted.viewOnceMessage?.message ||
    quoted.viewOnceMessageV2?.message ||
    quoted.viewOnceMessageV2Extension?.message;

  if (!voMsg) return msg.reply('_That is not a view-once message._');

  const imgMsg = voMsg.imageMessage;
  const vidMsg = voMsg.videoMessage;
  const audMsg = voMsg.audioMessage;
  const mediaMsg = imgMsg || vidMsg || audMsg;
  if (!mediaMsg) return msg.reply('_No media found in the view-once message._');

  const type = imgMsg ? 'image' : vidMsg ? 'video' : 'audio';
  try {
    const stream = await downloadContentFromMessage(mediaMsg, type);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    await msg.client.sendMessage(
      msg.jid,
      { [type]: buffer, caption: '_Revealed view-once 👁_', mimetype: mediaMsg.mimetype },
      { quoted: msg.raw }
    );
  } catch (e) {
    return msg.reply('_Failed to reveal: ' + (e.message || e) + '_');
  }
});

// alias
bot({ pattern: 'viewonce', desc: lang.plugins.viewonce?.desc || 'Reveal view-once media', type: 'utility' }, async (msg) => {
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply('_[mock] view-once revealed_');
  const ctxInfo = msg.raw?.message?.extendedTextMessage?.contextInfo;
  if (!ctxInfo) return msg.reply('_Reply to a view-once message._');
  const quoted = ctxInfo.quotedMessage;
  if (!quoted) return msg.reply('_No quoted message._');
  const voMsg = quoted.viewOnceMessage?.message || quoted.viewOnceMessageV2?.message || quoted.viewOnceMessageV2Extension?.message;
  if (!voMsg) return msg.reply('_Not a view-once message._');
  const imgMsg = voMsg.imageMessage; const vidMsg = voMsg.videoMessage; const audMsg = voMsg.audioMessage;
  const mediaMsg = imgMsg || vidMsg || audMsg;
  if (!mediaMsg) return msg.reply('_No media found._');
  const type = imgMsg ? 'image' : vidMsg ? 'video' : 'audio';
  try {
    const stream = await downloadContentFromMessage(mediaMsg, type);
    const chunks = []; for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    await msg.client.sendMessage(msg.jid, { [type]: buffer, caption: '_Revealed 👁_', mimetype: mediaMsg.mimetype }, { quoted: msg.raw });
  } catch (e) { return msg.reply('_Failed: ' + (e.message || e) + '_'); }
});
