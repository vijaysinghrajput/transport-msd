import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { ProductType } from '@/types/training'

// GET /api/training/categories - Get training categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productType = searchParams.get('product_type') as ProductType
    
    let query = supabase
      .from('training_categories')
      .select(`
        *,
        content_count:training_content(count)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    // Filter by product type if specified
    if (productType) {
      query = query.eq('product_type', productType)
    }
    
    const { data: categories, error } = await query
    
    if (error) {
      console.error('Error fetching training categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Transform the data to include content count
    const transformedCategories = categories?.map(category => ({
      ...category,
      content_count: category.content_count?.[0]?.count || 0
    }))
    
    return NextResponse.json({
      categories: transformedCategories || [],
      total: transformedCategories?.length || 0
    })
    
  } catch (error) {
    console.error('Training categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/training/categories - Create new training category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.product_type) {
      return NextResponse.json(
        { error: 'Name and product_type are required' },
        { status: 400 }
      )
    }
    
    // Check if category with same name already exists for this product type
    const { data: existingCategory } = await supabase
      .from('training_categories')
      .select('id')
      .eq('name', body.name)
      .eq('product_type', body.product_type)
      .single()
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists for this product type' },
        { status: 409 }
      )
    }
    
    // Prepare data for insertion
    const categoryData = {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('training_categories')
      .insert(categoryData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating training category:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Training category creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}