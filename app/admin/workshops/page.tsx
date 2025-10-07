'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Users, Calendar, DollarSign, Trash2, Upload, FileText, Download, ExternalLink, Edit } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

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
  files?: WorkshopFile[]
  content?: string | null
  headerImage?: string | null
  attendees: {
    id: string
    userId: string
    creditsAwarded: number
    creditsApplied: boolean
    emailSentAt: string | null
    emailOpenedAt: string | null
    emailClickedAt: string | null
    user: {
      email: string
      name: string | null
    }
  }[]
}

interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [showAddAttendee, setShowAddAttendee] = useState(false)
  const [showEditWorkshop, setShowEditWorkshop] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [credits, setCredits] = useState('20')

  // Attendee form
  const [attendeeEmail, setAttendeeEmail] = useState('')
  const [attendeeCredits, setAttendeeCredits] = useState('20')

  // Bulk import
  const [bulkEmails, setBulkEmails] = useState('')
  const [bulkCredits, setBulkCredits] = useState('20')
  const [bulkResults, setBulkResults] = useState<any>(null)

  // File uploads
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [deletingFiles, setDeletingFiles] = useState<Record<string, boolean>>({})

  // Edit workshop form
  const [editContent, setEditContent] = useState('')
  const [editHeaderImage, setEditHeaderImage] = useState('')
  const [uploadingHeaderImage, setUploadingHeaderImage] = useState(false)

  useEffect(() => {
    // Fetch both in parallel for better performance
    const fetchData = async () => {
      await Promise.all([fetchWorkshops(), fetchUsers()])
    }
    fetchData()
  }, [])

  const fetchWorkshops = async () => {
    try {
      const res = await fetch('/api/admin/workshops')
      if (res.ok) {
        const data = await res.json()
        setWorkshops(data.workshops)
      }
    } catch (error) {
      console.error('Failed to fetch workshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          date: new Date(date).toISOString(),
          location: location || null,
          credits: parseFloat(credits)
        })
      })

      if (res.ok) {
        const data = await res.json()
        setWorkshops([data.workshop, ...workshops])
        setShowCreateForm(false)
        // Reset form
        setTitle('')
        setDescription('')
        setDate('')
        setLocation('')
        setCredits('20')
      }
    } catch (error) {
      console.error('Failed to create workshop:', error)
    }
  }

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkshop) return

    const emails = bulkEmails
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.includes('@'))

    try {
      const res = await fetch('/api/admin/workshops/attendees/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopId: selectedWorkshop.id,
          emails,
          creditsAwarded: parseFloat(bulkCredits)
        })
      })

      if (res.ok) {
        const data = await res.json()
        setBulkResults(data)
        fetchWorkshops()
        if (data.succeeded === data.total) {
          // All succeeded, close modal
          setTimeout(() => {
            setShowAddAttendee(false)
            setBulkMode(false)
            setBulkEmails('')
            setBulkResults(null)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Failed to bulk import:', error)
    }
  }

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkshop) return

    try {
      const res = await fetch('/api/admin/workshops/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopId: selectedWorkshop.id,
          attendeeEmail,
          creditsAwarded: parseFloat(attendeeCredits)
        })
      })

      if (res.ok) {
        fetchWorkshops()
        setShowAddAttendee(false)
        setAttendeeEmail('')
        setAttendeeCredits('20')
      } else {
        const data = await res.json()
        alert(`Failed to add attendee: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to add attendee:', error)
      alert('Failed to add attendee. Please try again.')
    }
  }

  const handleApplyCredits = async (workshopId: string, attendanceId: string) => {
    try {
      const res = await fetch('/api/admin/workshops/attendees/apply-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceId })
      })

      if (res.ok) {
        fetchWorkshops()
      }
    } catch (error) {
      console.error('Failed to apply credits:', error)
    }
  }

  const handleDeleteWorkshop = async (workshopId: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return

    try {
      const res = await fetch(`/api/admin/workshops/${workshopId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setWorkshops(workshops.filter(w => w.id !== workshopId))
      }
    } catch (error) {
      console.error('Failed to delete workshop:', error)
    }
  }

  const handleDeleteAttendee = async (attendanceId: string) => {
    if (!confirm('Remove this attendee from the workshop?')) return

    try {
      const res = await fetch(`/api/admin/workshops/attendees/${attendanceId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchWorkshops()
      } else {
        const data = await res.json()
        alert(`Failed to remove attendee: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete attendee:', error)
      alert('Failed to remove attendee. Please try again.')
    }
  }

  const handleResendEmail = async (attendanceId: string) => {
    try {
      const res = await fetch(`/api/admin/workshops/attendees/${attendanceId}/resend`, {
        method: 'POST'
      })

      if (res.ok) {
        fetchWorkshops()
        alert('Email resent successfully!')
      } else {
        const data = await res.json()
        alert(`Failed to resend email: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to resend email:', error)
      alert('Failed to resend email. Please try again.')
    }
  }

  const handleSyncUser = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch('/api/admin/sync-user', {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json()
        setSyncResult(data)
        fetchWorkshops()
        setTimeout(() => setSyncResult(null), 5000)
      } else {
        const data = await res.json()
        alert(`Failed to sync user: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to sync user:', error)
      alert('Failed to sync user. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  const handleFileUpload = async (workshopId: string, file: File) => {
    setUploadingFiles(prev => ({ ...prev, [workshopId]: true }))
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/admin/workshops/${workshopId}/files`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        fetchWorkshops()
      } else {
        const data = await res.json()
        alert(`Failed to upload file: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploadingFiles(prev => ({ ...prev, [workshopId]: false }))
    }
  }

  const handleDeleteFile = async (workshopId: string, fileName: string) => {
    if (!confirm(`Delete file "${fileName}"?`)) return

    const deleteKey = `${workshopId}-${fileName}`
    setDeletingFiles(prev => ({ ...prev, [deleteKey]: true }))
    try {
      const res = await fetch(
        `/api/admin/workshops/${workshopId}/files?name=${encodeURIComponent(fileName)}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        fetchWorkshops()
      } else {
        const data = await res.json()
        alert(`Failed to delete file: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
      alert('Failed to delete file. Please try again.')
    } finally {
      setDeletingFiles(prev => ({ ...prev, [deleteKey]: false }))
    }
  }

  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setEditContent(workshop.content || '')
    setEditHeaderImage(workshop.headerImage || '')
    setShowEditWorkshop(true)
  }

  const handleHeaderImageUpload = async (file: File) => {
    setUploadingHeaderImage(true)
    if (!selectedWorkshop) return

    try {
      // Upload to Vercel Blob via dedicated endpoint
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/admin/workshops/${selectedWorkshop.id}/header-image`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setEditHeaderImage(data.url)
      } else {
        const data = await res.json()
        alert(`Failed to upload image: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingHeaderImage(false)
    }
  }

  const handleUpdateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkshop) return

    try {
      // Only update content - header image is already uploaded
      const res = await fetch(`/api/admin/workshops/${selectedWorkshop.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent || null,
          headerImage: editHeaderImage || null
        })
      })

      if (res.ok) {
        fetchWorkshops()
        setShowEditWorkshop(false)
        setSelectedWorkshop(null)
        setEditContent('')
        setEditHeaderImage('')
      } else {
        const data = await res.json()
        alert(`Failed to update workshop: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to update workshop:', error)
      alert('Failed to update workshop. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Workshop Management</h1>
            <p className="text-gray-400">Create workshops and manage attendee credits</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSyncUser}
              disabled={syncing}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-950 hover:border-blue-500"
            >
              {syncing ? 'Syncing...' : 'Sync User Data'}
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              Create Workshop
            </Button>
          </div>
        </div>

        {/* Sync Result */}
        {syncResult && (
          <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800/50">
            <p className="text-green-400 font-medium mb-2">{syncResult.message}</p>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Workshop attendance synced: {syncResult.workshopAttendance}</p>
              <p>Projects synced: {syncResult.projects}</p>
              <p>Profiles synced: {syncResult.profiles}</p>
            </div>
          </div>
        )}

        {/* Create Workshop Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">Create Workshop</h2>
              <form onSubmit={handleCreateWorkshop} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Workshop Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Credits to Award
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Create
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Attendee Form */}
        {showAddAttendee && selectedWorkshop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Add Attendees</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBulkMode(false)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      !bulkMode
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setBulkMode(true)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      bulkMode
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    Bulk
                  </button>
                </div>
              </div>

              <p className="text-gray-400 mb-4">Workshop: {selectedWorkshop.title}</p>

              {!bulkMode ? (
                /* Single Mode */
                <form onSubmit={handleAddAttendee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select User
                    </label>
                    <select
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- Select a user or type below --</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.email}>
                          {user.name || user.email} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or Enter Email Manually
                    </label>
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credits to Award
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={attendeeCredits}
                      onChange={(e) => setAttendeeCredits(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                      Add Attendee
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddAttendee(false)
                        setSelectedWorkshop(null)
                        setBulkMode(false)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                /* Bulk Mode */
                <form onSubmit={handleBulkImport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quick Add All Users
                    </label>
                    <Button
                      type="button"
                      onClick={() => {
                        const allEmails = users.map(u => u.email).join('\n')
                        setBulkEmails(allEmails)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Load All {users.length} Users
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Addresses (one per line)
                    </label>
                    <textarea
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 font-mono text-sm"
                      rows={10}
                      required
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Enter one email per line. Invalid lines will be skipped.
                      </p>
                      <p className="text-xs text-gray-400">
                        {bulkEmails.split('\n').filter(l => l.trim() && l.includes('@')).length} emails
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credits to Award (per attendee)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={bulkCredits}
                      onChange={(e) => setBulkCredits(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  {bulkResults && (
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <h4 className="font-semibold text-white mb-2">Import Results</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-white">{bulkResults.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400">Succeeded:</span>
                          <span className="text-green-400">{bulkResults.succeeded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-400">Failed:</span>
                          <span className="text-red-400">{bulkResults.failed}</span>
                        </div>
                      </div>
                      {bulkResults.errors && bulkResults.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-400 mb-1">Errors:</p>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {bulkResults.errors.map((error: any, i: number) => (
                              <div key={i} className="text-xs text-red-400">
                                {error.email}: {error.reason}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                      Import Attendees
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddAttendee(false)
                        setSelectedWorkshop(null)
                        setBulkMode(false)
                        setBulkEmails('')
                        setBulkResults(null)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Edit Workshop Modal */}
        {showEditWorkshop && selectedWorkshop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Edit Workshop Content</h2>
              <p className="text-gray-400 mb-6">Workshop: {selectedWorkshop.title}</p>

              <form onSubmit={handleUpdateWorkshop} className="space-y-6">
                {/* Header Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Header Image
                  </label>
                  {editHeaderImage && (
                    <div className="mb-3">
                      <img
                        src={editHeaderImage}
                        alt="Header preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="cursor-pointer flex-1">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleHeaderImageUpload(file)
                            e.target.value = ''
                          }
                        }}
                        disabled={uploadingHeaderImage}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploadingHeaderImage}
                        onClick={(e) => {
                          e.preventDefault()
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          input?.click()
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingHeaderImage ? 'Processing...' : 'Upload Image'}
                      </Button>
                    </label>
                    {editHeaderImage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditHeaderImage('')}
                        className="border-red-600 text-red-400 hover:bg-red-950"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Workshop Content (Markdown)
                  </label>
                  <div data-color-mode="dark">
                    <MDEditor
                      value={editContent}
                      onChange={(value) => setEditContent(value || '')}
                      preview="edit"
                      height={400}
                      style={{
                        backgroundColor: 'rgb(31 41 55)',
                        border: '1px solid rgb(55 65 81)',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You can use Markdown formatting. Preview will be shown on the workshop detail page.
                  </p>
                </div>

                {/* Workshop Files */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Workshop Files
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(selectedWorkshop.id, file)
                            e.target.value = ''
                          }
                        }}
                        disabled={uploadingFiles[selectedWorkshop.id]}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={uploadingFiles[selectedWorkshop.id]}
                        onClick={(e) => {
                          e.preventDefault()
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          input?.click()
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFiles[selectedWorkshop.id] ? 'Uploading...' : 'Upload File'}
                      </Button>
                    </label>
                  </div>

                  {selectedWorkshop.files && (selectedWorkshop.files as any[]).length > 0 ? (
                    <div className="space-y-2">
                      {(selectedWorkshop.files as any[]).map((file: any, index: number) => {
                        const deleteKey = `${selectedWorkshop.id}-${file.name}`
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(file.uploadedAt).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteFile(selectedWorkshop.id, file.name)}
                              disabled={deletingFiles[deleteKey]}
                              className="border-red-600 text-red-400 hover:bg-red-950 ml-2 flex-shrink-0"
                            >
                              {deletingFiles[deleteKey] ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-center">
                      <p className="text-sm text-gray-400">No files uploaded yet</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowEditWorkshop(false)
                      setSelectedWorkshop(null)
                      setEditContent('')
                      setEditHeaderImage('')
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workshops List */}
        <div className="space-y-6">
          {workshops.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workshops created yet</p>
            </div>
          ) : (
            workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/workshops/${workshop.id}`} className="group">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors flex items-center gap-2">
                          {workshop.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>
                      {workshop.description && (
                        <p className="text-gray-400 mb-3">{workshop.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {new Date(workshop.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {workshop.location && (
                          <div className="flex items-center gap-2 text-gray-300">
                            📍 {workshop.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-green-400">
                          <DollarSign className="w-4 h-4" />
                          ${workshop.credits.toFixed(2)} credits
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4" />
                          {workshop.attendees.length} attendees
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditWorkshop(workshop)}
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-950"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Content
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedWorkshop(workshop)
                          setShowAddAttendee(true)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Users className="w-4 h-4" />
                        Add Attendee
                      </Button>
                      <Button
                        onClick={() => handleDeleteWorkshop(workshop.id)}
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Files Section */}
                <div className="p-6 border-b border-gray-800 bg-gray-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Workshop Files
                    </h4>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(workshop.id, file)
                            e.target.value = ''
                          }
                        }}
                        disabled={uploadingFiles[workshop.id]}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={uploadingFiles[workshop.id]}
                        onClick={(e) => {
                          e.preventDefault()
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          input?.click()
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingFiles[workshop.id] ? 'Uploading...' : 'Upload File'}
                      </Button>
                    </label>
                  </div>

                  {workshop.files && (workshop.files as any[]).length > 0 ? (
                    <div className="space-y-2">
                      {(workshop.files as any[]).map((file, index) => {
                        const deleteKey = `${workshop.id}-${file.name}`
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(file.uploadedAt).toLocaleDateString()} •{' '}
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={file.url}
                                download={file.name}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50 rounded transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteFile(workshop.id, file.name)}
                                disabled={deletingFiles[deleteKey]}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No files uploaded yet</p>
                  )}
                </div>

                {/* Attendees List */}
                {workshop.attendees.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      Attendees
                    </h4>
                    <div className="space-y-3">
                      {workshop.attendees.map((attendance) => (
                        <div
                          key={attendance.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                        >
                          {/* Left: User Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                              {attendance.user.name?.[0] || attendance.user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">
                                {attendance.user.name || attendance.user.email}
                              </p>
                              <p className="text-sm text-gray-400 truncate">{attendance.user.email}</p>
                            </div>
                          </div>

                          {/* Center: Email Status */}
                          <div className="flex items-center gap-2 px-4">
                            {attendance.emailSentAt ? (
                              <>
                                <span className="text-xs px-2.5 py-1 rounded-md bg-green-900/50 text-green-300 border border-green-800/50">
                                  ✓ Sent
                                </span>
                                {attendance.emailClickedAt ? (
                                  <span className="text-xs px-2.5 py-1 rounded-md bg-blue-900/50 text-blue-300 border border-blue-800/50">
                                    🔗 Clicked
                                  </span>
                                ) : attendance.emailOpenedAt ? (
                                  <span className="text-xs px-2.5 py-1 rounded-md bg-yellow-900/50 text-yellow-300 border border-yellow-800/50">
                                    👀 Opened
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-xs px-2.5 py-1 rounded-md bg-red-900/50 text-red-300 border border-red-800/50">
                                ✗ Not sent
                              </span>
                            )}
                          </div>

                          {/* Right: Credits & Actions */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right min-w-[80px]">
                              <div className="text-green-400 font-semibold">
                                ${attendance.creditsAwarded.toFixed(2)}
                              </div>
                              {attendance.creditsApplied && (
                                <div className="text-xs text-green-400">
                                  Applied
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!attendance.creditsApplied && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyCredits(workshop.id, attendance.id)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-4"
                                >
                                  Apply
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendEmail(attendance.id)}
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 h-9 px-4"
                              >
                                Resend
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAttendee(attendance.id)}
                                className="border-gray-700 text-gray-400 hover:bg-red-950 hover:border-red-800 hover:text-red-400 h-9 w-9 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
