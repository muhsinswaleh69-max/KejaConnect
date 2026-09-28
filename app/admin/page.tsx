"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COUNTIES: any = {
  "All": ["All Towns"],
  "Mombasa": ["All Towns", "Mombasa Town", "Nyali", "Likoni", "Bamburi", "Kisauni", "Changamwe"],
  "Kwale": ["All Towns", "Kwale Town", "Ukunda", "Msambweni", "Kinango", "Lunga Lunga"],
  "Kilifi": ["All Towns", "Kilifi Town", "Malindi", "Watamu", "Mariakani", "Kaloleni"],
  "Tana River": ["All Towns", "Hola", "Garsen", "Bura"],
  "Lamu": ["All Towns", "Lamu Town", "Mpeketoni", "Witu"],
  "Taita Taveta": ["All Towns", "Voi", "Wundanyi", "Taveta", "Mwatate"],
  "Garissa": ["All Towns", "Garissa Town", "Dadaab", "Balambala"],
  "Wajir": ["All Towns", "Wajir Town", "Habaswein", "Tarbaj"],
  "Mandera": ["All Towns", "Mandera Town", "El Wak", "Rhamu"],
  "Marsabit": ["All Towns", "Marsabit Town", "Moyale", "Laisamis"],
  "Isiolo": ["All Towns", "Isiolo Town", "Garbatulla", "Merti"],
  "Meru": ["All Towns", "Meru Town", "Maua", "Nkubu", "Timau", "Mikinduri"],
  "Tharaka Nithi": ["All Towns", "Chuka", "Kathwana", "Marimanti"],
  "Embu": ["All Towns", "Embu Town", "Runyenjes", "Siakago"],
  "Kitui": ["All Towns", "Kitui Town", "Mwingi", "Mutui"],
  "Machakos": ["All Towns", "Machakos Town", "Athi River", "Mavoko", "Kangundo", "Matuu"],
  "Makueni": ["All Towns", "Wote", "Mtito Andei", "Makindu", "Kibwezi"],
  "Nyandarua": ["All Towns", "Ol Kalou", "Engineer", "Njabini"],
  "Nyeri": ["All Towns", "Nyeri Town", "Karatina", "Othaya", "Mukurweini"],
  "Kirinyaga": ["All Towns", "Kerugoya", "Kutus", "Sagana", "Wanguru"],
  "Murang'a": ["All Towns", "Murang'a Town", "Kangema", "Kandara", "Maragua"],
  "Kiambu": ["All Towns", "Kiambu Town", "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru"],
  "Turkana": ["All Towns", "Lodwar", "Kakuma", "Lokichar"],
  "West Pokot": ["All Towns", "Kapenguria", "Chepareria"],
  "Samburu": ["All Towns", "Maralal", "Wamba", "Baragoi"],
  "Trans Nzoia": ["All Towns", "Kitale", "Kiminini", "Endebess"],
  "Uasin Gishu": ["All Towns", "Eldoret", "Burnt Forest", "Turbo"],
  "Elgeyo Marakwet": ["All Towns", "Iten", "Kapsowar"],
  "Nandi": ["All Towns", "Kapsabet", "Nandi Hills", "Kaiboi"],
  "Baringo": ["All Towns", "Kabarnet", "Marigat", "Eldama Ravine"],
  "Laikipia": ["All Towns", "Nanyuki", "Rumuruti", "Nyahururu"],
  "Nakuru": ["All Towns", "Nakuru Town", "Naivasha", "Molo", "Gilgil", "Njoro"],
  "Narok": ["All Towns", "Narok Town", "Kilgoris"],
  "Kajiado": ["All Towns", "Kajiado Town", "Ngong", "Ongata Rongai", "Kitengela", "Kiserian"],
  "Kericho": ["All Towns", "Kericho Town", "Litein", "Kipkelion"],
  "Bomet": ["All Towns", "Bomet Town", "Sotik", "Chepalungu"],
  "Kakamega": ["All Towns", "Kakamega Town", "Mumias Town", "Shianda Market", "Ekero", "Shibale", "Matawa", "Bukura", "Malava", "Butere", "Lugari", "Khayega"],
  "Vihiga": ["All Towns", "Mbale", "Luanda", "Majengo", "Chavakali", "Hamisi"],
  "Bungoma": ["All Towns", "Bungoma Town", "Kimilili", "Webuye", "Sirisia", "Chwele"],
  "Busia": ["All Towns", "Busia Town", "Nambale", "Butula", "Funyula", "Port Victoria"],
  "Siaya": ["All Towns", "Siaya Town", "Bondo", "Ugunja", "Yala"],
  "Kisumu": ["All Towns", "Kisumu Town", "Maseno", "Ahero", "Kombewa", "Muhoroni"],
  "Homa Bay": ["All Towns", "Homa Bay Town", "Oyugis", "Kendubay", "Ndhiwa"],
  "Migori": ["All Towns", "Migori Town", "Rongo", "Kehancha", "Awendo"],
  "Kisii": ["All Towns", "Kisii Town", "Ogembo", "Keroka", "Suneka"],
  "Nyamira": ["All Towns", "Nyamira Town", "Keroka", "Nyansiongo"],
  "Nairobi": ["All Towns", "Nairobi CBD", "Westlands", "Karen", "Eastlands", "Kayole", "Umoja", "Embakasi", "Kibera", "Kawangware", "Donholm", "Buruburu", "South C", "Langata"]
}

export default function Admin(){
  const [kejas, setKejas] = useState<any[]>([])
  const [pass, setPass] = useState("")
  const [authed, setAuthed] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<'all'|'vacant'|'taken'>('all')
  const [countyFilter, setCountyFilter] = useState("All")
  const [townFilter, setTownFilter] = useState("All Towns")
  const [showAdd, setShowAdd] = useState(false)

  // Add form - FULL DETAILS
  const [title, setTitle] = useState("")
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")
  const [rent, setRent] = useState("")
  const [houseType, setHouseType] = useState("1 Bedroom")
  const [bedrooms, setBedrooms] = useState("1")
  const [desc, setDesc] = useState("")
  const [water, setWater] = useState(true)
  const [electricity, setElectricity] = useState(true)
  const [tiles, setTiles] = useState(false)
  const [toilet, setToilet] = useState("Inside")
  // Landlord Given
  const [landlordName, setLandlordName] = useState("")
  const [landlordPhone, setLandlordPhone] = useState("")
  const [landlordId, setLandlordId] = useState("")
  const [caretakerPhone, setCaretakerPhone] = useState("")
  const [mpesaName, setMpesaName] = useState("")
  // Media
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = async()=>{
    const {data}=await supabase.from('kejas').select('*').order('id',{ascending:false})
    setKejas(data||[])
  }
  useEffect(()=>{ if(authed) load() },[authed])

  const filtered = kejas.filter((k:any)=>{
    const txt = `${k.title} ${k.town} ${k.county} ${k.landlord_name||''}`.toLowerCase()
    const matchesSearch = txt.includes(search.toLowerCase())
    const matchesCounty = countyFilter==='All' || k.county===countyFilter || (!k.county && countyFilter==='Kakamega')
    const matchesTown = townFilter==='All Towns' || k.town===townFilter
    const matchesVacant = filter==='all'? true : filter==='vacant'?!k.is_taken : k.is_taken
    return matchesSearch && matchesCounty && matchesTown && matchesVacant
  })

  const addHouse = async(e:any)=>{
    e.preventDefault()
    if(!title ||!rent ||!landlordPhone) return alert('Fill Title, Rent, Landlord Phone')
    setUploading(true)
    try{
      let photoUrls: string[] = []
      let videoUrl = ""
      // Upload photos to Supabase Storage
      if(photos && photos.length>0){
        for(let i=0;i<photos.length;i++){
          const file = photos[i]
          const fileName = `${Date.now()}_${i}_${file.name}`
          const {data, error} = await supabase.storage.from('keja-images').upload(fileName, file)
          if(!error){
            const {data: urlData} = supabase.storage.from('keja-images').getPublicUrl(fileName)
            photoUrls.push(urlData.publicUrl)
          }
        }
      }
      // Upload video
      if(video){
        const fileName = `${Date.now()}_${video.name}`
        const {data, error} = await supabase.storage.from('keja-images').upload(fileName, video)
        if(!error){
          const {data: urlData} = supabase.storage.from('keja-images').getPublicUrl(fileName)
          videoUrl = urlData.publicUrl
        }
      }

      const {error}=await supabase.from('kejas').insert({
        title, county, town, rent: parseInt(rent),
        house_type: houseType, bedrooms: parseInt(bedrooms),
        description: desc, features: {water, electricity, tiles, toilet},
        phone: landlordPhone, landlord_name: landlordName, landlord_id: landlordId,
        caretaker_phone: caretakerPhone, mpesa_name: mpesaName,
        photo_urls: photoUrls, video_url: videoUrl,
        is_taken: false, status: 'VACANT'
      })
      if(error) throw error
      alert(`✅ Added ${title} in ${county} - ${town} - ${photoUrls.length} photos ${videoUrl?' + video':''}`)
      setShowAdd(false)
      setTitle(""); setRent(""); setLandlordName(""); setLandlordPhone(""); setDesc(""); setPhotos(null); setVideo(null)
      load()
    }catch(err:any){ alert(err.message) } finally{ setUploading(false) }
  }

  const makeVacant = async(id:any)=>{
    if(!confirm('Make VACANT again?')) return
    await supabase.from('kejas').update({is_taken:false, status:'VACANT', tenant_name:null, tenant_phone:null}).eq('id',id)
    load()
  }

  if(!authed){
    return <div style={{maxWidth:400, margin:'100px auto', padding:20, fontFamily:'sans-serif'}}><h2>Admin Login</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="keja2024" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd'}}/><button onClick={()=>{if(pass==='keja2024')setAuthed(true);else alert('Wrong')}} style={{width:'100%', marginTop:10, padding:12, background:'#111', color:'white', borderRadius:8}}>Login</button></div>
  }

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      {/* KEEPS YOUR CURRENT DESIGN */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><h1 style={{margin:0, fontSize:22}}>KejaConnect 🏠 Admin</h1><div style={{fontSize:11, color:'#6b7280'}}>Skynet Cyber 0713614441 • Viewing Fee KSh 200 • 47 Counties Covered • Total {kejas.length} Vacant {kejas.filter((k:any)=>!k.is_taken).length} Taken {kejas.filter((k:any)=>k.is_taken).length}</div></div>
        <div style={{display:'flex', gap:8}}><button onClick={()=>setShowAdd(true)} style={{background:'#22c55e', color:'white', padding:'10px 20px', borderRadius:20, border:'none', fontWeight:800, fontSize:14}}>➕ ADD HOUSE</button><a href="/" style={{background:'#111', color:'white', padding:'8px 14px', borderRadius:20, textDecoration:'none', fontSize:12, fontWeight:800, alignSelf:'center'}}>Home</a></div>
      </div>

      <div style={{background:'white', padding:12, borderRadius:16, marginTop:14, border:'1px solid #e5e7eb'}}>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: Shianda, Ekero, Thika, Eldoret..." style={{flex:1, minWidth:180, padding:12, borderRadius:12, border:'1px solid #ddd', fontSize:13}}/>
          <select value={countyFilter} onChange={e=>{setCountyFilter(e.target.value); setTownFilter("All Towns")}} style={{padding:'10px 12px', borderRadius:20, border:'1px solid #111', fontWeight:700, fontSize:12, background:'white', maxWidth:170}}>
            {Object.keys(COUNTIES).map(c=><option key={c} value={c}>{c}{c!=='All'?' County':''}</option>)}
          </select>
          <select value={townFilter} onChange={e=>setTownFilter(e.target.value)} style={{padding:'10px 12px', borderRadius:20, border:'1px solid #ddd', fontWeight:700, fontSize:12, background:'#e0f2fe', maxWidth:170}}>
            {COUNTIES[countyFilter].map((t:string)=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{display:'flex', gap:8, marginTop:10}}>
          <button onClick={()=>setFilter('all')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='all'?'#111':'#f3f4f6', color:filter==='all'?'white':'#111', fontWeight:700, fontSize:12}}>All {kejas.length}</button>
          <button onClick={()=>setFilter('vacant')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='vacant'?'#22c55e':'#f3f4f6', color:filter==='vacant'?'white':'#111', fontWeight:700, fontSize:12}}>✅ Vacant {kejas.filter((k:any)=>!k.is_taken).length}</button>
          <button onClick={()=>setFilter('taken')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='taken'?'#ef4444':'#f3f4f6', color:filter==='taken'?'white':'#111', fontWeight:700, fontSize:12}}>🔒 Taken {kejas.filter((k:any)=>k.is_taken).length}</button>
        </div>
      </div>

      {/* ADD HOUSE MODAL - WITH ALL FEATURES */}
      {showAdd && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50, display:'flex', justifyContent:'center', alignItems:'flex-start', overflow:'auto', padding:16}}>
          <form onSubmit={addHouse} style={{background:'white', width:'100%', maxWidth:650, borderRadius:16, padding:16, marginTop:20}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b style={{fontSize:18}}>➕ Add New House - Full Details</b><button type="button" onClick={()=>setShowAdd(false)} style={{background:'#fee2e2', border:'none', borderRadius:20, padding:'6px 12px'}}>Close ✕</button></div>

            <div style={{marginTop:12, fontWeight:700, fontSize:12, color:'#111'}}>HOUSE DETAILS</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8}}>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title: 1 Bedroom House-Shianda Market" style={{padding:10, borderRadius:8, border:'1px solid #ddd', gridColumn:'1 / span 2'}} required/>
              <select value={houseType} onChange={e=>setHouseType(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}><option>Single Room</option><option>Bedsitter</option><option>1 Bedroom</option><option>2 Bedroom</option><option>3 Bedroom</option><option>Shop</option><option>Hostel</option></select>
              <input value={bedrooms} onChange={e=>setBedrooms(e.target.value)} type="number" placeholder="Bedrooms: 1" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
              <select value={county} onChange={e=>{setCounty(e.target.value); setTown(COUNTIES[e.target.value][1]||COUNTIES[e.target.value][0])}} style={{padding:10, borderRadius:8, border:'1px solid #111', fontWeight:700}}>{Object.keys(COUNTIES).filter(c=>c!=='All').map(c=><option key={c} value={c}>{c} County</option>)}</select>
              <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#e0f2fe', fontWeight:700}}>{COUNTIES[county]?.map((t:string)=><option key={t} value={t}>{t}</option>)}</select>
              <input value={rent} onChange={e=>setRent(e.target.value)} type="number" placeholder="Rent KSh e.g. 7500" style={{padding:10, borderRadius:8, border:'2px solid #111', fontWeight:700}} required/>
              <select value={toilet} onChange={e=>setToilet(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}><option>Inside</option><option>Outside</option><option>Shared</option></select>
            </div>
            <div style={{display:'flex', gap:10, marginTop:10, flexWrap:'wrap'}}><label style={{fontSize:12}}><input type="checkbox" checked={water} onChange={e=>setWater(e.target.checked)}/> Water</label><label style={{fontSize:12}}><input type="checkbox" checked={electricity} onChange={e=>setElectricity(e.target.checked)}/> Electricity</label><label style={{fontSize:12}}><input type="checkbox" checked={tiles} onChange={e=>setTiles(e.target.checked)}/> Tiles</label></div>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Full Description: Near Shianda market, water 24/7, tiles, parking..." style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', marginTop:10, minHeight:70}}/>

            <div style={{marginTop:16, fontWeight:700, fontSize:12, color:'#111', background:'#fef9c3', padding:'6px 10px', borderRadius:8}}>LANDLORD DETAILS (Given)</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8}}>
              <input value={landlordName} onChange={e=>setLandlordName(e.target.value)} placeholder="Landlord Name: Muhsin Swaleh" style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#fef9c3'}} required/>
              <input value={landlordPhone} onChange={e=>setLandlordPhone(e.target.value)} placeholder="Landlord Phone / M-Pesa 07..." style={{padding:10, borderRadius:8, border:'2px solid #111'}} required/>
              <input value={landlordId} onChange={e=>setLandlordId(e.target.value)} placeholder="Landlord ID No (Optional)" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
              <input value={caretakerPhone} onChange={e=>setCaretakerPhone(e.target.value)} placeholder="Caretaker Phone (Optional)" style={{padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
              <input value={mpesaName} onChange={e=>setMpesaName(e.target.value)} placeholder="M-Pesa Name: e.g. JOHN DOE" style={{padding:10, borderRadius:8, border:'1px solid #ddd', gridColumn:'1 / span 2'}}/>
            </div>

            <div style={{marginTop:16, fontWeight:700, fontSize:12, color:'#111', background:'#dcfce7', padding:'6px 10px', borderRadius:8}}>PHOTO & VIDEO UPLOAD</div>
            <div style={{marginTop:8}}>
              <div style={{fontSize:11, color:'#6b7280'}}>Photos (Max 5 - Front, Inside, Toilet, Kitchen)</div>
              <input type="file" multiple accept="image/*" onChange={e=>setPhotos(e.target.files)} style={{marginTop:6, fontSize:12}}/>
              <div style={{fontSize:11, color:'#6b7280', marginTop:10}}>Video (Optional - 30 sec tour)</div>
              <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]||null)} style={{marginTop:6, fontSize:12}}/>
            </div>

            <button type="submit" disabled={uploading} style={{width:'100%', marginTop:16, padding:14, background: uploading?'#9ca3af':'#22c55e', color:'white', borderRadius:12, border:'none', fontWeight:800, fontSize:14}}>{uploading?'⏳ Uploading Photos/Video...':'✅ ADD HOUSE - Make VACANT - '+county+' - '+town}</button>
            <div style={{fontSize:10, textAlign:'center', marginTop:6, color:'#6b7280'}}>Will show as VACANT on homepage • Viewing Fee KSh 200</div>
          </form>
        </div>
      )}

      {/* HOUSES LIST - SAME DESIGN AS YOUR SCREENSHOT */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, marginTop:18}}>
        {filtered.map((k:any)=>(
          <div key={k.id} style={{background:'white', borderRadius:16, border:k.is_taken?'2px solid #fecaca':'2px solid #bbf7d0', overflow:'hidden', position:'relative'}}>
            <div style={{position:'absolute', top:10, left:10, background:k.is_taken?'#ef4444':'#22c55e', color:'white', fontSize:10, padding:'4px 10px', borderRadius:20, fontWeight:800}}>{k.is_taken?'🔒 TAKEN':'✅ VACANT'}</div>
            <div style={{position:'absolute', top:10, right:10, background:'white', fontSize:9, padding:'3px 8px', borderRadius:20, fontWeight:700, border:'1px solid #e5e7eb'}}>{k.county||'Kakamega'} • {k.town}</div>
            <div style={{height:140, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {k.photo_urls && k.photo_urls[0]? <img src={k.photo_urls[0]} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div style={{fontSize:40}}>{k.is_taken?'🔒':'🏠'}</div>}
            </div>
            <div style={{padding:14}}>
              <div style={{fontWeight:800, fontSize:14}}>{k.title}</div>
              <div style={{fontSize:11, color:'#6b7280'}}>📍 {k.county||'Kakamega'} - {k.town} {k.landlord_name?`• ${k.landlord_name}`:''}</div>
              <div style={{fontSize:12, marginTop:4}}>Rent: <b>KSh {k.rent}</b> • Viewing: <b>KSh 200</b> {k.house_type?`• ${k.house_type}`:''}</div>
              {k.is_taken && <div style={{fontSize:10, color:'#6b7280'}}>Tenant: {k.tenant_name}</div>}
              <div style={{marginTop:10, display:'flex', gap:6}}><button onClick={()=>makeVacant(k.id)} style={{flex:1, padding:'8px', background:'white', border:'1px solid #ddd', borderRadius:8, fontSize:11}}>Make Vacant</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
