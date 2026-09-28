"use client"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabase"
import { countyTowns } from "../lib/counties"

function SearchBox({label, options, value, onChange, placeholder}:{label:string, options:string[], value:string, onChange:(v:string)=>void, placeholder:string}){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(typeof document==='undefined') return
    const h=(e:MouseEvent)=>{ if(ref.current &&!ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter(o=>o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', marginBottom:12}}>
      <div style={{fontSize:11, fontWeight:800, color:'#111827', marginBottom:5}}>{label} ({options.length})</div>
      <button type="button" onClick={()=>setOpen(!open)} style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #d1d5db', background:'white', color:'#111827', fontWeight:700, textAlign:'left', display:'flex', justifyContent:'space-between'}}>
        <span>{value}</span><span>▼</span>
      </button>
      {open && (
        <div style={{position:'absolute', top:'105%', left:0, right:0, background:'white', borderRadius:12, border:'1px solid #e5e7eb', boxShadow:'0 12px 28px rgba(0,0,0,0.2)', zIndex:9999, overflow:'hidden'}}>
          <div style={{padding:8, background:'#f9fafb'}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} autoFocus style={{width:'100%', padding:9, border:'1px solid #d1d5db', borderRadius:8, color:'#111827'}}/></div>
          <div style={{maxHeight:220, overflowY:'auto'}}>{filtered.map(o=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:11, cursor:'pointer', background:o===value?'#dbeafe':'white', color:'#111827', fontSize:14}}>{o}</div>)}</div>
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
  const [landlord, setLandlord] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [video, setVideo] = useState<File|null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!title ||!rent ||!phone) return alert("Add title, rent and phone")
    setUploading(true)
    try{
      const photoUrls:string[]=[]
      for(const f of files){
        const name=`${Date.now()}_${f.name.replace(/\s/g,'_')}`
        const {error}=await supabase.storage.from('keja-photos').upload(name,f)
        if(error) throw error
        const {data}=supabase.storage.from('keja-photos').getPublicUrl(name)
        photoUrls.push(data.publicUrl)
      }
      let videoUrl:string|null=null
      if(video){
        const vname=`${Date.now()}_${video.name.replace(/\s/g,'_')}`
        const {error}=await supabase.storage.from('keja-photos').upload(vname,video)
        if(error) throw error
        const {data}=supabase.storage.from('keja-photos').getPublicUrl(vname)
        videoUrl=data.publicUrl
      }
      const {error}=await supabase.from('kejas').insert([{title, rent:Number(rent), county, town, photos:photoUrls, video:videoUrl, landlord_name:landlord, phone, whatsapp:whatsapp||phone}])
      if(error) throw error
      alert("Keja listed! It will now show on all devices A-B-C-D")
      window.location.href="/"
    }catch(err:any){ alert("Error: "+err.message+"\n\nDid you run the SQL to create bucket keja-photos?") }
    setUploading(false)
  }

  const countyList = Object.keys(countyTowns).sort()

  return (
    <div style={{minHeight:'100vh', background:'#f3f4f6', padding:14}}>
      <div style={{maxWidth:600, margin:'0 auto', background:'white', padding:18, borderRadius:16, border:'1px solid #e5e7eb'}}>
        <h2 style={{margin:'0 0 14px 0', color:'#111827'}}>List Your Keja</h2>
        <form onSubmit={handleSubmit}>
          <SearchBox label="📍 COUNTY" options={countyList} value={county} onChange={(c)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county..."/>
          <SearchBox label="🛒 TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search in ${county}...`}/>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g 1 Bedroom Shianda Market" style={{width:'100%', padding:11, borderRadius:10, border:'1px solid #d1d5db', marginBottom:10, color:'#111827'}}/>
          <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent KSh e.g 5500" style={{width:'100%', padding:11, borderRadius:10, border:'1px solid #d1d5db', marginBottom:10, color:'#111827'}}/>

          <div style={{background:'#f9fafb', padding:12, borderRadius:12, marginBottom:12, border:'1px solid #e5e7eb'}}>
            <div style={{fontSize:12, fontWeight:800, marginBottom:8, color:'#111827'}}>👤 LANDLORD CONTACT (will show to renters)</div>
            <input value={landlord} onChange={e=>setLandlord(e.target.value)} placeholder="Landlord Name (optional)" style={{width:'100%', padding:11, borderRadius:10, border:'1px solid #d1d5db', marginBottom:8, color:'#111827'}}/>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone e.g 0712345678 *" required style={{width:'100%', padding:11, borderRadius:10, border:'1px solid #d1d5db', marginBottom:8, color:'#111827'}}/>
            <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp e.g 0712345678 (same as phone if blank)" style={{width:'100%', padding:11, borderRadius:10, border:'1px solid #d1d5db', color:'#111827'}}/>
          </div>

          <div style={{marginBottom:10}}><label style={{fontSize:11, fontWeight:800, color:'#111827'}}>📸 PHOTOS (up to 10)</label><input type="file" multiple accept="image/*" onChange={e=>setFiles([...files,...Array.from(e.target.files||[])].slice(0,10))} style={{width:'100%', marginTop:6}}/><div style={{fontSize:11, color:'#6b7280'}}>{files.length}/10</div></div>
          <div style={{marginBottom:14}}><label style={{fontSize:11, fontWeight:800, color:'#111827'}}>🎥 VIDEO (1 optional)</label><input type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]||null)} style={{width:'100%', marginTop:6}}/></div>
          <button disabled={uploading} style={{width:'100%', padding:13, background:'#111827', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{uploading? 'Uploading...':'List Keja + Contact'}</button>
        </form>
      </div>
    </div>
  )
}
