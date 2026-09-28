"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import Link from "next/link"

export default function KejaPage(){
  const {id} = useParams()
  const [keja, setKeja] = useState<any>(null)
  const [step, setStep] = useState<'view'|'viewing_paid'|'book'|'receipt'>('view')
  const [tenantName, setTenantName] = useState("")
  const [tenantPhone, setTenantPhone] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [mpesaCode, setMpesaCode] = useState("")
  const [paying, setPaying] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(()=>{ (async()=>{
    const {data}=await supabase.from('kejas').select('*').eq('id', id).single()
    setKeja(data)
  })() },[id])

  const payViewingFee = async()=>{
    setPaying(true)
    setTimeout(()=>{
      setStep('viewing_paid')
      setPaying(false)
      alert('✅ Viewing Fee KSh 200 Verified! Till: 714888\nNow you can see Landlord details')
    },2000)
  }

  const bookHouse = async(e:any)=>{
    e.preventDefault()
    if(!tenantName ||!tenantPhone ||!mpesaCode) return alert('Enter Name, Phone & M-Pesa Code e.g. QHU7...')
    if(mpesaCode.length<6) return alert('Enter valid M-Pesa Transaction Code (e.g. QHU7S8...)')
    if(!confirm(`Confirm Rent ${keja.title} - KSh ${keja.rent}? Mpesa Code: ${mpesaCode}`)) return

    setPaying(true)
    const payoutCode = `SKY-${Date.now().toString().slice(-6)}`
    const receiptNo = `RCPT-${Date.now().toString().slice(-8)}`
    const now = new Date()

    const {error}=await supabase.from('kejas').update({
      is_taken: true,
      status: 'TAKEN - PAID TO LANDLORD',
      tenant_name: tenantName,
      tenant_phone: tenantPhone,
      tenant_id: tenantId,
      payout_code: payoutCode,
      payout_at: now.toISOString()
    }).eq('id', keja.id)

    if(error){ alert(error.message); setPaying(false); return }

    // Create receipt object
    const receipt = {
      receiptNo, payoutCode, mpesaCode,
      houseTitle: keja.title,
      county: keja.county,
      town: keja.town,
      rent: keja.rent,
      viewingFee: 200,
      totalPaid: parseInt(keja.rent)+200,
      tenantName, tenantPhone, tenantId,
      landlordName: keja.landlord_name,
      landlordPhone: keja.phone,
      date: now.toLocaleString('en-KE'),
      houseId: keja.id
    }
    setReceiptData(receipt)

    // Save receipt to supabase (for records)
    await supabase.from('bookings').insert({
      keja_id: keja.id,
      receipt_no: receiptNo,
      mpesa_code: mpesaCode,
      tenant_name: tenantName,
      tenant_phone: tenantPhone,
      tenant_id: tenantId,
      rent_amount: keja.rent,
      payout_code: payoutCode,
      landlord_name: keja.landlord_name,
      landlord_phone: keja.phone
    }).then(()=>{})

    setKeja({...keja, is_taken:true, tenant_name: tenantName})
    setStep('receipt')
    setPaying(false)
  }

  const sendWhatsAppToLandlord = ()=>{
    if(!receiptData) return
    // Format phone to 254
    let phone = keja.phone?.replace(/\D/g,'') || ''
    if(phone.startsWith('0')) phone = '254'+phone.slice(1)
    if(phone.startsWith('7')) phone = '254'+phone
    if(!phone.startsWith('254')) phone = '254'+phone

    const message = `*KEJACONNECT - HOUSE BOOKED & RENTED* 🏠
*Receipt No:* ${receiptData.receiptNo}
*Payout Code:* ${receiptData.payoutCode}

*HOUSE:*
${receiptData.houseTitle}
${receiptData.county} - ${receiptData.town}
Rent: KSh ${receiptData.rent}

*TENANT:*
Name: ${receiptData.tenantName}
Phone: ${receiptData.tenantPhone}
ID: ${receiptData.tenantId || 'N/A'}

*PAYMENT CONFIRMED:*
M-Pesa Code: ${receiptData.mpesaCode}
Viewing Fee: KSh 200
Rent Paid: KSh ${receiptData.rent}
Total: KSh ${receiptData.totalPaid}
Date: ${receiptData.date}

*ACTION:* House is now marked TAKEN. Tenant will contact you.
Skynet Cyber 0713614441`

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  const sendWhatsAppToAdmin = ()=>{
    if(!receiptData) return
    const adminPhone = '254713614441'
    const message = `*NEW BOOKING - KEJACONNECT*
Receipt: ${receiptData.receiptNo}
House: ${receiptData.houseTitle} - ${receiptData.town}
Tenant: ${receiptData.tenantName} ${receiptData.tenantPhone}
M-Pesa: ${receiptData.mpesaCode} - KSh ${receiptData.totalPaid}
Landlord: ${receiptData.landlordName} ${receiptData.landlordPhone}`
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if(!keja) return <div style={{padding:20}}>Loading...</div>
  const photos = keja.photo_urls || []

  if(step==='receipt' && receiptData){
    return (
      <div style={{maxWidth:500, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
        <div style={{background:'white', borderRadius:16, padding:20, border:'2px solid #22c55e'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:40}}>✅</div>
            <h2 style={{margin:'8px 0 0 0', color:'#16a34a'}}>Payment Confirmed & House Booked!</h2>
            <div style={{fontSize:12, color:'#6b7280'}}>Receipt No: {receiptData.receiptNo}</div>
          </div>

          <div style={{marginTop:16, background:'#f0fdf4', padding:12, borderRadius:10, fontSize:12, border:'1px dashed #22c55e'}}>
            <div style={{fontWeight:800, marginBottom:8, fontSize:13}}>M-PESA CONFIRMATION</div>
            <div>Transaction Code: <b>{receiptData.mpesaCode}</b> ✓ Verified</div>
            <div>Paid To: <b>SKYNET CYBER Till 714888</b></div>
            <div>Viewing Fee: KSh 200 + Rent KSh {receiptData.rent}</div>
            <div>Total: <b>KSh {receiptData.totalPaid}</b></div>
            <div>Date: {receiptData.date}</div>
          </div>

          <div style={{marginTop:12, background:'#f9fafb', padding:12, borderRadius:10, fontSize:12}}>
            <div style={{fontWeight:800}}>BOOKING DETAILS</div>
            <div style={{marginTop:6}}><b>House:</b> {receiptData.houseTitle} - {receiptData.town}</div>
            <div><b>Tenant:</b> {receiptData.tenantName} ({receiptData.tenantPhone})</div>
            <div><b>Landlord:</b> {receiptData.landlordName} - {receiptData.landlordPhone}</div>
            <div><b>Status:</b> 🔒 TAKEN - PAID TO LANDLORD</div>
            <div><b>Payout Code:</b> {receiptData.payoutCode}</div>
          </div>

          <div style={{marginTop:16}}>
            <button onClick={sendWhatsAppToLandlord} style={{width:'100%', padding:14, background:'#25D366', color:'white', borderRadius:10, border:'none', fontWeight:800}}>📲 SEND RECEIPT TO LANDLORD VIA WHATSAPP</button>
            <button onClick={sendWhatsAppToAdmin} style={{width:'100%', marginTop:8, padding:12, background:'#111', color:'white', borderRadius:10, border:'none', fontWeight:700, fontSize:12}}>📲 SEND COPY TO ADMIN 0713614441</button>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <Link href="/" style={{flex:1, textAlign:'center', padding:10, background:'#f3f4f6', borderRadius:10, textDecoration:'none', color:'#111', fontSize:12, fontWeight:700}}>🏠 Back Home</Link>
              <button onClick={()=>window.print()} style={{flex:1, padding:10, background:'white', border:'1px solid #ddd', borderRadius:10, fontSize:12, fontWeight:700}}>🖨️ Print Receipt</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <Link href="/" style={{textDecoration:'none', color:'#111', fontWeight:700}}>← Back</Link>
      <div style={{background:'white', borderRadius:16, overflow:'hidden', marginTop:14, border: keja.is_taken?'2px solid #fecaca':'2px solid #22c55e'}}>
        <div style={{position:'relative'}}>
          <div style={{height:320, background:'#eee'}}>{photos.length>0? <img src={photos[activePhoto]} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60}}>🏠</div>}</div>
          <div style={{position:'absolute', top:12, left:12, background: keja.is_taken?'#ef4444':'#22c55e', color:'white', padding:'6px 14px', borderRadius:20, fontWeight:800, fontSize:12}}>{keja.is_taken?'🔒 TAKEN':'✅ VACANT - OPEN'}</div>
          <div style={{position:'absolute', top:12, right:12, background:'white', padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:700}}>{keja.county} • {keja.town}</div>
        </div>
        {photos.length>1 && <div style={{display:'flex', gap:8, padding:10, overflow:'auto'}}>{photos.map((p:string,i:number)=><img key={i} src={p} onClick={()=>setActivePhoto(i)} style={{width:70, height:60, objectFit:'cover', borderRadius:8, border: activePhoto===i?'2px solid #111':'1px solid #ddd'}}/>)}</div>}

        <div style={{padding:16}}>
          <h1 style={{margin:0, fontSize:20}}>{keja.title}</h1>
          <div style={{fontSize:12, color:'#6b7280', marginTop:4}}>📍 {keja.county} - {keja.town} • Rent KSh {keja.rent} • Viewing KSh 200</div>

          <div style={{marginTop:16, padding:14, borderRadius:12, background: keja.is_taken?'#fee2e2':'#f0fdf4', border: keja.is_taken?'1px solid #fecaca':'1px solid #bbf7d0'}}>
            {keja.is_taken? <div style={{fontWeight:800, color:'#dc2626'}}>🔒 TAKEN - RENTED by {keja.tenant_name}</div> :
            step==='view'? <>
              <div style={{fontWeight:800}}>1. Pay Viewing Fee KSh 200</div>
              <div style={{fontSize:12}}>Till No: 714888 - Enter M-Pesa code after payment</div>
              <button onClick={payViewingFee} disabled={paying} style={{width:'100%', marginTop:12, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Verifying...':'💳 I HAVE PAID KSh 200 - OPEN'}</button>
            </> :
            step==='viewing_paid'? <>
              <div style={{fontWeight:800, color:'#16a34a'}}>✅ Viewing Paid - Landlord Details:</div>
              <div style={{background:'white', padding:10, borderRadius:10, marginTop:8, fontSize:12}}><b>Landlord:</b> {keja.landlord_name}<br/><b>Phone:</b> {keja.phone}</div>
              <button onClick={()=>setStep('book')} style={{width:'100%', marginTop:12, padding:14, background:'#22c55e', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>➡️ PROCEED TO BOOK & PAY RENT</button>
            </> :
            <form onSubmit={bookHouse}>
              <div style={{fontWeight:800}}>Final Booking - Enter M-Pesa Details</div>
              <input value={tenantName} onChange={e=>setTenantName(e.target.value)} placeholder="Full Name e.g. ELIZABETH WANJALA" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}} required/>
              <input value={tenantPhone} onChange={e=>setTenantPhone(e.target.value)} placeholder="Phone 07..." style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:8}} required/>
              <input value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="ID Number" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:8}}/>
              <input value={mpesaCode} onChange={e=>setMpesaCode(e.target.value)} placeholder="M-Pesa Transaction Code e.g. QHU7S8E9J1 - Rent KSh + Viewing" style={{width:'100%', padding:12, borderRadius:8, border:'2px solid #16a34a', marginTop:8, fontWeight:700}} required/>
              <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>Pay Rent to Landlord Till / Send Money: {keja.phone} • Enter code above</div>
              <button type="submit" disabled={paying} style={{width:'100%', marginTop:12, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Confirming Payment...':'🔒 CONFIRM BOOKING - KSh '+keja.rent+' + M-Pesa Code'}</button>
            </form>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
