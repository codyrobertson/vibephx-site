const { startPair, confirmPair, auth, saveTokens, getTokens, getStore } = require('../../../lib/codesync-store')

describe('codesync store', () => {
  test('pairing and auth flow', () => {
    const { code, installationId } = startPair()
    const conf = confirmPair(code)
    expect(conf).toBeTruthy()
    expect(conf.installationId).toBe(installationId)
    expect(typeof conf.token).toBe('string')
    expect(auth(installationId, conf.token)).toBe(true)
  })

  test('save and get tokens', () => {
    const { code, installationId } = startPair()
    const conf = confirmPair(code)
    const ok = saveTokens(installationId, { hello: 'world' })
    expect(ok).toBe(true)
    const t = getTokens(installationId)
    expect(t).toEqual({ hello: 'world' })
  })
})
