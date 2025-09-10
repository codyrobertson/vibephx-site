const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, 'codesync.yml')
const STATE_DIR = path.join(ROOT, '.codesync')
const INSTALL_PATH = path.join(STATE_DIR, 'installation.json')

let __BASE_CACHE = null
async function resolveBaseUrl(){
  if (process.env.CODESYNC_BASE_URL) { __BASE_CACHE = process.env.CODESYNC_BASE_URL; return __BASE_CACHE }
  if (__BASE_CACHE) return __BASE_CACHE
  const candidates = [
    'http://localhost:3004', 'http://127.0.0.1:3004',
    'http://localhost:3000', 'http://127.0.0.1:3000'
  ]
  const timeoutMs = 500
  for (const base of candidates){
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), timeoutMs)
      const res = await fetch(base.replace(/\/$/, '') + '/api/test', { method: 'GET', signal: ctrl.signal })
      clearTimeout(t)
      if (res.ok) { __BASE_CACHE = base; return base }
    } catch (_) {}
  }
  __BASE_CACHE = 'http://localhost:3000'
  return __BASE_CACHE
}
function getBaseUrl(){ return __BASE_CACHE || process.env.CODESYNC_BASE_URL || 'http://localhost:3000' }

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function parseYAML(y){
  const out = {}
  String(y || '').split(/\r?\n/).forEach(line => {
    const s = line.trim()
    if (!s || s.startsWith('#')) return
    const idx = s.indexOf(':')
    if (idx === -1) return
    const k = s.slice(0, idx).trim()
    const vRaw = s.slice(idx + 1).trim()
    let v = vRaw
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    out[k] = v
  })
  return out
}

function stringifyYAML(obj){
  return Object.keys(obj).map(k => `${k}: ${String(obj[k] ?? '')}`).join('\n') + '\n'
}

function readConfig(){
  if (!fs.existsSync(CONFIG_PATH)) return null
  const txt = fs.readFileSync(CONFIG_PATH, 'utf8')
  return parseYAML(txt)
}

function writeConfig(cfg){
  const txt = stringifyYAML(cfg)
  fs.writeFileSync(CONFIG_PATH, txt, 'utf8')
}

function extractFigmaKey(input){
  if (!input) return null
  const m = String(input).match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)\b/)
  if (m && m[1]) return m[1]
  return String(input).trim()
}

function saveInstallation(inst){ ensureDir(STATE_DIR); fs.writeFileSync(INSTALL_PATH, JSON.stringify(inst, null, 2)) }
function readInstallation(){ try { return JSON.parse(fs.readFileSync(INSTALL_PATH, 'utf8')) } catch { return null } }

async function api(pathname, opts = {}){
  const base = await resolveBaseUrl()
  const url = base.replace(/\/$/, '') + pathname
  const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts))
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  return data
}

async function attemptApi(pathname, opts = {}){
  const explicit = process.env.CODESYNC_BASE_URL ? [process.env.CODESYNC_BASE_URL] : []
  const bases = explicit.concat([
    'http://localhost:3004','http://127.0.0.1:3004',
    'http://localhost:3000','http://127.0.0.1:3000'
  ])
  let lastErr = null
  for (const base of bases){
    try {
      const url = base.replace(/\/$/, '') + pathname
      const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts))
      const data = await res.json().catch(() => ({}))
      if (res.ok){ __BASE_CACHE = base; return data }
      lastErr = new Error(data?.error || `HTTP ${res.status}`)
      if (res.status >= 500) break
    } catch (e) { lastErr = e }
  }
  throw lastErr || new Error('Failed to reach CodeSync API')
}

async function pairStart(){ return attemptApi('/api/codesync/pair/start', { method: 'POST' }) }
async function pairConfirm(code){ return attemptApi('/api/codesync/pair/confirm', { method: 'POST', body: JSON.stringify({ code }) }) }

async function tokensPull(){
  const inst = readInstallation()
  if (!inst) throw new Error('Not paired. Run: codesync pair confirm <code>')
  const headers = { 'X-Installation-Id': inst.installationId, 'X-Access-Token': inst.token }
  return attemptApi('/api/codesync/tokens/pull', { method: 'GET', headers })
}

async function tokensPush(payload){
  const inst = readInstallation()
  if (!inst) throw new Error('Not paired. Run: codesync pair confirm <code>')
  const headers = { 'X-Installation-Id': inst.installationId, 'X-Access-Token': inst.token, 'Content-Type': 'application/json' }
  return attemptApi('/api/codesync/tokens/push', { method: 'POST', headers, body: JSON.stringify(payload) })
}

module.exports = {
  parseYAML, stringifyYAML, readConfig, writeConfig, extractFigmaKey,
  getBaseUrl, pairStart, pairConfirm, tokensPull, tokensPush,
  saveInstallation, readInstallation,
  paths: { ROOT, CONFIG_PATH, STATE_DIR, INSTALL_PATH }
}
