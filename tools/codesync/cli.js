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
function info(msg){ console.log(msg) }
function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

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
  cfg.lastSync = cfg.lastSync || ''
  writeConfig(cfg)
  info(`✔ Linked to Figma file ${figmaFileKey} (project: ${projectId}, sourceOfTruth: ${cfg.sourceOfTruth})`)
}

async function cmd_pair_start(){
  const res = await pairStart()
  info(`Pairing code: ${res.code}`)
  info(`Installation ID (preview): ${res.installationId}`)
  info(`Expires: ${new Date(res.expiresAt).toLocaleString()}`)
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

function main(){
  const [, , cmd, ...rest] = process.argv
  switch ((cmd||'').toLowerCase()){
    case 'link': return cmd_link(rest)
    case 'pair':
      if ((rest[0]||'') === 'start') return cmd_pair_start()
      if ((rest[0]||'') === 'confirm') return cmd_pair_confirm(rest.slice(1))
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
      if ((rest[0]||'') === 'tokens') return cmd_pull(rest.slice(1))
      return exit('Usage: codesync pull tokens [--plan]')
    case 'push':
      if ((rest[0]||'') === 'tokens') return cmd_push(rest.slice(1))
      return exit('Usage: codesync push tokens [--plan]')
    default:
      info('CodeSync CLI')
      info('Usage:')
      info('  codesync link <figma-url-or-key> [--project=<id>] [--source-of-truth=code|figma]')
      info('  codesync pair start | codesync pair confirm <code>')
      info('  codesync status')
      info('  codesync pull tokens [--plan]')
      info('  codesync push tokens [--plan]')
  }
}

main()
