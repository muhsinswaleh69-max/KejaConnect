"use client"
import { useEffect, useState } from "react"
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

export default function AdminPage(){
  const [kejas, setKejas] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")
  const [customTown, setCustomTown] = useState("")
  const [rent, setRent] = useState("")
  const [bedrooms, setBedrooms] = useState("1")
  const [houseType, setHouseType] = useState("SINGLE ROOM")
  const [landlordName, setLandlordName] = useState("")
  const [phone, setPhone] = useState("")
  const [caretakerPhone, setCaretakerPhone] = useState("")
  const [mpesaName, setMpesaName] = useState("")
  const [description, setDescription] = useState("")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File|null>(null)
  const [uploading, setUploading] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  useEffect(()=>{ fetchKejas() },[])
  const fetchKejas = async()=>{ const {data}=await supabase.from('kejas').select('*').order('id',{ascending:false}); if(data) setKejas(data) }
  const handleCountyChange = (newCounty:string)=>{ setCounty(newCounty); const towns=COUNTY_TOWNS[newCounty]||[]; if(towns.length>0) setTown(towns[0]); setCustomTown("") }
  const getGPS = ()=>{ setGpsLoading(true); if(!navigator.geolocation){ alert('GPS not supported'); setGpsLoading(false); return } navigator.geolocation.getCurrentPosition((pos)=>{ setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); setGpsLoading(false); alert(`✅ GPS: ${pos.coords.latitude}, ${pos.coords.longitude}`)},(err)=>{ alert('GPS Error: '+err.message); setGpsLoading(false) },{enableHighAccuracy:true}) }
  const uploadFiles = async()=>{ let photoUrls:string[]=[]; let videoUrl:string|null=null; if(photoFiles.length>0){ for(const file of photoFiles){ const name=`photos/${Date.now()}-${file.name}`; const {error}=await supabase.storage.from('kejas').upload(name,file); if(!error){ const {data}=supabase.storage.from('kejas').getPublicUrl(name); photoUrls.push(data.publicUrl)} } } if(videoFile){ const name=`videos/${Date.now()}-${videoFile.name}`; const {error}=await supabase.storage.from('kejas').upload(name,videoFile); if(!error){ const {data}=supabase.storage.from('kejas').getPublicUrl(name); videoUrl=data.publicUrl} } return {photoUrls, videoUrl} }
  const handleAdd = async(e:any)=>{ e.preventDefault(); if(!title||!rent||!phone) return alert('Enter Title, Rent, Phone'); setUploading(true); const finalTown=customTown.trim()?customTown:town; const {photoUrls, videoUrl}=await uploadFiles(); const {error}=await supabase.from('kejas').insert({title,county,town:finalTown,rent:parseInt(rent),bedrooms,house_type:houseType,landlord_name:landlordName,phone,caretaker_phone:caretakerPhone,mpesa_name:mpesaName||landlordName,description,photo_urls:photoUrls,video_url:videoUrl,is_taken:false,status:'VACANT',latitude,longitude,maps_url:latitude&&longitude?`https://www.google.com/maps?q=${latitude},${longitude}`:null,google_maps_link:latitude&&longitude?`https://www.google.com/maps?q=${latitude},${longitude}`:null}); if(error){ alert(error.message); setUploading(false); return } alert(`✅ Uploaded: ${county} - ${finalTown}`); setTitle(""); setRent(""); setPhotoFiles([]); setVideoFile(null); setLatitude(null); setLongitude(null); setCustomTown(""); fetchKejas(); setUploading(false) }
  const toggleTaken = async(k:any)=>{ await supabase.from('kejas').update({is_taken:!k.is_taken,status:!k.is_taken?'TAKEN':'VACANT'}).eq('id',k.id); fetchKejas() }
  const deleteKeja = async(id:number)=>{ if(!confirm('Delete?')) return; await supabase.from('kejas').delete().eq('id',id); fetchKejas() }
  const currentTowns = COUNTY_TOWNS[county]||[]

  return (
    <div style={{maxWidth:1000, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <h1 style={{fontSize:20, fontWeight:800}}>Skynet Admin - 47 Counties + Commission</h1>
      <div style={{display:'flex', gap:10, marginTop:10, flexWrap:'wrap'}}>
        <div style={{background:'white', padding:10, borderRadius:10, border:'1px solid #ddd'}}>Total: {kejas.length}</div>
        <div style={{background:'#dcfce7', padding:10, borderRadius:10}}>Vacant: {kejas.filter(k=>!k.is_taken).length}</div>
        <div style={{background:'#fee2e2', padding:10, borderRadius:10}}>Taken: {kejas.filter(k=>k.is_taken).length}</div>
      </div>
      <form onSubmit={handleAdd} style={{background:'white', padding:16, borderRadius:12, marginTop:16, border:'1px solid #e5e7eb'}}>
        <div style={{fontWeight:800, marginBottom:10}}>Add New House</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g. SINGLE ROOM-LITEIN" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={rent} onChange={e=>setRent(e.target.value)} placeholder="Rent KSh e.g. 2000" type="number" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{padding:10, borderRadius:8, border:'2px solid #111', fontWeight:700}}>{ALL_COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd', fontWeight:600}}>{currentTowns.map(t=><option key={t} value={t}>{t}</option>)}<option value="Other">Other - Type Below</option></select>
          {(town==="Other"||customTown) && <input value={customTown} onChange={e=>setCustomTown(e.target.value)} placeholder="Custom Town/Market e.g. Shianda Market" style={{padding:10, borderRadius:8, border:'2px solid #0ea5e9', gridColumn:'span 2'}}/>}
          <select value={houseType} onChange={e=>setHouseType(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}><option>SINGLE ROOM</option><option>BEDSITTER</option><option>1 BEDROOM</option><option>2 BEDROOM</option><option>3 BEDROOM</option></select>
          <input value={bedrooms} onChange={e=>setBedrooms(e.target.value)} placeholder="Bedrooms" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={landlordName} onChange={e=>setLandlordName(e.target.value)} placeholder="Landlord Name" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Landlord Phone 07..." style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={caretakerPhone} onChange={e=>setCaretakerPhone(e.target.value)} placeholder="Caretaker Phone" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
          <input value={mpesaName} onChange={e=>setMpesaName(e.target.value)} placeholder="M-Pesa Name" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
        </div>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:8, height:60}}/>
        <div style={{background:'#f0f9ff', padding:12, borderRadius:10, border:'1px solid #bae6fd', marginTop:10}}>
          <div style={{fontWeight:800, fontSize:12}}>📍 HOUSE GPS</div>
          <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
            <button type="button" onClick={getGPS} disabled={gpsLoading} style={{padding:'10px 14px', background:'#0ea5e9', color:'white', borderRadius:8, border:'none', fontWeight:700, fontSize:12}}>{gpsLoading?'📡...':'📍 GET GPS'}</button>
            <input value={latitude||''} onChange={e=>setLatitude(parseFloat(e.target.value))} placeholder="Latitude" type="number" step="any" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
            <input value={longitude||''} onChange={e=>setLongitude(parseFloat(e.target.value))} placeholder="Longitude" type="number" step="any" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd', fontSize:12}}/>
          </div>
          {latitude&&longitude&&<div style={{marginTop:8, fontSize:11}}>✅ {latitude},{longitude} - <a href={`https://www.google.com/maps?q=${latitude},${longitude}`} target="_blank">View Map</a></div>}
        </div>
        <div style={{marginTop:10}}><div style={{fontSize:12, fontWeight:700}}>📸 Photos</div><input type="file" multiple accept="image/*" onChange={e=>setPhotoFiles(Array.from(e.target.files||[]))} style={{marginTop:4}}/></div>
        <div style={{marginTop:8}}><div style={{fontSize:12, fontWeight:700}}>🎥 Video</div><input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)} style={{marginTop:4}}/></div>
        <button type="submit" disabled={uploading} style={{width:'100%', marginTop:12, padding:12, background:'#111', color:'white', borderRadius:10, fontWeight:800, border:'none'}}>{uploading?'⏳ Uploading...':`✅ UPLOAD - ${county} - ${customTown||town}`}</button>
      </form>
      <div style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:10}}>
        {kejas.map(k=><div key={k.id} style={{background:'white', borderRadius:10, padding:10, border:k.is_taken?'2px solid #fecaca':'2px solid #bbf7d0'}}><div style={{display:'flex', justifyContent:'space-between'}}><b style={{fontSize:13}}>{k.title}</b><span style={{fontSize:10, background:k.is_taken?'#ef4444':'#22c55e', color:'white', padding:'2px 6px', borderRadius:10}}>{k.is_taken?'TAKEN':'VACANT'}</span></div><div style={{fontSize:11, color:'#6b7280'}}>{k.county} - {k.town} - KSh {k.rent} {k.latitude?'📍':''}</div><div style={{display:'flex', gap:6, marginTop:8}}><button onClick={()=>toggleTaken(k)} style={{flex:1, padding:6, fontSize:11, borderRadius:6, border:'1px solid #ddd', background:k.is_taken?'#dcfce7':'#fee2e2'}}>{k.is_taken?'Make VACANT':'Make TAKEN'}</button><button onClick={()=>deleteKeja(k.id)} style={{padding:6, fontSize:11, borderRadius:6, border:'1px solid #fecaca', background:'white'}}>Delete</button></div></div>)}
      </div>
    </div>
  )
}
