import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { TrainingContent, TrainingFilters, TrainingSortOptions } from '@/types/training'

// GET /api/training - Get training content with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    console.log('🔍 API Request params:', Object.fromEntries(searchParams.entries()))
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit
    
    // Build filters
    const statusParam = searchParams.get('status')
    const filters: TrainingFilters = {
      product_type: searchParams.get('product_type') as any,
      category_id: searchParams.get('category_id') || undefined,
      content_type: searchParams.get('content_type') as any,
      difficulty_level: searchParams.get('difficulty_level') as any,
      status: statusParam === 'all' ? undefined : (statusParam as any || 'published'),
      is_featured: searchParams.get('is_featured') ? searchParams.get('is_featured') === 'true' : undefined,
      has_videos: searchParams.get('has_videos') ? searchParams.get('has_videos') === 'true' : undefined,
      has_images: searchParams.get('has_images') ? searchParams.get('has_images') === 'true' : undefined,
      search_query: searchParams.get('search') || undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')?.split(',') : undefined
    }
    
    console.log('📋 Filters applied:', filters)
    
    // Parse sort options
    const sortField = searchParams.get('sort_field') || 'created_at'
    const sortDirection = searchParams.get('sort_direction') || 'desc'
    
    // Build query
    let query = supabase
      .from('training_content')
      .select(`
        *,
        category:training_categories(id, name, product_type, color_code),
        primary_media:training_media!left(
          id, media_type, r2_url, file_name, is_primary
        )
      `)
    
    // Apply filters
    console.log('🏗️ Building query with filters...')
    
    if (filters.product_type) {
      console.log(`🏷️ Adding product_type filter: ${filters.product_type}`)
      query = query.eq('product_type', filters.product_type)
    }
    
    if (filters.category_id) {
      console.log(`📁 Adding category_id filter: ${filters.category_id}`)
      query = query.eq('category_id', filters.category_id)
    }
    
    if (filters.content_type) {
      console.log(`📝 Adding content_type filter: ${filters.content_type}`)
      query = query.eq('content_type', filters.content_type)
    }
    
    if (filters.difficulty_level) {
      console.log(`📊 Adding difficulty_level filter: ${filters.difficulty_level}`)
      query = query.eq('difficulty_level', filters.difficulty_level)
    }
    
    if (filters.status) {
      console.log(`🔄 Adding status filter: ${filters.status}`)
      query = query.eq('status', filters.status)
    } else {
      console.log('⚠️ No status filter applied (status=undefined for status=all)')
    }
    
    if (filters.is_featured !== undefined) {
      console.log(`⭐ Adding is_featured filter: ${filters.is_featured}`)
      query = query.eq('is_featured', filters.is_featured)
    }
    
    if (filters.has_videos !== undefined) {
      console.log(`🎥 Adding has_videos filter: ${filters.has_videos}`)
      query = query.eq('has_videos', filters.has_videos)
    }
    
    if (filters.has_images !== undefined) {
      console.log(`🖼️ Adding has_images filter: ${filters.has_images}`)
      query = query.eq('has_images', filters.has_images)
    }
    
    if (filters.search_query) {
      console.log(`🔍 Adding search filter: ${filters.search_query}`)
      query = query.or(`title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      console.log(`🏷️ Adding tags filter: ${filters.tags.join(', ')}`)
      query = query.contains('tags', filters.tags)
    }
    
    // Apply sorting
    console.log(`🔄 Applying sort: ${sortField} ${sortDirection}`)
    query = query.order(sortField as any, { ascending: sortDirection === 'asc' })
    
    // Get total count for pagination - build same query for count
    console.log('📊 Getting total count...')
    let countQuery = supabase
      .from('training_content')
      .select('*', { count: 'exact', head: true })
    
    // Apply same filters to count query
    if (filters.product_type) countQuery = countQuery.eq('product_type', filters.product_type)
    if (filters.category_id) countQuery = countQuery.eq('category_id', filters.category_id) 
    if (filters.content_type) countQuery = countQuery.eq('content_type', filters.content_type)
    if (filters.difficulty_level) countQuery = countQuery.eq('difficulty_level', filters.difficulty_level)
    if (filters.status) countQuery = countQuery.eq('status', filters.status)
    if (filters.is_featured !== undefined) countQuery = countQuery.eq('is_featured', filters.is_featured)
    if (filters.has_videos !== undefined) countQuery = countQuery.eq('has_videos', filters.has_videos)
    if (filters.has_images !== undefined) countQuery = countQuery.eq('has_images', filters.has_images)
    if (filters.search_query) countQuery = countQuery.or(`title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`)
    if (filters.tags && filters.tags.length > 0) countQuery = countQuery.contains('tags', filters.tags)
    
    const { count } = await countQuery
    console.log(`📊 Total content count: ${count}`)
    
    // Execute query with pagination
    console.log(`🚀 Executing main query with pagination: offset=${offset}, limit=${limit}`)
    const { data: content, error } = await query
      .range(offset, offset + limit - 1)
    
    console.log(`✅ Query result: ${content?.length || 0} items returned`)
    if (error) {
      console.error('❌ Error fetching training content:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get categories for the response
    const { data: categories } = await supabase
      .from('training_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    return NextResponse.json({
      content: content || [],
      categories: categories || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error('Training content API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/training - Create new training content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Prepare data for insertion
    const trainingData = {
      ...body,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('training_content')
      .insert(trainingData)
      .select(`
        *,
        category:training_categories(id, name, product_type, color_code)
      `)
      .single()
    
    if (error) {
      console.error('Error creating training content:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Training content creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}