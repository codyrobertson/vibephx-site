import { sanitizeWorkshopForLog, sanitizeWorkshopsForLog } from './log-utils'

const isDev = process.env.NODE_ENV === 'development'
const isVerbose = process.env.VERBOSE_LOGGING === 'true'

/**
 * Safe logger that sanitizes workshop data to prevent logging large files
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev || isVerbose) {
      console.log(...args)
    }
  },

  error: (...args: any[]) => {
    console.error(...args)
  },

  warn: (...args: any[]) => {
    console.warn(...args)
  },

  /**
   * Log workshop data with automatic sanitization
   */
  logWorkshop: (message: string, workshop: any) => {
    if (isDev || isVerbose) {
      console.log(message, sanitizeWorkshopForLog(workshop))
    }
  },

  /**
   * Log array of workshops with automatic sanitization
   */
  logWorkshops: (message: string, workshops: any[]) => {
    if (isDev || isVerbose) {
      console.log(message, sanitizeWorkshopsForLog(workshops))
    }
  },

  /**
   * Performance logging
   */
  perf: (message: string, durationMs: number) => {
    if (isDev || isVerbose) {
      console.log(`[PERF] ${message}: ${durationMs}ms`)
    }
  }
}
