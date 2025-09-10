const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, 'codesync.yml')
const STATE_DIR = path.join(ROOT, '.codesync')
const INSTALL_PATH = path.join(STATE_DIR, 'installation.json')

function getBaseUrl(){ return process.env.CODESYNC_BASE_URL || 'http://localhost:3000' }

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
  const base = getBaseUrl()
  const url = base.replace(/\/$/, '') + pathname
  const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts))
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  return data
}

async function pairStart(){ return api('/api/codesync/pair/start', { method: 'POST' }) }
async function pairConfirm(code){ return api('/api/codesync/pair/confirm', { method: 'POST', body: JSON.stringify({ code }) }) }

async function tokensPull(){
  const inst = readInstallation()
  if (!inst) throw new Error('Not paired. Run: codesync pair confirm <code>')
  const headers = { 'X-Installation-Id': inst.installationId, 'X-Access-Token': inst.token }
  return api('/api/codesync/tokens/pull', { method: 'GET', headers })
}

async function tokensPush(payload){
  const inst = readInstallation()
  if (!inst) throw new Error('Not paired. Run: codesync pair confirm <code>')
  const headers = { 'X-Installation-Id': inst.installationId, 'X-Access-Token': inst.token, 'Content-Type': 'application/json' }
  return api('/api/codesync/tokens/push', { method: 'POST', headers, body: JSON.stringify(payload) })
}

module.exports = {
  parseYAML, stringifyYAML, readConfig, writeConfig, extractFigmaKey,
  getBaseUrl, pairStart, pairConfirm, tokensPull, tokensPush,
  saveInstallation, readInstallation,
  paths: { ROOT, CONFIG_PATH, STATE_DIR, INSTALL_PATH }
}
