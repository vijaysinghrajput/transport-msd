import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // First, let's try to get all leads without status filters to see what's available
    const { data: allLeads, error: allLeadsError } = await supabase
      .from('leads')
      .select('id, customer_name, status')
      .limit(5);
    
    console.log('Sample of all leads:', allLeads);

    // Fetch solar leads - get ALL leads, not just converted ones
    const { data: solarLeads, error: solarError } = await supabase
      .from('leads')
      .select(`
        id,
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        system_capacity,
        status,
        branch_id,
        branches(
          id,
          name,
          city,
          state,
          manager_name,
          manager_contact_no
        )
      `)
      .limit(20)  // Add limit to get some data
      .order('customer_name');

    console.log('Solar leads query result:', { solarLeads, solarError });

    // Also check what finance leads tables exist
    const { data: allFinanceLeads, error: allFinanceError } = await supabase
      .from('finance_leads')
      .select('id, customer_name, status')
      .limit(5);
    
    console.log('Sample of all finance leads:', allFinanceLeads);

    // Fetch finance leads - get ALL finance leads, not just approved ones
    const { data: financeLeads, error: financeError } = await supabase
      .from('finance_leads')
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        address,
        city,
        state,
        pincode,
        product_type,
        requested_amount,
        status,
        branch_id,
        branches(
          id,
          name,
          city,
          state,
          manager_name,
          manager_contact_no
        )
      `)
      .limit(20)  // Add limit to get some data
      .order('customer_name');

    console.log('Finance leads query result:', { financeLeads, financeError });

    if (solarError && financeError) {
      throw new Error(`Failed to fetch leads: ${solarError.message} | ${financeError.message}`);
    }

    // Transform solar leads to customer format
    const solarCustomers = solarLeads?.map((lead: any) => ({
      id: `solar-${lead.id}`,
      name: lead.customer_name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      source: 'solar_lead',
      lead_id: lead.id,
      branch_id: lead.branch_id,
      branch_name: lead.branches?.name || 'Unknown Branch',
      system_capacity: lead.system_capacity,
      created_at: new Date().toISOString()
    })) || [];

    // Transform finance leads to customer format
    const financeCustomers = financeLeads?.map((lead: any) => ({
      id: `finance-${lead.id}`,
      name: lead.customer_name,
      email: lead.customer_email,
      phone: lead.customer_phone,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      source: 'finance_lead',
      lead_id: lead.id,
      branch_id: lead.branch_id,
      branch_name: lead.branches?.name || 'Unknown Branch',
      product_type: lead.product_type,
      requested_amount: lead.requested_amount,
      created_at: new Date().toISOString()
    })) || [];

    // Also get regular customers
    const { data: regularCustomers, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    const customers = regularCustomers?.map(customer => ({
      ...customer,
      source: 'direct_customer'
    })) || [];

    // Combine all customers
    const allCustomers = [
      ...customers,
      ...solarCustomers,
      ...financeCustomers
    ];

    return NextResponse.json({ 
      customers: allCustomers,
      solar_leads: solarCustomers,
      finance_leads: financeCustomers,
      direct_customers: customers
    });

  } catch (error) {
    console.error('Failed to fetch leads and customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads and customers' },
      { status: 500 }
    );
  }
}