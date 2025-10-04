import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, DollarSign, Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      attendees: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!workshop) {
    notFound()
  }

  const files = (workshop.files as any[]) || []

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/dashboard" className="text-orange-500 hover:text-orange-400 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          {/* Header Image */}
          {workshop.headerImage && (
            <div className="w-full h-64 md:h-80 relative">
              <img
                src={workshop.headerImage}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            </div>
          )}

          {/* Header */}
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-start gap-6">
              <Image
                src="/workshop-one-medal.png"
                alt="Workshop"
                width={100}
                height={100}
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{workshop.title}</h1>
                {workshop.description && (
                  <p className="text-gray-400 mb-4">{workshop.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {new Date(workshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {workshop.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      {workshop.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-green-400">
                    <DollarSign className="w-4 h-4" />
                    ${workshop.credits.toFixed(2)} credits awarded
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {workshop.content && (
            <div className="p-8 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">About This Workshop</h2>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {workshop.content}
              </div>
            </div>
          )}

          {/* Files Section */}
          {files.length > 0 && (
            <div className="p-8 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Workshop Files</h2>
              <div className="space-y-3">
                {files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(file.uploadedAt).toLocaleDateString()} •{' '}
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      download={file.name}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendees Section */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Attendees ({workshop.attendees.length})
            </h2>
            {workshop.attendees.length === 0 ? (
              <p className="text-gray-400">No attendees yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workshop.attendees.map((attendance) => (
                  <div
                    key={attendance.id}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                      {attendance.user.name?.[0] || attendance.user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {attendance.user.name || attendance.user.email}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{attendance.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
