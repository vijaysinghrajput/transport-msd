import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEEPSEEK_API_KEY = 'sk-ddcd45a84e7646f3a13815ca4014c25e'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://skprvyuhxnlwyhjhukpr.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create an authenticated Supabase client using the user's access token
function createAuthClient(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

// Fetch live data context for AI
async function fetchDataContext(supabase: any) {
  // 1. Overall stats
  const { data: overallStats } = await supabase.rpc('get_pending_disbursement_stats').maybeSingle()

  // Fallback: manual query
  const { data: bacData, error: bacError } = await supabase
    .from('bank_approval_costs')
    .select(`
      lead_id, margin_money, bank_expense, visiting_charge,
      margin_payment_status, expense_payment_status, visiting_payment_status,
      bank_name,
      leads(customer_name, mobile, capacity_kw, status, project_type, finance_bank, source_user_name, branch:branches(name))
    `)

  if (bacError) console.error('BAC query error:', bacError)
  console.log('BAC data count:', bacData?.length || 0)

  const { data: disbData, error: disbError } = await supabase.from('disbursements').select('*')
  if (disbError) console.error('Disb query error:', disbError)

  // Build disbursement map
  const disbMap = new Map<string, any>()
  ;(disbData || []).forEach((d: any) => disbMap.set(d.lead_id, d))

  // Build stats
  let totalLeads = 0, noDisb = 0, pending = 0, partial = 0, completed = 0
  let totalMargin = 0, totalBankExp = 0, totalVisiting = 0, totalReceived = 0
  const branchStats: Record<string, { leads: number; expense: number; received: number; noDisb: number }> = {}
  const sourceStats: Record<string, { leads: number; expense: number; received: number }> = {}
  const leadStatusDist: Record<string, number> = {}
  const leadDetails: Array<{
    name: string; branch: string; source: string; status: string;
    margin: number; bankExp: number; visiting: number; totalExp: number;
    received: number; disbStatus: string
  }> = []

  ;(bacData || []).forEach((item: any) => {
    const margin = Number(item.margin_money) || 0
    const bankExp = Number(item.bank_expense) || 0
    const visiting = Number(item.visiting_charge) || 0
    const total = margin + bankExp + visiting
    if (total <= 0) return

    totalLeads++
    totalMargin += margin
    totalBankExp += bankExp
    totalVisiting += visiting

    const lead = item.leads as any
    const disb = disbMap.get(item.lead_id)
    const branchName = lead?.branch?.name || 'Unknown'
    const sourceName = lead?.source_user_name || 'Unknown'
    const leadStatus = lead?.status || 'unknown'
    const received = (Number(disb?.first_payment_amount) || 0) + (Number(disb?.second_payment_amount) || 0) + (Number(disb?.cash_payment_amount) || 0)
    totalReceived += received

    if (!disb) noDisb++
    else if (disb.overall_status === 'pending') pending++
    else if (disb.overall_status === 'partial') partial++
    else if (disb.overall_status === 'completed') completed++

    // Branch stats
    if (!branchStats[branchName]) branchStats[branchName] = { leads: 0, expense: 0, received: 0, noDisb: 0 }
    branchStats[branchName].leads++
    branchStats[branchName].expense += total
    branchStats[branchName].received += received
    if (!disb) branchStats[branchName].noDisb++

    // Source stats
    if (!sourceStats[sourceName]) sourceStats[sourceName] = { leads: 0, expense: 0, received: 0 }
    sourceStats[sourceName].leads++
    sourceStats[sourceName].expense += total
    sourceStats[sourceName].received += received

    // Lead status
    leadStatusDist[leadStatus] = (leadStatusDist[leadStatus] || 0) + 1

    leadDetails.push({
      name: lead?.customer_name || 'N/A',
      branch: branchName,
      source: sourceName,
      status: leadStatus,
      margin, bankExp, visiting, totalExp: total,
      received,
      disbStatus: disb ? disb.overall_status : 'no_record'
    })
  })

  return {
    summary: { totalLeads, noDisb, pending, partial, completed, totalMargin, totalBankExp, totalVisiting, totalExpenses: totalMargin + totalBankExp + totalVisiting, totalReceived },
    branchStats,
    sourceStats,
    leadStatusDist,
    leadDetails: leadDetails.slice(0, 50), // limit for context size
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [], accessToken } = body

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Create authenticated Supabase client with user's token
    const supabase = createAuthClient(accessToken)

    // Fetch live data
    const ctx = await fetchDataContext(supabase)

    const systemPrompt = `तुम Mudrabase Solar का AI Financial Assistant हो। कंपनी सोलर पैनल इंस्टॉलेशन करती है।
तुम्हारे पास LIVE डेटा है bank expenses (margin money, bank expenses, visiting charges) और disbursements का।

## मौजूदा डेटा:
- कुल Leads (जिनका expense हुआ): ${ctx.summary.totalLeads}
- No Disbursement (कोई पेमेंट नहीं आई): ${ctx.summary.noDisb}
- Disbursement Pending: ${ctx.summary.pending}
- Disbursement Partial: ${ctx.summary.partial}
- Disbursement Completed: ${ctx.summary.completed}
- कुल Margin Money दिया: ₹${ctx.summary.totalMargin.toLocaleString('en-IN')}
- कुल Bank Expense दिया: ₹${ctx.summary.totalBankExp.toLocaleString('en-IN')}
- कुल Visiting Charge: ₹${ctx.summary.totalVisiting.toLocaleString('en-IN')}
- कुल Expense दिया: ₹${ctx.summary.totalExpenses.toLocaleString('en-IN')}
- कुल Disbursement मिला: ₹${ctx.summary.totalReceived.toLocaleString('en-IN')}

## BRANCH DATA:
${Object.entries(ctx.branchStats).map(([b, s]) => `${b}: ${s.leads} leads, ₹${s.expense.toLocaleString('en-IN')} expense, ₹${s.received.toLocaleString('en-IN')} मिला, ${s.noDisb} pending`).join('\n')}

## TOP SOURCES (Salesperson):
${Object.entries(ctx.sourceStats).sort((a, b) => b[1].expense - a[1].expense).slice(0, 15).map(([s, d]) => `${s}: ${d.leads} leads, ₹${d.expense.toLocaleString('en-IN')} expense, ₹${d.received.toLocaleString('en-IN')} मिला`).join('\n')}

## LEAD STATUS:
${Object.entries(ctx.leadStatusDist).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${s.replace(/_/g, ' ')}: ${c}`).join(', ')}

## LEAD DETAILS (50 sample):
${ctx.leadDetails.map(l => `${l.name} | ${l.branch} | ${l.source} | ${l.status} | Exp: ₹${l.totalExp.toLocaleString('en-IN')} (M:₹${l.margin}, B:₹${l.bankExp}, V:₹${l.visiting}) | मिला: ₹${l.received.toLocaleString('en-IN')} | Disb: ${l.disbStatus}`).join('\n')}

## जवाब देने के नियम (ज़रूर पालन करो):
1. भाषा: हमेशा हिंदी (देवनागरी लिपि) में जवाब दो। जैसे "सबसे ज़्यादा" लिखो, "sabse zyada" नहीं। Technical शब्द जैसे disbursement, margin, expense, branch, lead अंग्रेज़ी में रख सकते हो, बाकी सब हिंदी में।
2. FORMATTING: Markdown formatting use करो:
   - **bold** ज़रूरी numbers और names के लिए
   - ## section headings के लिए
   - bullet points (- ) lists के लिए
   - | table rows comparison दिखाने के लिए:
     | ब्रांच | लीड्स | खर्चा | मिला |
     |--------|-------|---------|----------|
     | नाम   | 10    | ₹1,000  | ₹500     |
3. आँकड़े दिखाना: जब important numbers दिखाने हो:
   📊 कुल Leads: **139** | खर्चा: **₹15.7L** | मिला: **₹85.3L**
4. चेतावनी: Problems highlight करो:
   ⚠️ 74 leads का कोई disbursement record नहीं है!
   ✅ गोरखपुर branch ने सबसे ज़्यादा amount receive किया
5. हर जवाब के अंत में actionable सुझाव दो 💡 के साथ
6. रकम हमेशा ₹ INR format में — लाखों में दिखाओ (जैसे ₹15.7L)
7. जवाब छोटा और डेटा से भरपूर रखो — बहुत लंबा मत बनाओ
8. जब comparison हो तब TABLE format use करो
9. Emojis use करो: 📊 आँकड़े, ⚠️ चेतावनी, ✅ अच्छा, 💡 सुझाव, 🏢 branch, 👤 source, 💰 पैसा
10. बिल्कुल भी Roman/English transliteration (जैसे "kya", "hai", "nahi") मत लिखो। सिर्फ़ देवनागरी हिंदी में लिखो।`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 800,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} ${errText}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.'

    return NextResponse.json({ reply, stats: ctx.summary })
  } catch (error: any) {
    console.error('AI Disbursement error:', error)
    return NextResponse.json({ error: error.message || 'AI service error' }, { status: 500 })
  }
}
