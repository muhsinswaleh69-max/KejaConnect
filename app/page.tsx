"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "./lib/supabase"
import { countyTowns } from "./lib/counties"

function SearchInside({label, options, value, onChange, placeholder}:{label:string, options:string[], value:string, onChange:(v:string)=>void, placeholder:string}){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(typeof document === 'undefined') return
    const h=(e:MouseEvent)=>{ if(ref.current &&!ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter((o)=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{flex:1, minWidth:170, position:'relative'}}>
      <div style={{fontSize:11, fontWeight:800, color:'#374151', marginBottom:5}}>{label} ({options.length})</div>
      <button type="button" onClick={()=>setOpen(!open)} style={{width:'100%', padding:13, borderRadius:10, border:'1px solid #d1d5db', background:'white', fontWeight:700, fontSize:14, display:'flex', justifyContent:'space-between', cursor:'pointer'}}>
        <span>{value}</span><span>▼</span>
      </button>
      {open && (
        <div style={{position:'absolute', top:50, left:0, right:0, background:'white', borderRadius:12, border:'1px solid #e5e7eb', boxShadow:'0 20px 40px rgba(0,0,0,0.25)', zIndex:99999, overflow:'hidden'}}>
          <div style={{padding:8, background:'#f9fafb'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:10, border:'1px solid #d1d5db', borderRadius:8, fontSize:13, outline:'none'}}/>
          </div>
          <div style={{maxHeight:260, overflowY:'auto', background:'white'}}>
            {filtered.map((o)=>(
              <div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:12, fontSize:13, cursor:'pointer', background:o===value?'#dbeafe':'white', borderBottom:'1px solid #f3f4f6'}}>
                {o} {o===value?' ✓':''}
              </div>
            ))}
            {filtered.length===0 && <div style={{padding:12, fontSize:13, color:'#9ca3af'}}>No results</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home(){
  const [kejas, setKejas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")

  useEffect(()=>{
    supabase.from('kejas').select('*').order('created_at',{ascending:false}).then(({data})=>{
      if(data) setKejas(data)
      setLoading(false)
    })
  },[])

  const filtered = kejas.filter(k=> k.county===county && k.town===town)
  const countyList = Object.keys(countyTowns).sort()

  return (
    <div style={{minHeight:'100vh', background:'#f3f4f6'}}>
      <header style={{background:'white', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:20}}>
        <div style={{fontWeight:900, fontSize:16}}>🔑 Keja<span style={{color:'#2563eb'}}>Connect</span> <span style={{fontSize:11, background:'#f3f4f6', padding:'3px 8px', borderRadius:20, marginLeft:6, fontWeight:700}}>{countyList.length} counties</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'9px 14px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:13}}>+ List Keja</a>
      </header>

      <main style={{maxWidth:1100, margin:'0 auto', padding:16, overflow:'visible'}}>
        {/* COVER CARD - FIXED OVERFLOW */}
        <div style={{background:'#111827', borderRadius:18, padding:20, color:'white', overflow:'visible', position:'relative', zIndex:10}}>
          <h1 style={{margin:0, fontSize:22, fontWeight:800}}>Find your next Keja in {town}</h1>
          <p style={{margin:'6px 0 0 0', fontSize:13, color:'#9ca3af'}}>{loading? 'Loading kejas...': `${filtered.length} Kejas in ${town}, ${county} • Live`}</p>

          {/* FILTER BAR - FIXED OVERFLOW + HIGH Z-INDEX */}
          <div style={{background:'white', borderRadius:14, padding:12, marginTop:16, display:'flex', gap:12, flexWrap:'wrap', overflow:'visible', position:'relative', zIndex:50}}>
            <SearchInside label="📍 COUNTY" options={countyList} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="🔍 Search Nairobi, Mombasa, Kisumu..."/>
            <SearchInside label="🛒 TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`🔍 Search in ${county}...`}/>
          </div>
        </div>

        {/* KEJAS GRID */}
        <div style={{marginTop:18, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px,1fr))', gap:14}}>
          {loading && <div style={{gridColumn:'1/-1', textAlign:'center', padding:40, color:'#6b7280'}}>Loading...</div>}
          {!loading && filtered.length===0 && <div style={{gridColumn:'1/-1', textAlign:'center', padding:40, background:'white', borderRadius:12, border:'1px solid #e5e7eb'}}>No kejas in {town}, {county} yet. Be first to list!</div>}
          {filtered.map((k:any)=>(
            <div key={k.id} style={{background:'white', borderRadius:14, overflow:'hidden', border:'1px solid #e5e7eb'}}>
              {k.photos?.[0]? <img src={k.photos[0]} alt="" style={{width:'100%', height:165, objectFit:'cover'}}/> : <div style={{height:165, background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#6b7280'}}>No photo</div>}
              {k.video && <div style={{padding:'0 12px', fontSize:11, color:'#2563eb', fontWeight:700}}>🎥 Video available</div>}
              <div style={{padding:12}}>
                <h3 style={{fontSize:14, fontWeight:800, margin:0, lineHeight:1.3}}>{k.title}</h3>
                <div style={{fontSize:11, color:'#6b7280', marginTop:4}}>📍 {k.town}, {k.county}</div>
                <div style={{fontSize:17, fontWeight:900, marginTop:8}}>KSh {Number(k.rent).toLocaleString()}</div>
                <a href={`/keja/${k.id}`} style={{display:'block', textAlign:'center', marginTop:10, background:'#111827', color:'white', padding:10, borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:700}}>View Details</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
