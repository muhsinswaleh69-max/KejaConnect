export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const txt = await req.text()
    if (!txt) return NextResponse.json({ error: "Empty body - send {phone, amount}" }, { status: 400 })
    let body: any
    try { body = JSON.parse(txt) } catch { return NextResponse.json({ error: "Body not JSON", got: txt.slice(0,200) }, { status: 400 }) }

    let phone = (body.phone || "").toString().replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '254' + phone.slice(1)
    if (phone.startsWith('7')) phone = '254' + phone
    if (phone.length < 12) return NextResponse.json({ error: `Bad phone: ${body.phone}`, fixed: phone }, { status: 400 })

    const amount = Number(body.amount) || 200

    // ENV CHECK
    const key = process.env.MPESA_CONSUMER_KEY
    const secret = process.env.MPESA_CONSUMER_SECRET
    const shortcode = process.env.MPESA_SHORTCODE || '174379'
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL
    const env = process.env.MPESA_ENV || 'sandbox'

    if (!key || !secret || !passkey || !callbackUrl) {
      return NextResponse.json({ error: "Set MPESA vars in Vercel!", envCheck: { hasKey: !!key, hasSecret: !!secret, hasPasskey: !!passkey, hasCallback: !!callbackUrl, env } }, { status: 500 })
    }

    // 1. TOKEN - use .text() not .json() to avoid crash
    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const tokenRaw = await fetch(tokenUrl, { headers: { Authorization: `Basic ${auth}` } })
    const tokenText = await tokenRaw.text()
    let tokenData: any
    try { tokenData = JSON.parse(tokenText) } catch {
      return NextResponse.json({ error: "Safaricom token not JSON - check KEY/SECRET", safaricom_raw: tokenText.slice(0,500), tokenUrl, env }, { status: 500 })
    }

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "No access_token", safaricom: tokenData }, { status: 500 })
    }

    // 2. STK PUSH
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
    const stkUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRaw = await fetch(stkUrl, {
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
        CallBackURL: `${callbackUrl}?kejaId=${body.kejaId || 'test'}&type=${body.type || 'viewing'}&phone=${phone}&amount=${amount}`,
        AccountReference: `Keja-${body.kejaId || 'test'}`,
        TransactionDesc: `${body.type || 'viewing'} payment`
      })
    })

    const stkText = await stkRaw.text()
    let stkData: any
    try { stkData = JSON.parse(stkText) } catch {
      return NextResponse.json({ error: "Safaricom STK not JSON", safaricom_raw: stkText.slice(0, 500) }, { status: 500 })
    }

    return NextResponse.json(stkData)

  } catch (e: any) {
    return NextResponse.json({ error: e.message, where: "outer catch" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "STK API live", need: "POST {phone, amount}" })
}
