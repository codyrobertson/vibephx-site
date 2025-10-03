/*
  TokenTransformer (TypeScript)
  - Strict types, input validation, configurable category rules
  - Caching and memory-efficient structures
*/

export type Mode = { id: string; name: string }
export type Collection = { id: string; name: string; defaultModeId?: string; modes: Mode[] }
export type Variable = {
  id: string
  name: string
  description?: string
  variableCollectionId?: string
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | string
  scopes?: string[]
  valuesByMode: Record<string, any>
}
export type ExtractPayload = {
  variables?: { collections?: Collection[]; variables?: Variable[] }
  styles?: { effectStyles?: any[]; [k: string]: any }
}

export type CategoryRule = {
  test: RegExp
  category: string
  tailwindKey?: string
  prefix?: string
  tokenName?: string
}

export type NamingOptions = {
  separator?: string
  caseStyle?: 'kebab' | 'camel' | 'snake'
  prefix?: string
  maxDepth?: number
}

export type CategoryInfo = { category: string; tailwindKey?: string | null; tokenName?: string }

export type IRTokenMode = {
  aliasTo?: string
  aliasToName?: string | null
  rgb?: [number, number, number]
  asCssRgb?: string
  number?: number
  px?: string
  string?: string
  value?: any
}

export type IRToken = {
  id: string
  rawName: string
  name: string
  category: string
  categoryInfo?: CategoryInfo
  cssVar: string
  collectionId?: string
  scopes: string[]
  description: string
  resolvedType: string
  modes: Record<string, IRTokenMode>
  resolved?: Record<string, IRTokenMode>
}

export type IR = {
  meta: { source: string; timestamp: string }
  collections: Record<string, { id: string; name: string; defaultModeId?: string; modes: Mode[] }>
  tokens: IRToken[]
  categories: Record<string, IRToken[]>
  styles: ExtractPayload['styles']
}

export type TailwindGenOptions = {
  useSemanticNames?: boolean
  flattenNesting?: boolean
  includeRawValues?: boolean
}

export const defaultTailwindCategoryRules: CategoryRule[] = [
  { test: /^(bg|background)/, category: 'color', tailwindKey: 'colors' },
  { test: /^(text|foreground)/, category: 'color', tailwindKey: 'colors' },
  { test: /^(border)/, category: 'color', tailwindKey: 'colors' },
  { test: /^(ring)/, category: 'color', tailwindKey: 'colors' },
  { test: /^(spacing|space|gap)/, category: 'spacing', tailwindKey: 'spacing' },
  { test: /^(padding|p)/, category: 'spacing', tailwindKey: 'spacing' },
  { test: /^(margin|m)/, category: 'spacing', tailwindKey: 'spacing' },
  { test: /^(radius|rounded|corner)/, category: 'radius', tailwindKey: 'borderRadius' },
  { test: /^(font.*family|typeface)/, category: 'fontFamily', tailwindKey: 'fontFamily' },
  { test: /^(font.*size|text.*size|size\b)/, category: 'fontSize', tailwindKey: 'fontSize' },
  { test: /^(font.*weight)/, category: 'fontWeight', tailwindKey: 'fontWeight' },
  { test: /^(line.*height|leading)/, category: 'lineHeight', tailwindKey: 'lineHeight' },
  { test: /^(shadow|elevation)/, category: 'shadow', tailwindKey: 'boxShadow' },
  { test: /^(blur)/, category: 'blur', tailwindKey: 'blur' },
  { test: /^(width|w)/, category: 'width', tailwindKey: 'width' },
  { test: /^(height|h)/, category: 'height', tailwindKey: 'height' },
  { test: /^(max.*width)/, category: 'maxWidth', tailwindKey: 'maxWidth' }
]

/**
 * Split a token name into normalized segments.
 * - separator: path separator to split on (default '.')
 * - caseStyle: kebab | camel | snake
 * - prefix: optional leading segment to prepend
 * - maxDepth: collapse beyond this depth by joining tail with '-'
 */
export function toSegments(name: string, options: NamingOptions = {}): string[] {
  const sep = options.separator ?? '.'
  const caseStyle = options.caseStyle ?? 'kebab'
  const prefix = options.prefix ?? ''
  const maxDepth = typeof options.maxDepth === 'number' ? options.maxDepth : 8

  const norm = String(name || '')
    .trim()
    .replace(/[\\/]+/g, sep)
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_\-\.]+/g, '-')
    .replace(new RegExp('[' + sep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ']{2,}', 'g'), sep)
    .replace(/-+/g, '-')

  let parts = norm.split(sep).filter(Boolean)
  if (maxDepth > 0 && parts.length > maxDepth) {
    const head = parts.slice(0, maxDepth - 1)
    const tail = parts.slice(maxDepth - 1).join('-')
    parts = head.concat(tail)
  }
  parts = parts.map((p) => {
    const low = p.toLowerCase()
    if (caseStyle === 'kebab') return low.replace(/_/g, '-').replace(/-+/g, '-')
    if (caseStyle === 'snake') return low.replace(/-/g, '_').replace(/_+/g, '_')
    if (caseStyle === 'camel') return low.replace(/[-_]+([a-z0-9])/g, (_, c) => String(c).toUpperCase())
    return low
  })
  if (prefix) parts.unshift(prefix)
  return parts
}

function colorToRgbTuple(val: any): [number, number, number] | null {
  if (!val || typeof val !== 'object') return null
  if ('r' in val && 'g' in val && 'b' in val) {
    const r = Math.round((val.r || 0) * 255)
    const g = Math.round((val.g || 0) * 255)
    const b = Math.round((val.b || 0) * 255)
    return [r, g, b]
  }
  return null
}

function aliasRef(value: any): { aliasTo: string; aliasToName: string | null } | null {
  return value && typeof value === 'object' && typeof value.aliasTo === 'string'
    ? { aliasTo: value.aliasTo, aliasToName: value.aliasToName || null }
    : null
}

function toCssVarName(category: string, parts: string[]): string {
  const segs = parts.slice()
  if (segs[0] === category) segs.shift()
  const base = [category].concat(segs).filter(Boolean).join('-')
  return '--' + base
}

/**
 * TokenTransformer
 * - Builds an intermediate representation (IR) from Figma extract
 * - Resolves alias chains per-mode
 * - Generates Tailwind config, CSS variable outputs, shadcn CSS, flat tokens, W3C tokens
 * - Configurable category rules to optimize Tailwind section mapping
 */
export class TokenTransformer {
  private categoryRules: CategoryRule[]
  private naming: NamingOptions
  private cacheSegs = new Map<string, string[]>()

  constructor(options?: { categoryRules?: CategoryRule[]; naming?: NamingOptions }) {
    this.categoryRules = [...(options?.categoryRules || []), ...defaultTailwindCategoryRules]
    this.naming = options?.naming || {}
  }

  private guessCategory(resolvedType: string, parts: string[]): CategoryInfo {
    const joined = parts.join('-')
    for (const rule of this.categoryRules) {
      if (rule.test.test(joined)) {
        return { category: rule.category, tailwindKey: rule.tailwindKey || null, tokenName: rule.tokenName || parts[parts.length - 1] }
      }
    }
    if (resolvedType === 'COLOR') return { category: 'color', tailwindKey: 'colors' }
    if (resolvedType === 'FLOAT') {
      if (/radius|radii|corner|round/.test(joined)) return { category: 'radius' }
      if (/(^|-)spacing|space|gap|padding|margin/.test(joined)) return { category: 'spacing' }
      if (/(^|-)size|text-size|font-size/.test(joined)) return { category: 'fontSize' }
      if (/opacity|alpha/.test(joined)) return { category: 'opacity' }
      if (/shadow|elevation|blur/.test(joined)) return { category: 'effect' }
      return { category: 'number' }
    }
    if (resolvedType === 'STRING') {
      if (/font|family|typeface/.test(joined)) return { category: 'fontFamily' }
      if (/(^|-)size|text-size|font-size/.test(joined)) return { category: 'fontSize' }
      return { category: 'string' }
    }
    return { category: (resolvedType || 'unknown').toLowerCase() }
  }

  private segs(name: string): string[] {
    const key = name + '|' + JSON.stringify(this.naming)
    const cached = this.cacheSegs.get(key)
    if (cached) return cached
    const segs = toSegments(name, this.naming)
    this.cacheSegs.set(key, segs)
    return segs
  }

  buildIR(extract?: ExtractPayload): IR {
    const ir: IR = {
      meta: { source: 'figma', timestamp: new Date().toISOString() },
      collections: Object.create(null),
      tokens: [],
      categories: Object.create(null) as Record<string, IRToken[]>,
      styles: extract?.styles || {}
    }

    const collections = extract?.variables?.collections || []
    const variables = extract?.variables?.variables || []

    for (const c of collections) {
      ir.collections[c.id] = {
        id: c.id,
        name: c.name,
        defaultModeId: c.defaultModeId,
        modes: (c.modes || []).map((m) => ({ id: (m as any).id || (m as any).modeId || (m as any), name: (m as any).name || String((m as any).id || m) }))
      }
    }

    for (const v of variables) {
      const parts = this.segs(v.name)
      const catInfo = this.guessCategory(v.resolvedType, parts)
      const cssVar = toCssVarName(catInfo.category, parts)
      const token: IRToken = {
        id: v.id,
        rawName: v.name,
        name: parts.join('.'),
        category: catInfo.category,
        categoryInfo: catInfo,
        cssVar,
        collectionId: v.variableCollectionId,
        scopes: Array.isArray(v.scopes) ? v.scopes.slice() : [],
        description: v.description || '',
        resolvedType: v.resolvedType,
        modes: Object.create(null)
      }
      const valuesByMode = v.valuesByMode || {}
      for (const modeId of Object.keys(valuesByMode)) {
        const value = (valuesByMode as any)[modeId]
        const a = aliasRef(value)
        if (a) token.modes[modeId] = { aliasTo: a.aliasTo, aliasToName: a.aliasToName }
        else if (catInfo.category === 'color') {
          const rgb = colorToRgbTuple(value)
          token.modes[modeId] = rgb ? { rgb, asCssRgb: rgb.join(' ') } : { value }
        } else if (catInfo.category === 'opacity') {
          const n = typeof value === 'number' ? value : Number(value)
          token.modes[modeId] = Number.isFinite(n) ? { number: n } : { value }
        } else if (['radius', 'spacing', 'number', 'fontSize', 'lineHeight'].includes(catInfo.category)) {
          const n = typeof value === 'number' ? value : Number(value)
          token.modes[modeId] = Number.isFinite(n) ? { number: n, px: n + 'px' } : { value }
        } else if (['string', 'fontFamily'].includes(catInfo.category)) {
          token.modes[modeId] = { string: String(value) }
        } else {
          token.modes[modeId] = { value }
        }
      }
      ir.tokens.push(token)
      if (!ir.categories[token.category]) ir.categories[token.category] = []
      ir.categories[token.category].push(token)
    }

    return ir
  }

  resolveAliases(ir: IR): IR {
    const byId = new Map<string, IRToken>(ir.tokens.map((t) => [t.id, t]))
    const defaultMode = new Map<string, string | null>(Object.keys(ir.collections).map((id) => {
      const c = ir.collections[id]
      return [id, c.defaultModeId || (c.modes && c.modes[0] && c.modes[0].id) || null]
    }))

    const resolveForMode = (token: IRToken, modeId: string, seen?: Set<string>): IRTokenMode | null => {
      const stack = seen || new Set<string>()
      if (stack.has(token.id)) return null
      stack.add(token.id)
      const collDefault = defaultMode.get(token.collectionId || '') || undefined
      let mv = token.modes[modeId] || (collDefault ? token.modes[collDefault] : undefined)
      if (!mv) return null
      if (mv.aliasTo) {
        const target = byId.get(mv.aliasTo)
        if (!target) return null
        return resolveForMode(target, modeId, stack)
      }
      return mv
    }

    for (const t of ir.tokens) {
      const coll = t.collectionId ? ir.collections[t.collectionId] : undefined
      const modes = (coll?.modes || []).map((m) => m.id)
      t.resolved = Object.create(null)
      for (const modeId of modes) {
        const r = resolveForMode(t, modeId)
        if (r) t.resolved[modeId] = r
      }
    }
    return ir
  }

  private setDeep(obj: Record<string, any>, pathArr: string[], value: any) {
    let cur = obj
    for (let i = 0; i < pathArr.length; i++) {
      const k = pathArr[i]
      if (i === pathArr.length - 1) {
        cur[k] = value
        return
      }
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = Object.create(null)
      cur = cur[k]
    }
  }

  private mapSemantic(p: string, tailwindKey?: string | null): string {
    const mapping: Record<string, Record<string, string>> = {
      colors: { neutral: 'gray', success: 'green', warning: 'yellow', error: 'red', info: 'blue' },
      spacing: { xs: '1', sm: '2', md: '4', lg: '8', xl: '16', '2xl': '32' },
      fontSize: { xs: 'xs', sm: 'sm', base: 'base', lg: 'lg', xl: 'xl', display: '6xl' }
    }
    const map = tailwindKey ? mapping[tailwindKey] : undefined
    return map && map[p] ? map[p] : p
  }

  private getTailwindKeyPath(token: IRToken, options: TailwindGenOptions): string[] {
    const parts = token.name.split('.')
    const key = token.categoryInfo?.tailwindKey || ''
    const keyKebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    const out = parts.slice()
    if (out[0] === token.category || out[0] === keyKebab) out.shift()
    return options.useSemanticNames ? out.map((p) => this.mapSemantic(p, key)) : out
  }

  private getTailwindValue(ir: IR, token: IRToken): string {
    const coll = token.collectionId ? ir.collections[token.collectionId] : undefined
    const modeId = coll ? coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id) : undefined
    const mv = modeId ? token.resolved?.[modeId] || token.modes[modeId] : undefined
    if (token.category === 'color') return `rgb(var(${token.cssVar}) / <alpha-value>)`
    if (mv?.px) return mv.px
    if (typeof mv?.number === 'number') return String(mv.number)
    if (mv?.string) return mv.string
    return `var(${token.cssVar})`
  }

  generateTailwindConfig(ir: IR, options: TailwindGenOptions = {}): any {
    const opts: TailwindGenOptions = { useSemanticNames: true, flattenNesting: false, includeRawValues: false, ...options }
    const config: any = { theme: { extend: {} } }
    const byKey: Record<string, IRToken[]> = Object.create(null)
    for (const t of ir.tokens) {
      const key = t.categoryInfo?.tailwindKey
      if (!key) continue
      ;(byKey[key] || (byKey[key] = [])).push(t)
    }
    for (const key of Object.keys(byKey)) {
      const section: Record<string, any> = Object.create(null)
      for (const t of byKey[key]) {
        const path = this.getTailwindKeyPath(t, opts)
        const val = this.getTailwindValue(ir, t)
        if (opts.flattenNesting) section[path.join('-')] = val
        else this.setDeep(section, path, val)
      }
      config.theme.extend[key] = section
    }
    return config
  }

  buildCssFromIR(ir: IR): string {
    const lines: string[] = []
    lines.push('/* Generated tokens from IR */')
    lines.push(':root {')
    for (const t of ir.tokens) {
      const coll = t.collectionId ? ir.collections[t.collectionId] : undefined
      const modeId = coll ? coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id) : undefined
      const mv = modeId ? t.resolved?.[modeId] || t.modes[modeId] : undefined
      if (!mv) continue
      if (t.category === 'color' && (mv.asCssRgb || mv.rgb)) {
        const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? (mv.rgb as number[]).join(' ') : null)
        if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
      } else if (mv.px) lines.push(`  ${t.cssVar}: ${mv.px};`)
      else if (typeof mv.number === 'number') lines.push(`  ${t.cssVar}: ${mv.number};`)
      else if (mv.string) lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`)
    }
    lines.push('}')

    for (const collId of Object.keys(ir.collections)) {
      const coll = ir.collections[collId]
      for (const m of coll.modes || []) {
        const sel = `[data-theme="${(coll.name || 'collection').toLowerCase()}:${(m.name || m.id).toLowerCase()}"]`
        lines.push(`${sel} {`)
        for (const t of ir.tokens.filter((x) => x.collectionId === collId)) {
          const mv = t.resolved?.[m.id] || t.modes[m.id as any]
          if (!mv) continue
          if (t.category === 'color' && (mv.asCssRgb || mv.rgb)) {
            const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? (mv.rgb as number[]).join(' ') : null)
            if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
          } else if (mv.px) lines.push(`  ${t.cssVar}: ${mv.px};`)
          else if (typeof mv.number === 'number') lines.push(`  ${t.cssVar}: ${mv.number};`)
          else if (mv.string) lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`)
        }
        lines.push('}')
      }
    }

    return lines.join('\n')
  }

  toFlatTokens(ir: IR) {
    return {
      meta: ir.meta,
      collections: ir.collections,
      tokens: ir.tokens.map((t) => ({ id: t.id, name: t.name, category: t.category, cssVar: t.cssVar, collectionId: t.collectionId, description: t.description || '', modes: t.modes, resolved: t.resolved || {} }))
    }
  }

  toDesignTokens(ir: IR) {
    const out: Record<string, any> = {}
    for (const t of ir.tokens) {
      const path = t.name
      const coll = t.collectionId ? ir.collections[t.collectionId] : undefined
      const modeId = coll ? coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id) : undefined
      const mv = modeId ? t.resolved?.[modeId] || t.modes[modeId] : undefined
      let value: any = `var(${t.cssVar})`
      if (t.category === 'color') value = `rgb(var(${t.cssVar}))`
      else if (mv?.px) value = mv.px
      else if (typeof mv?.number === 'number') value = mv.number
      else if (mv?.string) value = mv.string
      out[path] = { $value: value, $type: t.category }
    }
    return { $schema: 'https://design-tokens.org/schemas/aliases.json', tokens: out }
  }

  buildShadcnCss(ir: IR, mapping?: Record<string, string>): string {
    const map = mapping || {
      background: 'color.background',
      foreground: 'color.foreground',
      card: 'color.card',
      'card-foreground': 'color.card-foreground',
      popover: 'color.popover',
      'popover-foreground': 'color.popover-foreground',
      primary: 'color.primary',
      'primary-foreground': 'color.on-primary',
      secondary: 'color.secondary',
      'secondary-foreground': 'color.on-secondary',
      muted: 'color.muted',
      'muted-foreground': 'color.on-muted',
      accent: 'color.accent',
      'accent-foreground': 'color.on-accent',
      destructive: 'color.destructive',
      'destructive-foreground': 'color.on-destructive',
      border: 'color.border',
      input: 'color.input',
      ring: 'color.ring',
      radius: 'radius.md'
    }
    const findTokenPath = (path: string): IRToken | undefined => {
      const norm = String(path).toLowerCase()
      return ir.tokens.find((t) => t.name.toLowerCase() === norm || t.name.toLowerCase().startsWith(norm + '.'))
    }
    const lines: string[] = []
    lines.push('/* shadcn/ui CSS variables mapped from IR */')
    lines.push(':root {')
    for (const key of Object.keys(map)) {
      const t = findTokenPath(map[key])
      if (!t) continue
      if (key === 'radius') lines.push(`  --radius: var(${t.cssVar});`)
      else lines.push(`  --${key}: rgb(var(${t.cssVar}));`)
    }
    lines.push('}')

    for (const collId of Object.keys(ir.collections)) {
      const coll = ir.collections[collId]
      for (const m of coll.modes || []) {
        const sel = `[data-theme="${(coll.name || 'collection').toLowerCase()}:${(m.name || m.id).toLowerCase()}"]`
        lines.push(`${sel} {`)
        for (const key of Object.keys(map)) {
          const t = findTokenPath(map[key])
          if (!t) continue
          if (key === 'radius') lines.push(`  --radius: var(${t.cssVar});`)
          else lines.push(`  --${key}: rgb(var(${t.cssVar}));`)
        }
        lines.push('}')
      }
    }

    return lines.join('\n')
  }
}
