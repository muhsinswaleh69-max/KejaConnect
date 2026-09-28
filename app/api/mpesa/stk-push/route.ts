export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const text = await req.text()
    if(!text || text.trim()===""){
      return NextResponse.json({error:"Send phone in body: {phone, amount}"}, {status:400})
    }
    let body:any
    try{ body = JSON.parse(text) }catch{
      return NextResponse.json({error:"Invalid JSON body", raw:text.slice(0,200)}, {status:400})
    }

    let phone = (body.phone||"").toString().replace(/\D/g,'')
    if(phone.startsWith('0')) phone='254'+phone.slice(1)
    if(phone.startsWith('7')) phone='254'+phone
    const amount = Number(body.amount)||200
    const kejaId = body.kejaId||'test'
    const type = body.type||'viewing'

    if(phone.length < 12) return NextResponse.json({error:`Phone invalid: ${body.phone} -> ${phone}. Use 07... or 2547...`}, {status:400})

    const key = process.env.MPESA_CONSUMER_KEY
    const secret = process.env.MPESA_CONSUMER_SECRET
    const shortcode = process.env.MPESA_SHORTCODE || '174379'
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL
    const env = process.env.MPESA_ENV || 'sandbox'

    if(!key||!secret||!passkey||!callbackUrl) return NextResponse.json({error:"Missing env vars", check:{key:!!key, secret:!!secret, passkey:!!passkey, callback:!!callbackUrl}}, {status:500})

    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const tokenUrl = env==='sandbox' ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials' : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    const tokenRes = await fetch(tokenUrl, {headers:{Authorization:`Basic ${auth}`}})
    const tokenData = await tokenRes.json()
    if(!tokenData.access_token) return NextResponse.json({error:"Token failed", details:tokenData}, {status:500})

    const timestamp = new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
    const stkUrl = env==='sandbox' ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest' : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRes = await fetch(stkUrl,{
      method:'POST',
      headers:{Authorization:`Bearer ${tokenData.access_token}`, 'Content-Type':'application/json'},
      body:JSON.stringify({
        BusinessShortCode:shortcode,
        Password:password,
        Timestamp:timestamp,
        TransactionType:"CustomerPayBillOnline",
        Amount:amount,
        PartyA:phone,
        PartyB:shortcode,
        PhoneNumber:phone,
        CallBackURL:`${callbackUrl}?kejaId=${kejaId}&type=${type}&phone=${phone}&amount=${amount}`,
        AccountReference:`Keja-${kejaId}`,
        TransactionDesc:`${type} payment`
      })
    })
    const stkData = await stkRes.json()
    return NextResponse.json(stkData)

  } catch(e:any){
    return NextResponse.json({error:e.message, stack:e.stack?.slice(0,300)}, {status:500})
  }
}

export async function GET(){ return NextResponse.json({ok:true, msg:"STK API ready, POST with {phone, amount}"}) }
