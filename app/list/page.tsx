"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabase"
import { countyTowns } from "../lib/counties"

function SearchBox({label, options, value, onChange, placeholder}:{label:string, options:string[], value:string, onChange:(v:string)=>void, placeholder:string}){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(typeof document === 'undefined') return
    const h=(e:MouseEvent)=>{ if(ref.current &&!ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter(o=>o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', marginBottom:14}}>
      <div style={{fontSize:12, fontWeight:800, marginBottom:5}}>{label} ({options.length})</div>
      <button type="button" onClick={()=>setOpen(!open)} style={{width:'100%', padding:13, borderRadius:10, border:'1px solid #d1d5db', background:'white', fontWeight:700, textAlign:'left', display:'flex', justifyContent:'space-between'}}>
        <span>{value}</span><span>▼</span>
      </button>
      {open && (
        <div style={{position:'absolute', top:'105%', left:0, right:0, background:'white', borderRadius:12, border:'1px solid #e5e7eb', boxShadow:'0 12px 28px rgba(0,0,0,0.18)', zIndex:9999, overflow:'hidden'}}>
          <div style={{padding:8, background:'#f9fafb'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:10, border:'1px solid #d1d5db', borderRadius:8}}/>
          </div>
          <div style={{maxHeight:240, overflowY:'auto'}}>
            {filtered.map(o=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:11, cursor:'pointer', background:o===value?'#dbeafe':'white'}}>{o}</div>)}
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

  const handleFiles = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const sel = Array.from(e.target.files||[]) as File[]
    setFiles([...files,...sel].slice(0,10))
  }

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!title ||!rent) return alert("Add title and rent")
    setUploading(true)
    try{
      const photoUrls:string[]=[]
      for(const f of files){
        const name=`${Date.now()}_${f.name}`
        const {error}=await supabase.storage.from('keja-photos').upload(name,f)
        if(error) throw error
        const {data}=supabase.storage.from('keja-photos').getPublicUrl(name)
        photoUrls.push(data.publicUrl)
      }
      let videoUrl:string|null=null
      if(video){
        const vname=`${Date.now()}_${video.name}`
        const {error}=await supabase.storage.from('keja-photos').upload(vname,video)
        if(error) throw error
        const {data}=supabase.storage.from('keja-photos').getPublicUrl(vname)
        videoUrl=data.publicUrl
      }
      const {error}=await supabase.from('kejas').insert([{title, rent:Number(rent), county, town, photos:photoUrls, video:videoUrl}])
      if(error) throw error
      alert("Keja listed!")
      window.location.href="/"
    }catch(err:any){ alert(err.message) }
    setUploading(false)
  }

  const countyList = Object.keys(countyTowns).sort()

  return (
    <div style={{minHeight:'100vh', background:'#f3f4f6', padding:16}}>
      <div style={{maxWidth:600, margin:'0 auto', background:'white', padding:20, borderRadius:16, border:'1px solid #e5e7eb'}}>
        <h2 style={{margin:'0 0 16px 0'}}>List Your Keja - {countyList.length} counties</h2>
        <form onSubmit={handleSubmit}>
          <SearchBox label="📍 COUNTY" options={countyList} value={county} onChange={(c)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="🔍 Search county..."/>
          <SearchBox label="🛒 TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`🔍 Search in ${county}...`}/>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g 1 Bedroom in Shianda" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #d1d5db', marginBottom:12}}/>
          <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent KSh" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #d1d5db', marginBottom:12}}/>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12, fontWeight:800}}>📸 PHOTOS (up to 10)</label>
            <input type="file" multiple accept="image/*" onChange={handleFiles} style={{width:'100%', marginTop:6}}/>
            <div style={{fontSize:11, color:'#6b7280', marginTop:4}}>{files.length}/10 photos</div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12, fontWeight:800}}>🎥 VIDEO (optional - 1 video)</label>
            <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]||null)} style={{width:'100%', marginTop:6}}/>
            {video && <div style={{fontSize:11, background:'#f3f4f6', padding:'4px 8px', borderRadius:20, marginTop:6, display:'inline-block'}}>{video.name} <span onClick={()=>setVideo(null)} style={{cursor:'pointer', color:'red'}}> x</span></div>}
          </div>
          <button disabled={uploading} style={{width:'100%', padding:14, background:'#111827', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{uploading? 'Uploading...': 'List Keja'}</button>
        </form>
      </div>
    </div>
  )
}
