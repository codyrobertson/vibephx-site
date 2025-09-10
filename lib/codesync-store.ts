// Simple in-memory store for CodeSync pairing and tokens
// NOTE: ephemeral across server restarts; suitable for scaffolding/demo

type PairRecord = { installationId: string; code: string; expiresAt: number };
type InstallRecord = { token: string; lastTokens?: any; updatedAt?: number };

type Store = {
  pairs: Map<string, PairRecord>;
  installs: Map<string, InstallRecord>;
};

const g = globalThis as any
if (!g.__codesyncStore) {
  g.__codesyncStore = { pairs: new Map(), installs: new Map() } as Store
}

const store: Store = g.__codesyncStore

export function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function startPair(): { code: string; installationId: string; expiresAt: number } {
  const code = genCode()
  const installationId = genId('inst')
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  store.pairs.set(code, { installationId, code, expiresAt })
  return { code, installationId, expiresAt }
}

export function confirmPair(code: string): { installationId: string; token: string } | null {
  const rec = store.pairs.get(code)
  if (!rec) return null
  if (Date.now() > rec.expiresAt) { store.pairs.delete(code); return null }
  const token = genId('token')
  store.pairs.delete(code)
  store.installs.set(rec.installationId, { token, updatedAt: Date.now() })
  return { installationId: rec.installationId, token }
}

export function auth(installationId: string | null, token: string | null): boolean {
  if (!installationId || !token) return false
  const rec = store.installs.get(installationId)
  if (!rec) return false
  return rec.token === token
}

export function saveTokens(installationId: string, tokens: any) {
  const rec = store.installs.get(installationId)
  if (!rec) return false
  rec.lastTokens = tokens
  rec.updatedAt = Date.now()
  store.installs.set(installationId, rec)
  return true
}

export function getTokens(installationId: string): any | null {
  const rec = store.installs.get(installationId)
  return rec?.lastTokens ?? null
}

export function getStore() { return store }
