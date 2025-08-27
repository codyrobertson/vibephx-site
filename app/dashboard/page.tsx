import { Suspense } from 'react'
import ProjectDashboard from '@/components/dashboard/ProjectDashboard'

export const metadata = {
  title: 'Dashboard - VibePHX Builder',
  description: 'View and manage your AI-generated projects'
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your AI-generated project ideas and continue building
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <ProjectDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  )
}