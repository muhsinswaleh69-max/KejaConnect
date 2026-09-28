export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const key = process.env.MPESA_CONSUMER_KEY
    const secret = process.env.MPESA_CONSUMER_SECRET
    const env = process.env.MPESA_ENV || 'sandbox'

    if (!key || !secret) {
      return NextResponse.json({ error: "Missing MPESA_CONSUMER_KEY or SECRET in Vercel env" }, { status: 500 })
    }

    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const url = env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    })

    const data = await res.json()
    return NextResponse.json(data)

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
