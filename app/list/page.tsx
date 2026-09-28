"use client"
import { useState, useRef, useEffect } from "react"

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
}

function SearchableDropdown({icon, label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false); const [q, setQ] = useState(""); const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false)}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h)},[])
  const filtered = (options||[]).filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (<div ref={ref} style={{position:'relative', marginBottom:'12px'}}><div style={{fontSize:'11px', fontWeight:800, color:'#6b7280', marginBottom:'4px'}}>{icon} {label}</div><div onClick={()=>setOpen(!open)} style={{padding:'12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, display:'flex', justifyContent:'space-between'}}>{value} <span>▼</span></div>{open && <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:30, boxShadow:'0 12px 30px rgba(0,0,0,0.15)'}}><div style={{padding:'8px', background:'#f9fafb'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px'}}/></div><div style={{maxHeight:'210px', overflowY:'auto'}}>{filtered.map((o:string)=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'10px 12px', cursor:'pointer', fontSize:'13px', background:o===value?'#eff6ff':'white'}}>{o} {o===value?'✓':''}</div>)}</div></div>}</div>)
}

export default function ListPage(){
  const [county, setCounty]=useState("Kakamega"); const [town, setTown]=useState("Shianda Market")
  const [form, setForm]=useState({title:"",rent:"",location:"",mpesa:"", lat:"", lng:""})
  const [gpsStatus, setGpsStatus]=useState(""); const [done,setDone]=useState(false)
  const [photos, setPhotos]=useState<string[]>([])

  const getGPS = () => {
    setGpsStatus("📡 Locating...")
    if(!navigator.geolocation){ setGpsStatus("❌ No GPS"); return }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{ setForm(f=>({...f, lat:pos.coords.latitude.toFixed(6), lng:pos.coords.longitude.toFixed(6)})); setGpsStatus(`✅ GPS OK: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`) },
      (err)=> setGpsStatus(`❌ ${err.message}`),
      {enableHighAccuracy:true}
    )
  }

  const handlePhoto = (e:any) => {
    const files = Array.from(e.target.files as FileList).slice(0,3)
    if(photos.length + files.length > 3){ alert("Max 3 photos"); return }
    const readers = files.map((file:any)=> new Promise<string>(res=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(file) }))
    Promise.all(readers).then(imgs=> setPhotos(p=>[...p,...imgs]))
  }

  const handleSubmit = () => {
    if(!form.title.trim()){ alert("Enter Title"); return }
    if(!form.rent){ alert("Enter Rent"); return }
    if(!form.mpesa.trim()){ alert("Enter M-Pesa"); return }
    try{
      const existingRaw = localStorage.getItem("kejas")
      let existing:any[] = []
      if(existingRaw){ try{ existing = JSON.parse(existingRaw); if(!Array.isArray(existing)) existing=[] }catch{ existing=[] } }
      const newKeja = {
        id: Date.now(),
        title: form.title.trim(),
        rent: parseInt(form.rent),
        location: form.location || town,
        county, town,
        mpesa: form.mpesa.trim(),
        lat: form.lat, lng: form.lng,
        photos: photos,
      }
      localStorage.setItem("kejas", JSON.stringify([...existing, newKeja]))
      setDone(true)
      setTimeout(()=> window.location.href="/", 1200)
    }catch(err:any){ alert("Save failed: "+err.message) }
  }

  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ House Registered in {town}!</h2><p>Redirecting to {town} wall...</p></div>

  return (<div style={{maxWidth:'560px', margin:'20px auto', background:'white', padding:'22px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
    <h1 style={{fontWeight:800, fontSize:'20px'}}>🏠 Register House</h1>
    <p style={{fontSize:'12px', color:'#6b7280', marginBottom:'14px'}}>Markets like Shianda Market included</p>
    <SearchableDropdown icon="📍" label="COUNTY" options={Object.keys(countyTowns).sort()} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county..."/>
    <SearchableDropdown icon="🛒" label={`TOWN / MARKET`} options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder="Search e.g Shianda..."/>
    <label style={{fontSize:'13px', fontWeight:600}}>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="1BR - Shianda Market"/>
    <label style={{fontSize:'13px', fontWeight:600}}>Rent *</label><input type="number" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="4000"/>
    <label style={{fontSize:'13px', fontWeight:600}}>Exact Place</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="Near stage, blue gate"/>
    <label style={{fontSize:'13px', fontWeight:700}}>📸 Photos (max 3)</label><input type="file" accept="image/*" multiple onChange={handlePhoto} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px dashed #9ca3af',margin:'6px 0 8px', background:'#f9fafb'}}/>
    {photos.length>0 && <div style={{display:'flex', gap:'8px', margin:'8px 0 12px'}}>{photos.map((p,i)=><div key={i} style={{position:'relative'}}><img src={p} style={{width:'80px', height:'60px', objectFit:'cover', borderRadius:'8px', border:'1px solid #e5e7eb'}}/><button onClick={()=>setPhotos(photos.filter((_,idx)=>idx!==i))} style={{position:'absolute', top:'-6px', right:'-6px', background:'red', color:'white', border:0, borderRadius:'50%', width:'20px', height:'20px'}}>x</button></div>)}</div>}
    <label style={{fontSize:'13px', fontWeight:700}}>📍 GPS</label><div style={{display:'flex', gap:'8px', margin:'6px 0'}}><input value={form.lat?`${form.lat}, ${form.lng}`:''} readOnly placeholder="Click Get GPS" style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db', background:'#f9fafb'}}/><button type="button" onClick={getGPS} style={{background:'#16a34a', color:'white', padding:'0 14px', borderRadius:'10px', border:0, fontWeight:800}}>📡 GPS</button></div>{gpsStatus && <div style={{fontSize:'11px', marginBottom:'12px', padding:'6px', background:gpsStatus.includes('✅')?'#dcfce7':'#fef3c7', borderRadius:'6px'}}>{gpsStatus}</div>}
    <label style={{fontSize:'13px', fontWeight:600}}>M-Pesa *</label><input value={form.mpesa} onChange={e=>setForm({...form,mpesa:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 16px'}} placeholder="0722..."/>
    <button type="button" onClick={handleSubmit} style={{width:'100%',background:'#111827',color:'white',padding:'14px',borderRadius:'10px',border:0,fontWeight:800, cursor:'pointer'}}>✅ Register House in {town} →</button>
    <a href="/" style={{display:'block', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'#6b7280', textDecoration:'none'}}>← Back</a>
  </div>)
}
