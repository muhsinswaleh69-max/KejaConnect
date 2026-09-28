export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // ===== 1. READ BODY SAFELY =====
    const rawText = await req.text()
    if (!rawText) {
      return NextResponse.json({ error: "Empty body - send {phone, amount}" }, { status: 400 })
    }
    let body: any
    try {
      body = JSON.parse(rawText)
    } catch {
      return NextResponse.json({ error: "Body not JSON", got: rawText.slice(0, 200) }, { status: 400 })
    }

    let phone = (body.phone || "").toString().replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '254' + phone.slice(1)
    if (phone.startsWith('7')) phone = '254' + phone
    if (phone.length < 12) {
      return NextResponse.json({ error: `Bad phone: ${body.phone} -> ${phone}. Use 07... or 2547...` }, { status: 400 })
    }

    const amount = Number(body.amount) || 200
    const kejaId = body.kejaId || 'test'
    const type = body.type || 'viewing'

    // ===== 2. TEMP DEBUG KEYS - REPLACE HERE =====
    // TODO: Replace with your real Daraja Sandbox keys
    const DEBUG_KEY = "PASTE_YOUR_CONSUMER_KEY_HERE" // e.g. lN7a6qQJz...
    const DEBUG_SECRET = "PASTE_YOUR_CONSUMER_SECRET_HERE" // e.g. 9a6qQJz...

    const key = process.env.MPESA_CONSUMER_KEY || DEBUG_KEY
    const secret = process.env.MPESA_CONSUMER_SECRET || DEBUG_SECRET
    const shortcode = process.env.MPESA_SHORTCODE || '174379'
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://keja-connect-htuai1cf6-muhsin9.vercel.app/api/mpesa/callback'
    const env = process.env.MPESA_ENV || 'sandbox'

    // Check if still placeholder
    if (key.includes("PASTE_YOUR") || secret.includes("PASTE_YOUR")) {
      return NextResponse.json({ 
        error: "You forgot to replace PASTE_YOUR keys in code! Open route.ts line 30",
        hasEnvKey: !!process.env.MPESA_CONSUMER_KEY,
        hasEnvSecret: !!process.env.MPESA_CONSUMER_SECRET
      }, { status: 500 })
    }

    // ===== 3. GET TOKEN FROM SAFARICOM (using .text() not .json() to avoid crash) =====
    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const tokenRaw = await fetch(tokenUrl, {
      headers: { Authorization: `Basic ${auth}` },
      cache: 'no-store'
    })
    
    const tokenText = await tokenRaw.text()
    
    let tokenData: any
    try {
      tokenData = JSON.parse(tokenText)
    } catch {
      return NextResponse.json({
        error: "Safaricom token not JSON - check KEY/SECRET",
        safaricom_raw: tokenText.slice(0, 500),
        tokenUrl,
        env,
        keyLength: key.length,
        usedKeyPrefix: key.slice(0, 4) + "...",
      }, { status: 500 })
    }

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "No access_token from Safaricom", safaricom: tokenData, tokenUrl }, { status: 500 })
    }

    // ===== 4. STK PUSH =====
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRaw = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
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
        TransactionDesc: `${type} payment`
      })
    })

    const stkText = await stkRaw.text()
    let stkData: any
    try {
      stkData = JSON.parse(stkText)
    } catch {
      return NextResponse.json({ error: "Safaricom STK not JSON", safaricom_raw: stkText.slice(0, 500) }, { status: 500 })
    }

    return NextResponse.json(stkData)

  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.slice(0, 500) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "STK API live - POST {phone, amount}", env: process.env.MPESA_ENV || 'sandbox' })
}
