function buildMessage(raw, client) {
  const jid = raw.jid || raw.from || 'mock@s.whatsapp.net';
  const pushName = raw.pushName || 'MockUser';
  const fromMe = !!raw.fromMe;
  const body = raw.body || raw.text || '';
  const mention = raw.mention || [];
  const reply_message = raw.reply_message || null;
  // sender = participant in groups, jid itself in DMs. Falls back to jid if neither available.
  const sender = raw.sender
    || (raw.key && raw.key.participant)
    || (raw.key && raw.key.remoteJid && !raw.key.remoteJid.endsWith('@g.us') ? raw.key.remoteJid : jid);

  const send = async (msg, options = {}, type = 'text') => {
    return client.sendMessage(jid, { text: typeof msg === 'string' ? msg : JSON.stringify(msg), ...options, _type: type });
  };
  const reply = async (msg, options = {}) => {
    return client.sendMessage(jid, { text: typeof msg === 'string' ? msg : JSON.stringify(msg), ...options, _quoted: raw });
  };
  const groupMetadata = async (j = jid) => {
    if (client.groupMetadata) return client.groupMetadata(j);
    return { id: j, subject: 'Mock Group', participants: [] };
  };
  const Kick = async (target) => {
    if (client.groupParticipantsUpdate) return client.groupParticipantsUpdate(jid, [target], 'remove');
    return { ok: true, mock: true, action: 'kick', target };
  };

  return {
    raw,
    jid,
    sender,
    from: jid,
    pushName,
    fromMe,
    body,
    mention,
    reply_message,
    client,
    key: raw.key || { remoteJid: jid, id: raw.id || 'MOCKID', fromMe },
    isSudo: false, // populated by client._onMessage before handler runs
    send,
    reply,
    groupMetadata,
    Kick,
  };
}

module.exports = { buildMessage };
