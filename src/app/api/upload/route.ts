import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, deleteFromR2, getSignedDownloadUrl } from '@/lib/r2Client'
import { randomUUID } from 'crypto'

const MAX_SIZE_BYTES = 25 * 1024 * 1024 // 25MB
const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'documents'
    const subfolder = (formData.get('subfolder') as string) || ''
    const leadId = formData.get('leadId') as string
    const docType = (formData.get('docType') as string) || 'misc'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // For backward compatibility, allow either leadId or folder-based uploads
    const entityId = leadId || 'general'

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${Math.round(MAX_SIZE_BYTES/1024/1024)}MB` },
        { status: 413 }
      )
    }

    const mime = file.type || 'application/octet-stream'
    if (!ALLOWED_MIME.includes(mime) && !mime.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 415 }
      )
    }

    const safeOriginal = sanitizeFileName(file.name || 'file')
    const y = new Date().getUTCFullYear()
    const m = String(new Date().getUTCMonth() + 1).padStart(2, '0')
    
    // Create flexible key structure based on what parameters are provided
    let key: string
    if (leadId && leadId !== 'general') {
      // Lead document upload
      key = `leads/${leadId}/${y}/${m}/${docType}/${randomUUID()}-${safeOriginal}`
    } else if (folder && subfolder) {
      // Folder-based upload (e.g., KYC documents)
      key = `${folder}/${subfolder}/${y}/${m}/${randomUUID()}-${safeOriginal}`
    } else {
      // General upload
      key = `${folder}/${y}/${m}/${docType}/${randomUUID()}-${safeOriginal}`
    }

    console.log('🔄 Uploading file:', {
      key,
      fileName: safeOriginal,
      size: file.size,
      type: file.type,
      folder,
      subfolder,
      entityId
    })

    const uploadResult = await uploadToR2({
      file,
      key,
      cacheControl: 'private, max-age=0, must-revalidate',
      contentDisposition: `inline; filename="${safeOriginal}"`,
      metadata: {
        entity_id: entityId,
        doc_type: docType || subfolder,
        folder: folder
      }
    })

    console.log('✅ Upload completed:', uploadResult)

    // Generate a signed URL for immediate access
    let signedUrl: string | null = null
    try {
      signedUrl = await getSignedDownloadUrl(key, 86400) // 24 hours
      console.log('✅ Signed URL generated:', signedUrl)
    } catch (signedUrlError) {
      console.error('⚠️ Failed to generate signed URL:', signedUrlError)
      // Fall back to public URL
      signedUrl = uploadResult.url
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...uploadResult,
        signedUrl
      },
      url: signedUrl, // For backward compatibility
      key: key
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const expires = Number(searchParams.get('expires')) || 3600
  const redirect = searchParams.get('redirect') === 'true'
  if (!key) {
    return NextResponse.json({
      message: 'File upload endpoint. Use POST method.',
      supportedMethods: ['POST'],
    })
  }
  try {
    const url = await getSignedDownloadUrl(key, expires)
    if (redirect) {
      return NextResponse.redirect(url)
    }
    return NextResponse.json({ url })
  } catch (e) {
    console.error('Signed URL error:', e)
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    await deleteFromR2(key)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete error:', e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}