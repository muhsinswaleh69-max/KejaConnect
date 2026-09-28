"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabase"
import { countyTowns } from "../lib/counties"

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
        <div style={{position:'absolute', top:'105%', left:0, right:0, background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', boxShadow:'0 12px 28px rgba(0,0,0,0.18)', zIndex:9999, overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:'10px', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'13px', outline:'none'}}/>
          </div>
          <div style={{maxHeight:'220px', overflowY:'auto'}}>
            {filtered.map((o:string)=>(
              <div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'11px 12px', fontSize:'13px', cursor:'pointer', background:o===value?'#dbeafe':'white'}}>
                {o} {o===value?' ✓':''}
              </div>
            ))}
            {filtered.length===0 && <div style={{padding:'12px', textAlign:'center', color:'#9ca3af', fontSize:'13px'}}>No match</div>}
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
    <div style={{minHeight:'100vh', background:'#f3f4f6', fontFamily:'system-ui'}}>
      <header style={{background:'white', padding:'14px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:10}}>
        <div style={{fontWeight:900}}>🔑 Keja<span style={{color:'#2563eb'}}>Connect</span> <span style={{fontSize:'11px', background:'#f3f4f6', padding:'3px 6px', borderRadius:'20px'}}>{countyList.length} counties</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'9px 14px', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'13px'}}>+ List Keja</a>
      </header>
      <main style={{maxWidth:'900px', margin:'0 auto', padding:'16px'}}>
        <div style={{background:'#111827', borderRadius:'18px', padding:'20px', color:'white'}}>
          <h1 style={{margin:0, fontSize:'22px'}}>Find your next Keja in {town}</h1>
          <p style={{margin:'6px 0 0 0', fontSize:'13px', color:'#9ca3af'}}>{loading? 'Loading...': `${filtered.length} Kejas in ${town}, ${county} • Live ☁️`}</p>
          <div style={{background:'white', borderRadius:'14px', padding:'12px', marginTop:'16px', display:'flex', gap:'12px', flexWrap:'wrap'}}>
            <SearchInside label="📍 COUNTY" options={countyList} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="🔍 Type Nairobi, Mombasa..."/>
            <SearchInside label="🛒 TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`🔍 Search in ${county}...`}/>
          </div>
        </div>
        <div style={{marginTop:'18px'}}>
          {loading? <div style={{background:'white', padding:'24px', borderRadius:'12px', textAlign:'center'}}>Loading...</div>
          : filtered.length===0? (
            <div style={{background:'white', padding:'36px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}>
              <div style={{fontSize:'36px'}}>🏜️</div><h3>No Kejas in {town} yet</h3><a href="/list" style={{display:'inline-block', marginTop:'14px', background:'#111827', color:'white', padding:'11px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List House in {town}</a>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'14px'}}>
              {filtered.map((k:any)=>(
                <div key={k.id} style={{background:'white', borderRadius:'14px', overflow:'hidden', border:'1px solid #e5e7eb'}}>
                  {k.photos?.[0]? <img src={k.photos[0]} alt="" style={{width:'100%', height:'165px', objectFit:'cover'}}/> : <div style={{height:'110px', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px'}}>🏠</div>}
                  <div style={{padding:'12px'}}>
                    <h3 style={{fontSize:'14px', fontWeight:800, margin:0}}>{k.title}</h3>
                    <div style={{fontSize:'11px', color:'#6b7280', marginTop:'4px'}}>📍 {k.town}, {k.county}</div>
                    <div style={{fontSize:'16px', fontWeight:800, marginTop:'8px'}}>KSh {Number(k.rent).toLocaleString()}</div>
                    <a href={`/keja/${k.id}`} style={{display:'block', textAlign:'center', marginTop:'10px', background:'#111827', color:'white', padding:'9px', borderRadius:'8px', textDecoration:'none', fontSize:'13px'}}>View</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
