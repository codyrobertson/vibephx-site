import { NextRequest } from 'next/server'
import { generationQueue } from '@/lib/generation-queue'

const DOCUMENT_TEMPLATES = {
  prd: { name: 'Product Requirements Document', priority: 10 },
  buildDoc: { name: 'Technical Build Guide', priority: 9 },
  uiSpecs: { name: 'UI/UX Specifications', priority: 8 },
  dataModels: { name: 'Data Models & Schema', priority: 7 },
  taskList: { name: 'Development Task List', priority: 6 },
  marketingGuide: { name: 'Marketing & Launch Guide', priority: 5 },
  claudeMd: { name: 'Claude.md Configuration', priority: 4 },
  cursorRules: { name: 'Cursor Rules Configuration', priority: 3 }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectData, sessionId, documents } = body

    if (!projectData || !sessionId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Queue all requested documents
    const queuedItems = []
    const documentsToGenerate = documents || Object.keys(DOCUMENT_TEMPLATES)

    for (const documentType of documentsToGenerate) {
      if (!DOCUMENT_TEMPLATES[documentType as keyof typeof DOCUMENT_TEMPLATES]) {
        continue
      }

      // Check cache first
      const cached = generationQueue.getFromCache(projectData, documentType)
      if (cached) {
        console.log(`📋 Using cached ${documentType}`)
        continue
      }

      // Add to queue
      const queueId = generationQueue.enqueue({
        documentType,
        projectData,
        sessionId,
        priority: DOCUMENT_TEMPLATES[documentType as keyof typeof DOCUMENT_TEMPLATES].priority
      })

      queuedItems.push({ documentType, queueId })
    }

    const status = generationQueue.getStatus()
    
    return Response.json({
      success: true,
      queued: queuedItems,
      status,
      message: `${queuedItems.length} documents queued for generation`
    })

  } catch (error) {
    console.error('Queue API error:', error)
    return Response.json({ error: 'Failed to queue generation' }, { status: 500 })
  }
}

// Get queue status
export async function GET() {
  try {
    const status = generationQueue.getStatus()
    
    return Response.json({
      success: true,
      ...status,
      message: status.processing 
        ? `Processing queue (${status.queueLength} items remaining)` 
        : status.queueLength > 0 
          ? `Queue ready (${status.queueLength} items waiting)`
          : 'Queue empty'
    })
    
  } catch (error) {
    console.error('Queue status error:', error)
    return Response.json({ error: 'Failed to get queue status' }, { status: 500 })
  }
}