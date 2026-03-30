/**
 * Gallery Upload API Route
 * Handle file uploads for company gallery
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const branchId = formData.get('branch_id') as string;
    const location = formData.get('location') as string;
    const eventDate = formData.get('event_date') as string;
    const isPublic = formData.get('is_public') === 'true';
    const uploadedBy = formData.get('uploaded_by') as string;
    const uploadedByName = formData.get('uploaded_by_name') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Only image and video files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Maximum ${isImage ? '10MB' : '100MB'} allowed` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${uploadedBy}/${fileName}`;

    // Convert File to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    // Create gallery item record
    const galleryData = {
      title,
      description: description || null,
      media_type: isImage ? 'image' : 'video',
      file_url: publicUrl,
      category,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      location: location || null,
      branch_id: branchId || null,
      event_date: eventDate || null,
      is_public: isPublic,
      uploaded_by: uploadedBy,
      uploaded_by_name: uploadedByName
    };

    const { data, error: insertError } = await supabase
      .from('gallery_items')
      .insert([galleryData])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      
      // Cleanup: delete uploaded file if database insert fails
      await supabase.storage
        .from('gallery')
        .remove([filePath]);
        
      return NextResponse.json(
        { error: 'Failed to save gallery item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Gallery item ID is required' },
        { status: 400 }
      );
    }

    // Get the gallery item to find the file path
    const { data: galleryItem, error: selectError } = await supabase
      .from('gallery_items')
      .select('file_url, uploaded_by')
      .eq('id', itemId)
      .single();

    if (selectError) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Extract file path from URL
    const url = new URL(galleryItem.file_url);
    const filePath = url.pathname.split('/').slice(-3).join('/'); // Extract gallery/userId/filename

    // Delete from database first
    const { error: deleteError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete gallery item' },
        { status: 500 }
      );
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Don't return error as the main deletion succeeded
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });

  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}