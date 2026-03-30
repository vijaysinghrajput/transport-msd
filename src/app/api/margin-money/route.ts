/**
 * API endpoint for margin money configurations
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const loanAmount = searchParams.get('loanAmount')
    const systemType = searchParams.get('systemType')

    let query = supabase
      .from('margin_money_configs')
      .select('*')
      .eq('is_active', true)
      .order('bank_name')

    // Filter by loan amount if provided
    if (loanAmount) {
      const amount = parseFloat(loanAmount)
      query = query
        .or(`min_loan_amount.is.null,min_loan_amount.lte.${amount}`)
        .or(`max_loan_amount.is.null,max_loan_amount.gte.${amount}`)
    }

    // Filter by system type if provided
    if (systemType) {
      query = query.contains('applies_to_system_types', [systemType])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching margin money configs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('margin_money_configs')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating margin money config:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}