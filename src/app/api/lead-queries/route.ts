import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { notifyLeadQueryRaised, notifyLeadQueryResponded } from '@/lib/notificationService';

/**
 * GET /api/lead-queries
 * Fetch all queries for a specific lead
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const userId = searchParams.get('userId');

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    // Fetch queries
    let query = supabase
      .from('lead_queries')
      .select('*')
      .eq('lead_id', leadId);

    // Filter by user if specified
    if (userId) {
      query = query.or(`requested_by.eq.${userId},responded_by.eq.${userId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ queries: data });
  } catch (error: any) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lead-queries
 * Create a new query
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leadId,
      queryText,
      queryType,
      queryDirection,
      priority,
      requestedBy,
      requestedByName,
    } = body;

    // Validation
    if (!leadId || !queryText || !requestedBy || !requestedByName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create query
    const { data: queryData, error: queryError } = await supabase
      .from('lead_queries')
      .insert({
        lead_id: leadId,
        query_text: queryText,
        query_type: queryType || 'general',
        query_direction: queryDirection || 'crm_to_source',
        priority: priority || 'normal',
        requested_by: requestedBy,
        requested_by_name: requestedByName,
        status: 'open',
      })
      .select()
      .single();

    if (queryError) throw queryError;

    // Send notification to the appropriate party
    await notifyLeadQueryRaised(
      leadId,
      queryData.id,
      queryText,
      queryType || 'general',
      priority || 'normal',
      requestedBy,
      requestedByName,
      queryDirection || 'crm_to_source'
    );

    return NextResponse.json({
      success: true,
      query: queryData,
    });
  } catch (error: any) {
    console.error('Error creating query:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create query' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lead-queries
 * Update a query (respond, change status, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      queryId,
      responseText,
      respondedBy,
      respondedByName,
      status,
    } = body;

    if (!queryId) {
      return NextResponse.json(
        { error: 'queryId is required' },
        { status: 400 }
      );
    }

    // Get existing query
    const { data: existingQuery, error: fetchError } = await supabase
      .from('lead_queries')
      .select('*')
      .eq('id', queryId)
      .single();

    if (fetchError || !existingQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updates: any = {};
    
    if (responseText) {
      updates.response_text = responseText;
      updates.responded_by = respondedBy;
      updates.responded_by_name = respondedByName;
      updates.responded_at = new Date().toISOString();
      updates.status = 'resolved';
    }

    if (status) {
      updates.status = status;
    }

    // Update query
    const { data: updatedQuery, error: updateError } = await supabase
      .from('lead_queries')
      .update(updates)
      .eq('id', queryId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send notification if response was added
    if (responseText) {
      await notifyLeadQueryResponded(
        existingQuery.lead_id,
        queryId,
        responseText,
        respondedBy,
        respondedByName,
        existingQuery.requested_by
      );
    }

    return NextResponse.json({
      success: true,
      query: updatedQuery,
    });
  } catch (error: any) {
    console.error('Error updating query:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update query' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lead-queries
 * Delete a query (soft delete by setting visible flags)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('queryId');

    if (!queryId) {
      return NextResponse.json(
        { error: 'queryId is required' },
        { status: 400 }
      );
    }

    // Soft delete - just hide it
    const { error } = await supabase
      .from('lead_queries')
      .update({
        visible_to_source: false,
        visible_to_crm: false,
      })
      .eq('id', queryId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Query deleted',
    });
  } catch (error: any) {
    console.error('Error deleting query:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete query' },
      { status: 500 }
    );
  }
}
