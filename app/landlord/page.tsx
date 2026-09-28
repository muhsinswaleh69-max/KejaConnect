
"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

const COUNTY_TOWNS: Record<string, string[]> = {
  "Mombasa": ["Mombasa Town","Nyali","Kisauni","Likoni","Changamwe","Jomvu","Bamburi"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Diani","Kinango"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mtwapa","Mariakani"],
  "Tana River": ["Hola","Garsen","Bura"],
  "Lamu": ["Lamu","Mpeketoni","Witu"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta","Mwatate"],
  "Garissa": ["Garissa","Dadaab","Ijara"],
  "Wajir": ["Wajir","Habaswein","Buna"],
  "Mandera": ["Mandera","El Wak","Takaba"],
  "Marsabit": ["Marsabit","Moyale","Loiyangalani"],
  "Isiolo": ["Isiolo","Merti","Garbatulla"],
  "Meru": ["Meru","Maua","Nkubu","Timau"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti"],
  "Embu": ["Embu","Runyenjes","Siakago"],
  "Kitui": ["Kitui","Mwingi","Mutomo"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matungulu"],
  "Makueni": ["Wote","Makindu","Mtito Andei","Kibwezi"],
  "Nyandarua": ["Ol Kalou","Engineer","Njabini"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana","Wanguru"],
  "Murang'a": ["Murang'a","Kenol","Kangema","Maragua"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja","Gatundu"],
  "Turkana": ["Lodwar","Kakuma","Lokichar"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria"],
  "Samburu": ["Maralal","Wamba","Baragoi"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Burnt Forest"],
  "Elgeyo Marakwet": ["Iten","Kapsowar"],
  "Nandi": ["Kapsabet","Nandi Hills","Mosoriot"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti"],
  "Nakuru": ["Nakuru","Naivasha","Gilgil","Molo","Njoro","Bahati"],
  "Narok": ["Narok","Kilgoris","Narok Town"],
  "Kajiado": ["Kajiado","Ngong","Kitengela","Kiserian","Ongata Rongai"],
  "Kericho": ["Kericho","Litein","Londiani","Kipkelion"],
  "Bomet": ["Bomet","Sotik","Chepalungu"],
  "Kakamega": ["Kakamega Town","Mumias","Shianda","Matungu","Lurambi","Malava","Butere","Khwisero","Navakholo","Lugari","Likuyani","Shinyalu","Ikolomani"],
  "Vihiga": ["Vihiga","Mbale","Luanda","Chavakali","Sabatia"],
  "Bungoma": ["Bungoma","Kimilili","Webuye","Sirisia","Chwele","Kanduyi"],
  "Busia": ["Busia","Malaba","Nambale","Butula","Funyula","Port Victoria"],
  "Siaya": ["Siaya","Bondo","Ugunja","Yala","Sega"],
  "Kisumu": ["Kisumu","Ahero","Maseno","Muhoroni","Nyando"],
  "Homa Bay": ["Homa Bay","Ndhiwa","Mbita","Oyugis","Kendubay"],
  "Migori": ["Migori","Rongo","Awendo","Isebania","Kehancha"],
  "Kisii": ["Kisii","Ogembo","Suneka","Keroka"],
  "Nyamira": ["Nyamira","Nyansiongo","Keroka","Manga"],
  "Nairobi": ["Westlands","Kasarani","Embakasi","Langata","Kibra","Dagoretti","Starehe","Kamukunji","Makadara","Mathare","Roysambu","Ruaraka","Eastleigh","Umoja","Kayole"]
}
const ALL_COUNTIES = Object.keys(COUNTY_TOWNS).sort()

export default function LandlordPostPage(){
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")
  const [customTown, setCustomTown] = useState("")
  const [title, setTitle] = useState("")
  const [rent, setRent] = useState("")
  const [houseType, setHouseType] = useState("SINGLE ROOM")
  const [bedrooms, setBedrooms] = useState("1")
  const [landlordName, setLandlordName] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [mpesaName, setMpesaName] = useState("")
  const [description, setDescription] = useState("")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File|null>(null)
  const [latitude, setLatitude] = useState<number|null>(null)
  const [longitude, setLongitude] = useState<number|null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)

  const handleCountyChange = (c:string)=>{ setCounty(c); setTown(COUNTY_TOWNS[c]?.[0]||"") }
  const getGPS = ()=>{ setGpsLoading(true); navigator.geolocation.getCurrentPosition(p=>{ setLatitude(p.coords.latitude); setLongitude(p.coords.longitude); setGpsLoading(false)}, e=>{ alert(e.message); setGpsLoading(false)},{enableHighAccuracy:true}) }
  const uploadFiles = async()=>{ let photoUrls:string[]=[]; let videoUrl:string|null=null; for(const f of photoFiles){ const name=`photos/${Date.now()}-${f.name}`; const {error}=await supabase.storage.from('kejas').upload(name,f); if(!error){ const {data}=supabase.storage.from('kejas').getPublicUrl(name); photoUrls.push(data.publicUrl)}} if(videoFile){ const name=`videos/${Date.now()}-${videoFile.name}`; const {error}=await supabase.storage.from('kejas').upload(name,videoFile); if(!error){ const {data}=supabase.storage.from('kejas').getPublicUrl(name); videoUrl=data.publicUrl}} return {photoUrls, videoUrl} }

  const handlePost = async(e:any)=>{
    e.preventDefault()
    if(!title||!rent||!phone||!landlordName) return alert("Fill Title, Rent, Name, Phone")
    setUploading(true)
    const finalTown = customTown.trim()? customTown: town
    const {photoUrls, videoUrl}=await uploadFiles()
    const {error}=await supabase.from('kejas').insert({
      title, county, town:finalTown, rent:parseInt(rent), house_type:houseType, bedrooms,
      landlord_name:landlordName, phone, landlord_id_number:idNumber, mpesa_name:mpesaName||landlordName,
      description, photo_urls:photoUrls, video_url:videoUrl,
      is_taken:false, status:'PENDING APPROVAL', is_approved:false, posted_by_role:'landlord',
      latitude, longitude, maps_url:latitude&&longitude?`https://www.google.com/maps?q=${latitude},${longitude}`:null
    })
    if(error){ alert(error.message); setUploading(false); return }
    setDone(true); setUploading(false)
  }

  if(done){
    return (
      <div style={{maxWidth:500, margin:'0 auto', padding:20, fontFamily:'sans-serif', minHeight:'100vh', textAlign:'center'}}>
        <div style={{fontSize:50}}>✅</div>
        <h2>House Submitted!</h2>
        <div style={{background:'#f0fdf4', padding:14, borderRadius:10, marginTop:10, fontSize:13, border:'1px solid #bbf7d0'}}>
          Your house <b>{title} - {county} - {customTown||town}</b> is pending approval by KejaConnect Admin.<br/>We will verify and approve within 2 hours. You will be notified via WhatsApp {phone}.
        </div>
        <button onClick={()=>{ setDone(false); setTitle(""); setRent("") }} style={{marginTop:16, padding:12, background:'#111', color:'white', borderRadius:10, border:'none', width:'100%', fontWeight:800}}>Post Another House</button>
      </div>
    )
  }

  const currentTowns = COUNTY_TOWNS[county]||[]

  return (
    <div style={{maxWidth:600, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <h1 style={{fontSize:20, fontWeight:900}}>🏠 Landlord - Post Vacant House</h1>
      <div style={{fontSize:12, color:'#6b7280', background:'#fef3c7', padding:10, borderRadius:10, marginTop:8, border:'1px solid #fbbf24'}}>
        You provide house, KejaConnect provides tenants + GPS + M-Pesa. Commission 20% only when house is booked. No upfront fee.
      </div>

      <form onSubmit={handlePost} style={{background:'white', padding:16, borderRadius:12, marginTop:14, border:'1px solid #e5e7eb'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{padding:10, borderRadius:8, border:'2px solid #111', fontWeight:700}}>{ALL_COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}>{currentTowns.map(t=><option key={t} value={t}>{t}</option>)}<option>Other</option></select>
          <input value={customTown} onChange={e=>setCustomTown(e.target.value)} placeholder="If Other, type Town/Market" style={{padding:10, borderRadius:8, border:'1px solid #ddd', gridColumn:'span 2'}}/>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g. SINGLE ROOM-LITEIN" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} required/>
          <input value={rent} onChange={e=>setRent(e.target.value)} placeholder="Rent KSh" type="number" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} required/>
          <select value={houseType} onChange={e=>setHouseType(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}><option>SINGLE ROOM</option><option>BEDSITTER</option><option>1 BEDROOM</option><option>2 BEDROOM</option></select>
          <input value={bedrooms} onChange={e=>setBedrooms(e.target.value)} placeholder="Bedrooms" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={landlordName} onChange={e=>setLandlordName(e.target.value)} placeholder="Your Full Name" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} required/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Your M-Pesa Phone 07..." style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} required/>
          <input value={idNumber} onChange={e=>setIdNumber(e.target.value)} placeholder="ID Number (for payout)" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={mpesaName} onChange={e=>setMpesaName(e.target.value)} placeholder="M-Pesa Name" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
        </div>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description e.g. Near Litein High, water, token..." style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:8, height:70}}/>

        <div style={{background:'#f0f9ff', padding:12, borderRadius:10, border:'1px solid #bae6fd', marginTop:10}}>
          <div style={{fontWeight:800, fontSize:12}}>📍 Pin Exact Location (Important for tenants)</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button type="button" onClick={getGPS} style={{padding:'10px 14px', background:'#0ea5e9', color:'white', borderRadius:8, border:'none', fontWeight:700, fontSize:12}}>{gpsLoading?'📡 Locating...':'📍 GET MY LOCATION'}</button>
            <input value={latitude||''} onChange={e=>setLatitude(parseFloat(e.target.value))} placeholder="Latitude" type="number" step="any" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
            <input value={longitude||''} onChange={e=>setLongitude(parseFloat(e.target.value))} placeholder="Longitude" type="number" step="any" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
          </div>
          {latitude&&longitude&&<div style={{fontSize:11, marginTop:6, color:'#0369a1'}}>✅ {latitude},{longitude} - <a href={`https://www.google.com/maps?q=${latitude},${longitude}`} target="_blank">Preview Map</a></div>}
        </div>

        <div style={{marginTop:10}}><div style={{fontSize:12, fontWeight:700}}>📸 House Photos (max 5)</div><input type="file" multiple accept="image/*" onChange={e=>setPhotoFiles(Array.from(e.target.files||[]).slice(0,5))}/></div>
        <div style={{marginTop:8}}><div style={{fontSize:12, fontWeight:700}}>🎥 Video (optional)</div><input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)}/></div>

        <button disabled={uploading} style={{width:'100%', marginTop:14, padding:14, background:'#111', color:'white', borderRadius:10, fontWeight:900, border:'none'}}>{uploading?'⏳ Uploading... Please wait':'✅ SUBMIT HOUSE - WAIT FOR APPROVAL'}</button>
        <div style={{fontSize:10, color:'#9ca3af', textAlign:'center', marginTop:8}}>By posting, you agree KejaConnect takes 20% commission only when house is booked. You provide platform, we bring tenants.</div>
      </form>
    </div>
  )
}
