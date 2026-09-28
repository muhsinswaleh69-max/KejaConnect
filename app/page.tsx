"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabase"

const countyTowns: Record<string, string[]> = {
  "Kakamega": ["Mumias Town","Mumias Market","Shianda Market","Ekero Market","Shibale Market","Butere Town","Butere Market","Malava Town","Malava Market","Matungu Market","Khwisero Market","Lurambi","Kakamega Town","Lugari","Likuyani Market","Navakholo Market","Shinyalu Market","Ikolomani Market","Matete Market","Bukura Market","Lumakanda Market"],
  "Vihiga": ["Vihiga","Luanda Market","Mbale","Emuhaya","Sabatia","Chavakali Market"],
  "Bungoma": ["Bungoma Town","Kimilili Town","Webuye Town","Sirisia Market","Chwele Market","Misikhu Market"],
  "Busia": ["Busia Town","Malaba Town","Nambale Market","Bumala Market","Port Victoria Market"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Embakasi","Langata","Kawangware Market","Gikomba Market"],
  "Kisumu": ["Kisumu Town","Maseno Market","Ahero Market"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja"],
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Soy"],
  "Siaya": ["Siaya Town","Bondo Market","Ugunja Market"],
  "Kisii": ["Kisii Town","Ogembo Market"],
}

function SearchableDropdown({icon, label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = (options||[]).filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', minWidth:'160px', flex:1}}>
      <div style={{fontSize:'11px', fontWeight:800, color:'#6b7280', marginBottom:'4px'}}>{icon} {label}</div>
      <div onClick={()=>setOpen(!open)} style={{padding:'11px 12px', borderRadius:'10px', border:'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, fontSize:'13px', display:'flex', justifyContent:'space-between'}}>
        {value} <span>▼</span>
      </div>
      {open && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:50, boxShadow:'0 12px 30px rgba(0,0,0,0.15)', overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px'}}/></div>
          <div style={{maxHeight:'220px', overflowY:'auto'}}>{filtered.map((o:string)=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'10px 12px', cursor:'pointer', fontSize:'13px', background:o===value?'#eff6ff':'white'}}>{o} {o===value?'✓':''}</div>)}</div>
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
    const fetchKejas = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('kejas').select('*').order('created_at', {ascending:false})
      if(error){ console.error(error); setKejas([]) }
      else if(data){ setKejas(data) }
      setLoading(false)
    }
    fetchKejas()
  },[])

  const filtered = kejas.filter(k=> k.county===county && k.town===town)

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc'}}>
      <div style={{background:'white', borderBottom:'1px solid #e5e7eb', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div style={{fontWeight:800, fontSize:'18px'}}>🔑 Keja<span style={{color:'#2563eb'}}>Connect</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}> + List Keja</a>
      </div>

      <div style={{maxWidth:'900px', margin:'0 auto', padding:'16px'}}>
        <div style={{background:'linear-gradient(135deg,#111827,#1f2937)', color:'white', borderRadius:'16px', padding:'20px', marginBottom:'16px'}}>
          <h1 style={{fontSize:'22px', fontWeight:800, margin:0}}>Find your next Keja in {town}</h1>
          <p style={{fontSize:'13px', color:'#9ca3af', marginTop:'6px'}}>{loading? 'Loading from cloud...': `${filtered.length} Kejas in ${town}, ${county} • Live from cloud ☁️`}</p>
          <div style={{display:'flex', gap:'12px', marginTop:'18px', flexWrap:'wrap', background:'white', padding:'12px', borderRadius:'14px'}}>
            <SearchableDropdown icon="📍" label="COUNTY" options={Object.keys(countyTowns).sort()} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county..."/>
            <SearchableDropdown icon="🛒" label="TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search in ${county}...`}/>
          </div>
        </div>

        {loading? (
          <div style={{background:'white', padding:'20px', borderRadius:'12px', textAlign:'center', border:'1px solid #e5e7eb'}}>🔄 Loading kejas from cloud...</div>
        ) : filtered.length===0? (
          <div style={{background:'white', padding:'32px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}>
            <div style={{fontSize:'32px'}}>🏜️</div>
            <h3 style={{marginTop:'10px'}}>No Kejas in {town} yet</h3>
            <p style={{fontSize:'13px', color:'#6b7280'}}>Be the first to list here!</p>
            <a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List House in {town}</a>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'14px'}}>
            {filtered.map((k:any)=>(
              <div key={k.id} style={{background:'white', borderRadius:'14px', border:'1px solid #e5e7eb', overflow:'hidden'}}>
                {k.photos && k.photos[0]? <img src={k.photos[0]} alt={k.title} style={{width:'100%', height:'170px', objectFit:'cover'}}/> : <div style={{height:'100px', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px'}}>🏠</div>}
                <div style={{padding:'12px'}}>
                  <div style={{display:'flex', gap:'6px', marginBottom:'6px'}}>
                    <span style={{fontSize:'10px', background:'#eff6ff', color:'#2563eb', padding:'4px 8px', borderRadius:'20px', fontWeight:700}}>Available</span>
                    {k.lat && <span style={{fontSize:'10px', background:'#dcfce7', color:'#16a34a', padding:'4px 8px', borderRadius:'20px', fontWeight:700}}>📍 GPS</span>}
                    {k.photos?.length>0 && <span style={{fontSize:'10px', background:'#f3f4f6', padding:'4px 8px', borderRadius:'20px'}}>📸 {k.photos.length}</span>}
                  </div>
                  <h3 style={{fontSize:'14px', fontWeight:800, margin:'4px 0'}}>{k.title}</h3>
                  <div style={{fontSize:'11px', color:'#6b7280'}}>📍 {k.town}, {k.county} {k.location?`• ${k.location}`:''}</div>
                  <div style={{fontSize:'16px', fontWeight:800, marginTop:'8px'}}>KSh {Number(k.rent).toLocaleString()} / month</div>
                  {k.lat && (
                    <div style={{display:'flex', gap:'8px', marginTop:'10px'}}>
                      <a href={`https://www.google.com/maps?q=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#f3f4f6', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'#111', border:'1px solid #e5e7eb'}}>🗺️ View</a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#2563eb', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'white'}}>📍 Navigate</a>
                    </div>
                  )}
                  <a href={`/keja/${k.id}`} style={{display:'block', textAlign:'center', marginTop:'10px', background:'#111827', color:'white', padding:'9px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}>View Details</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
