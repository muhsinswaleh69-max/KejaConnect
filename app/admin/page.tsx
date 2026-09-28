"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const load = async()=>{
    const {data} = await supabase.from('kejas').select('*').order('id',{ascending:false})
    console.log("DATA:", data)
    setKejas(data||[])
  }
  useEffect(()=>{load()},[])

  const markPaid = async(k:any)=>{
    const code = prompt(`Pay landlord KSh ${Math.round(k.rent*0.8)} to ${k.phone||'landlord'}\nEnter LOOP BIZ M-Pesa Code:`)
    if(!code) return
    const {error} = await supabase.from('kejas').update({
      status: 'Paid to Landlord',
      payout_code: code,
      payout_at: new Date().toISOString()
    }).eq('id', k.id)
    if(error){ alert("ERROR: "+error.message + "\nRun the SQL I gave you!"); return }
    alert(`✅ Saved! KSh ${Math.round(k.rent*0.8)} paid. Code ${code}`)
    load()
  }

  const total = kejas.reduce((s,k)=>s+Number(k.rent||0),0)
  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh'}}>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:20, marginTop:10}}>
        <div>Total Listings <b>{kejas.length}</b></div>
        <div style={{color:'#16a34a'}}>Your 20% Potential <b>KSh {Math.round(total*0.2)}</b></div>
        <div>To Payout Landlords <b>KSh {Math.round(total*0.8)}</b></div>
      </div>
      <div style={{marginTop:20, background:'white', borderRadius:12}}>
        {kejas.map((k:any)=>{
          const isPaid = k.status === 'Paid to Landlord' || k.payout_code
          return (
            <div key={k.id} style={{padding:16, borderBottom:'1px solid #eee', background: isPaid ? '#f0fdf4' : 'white'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                  <div style={{fontWeight:700}}>{k.title} - {k.town}</div>
                  <div style={{fontSize:12}}>Rent KSh {k.rent} • Tenant: {k.tenant_name||'Not Booked'} • Status: <b style={{color: isPaid ? 'green' : 'orange'}}>{isPaid ? `✅ PAID TO LANDLORD - ${k.payout_code}` : k.status}</b></div>
                  {isPaid && <div style={{fontSize:11, color:'green', marginTop:4}}>Paid on {k.payout_at ? new Date(k.payout_at).toLocaleString() : ''} | M-Pesa: {k.payout_code} | Amount: KSh {Math.round(k.rent*0.8)}</div>}
                  {!isPaid ? <button onClick={()=>markPaid(k)} style={{marginTop:10, background:'#93c5fd', border:'none', padding:'8px 14px', borderRadius:20, fontWeight:700}}>Mark as Paid to Landlord M-Pesa</button> : <div style={{marginTop:10, background:'#16a34a', color:'white', padding:'6px 12px', borderRadius:20, fontSize:12, display:'inline-block'}}>✅ PAID - KSh {Math.round(k.rent*0.8)} Sent</div>}
                </div>
                <div style={{textAlign:'right'}}><div style={{fontSize:11}}>Your Cut</div><b style={{color:'#16a34a'}}>KSh {Math.round(k.rent*0.2)}</b><div style={{fontSize:11, marginTop:6}}>To Landlord</div><b>KSh {Math.round(k.rent*0.8)}</b></div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{fontSize:10, textAlign:'center', marginTop:12, color:'#999'}}>Skynet Cyber - LOOP BIZ 714888 / 467108</div>
    </div>
  )
}
