export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use SERVICE ROLE key for callback (bypasses RLS)
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
    console.log("🔔 MPESA CALLBACK RECEIVED:", JSON.stringify(body, null, 2))

    const stkCallback = body?.Body?.stkCallback

    if (!stkCallback) {
      console.log("No stkCallback in body")
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted but no stkCallback" })
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback

    let mpesaReceipt = null
    let amountPaid = amount

    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value
        if (item.Name === 'Amount') amountPaid = item.Value
      }
    }

    const status = ResultCode === 0 ? 'success' : 'failed'

    // 1. SAVE TO SUPABASE
    const { error } = await supabase.from('payments').insert({
      keja_id: kejaId,
      phone: phone,
      amount: amountPaid,
      type: type,
      checkout_request_id: CheckoutRequestID,
      merchant_request_id: MerchantRequestID,
      mpesa_receipt: mpesaReceipt,
      result_code: ResultCode,
      result_desc: ResultDesc,
      status: status,
      raw_callback: body
    })

    if (error) {
      console.error("❌ Supabase insert failed:", error)
    } else {
      console.log(`✅ Payment saved: ${status} - ${kejaId} - ${phone} - KSh ${amountPaid}`)
    }

    // 2. OPTIONAL: If viewing payment success, you can mark keja or create a viewing record
    if (ResultCode === 0 && type === 'viewing') {
      // Example: create viewings table if you have it
      // await supabase.from('viewings').insert({ keja_id: kejaId, phone, paid: true })
    }

    // 3. ALWAYS return success to Safaricom or they will retry
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })

  } catch (e: any) {
    console.error("Callback error:", e)
    // Still return 0 to Safaricom so they don't keep retrying
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted with error" })
  }
}

// Safaricom will test with GET sometimes
export async function GET(req: Request) {
  const url = new URL(req.url)
  return NextResponse.json({ 
    message: "Callback active - waiting for POST from Safaricom",
    query: Object.fromEntries(url.searchParams.entries())
  })
}
