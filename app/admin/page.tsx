"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COUNTIES: any = {
  "Kakamega": ["Shianda Market", "Ekero", "Mumias Town", "Shibale", "Matawa", "Bukura", "Kakamega Town"],
  "Vihiga": ["Mbale", "Luanda", "Majengo", "Chavakali"],
  "Bungoma": ["Bungoma Town", "Kimilili", "Webuye"],
  "Busia": ["Busia Town", "Nambale", "Butula"],
  "Kisumu": ["Kisumu Town", "Maseno"]
}

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const [pass, setPass] = useState("")
  const [authed, setAuthed] = useState(false)

  const [title, setTitle] = useState("")
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")
  const [rent, setRent] = useState("")
  const [landlordName, setLandlordName] = useState("")
  const [landlordPhone, setLandlordPhone] = useState("")
  const [caretakerPhone, setCaretakerPhone] = useState("")
  const [desc, setDesc] = useState("")

  const [tenantName, setTenantName] = useState<{[k:string]:string}>({})
  const [tenantPhone, setTenantPhone] = useState<{[k:string]:string}>({})
  const [tenantId, setTenantId] = useState<{[k:string]:string}>({})
  const [mpesaCode, setMpesaCode] = useState<{[k:string]:string}>({})

  const load = async()=>{
    const {data}=await supabase.from('kejas').select('*').order('id',{ascending:false})
    setKejas(data||[])
  }
  useEffect(()=>{ if(authed) load() },[authed])

  const addHouse = async(e:any)=>{
    e.preventDefault()
    if(!title ||!rent ||!landlordPhone) return alert('Fill Title, Rent, Landlord Phone')
    const {error}=await supabase.from('kejas').insert({
      title,
      county,
      town,
      rent: parseInt(rent),
      phone: landlordPhone,
      landlord_name: landlordName,
      caretaker_phone: caretakerPhone,
      description: desc,
      is_taken: false,
      status: 'VACANT'
    })
    if(error) alert(error.message)
    else {
      alert(`✅ Added ${title} in ${county} - ${town} - VACANT`)
      setTitle(""); setRent(""); setLandlordName(""); setLandlordPhone(""); setCaretakerPhone(""); setDesc("")
      load()
    }
  }

  const bookTenant = async(id:any)=>{
    const name=tenantName[id]; const ph=tenantPhone[id]; const idNo=tenantId[id]
    if(!name||!ph) return alert('Enter Tenant Name + Phone')
    await supabase.from('kejas').update({tenant_name:name, tenant_phone:ph, tenant_id:idNo, is_taken:true, status:'TAKEN - BOOKED', booked_at:new Date().toISOString()}).eq('id',id)
    load()
  }
  const markPaid = async(id:any, rentAmt:number)=>{
    const code=mpesaCode[id]; if(!code) return alert('Enter M-Pesa Code')
    await supabase.from('kejas').update({status:'PAID TO LANDLORD - TAKEN', payout_code:code, payout_at:new Date().toISOString()}).eq('id',id)
    load()
  }
  const makeVacant = async(id:any)=>{
    if(!confirm('Make VACANT again?')) return
    await supabase.from('kejas').update({is_taken:false, status:'VACANT', tenant_name:null, tenant_phone:null, tenant_id:null, payout_code:null, payout_at:null, booked_at:null}).eq('id',id)
    load()
  }
  const receipt = (k:any)=>{
    const text=`KEJA CONNECT RECEIPT\nHouse: ${k.title}\nCounty: ${k.county} - Town: ${k.town}\nRent: KSh ${k.rent}\nLandlord: ${k.landlord_name} ${k.phone} / Caretaker ${k.caretaker_phone}\nTenant: ${k.tenant_name} ${k.tenant_phone}\nM-Pesa: ${k.payout_code}\nYour Cut 20%: KSh ${Math.round(k.rent*0.2)} To Landlord 80%: KSh ${Math.round(k.rent*0.8)}\nLOOP BIZ 714888 Acc 467108`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank')
  }

  if(!authed) return <div style={{maxWidth:400, margin:'100px auto', padding:20}}><h2>Admin Login</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="keja2024" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd'}}/><button onClick={()=>{if(pass==='keja2024')setAuthed(true);else alert('Wrong')}} style={{width:'100%', marginTop:10, padding:12, background:'#111', color:'white', borderRadius:8}}>Login</button></div>

  const total=kejas.length; const vacant=kejas.filter(k=>!k.is_taken).length; const taken=kejas.filter(k=>k.is_taken).length; const yourCut=kejas.filter(k=>k.status?.includes('PAID')).reduce((s,k)=>s+Math.round(k.rent*0.2),0)

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:8, marginTop:10}}><span style={{background:'white', padding:'8px 12px', borderRadius:8}}>Total {total}</span><span style={{background:'#dcfce7', padding:'8px 12px', borderRadius:8}}>Vacant {vacant}</span><span style={{background:'#fce7f3', padding:'8px 12px', borderRadius:8}}>Taken {taken}</span><span style={{background:'#111', color:'white', padding:'8px 12px', borderRadius:8}}>Your 20% KSh {yourCut}</span></div>

      {/* NEW FORM WITH COUNTY + TOWN/MARKET + LANDLORD GIVEN */}
      <form onSubmit={addHouse} style={{background:'white', padding:16, borderRadius:16, marginTop:20, border:'2px solid #111'}}>
        <b>➕ Add New House - County + Town/Market + Landlord</b>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title: 1 Bedroom House Ekero" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>

          <select value={county} onChange={e=>{setCounty(e.target.value); setTown(COUNTIES[e.target.value][0])}} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}>
            {Object.keys(COUNTIES).map(c=><option key={c} value={c}>{c} County</option>)}
          </select>

          <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#e0f2fe'}}>
            {COUNTIES[county].map((t:string)=><option key={t} value={t}>{t}</option>)}
          </select>

          <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent: 5000" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>

          <input value={landlordName} onChange={e=>setLandlordName(e.target.value)} placeholder="Landlord Name (Given): e.g. Muhsin Swaleh" style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#fef9c3'}}/>

          <input value={landlordPhone} onChange={e=>setLandlordPhone(e.target.value)} placeholder="Landlord M-Pesa Phone 07..." style={{padding:10, borderRadius:8, border:'2px solid #111'}}/>

          <input value={caretakerPhone} onChange={e=>setCaretakerPhone(e.target.value)} placeholder="Caretaker Phone (Optional)" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>

          <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description: water, electricity, tiles..." style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
        </div>

        <button type="submit" style={{width:'100%', marginTop:12, padding:12, background:'#22c55e', color:'white', borderRadius:10, border:'none', fontWeight:800}}>✅ Add House - {county} - {town} - VACANT</button>
        <div style={{fontSize:11, textAlign:'center', marginTop:6, color:'#6b7280'}}>Navigated: Homepage will filter by County {county} → Town {town} | Viewing Fee KSh 200</div>
      </form>

      <div style={{marginTop:20, display:'flex', flexDirection:'column', gap:12}}>
        {kejas.map(k=>(
          <div key={k.id} style={{background:'white', padding:14, borderRadius:12, borderLeft:k.is_taken?'6px solid #f59e0b':'6px solid #22c55e'}}>
            <b>{k.title} - {k.county || 'Kakamega'} - {k.town}</b> {k.status?.includes('PAID') && <span style={{background:'#22c55e', color:'white', fontSize:10, padding:'2px 8px', borderRadius:10}}>TAKEN & PAID</span>}
            <div style={{fontSize:12, color:'#6b7280'}}>Rent KSh {k.rent} • Landlord: {k.landlord_name||''} {k.phone} {k.caretaker_phone?` / Caretaker ${k.caretaker_phone}`:''}</div>
            {k.is_taken && <div style={{fontSize:12}}>Tenant: {k.tenant_name} {k.tenant_phone} | {k.status} {k.payout_code}</div>}
            <div style={{marginTop:8, display:'flex', gap:6, flexWrap:'wrap'}}>
              {!k.is_taken? (
                <>
                  <input placeholder="Tenant Name" value={tenantName[k.id]||''} onChange={e=>setTenantName({...tenantName,[k.id]:e.target.value})} style={{padding:6, borderRadius:6, border:'1px solid #ddd', fontSize:12}}/>
                  <input placeholder="Phone" value={tenantPhone[k.id]||''} onChange={e=>setTenantPhone({...tenantPhone,[k.id]:e.target.value})} style={{padding:6, borderRadius:6, border:'1px solid #ddd', fontSize:12}}/>
                  <input placeholder="ID" value={tenantId[k.id]||''} onChange={e=>setTenantId({...tenantId,[k.id]:e.target.value})} style={{padding:6, borderRadius:6, border:'1px solid #ddd', fontSize:12}}/>
                  <button onClick={()=>bookTenant(k.id)} style={{padding:'6px 10px', background:'#111', color:'white', borderRadius:6, fontSize:12}}>Book - TAKEN</button>
                </>
              ): k.status?.includes('PAID')? (
                <>
                  <button onClick={()=>receipt(k)} style={{padding:'6px 10px', background:'#111', color:'white', borderRadius:6, fontSize:12}}>Receipt / WhatsApp</button>
                  <button onClick={()=>makeVacant(k.id)} style={{padding:'6px 10px', background:'white', border:'1px solid #ddd', borderRadius:6, fontSize:12}}>Make Vacant Again</button>
                </>
              ):(
                <>
                  <input placeholder="M-Pesa Code" value={mpesaCode[k.id]||''} onChange={e=>setMpesaCode({...mpesaCode,[k.id]:e.target.value})} style={{padding:6, borderRadius:6, border:'1px solid #ddd', fontSize:12}}/>
                  <button onClick={()=>markPaid(k.id,k.rent)} style={{padding:'6px 10px', background:'#22c55e', color:'white', borderRadius:6, fontSize:12}}>Mark PAID</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
