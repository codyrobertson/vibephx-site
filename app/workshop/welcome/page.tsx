import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Calendar, MapPin, DollarSign } from 'lucide-react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function WorkshopWelcomePage() {
  const user = await stackServerApp.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user's workshop attendance
  const workshops = await prisma.workshop.findMany({
    where: {
      attendees: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      attendees: {
        where: {
          userId: user.id
        },
        select: {
          creditsAwarded: true,
          creditsApplied: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: 1
  })

  const workshop = workshops[0]

  if (!workshop) {
    redirect('/dashboard')
  }

  const attendance = workshop.attendees[0]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              You're all set!
            </h1>
            <p className="text-white/90 text-lg">
              ${attendance.creditsAwarded.toFixed(2)} in AI credits ready to use
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Workshop Registration Confirmed
              </h2>

              {/* Workshop Details */}
              <div className="space-y-4 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">Event</div>
                    <div className="text-white font-medium">{workshop.title}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">Date</div>
                    <div className="text-white font-medium">
                      {new Date(workshop.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {workshop.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="text-white font-medium">{workshop.location}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-400">Credits Awarded</div>
                    <div className="text-green-400 font-semibold text-lg">
                      ${attendance.creditsAwarded.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                What's next?
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Start building your PRD</div>
                    <div className="text-sm text-gray-400">Use the PRD Builder to turn your idea into a complete product specification</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Define your features</div>
                    <div className="text-sm text-gray-400">Work with AI to identify core features and MVP requirements</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-400 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Get ready to ship</div>
                    <div className="text-sm text-gray-400">Choose your tech stack and receive comprehensive project documentation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/builder/prd-builder" className="flex-1">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-semibold">
                  Start Building Your PRD
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-12 text-base">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Questions? Email us or visit your{' '}
          <Link href="/dashboard" className="text-white underline">
            dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
