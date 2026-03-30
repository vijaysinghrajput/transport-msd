import { NextRequest, NextResponse } from 'next/server'
import {
  sendTripCustomerNotification,
  sendTripDriverNotification,
  sendTripOwnerNotification,
  sendTripTeamNotification,
  COMPANY_TEAM_NUMBERS,
  validateMobileNumber,
} from '@/lib/whatsappService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tripNumber,
      date,
      vehicleNumber,
      driverName,
      driverMobile,
      ownerName,
      ownerMobile,
      customerName,
      customerMobile,
      source,
      destination,
      ratePerKm,
    } = body

    if (!tripNumber || !vehicleNumber) {
      return NextResponse.json({ success: false, error: 'Missing tripNumber or vehicleNumber' }, { status: 400 })
    }

    const results: Record<string, any> = {}
    const errors: string[] = []

    // 1. Send to Customer (if mobile provided)
    if (customerMobile && validateMobileNumber(customerMobile)) {
      const r = await sendTripCustomerNotification(
        customerMobile, customerName || 'ग्राहक', tripNumber, date || 'N/A',
        vehicleNumber, driverName || 'N/A', driverMobile || 'N/A', source || 'N/A', destination || 'N/A'
      )
      results.customer = r
      if (!r.success) errors.push(`Customer: ${r.error}`)
    }

    // 2. Send to Driver (if mobile provided)
    if (driverMobile && validateMobileNumber(driverMobile)) {
      const r = await sendTripDriverNotification(
        driverMobile, driverName || 'ड्राइवर', tripNumber, date || 'N/A',
        vehicleNumber, source || 'N/A', destination || 'N/A', customerName || 'N/A', customerMobile || 'N/A'
      )
      results.driver = r
      if (!r.success) errors.push(`Driver: ${r.error}`)
    }

    // 3. Send to Owner (if mobile provided)
    if (ownerMobile && validateMobileNumber(ownerMobile)) {
      const r = await sendTripOwnerNotification(
        ownerMobile, ownerName || 'मालिक', tripNumber, date || 'N/A',
        vehicleNumber, driverName || 'N/A', source || 'N/A', destination || 'N/A', ratePerKm || '0'
      )
      results.owner = r
      if (!r.success) errors.push(`Owner: ${r.error}`)
    }

    // 4. Send to all Company Team members
    results.team = []
    for (const num of COMPANY_TEAM_NUMBERS) {
      const r = await sendTripTeamNotification(
        num, tripNumber, date || 'N/A', vehicleNumber, driverName || 'N/A',
        source || 'N/A', destination || 'N/A', customerName || 'N/A', ratePerKm || '0'
      )
      results.team.push({ number: num, ...r })
      if (!r.success) errors.push(`Team ${num}: ${r.error}`)
    }

    const totalSent = [
      results.customer?.success,
      results.driver?.success,
      results.owner?.success,
      ...(results.team?.map((t: any) => t.success) || []),
    ].filter(Boolean).length

    return NextResponse.json({
      success: true,
      totalSent,
      totalErrors: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      results,
    })
  } catch (error: any) {
    console.error('Trip notification error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
