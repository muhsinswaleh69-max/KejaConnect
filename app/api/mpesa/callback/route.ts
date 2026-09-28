export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const kejaId = url.searchParams.get('kejaId') || 'unknown'
    const type = url.searchParams.get('type') || 'viewing'
    const phone = url.searchParams.get('phone') || ''
    const amount = Number(url.searchParams.get('amount') || 0)

    const body = await req.json()
    console.log("🔔 MPESA CALLBACK:", JSON.stringify(body).slice(0, 1000))

    const stkCallback = body?.Body?.stkCallback
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted but no stkCallback" })
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback

    let mpesaReceipt = null
    let amountPaid = amount
    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value
        if (item.Name === 'Amount') amountPaid = item.Value
      }
    }

    const status = ResultCode === 0 ? 'success' : 'failed'

    const { error } = await supabase.from('payments').insert({
      keja_id: kejaId,
      phone,
      amount: amountPaid,
      type,
      checkout_request_id: CheckoutRequestID,
      merchant_request_id: MerchantRequestID,
      mpesa_receipt: mpesaReceipt,
      result_code: ResultCode,
      result_desc: ResultDesc,
      status,
      raw_callback: body
    })

    if (error) console.error("Supabase insert error:", error)
    else console.log(`✅ Saved ${status} payment for keja ${kejaId}`)

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })

  } catch (e: any) {
    console.error("Callback error:", e.message)
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted with error" })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  return NextResponse.json({
    message: "Callback active - waiting for POST from Safaricom",
    query: Object.fromEntries(url.searchParams.entries())
  })
}
