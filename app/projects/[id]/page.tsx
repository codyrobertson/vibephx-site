import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { ProjectDetailView } from '@/components/project/ProjectDetailView'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await stackServerApp.getUser({ or: 'redirect' })
  const { id } = await params

  // Fetch project with related data
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      prdSessions: {
        orderBy: { updatedAt: 'desc' },
        take: 5
      }
    }
  })

  // Check if project exists and user owns it
  if (!project || project.userId !== user.id) {
    notFound()
  }

  // Get latest completed session
  const latestSession = project.prdSessions.find(s => s.completed) || project.prdSessions[0]

  if (!latestSession) {
    // No sessions yet, redirect to builder
    redirect(`/builder/prd-builder`)
  }

  return (
    <ProjectDetailView
      project={project}
      latestSession={latestSession}
    />
  )
}
