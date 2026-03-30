import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppTemplate } from '@/lib/whatsappService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, templateName, components, language } = body

    if (!to || !templateName) {
      return NextResponse.json({ success: false, error: 'Missing required fields: to, templateName' }, { status: 400 })
    }

    const result = await sendWhatsAppTemplate(to, templateName, components || [], language || 'hi')
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('WhatsApp API route error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
