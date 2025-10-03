(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.Transformer = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function toSegments(name) {
    const s = String(name || '')
      .trim()
      .replace(/[\\/]+/g, '.')
      .replace(/\s+/g, '-')
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/\.+/g, '.')
      .replace(/-+/g, '-')
      .toLowerCase()
    const parts = s.split('.').filter(Boolean)
    return parts
  }

  function guessCategory(resolvedType, parts) {
    if (resolvedType === 'COLOR') return 'color'
    if (resolvedType === 'FLOAT') {
      const joined = parts.join('-')
      if (/radius|radii|round|corner/.test(joined)) return 'radius'
      if (/(^|-)spacing|space|gap|padding|margin/.test(joined)) return 'spacing'
      if (/(^|-)size|text-size|font-size/.test(joined)) return 'fontSize'
      if (/opacity|alpha/.test(joined)) return 'opacity'
      if (/shadow|elevation|blur/.test(joined)) return 'effect'
      return 'number'
    }
    if (resolvedType === 'STRING') {
      const joined = parts.join('-')
      if (/font|family|typeface/.test(joined)) return 'fontFamily'
      if (/(^|-)size|text-size|font-size/.test(joined)) return 'fontSize'
      return 'string'
    }
    return (resolvedType || 'unknown').toLowerCase()
  }

  function colorToRgbTuple(val) {
    if (!val || typeof val !== 'object') return null
    const has = (k) => Object.prototype.hasOwnProperty.call(val, k)
    if (has('r') && has('g') && has('b')) {
      const r = Math.round((val.r || 0) * 255)
      const g = Math.round((val.g || 0) * 255)
      const b = Math.round((val.b || 0) * 255)
      return [r, g, b]
    }
    return null
  }

  function colorToRgba(val) {
    if (!val || typeof val !== 'object') return null
    const rgb = colorToRgbTuple(val)
    const a = typeof val.a === 'number' ? val.a : (typeof val.opacity === 'number' ? val.opacity : 1)
    if (!rgb) return null
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.max(0, Math.min(1, a)).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')})`
  }

  function toCssVarName(category, parts) {
    const segs = parts.slice()
    if (segs[0] === category) segs.shift()
    const base = [category].concat(segs).filter(Boolean).join('-')
    return '--' + base
  }

  function aliasRef(value) {
    return value && typeof value === 'object' && value.aliasTo
      ? { aliasTo: value.aliasTo, aliasToName: value.aliasToName || null }
      : null
  }

  function buildIR(extract, options) {
    const opts = options || {}
    const ir = {
      meta: { source: 'figma', timestamp: new Date().toISOString() },
      collections: {},
      tokens: [],
      categories: { color: [], spacing: [], radius: [], opacity: [], number: [], string: [], fontFamily: [], fontSize: [], effect: [] },
      styles: extract?.styles || {}
    }
    if (!extract || !extract.variables) return ir

    const collections = extract.variables.collections || []
    const variables = extract.variables.variables || []

    const collectionById = {}
    for (const c of collections) {
      collectionById[c.id] = c
      ir.collections[c.id] = {
        id: c.id,
        name: c.name,
        defaultModeId: c.defaultModeId,
        modes: (c.modes || []).map((m) => ({ id: m.id || m.modeId || m, name: m.name || String(m.id || m) }))
      }
    }

    for (const v of variables) {
      const parts = toSegments(v.name)
      const category = (opts.categorize && opts.categorize({ variable: v, parts })) || guessCategory(v.resolvedType, parts)
      const cssVar = toCssVarName(category, parts)
      const token = {
        id: v.id,
        rawName: v.name,
        name: parts.join('.'),
        category,
        cssVar,
        collectionId: v.variableCollectionId,
        scopes: Array.isArray(v.scopes) ? v.scopes.slice() : [],
        description: v.description || '',
        resolvedType: v.resolvedType,
        modes: {}
      }
      const valuesByMode = v.valuesByMode || {}
      for (const modeId of Object.keys(valuesByMode)) {
        const value = valuesByMode[modeId]
        const a = aliasRef(value)
        if (a) {
          token.modes[modeId] = { aliasTo: a.aliasTo, aliasToName: a.aliasToName }
        } else {
          if (category === 'color') {
            const rgb = colorToRgbTuple(value)
            token.modes[modeId] = rgb ? { rgb, asCssRgb: rgb.join(' ') } : { value }
          } else if (category === 'opacity') {
            const n = typeof value === 'number' ? value : Number(value)
            token.modes[modeId] = isFinite(n) ? { number: n } : { value }
          } else if (category === 'radius' || category === 'spacing' || category === 'number' || category === 'fontSize') {
            const n = typeof value === 'number' ? value : Number(value)
            token.modes[modeId] = isFinite(n) ? { number: n, px: n + 'px' } : { value }
          } else if (category === 'string' || category === 'fontFamily') {
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

  function resolveAliases(ir) {
    const byId = {}
    for (const t of ir.tokens) byId[t.id] = t
    const defaultModeByCollection = {}
    for (const id of Object.keys(ir.collections)) {
      const c = ir.collections[id]
      defaultModeByCollection[id] = c.defaultModeId || (c.modes && c.modes[0] && c.modes[0].id) || null
    }

    function resolveForMode(token, modeId, stack) {
      const set = stack || new Set()
      if (set.has(token.id)) return null
      set.add(token.id)
      const collDefault = defaultModeByCollection[token.collectionId]
      let mv = token.modes[modeId] || (collDefault ? token.modes[collDefault] : undefined)
      if (!mv) return null
      if (mv.aliasTo) {
        const target = byId[mv.aliasTo]
        if (!target) return null
        return resolveForMode(target, modeId, set)
      }
      return mv
    }

    for (const t of ir.tokens) {
      const coll = ir.collections[t.collectionId]
      const modes = (coll?.modes || []).map((m) => m.id)
      t.resolved = {}
      for (const modeId of modes) {
        const r = resolveForMode(t, modeId)
        if (r) t.resolved[modeId] = r
      }
    }
    return ir
  }

  function buildCssFromIR(ir) {
    const lines = []
    lines.push('/* Generated tokens from Figma IR */')
    const collections = ir.collections || {}
    const colIds = Object.keys(collections)
    lines.push(':root {')
    for (const t of ir.tokens) {
      const coll = collections[t.collectionId]
      const modeId = coll ? coll.defaultModeId || (coll.modes && coll.modes[0] && coll.modes[0].id) : undefined
      if (!modeId) continue
      const mv = (t.resolved && t.resolved[modeId]) || t.modes[modeId]
      if (!mv) continue
      if (t.category === 'color' && (mv.asCssRgb || mv.rgb)) {
        const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? mv.rgb.join(' ') : null)
        if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
      } else if (mv.px) {
        lines.push(`  ${t.cssVar}: ${mv.px};`)
      } else if (typeof mv.number === 'number') {
        lines.push(`  ${t.cssVar}: ${mv.number};`)
      } else if (mv.string) {
        lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`)
      }
    }
    lines.push('}')

    for (const collId of colIds) {
      const coll = collections[collId]
      const modes = coll?.modes || []
      for (const m of modes) {
        const sel = `[data-theme="${(coll.name || 'collection').toLowerCase()}:${(m.name || m.id).toLowerCase()}"]`
        lines.push(`${sel} {`)
        for (const t of ir.tokens.filter((x) => x.collectionId === collId)) {
          const mv = (t.resolved && t.resolved[m.id]) || t.modes[m.id] || t.modes[m.modeId]
          if (!mv) continue
          if (t.category === 'color' && (mv.asCssRgb || mv.rgb)) {
            const rgb = mv.asCssRgb || (Array.isArray(mv.rgb) ? mv.rgb.join(' ') : null)
            if (rgb) lines.push(`  ${t.cssVar}: ${rgb};`)
          } else if (mv.px) {
            lines.push(`  ${t.cssVar}: ${mv.px};`)
          } else if (typeof mv.number === 'number') {
            lines.push(`  ${t.cssVar}: ${mv.number};`)
          } else if (mv.string) {
            lines.push(`  ${t.cssVar}: ${JSON.stringify(mv.string)};`)
          }
        }
        lines.push('}')
      }
    }

    return lines.join('\n')
  }

  function setDeep(obj, pathArr, value) {
    let cur = obj
    for (let i = 0; i < pathArr.length; i++) {
      const k = pathArr[i]
      if (i === pathArr.length - 1) {
        cur[k] = value
        return
      }
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}
      cur = cur[k]
    }
  }

  function parseFontFamily(str) {
    const arr = String(str || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return arr.length ? arr : [String(str || '')]
  }

  function effectsToBoxShadow(effectStyles) {
    const out = {}
    for (const s of effectStyles || []) {
      const parts = []
      for (const e of s.effects || []) {
        if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
          const ox = e.offset?.x || 0
          const oy = e.offset?.y || 0
          const blur = e.radius || 0
          const spread = e.spread || 0
          const col = colorToRgba(e.color)
          parts.push(`${ox}px ${oy}px ${blur}px ${spread}px ${col || 'rgba(0,0,0,0.25)'}`)
        }
      }
      if (parts.length) out[s.name] = parts.join(', ')
    }
    return out
  }

  function generateTailwindConfig(ir) {
    const colors = {}
    const spacing = {}
    const radius = {}
    const fontFamily = {}
    const fontSize = {}
    const boxShadow = effectsToBoxShadow(ir.styles?.effectStyles || [])

    for (const t of ir.categories.color || []) {
      const parts = t.name.split('.')
      if (parts[0] === 'color') parts.shift()
      const cssRef = `rgb(var(${t.cssVar}) / <alpha-value>)`
      setDeep(colors, parts, cssRef)
    }

    for (const t of ir.categories.spacing || []) {
      const key = t.name.split('.').slice(-1)[0]
      const coll = ir.collections[t.collectionId]
      const modeId = coll ? coll.defaultModeId || (coll.modes && (coll.modes[0] && coll.modes[0].id)) : undefined
      const mv = modeId ? (t.resolved?.[modeId] || t.modes[modeId]) : null
      const val = mv?.px || (typeof mv?.number === 'number' ? mv.number + 'px' : undefined)
      if (val) spacing[key] = val
    }

    for (const t of ir.categories.radius || []) {
      const key = t.name.split('.').slice(-1)[0]
      const coll = ir.collections[t.collectionId]
      const modeId = coll ? coll.defaultModeId || (coll.modes && (coll.modes[0] && coll.modes[0].id)) : undefined
      const mv = modeId ? (t.resolved?.[modeId] || t.modes[modeId]) : null
      const val = mv?.px || (typeof mv?.number === 'number' ? mv.number + 'px' : undefined)
      if (val) radius[key] = val
    }

    for (const t of ir.categories.fontFamily || []) {
      const key = t.name.split('.').slice(-1)[0]
      const coll = ir.collections[t.collectionId]
      const modeId = coll ? coll.defaultModeId || (coll.modes && (coll.modes[0] && coll.modes[0].id)) : undefined
      const mv = modeId ? (t.resolved?.[modeId] || t.modes[modeId]) : null
      const arr = mv?.string ? parseFontFamily(mv.string) : null
      if (arr) fontFamily[key] = arr
    }

    for (const t of ir.categories.fontSize || []) {
      const key = t.name.split('.').slice(-1)[0]
      const coll = ir.collections[t.collectionId]
      const modeId = coll ? coll.defaultModeId || (coll.modes && (coll.modes[0] && coll.modes[0].id)) : undefined
      const mv = modeId ? (t.resolved?.[modeId] || t.modes[modeId]) : null
      const val = mv?.px || (typeof mv?.number === 'number' ? mv.number + 'px' : undefined)
      if (val) fontSize[key] = val
    }

    const configObj = {
      theme: {
        extend: {
          colors,
          spacing,
          borderRadius: radius,
          fontFamily,
          fontSize,
          boxShadow
        }
      }
    }

    const config = `// Generated Tailwind v3 config extension from Figma IR\nmodule.exports = ${JSON.stringify(configObj, null, 2)}\n`
    return config
  }

  function toFlatTokens(ir) {
    const out = { meta: ir.meta, collections: ir.collections, tokens: [] }
    for (const t of ir.tokens) {
      out.tokens.push({
        id: t.id,
        name: t.name,
        category: t.category,
        cssVar: t.cssVar,
        collectionId: t.collectionId,
        description: t.description || '',
        modes: t.modes,
        resolved: t.resolved || {}
      })
    }
    return out
  }

  function buildShadcnCss(ir, mapping) {
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
    function findTokenPath(path) {
      const norm = String(path).toLowerCase()
      return ir.tokens.find((t) => t.name.toLowerCase() === norm || t.name.toLowerCase().startsWith(norm + '.'))
    }
    const lines = []
    lines.push('/* shadcn/ui CSS variables mapped from IR */')
    lines.push(':root {')
    for (const key of Object.keys(map)) {
      const t = findTokenPath(map[key])
      if (!t) continue
      if (key === 'radius') {
        lines.push(`  --radius: var(${t.cssVar});`)
      } else {
        lines.push(`  --${key}: rgb(var(${t.cssVar}));`)
      }
    }
    lines.push('}')
    // Theme variants per collection+mode
    for (const collId of Object.keys(ir.collections)) {
      const coll = ir.collections[collId]
      for (const m of coll.modes || []) {
        const sel = `[data-theme="${(coll.name || 'collection').toLowerCase()}:${(m.name || m.id).toLowerCase()}"]`
        lines.push(`${sel} {`)
        for (const key of Object.keys(map)) {
          const t = findTokenPath(map[key])
          if (!t) continue
          if (key === 'radius') {
            lines.push(`  --radius: var(${t.cssVar});`)
          } else {
            lines.push(`  --${key}: rgb(var(${t.cssVar}));`)
          }
        }
        lines.push('}')
      }
    }
    return lines.join('\n')
  }

  return {
    buildIR,
    resolveAliases,
    buildCssFromIR,
    generateTailwindConfig,
    toFlatTokens,
    buildShadcnCss,
    _internals: { toSegments, guessCategory, colorToRgbTuple }
  }
})
