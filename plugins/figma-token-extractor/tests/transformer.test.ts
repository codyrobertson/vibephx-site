import { TokenTransformer, defaultTailwindCategoryRules } from '../src/transformer'

describe('TokenTransformer', () => {
  const makeExtract = () => ({
    variables: {
      collections: [
        { id: 'c1', name: 'Theme', defaultModeId: 'm1', modes: [{ id: 'm1', name: 'Light' }, { id: 'm2', name: 'Dark' }] }
      ],
      variables: [
        {
          id: 'v1', name: 'Color/Primary/500', description: '', variableCollectionId: 'c1', resolvedType: 'COLOR', scopes: [],
          valuesByMode: { m1: { r: 0.1, g: 0.2, b: 0.3 }, m2: { aliasTo: 'v2', aliasToName: 'Color/Primary/500 Dark' } }
        },
        {
          id: 'v2', name: 'Color/Primary/500/Dark', description: '', variableCollectionId: 'c1', resolvedType: 'COLOR', scopes: [],
          valuesByMode: { m2: { r: 0.9, g: 0.9, b: 0.95 } }
        },
        { id: 's4', name: 'Spacing/4', variableCollectionId: 'c1', resolvedType: 'FLOAT', valuesByMode: { m1: 4 } },
        { id: 'rsm', name: 'Radius/Sm', variableCollectionId: 'c1', resolvedType: 'FLOAT', valuesByMode: { m1: 6 } },
        { id: 'ff', name: 'Typography/Font/Body', variableCollectionId: 'c1', resolvedType: 'STRING', valuesByMode: { m1: 'Inter, ui-sans-serif' } },
        { id: 'fs', name: 'Typography/Size/Base', variableCollectionId: 'c1', resolvedType: 'FLOAT', valuesByMode: { m1: 16 } }
      ]
    },
    styles: { effectStyles: [ { id: 'es1', key: 'k1', name: 'card', description: '', effects: [ { type: 'DROP_SHADOW', offset: { x: 0, y: 1 }, radius: 2, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.25 } } ] } ] }
  })

  it('builds IR with categories and resolves aliases', () => {
    const t = new TokenTransformer({ categoryRules: defaultTailwindCategoryRules })
    let ir = t.buildIR(makeExtract())
    expect(ir.tokens.find((x) => x.id === 'v1')?.category).toBe('color')
    expect(ir.tokens.find((x) => x.id === 's4')?.category).toBe('spacing')
    expect(ir.tokens.find((x) => x.id === 'rsm')?.category).toBe('radius')
    expect(ir.tokens.find((x) => x.id === 'ff')?.category).toBe('fontFamily')
    expect(ir.tokens.find((x) => x.id === 'fs')?.category).toBe('fontSize')

    ir = t.resolveAliases(ir)
    const rM2 = ir.tokens.find((x) => x.id === 'v1')?.resolved?.['m2']
    expect(Array.isArray(rM2?.rgb)).toBe(true)
  })

  it('generates Tailwind config grouped by tailwindKey', () => {
    const t = new TokenTransformer()
    const ir = t.resolveAliases(t.buildIR(makeExtract()))
    const cfg = t.generateTailwindConfig(ir)
    expect(cfg.theme.extend.colors).toBeDefined()
    expect(cfg.theme.extend.spacing['4']).toBe('4px')
    expect(cfg.theme.extend.borderRadius['sm']).toBe('6px')
  })

  it('emits flat tokens and shadcn css', () => {
    const t = new TokenTransformer()
    const ir = t.resolveAliases(t.buildIR(makeExtract()))
    const flat = t.toFlatTokens(ir)
    expect(flat.tokens.find((x) => x.name === 'color.primary.500')).toBeTruthy()
    const shad = t.buildShadcnCss(ir, { background: 'color.primary.500', radius: 'radius.sm' })
    expect(shad.includes('--background: rgb(var(--color-primary-500))')).toBe(true)
    expect(shad.includes('--radius: var(--radius-sm)')).toBe(true)
  })
})
