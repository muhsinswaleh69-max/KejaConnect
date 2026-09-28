"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"

const COUNTIES: any = {
  "All": ["All Towns"],
  "Kakamega": ["All Towns", "Shianda Market", "Ekero", "Mumias Town", "Shibale", "Matawa", "Bukura", "Kakamega Town"],
  "Vihiga": ["All Towns", "Mbale", "Luanda", "Majengo", "Chavakali"],
  "Bungoma": ["All Towns", "Bungoma Town", "Kimilili", "Webuye"],
  "Busia": ["All Towns", "Busia Town", "Nambale", "Butula"],
  "Kisumu": ["All Towns", "Kisumu Town", "Maseno"]
}

export default function Home(){
  const [kejas, setKejas] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<'all'|'vacant'|'taken'>('all')
  const [countyFilter, setCountyFilter] = useState("All")
  const [townFilter, setTownFilter] = useState("All Towns")

  useEffect(()=>{
    (async()=>{
      const {data}=await supabase.from('kejas').select('*').order('id',{ascending:false})
      setKejas(data||[])
    })()
  },[])

  const filtered = kejas.filter((k:any)=>{
    const txt = `${k.title} ${k.town} ${k.county} ${k.landlord_name||''}`.toLowerCase()
    const matchesSearch = txt.includes(search.toLowerCase())
    const matchesCounty = countyFilter==='All' || k.county===countyFilter || (!k.county && countyFilter==='Kakamega')
    const matchesTown = townFilter==='All Towns' || k.town===townFilter
    const matchesVacant = filter==='all'? true : filter==='vacant'?!k.is_taken : k.is_taken
    return matchesSearch && matchesCounty && matchesTown && matchesVacant
  })

  const vacantCount = kejas.filter((k:any)=>!k.is_taken).length
  const takenCount = kejas.filter((k:any)=>k.is_taken).length

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      {/* HEADER */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1 style={{margin:0, fontSize:22}}>KejaConnect 🏠</h1>
          <div style={{fontSize:11, color:'#6b7280', marginTop:2}}>Skynet Cyber 0713614441 • Viewing Fee KSh 200 • LOOP BIZ 714888 / 467108</div>
        </div>
        <Link href="/admin" style={{background:'#111', color:'white', padding:'8px 14px', borderRadius:20, textDecoration:'none', fontSize:12, fontWeight:800}}>Admin</Link>
      </div>

      {/* FILTERS - COUNTY + TOWN/MARKET + VACANT/TAKEN */}
      <div style={{background:'white', padding:12, borderRadius:16, marginTop:14, border:'1px solid #e5e7eb'}}>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: Shianda, Ekero, Landlord..." style={{flex:1, minWidth:180, padding:12, borderRadius:12, border:'1px solid #ddd', fontSize:13}}/>

          <select value={countyFilter} onChange={e=>{setCountyFilter(e.target.value); setTownFilter("All Towns")}} style={{padding:'10px 12px', borderRadius:20, border:'1px solid #111', fontWeight:700, fontSize:12, background:'white'}}>
            <option value="All">All Counties</option>
            <option value="Kakamega">Kakamega County</option>
            <option value="Vihiga">Vihiga County</option>
            <option value="Bungoma">Bungoma County</option>
            <option value="Busia">Busia County</option>
            <option value="Kisumu">Kisumu County</option>
          </select>

          <select value={townFilter} onChange={e=>setTownFilter(e.target.value)} style={{padding:'10px 12px', borderRadius:20, border:'1px solid #ddd', fontWeight:700, fontSize:12, background:'#e0f2fe'}}>
            {COUNTIES[countyFilter].map((t:string)=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{display:'flex', gap:8, marginTop:10, flexWrap:'wrap'}}>
          <button onClick={()=>setFilter('all')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='all'?'#111':'#f3f4f6', color:filter==='all'?'white':'#111', fontWeight:700, fontSize:12}}>All {kejas.length}</button>
          <button onClick={()=>setFilter('vacant')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='vacant'?'#22c55e':'#f3f4f6', color:filter==='vacant'?'white':'#111', fontWeight:700, fontSize:12}}>✅ Vacant {vacantCount}</button>
          <button onClick={()=>setFilter('taken')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='taken'?'#ef4444':'#f3f4f6', color:filter==='taken'?'white':'#111', fontWeight:700, fontSize:12}}>🔒 Taken {takenCount}</button>
          {countyFilter!=='All' && <span style={{fontSize:11, color:'#6b7280', alignSelf:'center', marginLeft:6}}>📍 {countyFilter} {townFilter!=='All Towns'?`→ ${townFilter}`:''}</span>}
        </div>
      </div>

      {/* HOUSES GRID */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, marginTop:18}}>
        {filtered.map((k:any)=>{
          const isTaken=k.is_taken; const isPaid=k.status?.includes('PAID')
          return (
            <div key={k.id} style={{background:'white', borderRadius:16, border: isTaken?'2px solid #fecaca':'2px solid #bbf7d0', overflow:'hidden', position:'relative'}}>
              <div style={{position:'absolute', top:10, left:10, zIndex:2, background:isTaken?'#ef4444':'#22c55e', color:'white', fontSize:10, padding:'4px 10px', borderRadius:20, fontWeight:800}}>
                {isTaken? (isPaid?'🔒 TAKEN & PAID':'⏳ TAKEN'):'✅ VACANT'}
              </div>
              <div style={{position:'absolute', top:10, right:10, zIndex:2, background:'white', color:'#111', fontSize:9, padding:'3px 8px', borderRadius:20, fontWeight:700, border:'1px solid #e5e7eb'}}>
                {k.county||'Kakamega'} • {k.town}
              </div>
              <div style={{height:140, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40}}>{isTaken?'🔒':'🏠'}</div>
              <div style={{padding:14}}>
                <div style={{fontWeight:800, fontSize:14, lineHeight:'18px'}}>{k.title}</div>
                <div style={{fontSize:11, color:'#6b7280', marginTop:4}}>📍 {k.county||'Kakamega'} County - {k.town} {k.landlord_name?`• Landlord: ${k.landlord_name}`:''}</div>
                <div style={{fontSize:12, color:'#111', marginTop:4}}>Rent: <b>KSh {k.rent}</b> • Viewing: <b>KSh 200</b></div>
                {isTaken && <div style={{fontSize:10, color:'#6b7280', marginTop:6}}>Booked: {k.tenant_name||'Tenant'} • {k.booked_at?new Date(k.booked_at).toLocaleDateString():''}</div>}
                <div style={{marginTop:12}}>
                  {k.is_taken? (
                    <button disabled style={{background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca', padding:'10px', borderRadius:10, fontWeight:800, width:'100%', fontSize:12, cursor:'not-allowed'}}>🔒 TAKEN - NOT VACANT - {k.town}</button>
                  ) : (
                    <Link href={`/keja/${k.id}`} style={{background:'#111', color:'white', padding:'10px', borderRadius:10, fontWeight:800, textDecoration:'none', textAlign:'center', display:'block', width:'100%', fontSize:12}}>✅ VACANT - Book Now - {k.town} (KSh 200)</Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length===0 && <div style={{textAlign:'center', marginTop:40, color:'#6b7280'}}>No houses found in {countyFilter} {townFilter!=='All Towns'?`- ${townFilter}`:''}. Try All Counties.</div>}

      <div style={{textAlign:'center', marginTop:30, fontSize:10, color:'#9ca3af'}}>KejaConnect - County {countyFilter} → Town {townFilter} • Skynet Cyber 0713614441 • LOOP BIZ 714888 Acc 467108 • Viewing Fee KSh 200 (100% yours) • 20% Agency Cut</div>
    </div>
  )
}
