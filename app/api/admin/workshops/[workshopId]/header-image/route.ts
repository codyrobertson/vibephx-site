import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { put } from '@vercel/blob'

// POST - Upload header image for workshop
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workshopId } = await params

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`workshops/${workshopId}/header-${Date.now()}.${file.type.split('/')[1]}`, file, {
      access: 'public'
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error('Failed to upload header image:', error)
    return NextResponse.json(
      { error: 'Failed to upload header image' },
      { status: 500 }
    )
  }
}
