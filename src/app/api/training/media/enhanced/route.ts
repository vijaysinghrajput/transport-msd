import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2 } from '@/lib/r2Client'
import { supabase } from '@/lib/supabaseClient'
import { revalidatePath } from 'next/cache'

// Supported file types
const SUPPORTED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
  videos: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/mkv', 'video/flv'],
  documents: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword', // DOC
    'text/plain', // TXT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/vnd.ms-powerpoint' // PPT
  ]
}

const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  video: 200 * 1024 * 1024, // 200MB
  document: 50 * 1024 * 1024 // 50MB
}

// Helper functions
function getFileCategory(mimeType: string): string {
  if (SUPPORTED_FILE_TYPES.images.includes(mimeType)) return 'image'
  if (SUPPORTED_FILE_TYPES.videos.includes(mimeType)) return 'video'
  if (SUPPORTED_FILE_TYPES.documents.includes(mimeType)) return 'document'
  return 'unknown'
}

function getMediaTypeFromMime(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'docx'
  return getFileCategory(mimeType)
}

function validateFileType(file: File): { valid: boolean; category: string; mediaType: string; error?: string } {
  const category = getFileCategory(file.type)
  const mediaType = getMediaTypeFromMime(file.type)
  
  if (category === 'unknown') {
    return { valid: false, category, mediaType, error: 'Unsupported file type' }
  }
  
  const maxSize = MAX_FILE_SIZE[category as keyof typeof MAX_FILE_SIZE]
  if (file.size > maxSize) {
    return { 
      valid: false, 
      category, 
      mediaType,
      error: `File too large. Maximum size for ${category} is ${maxSize / (1024 * 1024)}MB` 
    }
  }
  
  return { valid: true, category, mediaType }
}

function validateYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return youtubeRegex.test(url)
}

function validateWebsiteUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Starting enhanced media upload/link process...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const trainingContentId = formData.get('trainingContentId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    
    // External link support
    const youtubeUrl = formData.get('youtubeUrl') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const externalUrl = formData.get('externalUrl') as string
    const linkType = formData.get('linkType') as string
    
    console.log('📋 Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      trainingContentId,
      title,
      description,
      youtubeUrl: youtubeUrl ? 'provided' : 'none',
      websiteUrl: websiteUrl ? 'provided' : 'none',
      externalUrl: externalUrl ? 'provided' : 'none',
      linkType
    })
    
    if (!trainingContentId) {
      console.log('❌ No training content ID provided')
      return NextResponse.json({ error: 'Training content ID is required' }, { status: 400 })
    }
    
    // Check if it's a file upload or external link
    const isFileUpload = !!file
    const isExternalLink = !!(youtubeUrl || websiteUrl || externalUrl)
    
    if (!isFileUpload && !isExternalLink) {
      console.log('❌ No file or external link provided')
      return NextResponse.json({ error: 'Either file or external link is required' }, { status: 400 })
    }
    
    if (isFileUpload && isExternalLink) {
      console.log('❌ Cannot upload file and external link simultaneously')
      return NextResponse.json({ error: 'Cannot upload file and external link simultaneously' }, { status: 400 })
    }
    
    // Verify training content exists
    console.log('🔍 Verifying training content exists...')
    const { data: trainingContent, error: trainingError } = await supabase
      .from('training_content')
      .select('id, title')
      .eq('id', trainingContentId)
      .single()
    
    if (trainingError || !trainingContent) {
      console.log('❌ Training content not found:', trainingError)
      return NextResponse.json({ error: 'Training content not found' }, { status: 404 })
    }
    
    console.log('✅ Training content verified:', trainingContent.title)
    
    // Handle external links
    if (isExternalLink) {
      console.log('🔗 Processing external link...')
      
      let finalUrl = ''
      let mediaType = ''
      let validationError = ''
      let videoId = null
      
      if (youtubeUrl) {
        if (!validateYouTubeUrl(youtubeUrl)) {
          validationError = 'Invalid YouTube URL format'
        } else {
          finalUrl = youtubeUrl
          mediaType = 'youtube'
          videoId = extractYouTubeVideoId(youtubeUrl)
        }
      } else if (websiteUrl) {
        if (!validateWebsiteUrl(websiteUrl)) {
          validationError = 'Invalid website URL format'
        } else {
          finalUrl = websiteUrl
          mediaType = 'website'
        }
      } else if (externalUrl) {
        if (!validateWebsiteUrl(externalUrl)) {
          validationError = 'Invalid external URL format'
        } else {
          finalUrl = externalUrl
          mediaType = linkType || 'external_link'
        }
      }
      
      if (validationError) {
        console.log('❌ URL validation error:', validationError)
        return NextResponse.json({ error: validationError }, { status: 400 })
      }
      
      // Store external link in database
      const linkData = {
        training_content_id: trainingContentId,
        media_type: mediaType,
        file_name: title || 'External Link',
        external_url: finalUrl,
        youtube_url: mediaType === 'youtube' ? finalUrl : null,
        website_url: mediaType === 'website' ? finalUrl : null,
        link_type: mediaType,
        is_external: true,
        title: title || (mediaType === 'youtube' ? 'YouTube Video' : 'External Link'),
        description,
        r2_key: `external-${Date.now()}`, // Placeholder for required field
        file_size_bytes: 0,
        mime_type: 'text/url'
      }
      
      console.log('💾 Storing external link data:', linkData)
      
      const { data: savedLinkData, error: linkError } = await supabase
        .from('training_media')
        .insert(linkData)
        .select()
        .single()
      
      if (linkError) {
        console.error('❌ Database error storing external link:', linkError)
        return NextResponse.json({ 
          error: 'Failed to store external link',
          details: linkError.message 
        }, { status: 500 })
      }
      
      console.log('✅ External link stored successfully')
      
      // Update training content metadata
      await updateTrainingContentMetadata(supabase, trainingContentId)
      
      revalidatePath('/dashboard/training/manage')
      
      return NextResponse.json({
        success: true,
        message: 'External link added successfully',
        media: savedLinkData,
        type: 'external_link'
      })
    }
    
    // Handle file upload
    console.log('📁 Processing file upload...')
    
    // Validate file type and size
    const validation = validateFileType(file)
    if (!validation.valid) {
      console.log('❌ File validation error:', validation.error)
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    console.log('✅ File validation passed:', {
      category: validation.category,
      mediaType: validation.mediaType,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    })
    
    // Upload file to R2
    console.log('☁️ Uploading to R2 storage...')
    let uploadResult
    
    try {
      const fileCategory = validation.category
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      
      uploadResult = await uploadToR2({
        file,
        folder: `training/${trainingContentId}/${fileCategory}s`,
        fileName: `${timestamp}-${sanitizedFileName}`,
        metadata: {
          trainingContentId,
          title: title || '',
          description: description || '',
          category: fileCategory,
          mediaType: validation.mediaType
        }
      })
      
      console.log('✅ R2 upload successful:', {
        key: uploadResult.key,
        url: uploadResult.url,
        size: uploadResult.size,
        category: fileCategory,
        mediaType: validation.mediaType
      })
      
      // Store media metadata in database
      console.log('💾 Storing media metadata in database...')
      const mediaData = {
        training_content_id: trainingContentId,
        media_type: validation.mediaType,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: file.type,
        r2_key: uploadResult.key,
        r2_url: uploadResult.url,
        r2_bucket: process.env.R2_BUCKET_NAME || 'ghar-khojo',
        is_external: false,
        title: title || file.name,
        description
      }
      
      console.log('💾 Media data to insert:', mediaData)
      
      const { data: mediaResult, error: mediaError } = await supabase
        .from('training_media')
        .insert(mediaData)
        .select()
        .single()
      
      if (mediaError) {
        console.error('❌ Database error storing media metadata:', mediaError)
        // Try to cleanup uploaded file
        try {
          console.log('🧹 Attempting to cleanup uploaded file...')
          // Note: You might want to implement deleteFromR2 if it doesn't exist
        } catch (cleanupError) {
          console.error('❌ Failed to cleanup uploaded file:', cleanupError)
        }
        return NextResponse.json({ 
          error: 'Failed to store media metadata',
          details: mediaError.message 
        }, { status: 500 })
      }
      
      console.log('✅ Media metadata stored successfully')
      
      // Update training content metadata
      await updateTrainingContentMetadata(supabase, trainingContentId)
      
      revalidatePath('/dashboard/training/manage')
      
      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        media: mediaResult,
        type: 'file_upload',
        uploadResult
      })
      
    } catch (uploadError) {
      console.error('❌ R2 Upload Error:', uploadError)
      console.error('❌ Error details:', {
        message: uploadError instanceof Error ? uploadError.message : String(uploadError),
        stack: uploadError instanceof Error ? uploadError.stack : undefined
      })
      return NextResponse.json({
        error: `Failed to upload file to storage: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`,
        details: uploadError instanceof Error ? uploadError.stack : undefined
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Enhanced media API error:', error)
    console.error('❌ Full error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// Helper function to update training content metadata
async function updateTrainingContentMetadata(supabase: any, trainingContentId: string) {
  try {
    console.log('🔄 Updating training content metadata...')
    
    const { data: mediaCount } = await supabase
      .from('training_media')
      .select('media_type, is_external')
      .eq('training_content_id', trainingContentId)
    
    if (mediaCount) {
      const hasImages = mediaCount.some((m: any) => m.media_type === 'image')
      const hasVideos = mediaCount.some((m: any) => m.media_type === 'video' || m.media_type === 'youtube')
      const hasDocuments = mediaCount.some((m: any) => ['pdf', 'docx', 'document'].includes(m.media_type))
      const hasExternalLinks = mediaCount.some((m: any) => m.is_external)
      const totalMediaCount = mediaCount.length
      
      await supabase
        .from('training_content')
        .update({
          has_images: hasImages,
          has_videos: hasVideos,
          total_media_count: totalMediaCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', trainingContentId)
      
      console.log('✅ Training content metadata updated:', {
        hasImages,
        hasVideos,
        hasDocuments,
        hasExternalLinks,
        totalMediaCount
      })
    }
  } catch (error) {
    console.error('❌ Error updating training content metadata:', error)
  }
}

// GET method to retrieve media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainingContentId = searchParams.get('trainingContentId')
    const mediaType = searchParams.get('mediaType')
    const isExternal = searchParams.get('isExternal')
    
    let query = supabase
      .from('training_media')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (trainingContentId) {
      query = query.eq('training_content_id', trainingContentId)
    }
    
    if (mediaType) {
      query = query.eq('media_type', mediaType)
    }
    
    if (isExternal !== null) {
      query = query.eq('is_external', isExternal === 'true')
    }
    
    const { data: media, error } = await query
    
    if (error) {
      console.error('Error fetching enhanced media:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      media: media || [],
      total: media?.length || 0,
      success: true
    })
    
  } catch (error) {
    console.error('Enhanced media GET API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE method to remove media
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('mediaId')
    
    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
    }
    
    // Get media details first
    const { data: media, error: fetchError } = await supabase
      .from('training_media')
      .select('*')
      .eq('id', mediaId)
      .single()
    
    if (fetchError || !media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }
    
    // Delete from R2 if it's a file upload (not external link)
    if (!media.is_external && media.r2_key) {
      try {
        // Import deleteFromR2 function if available
        // await deleteFromR2(media.r2_key)
        console.log('🗑️ Would delete R2 file:', media.r2_key)
      } catch (r2Error) {
        console.error('Error deleting from R2:', r2Error)
        // Continue with database deletion even if R2 deletion fails
      }
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('training_media')
      .delete()
      .eq('id', mediaId)
    
    if (deleteError) {
      console.error('Error deleting media from database:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    
    // Update training content metadata
    if (media.training_content_id) {
      await updateTrainingContentMetadata(supabase, media.training_content_id)
    }
    
    revalidatePath('/dashboard/training/manage')
    
    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })
    
  } catch (error) {
    console.error('Enhanced media DELETE API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}