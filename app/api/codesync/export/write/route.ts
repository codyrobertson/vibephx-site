import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { auth, getTokens } from '@/lib/codesync-store'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Installation-Id, X-Access-Token')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: Request) {
  try {
    const installationId = req.headers.get('x-installation-id')
    const token = req.headers.get('x-access-token')
    if (!auth(installationId, token)) {
      return cors(NextResponse.json({ error: 'unauthorized' }, { status: 401 }))
    }

    let body: any = null
    try { body = await req.json() } catch {}
    const outDirRel = (body?.outDir && typeof body.outDir === 'string') ? body.outDir : 'public/snippets'
    const payload = (body && body.payload) ? body.payload : getTokens(installationId!)
    if (!payload || typeof payload !== 'object') {
      return cors(NextResponse.json({ error: 'no_payload' }, { status: 400 }))
    }

    const ROOT = process.cwd()
    const dest = path.resolve(ROOT, outDirRel)
    fs.mkdirSync(dest, { recursive: true })

    // Load transformer from repo
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TokenTransformer } = require(path.join(ROOT, 'plugins', 'figma-token-extractor', 'transformer.class.js'))
    const transformer = new TokenTransformer()
    const ir = transformer.resolveAliases(transformer.buildIR(payload))

    const written: string[] = []

    // W3C tokens
    const dt = transformer.toDesignTokens(ir)
    fs.writeFileSync(path.join(dest, 'design-tokens.json'), JSON.stringify(dt, null, 2))
    written.push(path.join(outDirRel, 'design-tokens.json'))

    // Flat tokens
    const flat = transformer.toFlatTokens(ir)
    fs.writeFileSync(path.join(dest, 'tokens.flat.json'), JSON.stringify(flat, null, 2))
    written.push(path.join(outDirRel, 'tokens.flat.json'))

    // Tokens CSS
    const css = transformer.buildCssFromIR(ir)
    fs.writeFileSync(path.join(dest, 'tokens.css'), css)
    written.push(path.join(outDirRel, 'tokens.css'))

    // shadcn CSS
    const scss = transformer.buildShadcnCss(ir)
    fs.writeFileSync(path.join(dest, 'shadcn.css'), scss)
    written.push(path.join(outDirRel, 'shadcn.css'))

    // Tailwind config extension
    const cfg = transformer.generateTailwindConfig(ir)
    fs.writeFileSync(path.join(dest, 'tailwind.tokens.config.js'), cfg)
    written.push(path.join(outDirRel, 'tailwind.tokens.config.js'))

    return cors(NextResponse.json({ ok: true, dest: outDirRel, written }))
  } catch (e: any) {
    return cors(NextResponse.json({ error: e?.message || 'export_failed' }, { status: 500 }))
  }
}
