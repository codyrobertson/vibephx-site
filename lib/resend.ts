import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null

function getResend() {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      console.error('[ERROR] RESEND_API_KEY environment variable is not set')
      throw new Error('RESEND_API_KEY is not set')
    }
    console.log('[DEV] Resend initialized with API key:', process.env.RESEND_API_KEY.substring(0, 10) + '...')
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export const resend = new Proxy({} as Resend, {
  get(target, prop) {
    return (getResend() as any)[prop]
  }
})
