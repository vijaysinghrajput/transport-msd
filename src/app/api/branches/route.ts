import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // First try to get all branches regardless of is_active status
    const { data: branches, error } = await supabase
      .from('branches')
      .select(`
        id,
        name,
        address,
        city,
        state,
        pincode,
        manager_name,
        manager_contact_no,
        is_active,
        created_at
      `)
      .order('name');

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Raw branches from database:', branches);

    // Transform data to match expected interface
    const transformedBranches = branches?.map((branch: any) => ({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      manager_name: branch.manager_name,
      manager_phone: branch.manager_contact_no,
      created_at: branch.created_at
    })) || [];

    return NextResponse.json({ branches: transformedBranches });
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform data to match database schema
    const branchData = {
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: '000000', // Default pincode
      manager_name: body.manager_name,
      manager_contact_no: body.manager_phone
    };
    
    const { data: branch, error } = await supabase
      .from('branches')
      .insert([branchData])
      .select(`
        id,
        name,
        address,
        city,
        state,
        manager_name,
        manager_contact_no,
        created_at
      `)
      .single();

    if (error) {
      throw error;
    }

    // Transform response to match expected interface
    const transformedBranch = {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      manager_name: branch.manager_name,
      manager_phone: branch.manager_contact_no,
      created_at: branch.created_at
    };

    return NextResponse.json({ branch: transformedBranch });
  } catch (error) {
    console.error('Failed to create branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}