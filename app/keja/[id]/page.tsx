 "use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function KejaDetailPage() {
  const { id } = useParams() as { id: string }
  const [keja, setKeja] = useState<any>(null)
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('kejas').select('*').eq('id', id).single().then(({ data }) => setKeja(data))
  }, [id])

  const payViewing = async () => {
    if (!phone) return alert("Enter M-Pesa phone e.g. 07...")
    setLoading(true)
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: 200, kejaId: id, type: 'viewing' })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') {
        alert("STK PUSH sent! Check your phone and enter PIN")
      } else {
        alert(JSON.stringify(data))
      }
    } catch (e: any) {
      alert(e.message)
    }
    setLoading(false)
  }

  const payRent = async () => {
    if (!keja) return
    if (!phone) return alert("Enter phone")
    setLoading(true)
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: keja.rent, kejaId: id, type: 'rent' })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') {
        alert("STK PUSH for RENT sent! Check phone")
      } else {
        alert(JSON.stringify(data))
      }
    } catch (e: any) {
      alert(e.message)
    }
    setLoading(false)
  }

  if (!keja) return <div className="p-10">Loading keja...</div>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{keja.title || 'Keja'} - KSh {keja.rent}</h1>
      <p className="mt-2">{keja.location}</p>
      <div className="mt-6 space-y-4">
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xxxxxxxx" className="border p-3 w-full rounded" />
        <button onClick={payViewing} disabled={loading} className="bg-black text-white w-full p-3 rounded">📲 PAY KSh 200 VIEWING (STK)</button>
        <button onClick={payRent} disabled={loading} className="bg-green-600 text-white w-full p-3 rounded">🏠 PAY RENT KSh {keja.rent} (STK) - Auto Split 20/80</button>
      </div>
    </div>
  )
}
