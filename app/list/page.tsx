"use client"
import { useState, useRef, useEffect } from "react"
const countyTowns: Record<string, string[]> = {"Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu"],"Kwale": ["Kwale","Ukunda","Msambweni"],"Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Mtwapa"],"Tana River": ["Hola","Garsen","Bura"],"Lamu": ["Lamu","Mokowe","Witu"],"Taita Taveta": ["Voi","Wundanyi","Taveta"],"Garissa": ["Garissa","Dadaab"],"Wajir": ["Wajir","Habaswein"],"Mandera": ["Mandera","El Wak"],"Marsabit": ["Marsabit","Moyale"],"Isiolo": ["Isiolo","Garbatulla"],"Meru": ["Meru Town","Maua","Nkubu"],"Tharaka Nithi": ["Chuka","Chogoria"],"Embu": ["Embu","Runyenjes"],"Kitui": ["Kitui","Mwingi","Mutomo"],"Machakos": ["Machakos","Mavoko","Athi River","Kangundo"],"Makueni": ["Wote","Makindu","Kibwezi"],"Nyandarua": ["Ol Kalou","Kinangop"],"Nyeri": ["Nyeri","Karatina","Othaya"],"Kirinyaga": ["Kerugoya","Kutus"],"Murang'a": ["Murang'a","Thika","Kenol","Kangema"],"Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja"],"Turkana": ["Lodwar","Kakuma"],"West Pokot": ["Kapenguria","Makutano"],"Samburu": ["Maralal","Wamba"],"Trans Nzoia": ["Kitale","Kiminini"],"Uasin Gishu": ["Eldoret","Turbo","Moiben","Soy","Burnt Forest"],"Elgeyo Marakwet": ["Iten","Kapsowar"],"Nandi": ["Kapsabet","Nandi Hills"],"Baringo": ["Kabarnet","Eldama Ravine"],"Laikipia": ["Nanyuki","Nyahururu"],"Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo"],"Narok": ["Narok","Kilgoris"],"Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai"],"Kericho": ["Kericho","Litein"],"Bomet": ["Bomet","Sotik"],"Kakamega": ["Mumias","Kakamega Town","Malava","Butere","Lugari","Matete","Khwisero","Lurambi","Shinyalu","Ikolomani","Likuyani","Navakholo","Shibale"],"Vihiga": ["Vihiga","Luanda","Mbale","Emuhaya","Sabatia"],"Bungoma": ["Bungoma Town","Kimilili","Webuye","Sirisia","Bumula","Mt Elgon","Tongaren","Kanduyi","Chwele"],"Busia": ["Busia Town","Malaba","Nambale","Matayos","Teso North","Bunyala","Port Victoria"],"Siaya": ["Siaya","Bondo","Ugunja","Yala"],"Kisumu": ["Kisumu Town","Maseno","Ahero","Kombewa","Muhoroni"],"Homa Bay": ["Homa Bay","Oyugis","Kendubay","Mbita"],"Migori": ["Migori","Rongo","Awendo"],"Kisii": ["Kisii Town","Ogembo","Keroka"],"Nyamira": ["Nyamira","Nyansiongo"],"Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Kasaranai","Embakasi","Langata","Dagoretti","Parklands","Kilimani"]}

function SearchableDropdown({icon, label, options, value, onChange, placeholder}: any){
  const [open, setOpen] = useState(false); const [q, setQ] = useState(""); const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{const h=(e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false)}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h)},[])
  const filtered = options.filter((o:string)=> o.toLowerCase().includes(q.toLowerCase()))
  return (<div ref={ref} style={{position:'relative', marginBottom:'12px'}}><div style={{fontSize:'11px', fontWeight:800, color:'#6b7280', marginBottom:'4px'}}>{icon} {label}</div><div onClick={()=>setOpen(!open)} style={{padding:'12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, display:'flex', justifyContent:'space-between'}}>{value} <span>▼</span></div>{open && <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:30, boxShadow:'0 12px 30px rgba(0,0,0,0.15)'}}><div style={{padding:'8px', background:'#f9fafb'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px'}}/></div><div style={{maxHeight:'210px', overflowY:'auto'}}>{filtered.map((o:string)=><div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'10px 12px', cursor:'pointer', fontSize:'13px', background:o===value?'#eff6ff':'white'}}>{o} {o===value?'✓':''}</div>)}</div></div>}</div>)
}

export default function ListPage(){
  const [county, setCounty]=useState("Kakamega"); const [town, setTown]=useState("Mumias")
  const [form, setForm]=useState({title:"",rent:"",location:"",mpesa:"", lat:"", lng:""})
  const [gpsStatus, setGpsStatus]=useState(""); const [done,setDone]=useState(false)

  const getGPS = () => {
    setGpsStatus("📡 Locating... Please allow location")
    if(!navigator.geolocation){ setGpsStatus("❌ GPS not supported"); return }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setForm(f=>({...f, lat, lng}))
        setGpsStatus(`✅ GPS Locked: ${lat}, ${lng} - Accurate to ${Math.round(pos.coords.accuracy)}m`)
      },
      (err)=>{ setGpsStatus(`❌ ${err.message}. Go to phone settings and allow location for this site.`)}
     ,{enableHighAccuracy:true, timeout:15000}
    )
  }

  const handleCountyChange=(c:string)=>{setCounty(c); setTown(countyTowns[c][0])}
  const handleSubmit=()=>{if(!form.title||!form.rent||!form.mpesa) return alert("Fill title, rent, mpesa"); const existing=JSON.parse(localStorage.getItem("kejas")||"[]"); const newKeja={id:Date.now(), title:form.title, rent:parseInt(form.rent), location:`${form.location}, ${town}, ${county}`, mpesa:form.mpesa, county, town, lat:form.lat, lng:form.lng, yourCut:Math.round(parseInt(form.rent)*0.2), toLandlord:Math.round(parseInt(form.rent)*0.8)}; localStorage.setItem("kejas", JSON.stringify([...existing,newKeja])); setDone(true); setTimeout(()=>window.location.href="/",1500)}
  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ Listed with GPS!</h2><p>📍 {town}, {county} {form.lat?`• ${form.lat}, ${form.lng}`:''}</p><p>Redirecting to {town} wall...</p></div>
  return (<div style={{maxWidth:'550px', margin:'20px auto', background:'white', padding:'24px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
    <h1 style={{fontWeight:800, fontSize:'22px'}}>🏠 List Your Keja + 📍 GPS</h1><p style={{fontSize:'12px', color:'#6b7280', marginBottom:'16px'}}>Pin exact house location for tenants</p>
    <SearchableDropdown icon="📍" label="COUNTY - 47 COUNTIES" options={Object.keys(countyTowns).sort()} value={county} onChange={handleCountyChange} placeholder="Search county... e.g Bungoma, Nairobi"/>
    <SearchableDropdown icon="🏘️" label={`TOWN IN ${county.toUpperCase()}`} options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search town in ${county}...`}/>
    <div style={{marginTop:'8px'}}>
    <label style={{fontSize:'13px', fontWeight:600}}>Keja Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="e.g. 2 Bedroom - Ekero"/>
    <label style={{fontSize:'13px',fontWeight:600}}>Rent KSh</label><input type="number" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="8000"/>
    <label style={{fontSize:'13px',fontWeight:600}}>Exact Stage / Plot</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 12px'}} placeholder="Near Ekero stage, 2nd floor"/>
    <label style={{fontSize:'13px',fontWeight:700}}>📍 GPS Location *Stand at house & click*</label>
    <div style={{display:'flex', gap:'8px', margin:'6px 0 6px'}}>
      <input value={form.lat?`${form.lat}, ${form.lng}`:''} readOnly placeholder="No GPS yet - click Get GPS →" style={{flex:1,padding:'12px',borderRadius:'10px',border: form.lat?'2px solid #16a34a':'1px solid #d1d5db', background: form.lat?'#f0fdf4':'#f9fafb', fontWeight: form.lat?'700':'400'}}/>
      <button type="button" onClick={getGPS} style={{background: form.lat?'#111827':'#16a34a', color:'white', padding:'0 14px', borderRadius:'10px', border:0, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap'}}>{form.lat?'🔄 Re-pin':'📡 Get GPS'}</button>
    </div>
    {gpsStatus && <div style={{fontSize:'11px', marginBottom:'12px', padding:'8px', borderRadius:'6px', background:gpsStatus.includes('✅')?'#dcfce7':'#fef3c7', border:`1px solid ${gpsStatus.includes('✅')?'#86efac':'#fde68a'}`}}>{gpsStatus}</div>}
    {form.lat && <div style={{marginBottom:'12px'}}><a href={`https://www.google.com/maps?q=${form.lat},${form.lng}`} target="_blank" style={{fontSize:'12px', color:'#2563eb', fontWeight:700}}>Preview on Google Maps →</a></div>}
    <label style={{fontSize:'13px',fontWeight:600}}>M-Pesa Payout Number</label><input value={form.mpesa} onChange={e=>setForm({...form,mpesa:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #d1d5db',margin:'6px 0 16px'}} placeholder="0722xxxxxx"/>
    <div style={{background:'#f0fdf4', padding:'10px', borderRadius:'8px', fontSize:'12px', marginBottom:'12px', border:'1px solid #bbf7d0'}}>📍 Will be listed in: <b>{town}, {county}</b> {form.lat && <span>• GPS: {form.lat}, {form.lng} ✅</span>}</div>
    <button onClick={handleSubmit} style={{width:'100%',background:'#111827',color:'white',padding:'14px',borderRadius:'10px',border:0,fontWeight:800, cursor:'pointer'}}>List Keja {form.lat?'with GPS':'without GPS'} in {town} →</button><a href="/" style={{display:'block', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'#6b7280', textDecoration:'none'}}>← Back to Kejas</a></div></div>)
}
