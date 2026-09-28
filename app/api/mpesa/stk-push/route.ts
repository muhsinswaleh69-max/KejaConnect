export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { phone, amount, kejaId, type } = await req.json()

    let cleanPhone = (phone || "").toString().replace(/\D/g,'')
    if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.slice(1)
    if (cleanPhone.startsWith('7')) cleanPhone = '254' + cleanPhone

    // LOOP BIZ
    const shortcode = process.env.MPESA_SHORTCODE || "714888"
    const accountRef = `467108-${kejaId || '8'}`

    const key = process.env.MPESA_CONSUMER_KEY
    const secret = process.env.MPESA_CONSUMER_SECRET
    const passkey = process.env.MPESA_PASSKEY
    const env = process.env.MPESA_ENV || 'sandbox'
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://keja-connect-2kyo2znd5-muhsin9.vercel.app/api/mpesa/callback'

    if (!key || !secret || !passkey) {
      return NextResponse.json({ 
        error: "Missing ENV in Vercel",
        missing: { hasKey: !!key, hasSecret: !!secret, hasPasskey: !!passkey },
        fix: "Go Vercel → Settings → Env Vars → Add MPESA_PASSKEY for 714888"
      }, { status: 500 })
    }

    // 1. Get token
    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const tokenRes = await fetch(tokenUrl, { headers: { Authorization: `Basic ${auth}` } })
    const tokenText = await tokenRes.text()
    let tokenJson: any
    try { tokenJson = JSON.parse(tokenText) } catch { return NextResponse.json({ error: "Token not JSON", raw: tokenText.slice(0,500) }, { status: 500 }) }

    if (!tokenJson.access_token) {
      return NextResponse.json({ error: "Token failed", details: tokenJson, raw: tokenText.slice(0,500) }, { status: 500 })
    }

    // 2. STK
    const timestamp = new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const stkUrl = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRes = await fetch(stkUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenJson.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Number(amount) || 1,
        PartyA: cleanPhone,
        PartyB: shortcode,
        PhoneNumber: cleanPhone,
        CallBackURL: `${callbackUrl}?kejaId=${kejaId}&type=${type}&phone=${cleanPhone}&amount=${amount}`,
        AccountReference: accountRef,
        TransactionDesc: `${type} Keja ${kejaId}`
      })
    })

    const stkText = await stkRes.text()
    let stkJson: any
    try { stkJson = JSON.parse(stkText) } 
    catch { 
      return NextResponse.json({ 
        error: "Safaricom returned non-JSON - usually WRONG PASSKEY or SHORTCODE not approved for STK", 
        shortcode, env, 
        rawResponse: stkText.slice(0,800),
        hint: "For Paybill 714888 you MUST use Production keys from NCBA/Loop, not Sandbox 174379 keys"
      }, { status: 500 })
    }

    return NextResponse.json(stkJson)

  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.slice(0,500) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ paybill: "714888", account: "467108", status: "Loop Biz STK live - POST to test" })
}
