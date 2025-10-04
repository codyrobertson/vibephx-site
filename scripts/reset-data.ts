import { prisma } from '../lib/prisma'

async function resetData() {
  console.log('🗑️  Clearing all projects and sessions...\n')

  try {
    // Delete in correct order to respect foreign key constraints
    console.log('Deleting LLM logs...')
    const llmLogs = await prisma.lLMLog.deleteMany({})
    console.log(`✓ Deleted ${llmLogs.count} LLM logs`)

    console.log('Deleting project documents...')
    const docs = await prisma.projectDocument.deleteMany({})
    console.log(`✓ Deleted ${docs.count} project documents`)

    console.log('Deleting PRD sessions...')
    const sessions = await prisma.pRDSession.deleteMany({})
    console.log(`✓ Deleted ${sessions.count} PRD sessions`)

    console.log('Deleting projects...')
    const projects = await prisma.project.deleteMany({})
    console.log(`✓ Deleted ${projects.count} projects`)

    console.log('Deleting generations...')
    const generations = await prisma.generation.deleteMany({})
    console.log(`✓ Deleted ${generations.count} generations`)

    console.log('\n✅ All data cleared successfully!')
    console.log('Users, profiles, workshops, and attendance records preserved.\n')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetData()
