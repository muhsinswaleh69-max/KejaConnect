"use client"
import { useState } from "react"

export default function TestMpesa() {
  const [phone, setPhone] = useState("254708374149")
  const [amount, setAmount] = useState("200")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const pay = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: Number(amount), kejaId: 'test-keja-123', type: 'viewing' })
      })
      const data = await res.json()
      setResult(data)
    } catch (e:any) {
      setResult({ error: e.message })
    }
    setLoading(false)
  }

  return (
    <div style={{padding:20, maxWidth:400, margin:'0 auto'}}>
      <h1 style={{fontSize:24, fontWeight:'bold'}}>🧪 Test M-Pesa STK</h1>
      <p>Use Safaricom sandbox number</p>
      <input value={phone} onChange={e=>setPhone(e.target.value)} style={{border:'1px solid #ccc', padding:12, width:'100%', marginTop:12, borderRadius:8}} placeholder="Phone 2547..." />
      <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" style={{border:'1px solid #ccc', padding:12, width:'100%', marginTop:12, borderRadius:8}} placeholder="Amount" />
      <button onClick={pay} disabled={loading} style={{background:'black', color:'white', padding:14, width:'100%', marginTop:16, borderRadius:8}}>
        {loading ? 'Sending...' : `📲 SEND STK PUSH KSh ${amount}`}
      </button>
      {result && <pre style={{background:'#f3f3f3', padding:12, marginTop:16, fontSize:12, overflow:'auto'}}>{JSON.stringify(result, null, 2)}</pre>}
      {result?.ResponseCode === '0' && <div style={{background:'#d1fae5', padding:12, marginTop:12, borderRadius:8}}>✅ SUCCESS! Check Vercel Logs → STK accepted by Safaricom</div>}
    </div>
  )
}
