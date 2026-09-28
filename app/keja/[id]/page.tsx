"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useParams } from "next/navigation"

export default function KejaDetails(){
  const {id} = useParams()
  const [keja, setKeja] = useState<any>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [mpesa, setMpesa] = useState("")
  const [tenantPhone, setTenantPhone] = useState("")

  useEffect(()=>{
    supabase.from('kejas').select('*').eq('id', id).single().then(({data})=>setKeja(data))
    // Check if already unlocked in this browser
    const saved = localStorage.getItem(`unlock_${id}`)
    if(saved) setUnlocked(true)
  },[id])

  const handleUnlock = async()=>{
    if(!mpesa ||!tenantPhone) return alert("Enter your phone and M-Pesa code")
    // Save unlock
    await supabase.from('unlocks').insert([{keja_id:id, tenant_phone:tenantPhone, mpesa_code:mpesa}])
    localStorage.setItem(`unlock_${id}`,'true')
    setUnlocked(true)
    alert("Unlocked! You can now call landlord. Our agent will also send you agreement link.")
  }

  if(!keja) return <div style={{padding:20}}>Loading...</div>

  return (
    <div style={{maxWidth:700, margin:'0 auto', background:'white', minHeight:'100vh'}}>
      <img src={keja.photos?.[0]} style={{width:'100%', height:320, objectFit:'cover'}}/>
      <div style={{padding:16}}>
        <h1 style={{color:'#111827', margin:0}}>{keja.title}</h1>
        <p style={{color:'#6b7280'}}>📍 {keja.town}, {keja.county} • KSh {Number(keja.rent).toLocaleString()}</p>

        {!unlocked? (
          <div style={{background:'#fef3c7', border:'1px solid #fbbf24', padding:16, borderRadius:12, marginTop:20}}>
            <div style={{fontWeight:800, color:'#92400e'}}>🔒 LANDLORD CONTACT LOCKED</div>
            <p style={{fontSize:13, color:'#78350f', margin:'8px 0'}}>To prevent fraud and secure your 20% commission, contact is hidden. Tenant must pay viewing fee.</p>

            <div style={{background:'white', padding:12, borderRadius:10, marginTop:12}}>
              <div style={{fontSize:12, fontWeight:700}}>STEP 1: Lipa Na M-Pesa</div>
              <div style={{fontSize:14, marginTop:4}}>Till: <b>YOUR_TILL_HERE</b> - KSh 300 (Viewing Fee)</div>
              <div style={{fontSize:11, color:'#6b7280'}}>This fee is deducted from 20% commission later.</div>

              <input value={tenantPhone} onChange={e=>setTenantPhone(e.target.value)} placeholder="Your Phone 07..." style={{width:'100%', padding:11, borderRadius:8, border:'1px solid #d1d5db', marginTop:12}}/>
              <input value={mpesa} onChange={e=>setMpesa(e.target.value)} placeholder="M-Pesa Code e.g QGH7..." style={{width:'100%', padding:11, borderRadius:8, border:'1px solid #d1d5db', marginTop:8}}/>

              <button onClick={handleUnlock} style={{width:'100%', marginTop:10, background:'#111827', color:'white', padding:12, borderRadius:10, fontWeight:800, border:'none'}}>✅ Verify & Unlock Contact</button>
            </div>
          </div>
        ) : (
          <div style={{background:'#f0fdf4', padding:14, borderRadius:12, marginTop:16, border:'1px solid #bbf7d0'}}>
            <div style={{fontWeight:800, fontSize:12}}>👤 LANDLORD CONTACT UNLOCKED</div>
            <div style={{fontSize:14, marginTop:6}}>Name: {keja.landlord_name}</div>
            <div style={{display:'flex', gap:10, marginTop:12}}>
              <a href={`tel:${keja.phone}`} style={{flex:1, background:'#111827', color:'white', padding:12, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>📞 Call {keja.phone}</a>
              <a href={`https://wa.me/254${keja.whatsapp?.slice(-9)}`} target="_blank" style={{flex:1, background:'#22c55e', color:'white', padding:12, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>WhatsApp</a>
            </div>
            <div style={{fontSize:11, color:'#6b7280', marginTop:8}}>⚠️ Commission: You owe KejaConnect 20% of first month (KSh {(keja.rent*0.2).toLocaleString()}) - KSh 300 already paid.</div>
          </div>
        )}
      </div>
    </div>
  )
}
