'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, DollarSign, Download, FileText, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

interface WorkshopFile {
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

interface Workshop {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  credits: number
  content: string | null
  headerImage: string | null
  files: WorkshopFile[] | null
  attendees: {
    id: string
    user: {
      name: string | null
      email: string
    }
  }[]
}

export default function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewingFile, setViewingFile] = useState<WorkshopFile | null>(null)

  useEffect(() => {
    async function loadWorkshop() {
      const { id } = await params
      const res = await fetch(`/api/workshops/${id}`)
      if (res.ok) {
        const data = await res.json()
        setWorkshop(data)
      }
      setLoading(false)
    }
    loadWorkshop()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Workshop not found</div>
      </div>
    )
  }

  const files = workshop.files || []
  const isImage = (file: WorkshopFile) => file.type.startsWith('image/')
  const isPDF = (file: WorkshopFile) => file.type === 'application/pdf'
  const isViewable = (file: WorkshopFile) => isImage(file) || isPDF(file)

  return (
    <>
      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setViewingFile(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* File Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">{viewingFile.name}</h3>
              <div className="flex items-center justify-center bg-gray-800/50 rounded-lg overflow-hidden" style={{ minHeight: '60vh' }}>
                {isImage(viewingFile) ? (
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.name}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : isPDF(viewingFile) ? (
                  <iframe
                    src={viewingFile.url}
                    className="w-full h-[70vh]"
                    title={viewingFile.name}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
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
              <div className="text-gray-300 leading-relaxed prose prose-invert prose-headings:text-white prose-a:text-orange-500 prose-strong:text-white prose-code:text-orange-400 max-w-none">
                <ReactMarkdown>{workshop.content}</ReactMarkdown>
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
                    <div className="flex items-center gap-2">
                      {isViewable(file) && (
                        <button
                          onClick={() => setViewingFile(file)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      )}
                      <a
                        href={file.url}
                        download={file.name}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
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
    </>
  )
}
