"use client"
import { useState, useRef, useEffect } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu"],
  "Kakamega": ["Mumias Town","Mumias Market","Shianda Market","Ekero Market","Shibale Market","Mumias Complex","Butere Town","Butere Market","Malava Town","Malava Market","Matungu Market","Khwisero Market","Lurambi","Kakamega Town","Lugari","Likuyani Market","Navakholo Market","Shinyalu Market","Ikolomani Market","Matete Market","Bukura Market","Lumakanda Market","Khayega Market","Mumias West","Mumias East"],
  "Vihiga": ["Vihiga","Luanda Market","Mbale","Emuhaya","Sabatia","Chavakali Market"],
  "Bungoma": ["Bungoma Town","Kimilili Town","Webuye Town","Sirisia Market","Bumula Market","Chwele Market","Misikhu Market"],
  "Busia": ["Busia Town","Malaba Town","Nambale Market","Matayos Market","Bumala Market"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Embakasi","Langata","Dagoretti","Parklands","Kilimani","Gikomba Market","Kawangware Market","Kibera Market","Umoja Market"],
  "Kisumu": ["Kisumu Town","Maseno Market","Ahero Market","Kombewa Market"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja","Gatundu"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Soy"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu","Tala Market"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian"],
}

function SearchableDropdown({icon, label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false); const [q, setQ] = useState(""); const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false)}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h)},[])
  const filtered = options.filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (<div ref={ref} style={{position:'relative', marginBottom:'12px'}}><div style={{fontSize:'11px', fontWeight:800, color:'#6b7280', marginBottom:'4px'}}>{icon} {label}</div><div onClick={()=>setOpen(!open)} style={{padding:'12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, display:'flex', justifyContent:'space-between'}}>{value} <span>▼</span></div>{open && <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:30, boxShadow:'0 12px 30px rgba(0,0,0,0.15)'}}><div style={{padding:'8px', background:'#f9fafb'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px'}}/></div><div style={{maxHeight:'210px', overflowY:'auto'}}>{filtered.map((o:string)=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'10px 12px', cursor:'pointer', fontSize:'13px', background:o===value?'#eff6ff':'white'}}>{o} {o===value?'✓':''}</div>)}</div></div>}</div>)
}

export default function ListPage(){
  const [county, setCounty]=useState("Kakamega"); const [town, setTown]=useState("Shianda Market")
  const [form, setForm]=useState({title:"",rent:"",location:"",mpesa:"", lat:"", lng:"", desc:""})
  const [gpsStatus, setGpsStatus]=useState(""); const [done,setDone]=useState(false)
  const [photos, setPhotos]=useState<string[]>([])
  const [uploading, setUploading]=useState(false)

  const getGPS = () => {
    setGpsStatus("📡 Locating... Allow location")
    if(!navigator.geolocation){ setGpsStatus("❌ GPS not supported"); return }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        setForm(f=>({...f, lat:pos.coords.latitude.toFixed(6), lng:pos.coords.longitude.toFixed(6)}))
        setGpsStatus(`✅ Locked: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`)
      },
      (err)=> setGpsStatus(`❌ ${err.message}`)
    ,{enableHighAccuracy:true, timeout:15000}
    )
  }

  const handlePhoto = (e:any) => {
    const files = Array.from(e.target.files as FileList).slice(0, 3)
    if(photos.length + files.length > 3){ alert("Max 3 photos"); return }
    setUploading(true)
    const promises = files.map((file:any)=> new Promise<string>((res)=>{
      const reader = new FileReader()
      reader.onload = ()=> res(reader.result as string)
      reader.readAsDataURL(file)
    }))
    Promise.all(promises).then(imgs=>{ setPhotos(p=>[...p,...imgs]); setUploading(false) })
  }

  const handleSubmit = () => {
    // FIX: proper validation
    if(!form.title.trim()){ alert("Enter Keja Title"); return }
    if(!form.rent || isNaN(parseInt(form.rent))){ alert("Enter valid Rent"); return }
    if(!form.mpesa.trim()){ alert("Enter M-Pesa number"); return }
    if(photos.length===0){ if(!confirm("No photo added. Continue without photo?")) return }

    try{
      const existing = JSON.parse(localStorage.getItem("kejas")||"[]")
      if(!Array.isArray(existing)){ localStorage.setItem("kejas","[]") }
      const newKeja = {
        id: Date.now(),
        title: form.title.trim(),
        rent: parseInt(form.rent),
        location: `${form.location || town}, ${town}, ${county}`,
        desc: form.desc,
        mpesa: form.mpesa,
        county, town,
        lat: form.lat || "",
        lng: form.lng || "",
        photos: photos, // base64
        yourCut: Math.round(parseInt(form.rent)*0.2),
        toLandlord: Math.round(parseInt(form.rent)*0.8),
        date: new Date().toISOString()
      }
      const all = [...existing, newKeja]
      localStorage.setItem("kejas", JSON.stringify(all))
      setDone(true)
      setTimeout(()=>{ window.location.href="/" }, 1500)
    }catch(err:any){
      alert("Error saving: "+err.message+" - Clear browser cache and try")
      console.error(err)
    }
  }

  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ House Registered!</h2><p>📍 {town}, {county} {form.lat?`• GPS Pinned`:`• No GPS`} {photos.length>0?`• ${photos.length} photos`:''}</p><p>Redirecting...</p></div>

  return (<div style={{maxWidth:'560px', margin:'20px auto', background:'white', padding:'22px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
    <h1 style={{fontWeight:800, fontSize:'20px'}}>🏠 Register House + 📸 Photos + 📍 GPS</h1>
    <p style={{fontSize:'12px', color:'#6b7280', marginBottom:'14px'}}>Search town includes markets like Shianda Market</p>

    <SearchableDropdown icon="📍" label="COUNTY" options={Object.keys(countyTowns).sort()} value={county} onChange={(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county..."/>
    <SearchableDropdown icon="🛒" label={`TOWN / MARKET IN ${county.toUpperCase()}`} options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search e.g Shianda...`}/>

    <label style={{fontSize:'13px', fontWeight:600}}>Keja Title *</label>
    <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="e.g. 1 Bedroom - Shianda Market"/>

    <label style={{fontSize:'13px',fontWeight:600}}>Rent KSh *</label>
    <input type="number" inputMode="numeric" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="e.g. 5000"/>

    <label style={{fontSize:'13px',fontWeight:600}}>Exact Location / Plot</label>
    <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="Near Shianda Market stage, blue gate"/>

    <label style={{fontSize:'13px',fontWeight:700}}>📸 House Photos (Max 3) - Inside & Outside</label>
    <input type="file" accept="image/*" multiple onChange={handlePhoto} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px dashed #9ca3af',margin:'6px 0 8px', background:'#f9fafb'}}/>
    {uploading && <div style={{fontSize:'12px', color:'#2563eb'}}>Uploading photos...</div>}
    {photos.length>0 && <div style={{display:'flex', gap:'8px', flexWrap:'wrap', margin:'8px 0 12px'}}>
      {photos.map((p,i)=><div key={i} style={{position:'relative'}}><img src={p} style={{width:'90px', height:'70px', objectFit:'cover', borderRadius:'8px', border:'1px solid #e5e7eb'}}/><button type="button" onClick={()=>setPhotos(photos.filter((_,idx)=>idx!==i))} style={{position:'absolute', top:'-6px', right:'-6px', background:'red', color:'white', border:0, borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer'}}>x</button></div>)}
    </div>}

    <label style={{fontSize:'13px',fontWeight:700}}>📍 GPS - Stand at house</label>
    <div style={{display:'flex', gap:'8px', margin:'6px 0 6px'}}>
      <input value={form.lat?`${form.lat}, ${form.lng}`:''} readOnly placeholder="No GPS - click Get GPS" style={{flex:1,padding:'12px',borderRadius:'10px',border: form.lat?'2px solid #16a34a':'1px solid #d1d5db', background: form.lat?'#f0fdf4':'#f9fafb'}}/>
      <button type="button" onClick={getGPS} style={{background: form.lat?'#111827':'#16a34a', color:'white', padding:'0 14px', borderRadius:'10px', border:0, fontWeight:800, cursor:'pointer'}}>{form.lat?'Re-pin':'📡 GPS'}</button>
    </div>
    {gpsStatus && <div style={{fontSize:'11px', marginBottom:'12px', padding:'8px', borderRadius:'6px', background:gpsStatus.includes('✅')?'#dcfce7':'#fef3c7'}}>{gpsStatus}</div>}

    <label style={{fontSize:'13px',fontWeight:600}}>Description (Optional)</label>
    <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px', minHeight:'60px'}} placeholder="Water 24hrs, tokens, near tarmac..."/>

    <label style={{fontSize:'13px',fontWeight:600}}>M-Pesa Number *</label>
    <input value={form.mpesa} onChange={e=>setForm({...form,mpesa:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 16px'}} placeholder="0722xxxxxx"/>

    <div style={{background:'#f0fdf4', padding:'10px', borderRadius:'8px', fontSize:'12px', marginBottom:'12px', border:'1px solid #bbf7d0'}}>📍 Listing in: <b>{town}, {county}</b> {form.lat && `• GPS ✅`} {photos.length>0 && `• ${photos.length} photos ✅`}</div>

    <button type="button" onClick={handleSubmit} style={{width:'100%',background:'#111827',color:'white',padding:'14px',borderRadius:'10px',border:0,fontWeight:800, cursor:'pointer', fontSize:'15px'}}>✅ Register House in {town} →</button>
    <a href="/" style={{display:'block', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'#6b7280', textDecoration:'none'}}>← Back</a>
  </div>)
}
