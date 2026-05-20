const { KV } = require('./db');

// Tolerant of single-arg usage: kv.get(key) treats it as kv.get('default', key).
// Two-arg form kv.get(ns, key) works as before.
function _norm(ns, k, def) {
  // If caller passed only one positional and it's a string, treat as key in 'default' ns.
  if (k === undefined || k === null) {
    return { ns: 'default', k: ns, def };
  }
  return { ns, k, def };
}

async function get(ns, k, def = null) {
  const n = _norm(ns, k, def);
  const row = await KV.findOne({ where: { ns: n.ns, k: n.k } });
  if (!row) return n.def;
  try { return JSON.parse(row.v); } catch { return row.v; }
}
async function set(ns, k, v) {
  // Single-arg style: kv.set(key, value) → ns='default'
  let _ns = ns, _k = k, _v = v;
  if (arguments.length === 2) { _ns = 'default'; _k = ns; _v = k; }
  const value = typeof _v === 'string' ? _v : JSON.stringify(_v);
  const [row] = await KV.findOrCreate({ where: { ns: _ns, k: _k }, defaults: { v: value } });
  row.v = value;
  await row.save();
  return row;
}
async function del(ns, k) {
  if (k === undefined) return KV.destroy({ where: { ns: 'default', k: ns } });
  return KV.destroy({ where: { ns, k } });
}
async function all(ns) {
  const _ns = ns || 'default';
  const rows = await KV.findAll({ where: { ns: _ns } });
  return rows.map((r) => ({ k: r.k, v: (() => { try { return JSON.parse(r.v); } catch { return r.v; } })() }));
}

module.exports = { get, set, del, all };
