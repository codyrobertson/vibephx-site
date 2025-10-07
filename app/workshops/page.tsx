import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Workshops - Vibe Code Phoenix',
  description: 'Join our hands-on workshops and learn from industry experts'
}

export default async function WorkshopsPage() {
  const workshops = await prisma.workshop.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    },
    include: {
      attendees: {
        select: {
          id: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming Workshops
          </h1>
          <p className="text-xl text-gray-400">
            Join our hands-on workshops and learn from industry experts. Build real projects, earn credits, and level up your skills.
          </p>
        </div>

        {/* Workshops Grid */}
        {workshops.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              <Calendar className="w-16 h-16 mx-auto text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Upcoming Workshops</h2>
            <p className="text-gray-400 mb-6">Check back soon for new workshop announcements!</p>
            <Link href="/blog">
              <Button variant="outline">
                Read Our Blog
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Link key={workshop.id} href={`/workshops/${workshop.id}`}>
                <Card className="h-full border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white line-clamp-2">
                        {workshop.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {workshop.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(workshop.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {workshop.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{workshop.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {workshop.attendees.length} / {workshop.maxCapacity || '∞'} registered
                          </span>
                        </div>
                      </div>

                      {/* Credits Badge */}
                      {workshop.creditValue && workshop.creditValue > 0 && (
                        <Badge className="w-fit bg-orange-500/10 text-orange-400 hover:bg-orange-500/20">
                          {workshop.creditValue} Credit{workshop.creditValue !== 1 ? 's' : ''}
                        </Badge>
                      )}

                      {/* CTA */}
                      <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Get Notified?
          </h2>
          <p className="text-gray-400 mb-6">
            Sign in to register for workshops, track your credits, and stay updated on new events.
          </p>
          <Link href="/auth/signin">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In to Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
