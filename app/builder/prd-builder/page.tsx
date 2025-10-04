'use client'

import ConversationalPRDBuilder from '@/components/prd/ConversationalPRDBuilder'
import { ProjectsSidebar } from '@/components/prd/ProjectsSidebar'
import { usePRDStore } from '@/lib/stores/usePRDStore'

export default function PRDBuilderPage() {
  const sessionId = usePRDStore(state => state.sessionId)

  return (
    <div className="flex h-full bg-black overflow-hidden">
      <ProjectsSidebar currentSessionId={sessionId} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ConversationalPRDBuilder />
      </div>
    </div>
  )
}
