"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "./lib/supabase"
import { countyTowns } from "./lib/counties"

function SearchInside({label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h); return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{flex:1, minWidth:'170px', position:'relative'}}>
      <div style={{fontSize:'11px', fontWeight:800, color:'#374151', marginBottom:'5px'}}>{label} ({options.length})</div>
      <button onClick={()=>setOpen(!open)} style={{width:'100%', padding:'13px', borderRadius:'10px', border:'1px solid #d1d5db', background:'white', fontWeight:700, fontSize:'14px', display:'flex', justifyContent:'space-between', cursor:'pointer'}}>
        {value} <span>▼</span>
      </button>
      {open && (
        <div style={{position:'absolute', top:'46px', left:0, right:0, background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', boxShadow:'0 12px 28px rgba(0,0,0,0.18)', zIndex:99999, overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:'10px', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'13px', outline:'none'}}/>
          </div>
          <div style={{maxHeight:'260px', overflowY:'auto', background:'white'}}>
            {filtered.map((o:string)=>(
              <div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'12px', fontSize:'13px', cursor:'pointer', background:o===value?'#dbeafe':'white', borderBottom:'1px solid #f3f4f6'}}>
                {o} {o===value?' ✓':''}
              </div>
            ))}
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
  useEffect(()=>{ supabase.from('kejas').select('*').order('created_at',{ascending:false}).then(({data})=>{ if(data) setKejas(data); setLoading(false) }) },[])
  const filtered = kejas.filter(k=> k.county===county && k.town===town)
  const countyList = Object.keys(countyTowns).sort()
  return (
    <div style={{minHeight:'100vh', background:'#f3f4f6'}}>
      <header style={{background:'white', padding:'14px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:20}}>
        <div style={{fontWeight:900}}>🔑 Keja<span style={{color:'#2563eb'}}>Connect</span> <span style={{fontSize:'11px', background:'#f3f4f6', padding:'3px 6px', borderRadius:'20px'}}>{countyList.length} counties</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'9px 14px', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'13px'}}>+ List Keja</a>
      </header>
      <main style={{maxWidth:'900px', margin:'0 auto', padding:'16px', overflow:'visible'}}>
        <div style={{background:'#111827', borderRadius:'18px', padding:'20px', color:'white', overflow:'visible'}}>
          <h1 style={{margin:0, fontSize:'22px'}}>Find your next Keja in {town}</h1>
          <p style={{margin:'6px 0 0 0', fontSize:'13px', color:'#9ca3af'}}>{loading? 'Loading...': `${filtered.length} Kejas in ${town}, ${county} • Live ☁️`}</p>
          <div style={{background:'white', borderRadius:'14px', padding:'12px', marginTop:'16px', display:'flex', gap:'12px', flexWrap:'wrap', overflow:'visible', position:'relative', zIndex:30}}>
            <SearchInside label="📍 COUNTY" options={countyList} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="🔍 Search Nairobi, Mombasa..."/>
            <SearchInside label="🛒 TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`🔍 Search in ${county}...`}/>
          </div>
        </div>
        <div style={{marginTop:'18px'}}>
          {filtered.map((k:any)=>(
            <div key={k.id} style={{background:'white', borderRadius:'14px', overflow:'hidden', border:'1px solid #e5e7eb', marginBottom:'12px'}}>
              {k.photos?.[0]? <img src={k.photos[0]} alt="" style={{width:'100%', height:'165px', objectFit:'cover'}}/> : null}
              {k.video? <video src={k.video} controls style={{width:'100%', height:'220px', background:'black'}}/> : null}
              <div style={{padding:'12px'}}>
                <h3 style={{fontSize:'14px', fontWeight:800, margin:0}}>{k.title}</h3>
                <div style={{fontSize:'11px', color:'#6b7280'}}>📍 {k.town}, {k.county}</div>
                <div style={{fontSize:'16px', fontWeight:800, marginTop:'8px'}}>KSh {Number(k.rent).toLocaleString()}</div>
                <a href={`/keja/${k.id}`} style={{display:'block', textAlign:'center', marginTop:'10px', background:'#111827', color:'white', padding:'9px', borderRadius:'8px', textDecoration:'none', fontSize:'13px'}}>View Details</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
