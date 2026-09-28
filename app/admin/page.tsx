"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const [pass, setPass] = useState("")
  const [authed, setAuthed] = useState(false)

  // Add House form
  const [title, setTitle] = useState("")
  const [town, setTown] = useState("Shianda Market")
  const [rent, setRent] = useState("")
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")

  // Booking form states
  const [tenantName, setTenantName] = useState<{[key:string]:string}>({})
  const [tenantPhone, setTenantPhone] = useState<{[key:string]:string}>({})
  const [tenantId, setTenantId] = useState<{[key:string]:string}>({})
  const [mpesaCode, setMpesaCode] = useState<{[key:string]:string}>({})

  const load = async()=>{
    const {data} = await supabase.from('kejas').select('*').order('id',{ascending:false})
    setKejas(data||[])
  }
  useEffect(()=>{ if(authed) load() },[authed])

  const login = ()=>{
    if(pass === 'keja2024'){ setAuthed(true) } else { alert('Wrong password') }
  }

  const addHouse = async(e:any)=>{
    e.preventDefault()
    if(!title ||!rent ||!phone) return alert('Fill Title, Rent, Phone')
    const {error} = await supabase.from('kejas').insert({
      title,
      town,
      rent: parseInt(rent),
      phone,
      description: desc,
      is_taken: false,
      status: 'VACANT'
    })
    if(error) alert(error.message)
    else {
      alert('✅ House Added - Now VACANT')
      setTitle(""); setRent(""); setPhone(""); setDesc("")
      load()
    }
  }

  const bookTenant = async(id:any)=>{
    const name = tenantName[id]
    const ph = tenantPhone[id]
    const idNo = tenantId[id]
    if(!name ||!ph) return alert('Enter Tenant Name + Phone')
    const {error} = await supabase.from('kejas').update({
      tenant_name: name,
      tenant_phone: ph,
      tenant_id: idNo,
      is_taken: true,
      status: 'TAKEN - BOOKED',
      booked_at: new Date().toISOString()
    }).eq('id', id)
    if(error) alert(error.message)
    else { alert(`✅ Booked for ${name} - Now TAKEN`); load() }
  }

  const markPaid = async(id:any, rentAmt:number)=>{
    const code = mpesaCode[id]
    if(!code) return alert('Enter M-Pesa Code e.g. EFA265HDM')
    const {error} = await supabase.from('kejas').update({
      status: 'PAID TO LANDLORD - TAKEN',
      payout_code: code,
      payout_at: new Date().toISOString()
    }).eq('id', id)
    if(error) alert(error.message)
    else { alert(`✅ Marked PAID - Your 20% = KSh ${Math.round(rentAmt*0.2)}`); load() }
  }

  const makeVacant = async(id:any)=>{
    if(!confirm('Make this house VACANT again?')) return
    await supabase.from('kejas').update({
      is_taken: false,
      status: 'VACANT',
      tenant_name: null, tenant_phone: null, tenant_id: null,
      payout_code: null, payout_at: null, booked_at: null
    }).eq('id', id)
    load()
  }

  const receipt = (k:any)=>{
    const rent = k.rent
    const cut = Math.round(rent*0.2)
    const toLandlord = Math.round(rent*0.8)
    const text = `KEJA CONNECT - SKYNET CYBER RECEIPT\nHouse: ${k.title} - ${k.town}\nRent: KSh ${rent}\nStatus: ${k.status}\n\nTenant: ${k.tenant_name} | ${k.tenant_phone} | ID: ${k.tenant_id}\nBooked: ${k.booked_at? new Date(k.booked_at).toLocaleString() : ''}\n\nYour Cut (20%): KSh ${cut}\nTo Landlord (80%): KSh ${toLandlord}\nM-Pesa Code: ${k.payout_code||''}\nPaid On: ${k.payout_at? new Date(k.payout_at).toLocaleString() : ''}\n\nLOOP BIZ Paybill 714888 Acc 467108\n0713614441 - Skynet Cyber - Viewing Fee KSh 200`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  if(!authed){
    return (
      <div style={{maxWidth:400, margin:'100px auto', padding:20}}>
        <h2>Admin Login</h2>
        <input type="password" placeholder="Password keja2024" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd'}}/>
        <button onClick={login} style={{width:'100%', marginTop:10, padding:12, background:'#111', color:'white', borderRadius:8}}>Login</button>
      </div>
    )
  }

  const total = kejas.length
  const vacant = kejas.filter(k=>!k.is_taken).length
  const taken = kejas.filter(k=>k.is_taken).length
  const yourCut = kejas.filter(k=>k.status?.includes('PAID')).reduce((s,k)=>s+Math.round(k.rent*0.2),0)

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:10}}>
        <span style={{background:'white', padding:'8px 12px', borderRadius:8}}>Total {total}</span>
        <span style={{background:'#dcfce7', padding:'8px 12px', borderRadius:8}}>Vacant {vacant}</span>
        <span style={{background:'#fce7f3', padding:'8px 12px', borderRadius:8}}>Taken {taken}</span>
        <span style={{background:'#111', color:'white', padding:'8px 12px', borderRadius:8}}>Your 20% KSh {yourCut}</span>
      </div>

      {/* ✅ ADD HOUSE FORM - THIS WAS MISSING */}
      <form onSubmit={addHouse} style={{background:'white', padding:16, borderRadius:16, marginTop:20, border:'2px solid #111'}}>
        <b style={{fontSize:18}}>➕ Add New House</b>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title: 1 Bedroom House Ekero" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={town} onChange={e=>setTown(e.target.value)} placeholder="Town: Ekero / Shianda" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent: 5000" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Landlord Phone 07..." style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
        </div>
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description: water, electricity, tiles..." style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:10}}/>
        <button type="submit" style={{width:'100%', marginTop:12, padding:12, background:'#22c55e', color:'white', borderRadius:10, border:'none', fontWeight:800}}>✅ Add House - Make VACANT</button>
        <div style={{fontSize:11, color:'#6b7280', marginTop:6, textAlign:'center'}}>Viewing Fee is now KSh 200 - 100% yours</div>
      </form>

      {/* HOUSES LIST */}
      <div style={{marginTop:20, display:'flex', flexDirection:'column', gap:12}}>
        {kejas.map(k=>{
          const isTaken = k.is_taken
          const isPaid = k.status?.includes('PAID')
          return (
            <div key={k.id} style={{background:'white', padding:14, borderRadius:12, borderLeft: isPaid?'6px solid #22c55e': isTaken?'6px solid #f59e0b':'6px solid #22c55e'}}>
              <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>
                <div>
                  <b>{k.title} - {k.town}</b> {isPaid && <span style={{background:'#22c55e', color:'white', fontSize:10, padding:'2px 8px', borderRadius:10}}>TAKEN & PAID</span>}
                  {isTaken &&!isPaid && <span style={{background:'#f59e0b', color:'white', fontSize:10, padding:'2px 8px', borderRadius:10}}>TAKEN - BOOKED</span>}
                  {!isTaken && <span style={{background:'#22c55e', color:'white', fontSize:10, padding:'2px 8px', borderRadius:10}}>VACANT</span>}
                  <div style={{fontSize:12, color:'#6b7280'}}>Rent KSh {k.rent} • Landlord {k.phone}</div>
                  {isTaken && <div style={{fontSize:12, marginTop:4}}>Tenant: <b>{k.tenant_name}</b> | {k.tenant_phone} | ID: {k.tenant_id}<br/>Status: {k.status} {k.payout_code && `• M-Pesa ${k.payout_code} • ${new Date(k.payout_at).toLocaleDateString()}`}</div>}
                </div>
                <div style={{textAlign:'right'}}>
                  {isPaid && <div><div style={{fontSize:11}}>Your Cut</div><div style={{fontWeight:800, color:'#16a34a'}}>KSh {Math.round(k.rent*0.2)}</div><div style={{fontSize:11}}>To Landlord</div><div style={{fontWeight:800}}>KSh {Math.round(k.rent*0.8)}</div></div>}
                </div>
              </div>

              {!isTaken? (
                <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
                  <input placeholder="Tenant Name e.g. Elizabeth Wanjala" value={tenantName[k.id]||''} onChange={e=>setTenantName({...tenantName, [k.id]:e.target.value})} style={{padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
                  <input placeholder="Phone 072..." value={tenantPhone[k.id]||''} onChange={e=>setTenantPhone({...tenantPhone, [k.id]:e.target.value})} style={{padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
                  <input placeholder="ID 1000..." value={tenantId[k.id]||''} onChange={e=>setTenantId({...tenantId, [k.id]:e.target.value})} style={{padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
                  <button onClick={()=>bookTenant(k.id)} style={{padding:'8px 12px', background:'#111', color:'white', borderRadius:8, border:'none', fontSize:12}}>Book Tenant - Make TAKEN</button>
                </div>
              ) :!isPaid? (
                <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
                  <input placeholder="M-Pesa Code e.g. EFA265HDM" value={mpesaCode[k.id]||''} onChange={e=>setMpesaCode({...mpesaCode, [k.id]:e.target.value})} style={{padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
                  <button onClick={()=>markPaid(k.id, k.rent)} style={{padding:'8px 12px', background:'#22c55e', color:'white', borderRadius:8, border:'none', fontSize:12}}>Mark PAID TO LANDLORD KSh {k.rent}</button>
                  <button onClick={()=>receipt(k)} style={{padding:'8px 12px', background:'white', border:'1px solid #ddd', borderRadius:8, fontSize:12}}>Receipt / WhatsApp</button>
                  <button onClick={()=>makeVacant(k.id)} style={{padding:'8px 12px', background:'white', border:'1px solid #ddd', borderRadius:8, fontSize:12}}>Make Vacant Again</button>
                </div>
              ) : (
                <div style={{display:'flex', gap:6, marginTop:10}}>
                  <button onClick={()=>receipt(k)} style={{padding:'8px 12px', background:'#111', color:'white', borderRadius:8, border:'none', fontSize:12}}>🧾 Receipt / WhatsApp</button>
                  <button onClick={()=>makeVacant(k.id)} style={{padding:'8px 12px', background:'white', border:'1px solid #ddd', borderRadius:8, fontSize:12}}>Make Vacant Again</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
