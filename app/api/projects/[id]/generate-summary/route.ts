import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Fetch project with latest session
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        prdSessions: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const latestSession = project.prdSessions[0]
    if (!latestSession) {
      return NextResponse.json({ error: 'No PRD session found' }, { status: 404 })
    }

    // Generate summary - use simple, fast template-based approach
    const summary = generateProjectSummary(project, latestSession)

    // Store summary in project.generated field
    await prisma.project.update({
      where: { id: projectId },
      data: {
        generated: {
          ...(typeof project.generated === 'object' ? project.generated : {}),
          summary,
          summaryGeneratedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating project summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}

function generateProjectSummary(project: any, session: any): string {
  const title = project.title || session.sda || session.initialIntent || 'Untitled Project'
  const description = session.sda || session.initialIntent || 'No description available'

  let summary = `# ${title}\n\n`

  // Concise overview
  summary += `${description}`
  if (session.audience) {
    summary += ` Built for ${session.audience}.`
  }
  summary += `\n\n`

  // Core features - limit to top 5 for brevity
  if (session.featuresMvp && session.featuresMvp.length > 0) {
    summary += `**Core Features:**\n`
    const topFeatures = session.featuresMvp.slice(0, 5)
    topFeatures.forEach((feature: string) => {
      summary += `• ${feature}\n`
    })
    if (session.featuresMvp.length > 5) {
      summary += `• Plus ${session.featuresMvp.length - 5} more features\n`
    }
    summary += '\n'
  }

  // Tech stack - single line format
  const techParts: string[] = []
  if (session.selectedStack) {
    const stackItems = session.selectedStack.split('•').map((s: string) => s.trim()).filter(Boolean)
    techParts.push(stackItems.join(', '))
  }
  if (session.dbChoice && !techParts.join('').toLowerCase().includes(session.dbChoice.toLowerCase())) {
    techParts.push(session.dbChoice)
  }
  if (session.integrations && session.integrations.length > 0) {
    techParts.push(session.integrations.slice(0, 3).join(', '))
    if (session.integrations.length > 3) {
      techParts.push(`+${session.integrations.length - 3} more`)
    }
  }

  if (techParts.length > 0) {
    summary += `**Tech Stack:** ${techParts.join(' • ')}\n\n`
  }

  // Quick start prompt - compact
  summary += `**Quick Start:**\n`
  summary += `\`\`\`\nI'm building ${title}`
  if (session.selectedStack) {
    const mainStack = session.selectedStack.split('•')[0]?.trim()
    summary += ` using ${mainStack}`
  }
  if (session.dbChoice) {
    summary += ` with ${session.dbChoice}`
  }
  summary += `.`
  if (session.featuresMvp && session.featuresMvp.length > 0) {
    summary += ` Key features: ${session.featuresMvp.slice(0, 3).join(', ')}.`
  }
  summary += `\n\`\`\`\n`

  return summary
}
