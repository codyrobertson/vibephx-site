/**
 * TokenTransformer: class-based transformer with configurable rules and caching
 * JSDoc types approximate TS for runtime use in the plugin UI.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.TokenTransformer = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  /** @typedef {{ id:string, name:string }} Mode */
  /** @typedef {{ id:string, name:string, defaultModeId?:string, modes: Mode[] }} Collection */
  /** @typedef {{ id:string, name:string, description?:string, variableCollectionId?:string, resolvedType:string, scopes?:string[], valuesByMode: Record<string, any> }} Variable */
  /** @typedef {{ variables?: { collections?: Collection[], variables?: Variable[] }, styles?: any }} Extract */
  /** @typedef {{ test:RegExp, category:string, tailwindKey?:string, prefix?:string, tokenName?:string }} CategoryRule */

  /** Default Tailwind-oriented category rules */
  const defaultTailwindCategoryRules = [
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
    { test: /^(max.*width)/, category: 'maxWidth', tailwindKey: 'maxWidth' },
  ]

  /** Naming options */
  /** @typedef {{ separator?: string, caseStyle?: 'kebab'|'camel'|'snake', prefix?: string, maxDepth?: number }} NamingOptions */

  /** @param {string} s @param {NamingOptions} options */
  function toSegments(s, options) {
    const opts = options || {}
    const sep = opts.separator || '.'
    const caseStyle = opts.caseStyle || 'kebab'
    const prefix = opts.prefix || ''
    const maxDepth = typeof opts.maxDepth === 'number' ? opts.maxDepth : 8

    const norm = String(s || '')
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

    // Apply casing
    parts = parts.map(p => {
      const low = p.toLowerCase()
      if (caseStyle === 'kebab') return low.replace(/_/g, '-').replace(/-+/g, '-')
      if (caseStyle === 'snake') return low.replace(/-/g, '_').replace(/_+/g, '_')
      if (caseStyle === 'camel') return low.replace(/[-_]+([a-z0-9])/g, (_, c) => c.toUpperCase())
      return low
    })

    if (prefix) parts.unshift(prefix)
    return parts
  }

  function colorToRgbTuple(val){
    if (!val || typeof val !== 'object') return null
    const has = (k) => Object.prototype.hasOwnProperty.call(val, k)
    if (has('r') && has('g') && has('b')){
      const r = Math.round((val.r || 0) * 255)
      const g = Math.round((val.g || 0) * 255)
      const b = Math.round((val.b || 0) * 255)
      return [r,g,b]
    }
    return null
  }

  function aliasRef(value){
    return value && typeof value === 'object' && value.aliasTo ? { aliasTo: value.aliasTo, aliasToName: value.aliasToName || null } : null
  }

  function toCssVarName(category, parts){
    const segs = parts.slice()
    if (segs[0] === category) segs.shift()
    const base = [category].concat(segs).filter(Boolean).join('-')
    return '--' + base
  }

  class TokenTransformer {
    /**
     * @param {{ categoryRules?: CategoryRule[], naming?: NamingOptions }} options
     */
    constructor(options){
      this.options = options || {}
      this.categoryRules = (this.options.categoryRules || []).concat(defaultTailwindCategoryRules)
      // caches
      this._compiled = new Map() // rule regex cache not needed but keep
    }

    /** @param {Extract} extract */
    buildIR(extract){
      const ir = {
        meta: { source: 'figma', timestamp: new Date().toISOString() },
        collections: {},
        tokens: [],
        categories: { color: [], spacing: [], radius: [], opacity: [], number: [], string: [], fontFamily: [], fontSize: [], fontWeight: [], lineHeight: [], effect: [], shadow: [], blur: [], width: [], height: [], maxWidth: [] },
        styles: extract?.styles || {}
      }
      if (!extract || !extract.variables) return ir

      const collections = extract.variables.collections || []
      const variables = extract.variables.variables || []

      const collDefaultMode = new Map()
      for (const c of collections){
        ir.collections[c.id] = { id: c.id, name: c.name, defaultModeId: c.defaultModeId, modes: (c.modes||[]).map(m=>({ id: m.id||m.modeId||m, name: m.name||String(m.id||m) })) }
        collDefaultMode.set(c.id, c.defaultModeId || ((c.modes && c.modes[0] && c.modes[0].id) || null))
      }

      for (const v of variables){
        const parts = toSegments(v.name, this.options.naming)
        const catInfo = this._guessCategory(v.resolvedType, parts)
        const category = catInfo.category
        const cssVar = toCssVarName(category, parts)
        const token = {
          id: v.id,
          rawName: v.name,
          name: parts.join('.'),
          category,
          categoryInfo: catInfo,
          cssVar,
          collectionId: v.variableCollectionId,
          scopes: Array.isArray(v.scopes)? v.scopes.slice():[],
          description: v.description || '',
          resolvedType: v.resolvedType,
          modes: Object.create(null)
        }
        const valuesByMode = v.valuesByMode || {}
        for (const modeId of Object.keys(valuesByMode)){
          const value = valuesByMode[modeId]
          const a = aliasRef(value)
          if (a){ token.modes[modeId] = { aliasTo: a.aliasTo, aliasToName: a.aliasToName } }
          else {
            if (category === 'color'){
              const rgb = colorToRgbTuple(value)
              token.modes[modeId] = rgb ? { rgb, asCssRgb: rgb.join(' ') } : { value }
            } else if (category === 'opacity'){
              const n = typeof value === 'number' ? value : Number(value)
              token.modes[modeId] = isFinite(n) ? { number: n } : { value }
            } else if (category === 'radius' || category === 'spacing' || category === 'number' || category === 'fontSize' || category === 'lineHeight'){
              const n = typeof value === 'number' ? value : Number(value)
              token.modes[modeId] = isFinite(n) ? { number: n, px: n + 'px' } : { value }
            } else if (category === 'string' || category === 'fontFamily'){
              token.modes[modeId] = { string: String(value) }
            } else {
              token.modes[modeId] = { value }
            }
          }
        }
        ir.tokens.push(token)
        if (ir.categories[category]) ir.categories[category].push(token)
      }

      return ir
    }

    /** @param {string} resolvedType @param {string[]} parts */
    _guessCategory(resolvedType, parts){
      const joined = parts.join('-')
      for (const rule of this.categoryRules){
        if (rule.test.test(joined)){
          return { category: rule.category, tailwindKey: rule.tailwindKey || null, tokenName: rule.tokenName || parts[parts.length-1] }
        }
      }
      // default fallback
      if (resolvedType === 'COLOR') return { category: 'color' }
      if (resolvedType === 'FLOAT'){
        if (/radius|radii|corner|round/.test(joined)) return { category: 'radius' }
        if (/(^|-)spacing|space|gap|padding|margin/.test(joined)) return { category: 'spacing' }
        if (/(^|-)size|text-size|font-size/.test(joined)) return { category: 'fontSize' }
        if (/opacity|alpha/.test(joined)) return { category: 'opacity' }
        if (/shadow|elevation|blur/.test(joined)) return { category: 'effect' }
        return { category: 'number' }
      }
      if (resolvedType === 'STRING'){
        if (/font|family|typeface/.test(joined)) return { category: 'fontFamily' }
        if (/(^|-)size|text-size|font-size/.test(joined)) return { category: 'fontSize' }
        return { category: 'string' }
      }
      return { category: (resolvedType || 'unknown').toLowerCase() }
    }

    /** Resolve alias chains per mode and cache lookups */
    resolveAliases(ir){
      const byId = new Map(ir.tokens.map(t => [t.id, t]))
      const defaultMode = new Map(Object.keys(ir.collections).map(id => {
        const c = ir.collections[id]
        return [id, c.defaultModeId || (c.modes && c.modes[0] && c.modes[0].id) || null]
      }))

      function resolveForMode(token, modeId, seen){
        const stack = seen || new Set()
        if (stack.has(token.id)) return null
        stack.add(token.id)
        const collDefault = defaultMode.get(token.collectionId)
        let mv = token.modes[modeId] || (collDefault ? token.modes[collDefault] : undefined)
        if (!mv) return null
        if (mv.aliasTo){
          const target = byId.get(mv.aliasTo)
          if (!target) return null
          return resolveForMode(target, modeId, stack)
        }
        return mv
      }

      for (const t of ir.tokens){
        const coll = ir.collections[t.collectionId]
        const modes = (coll?.modes || []).map(m => m.id)
        t.resolved = Object.create(null)
        for (const modeId of modes){
          const r = resolveForMode(t, modeId)
          if (r) t.resolved[modeId] = r
        }
      }
      return ir
    }

    /** Build CSS variables output from IR (uses resolved values when present) */
    buildCssFromIR(ir){
      const lines = []
      lines.push('/* Generated tokens from IR */')
      const collections = ir.collections || {}
      const colIds = Object.keys(collections)
      lines.push(':root {')
      for (const t of ir.tokens){
        const coll = collections[t.collectionId]
        const modeId = coll ? (coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id)) : undefined
        if (!modeId) continue
        const mv = (t.resolved && t.resolved[modeId]) || t.modes[modeId]
        if (!mv) continue
        if (t.category === 'color' && (mv.asCssRgb || mv.rgb)){
          const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? mv.rgb.join(' ') : null)
          if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
        } else if (mv.px){ lines.push(`  ${t.cssVar}: ${mv.px};`) }
        else if (typeof mv.number === 'number'){ lines.push(`  ${t.cssVar}: ${mv.number};`) }
        else if (mv.string){ lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`) }
      }
      lines.push('}')

      for (const collId of colIds){
        const coll = collections[collId]
        const modes = coll?.modes || []
        for (const m of modes){
          const sel = `[data-theme="${(coll.name||'collection').toLowerCase()}:${(m.name||m.id).toLowerCase()}"]`
          lines.push(`${sel} {`)
          for (const t of ir.tokens.filter(x => x.collectionId===collId)){
            const mv = (t.resolved && t.resolved[m.id]) || t.modes[m.id] || t.modes[m.modeId]
            if (!mv) continue
            if (t.category === 'color' && (mv.asCssRgb || mv.rgb)){
              const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? mv.rgb.join(' ') : null)
              if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
            } else if (mv.px){ lines.push(`  ${t.cssVar}: ${mv.px};`) }
            else if (typeof mv.number === 'number'){ lines.push(`  ${t.cssVar}: ${mv.number};`) }
            else if (mv.string){ lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`) }
          }
          lines.push('}')
        }
      }
      return lines.join('\n')
    }

    /**
     * @param {Record<string, any>} obj
     * @param {string[]} pathArr
     * @param {any} value
     */
    static setDeep(obj, pathArr, value){
      let cur = obj
      for (let i=0;i<pathArr.length;i++){
        const k = pathArr[i]
        if (i === pathArr.length - 1){ cur[k] = value; return }
        if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}
        cur = cur[k]
      }
    }

    /**
     * Generate Tailwind config from IR. Respects categoryRules tailwindKey when present.
     */
    generateTailwindConfig(ir, options){
      const opts = Object.assign({ useSemanticNames: true, flattenNesting: false, includeRawValues: false }, options)
      const config = { theme: { extend: {} } }

      const byKey = Object.create(null)
      for (const t of ir.tokens){
        const key = t.categoryInfo && t.categoryInfo.tailwindKey
        if (!key) continue
        if (!byKey[key]) byKey[key] = []
        byKey[key].push(t)
      }

      for (const key of Object.keys(byKey)){
        config.theme.extend[key] = this._buildTailwindSection(ir, byKey[key], opts)
      }

      return config
    }

    _buildTailwindSection(ir, tokens, options){
      const section = {}
      for (const t of tokens){
        const keyPath = this._getTailwindKeyPath(t, options)
        const value = this._getTailwindValue(ir, t, options)
        if (options.flattenNesting) section[keyPath.join('-')] = value
        else TokenTransformer.setDeep(section, keyPath, value)
      }
      return section
    }

    _getTailwindKeyPath(token, options){
      const parts = token.name.split('.')
      const category = token.category
      const key = (token.categoryInfo && token.categoryInfo.tailwindKey) || ''
      const keyKebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const out = parts.slice()
      if (out[0] === category || out[0] === keyKebab) out.shift()
      if (options && options.useSemanticNames){
        return out.map(p => this._mapSemantic(p, key))
      }
      return out
    }

    _mapSemantic(p, tailwindKey){
      const mapping = {
        colors: { neutral: 'gray', success: 'green', warning: 'yellow', error: 'red', info: 'blue' },
        spacing: { xs: '1', sm: '2', md: '4', lg: '8', xl: '16', '2xl': '32' },
        fontSize: { xs: 'xs', sm: 'sm', base: 'base', lg: 'lg', xl: 'xl', display: '6xl' }
      }
      const map = mapping[tailwindKey]
      return map && map[p] ? map[p] : p
    }

    _getTailwindValue(ir, token, options){
      const coll = ir.collections[token.collectionId]
      const modeId = coll ? (coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id)) : undefined
      const mv = modeId ? ((token.resolved && token.resolved[modeId]) || token.modes[modeId]) : null
      if (token.category === 'color'){
        return `rgb(var(${token.cssVar}) / <alpha-value>)`
      }
      if (mv && mv.px) return mv.px
      if (mv && typeof mv.number === 'number') return String(mv.number)
      if (mv && mv.string) return mv.string
      return token.cssVar
    }

    toFlatTokens(ir){
      return {
        meta: ir.meta,
        collections: ir.collections,
        tokens: ir.tokens.map(t => ({ id: t.id, name: t.name, category: t.category, cssVar: t.cssVar, collectionId: t.collectionId, description: t.description || '', modes: t.modes, resolved: t.resolved || {} }))
      }
    }

    buildShadcnCss(ir, mapping){
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
      function findTokenPath(path){
        const norm = String(path).toLowerCase()
        return ir.tokens.find(t => t.name.toLowerCase() === norm || t.name.toLowerCase().startsWith(norm + '.'))
      }
      const lines = []
      lines.push('/* shadcn/ui CSS variables mapped from IR */')
      lines.push(':root {')
      for (const key of Object.keys(map)){
        const t = findTokenPath(map[key])
        if (!t) continue
        if (key === 'radius') lines.push(`  --radius: var(${t.cssVar});`)
        else lines.push(`  --${key}: rgb(var(${t.cssVar}));`)
      }
      lines.push('}')
      for (const collId of Object.keys(ir.collections)){
        const coll = ir.collections[collId]
        for (const m of coll.modes || []){
          const sel = `[data-theme="${(coll.name||'collection').toLowerCase()}:${(m.name||m.id).toLowerCase()}"]`
          lines.push(`${sel} {`)
          for (const key of Object.keys(map)){
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

  return { TokenTransformer, toSegments }
})
