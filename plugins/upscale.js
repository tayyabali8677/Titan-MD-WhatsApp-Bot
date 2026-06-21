const { bot } = require('../lib');
const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const dl = require('../lib/dl');

bot(
  { pattern: 'upscale', desc: 'Upscale/enhance a replied image 4x via AI', type: 'editor' },
  async (msg) => {
    if (!msg.client || msg.client.constructor.name === 'MockSocket') {
      return msg.reply('_[mock] Image upscaled 4x_');
    }

    const ctxInfo = msg.raw?.message?.extendedTextMessage?.contextInfo;
    const imgMsg = ctxInfo?.quotedMessage?.imageMessage;
    if (!imgMsg) return msg.reply('_Reply to an image to upscale it._');

    try {
      await msg.reply('_Enhancing image... this may take 10-20s_');
      const stream = await downloadContentFromMessage(imgMsg, 'image');
      const chunks = []; for await (const c of stream) chunks.push(c);
      const buf = Buffer.concat(chunks);

      const form = new FormData();
      form.append('image', buf, { filename: 'image.jpg', contentType: 'image/jpeg' });

      const { data, status } = await axios.post(
        'http://max-image-resolution-enhancer.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud/model/predict',
        form,
        { headers: form.getHeaders(), responseType: 'arraybuffer', timeout: 60000 }
      );

      if (status !== 200) throw new Error('Enhancer returned ' + status);

      await msg.client.sendMessage(
        msg.jid,
        { image: Buffer.from(data), caption: '✨ *Image enhanced 4x!*', mimetype: 'image/jpeg' },
        { quoted: msg.raw }
      );
    } catch (e) {
      return msg.reply('_Enhancement failed: ' + (e.message || e) + '_');
    }
  }
);
