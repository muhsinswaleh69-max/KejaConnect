"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async()=>{
    const {data} = await supabase.from('kejas').select('*').order('id',{ascending:false})
    setKejas(data||[])
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const markPaid = async(keja:any)=>{
    const code = prompt(`You are paying landlord of:\n${keja.title} - ${keja.town}\nRent: KSh ${keja.rent}\n\nTo Landlord M-Pesa: ${keja.phone||keja.whatsapp}\nAmount to send: KSh ${Math.round(keja.rent*0.8)}\n\nEnter your LOOP BIZ M-Pesa Payout Code after sending:`)
    if(!code) return
    if(code.length < 4) return alert("Invalid M-Pesa code")
    
    const {error} = await supabase.from('kejas').update({
      status: 'Paid to Landlord',
      payout_code: code,
      payout_at: new Date().toISOString()
    }).eq('id', keja.id)

    if(error) alert(error.message)
    else {
      alert(`✅ Saved! KSh ${Math.round(keja.rent*0.8)} marked as paid to landlord. Code: ${code}`)
      load()
    }
  }

  const totalRent = kejas.reduce((s,k)=>s+Number(k.rent||0),0)
  const yourCut = Math.round(totalRent * 0.2)
  const toPayout = Math.round(totalRent * 0.8)

  if(loading) return <div style={{padding:20}}>Loading Admin...</div>

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h1 style={{margin:0}}>Admin Dashboard</h1>
        <a href="/" style={{background:'#e5e7eb', padding:'8px 14px', borderRadius:8, textDecoration:'none', color:'#111'}}>Logout</a>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:20}}>
        <div style={{background:'white', padding:16, borderRadius:12}}><div style={{fontSize:12, color:'#6b7280'}}>Total Listings</div><div style={{fontSize:22, fontWeight:800}}>{kejas.length}</div></div>
        <div style={{background:'white', padding:16, borderRadius:12}}><div style={{fontSize:12, color:'#6b7280'}}>Your 20% Potential</div><div style={{fontSize:18, fontWeight:800, color:'#16a34a'}}>KSh {yourCut}</div></div>
        <div style={{background:'white', padding:16, borderRadius:12}}><div style={{fontSize:12, color:'#6b7280'}}>To Payout Landlords</div><div style={{fontSize:18, fontWeight:800}}>KSh {toPayout}</div></div>
      </div>

      <div style={{marginTop:24, background:'white', borderRadius:12, overflow:'hidden'}}>
        {kejas.map((k)=> {
          const landlordShare = Math.round(Number(k.rent)*0.8)
          const myShare = Math.round(Number(k.rent)*0.2)
          const isPaid = k.status === 'Paid to Landlord'
          return (
            <div key={k.id} style={{padding:16, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700}}>{k.title} - {k.town}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>Rent KSh {k.rent} • M-Pesa {k.phone||k.whatsapp||'No number'}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>Tenant: {k.tenant_name||'Not Booked'} • Status: <b style={{color: isPaid ? '#16a34a' : '#d97706'}}>{k.status}</b> {k.payout_code && `• Code: ${k.payout_code}`}</div>
                {!isPaid ? (
                  <button onClick={()=>markPaid(k)} style={{marginTop:10, background:'#93c5fd', color:'#1e3a8a', border:'none', padding:'8px 14px', borderRadius:20, fontWeight:700, cursor:'pointer'}}>Mark as Paid to Landlord M-Pesa</button>
                ) : (
                  <div style={{marginTop:10, background:'#dcfce7', color:'#166534', padding:'6px 12px', borderRadius:20, fontSize:12, display:'inline-block'}}>✅ Paid {k.payout_at ? new Date(k.payout_at).toLocaleDateString() : ''} - {k.payout_code}</div>
                )}
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11, color:'#6b7280'}}>Your Cut</div>
                <div style={{fontWeight:800, color:'#16a34a'}}>KSh {myShare}</div>
                <div style={{fontSize:11, color:'#6b7280', marginTop:6}}>To Landlord</div>
                <div style={{fontWeight:800}}>KSh {landlordShare}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{fontSize:11, color:'#9ca3af', marginTop:12, textAlign:'center'}}>Skynet Cyber - LOOP BIZ 714888 / 467108 - Pay from till to landlord</div>
    </div>
  )
}
