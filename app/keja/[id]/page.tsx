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
  const [phone, setPhone] = useState('254708374149')
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState('')
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('kejas').select('*').eq('id', id).single()
      if (data) setKeja(data)
      else setKeja({ id, title: `Keja #${id}`, price: 8000, location: 'Mumias', description: 'Test listing' })

      const { data: pays } = await supabase.from('payments').select('*').eq('keja_id', id).order('created_at', { ascending: false }).limit(5)
      if (pays) setPayments(pays)
    }
    load()
  }, [id])

  const pay = async (type: 'viewing' | 'rent') => {
    if (!phone) return alert('Enter phone 07... or 2547...')
    let p = phone.replace(/\D/g, '')
    if (p.startsWith('0')) p = '254' + p.slice(1)
    if (p.startsWith('7')) p = '254' + p
    if (p.length < 12) return alert(`Bad phone: ${phone}`)

    const amount = type === 'viewing' ? 200 : 200 // change rent amount here

    setLoading(true)
    setLog(`Sending STK ${amount} to ${p}...`)

    try {
      // THIS MUST CALL stk-push NOT callback!
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
        alert(`✅ STK sent! Check phone ${p}\nCheckoutID: ${data.CheckoutRequestID}\n\nWait 15s then refresh - will appear in payments table`)
      } else {
        alert(`❌ Failed: ${data.error || data.ResultDesc || data.ResultDescription || JSON.stringify(data).slice(0,300)}`)
      }
    } catch (e: any) {
      alert('Network error: ' + e.message)
      setLog(e.message)
    }
    setLoading(false)
  }

  if (!keja) return <div style={{padding:20}}>Loading keja {id}...</div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>{keja.title || `Keja ${id}`} - KSh {keja.price || 200}</h1>
      <p style={{ color: '#666' }}>{keja.location || 'Mumias'} • {keja.description || '1 Bedroom'}</p>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 20 }}>
        <h3>📲 Lipa na M-Pesa</h3>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="07... or 2547..."
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ccc', marginTop: 8 }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={() => pay('viewing')}
            disabled={loading}
            style={{ flex: 1, padding: 14, background: loading ? '#999' : '#000', color: '#fff', borderRadius: 8, fontWeight: 'bold', border: 0 }}
          >
            {loading ? 'Sending...' : '📲 PAY VIEWING 200'}
          </button>
          <button
            onClick={() => pay('rent')}
            disabled={loading}
            style={{ flex: 1, padding: 14, background: '#16a34a', color: '#fff', borderRadius: 8, fontWeight: 'bold', border: 0 }}
          >
            {loading ? 'Sending...' : '🏠 PAY RENT 200'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Sandbox test: use 254708374149 (no real popup, check Supabase payments table)</p>
      </div>

      {log && (
        <pre style={{ background: '#111', color: '#0f0', padding: 12, borderRadius: 8, marginTop: 16, fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{log}</pre>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Recent Payments for Keja {id}</h4>
        {payments.length === 0 ? <p style={{ fontSize: 12, color: '#888' }}>No payments yet</p> : payments.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 8, borderRadius: 8, marginTop: 6, fontSize: 12 }}>
            <b>{p.status}</b> - {p.type} - KSh {p.amount} - {p.phone} - {p.mpesa_receipt || p.result_desc} - {new Date(p.created_at).toLocaleString()}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/api/mpesa/stk-push" target="_blank" style={{ fontSize: 12 }}>Check STK API live</a> | <a href="/api/mpesa/callback" target="_blank" style={{ fontSize: 12 }}>Check Callback live</a>
      </div>
    </div>
  )
}
