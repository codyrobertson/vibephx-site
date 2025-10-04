import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { put, del } from '@vercel/blob'

// POST - Upload file for workshop
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

    // Upload to Vercel Blob
    const blob = await put(`workshops/${workshopId}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false
    })

    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { files: true }
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const existingFiles = (workshop.files as any[]) || []
    const newFile = {
      name: file.name,
      url: blob.url,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }

    await prisma.workshop.update({
      where: { id: workshopId },
      data: {
        files: [...existingFiles, newFile]
      }
    })

    return NextResponse.json({ success: true, file: newFile })
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE - Remove file from workshop
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workshopId } = await params

    const { searchParams } = new URL(req.url)
    const fileName = searchParams.get('name')

    if (!fileName) {
      return NextResponse.json({ error: 'File name required' }, { status: 400 })
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { files: true }
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const existingFiles = (workshop.files as any[]) || []
    const fileToDelete = existingFiles.find((f: any) => f.name === fileName)
    const updatedFiles = existingFiles.filter((f: any) => f.name !== fileName)

    // Delete from Vercel Blob if it's a blob URL
    if (fileToDelete && fileToDelete.url && fileToDelete.url.includes('vercel-storage.com')) {
      try {
        await del(fileToDelete.url)
      } catch (blobError) {
        console.error('Failed to delete from blob storage:', blobError)
        // Continue anyway - we still want to remove it from the database
      }
    }

    await prisma.workshop.update({
      where: { id: workshopId },
      data: { files: updatedFiles }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
