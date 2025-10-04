import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// POST - Upload file for workshop
export async function POST(
  req: NextRequest,
  { params }: { params: { workshopId: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64 data URL for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      select: { files: true }
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const existingFiles = (workshop.files as any[]) || []
    const newFile = {
      name: file.name,
      url: dataUrl,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }

    await prisma.workshop.update({
      where: { id: params.workshopId },
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
  { params }: { params: { workshopId: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const fileName = searchParams.get('name')

    if (!fileName) {
      return NextResponse.json({ error: 'File name required' }, { status: 400 })
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: params.workshopId },
      select: { files: true }
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const existingFiles = (workshop.files as any[]) || []
    const updatedFiles = existingFiles.filter((f: any) => f.name !== fileName)

    await prisma.workshop.update({
      where: { id: params.workshopId },
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
