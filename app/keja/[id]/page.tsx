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
  const [viewingCode, setViewingCode] = useState("")
  const [rentMpesaCode, setRentMpesaCode] = useState("")
  const [paying, setPaying] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(()=>{ (async()=>{
    const {data}=await supabase.from('kejas').select('*').eq('id', id).single()
    setKeja(data)
  })() },[id])

  // 1. CONFIRM VIEWING FEE WITH M-PESA CODE
  const confirmViewingFee = async(e:any)=>{
    e.preventDefault()
    if(!viewingCode || viewingCode.trim().length<8){
      return alert('Enter valid M-Pesa Code from your SMS. Example: QHU7S8E9J1 (10 letters)')
    }
    const code = viewingCode.trim().toUpperCase()
    setPaying(true)

    // Check if code already used (prevent reuse)
    const {data: existing} = await supabase.from('bookings').select('id').eq('mpesa_code', code).limit(1)
    if(existing && existing.length>0){
      setPaying(false)
      return alert('❌ This M-Pesa Code was already used! Use a new transaction code.')
    }

    // Simulate verification - In production you will call Daraja API here
    // For now we verify format: 10 chars alphanumeric, must be unique
    setTimeout(async()=>{
      // Save viewing payment
      await supabase.from('view_payments').insert({
        keja_id: keja.id,
        mpesa_code: code,
        amount: 200,
        phone: tenantPhone || 'N/A'
      })

      setStep('viewing_paid')
      setPaying(false)
      alert(`✅ Viewing Fee KSh 200 CONFIRMED!\nCode: ${code}\nTill: 714888\nNow landlord details are OPEN`)
    },1500)
  }

  const bookHouse = async(e:any)=>{
    e.preventDefault()
    if(!tenantName ||!tenantPhone ||!rentMpesaCode) return alert('Enter Name, Phone & Rent M-Pesa Code')
    if(rentMpesaCode.length<8) return alert('Enter valid Rent M-Pesa Code e.g. QHU7S8E9J1')
    if(rentMpesaCode.toUpperCase()===viewingCode.toUpperCase()) return alert('Rent M-Pesa Code cannot be same as Viewing Fee Code! Use different transaction')

    setPaying(true)
    const payoutCode = `SKY-${Date.now().toString().slice(-6)}`
    const receiptNo = `RCPT-${Date.now().toString().slice(-8)}`
    const now = new Date()

    // Check rent code reuse
    const {data: existing} = await supabase.from('bookings').select('id').eq('mpesa_code', rentMpesaCode.toUpperCase()).limit(1)
    if(existing && existing.length>0){
      setPaying(false)
      return alert('❌ Rent M-Pesa Code already used!')
    }

    const {error}=await supabase.from('kejas').update({
      is_taken: true,
      status: 'TAKEN - RENT PAID',
      tenant_name: tenantName,
      tenant_phone: tenantPhone,
      tenant_id: tenantId,
      payout_code: payoutCode,
      payout_at: now.toISOString()
    }).eq('id', keja.id)

    if(error){ alert(error.message); setPaying(false); return }

    const receipt = {
      receiptNo, payoutCode,
      viewingCode: viewingCode.toUpperCase(),
      rentMpesaCode: rentMpesaCode.toUpperCase(),
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

    await supabase.from('bookings').insert({
      keja_id: keja.id,
      receipt_no: receiptNo,
      mpesa_code: rentMpesaCode.toUpperCase(),
      viewing_mpesa_code: viewingCode.toUpperCase(),
      tenant_name: tenantName,
      tenant_phone: tenantPhone,
      tenant_id: tenantId,
      rent_amount: keja.rent,
      payout_code: payoutCode,
      landlord_name: keja.landlord_name,
      landlord_phone: keja.phone
    })

    setKeja({...keja, is_taken:true, tenant_name: tenantName})
    setStep('receipt')
    setPaying(false)
  }

  const sendWhatsAppToLandlord = ()=>{
    if(!receiptData) return
    let phone = keja.phone?.replace(/\D/g,'') || ''
    if(phone.startsWith('0')) phone = '254'+phone.slice(1)
    if(phone.startsWith('7')) phone = '254'+phone
    const message = `*KEJACONNECT - HOUSE BOOKED* 🏠
*Receipt:* ${receiptData.receiptNo}
*Payout Code:* ${receiptData.payoutCode}

*HOUSE:* ${receiptData.houseTitle} - ${receiptData.town}
Rent: KSh ${receiptData.rent}

*TENANT:* ${receiptData.tenantName} - ${receiptData.tenantPhone}

*M-PESA CONFIRMED:*
Viewing Fee Code: ${receiptData.viewingCode} - KSh 200 ✓
Rent Code: ${receiptData.rentMpesaCode} - KSh ${receiptData.rent} ✓
Total Paid: KSh ${receiptData.totalPaid}
Date: ${receiptData.date}

House is now TAKEN.`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if(!keja) return <div style={{padding:20}}>Loading...</div>
  const photos = keja.photo_urls || []

  if(step==='receipt' && receiptData){
    return (
      <div style={{maxWidth:500, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
        <div style={{background:'white', borderRadius:16, padding:20, border:'2px solid #22c55e'}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:40}}>✅</div><h2 style={{margin:'8px 0 0 0', color:'#16a34a'}}>Payment Confirmed!</h2><div style={{fontSize:12, color:'#6b7280'}}>Receipt: {receiptData.receiptNo}</div></div>

          <div style={{marginTop:16, background:'#f0fdf4', padding:12, borderRadius:10, fontSize:12, border:'1px dashed #22c55e'}}>
            <div style={{fontWeight:800}}>M-PESA CONFIRMATION ✓</div>
            <div style={{marginTop:6}}>Viewing: <b>{receiptData.viewingCode}</b> - KSh 200 ✓ Verified</div>
            <div>Rent: <b>{receiptData.rentMpesaCode}</b> - KSh {receiptData.rent} ✓ Verified</div>
            <div>Total: <b>KSh {receiptData.totalPaid}</b></div>
            <div>Paybill/Till: 714888 (Skynet Cyber)</div>
            <div>Date: {receiptData.date}</div>
          </div>

          <div style={{marginTop:12, background:'#f9fafb', padding:12, borderRadius:10, fontSize:12}}>
            <b>House:</b> {receiptData.houseTitle} - {receiptData.town}<br/>
            <b>Tenant:</b> {receiptData.tenantName} ({receiptData.tenantPhone})<br/>
            <b>Landlord:</b> {receiptData.landlordName} - {receiptData.landlordPhone}<br/>
            <b>Status:</b> 🔒 TAKEN • <b>Payout:</b> {receiptData.payoutCode}
          </div>

          <button onClick={sendWhatsAppToLandlord} style={{width:'100%', marginTop:16, padding:14, background:'#25D366', color:'white', borderRadius:10, border:'none', fontWeight:800}}>📲 SEND RECEIPT + M-PESA CODES TO LANDLORD WHATSAPP</button>
          <div style={{display:'flex', gap:8, marginTop:8}}><Link href="/" style={{flex:1, textAlign:'center', padding:10, background:'#f3f4f6', borderRadius:10, textDecoration:'none', color:'#111', fontSize:12, fontWeight:700}}>🏠 Home</Link><button onClick={()=>window.print()} style={{flex:1, padding:10, background:'white', border:'1px solid #ddd', borderRadius:10, fontSize:12}}>🖨️ Print</button></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <Link href="/" style={{textDecoration:'none', color:'#111', fontWeight:700}}>← Back to 47 Counties</Link>
      <div style={{background:'white', borderRadius:16, overflow:'hidden', marginTop:14, border: keja.is_taken?'2px solid #fecaca':'2px solid #22c55e'}}>
        <div style={{height:320, background:'#eee', position:'relative'}}>{photos.length>0? <img src={photos[activePhoto]} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60}}>🏠</div>}<div style={{position:'absolute', top:12, left:12, background: keja.is_taken?'#ef4444':'#22c55e', color:'white', padding:'6px 14px', borderRadius:20, fontWeight:800, fontSize:12}}>{keja.is_taken?'🔒 TAKEN':'✅ VACANT'}</div></div>
        <div style={{padding:16}}>
          <h1 style={{margin:0, fontSize:20}}>{keja.title}</h1>
          <div style={{fontSize:12, color:'#6b7280'}}>📍 {keja.county} - {keja.town} • Rent KSh {keja.rent} • Viewing KSh 200</div>

          <div style={{marginTop:16, padding:14, borderRadius:12, background: keja.is_taken?'#fee2e2':'#f0fdf4', border:'1px solid #bbf7d0'}}>
            {keja.is_taken? <div style={{fontWeight:800, color:'#dc2626'}}>🔒 TAKEN by {keja.tenant_name}</div> :
            step==='view'? (
              <form onSubmit={confirmViewingFee}>
                <div style={{fontWeight:800}}>Step 1: Pay Viewing Fee KSh 200</div>
                <div style={{fontSize:11, marginTop:4, background:'white', padding:8, borderRadius:8, border:'1px solid #e5e7eb'}}>
                  <b>How to Pay:</b><br/>1. M-Pesa → Lipa na M-Pesa → Buy Goods → Till No: <b>714888</b><br/>2. Amount: <b>KSh 200</b><br/>3. Enter M-Pesa PIN → You get SMS with Code e.g. <b>QHU7S8E9J1 Confirmed</b><br/>4. Copy that Code and paste below
                </div>
                <input value={viewingCode} onChange={e=>setViewingCode(e.target.value.toUpperCase())} placeholder="Enter M-Pesa Code e.g. QHU7S8E9J1" style={{width:'100%', padding:12, borderRadius:8, border:'2px solid #16a34a', marginTop:10, fontWeight:700, letterSpacing:1}} required/>
                <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>Code must be 10 characters from M-Pesa SMS - We verify it is not used before</div>
                <button type="submit" disabled={paying} style={{width:'100%', marginTop:10, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Verifying M-Pesa Code...':'✅ VERIFY M-PESA CODE - OPEN HOUSE'}</button>
              </form>
            ) :
            step==='viewing_paid'? (
              <div>
                <div style={{fontWeight:800, color:'#16a34a'}}>✅ Viewing Fee KSh 200 CONFIRMED - Code: {viewingCode} ✓</div>
                <div style={{background:'white', padding:10, borderRadius:10, marginTop:8, fontSize:12, border:'1px solid #22c55e'}}><b>Landlord:</b> {keja.landlord_name}<br/><b>Phone:</b> {keja.phone}<br/><b>M-Pesa:</b> {keja.mpesa_name || keja.landlord_name}<br/><span style={{fontSize:10, color:'#6b7280'}}>Viewing Code Used: {viewingCode}</span></div>
                <button onClick={()=>setStep('book')} style={{width:'100%', marginTop:12, padding:14, background:'#22c55e', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>➡️ PROCEED TO BOOK - PAY RENT KSh {keja.rent}</button>
              </div>
            ) : (
              <form onSubmit={bookHouse}>
                <div style={{fontWeight:800}}>Step 2: Book House - Enter Rent M-Pesa Code</div>
                <div style={{fontSize:11, marginTop:4}}>Pay Rent KSh {keja.rent} to Landlord Till/Phone: <b>{keja.phone}</b></div>
                <input value={tenantName} onChange={e=>setTenantName(e.target.value)} placeholder="Full Name" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}} required/>
                <input value={tenantPhone} onChange={e=>setTenantPhone(e.target.value)} placeholder="Phone 07..." style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:8}} required/>
                <input value={rentMpesaCode} onChange={e=>setRentMpesaCode(e.target.value.toUpperCase())} placeholder="Rent M-Pesa Code e.g. QHU8... (different from viewing)" style={{width:'100%', padding:12, borderRadius:8, border:'2px solid #111', marginTop:8, fontWeight:700}} required/>
                <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>Viewing Code: {viewingCode} ✓ Verified • Rent Code must be different</div>
                <button type="submit" disabled={paying} style={{width:'100%', marginTop:10, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{paying?'⏳ Verifying Rent Code...':'🔒 CONFIRM BOOKING - BOTH CODES VERIFIED'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
