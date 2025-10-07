import Link from 'next/link'
import { FileText, Calendar, Settings, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Admin Dashboard - Vibe Code Phoenix',
  description: 'Manage your content and workshops'
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage your content, workshops, and site settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content Management (Decap CMS) */}
          <a href="/admin/cms" target="_blank" rel="noopener noreferrer">
            <Card className="border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-orange-500" />
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <CardTitle className="text-white">Content Management</CardTitle>
                <CardDescription>Manage blog posts and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Create and edit blog posts</li>
                  <li>• Manage learning resources</li>
                  <li>• Upload images and media</li>
                </ul>
              </CardContent>
            </Card>
          </a>

          {/* Workshop Management */}
          <Link href="/admin/workshops">
            <Card className="border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors h-full">
              <CardHeader>
                <Calendar className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-white">Workshop Management</CardTitle>
                <CardDescription>Manage workshops and events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Create new workshops</li>
                  <li>• Manage registrations</li>
                  <li>• Award credits to attendees</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Settings (Future) */}
          <Card className="border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed h-full">
            <CardHeader>
              <Settings className="w-8 h-8 text-gray-500 mb-2" />
              <CardTitle className="text-gray-400">Site Settings</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• General settings</li>
                <li>• User management</li>
                <li>• Integration settings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
