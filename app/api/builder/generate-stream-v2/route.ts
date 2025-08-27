import { NextRequest } from 'next/server'
import { generationQueue } from '@/lib/generation-queue'

// Enhanced streaming endpoint with queue integration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectData, sessionId, documents } = body

    if (!projectData || !sessionId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const encoder = new TextEncoder()

    // Create streaming response with queue integration
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start notification
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "start", message: "Initializing generation queue..." })}\n\n`))

          const documentsToGenerate = documents || ['prd', 'buildDoc', 'uiSpecs', 'dataModels', 'taskList', 'marketingGuide', 'claudeMd', 'cursorRules']
          
          // Check cache and queue items
          const results: Record<string, string> = {}
          const queuedItems = []

          for (const documentType of documentsToGenerate) {
            // Check cache first
            const cached = generationQueue.getFromCache(projectData, documentType)
            if (cached) {
              results[documentType] = cached
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: "complete", 
                documentType,
                content: cached,
                fromCache: true
              })}\n\n`))
              continue
            }

            // Add to queue
            const priority = { prd: 10, buildDoc: 9, uiSpecs: 8, dataModels: 7, taskList: 6, marketingGuide: 5, claudeMd: 4, cursorRules: 3 }[documentType] || 1
            
            const queueId = generationQueue.enqueue({
              documentType,
              projectData,
              sessionId,
              priority
            })

            queuedItems.push({ documentType, queueId })
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: "queued", 
              documentType,
              queueId,
              message: `${documentType} queued for generation`
            })}\n\n`))
          }

          // Monitor queue progress
          let lastQueueLength = -1
          const monitorQueue = async () => {
            while (queuedItems.some(item => !results[item.documentType])) {
              const status = generationQueue.getStatus()
              
              // Send queue status updates
              if (status.queueLength !== lastQueueLength) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                  type: "status", 
                  queueLength: status.queueLength,
                  processing: status.processing,
                  message: status.processing 
                    ? `Processing... ${status.queueLength} items remaining`
                    : `Waiting... ${status.queueLength} items in queue`
                })}\n\n`))
                lastQueueLength = status.queueLength
              }

              // Check for completed items (would need event system in production)
              for (const item of queuedItems) {
                if (!results[item.documentType]) {
                  const cached = generationQueue.getFromCache(projectData, item.documentType)
                  if (cached) {
                    results[item.documentType] = cached
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                      type: "complete", 
                      documentType: item.documentType,
                      content: cached,
                      fromCache: false
                    })}\n\n`))
                  }
                }
              }

              // Wait before next check
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }

          await monitorQueue()

          // Send final completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: "all_complete", 
            results,
            message: "All documents generated successfully"
          })}\n\n`))

          controller.close()

        } catch (error) {
          console.error('Streaming queue error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: "error", 
            message: error instanceof Error ? error.message : 'Generation failed'
          })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Stream setup error:', error)
    return Response.json({ error: 'Failed to setup stream' }, { status: 500 })
  }
}