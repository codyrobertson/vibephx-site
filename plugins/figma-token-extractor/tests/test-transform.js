const assert = require('assert')
const path = require('path')
const { TokenTransformer } = require(path.join(__dirname, '..', 'transformer.class.js'))
const transformer = new TokenTransformer()
const Transformer = {
  buildIR: (extract) => transformer.buildIR(extract),
  resolveAliases: (ir) => transformer.resolveAliases(ir),
  buildCssFromIR: (ir) => transformer.buildCssFromIR(ir),
  generateTailwindConfig: (ir) => {
    const cfg = transformer.generateTailwindConfig(ir)
    return 'module.exports = ' + JSON.stringify(cfg, null, 2)
  },
  toFlatTokens: (ir) => transformer.toFlatTokens(ir),
  buildShadcnCss: (ir, mapping) => transformer.buildShadcnCss(ir, mapping)
}

function sampleExtract(){
  return {
    variables: {
      collections: [
        { id: 'c1', name: 'Theme', defaultModeId: 'm1', modes: [{ id: 'm1', name: 'Light' }, { id: 'm2', name: 'Dark' }] }
      ],
      variables: [
        {
          id: 'v1',
          name: 'Color/Primary/500',
          description: '',
          variableCollectionId: 'c1',
          resolvedType: 'COLOR',
          scopes: [],
          valuesByMode: {
            m1: { r: 0.1, g: 0.2, b: 0.3 },
            m2: { aliasTo: 'v2', aliasToName: 'Color/Primary/500 Dark' }
          }
        },
        {
          id: 'v2',
          name: 'Color/Primary/500/Dark',
          description: '',
          variableCollectionId: 'c1',
          resolvedType: 'COLOR',
          scopes: [],
          valuesByMode: {
            m2: { r: 0.9, g: 0.9, b: 0.95 }
          }
        },
        {
          id: 's4',
          name: 'Spacing/4',
          variableCollectionId: 'c1',
          resolvedType: 'FLOAT',
          valuesByMode: { m1: 4 }
        },
        {
          id: 'rsm',
          name: 'Radius/Sm',
          variableCollectionId: 'c1',
          resolvedType: 'FLOAT',
          valuesByMode: { m1: 6 }
        },
        {
          id: 'ff',
          name: 'Typography/Font/Body',
          variableCollectionId: 'c1',
          resolvedType: 'STRING',
          valuesByMode: { m1: 'Inter, ui-sans-serif' }
        },
        {
          id: 'fs',
          name: 'Typography/Size/Base',
          variableCollectionId: 'c1',
          resolvedType: 'FLOAT',
          valuesByMode: { m1: 16 }
        }
      ]
    },
    styles: {
      effectStyles: [
        {
          id: 'es1', key: 'k1', name: 'card', description: '',
          effects: [ { type: 'DROP_SHADOW', offset: { x: 0, y: 1 }, radius: 2, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.25 } } ]
        }
      ]
    }
  }
}

;(function run(){
  const extract = sampleExtract()
  let ir = Transformer.buildIR(extract)

  // Categories
  const tColor = ir.tokens.find(t => t.id === 'v1')
  const tSpacing = ir.tokens.find(t => t.id === 's4')
  const tRadius = ir.tokens.find(t => t.id === 'rsm')
  const tFamily = ir.tokens.find(t => t.id === 'ff')
  const tSize = ir.tokens.find(t => t.id === 'fs')
  assert.strictEqual(tColor.category, 'color')
  assert.strictEqual(tSpacing.category, 'spacing')
  assert.strictEqual(tRadius.category, 'radius')
  assert.strictEqual(tFamily.category, 'fontFamily')
  assert.strictEqual(tSize.category, 'fontSize')

  // Alias resolution
  ir = Transformer.resolveAliases(ir)
  const rM2 = ir.tokens.find(t => t.id === 'v1').resolved['m2']
  assert.ok(rM2 && Array.isArray(rM2.rgb), 'resolved m2 should have rgb')
  assert.deepStrictEqual(rM2.rgb, [ Math.round(0.9*255), Math.round(0.9*255), Math.round(0.95*255) ])

  // CSS
  const css = Transformer.buildCssFromIR(ir)
  assert.ok(css.includes(':root {'))
  assert.ok(css.includes('--color-primary-500'), 'css should include color var')
  assert.ok(css.includes('26 51 77'), 'root color m1 rgb present')

  // Tailwind config
  const cfgStr = Transformer.generateTailwindConfig(ir)
  assert.ok(cfgStr.includes('module.exports'))
  const json = JSON.parse(cfgStr.replace(/^.*module\.exports\s*=\s*/s, ''))
  assert.ok(json.theme && json.theme.extend, 'tailwind config has theme.extend')
  const colors = JSON.stringify(json.theme.extend.colors)
  assert.ok(colors.includes('color-primary-500'), 'colors map references css var')
  assert.strictEqual(json.theme.extend.spacing['4'], '4px')
  assert.strictEqual(json.theme.extend.borderRadius['sm'], '6px')
  assert.ok(Array.isArray(json.theme.extend.fontFamily['body']) || json.theme.extend.fontFamily['body'], 'fontFamily present')
  assert.strictEqual(json.theme.extend.fontSize['base'], '16px')
  assert.ok(typeof json.theme.extend.boxShadow['card'] === 'string', 'boxShadow from effect style present')

  // Flat tokens
  const flat = Transformer.toFlatTokens(ir)
  const flatColor = flat.tokens.find(t => t.name === 'color.primary.500')
  assert.ok(flatColor && flatColor.resolved && flatColor.resolved['m2'], 'flat has resolved for m2')

  // shadcn CSS mapping
  const shad = Transformer.buildShadcnCss(ir, { background: 'color.primary.500', radius: 'radius.sm' })
  assert.ok(shad.includes('--background: rgb(var(--color-primary-500))'))
  assert.ok(shad.includes('--radius: var(--radius-sm)'))

  console.log('OK')
})()
