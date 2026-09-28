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
    const saved = localStorage.getItem(`unlock_${id}`)
    if(saved) setUnlocked(true)
  },[id])

  const handleUnlock = async()=>{
    if(!mpesa ||!tenantPhone) return alert("Enter your phone and M-Pesa code")
    await supabase.from('unlocks').insert([{keja_id:Number(id), tenant_phone:tenantPhone, mpesa_code:mpesa}])
    localStorage.setItem(`unlock_${id}`,'true')
    setUnlocked(true)
    alert("Verified! Contact unlocked. Skynet Cyber will confirm payment.")
  }

  if(!keja) return <div style={{padding:20}}>Loading...</div>
  const commission = Math.round(keja.rent * 0.2)

  return (
    <div style={{maxWidth:700, margin:'0 auto', background:'white', minHeight:'100vh'}}>
      <img src={keja.photos?.[0]} style={{width:'100%', height:320, objectFit:'cover'}}/>
      <div style={{padding:16}}>
        <h1 style={{color:'#111827', margin:0, fontSize:20}}>{keja.title}</h1>
        <p style={{color:'#6b7280'}}>📍 {keja.town}, {keja.county} • KSh {Number(keja.rent).toLocaleString()}</p>

        {!unlocked? (
          <div style={{background:'#fef3c7', border:'1px solid #fbbf24', padding:16, borderRadius:12, marginTop:20}}>
            <div style={{fontWeight:800, color:'#92400e'}}>🔒 LANDLORD CONTACT LOCKED - SECURED BY SKYNET CYBER</div>
            <p style={{fontSize:12, color:'#78350f', margin:'8px 0'}}>Pay viewing fee to unlock. This prevents tenants bypassing your 20% commission.</p>

            <div style={{background:'white', padding:14, borderRadius:12, marginTop:12, border:'1px dashed #f59e0b'}}>
              <div style={{fontSize:13, fontWeight:800, color:'#111827'}}>LOOP BIZ - LIPA NA M-PESA / AIRTEL MONEY</div>
              <div style={{marginTop:8, fontSize:14}}>
                <div>Paybill: <b style={{fontSize:18, color:'#dc2626'}}>714888</b></div>
                <div>Account Number: <b style={{fontSize:20, letterSpacing:2}}>467108</b></div>
                <div>Amount: <b>KSh 300</b> (Viewing Fee)</div>
              </div>
              <div style={{fontSize:11, color:'#6b7280', marginTop:6}}>KSh 300 will be deducted from your 20% commission (KSh {commission.toLocaleString()}). Balance: KSh {(commission-300).toLocaleString()}</div>

              <input value={tenantPhone} onChange={e=>setTenantPhone(e.target.value)} placeholder="Your Phone 0713..." style={{width:'100%', padding:11, borderRadius:8, border:'1px solid #d1d5db', marginTop:14, color:'#111827'}}/>
              <input value={mpesa} onChange={e=>setMpesa(e.target.value)} placeholder="M-Pesa Code e.g QGH7..." style={{width:'100%', padding:11, borderRadius:8, border:'1px solid #d1d5db', marginTop:8, color:'#111827'}}/>

              <button onClick={handleUnlock} style={{width:'100%', marginTop:12, background:'#111827', color:'white', padding:13, borderRadius:10, fontWeight:800, border:'none'}}>✅ Verify & Unlock Contact</button>
              <div style={{fontSize:10, textAlign:'center', marginTop:8, color:'#6b7280'}}>Skynet Cyber - 0713614441 - skynetdigital@gmail.com</div>
            </div>
          </div>
        ) : (
          <div style={{background:'#f0fdf4', padding:14, borderRadius:12, marginTop:16, border:'1px solid #22c55e'}}>
            <div style={{fontWeight:800, fontSize:12, color:'#15803d'}}>✅ CONTACT UNLOCKED - PAYMENT VERIFIED</div>
            <div style={{fontSize:14, marginTop:8}}>Landlord: {keja.landlord_name || 'Landlord'}</div>
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <a href={`tel:${keja.phone}`} style={{flex:1, background:'#111827', color:'white', padding:13, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>📞 Call {keja.phone}</a>
              <a href={`https://wa.me/254${keja.whatsapp?.slice(-9)}`} target="_blank" style={{flex:1, background:'#22c55e', color:'white', padding:13, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>WhatsApp</a>
            </div>
            <div style={{fontSize:11, color:'#6b7280', marginTop:10}}>Commission owed to KejaConnect: KSh {commission.toLocaleString()} (KSh 300 paid, balance KSh {(commission-300).toLocaleString()})</div>
          </div>
        )}
      </div>
    </div>
  )
}
