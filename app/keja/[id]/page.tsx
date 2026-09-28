"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import Link from "next/link"

export default function KejaPage(){
  const {id} = useParams()
  const [keja, setKeja] = useState<any>(null)
  const [step, setStep] = useState<'view'|'viewing_paid'|'book'>('view')
  const [tenantName, setTenantName] = useState("")
  const [tenantPhone, setTenantPhone] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [paying, setPaying] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(()=>{ (async()=>{
    const {data}=await supabase.from('kejas').select('*').eq('id', id).single()
    setKeja(data)
  })() },[id])

  const payViewingFee = async()=>{
    setPaying(true)
    setTimeout(()=>{ // Simulate M-Pesa STK
      setStep('viewing_paid')
      setPaying(false)
      alert('✅ Viewing Fee KSh 200 Paid! Now you can see Landlord details and Book. LOOP BIZ: 714888 or 467108')
    },2000)
  }

  const bookHouse = async(e:any)=>{
    e.preventDefault()
    if(!tenantName ||!tenantPhone) return alert('Enter Name & Phone')
    if(!confirm(`Confirm Booking ${keja.title} in ${keja.town} for KSh ${keja.rent}?`)) return
    setPaying(true)
    const payoutCode = `SKYNET-${Date.now().toString().slice(-6)}`
    const {error}=await supabase.from('kejas').update({
      is_taken: true,
      status: 'TAKEN - PAID TO LANDLORD',
      tenant_name: tenantName,
      tenant_phone: tenantPhone,
      tenant_id: tenantId,
      payout_code: payoutCode,
      payout_at: new Date().toISOString()
    }).eq('id', keja.id)
    if(error){ alert(error.message); setPaying(false); return }
    alert(`🎉 BOOKED! House is now RENTED/TAKEN.\nTenant: ${tenantName}\nCode: ${payoutCode}\nLandlord will be paid.`)
    setKeja({...keja, is_taken:true, tenant_name: tenantName})
    setPaying(false)
  }

  if(!keja) return <div style={{padding:20, fontFamily:'sans-serif'}}>Loading keja...</div>

  const photos = keja.photo_urls || []

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <Link href="/" style={{textDecoration:'none', color:'#111', fontWeight:700}}>← Back to All Houses - 47 Counties</Link>

      <div style={{background:'white', borderRadius:16, overflow:'hidden', marginTop:14, border: keja.is_taken?'2px solid #fecaca':'2px solid #22c55e'}}>
        <div style={{position:'relative'}}>
          <div style={{height:320, background:'#eee'}}>
            {photos.length>0? <img src={photos[activePhoto]} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60}}>🏠</div>}
          </div>
          <div style={{position:'absolute', top:12, left:12, background: keja.is_taken?'#ef4444':'#22c55e', color:'white', padding:'6px 14px', borderRadius:20, fontWeight:800, fontSize:12}}>{keja.is_taken?'🔒 TAKEN - RENTED':'✅ VACANT - OPEN FOR BOOKING'}</div>
          <div style={{position:'absolute', top:12, right:12, background:'white', padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:700}}>{keja.county} • {keja.town}</div>
          {keja.is_taken && <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:30, fontWeight:800}}>🔒 BOOKED - NOT AVAILABLE</div>}
        </div>

        {photos.length>1 && <div style={{display:'flex', gap:8, padding:10, overflow:'auto'}}>{photos.map((p:string,i:number)=><img key={i} src={p} onClick={()=>setActivePhoto(i)} style={{width:70, height:60, objectFit:'cover', borderRadius:8, border: activePhoto===i?'2px solid #111':'1px solid #ddd', cursor:'pointer'}}/>)}</div>}

        <div style={{padding:16}}>
          <h1 style={{margin:0, fontSize:20}}>{keja.title}</h1>
          <div style={{fontSize:12, color:'#6b7280', marginTop:4}}>📍 {keja.county} - {keja.town} • {keja.house_type || 'House'} • {keja.bedrooms || 1} Bedroom • Rent KSh {keja.rent} • Viewing KSh 200</div>

          {keja.description && <div style={{marginTop:12, fontSize:13, background:'#f9fafb', padding:10, borderRadius:10}}>{keja.description}</div>}

          {keja.features && <div style={{display:'flex', gap:8, marginTop:10, flexWrap:'wrap'}}>{keja.features.water && <span style={{background:'#dcfce7', padding:'4px 10px', borderRadius:20, fontSize:11}}>💧 Water</span>}{keja.features.electricity && <span style={{background:'#fef9c3', padding:'4px 10px', borderRadius:20, fontSize:11}}>⚡ Electricity</span>}{keja.features.tiles && <span style={{background:'#e0e7ff', padding:'4px 10px', borderRadius:20, fontSize:11}}>Tiles</span>}<span style={{background:'#f3f4f6', padding:'4px 10px', borderRadius:20, fontSize:11}}>🚽 {keja.features.toilet || 'Inside'}</span></div>}

          {keja.video_url && <div style={{marginTop:14}}><div style={{fontSize:12, fontWeight:700}}>🎥 Video Tour</div><video src={keja.video_url} controls style={{width:'100%', borderRadius:10, marginTop:6, maxHeight:300}} /></div>}

          {/* BOOKING FLOW */}
          <div style={{marginTop:20, padding:14, borderRadius:12, background: keja.is_taken?'#fee2e2':'#f0fdf4', border: keja.is_taken?'1px solid #fecaca':'1px solid #bbf7d0'}}>
            {keja.is_taken? (
              <>
                <div style={{fontWeight:800, color:'#dc2626'}}>🔒 This House is TAKEN / RENTED</div>
                <div style={{fontSize:12, marginTop:4}}>Tenant: {keja.tenant_name || 'N/A'} • {keja.status}</div>
                <div style={{fontSize:11, color:'#6b7280', marginTop:6}}>Contact Admin 0713614441 to make it VACANT again</div>
              </>
            ) : step==='view'? (
              <>
                <div style={{fontWeight:800}}>Open This House - 2 Steps:</div>
                <div style={{fontSize:12, marginTop:6}}>1️⃣ Pay Viewing Fee <b>KSh 200</b> (Till 714888) → See Landlord Number<br/>2️⃣ Book & Rent → House becomes TAKEN</div>
                <button onClick={payViewingFee} disabled={paying} style={{width:'100%', marginTop:12, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Waiting M-Pesa...':'💳 PAY VIEWING FEE KSh 200 - OPEN'}</button>
                <div style={{fontSize:10, textAlign:'center', marginTop:6, color:'#6b7280'}}>LOOP BIZ No: 714888 / 467108 • Skynet Cyber 0713614441</div>
              </>
            ) : step==='viewing_paid'? (
              <>
                <div style={{fontWeight:800, color:'#16a34a'}}>✅ Viewing Paid - House is OPEN</div>
                <div style={{marginTop:10, background:'white', padding:10, borderRadius:10, border:'1px solid #bbf7d0'}}>
                  <div style={{fontSize:12}}><b>Landlord:</b> {keja.landlord_name}</div>
                  <div style={{fontSize:12}}><b>Phone:</b> {keja.phone} {keja.caretaker_phone && ` / Caretaker: ${keja.caretaker_phone}`}</div>
                  <div style={{fontSize:12}}><b>M-Pesa Name:</b> {keja.mpesa_name || keja.landlord_name}</div>
                </div>
                <button onClick={()=>setStep('book')} style={{width:'100%', marginTop:12, padding:14, background:'#22c55e', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>➡️ BOOK NOW - RENT THIS HOUSE (Make TAKEN)</button>
              </>
            ) : (
              <form onSubmit={bookHouse}>
                <div style={{fontWeight:800}}>Book / Rent - Tenant Details</div>
                <input value={tenantName} onChange={e=>setTenantName(e.target.value)} placeholder="Your Full Name e.g. ELIZABETH WANJALA" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}} required/>
                <input value={tenantPhone} onChange={e=>setTenantPhone(e.target.value)} placeholder="Your Phone 07..." style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:8}} required/>
                <input value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="ID Number (Optional)" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:8}}/>
                <button type="submit" disabled={paying} style={{width:'100%', marginTop:12, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Booking...':'🔒 CONFIRM BOOKING - RENT KSh '+keja.rent}</button>
                <div style={{fontSize:10, textAlign:'center', marginTop:6}}>After booking, house will show as TAKEN on homepage</div>
              </form>
            )}
          </div>

          <div style={{fontSize:10, color:'#6b7280', textAlign:'center', marginTop:14}}>Skynet Cyber 0713614441 • Viewing Fee KSh 200 • 47 Counties</div>
        </div>
      </div>
    </div>
  )
}
