export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { phone, amount, kejaId, type } = await req.json()

    let cleanPhone = phone.toString().replace(/\D/g,'')
    if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.slice(1)
    if (cleanPhone.startsWith('7')) cleanPhone = '254' + cleanPhone

    // LOOP BIZ DETAILS - YOUR REAL PAYBILL
    const shortcode = "714888" // Loop Biz Paybill
    const accountRef = `467108${kejaId ? '-' + kejaId : ''}` // e.g. 467108-8

    // Daraja credentials for 714888
    const key = process.env.MPESA_CONSUMER_KEY!
    const secret = process.env.MPESA_CONSUMER_SECRET!
    const passkey = process.env.MPESA_PASSKEY! // MUST be passkey for 714888
    const env = process.env.MPESA_ENV || 'production' // use production for real paybill

    const callbackUrl = process.env.MPESA_CALLBACK_URL!

    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const tokenRes = await fetch(tokenUrl, { headers: { Authorization: `Basic ${auth}` } })
    const { access_token } = await tokenRes.json()
    if (!access_token) throw new Error("Failed to get token")

    const timestamp = new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const res = await fetch(stkUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: cleanPhone,
        PartyB: shortcode,
        PhoneNumber: cleanPhone,
        CallBackURL: `${callbackUrl}?kejaId=${kejaId}&type=${type}&phone=${cleanPhone}&amount=${amount}`,
        AccountReference: accountRef, // This shows as 467108-8 in your Loop statement
        TransactionDesc: `${type} for Keja ${kejaId}`
      })
    })

    const data = await res.json()
    return NextResponse.json(data)

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ paybill: "714888", account: "467108", status: "Loop Biz STK live" })
}
