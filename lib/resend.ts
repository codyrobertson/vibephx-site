import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.error('[ERROR] RESEND_API_KEY environment variable is not set')
  throw new Error('RESEND_API_KEY is not set')
}

console.log('[DEV] Resend initialized with API key:', process.env.RESEND_API_KEY.substring(0, 10) + '...')

export const resend = new Resend(process.env.RESEND_API_KEY)
