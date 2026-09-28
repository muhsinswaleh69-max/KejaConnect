"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function KejaPage() {
  const params = useParams()
  const id = params.id as string

  const [keja, setKeja] = useState<any>(null)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState('')
  const [payments, setPayments] = useState<any[]>([])

  // Loop Biz Constants
  const PAYBILL = "714888"
  const ACCOUNT_BASE = "467108"
  const accountRef = `${ACCOUNT_BASE}-${id}`

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('kejas').select('*').eq('id', id).single()
      if (data) setKeja(data)
      else setKeja({ id, title: `Keja #${id}`, price: 8500, location: 'Mumias', description: '1 Bedroom - SKYNET CYBER Listing' })

      const { data: pays } = await supabase.from('payments').select('*').eq('keja_id', id).order('created_at', { ascending: false }).limit(5)
      if (pays) setPayments(pays)
    }
    load()
  }, [id])

  const pay = async (type: 'viewing' | 'rent') => {
    if (!phone) return alert('Enter M-Pesa phone: 07... or 2547...')
    let p = phone.replace(/\D/g, '')
    if (p.startsWith('0')) p = '254' + p.slice(1)
    if (p.startsWith('7')) p = '254' + p
    if (p.length < 12) return alert(`Invalid phone: ${phone}`)

    const amount = type === 'viewing' ? 200 : keja?.price || 8500

    setLoading(true)
    setLog(`Sending STK KSh ${amount} to ${p} via Loop Biz ${PAYBILL}...`)

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: p, amount, kejaId: id, type })
      })

      const text = await res.text()
      let data: any
      try { data = JSON.parse(text) } catch { data = { raw: text } }

      console.log('STK RESULT:', data)
      setLog(JSON.stringify(data, null, 2))

      if (data.ResponseCode === 0 || data.ResponseCode === '0') {
        alert(`✅ STK sent to ${p}!\n\nPaybill ${PAYBILL} A/C ${accountRef}\nAmount: KSh ${amount}\n\nCheck phone and enter PIN.\nID: ${data.CheckoutRequestID}`)
      } else {
        alert(`⚠️ STK not sent: ${data.error || data.ResultDesc || JSON.stringify(data).slice(0,400)}\n\nPay manually:\nPaybill ${PAYBILL}\nAccount ${accountRef}`)
      }
    } catch (e: any) {
      alert('Network error: ' + e.message)
      setLog(e.message)
    }
    setLoading(false)
  }

  if (!keja) return <div style={{padding:20}}>Loading keja {id}...</div>

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif', background:'#fff', minHeight:'100vh' }}>
      
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin:0 }}>SKYNET CYBER</h2>
        <span style={{ fontSize:12, background:'#000', color:'#fff', padding:'4px 8px', borderRadius:20 }}>KEJA CONNECT</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: '800', marginTop:16 }}>{keja.title} - KSh {keja.price}</h1>
      <p style={{ color: '#666', marginTop:4 }}>📍 {keja.location} • {keja.description}</p>

      {/* LOOP BIZ PAYMENT CARD */}
      <div style={{ background: '#fef2f2', border:'2px solid #7f1d1d', padding: 14, borderRadius: 12, marginTop: 20 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <b style={{ color:'#7f1d1d' }}>LOOP BIZ</b>
          <span style={{ fontSize:10, background:'#7f1d1d', color:'#fff', padding:'2px 6px', borderRadius:4 }}>M-PESA & AIRTEL PAYBILL</span>
        </div>
        <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div style={{ background:'#fff', padding:8, borderRadius:8, border:'1px solid #fecaca' }}>
            <div style={{ fontSize:10, color:'#888' }}>PAYBILL NUMBER</div>
            <div style={{ fontSize:22, fontWeight:'900', color:'#dc2626', letterSpacing:1 }}>{PAYBILL}</div>
          </div>
          <div style={{ background:'#fff', padding:8, borderRadius:8, border:'1px solid #fecaca' }}>
            <div style={{ fontSize:10, color:'#888' }}>ACCOUNT NUMBER</div>
            <div style={{ fontSize:18, fontWeight:'800', color:'#7f1d1d' }}>{accountRef}</div>
          </div>
        </div>
        <div style={{ fontSize:11, color:'#7f1d1d', marginTop:8 }}>Pay with LOOP • Account auto-links to Keja {id}</div>
      </div>

      {/* LIPA NA MPESA */}
      <div style={{ background: '#111', color:'#fff', padding: 16, borderRadius: 14, marginTop: 16 }}>
        <h3 style={{ margin:0 }}>📲 Lipa na M-Pesa (STK Push)</h3>
        <p style={{ fontSize:12, color:'#aaa', marginTop:4 }}>Enter phone to receive STK prompt from {PAYBILL}</p>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="07... or 2547..."
          inputMode="numeric"
          style={{ width: '100%', padding: 14, fontSize: 16, borderRadius: 10, border: '1px solid #333', marginTop: 12, background:'#222', color:'#fff' }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={() => pay('viewing')}
            disabled={loading}
            style={{ flex: 1, padding: 14, background: loading ? '#333' : '#fff', color: '#000', borderRadius: 10, fontWeight: '800', border: 0 }}
          >
            {loading ? 'Sending...' : 'VIEWING - 200'}
          </button>
          <button
            onClick={() => pay('rent')}
            disabled={loading}
            style={{ flex: 1, padding: 14, background: '#16a34a', color: '#fff', borderRadius: 10, fontWeight: '800', border: 0 }}
          >
            {loading ? 'Sending...' : `RENT - ${keja.price}`}
          </button>
        </div>
        
        {/* Manual fallback */}
        <div style={{ marginTop:14, padding:10, background:'#1f1f1f', borderRadius:8, fontSize:11, color:'#ccc', lineHeight:1.5 }}>
          If STK fails, pay manually:<br/>
          M-PESA → Lipa na M-Pesa → Paybill → <b style={{color:'#fff'}}>{PAYBILL}</b> → Account <b style={{color:'#fff'}}>{accountRef}</b> → Amount <b style={{color:'#fff'}}>KSh {keja.price}</b>
        </div>
      </div>

      {log && (
        <pre style={{ background: '#000', color: '#0f0', padding: 12, borderRadius: 8, marginTop: 16, fontSize: 10, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{log}</pre>
      )}

      <div style={{ marginTop: 20 }}>
        <h4 style={{ margin:'0 0 8px 0' }}>Recent Payments - Keja {id}</h4>
        {payments.length === 0 ? <p style={{ fontSize: 12, color: '#888' }}>No payments yet - pay to see here</p> : payments.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 10, borderRadius: 10, marginTop: 8, fontSize: 12, display:'flex', justifyContent:'space-between' }}>
            <span><b style={{color: p.status==='success'?'green':'red'}}>{p.status.toUpperCase()}</b> - {p.type} - {p.phone}</span>
            <span><b>KSh {p.amount}</b> {p.mpesa_receipt ? `(${p.mpesa_receipt})` : ''}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop:30, textAlign:'center', fontSize:10, color:'#aaa' }}>
        Powered by SKYNET CYBER • Loop Biz {PAYBILL} • {ACCOUNT_BASE}
      </div>
    </div>
  )
}
