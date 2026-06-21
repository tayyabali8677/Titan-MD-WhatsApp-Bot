const { bot } = require('../lib');

bot({ pattern: 'eval ?(.*)', desc: 'Execute JavaScript (owner only)', type: 'owner', onlyOwner: true }, async (msg, match) => {
  const code = (match || '').trim();
  if (!code) return msg.reply('_Usage: .eval <js code>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply('_[mock] eval result_');
  }

  try {
    // eslint-disable-next-line no-new-func
    let result = await Promise.resolve(new Function('msg', 'require', `return (async () => { ${code} })()`)
      .call(globalThis, msg, require));

    if (typeof result !== 'string') result = JSON.stringify(result, null, 2);
    return msg.reply('```\n' + result + '\n```');
  } catch (e) {
    return msg.reply('_Error:_\n```\n' + (e.stack || e.message || e) + '\n```');
  }
});
