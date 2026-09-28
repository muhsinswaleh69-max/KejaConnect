"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function KejaPage(){
  const {id} = useParams() as {id:string}
  const [keja,setKeja]=useState<any>(null)
  const [phone,setPhone]=useState("")
  const [loading,setLoading]=useState(false)

  useEffect(()=>{ supabase.from('kejas').select('*').eq('id',id).single().then(({data})=>setKeja(data)) },[id])

  const pay = async (type:string, amount:number) => {
    if(!phone) return alert("Enter phone 07...")
    setLoading(true)
    try{
      const res = await fetch('/api/mpesa/stk-push',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone, amount, kejaId:id, type})})
      const txt = await res.text()
      let data:any; try{ data = JSON.parse(txt)} catch{ alert("API Error: "+txt.slice(0,300)); setLoading(false); return}
      if(data.ResponseCode==='0') alert("✅ STK sent! Check phone")
      else alert(JSON.stringify(data))
    }catch(e:any){ alert(e.message) }
    setLoading(false)
  }

  if(!keja) return <div className="p-10">Loading...</div>
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold">{keja.title} - KSh {keja.rent}</h1>
      <p>{keja.location}</p>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xxxxxxxx" className="border p-3 w-full mt-4 rounded"/>
      <button onClick={()=>pay('viewing',200)} disabled={loading} className="bg-black text-white w-full p-3 mt-3 rounded">{loading?'Sending...':'📲 PAY 200 VIEWING'}</button>
      <button onClick={()=>pay('rent', keja.rent)} disabled={loading} className="bg-green-600 text-white w-full p-3 mt-3 rounded">🏠 PAY RENT {keja.rent}</button>
    </div>
  )
}
