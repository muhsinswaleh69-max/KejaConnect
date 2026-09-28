"use client"
import { useState, useRef } from "react"
import { supabase } from "../lib/supabase"
import { countyTowns } from "../lib/counties"

function SearchInside({label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useState(()=>{ // close on outside
    const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h as any); return ()=>document.removeEventListener("mousedown", h as any)
  })
  const filtered = options.filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', marginBottom:'14px'}}>
      <div style={{fontSize:'12px', fontWeight:800, marginBottom:'5px'}}>{label} ({options.length})</div>
      <button type="button" onClick={()=>setOpen(!open)} style={{width:'100%', padding:'13px', borderRadius:'10px', border:'1px solid #d1d5db', background:'white', fontWeight:700, textAlign:'left', display:'flex', justifyContent:'space-between'}}>
        {value} <span>▼</span>
      </button>
      {open && (
        <div style={{position:'absolute', top:'105%', left:0, right:0, background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', boxShadow:'0 12px 28px rgba(0,0,0,0.18)', zIndex:9999, overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb'}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:'10px', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'13px'}}/></div>
          <div style={{maxHeight:'240px', overflowY:'auto'}}>
            {filtered.map((o:string)=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'11px', cursor:'pointer', background:o===value?'#dbeafe':'white'}}>{o}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ListPage(){
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")
  const [title, setTitle] = useState("")
  const [rent, setRent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [video, setVideo] = useState<File|null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = (e:any)=>{
    const selected = Array.from(e.target.files) as File[]
    const total = [...files,...selected].slice(0,10) // max 10 photos
    setFiles(total)
  }

  const handleSubmit = async (e:any)=>{
    e.preventDefault()
    if(!title ||!rent) return alert("Add title and rent")
    setUploading(true)
    try{
      let photoUrls:string[] = []
      for(const f of files){
        const name = `${Date.now()}_${f.name}`
        const { error } = await supabase.storage.from('keja-photos').upload(name, f)
        if(error) throw error
        const { data } = supabase.storage.from('keja-photos').getPublicUrl(name)
        photoUrls.push(data.publicUrl)
      }
      let videoUrl = null
      if(video){
        const vname = `${Date.now()}_${video.name}`
        const { error } = await supabase.storage.from('keja-photos').upload(vname, video)
        if(error) throw error
        const { data } = supabase.storage.from('keja-photos').getPublicUrl(vname)
        videoUrl = data.publicUrl
      }
      const { error } = await supabase.from('kejas').insert([{ title, rent: Number(rent), county, town, photos: photoUrls, video: videoUrl }])
      if(error) throw error
      alert("Keja listed!")
      window.location.href="/"
    }catch(err:any){ alert(err.message) }
    setUploading(false)
  }

  const countyList = Object.keys(countyTowns).sort()

  return (
    <div style={{minHeight:'100vh', background:'#f3f4f6', padding:'16px', fontFamily:'system-ui'}}>
      <div style={{maxWidth:'600px', margin:'0 auto', background:'white', padding:'20px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
        <h2 style={{margin:'0 0 16px 0'}}>List Your Keja - {countyList.length} counties</h2>
        <form onSubmit={handleSubmit}>
          <SearchInside label="📍 COUNTY" options={countyList} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="🔍 Search county..."/>
          <SearchInside label="🛒 TOWN / MARKET" options={countyTowns[county]} value={town} onChange={setTown} placeholder={`🔍 Search in ${county}...`}/>

          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g 1 Bedroom in Shianda" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', marginBottom:'12px'}}/>
          <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent KSh" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', marginBottom:'12px'}}/>

          <div style={{marginBottom:'12px'}}>
            <label style={{fontSize:'12px', fontWeight:800}}>📸 PHOTOS (up to 10)</label>
            <input type="file" multiple accept="image/*" onChange={handleFiles} style={{width:'100%', marginTop:'6px'}}/>
            <div style={{fontSize:'11px', color:'#6b7280', marginTop:'4px'}}>{files.length}/10 selected {files.length>=10 && " - MAX REACHED"}</div>
            <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
              {files.map((f,i)=><div key={i} style={{fontSize:'11px', background:'#f3f4f6', padding:'4px 8px', borderRadius:'20px'}}>{f.name.slice(0,12)} <span onClick={()=>setFiles(files.filter((_,idx)=>idx!==i))} style={{cursor:'pointer', color:'red'}}> x</span></div>)}
            </div>
          </div>

          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px', fontWeight:800}}>🎥 VIDEO (optional, 1 video)</label>
            <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]||null)} style={{width:'100%', marginTop:'6px'}}/>
            {video && <div style={{fontSize:'11px', background:'#f3f4f6', padding:'4px 8px', borderRadius:'20px', marginTop:'6px', display:'inline-block'}}>{video.name} <span onClick={()=>setVideo(null)} style={{cursor:'pointer', color:'red'}}> x</span></div>}
          </div>

          <button disabled={uploading} style={{width:'100%', padding:'14px', background:'#111827', color:'white', borderRadius:'10px', fontWeight:800, border:'none', cursor:'pointer'}}>
            {uploading? 'Uploading...': 'List Keja'}
          </button>
        </form>
      </div>
    </div>
  )
}
