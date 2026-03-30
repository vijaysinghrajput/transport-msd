/**
 * WhatsApp Business API Service for Mudrabase Transportation
 * Sends trip notifications via Meta WhatsApp Business API
 * Uses "Mudrabase Team" number for all transport notifications
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_BASE_URL || 'https://graph.facebook.com/v19.0'
const TEAM_PHONE_NUMBER_ID = process.env.WHATSAPP_TEAM_PHONE_NUMBER_ID || ''
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''

export interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
}

interface TemplateComponent {
  type: 'body' | 'header' | 'button'
  parameters: Array<{ type: 'text'; text: string }>
}

/** Validate Indian mobile number */
export const validateMobileNumber = (mobile: string): boolean => {
  if (!mobile) return false
  const cleaned = mobile.replace(/\D/g, '')
  const digits = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.slice(2) : cleaned
  return digits.length === 10 && /^[6-9]/.test(digits)
}

/** Format phone number for WhatsApp API (91XXXXXXXXXX) */
const formatPhoneNumber = (mobile: string): string => {
  const cleaned = mobile.replace(/\D/g, '')
  if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned
  if (cleaned.length === 10) return `91${cleaned}`
  return cleaned
}

/** Send WhatsApp template message */
export const sendWhatsAppTemplate = async (
  to: string,
  templateName: string,
  components: TemplateComponent[],
  language: string = 'hi'
): Promise<WhatsAppResponse> => {
  if (!TEAM_PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('WhatsApp credentials not configured')
    return { success: false, error: 'WhatsApp credentials not configured' }
  }

  if (!validateMobileNumber(to)) {
    return { success: false, error: `Invalid mobile: ${to}` }
  }

  try {
    const formattedPhone = formatPhoneNumber(to)
    const response = await fetch(`${WHATSAPP_API_URL}/${TEAM_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components,
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('WhatsApp API Error:', data)
      return { success: false, error: data.error?.message || 'Failed to send' }
    }

    return { success: true, messageId: data.messages?.[0]?.id }
  } catch (error: any) {
    console.error('WhatsApp Service Error:', error)
    return { success: false, error: error.message || 'Network error' }
  }
}

// ============ Company team numbers (always notified on new trip) ============
export const COMPANY_TEAM_NUMBERS = [
  '8052553000',
  '9555682185',
  '7080956572',
  '7307987155',
  '7080316518',
  '9794550466',
  '8738909805',
]

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE 1: transport_trip_customer  (Hindi)
// ═══════════════════════════════════════════════════════════════════
// Send to: Customer (Solar Lead)
//
// Meta template body (create manually in Meta Business Manager):
// ─────────────────────────────────────────────────
// नमस्ते {{1}} जी, 🙏

// आपके लोकेशन पर डिलीवरी/ट्रांसपोर्ट शेड्यूल किया गया है।

// 📋 ट्रिप नंबर: {{2}}
// 📅 तारीख: {{3}}
// 🚛 गाड़ी नंबर: {{4}}
// 👤 ड्राइवर: {{5}}
// 📞 ड्राइवर मोबाइल: {{6}}
// 📍 पिकअप: {{7}}
// 📍 डिलीवरी: {{8}}

// कृपया डिलीवरी के समय उपलब्ध रहें।
// - Mudrabase Team
// ─────────────────────────────────────────────────
// {{1}}=customer_name, {{2}}=trip_number, {{3}}=date,
// {{4}}=vehicle_number, {{5}}=driver_name, {{6}}=driver_mobile,
// {{7}}=source, {{8}}=destination
//
export const sendTripCustomerNotification = async (
  customerMobile: string,
  customerName: string,
  tripNumber: string,
  date: string,
  vehicleNumber: string,
  driverName: string,
  driverMobile: string,
  source: string,
  destination: string,
): Promise<WhatsAppResponse> => {
  const components: TemplateComponent[] = [{
    type: 'body',
    parameters: [
      { type: 'text', text: customerName || 'ग्राहक' },
      { type: 'text', text: tripNumber },
      { type: 'text', text: date },
      { type: 'text', text: vehicleNumber },
      { type: 'text', text: driverName || 'N/A' },
      { type: 'text', text: driverMobile || 'N/A' },
      { type: 'text', text: source },
      { type: 'text', text: destination },
    ],
  }]
  return sendWhatsAppTemplate(customerMobile, 'transport_trip_customer', components, 'hi')
}

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE 2: transport_trip_driver  (Hindi)
// ═══════════════════════════════════════════════════════════════════
// Send to: Driver — trip assignment notification
//
// Meta template body:
// ─────────────────────────────────────────────────
// नमस्ते {{1}} जी! 🙏

// आपको एक नई ट्रिप असाइन की गई है।

// 📋 ट्रिप नंबर: {{2}}
// 📅 तारीख: {{3}}
// 🚛 गाड़ी: {{4}}
// 📍 पिकअप: {{5}}
// 📍 डिलीवरी: {{6}}
// 👤 ग्राहक: {{7}}
// 📞 ग्राहक मोबाइल: {{8}}

// कृपया समय पर पहुँचें। शुरू और अंत में मीटर रीडिंग की फोटो जरूर लें।
// - Mudrabase Transportation
// ─────────────────────────────────────────────────
// {{1}}=driver_name, {{2}}=trip_number, {{3}}=date,
// {{4}}=vehicle_number, {{5}}=source, {{6}}=destination,
// {{7}}=customer_name, {{8}}=customer_mobile
//
export const sendTripDriverNotification = async (
  driverMobile: string,
  driverName: string,
  tripNumber: string,
  date: string,
  vehicleNumber: string,
  source: string,
  destination: string,
  customerName: string,
  customerMobile: string,
): Promise<WhatsAppResponse> => {
  const components: TemplateComponent[] = [{
    type: 'body',
    parameters: [
      { type: 'text', text: driverName || 'ड्राइवर' },
      { type: 'text', text: tripNumber },
      { type: 'text', text: date },
      { type: 'text', text: vehicleNumber },
      { type: 'text', text: source },
      { type: 'text', text: destination },
      { type: 'text', text: customerName || 'N/A' },
      { type: 'text', text: customerMobile || 'N/A' },
    ],
  }]
  return sendWhatsAppTemplate(driverMobile, 'transport_trip_driver', components, 'hi')
}

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE 3: transport_trip_owner  (Hindi)
// ═══════════════════════════════════════════════════════════════════
// Send to: Vehicle Owner/Vendor — trip info for their vehicle
//
// Meta template body:
// ─────────────────────────────────────────────────
// नमस्ते {{1}} जी! 🙏

// आपकी गाड़ी की एक नई ट्रिप बनाई गई है।

// 📋 ट्रिप नंबर: {{2}}
// 📅 तारीख: {{3}}
// 🚛 गाड़ी नंबर: {{4}}
// 👤 ड्राइवर: {{5}}
// 📍 रूट: {{6}} → {{7}}
// 💰 रेट: ₹{{8}}/km

// - Mudrabase Transportation
// ─────────────────────────────────────────────────
// {{1}}=owner_name, {{2}}=trip_number, {{3}}=date,
// {{4}}=vehicle_number, {{5}}=driver_name, {{6}}=source,
// {{7}}=destination, {{8}}=rate_per_km
//
export const sendTripOwnerNotification = async (
  ownerMobile: string,
  ownerName: string,
  tripNumber: string,
  date: string,
  vehicleNumber: string,
  driverName: string,
  source: string,
  destination: string,
  ratePerKm: string,
): Promise<WhatsAppResponse> => {
  const components: TemplateComponent[] = [{
    type: 'body',
    parameters: [
      { type: 'text', text: ownerName || 'मालिक' },
      { type: 'text', text: tripNumber },
      { type: 'text', text: date },
      { type: 'text', text: vehicleNumber },
      { type: 'text', text: driverName || 'N/A' },
      { type: 'text', text: source },
      { type: 'text', text: destination },
      { type: 'text', text: ratePerKm || '0' },
    ],
  }]
  return sendWhatsAppTemplate(ownerMobile, 'transport_trip_owner', components, 'hi')
}

// ═══════════════════════════════════════════════════════════════════
// TEMPLATE 4: transport_trip_team  (Hindi)
// ═══════════════════════════════════════════════════════════════════
// Send to: All 7 company team members — internal notification
//
// Meta template body:
// ─────────────────────────────────────────────────
// 🚛 नई ट्रिप बनाई गई!

// 📋 ट्रिप: {{1}}
// 📅 तारीख: {{2}}
// 🚛 गाड़ी: {{3}}
// 👤 ड्राइवर: {{4}}
// 📍 रूट: {{5}} → {{6}}
// 👤 ग्राहक: {{7}}
// 💰 रेट: ₹{{8}}/km

// - Mudrabase Transportation
// ─────────────────────────────────────────────────
// {{1}}=trip_number, {{2}}=date, {{3}}=vehicle_number,
// {{4}}=driver_name, {{5}}=source, {{6}}=destination,
// {{7}}=customer_name, {{8}}=rate_per_km
//
export const sendTripTeamNotification = async (
  teamMobile: string,
  tripNumber: string,
  date: string,
  vehicleNumber: string,
  driverName: string,
  source: string,
  destination: string,
  customerName: string,
  ratePerKm: string,
): Promise<WhatsAppResponse> => {
  const components: TemplateComponent[] = [{
    type: 'body',
    parameters: [
      { type: 'text', text: tripNumber },
      { type: 'text', text: date },
      { type: 'text', text: vehicleNumber },
      { type: 'text', text: driverName || 'N/A' },
      { type: 'text', text: source },
      { type: 'text', text: destination },
      { type: 'text', text: customerName || 'N/A' },
      { type: 'text', text: ratePerKm || '0' },
    ],
  }]
  return sendWhatsAppTemplate(teamMobile, 'transport_trip_team', components, 'hi')
}
