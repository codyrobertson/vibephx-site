#!/usr/bin/env node
/*
 CodeSync CLI (scaffold)
 - login: store token locally (project-scoped)
 - link: set figma file + project id and source-of-truth
 - status: show current link + last-sync existence
 - pull tokens [--plan]: plan/apply figma->code (stub)
 - push tokens [--plan]: plan/apply code->figma (stub)
*/

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, 'codesync.yml')
const STATE_DIR = path.join(ROOT, '.codesync')
const TOKEN_PATH = path.join(STATE_DIR, 'token')
const LAST_SYNC_PATH = path.join(STATE_DIR, 'last-sync.json')

function exit(msg, code = 1){ if (msg) console.error(msg); process.exit(code) }
function info(msg){ console.log(msg) }

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function parseYAML(y){
  // minimal YAML parser for simple key: value pairs
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

function readToken(){
  try { return fs.readFileSync(TOKEN_PATH, 'utf8').trim() } catch { return null }
}

function writeToken(token){ ensureDir(STATE_DIR); fs.writeFileSync(TOKEN_PATH, token, { encoding: 'utf8', mode: 0o600 }) }

function extractFigmaKey(input){
  if (!input) return null
  const m = String(input).match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)\b/)
  if (m && m[1]) return m[1]
  // fallback: maybe it's already a key
  return String(input).trim()
}

function cmd_login(args){
  const tokenArg = args.find(a => a.startsWith('--token='))
  const token = tokenArg ? tokenArg.split('=')[1] : null
  if (!token) exit('Usage: codesync login --token=<API_TOKEN>')
  writeToken(token)
  info('✔ Token saved to .codesync/token')
}

function cmd_link(args){
  const figma = args[0]
  if (!figma) exit('Usage: codesync link <figma-url-or-key> [--project=<id>] [--source-of-truth=code|figma]')
  const projectArg = (args.find(a => a.startsWith('--project=')) || '')
  const sourceArg = (args.find(a => a.startsWith('--source-of-truth=')) || '')
  const projectId = projectArg.split('=')[1] || 'proj_local'
  const sourceOfTruth = (sourceArg.split('=')[1] || 'code').toLowerCase()
  const figmaFileKey = extractFigmaKey(figma)

  const cfg = readConfig() || {}
  cfg.projectId = projectId
  cfg.figmaFileKey = figmaFileKey
  cfg.sourceOfTruth = (sourceOfTruth === 'figma') ? 'figma' : 'code'
  cfg.lastSync = cfg.lastSync || new Date().toISOString()
  writeConfig(cfg)
  info(`✔ Linked to Figma file ${figmaFileKey} (project: ${projectId}, sourceOfTruth: ${cfg.sourceOfTruth})`)
}

function cmd_status(){
  const cfg = readConfig()
  const token = readToken()
  info('CodeSync Status:')
  if (!cfg){ info('  - Not linked (codesync.yml missing)'); return }
  info(`  - projectId: ${cfg.projectId || '(unset)'}`)
  info(`  - figmaFileKey: ${cfg.figmaFileKey || '(unset)'}`)
  info(`  - sourceOfTruth: ${cfg.sourceOfTruth || '(unset)'}`)
  info(`  - lastSync: ${cfg.lastSync || '(unset)'}${fs.existsSync(LAST_SYNC_PATH)? ' (state present)': ''}`)
  info(`  - token: ${token ? 'present' : 'missing'} (.codesync/token)`)
}

function cmd_pull(args){
  const plan = args.includes('--plan')
  const cfg = readConfig() || {}
  if (!cfg.figmaFileKey) exit('Not linked. Run: codesync link <figma-url>')
  info(plan ? 'Plan: Figma → Code (tokens)' : 'Apply: Figma → Code (tokens)')
  // STUB: in real flow, contact service to fetch tokens (using token)
  const token = readToken()
  if (!token) info('! No token found. Run: codesync login --token=...')
  info('- would write: design-tokens.json, tokens.css, shadcn.css, tailwind.config.js (extend)')
  if (!plan){ ensureDir(STATE_DIR); fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify({ at: new Date().toISOString(), dir: 'figma->code' }, null, 2)) }
}

function cmd_push(args){
  const plan = args.includes('--plan')
  const cfg = readConfig() || {}
  if (!cfg.figmaFileKey) exit('Not linked. Run: codesync link <figma-url>')
  info(plan ? 'Plan: Code → Figma (tokens)' : 'Apply: Code → Figma (tokens)')
  // STUB: in real flow, read design-tokens.json (or IR) and send to service
  const token = readToken()
  if (!token) info('! No token found. Run: codesync login --token=...')
  info('- would read: design-tokens.json (and/or IR) and update Figma variables/collections')
  if (!plan){ ensureDir(STATE_DIR); fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify({ at: new Date().toISOString(), dir: 'code->figma' }, null, 2)) }
}

function main(){
  const [, , cmd, ...rest] = process.argv
  switch ((cmd||'').toLowerCase()){
    case 'login': return cmd_login(rest)
    case 'link': return cmd_link(rest)
    case 'status': return cmd_status()
    case 'pull':
      if ((rest[0]||'') === 'tokens') return cmd_pull(rest.slice(1))
      return exit('Usage: codesync pull tokens [--plan]')
    case 'push':
      if ((rest[0]||'') === 'tokens') return cmd_push(rest.slice(1))
      return exit('Usage: codesync push tokens [--plan]')
    default:
      info('CodeSync CLI')
      info('Usage:')
      info('  codesync login --token=<API_TOKEN>')
      info('  codesync link <figma-url-or-key> [--project=<id>] [--source-of-truth=code|figma]')
      info('  codesync status')
      info('  codesync pull tokens [--plan]')
      info('  codesync push tokens [--plan]')
  }
}

main()
