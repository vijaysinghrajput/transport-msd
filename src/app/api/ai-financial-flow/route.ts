import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEEPSEEK_API_KEY = 'sk-ddcd45a84e7646f3a13815ca4014c25e'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://skprvyuhxnlwyhjhukpr.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function createAuthClient(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

async function fetchDataContext(supabase: any) {
  // 1. Bank approval costs with leads
  const { data: bacData } = await supabase
    .from('bank_approval_costs')
    .select(`
      lead_id, margin_money, bank_expense, visiting_charge,
      margin_payment_status, expense_payment_status,
      bank_name,
      leads(customer_name, mobile, capacity_kw, status, project_type, finance_bank, source_user_name, branch:branches(name))
    `)

  // 2. Disbursements
  const { data: disbData } = await supabase.from('disbursements').select('*')

  // 3. Installations with teams
  const { data: instData } = await supabase
    .from('installations')
    .select(`
      lead_id, status, installation_date, completion_date,
      installation_cost, raw_materials_cost, total_installation_cost,
      installation_per_kw_rate, payment_status,
      installation_teams(team_name)
    `)

  // Build maps
  const bacMap = new Map<string, any>()
  ;(bacData || []).forEach((b: any) => { if (b.lead_id) bacMap.set(b.lead_id, b) })

  const disbMap = new Map<string, any>()
  ;(disbData || []).forEach((d: any) => disbMap.set(d.lead_id, d))

  const instMap = new Map<string, any>()
  ;(instData || []).forEach((inst: any) => { if (inst.lead_id) instMap.set(inst.lead_id, inst) })

  // Collect all unique lead_ids
  const allLeadIds = new Set<string>()
  bacMap.forEach((_, k) => allLeadIds.add(k))
  disbMap.forEach((_, k) => allLeadIds.add(k))
  instMap.forEach((_, k) => allLeadIds.add(k))

  // Build stats
  let totalLeads = 0
  let leadsWithBac = 0, leadsWithDisb = 0, leadsWithInst = 0, leadsAllThree = 0
  let totalMargin = 0, totalBankExp = 0, totalVisiting = 0
  let totalDisb = 0, totalFirstPay = 0, totalSecondPay = 0, totalCashPay = 0
  let totalInstCost = 0, totalRawMat = 0

  const branchStats: Record<string, { leads: number; bankExp: number; disb: number; instCost: number; complete: number }> = {}
  const leadDetails: Array<{
    name: string; branch: string; source: string; status: string
    bankExp: number; disb: number; instCost: number; net: number
    stage: string
  }> = []

  allLeadIds.forEach((leadId) => {
    totalLeads++
    const bac = bacMap.get(leadId)
    const disb = disbMap.get(leadId)
    const inst = instMap.get(leadId)

    const hasBac = bac && ((Number(bac.margin_money) || 0) + (Number(bac.bank_expense) || 0) + (Number(bac.visiting_charge) || 0)) > 0
    const hasDisb = !!disb
    const hasInst = !!inst

    if (hasBac) leadsWithBac++
    if (hasDisb) leadsWithDisb++
    if (hasInst) leadsWithInst++
    if (hasBac && hasDisb && hasInst) leadsAllThree++

    const margin = hasBac ? (Number(bac.margin_money) || 0) : 0
    const bankExp = hasBac ? (Number(bac.bank_expense) || 0) : 0
    const visiting = hasBac ? (Number(bac.visiting_charge) || 0) : 0
    const totalBE = margin + bankExp + visiting

    totalMargin += margin
    totalBankExp += bankExp
    totalVisiting += visiting

    const fp = Number(disb?.first_payment_amount) || 0
    const sp = Number(disb?.second_payment_amount) || 0
    const cp = Number(disb?.cash_payment_amount) || 0
    const totalD = fp + sp + cp

    totalDisb += totalD
    totalFirstPay += fp
    totalSecondPay += sp
    totalCashPay += cp

    const instCost = Number(inst?.total_installation_cost) || Number(inst?.installation_cost) || 0
    const rawMat = Number(inst?.raw_materials_cost) || 0
    totalInstCost += instCost
    totalRawMat += rawMat

    const net = totalD - totalBE - instCost

    // Determine stage
    let stage = 'no_data'
    if (hasBac && hasDisb && hasInst) stage = 'complete'
    else if (hasBac && hasDisb) stage = 'bank_disb'
    else if (hasBac && hasInst) stage = 'bank_inst'
    else if (hasDisb && hasInst) stage = 'disb_inst'
    else if (hasBac) stage = 'bank_only'
    else if (hasDisb) stage = 'disb_only'
    else if (hasInst) stage = 'inst_only'

    // Branch stats
    const lead = bac?.leads || null
    const branchName = lead?.branch?.name || 'Unknown'
    const sourceName = lead?.source_user_name || disb?.customer_name || 'Unknown'
    const leadStatus = lead?.status || 'unknown'

    if (!branchStats[branchName]) branchStats[branchName] = { leads: 0, bankExp: 0, disb: 0, instCost: 0, complete: 0 }
    branchStats[branchName].leads++
    branchStats[branchName].bankExp += totalBE
    branchStats[branchName].disb += totalD
    branchStats[branchName].instCost += instCost
    if (stage === 'complete') branchStats[branchName].complete++

    leadDetails.push({
      name: lead?.customer_name || disb?.customer_name || 'N/A',
      branch: branchName, source: sourceName, status: leadStatus,
      bankExp: totalBE, disb: totalD, instCost, net, stage,
    })
  })

  return {
    summary: {
      totalLeads, leadsWithBac, leadsWithDisb, leadsWithInst, leadsAllThree,
      totalMargin, totalBankExp, totalVisiting,
      totalExpenses: totalMargin + totalBankExp + totalVisiting,
      totalDisb, totalFirstPay, totalSecondPay, totalCashPay,
      totalInstCost, totalRawMat,
      netPosition: totalDisb - (totalMargin + totalBankExp + totalVisiting) - totalInstCost,
    },
    branchStats,
    leadDetails: leadDetails.slice(0, 60),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [], accessToken } = body

    if (!message) return NextResponse.json({ error: 'message is required' }, { status: 400 })
    if (!accessToken) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const supabase = createAuthClient(accessToken)
    const ctx = await fetchDataContext(supabase)

    const systemPrompt = `तुम Mudrabase Solar का AI Financial Flow Analyst हो। कंपनी सोलर पैनल इंस्टॉलेशन करती है।
तुम्हारे पास LIVE डेटा है तीन financial stages का: Bank Expenses (outflow) → Disbursement (inflow) → Installation Cost (outflow)।

## मौजूदा डेटा:
- कुल Leads (financial flow में): ${ctx.summary.totalLeads}
- Bank Expense वाले: ${ctx.summary.leadsWithBac}
- Disbursement वाले: ${ctx.summary.leadsWithDisb}
- Installation वाले: ${ctx.summary.leadsWithInst}
- Complete Flow (तीनों): ${ctx.summary.leadsAllThree}

## OUTFLOW — Bank Expenses:
- कुल Margin Money: ₹${ctx.summary.totalMargin.toLocaleString('en-IN')}
- कुल Bank Expense: ₹${ctx.summary.totalBankExp.toLocaleString('en-IN')}
- कुल Visiting Charge: ₹${ctx.summary.totalVisiting.toLocaleString('en-IN')}
- कुल Bank Expenses: ₹${ctx.summary.totalExpenses.toLocaleString('en-IN')}

## INFLOW — Disbursement:
- कुल Disbursement: ₹${ctx.summary.totalDisb.toLocaleString('en-IN')}
- 1st Payment: ₹${ctx.summary.totalFirstPay.toLocaleString('en-IN')}
- 2nd Payment: ₹${ctx.summary.totalSecondPay.toLocaleString('en-IN')}
- Cash Payment: ₹${ctx.summary.totalCashPay.toLocaleString('en-IN')}

## OUTFLOW — Installation:
- कुल Installation Cost: ₹${ctx.summary.totalInstCost.toLocaleString('en-IN')}
- Raw Materials: ₹${ctx.summary.totalRawMat.toLocaleString('en-IN')}

## NET POSITION:
₹${ctx.summary.netPosition.toLocaleString('en-IN')} (Disbursement - Bank Expenses - Installation Cost)

## BRANCH DATA:
${Object.entries(ctx.branchStats).map(([b, s]) => `${b}: ${s.leads} leads, Bank: ₹${s.bankExp.toLocaleString('en-IN')}, Disb: ₹${s.disb.toLocaleString('en-IN')}, Install: ₹${s.instCost.toLocaleString('en-IN')}, Complete: ${s.complete}`).join('\n')}

## LEAD DETAILS (60 sample):
${ctx.leadDetails.map(l => `${l.name} | ${l.branch} | ${l.source} | ${l.status} | BankExp: ₹${l.bankExp.toLocaleString('en-IN')} | Disb: ₹${l.disb.toLocaleString('en-IN')} | Install: ₹${l.instCost.toLocaleString('en-IN')} | Net: ₹${l.net.toLocaleString('en-IN')} | Stage: ${l.stage}`).join('\n')}

## जवाब देने के नियम (ज़रूर पालन करो):
1. भाषा: हमेशा हिंदी (देवनागरी लिपि) में जवाब दो। Technical शब्द जैसे disbursement, margin, expense, branch, lead, installation, net position अंग्रेज़ी में रख सकते हो, बाकी सब हिंदी में।
2. FORMATTING: Markdown formatting use करो:
   - **bold** ज़रूरी numbers और names के लिए
   - ## section headings के लिए
   - bullet points (- ) lists के लिए
   - | table rows comparison दिखाने के लिए
3. आँकड़े दिखाना: जब important numbers दिखाने हो:
   📊 कुल Leads: **${ctx.summary.totalLeads}** | Bank Exp: **₹X.XL** | Disb: **₹X.XL** | Install: **₹X.XL**
4. चेतावनी: Problems highlight करो:
   ⚠️ X leads का complete flow नहीं है!
   ✅ गोरखपुर branch का net position सबसे अच्छा है
5. हर जवाब के अंत में actionable सुझाव दो 💡 के साथ
6. रकम हमेशा ₹ INR format में — लाखों में दिखाओ (जैसे ₹15.7L)
7. जवाब छोटा और डेटा से भरपूर रखो
8. जब comparison हो तब TABLE format use करो
9. Emojis: 📊 आँकड़े, ⚠️ चेतावनी, ✅ अच्छा, 💡 सुझाव, 🏢 branch, 💰 पैसा, 🔧 installation, 🏦 bank
10. बिल्कुल भी Roman/English transliteration (जैसे "kya", "hai", "nahi") मत लिखो। सिर्फ़ देवनागरी हिंदी में लिखो।`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages, max_tokens: 800, temperature: 0.7, stream: false }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} ${errText}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.'

    return NextResponse.json({ reply, stats: ctx.summary })
  } catch (error: any) {
    console.error('AI Financial Flow error:', error)
    return NextResponse.json({ error: error.message || 'AI service error' }, { status: 500 })
  }
}
