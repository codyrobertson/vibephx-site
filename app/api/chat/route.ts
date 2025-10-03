// Simple proxy to /api/prd/chat to work around AI SDK v5 default endpoint
import { POST as PRDChatHandler } from '../prd/chat/route'

export const runtime = 'edge'

export const POST = PRDChatHandler
