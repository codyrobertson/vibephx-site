// Minimal Figma plugin to extract variables and styles

function isAlias(val) {
  return val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS' && typeof val.id === 'string'
}

function serializeCollection(c) {
  try {
    return {
      id: c.id,
      name: c.name,
      defaultModeId: c.defaultModeId,
      modes: (c.modes || []).map(m => ({ id: m.modeId, name: m.name }))
    }
  } catch (e) {
    return { id: c.id, name: c.name }
  }
}

function serializeVariable(v, nameById) {
  const out = {
    id: v.id,
    name: v.name,
    description: v.description || '',
    variableCollectionId: v.variableCollectionId,
    resolvedType: v.resolvedType,
    scopes: Array.isArray(v.scopes) ? v.scopes.slice() : [],
    valuesByMode: {}
  }
  try {
    const entries = Object.entries(v.valuesByMode || {})
    for (const [modeId, value] of entries) {
      if (isAlias(value)) {
        out.valuesByMode[modeId] = {
          aliasTo: value.id,
          aliasToName: nameById[value.id] || null
        }
      } else {
        out.valuesByMode[modeId] = value
      }
    }
  } catch (e) {
    // leave valuesByMode as empty object
  }
  return out
}

function serializePaintStyle(s) {
  return {
    id: s.id,
    key: s.key || null,
    name: s.name,
    description: s.description || '',
    paints: (s.paints || []).map(p => p)
  }
}

function serializeTextStyle(s) {
  const out = {
    id: s.id,
    key: s.key || null,
    name: s.name,
    description: s.description || '',
    fontName: s.fontName || null,
    fontSize: s.fontSize || null,
    lineHeight: s.lineHeight || null,
    letterSpacing: s.letterSpacing || null,
    paragraphSpacing: s.paragraphSpacing || null,
    paragraphIndent: s.paragraphIndent || null,
    textCase: s.textCase || null,
    textDecoration: s.textDecoration || null
  }
  return out
}

function serializeEffectStyle(s) {
  return {
    id: s.id,
    key: s.key || null,
    name: s.name,
    description: s.description || '',
    effects: (s.effects || []).map(e => e)
  }
}

function serializeGridStyle(s) {
  return {
    id: s.id,
    key: s.key || null,
    name: s.name,
    description: s.description || '',
    layoutGrids: (s.layoutGrids || []).map(g => g)
  }
}

async function extractAll() {
  const result = {
    meta: {
      plugin: 'tokens-tailwind-shadcn-extractor',
      version: 1,
      timestamp: new Date().toISOString()
    },
    variables: {
      supported: !!figma.variables,
      collections: [],
      variables: []
    },
    styles: {
      paintStyles: [],
      textStyles: [],
      effectStyles: [],
      gridStyles: []
    }
  }

  // Variables (if supported)
  if (figma.variables && typeof figma.variables.getLocalVariables === 'function') {
    try {
      const collections = figma.variables.getLocalVariableCollections()
      const variables = figma.variables.getLocalVariables()

      const nameById = {}
      for (const v of variables) nameById[v.id] = v.name

      result.variables.collections = collections.map(serializeCollection)
      result.variables.variables = variables.map(v => serializeVariable(v, nameById))
    } catch (e) {
      result.variables.error = String(e && e.message ? e.message : e)
    }
  }

  // Styles
  try {
    const paintStyles = figma.getLocalPaintStyles()
    result.styles.paintStyles = paintStyles.map(serializePaintStyle)
  } catch (e) {
    /* paintStyles error */
  }

  try {
    const textStyles = figma.getLocalTextStyles()
    result.styles.textStyles = textStyles.map(serializeTextStyle)
  } catch (e) {
    /* textStyles error */
  }

  try {
    const effectStyles = figma.getLocalEffectStyles()
    result.styles.effectStyles = effectStyles.map(serializeEffectStyle)
  } catch (e) {
    /* effectStyles error */
  }

  try {
    const gridStyles = figma.getLocalGridStyles()
    result.styles.gridStyles = gridStyles.map(serializeGridStyle)
  } catch (e) {
    /* gridStyles error */
  }

  return result
}

figma.showUI(__html__, { width: 900, height: 650 })

// Auto-extract on plugin run to validate message flow
try {
  figma.notify('Plugin ready')
  figma.on('run', async () => {
    try {
      figma.notify('Auto-extracting…')
      const payload = await extractAll()
      figma.ui["postMessage"]({ type: 'extracted', payload })
      figma.notify('Auto-extraction complete')
    } catch (e) {
      figma.notify('Auto-extract failed')
    }
  })
} catch (_) {}


async function getStored(key){ try { return await figma.clientStorage.getAsync(key) } catch (e) { return null } }
async function setStored(key, val){ try { await figma.clientStorage.setAsync(key, val); return true } catch (e) { return false } }
async function delStored(key){ try { await figma.clientStorage.deleteAsync(key); return true } catch (e) { return false } }

figma.ui.onmessage = async (msg) => {
  if (!msg || typeof msg !== 'object') return
  if (msg.type === 'extract') {
    figma.notify('Extracting variables and styles…')
    const payload = await extractAll()
    figma.ui["postMessage"]({ type: 'extracted', payload })
    figma.notify('Extraction complete')
  }
  if (msg.type === 'close') {
    figma.closePlugin()
  }
  if (msg.type === 'getCreds') {
    const creds = await getStored('codesync.install')
    figma.ui["postMessage"]({ type: 'creds', payload: creds || null })
  }
  if (msg.type === 'setCreds') {
    await setStored('codesync.install', msg.payload || null)
    figma.ui["postMessage"]({ type: 'creds', payload: msg.payload || null })
  }
  if (msg.type === 'clearCreds') {
    await delStored('codesync.install')
    figma.ui["postMessage"]({ type: 'creds', payload: null })
  }
  if (msg.type === 'getBase') {
    const base = await getStored('codesync.base')
    figma.ui["postMessage"]({ type: 'base', payload: base || null })
  }
  if (msg.type === 'setBase') {
    await setStored('codesync.base', msg.payload || null)
    figma.ui["postMessage"]({ type: 'base', payload: msg.payload || null })
  }
  if (msg.type === 'ping') {
    try { figma.ui["postMessage"]({ type: 'pong' }) } catch (e) {}
  }
  if (msg.type === 'applyDesignTokens') {
    // Stub: persist last pulled tokens for later application; show a notice
    await setStored('codesync.tokens.latest', msg.payload || null)
    figma.notify('Saved tokens for application (stub).')
  }
  if (msg.type === 'resize') {
    try {
      const w = Math.max(600, Math.min(1600, parseInt(msg.payload && msg.payload.width, 10) || 900))
      const h = Math.max(400, Math.min(1200, parseInt(msg.payload && msg.payload.height, 10) || 650))
      figma.ui.resize(w, h)
    } catch (e) { /* ignore */ }
  }
 }
