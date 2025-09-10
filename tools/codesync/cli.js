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
const {
  parseYAML, stringifyYAML, readConfig, writeConfig, extractFigmaKey,
  pairStart, pairConfirm, tokensPull, tokensPush, saveInstallation, readInstallation,
  paths
} = require('./lib')

const ROOT = paths.ROOT
const STATE_DIR = paths.STATE_DIR
const LAST_SYNC_PATH = path.join(STATE_DIR, 'last-sync.json')
const OUT_DIR = path.join(ROOT, 'public', 'snippets')

function exit(msg, code = 1){ if (msg) console.error(msg); process.exit(code) }
function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

const USE_COLOR = process.stdout.isTTY && !process.env.NO_COLOR
const C = USE_COLOR ? {
  reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m',
  red:(s)=>"\x1b[31m"+s+"\x1b[0m", green:(s)=>"\x1b[32m"+s+"\x1b[0m",
  yellow:(s)=>"\x1b[33m"+s+"\x1b[0m", blue:(s)=>"\x1b[34m"+s+"\x1b[0m",
  magenta:(s)=>"\x1b[35m"+s+"\x1b[0m", cyan:(s)=>"\x1b[36m"+s+"\x1b[0m",
  bold:(s)=>"\x1b[1m"+s+"\x1b[0m", dim:(s)=>"\x1b[2m"+s+"\x1b[0m"
} : {
  red:(s)=>s, green:(s)=>s, yellow:(s)=>s, blue:(s)=>s, magenta:(s)=>s, cyan:(s)=>s, bold:(s)=>s, dim:(s)=>s
}
function info(msg){ console.log(msg) }
function lineLen(s){ return String(s||'').replace(/\x1b\[[0-9;]*m/g,'').length }
function padRight(s, n){ const len=lineLen(s); return s + ' '.repeat(Math.max(0, n-len)) }
function boxPrint(title, rows){
  const content = rows.filter(Boolean)
  let width = Math.max(lineLen(title||''), ...content.map(lineLen))
  width = Math.min(Math.max(width, 28), 78)
  const top = '┌' + '─'.repeat(width + 2) + '┐'
  const mid = '├' + '─'.repeat(width + 2) + '┤'
  const bot = '└' + '─'.repeat(width + 2) + '┘'
  info(C.cyan(top))
  info(C.cyan('│ ') + C.bold(padRight(title||'', width)) + C.cyan(' │'))
  info(C.cyan(mid))
  for (const r of content){ info(C.cyan('│ ') + padRight(r, width) + C.cyan(' │')) }
  info(C.cyan(bot))
}
function prettyPairing(res){
  const code = String(res.code||'').trim()
  const codeFmt = code.length===6 ? code.slice(0,3)+' '+code.slice(3) : code
  const lines = [
    `${C.magenta('Pairing code')}: ${C.bold(C.yellow(codeFmt))}`,
    `${C.magenta('Installation')}: ${C.dim(res.installationId||'—')}`,
    `${C.magenta('Expires')}: ${new Date(res.expiresAt).toLocaleString()}`
  ]
  boxPrint('🔗 CodeSync Pairing', lines)
  info(C.dim('Next: Open the Figma plugin, click ') + C.bold('Link') + C.dim(' and paste the code.'))
}

async function cmd_link(args){
  const figma = args[0]
  if (figma) {
    const projectArg = (args.find(a => a.startsWith('--project=')) || '')
    const sourceArg = (args.find(a => a.startsWith('--source-of-truth=')) || '')
    const projectId = projectArg.split('=')[1] || 'proj_local'
    const sourceOfTruth = (sourceArg.split('=')[1] || 'code').toLowerCase()
    const figmaFileKey = extractFigmaKey(figma)
    const cfg = readConfig() || {}
    cfg.projectId = projectId
    cfg.figmaFileKey = figmaFileKey
    cfg.sourceOfTruth = (sourceOfTruth === 'figma') ? 'figma' : 'code'
    cfg.lastSync = cfg.lastSync || ''
    writeConfig(cfg)
    info(`✔ Linked to Figma file ${figmaFileKey} (project: ${projectId}, sourceOfTruth: ${cfg.sourceOfTruth})`)
  }
  const res = await pairStart()
  prettyPairing(res)
}

async function cmd_pair_start(){
  const res = await pairStart()
  prettyPairing(res)
}

async function cmd_pair_confirm(args){
  const code = args[0]
  if (!code) exit('Usage: codesync pair confirm <code>')
  const res = await pairConfirm(code)
  saveInstallation({ installationId: res.installationId, token: res.token })
  info('✔ Paired. Credentials saved to .codesync/installation.json')
}

function writeOutputs(ir, transformer){
  ensureDir(OUT_DIR)
  // W3C tokens
  const dt = transformer.toDesignTokens(ir)
  fs.writeFileSync(path.join(OUT_DIR, 'design-tokens.json'), JSON.stringify(dt, null, 2))
  // Flat tokens
  const flat = transformer.toFlatTokens(ir)
  fs.writeFileSync(path.join(OUT_DIR, 'tokens.flat.json'), JSON.stringify(flat, null, 2))
  // Tokens CSS
  const css = transformer.buildCssFromIR(ir)
  fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), css)
  // shadcn CSS
  const scss = transformer.buildShadcnCss(ir)
  fs.writeFileSync(path.join(OUT_DIR, 'shadcn.css'), scss)
  // Tailwind config extension
  const cfg = transformer.generateTailwindConfig(ir)
  fs.writeFileSync(path.join(OUT_DIR, 'tailwind.tokens.config.js'), cfg)
}

async function cmd_pull(args){
  const plan = args.includes('--plan')
  const cfg = readConfig() || {}
  if (!cfg.figmaFileKey) exit('Not linked. Run: codesync link <figma-url>')
  const inst = readInstallation()
  if (!inst) exit('Not paired. Run: codesync pair start -> enter code in plugin -> codesync pair confirm <code>')
  if (plan){ info('Plan: would fetch tokens and write outputs under public/snippets/'); return }
  const data = await tokensPull()
  const payload = data?.payload
  if (!payload) exit('No tokens available from server. Push from plugin first.')
  // Load transformer
  const { TokenTransformer } = require('../../plugins/figma-token-extractor/transformer.class.js')
  const transformer = new TokenTransformer()
  const ir = transformer.resolveAliases(transformer.buildIR(payload))
  writeOutputs(ir, transformer)
  ensureDir(STATE_DIR)
  fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify({ at: new Date().toISOString(), dir: 'figma->code' }, null, 2))
  info('✔ Tokens pulled and written to public/snippets')
}

async function cmd_push(args){
  const plan = args.includes('--plan')
  const inst = readInstallation()
  if (!inst) exit('Not paired. Run: codesync pair start/confirm flow')
  const input = path.join(OUT_DIR, 'design-tokens.json')
  if (!fs.existsSync(input)) exit('design-tokens.json not found under public/snippets. Generate or place it first.')
  const payload = JSON.parse(fs.readFileSync(input, 'utf8'))
  if (plan){ info('Plan: would push design-tokens.json to server for plugin to apply'); return }
  await tokensPush(payload)
  ensureDir(STATE_DIR)
  fs.writeFileSync(LAST_SYNC_PATH, JSON.stringify({ at: new Date().toISOString(), dir: 'code->figma' }, null, 2))
  info('✔ Tokens pushed to server')
}

async function main(){
  const [, , cmd, ...rest] = process.argv
  switch ((cmd||'').toLowerCase()){
    case 'link': return await cmd_link(rest)
    case 'pair':
      if ((rest[0]||'') === 'start') return await cmd_pair_start()
      if ((rest[0]||'') === 'confirm') return await cmd_pair_confirm(rest.slice(1))
      return exit('Usage: codesync pair start | codesync pair confirm <code>')
    case 'status':
      const cfg = readConfig(); const inst = readInstallation()
      info('CodeSync Status:')
      if (!cfg) info('  - Not linked (codesync.yml missing)')
      else {
        info(`  - projectId: ${cfg.projectId || '(unset)'}`)
        info(`  - figmaFileKey: ${cfg.figmaFileKey || '(unset)'}`)
        info(`  - sourceOfTruth: ${cfg.sourceOfTruth || '(unset)'}`)
        info(`  - lastSync: ${cfg.lastSync || '(unset)'}`)
      }
      info(`  - paired: ${inst ? 'yes' : 'no'}`)
      return
    case 'pull':
      if ((rest[0]||'') === 'tokens') return await cmd_pull(rest.slice(1))
      return exit('Usage: codesync pull tokens [--plan]')
    case 'push':
      if ((rest[0]||'') === 'tokens') return await cmd_push(rest.slice(1))
      return exit('Usage: codesync push tokens [--plan]')
    default:
      info('CodeSync CLI')
      info('Usage:')
      info('  codesync link [<figma-url-or-key>] [--project=<id>] [--source-of-truth=code|figma]')
      info('  codesync pair start | codesync pair confirm <code>')
      info('  codesync status')
      info('  codesync pull tokens [--plan]')
      info('  codesync push tokens [--plan]')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
