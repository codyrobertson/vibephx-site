/**
 * Backfill script to convert existing PRD sessions into ProjectDocuments
 *
 * Usage: npx tsx scripts/backfill-prd-documents.ts
 */

import { PrismaClient } from '@prisma/client'
import { generateEmbedding, createExcerpt } from '../lib/embeddings/document-embedder'

const prisma = new PrismaClient()

async function backfillPRDDocuments() {
  console.log('🚀 Starting PRD document backfill...\n')

  try {
    // Fetch all completed PRD sessions with content
    const sessions = await prisma.pRDSession.findMany({
      where: {
        OR: [
          { prdMarkdown: { not: null } },
          { eightLinePrompt: { not: null } }
        ],
        completed: true
      },
      include: {
        project: true
      }
    })

    console.log(`📊 Found ${sessions.length} PRD sessions to backfill\n`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const session of sessions) {
      try {
        // Check if documents already exist for this session
        const existingDocs = await prisma.projectDocument.findMany({
          where: {
            projectId: session.projectId || undefined,
            OR: [
              { title: { contains: session.sda || session.initialIntent } },
              { metadata: { path: ['sessionId'], equals: session.id } }
            ]
          }
        })

        if (existingDocs.length > 0) {
          console.log(`⏭️  Skipping session ${session.id} - documents already exist`)
          skipCount++
          continue
        }

        const projectId = session.projectId
        if (!projectId) {
          console.log(`⚠️  Skipping session ${session.id} - no project ID`)
          skipCount++
          continue
        }

        // Create document for PRD markdown if exists
        if (session.prdMarkdown) {
          const title = session.sda || session.initialIntent || 'Product Requirements Document'
          const excerpt = createExcerpt(session.prdMarkdown)

          console.log(`📝 Creating PRD document for project ${projectId}...`)

          // Generate embedding
          let embedding: number[] | null = null
          try {
            const result = await generateEmbedding(session.prdMarkdown)
            embedding = result.embedding
            console.log(`   ✓ Generated embedding (${result.tokens} tokens)`)
          } catch (error) {
            console.warn(`   ⚠️  Failed to generate embedding: ${error}`)
          }

          // Create document
          const doc = await prisma.projectDocument.create({
            data: {
              projectId,
              userId: session.userId,
              type: 'PRD',
              title: `${title} - PRD`,
              content: session.prdMarkdown,
              excerpt,
              isBookmarked: true,
              bookmarkedAt: session.completedAt || session.updatedAt,
              generatedBy: 'PRD Builder',
              tags: ['PRD', 'backfill'],
              metadata: {
                sessionId: session.id,
                backfilledAt: new Date().toISOString(),
                originalCreatedAt: session.createdAt.toISOString()
              }
            }
          })

          // Update with embedding if we have one
          if (embedding) {
            await prisma.$executeRaw`
              UPDATE project_documents
              SET embedding = ${`[${embedding.join(',')}]`}::vector
              WHERE id = ${doc.id}
            `
            console.log(`   ✓ Set embedding vector`)
          }

          console.log(`   ✅ Created PRD document ${doc.id}`)
          successCount++
        }

        // Create document for 8-line prompt if exists
        if (session.eightLinePrompt) {
          const title = session.sda || session.initialIntent || 'AI Prompt'
          const excerpt = createExcerpt(session.eightLinePrompt)

          console.log(`📝 Creating prompt document for project ${projectId}...`)

          const doc = await prisma.projectDocument.create({
            data: {
              projectId,
              userId: session.userId,
              type: 'TEXT',
              title: `${title} - AI Prompt`,
              content: session.eightLinePrompt,
              excerpt,
              isBookmarked: true,
              bookmarkedAt: session.completedAt || session.updatedAt,
              generatedBy: 'PRD Builder',
              tags: ['prompt', 'backfill'],
              metadata: {
                sessionId: session.id,
                backfilledAt: new Date().toISOString(),
                originalCreatedAt: session.createdAt.toISOString()
              }
            }
          })

          console.log(`   ✅ Created prompt document ${doc.id}`)
          successCount++
        }

        // Create document for acceptance criteria if exists
        if (session.acceptanceCriteria && session.acceptanceCriteria.length > 0) {
          const title = session.sda || session.initialIntent || 'Acceptance Criteria'
          const content = `# Acceptance Criteria\n\n${session.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
          const excerpt = createExcerpt(content)

          console.log(`📝 Creating acceptance criteria document for project ${projectId}...`)

          const doc = await prisma.projectDocument.create({
            data: {
              projectId,
              userId: session.userId,
              type: 'SPEC',
              title: `${title} - Acceptance Criteria`,
              content,
              excerpt,
              isBookmarked: true,
              bookmarkedAt: session.completedAt || session.updatedAt,
              generatedBy: 'PRD Builder',
              tags: ['acceptance-criteria', 'backfill'],
              metadata: {
                sessionId: session.id,
                backfilledAt: new Date().toISOString(),
                originalCreatedAt: session.createdAt.toISOString()
              }
            }
          })

          console.log(`   ✅ Created acceptance criteria document ${doc.id}`)
          successCount++
        }

        console.log('')
      } catch (error) {
        console.error(`❌ Error processing session ${session.id}:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Backfill complete!')
    console.log(`   Success: ${successCount} documents`)
    console.log(`   Skipped: ${skipCount} sessions`)
    console.log(`   Errors:  ${errorCount} sessions`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('❌ Backfill failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the backfill
backfillPRDDocuments()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
