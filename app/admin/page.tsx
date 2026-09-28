"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const [showTenantForm, setShowTenantForm] = useState<any>(null)
  const [tName, setTName] = useState("")
  const [tPhone, setTPhone] = useState("")
  const [tId, setTId] = useState("")

  const load = async()=>{
    const {data} = await supabase.from('kejas').select('*').order('id',{ascending:false})
    setKejas(data||[])
  }
  useEffect(()=>{load()},[])

  const saveTenant = async()=>{
    if(!tName || !tPhone) return alert("Enter tenant name & phone")
    const {error} = await supabase.from('kejas').update({
      tenant_name: tName,
      tenant_phone: tPhone,
      tenant_id: tId,
      is_taken: true,
      status: 'Taken - Not Paid Landlord',
      booked_at: new Date().toISOString()
    }).eq('id', showTenantForm.id)
    if(error) return alert(error.message)
    setShowTenantForm(null); setTName(""); setTPhone(""); setTId(""); load()
  }

  const markPaid = async(k:any)=>{
    const code = prompt(`You sent KSh ${Math.round(k.rent*0.8)} to landlord ${k.phone}\nEnter LOOP BIZ M-Pesa Code:`)
    if(!code) return
    await supabase.from('kejas').update({
      status: 'PAID TO LANDLORD - TAKEN',
      payout_code: code,
      payout_at: new Date().toISOString(),
      is_taken: true
    }).eq('id', k.id)
    load()
  }

  const markVacant = async(k:any)=>{
    if(!confirm(`Make ${k.title} VACANT again?`)) return
    await supabase.from('kejas').update({
      is_taken: false, status: 'Vacant', tenant_name: null, tenant_phone: null, tenant_id: null, payout_code: null, payout_at: null
    }).eq('id', k.id)
    load()
  }

  const shareReceipt = (k:any)=>{
    const msg = `*KEJA CONNECT - SKYNET CYBER RECEIPT*\n\nHouse: ${k.title} - ${k.town}\nRent: KSh ${k.rent}\nStatus: ${k.status}\n\nTenant: ${k.tenant_name} (${k.tenant_phone}) ID: ${k.tenant_id||'N/A'}\nBooked: ${k.booked_at? new Date(k.booked_at).toLocaleString() : ''}\n\nYour Cut (20%): KSh ${Math.round(k.rent*0.2)}\nTo Landlord (80%): KSh ${Math.round(k.rent*0.8)}\nM-Pesa Code: ${k.payout_code||'Not paid yet'}\nPaid On: ${k.payout_at? new Date(k.payout_at).toLocaleString() : 'Pending'}\n\nLOOP BIZ Paybill 714888 Acc 467108\n0713614441 - Skynet Cyber`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:12, marginTop:12, flexWrap:'wrap'}}>
        <div style={{background:'white', padding:12, borderRadius:10}}>Total <b>{kejas.length}</b></div>
        <div style={{background:'#dcfce7', padding:12, borderRadius:10}}>Vacant <b>{kejas.filter(k=>!k.is_taken).length}</b></div>
        <div style={{background:'#fee2e2', padding:12, borderRadius:10}}>Taken <b>{kejas.filter(k=>k.is_taken).length}</b></div>
        <div style={{background:'#111', color:'white', padding:12, borderRadius:10}}>Your 20% <b>KSh {kejas.filter(k=>k.is_taken).reduce((s,k)=>s+Math.round(k.rent*0.2),0)}</b></div>
      </div>

      <div style={{marginTop:20, background:'white', borderRadius:12, overflow:'hidden'}}>
        {kejas.map((k:any)=>{
          const taken = k.is_taken
          const paid = k.status?.includes('PAID TO LANDLORD')
          return (
            <div key={k.id} style={{padding:16, borderLeft: `6px solid ${!taken ? '#22c55e' : paid ? '#16a34a' : '#f59e0b'}`, borderBottom:'1px solid #eee', background: taken ? '#fff7ed' : 'white'}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex', gap:6, alignItems:'center'}}>
                    <span style={{fontWeight:800}}>{k.title} - {k.town}</span>
                    <span style={{fontSize:10, padding:'3px 8px', borderRadius:20, fontWeight:800, background: !taken ? '#22c55e' : paid ? '#16a34a' : '#f59e0b', color:'white'}}>
                      {!taken ? '✅ VACANT' : paid ? '🔒 TAKEN & PAID' : '⏳ TAKEN - PENDING PAYOUT'}
                    </span>
                  </div>
                  <div style={{fontSize:12, color:'#6b7280', marginTop:4}}>Rent KSh {k.rent} • Landlord M-Pesa {k.phone||'N/A'}</div>
                  {taken && <div style={{fontSize:12, marginTop:4}}><b>Tenant:</b> {k.tenant_name} | {k.tenant_phone} | ID: {k.tenant_id||'N/A'}</div>}
                  <div style={{fontSize:11, color:'#6b7280'}}>Status: <b style={{color: paid ? 'green' : 'orange'}}>{k.status}</b> {k.payout_code && `• M-Pesa ${k.payout_code} • ${k.payout_at ? new Date(k.payout_at).toLocaleDateString() : ''}`}</div>
                  
                  <div style={{display:'flex', gap:8, marginTop:10, flexWrap:'wrap'}}>
                    {!taken && <button onClick={()=>setShowTenantForm(k)} style={{background:'#111', color:'white', border:'none', padding:'8px 14px', borderRadius:20, fontWeight:700}}>➕ Book Tenant - Mark Taken</button>}
                    {taken && !paid && <button onClick={()=>markPaid(k)} style={{background:'#93c5fd', border:'none', padding:'8px 14px', borderRadius:20, fontWeight:700}}>Mark Paid to Landlord M-Pesa</button>}
                    {taken && <button onClick={()=>shareReceipt(k)} style={{background:'#dcfce7', border:'none', padding:'8px 14px', borderRadius:20}}>🧾 Receipt / WhatsApp</button>}
                    {taken && <button onClick={()=>markVacant(k)} style={{background:'#fee2e2', border:'none', padding:'6px 12px', borderRadius:20, fontSize:11}}>Make Vacant Again</button>}
                  </div>
                </div>
                <div style={{textAlign:'right'}}><div style={{fontSize:11}}>Your Cut</div><b style={{color:'#16a34a'}}>KSh {Math.round(k.rent*0.2)}</b><div style={{fontSize:11, marginTop:6}}>To Landlord</div><b>KSh {Math.round(k.rent*0.8)}</b></div>
              </div>
            </div>
          )
        })}
      </div>

      {showTenantForm && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}}>
          <div style={{background:'white', padding:20, borderRadius:16, width:340}}>
            <h3 style={{margin:0}}>Book Tenant for {showTenantForm.title}</h3>
            <p style={{fontSize:12, color:'#6b7280'}}>House will become TAKEN - not vacant</p>
            <input placeholder="Tenant Full Name" value={tName} onChange={e=>setTName(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}}/>
            <input placeholder="Tenant Phone e.g 0712..." value={tPhone} onChange={e=>setTPhone(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}}/>
            <input placeholder="ID Number (Optional)" value={tId} onChange={e=>setTId(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd', marginTop:10}}/>
            <div style={{display:'flex', gap:10, marginTop:14}}>
              <button onClick={()=>setShowTenantForm(null)} style={{flex:1, padding:12, borderRadius:8, border:'1px solid #ddd'}}>Cancel</button>
              <button onClick={saveTenant} style={{flex:1, background:'#111', color:'white', padding:12, borderRadius:8, fontWeight:700, border:'none'}}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
