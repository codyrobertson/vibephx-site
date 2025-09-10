const { parseYAML, stringifyYAML, extractFigmaKey } = require('../lib')

describe('CodeSync helpers', () => {
  test('parseYAML and stringifyYAML round-trip', () => {
    const src = 'projectId: proj_123\nfigmaFileKey: AbC123\nsourceOfTruth: code\nlastSync: 2025-01-01T00:00:00Z\n'
    const obj = parseYAML(src)
    expect(obj.projectId).toBe('proj_123')
    expect(obj.figmaFileKey).toBe('AbC123')
    expect(obj.sourceOfTruth).toBe('code')
    const out = stringifyYAML(obj)
    const obj2 = parseYAML(out)
    expect(obj2).toEqual(obj)
  })

  test('extractFigmaKey from URL and raw key', () => {
    expect(extractFigmaKey('https://www.figma.com/file/AbC123/My-File')).toBe('AbC123')
    expect(extractFigmaKey('AbC123')).toBe('AbC123')
  })
})
