import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { ProductType } from '@/types/training'

// GET /api/training/dashboard - Get training dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productType = searchParams.get('product_type') as ProductType
    
    // Build base query conditions
    const baseConditions = productType ? { product_type: productType } : {}
    
    // Get total content counts
    const { count: totalContent } = await supabase
      .from('training_content')
      .select('*', { count: 'exact', head: true })
      .match(baseConditions)
    
    const { count: publishedContent } = await supabase
      .from('training_content')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseConditions, status: 'published' })
    
    const { count: draftContent } = await supabase
      .from('training_content')
      .select('*', { count: 'exact', head: true })
      .match({ ...baseConditions, status: 'draft' })
    
    // Get total media count
    let mediaQuery = supabase
      .from('training_media')
      .select('*', { count: 'exact', head: true })
    
    if (productType) {
      mediaQuery = mediaQuery.eq('training_content.product_type', productType)
    }
    
    const { count: totalMedia } = await mediaQuery
    
    // Get featured content
    let featuredQuery = supabase
      .from('training_content')
      .select(`
        *,
        category:training_categories(id, name, color_code),
        primary_media:training_media!left(id, media_type, r2_url, file_name, is_primary)
      `)
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (productType) {
      featuredQuery = featuredQuery.eq('product_type', productType)
    }
    
    const { data: featuredContent } = await featuredQuery
    
    // Get recent content
    let recentQuery = supabase
      .from('training_content')
      .select(`
        *,
        category:training_categories(id, name, color_code),
        primary_media:training_media!left(id, media_type, r2_url, file_name, is_primary)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(8)
    
    if (productType) {
      recentQuery = recentQuery.eq('product_type', productType)
    }
    
    const { data: recentContent } = await recentQuery
    
    // Get popular content (by view count)
    let popularQuery = supabase
      .from('training_content')
      .select(`
        *,
        category:training_categories(id, name, color_code),
        primary_media:training_media!left(id, media_type, r2_url, file_name, is_primary)
      `)
      .eq('status', 'published')
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(6)
    
    if (productType) {
      popularQuery = popularQuery.eq('product_type', productType)
    }
    
    const { data: popularContent } = await popularQuery
    
    // Get categories with content counts
    let categoriesQuery = supabase
      .from('training_categories')
      .select(`
        *,
        content_count:training_content(count)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (productType) {
      categoriesQuery = categoriesQuery.eq('product_type', productType)
    }
    
    const { data: categoriesData } = await categoriesQuery
    
    // Transform categories data
    const categories = categoriesData?.map(category => ({
      ...category,
      content_count: category.content_count?.[0]?.count || 0
    }))
    
    // Get progress statistics (simplified - would need user context for real implementation)
    const userProgressStats = {
      completed: 0,
      in_progress: 0,
      not_started: 0,
      bookmarked: 0
    }
    
    const dashboardData = {
      statistics: {
        total_content: totalContent || 0,
        published_content: publishedContent || 0,
        draft_content: draftContent || 0,
        total_media: totalMedia || 0,
        user_progress: userProgressStats
      },
      featured_content: featuredContent || [],
      recent_content: recentContent || [],
      popular_content: popularContent || [],
      categories: categories || [],
      product_type: productType
    }
    
    return NextResponse.json(dashboardData)
    
  } catch (error) {
    console.error('Training dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}