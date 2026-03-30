import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { uploadToR2, deleteFromR2 } from '@/lib/r2Client'
import { MediaType } from '@/types/training'

// POST /api/training/media/upload - Upload media files for training content
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const trainingContentId = formData.get('training_content_id') as string
    const mediaType = formData.get('media_type') as MediaType
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const altText = formData.get('alt_text') as string
    const isPrimary = formData.get('is_primary') === 'true'
    const isThumbnail = formData.get('is_thumbnail') === 'true'
    const displayOrder = parseInt(formData.get('display_order') as string) || 0
    
    if (!file || !trainingContentId || !mediaType) {
      return NextResponse.json(
        { error: 'File, training_content_id, and media_type are required' },
        { status: 400 }
      )
    }
    
    // Verify the training content exists
    const { data: trainingContent, error: contentError } = await supabase
      .from('training_content')
      .select('id, title')
      .eq('id', trainingContentId)
      .single()
    
    if (contentError || !trainingContent) {
      return NextResponse.json(
        { error: 'Training content not found' },
        { status: 404 }
      )
    }
    
    // Validate file type
    const allowedTypes: Record<MediaType, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      video: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
      pdf: ['application/pdf'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
    
    if (!allowedTypes[mediaType]?.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${mediaType}. Allowed types: ${allowedTypes[mediaType]?.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Generate unique file name
    const timestamp = Date.now()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    try {
      console.log('🚀 Starting media upload for:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        trainingContentId,
        mediaType
      })
      
      // Upload to R2 using the uploadToR2 function
      const uploadResult = await uploadToR2({
        file,
        folder: `training/${trainingContentId}/${mediaType}`,
        fileName: cleanFileName
      })
      
      console.log('✅ R2 Upload successful:', uploadResult)
      
      // If this is set as primary, unset other primary media for this content
      if (isPrimary) {
        await supabase
          .from('training_media')
          .update({ is_primary: false })
          .eq('training_content_id', trainingContentId)
      }
      
      // Save media information to database
      const mediaData = {
        training_content_id: trainingContentId,
        media_type: mediaType,
        file_name: cleanFileName,
        file_size_bytes: file.size,
        mime_type: file.type,
        r2_key: uploadResult.key,
        r2_url: uploadResult.url,
        r2_bucket: process.env.R2_BUCKET_NAME || 'ghar-khojo',
        title: title || cleanFileName,
        description,
        alt_text: altText,
        display_order: displayOrder,
        is_primary: isPrimary,
        is_thumbnail: isThumbnail,
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
      
      const { data: media, error: dbError } = await supabase
        .from('training_media')
        .insert(mediaData)
        .select()
        .single()
      
      console.log('💾 Database insert result:', { media, dbError })
      
      if (dbError) {
        console.error('Error saving media to database:', dbError)
        // Try to clean up the uploaded file
        try {
          await deleteFromR2(uploadResult.key)
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError)
        }
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
      
      // Update training content media counts
      const { data: mediaCount } = await supabase
        .from('training_media')
        .select('media_type')
        .eq('training_content_id', trainingContentId)
      
      const hasImages = mediaCount?.some(m => m.media_type === 'image') || false
      const hasVideos = mediaCount?.some(m => m.media_type === 'video') || false
      const totalMediaCount = mediaCount?.length || 0
      
      await supabase
        .from('training_content')
        .update({
          has_images: hasImages,
          has_videos: hasVideos,
          total_media_count: totalMediaCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', trainingContentId)
      
      return NextResponse.json({
        ...media,
        upload_success: true,
        message: 'Media uploaded successfully'
      })
      
    } catch (uploadError) {
      console.error('❌ R2 Upload Error:', uploadError)
      console.error('❌ Error details:', {
        message: uploadError instanceof Error ? uploadError.message : String(uploadError),
        stack: uploadError instanceof Error ? uploadError.stack : undefined
      })
      return NextResponse.json(
        { error: `Failed to upload file to storage: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Media upload API error:', error)
    console.error('❌ Full error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// GET /api/training/media?training_content_id=xxx - Get media for training content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trainingContentId = searchParams.get('training_content_id')
    const mediaType = searchParams.get('media_type') as MediaType
    
    let query = supabase
      .from('training_media')
      .select(`
        *,
        training_content:training_content(id, title)
      `)
      .order('display_order', { ascending: true })
    
    if (trainingContentId) {
      query = query.eq('training_content_id', trainingContentId)
    }
    
    if (mediaType) {
      query = query.eq('media_type', mediaType)
    }
    
    const { data: media, error } = await query
    
    if (error) {
      console.error('Error fetching training media:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      media: media || [],
      total: media?.length || 0
    })
    
  } catch (error) {
    console.error('Training media API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}