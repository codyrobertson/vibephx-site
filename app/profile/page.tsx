import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const user = await stackServerApp.getUser({ or: 'redirect' })
  
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* User Info */}
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-white font-semibold text-xl mb-1">{user.displayName || 'User'}</div>
              <div className="text-gray-400">{user.primaryEmail}</div>
            </div>
            {user.profileImageUrl && (
              <img src={user.profileImageUrl} alt="" className="w-16 h-16 rounded-full border-2 border-gray-700" />
            )}
          </div>

          {!profile?.onboardingCompleted ? (
            <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
              <div className="text-white font-medium mb-2">Complete Your Onboarding</div>
              <p className="text-gray-400 text-sm mb-4">
                Answer a few quick questions to get personalized project suggestions tailored to your skill level and interests.
              </p>
              <Link href="/onboarding">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Start Onboarding
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-white font-semibold mb-4">Your Preferences</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Skill Level</div>
                  <div className="text-white capitalize">{profile.skillLevel || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Primary Goal</div>
                  <div className="text-white capitalize">{profile.primaryGoal?.replace('-', ' ') || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Time Commitment</div>
                  <div className="text-white">{profile.timeCommitment || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Preferred Complexity</div>
                  <div className="text-white capitalize">{profile.preferredComplexity || '—'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-400 mb-1">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.length > 0 ? (
                      profile.interests.map(interest => (
                        <span key={interest} className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs">
                          {interest.replace('-', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-white">—</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-400 mb-1">Tech Preferences</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.techPreferences.length > 0 ? (
                      profile.techPreferences.map(tech => (
                        <span key={tech} className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-white">—</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/onboarding">
                  <Button variant="outline" className="border-gray-700 text-gray-300">
                    Update Preferences
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard" className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
            <div className="text-white font-semibold mb-1">Projects</div>
            <div className="text-gray-400 text-sm">View all your PRD sessions and projects</div>
          </Link>
          <Link href="/builder/prd-builder" className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-orange-500 transition-colors">
            <div className="text-white font-semibold mb-1">New PRD</div>
            <div className="text-gray-400 text-sm">Start a new product requirements document</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

