export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let phone = (body.phone || "").toString().replace(/\D/g,'')
    if (phone.startsWith('0')) phone = '254' + phone.slice(1)
    if (phone.startsWith('7')) phone = '254' + phone
    const amount = Number(body.amount) || 200
    const kejaId = body.kejaId || '8'
    const type = body.type || 'viewing'

    const key = process.env.MPESA_CONSUMER_KEY!
    const secret = process.env.MPESA_CONSUMER_SECRET!
    const shortcode = process.env.MPESA_SHORTCODE || '174379'
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://keja-connect-nemtqlwof-muhsin9.vercel.app/api/mpesa/callback'
    const env = process.env.MPESA_ENV || 'sandbox'

    if (!key || !secret) return NextResponse.json({ error: "Missing MPESA keys in Vercel ENV" }, { status: 500 })

    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const tokenRes = await fetch(tokenUrl, { headers: { Authorization: `Basic ${auth}` } })
    const tokenText = await tokenRes.text()
    const tokenData = JSON.parse(tokenText)
    if (!tokenData.access_token) return NextResponse.json({ error: "Token failed", safaricom: tokenText.slice(0,500) }, { status: 500 })

    const timestamp = new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRes = await fetch(stkUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: `${callbackUrl}?kejaId=${kejaId}&type=${type}&phone=${phone}&amount=${amount}`,
        AccountReference: `Keja-${kejaId}`,
        TransactionDesc: `${type}`
      })
    })
    const stkText = await stkRes.text()
    const stkData = JSON.parse(stkText)
    return NextResponse.json(stkData)

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
export async function GET(){ return NextResponse.json({ status: "STK API live" }) }
