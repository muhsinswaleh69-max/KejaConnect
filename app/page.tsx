"use client"
import { useEffect, useState, useRef } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu","Bamburi"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Kinango","Diani"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Mtwapa"],
  "Tana River": ["Hola","Garsen","Bura"],
  "Lamu": ["Lamu","Mokowe","Witu","Mpeketoni"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta","Mwatate"],
  "Garissa": ["Garissa","Dadaab","Balambala"],
  "Wajir": ["Wajir","Habaswein","Tarbaj"],
  "Mandera": ["Mandera","El Wak","Rhamu"],
  "Marsabit": ["Marsabit","Moyale","Laisamis"],
  "Isiolo": ["Isiolo","Garbatulla","Merti"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau","Githongo Market"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti"],
  "Embu": ["Embu","Runyenjes","Siakago","Kiritiri Market"],
  "Kitui": ["Kitui","Mwingi","Mutomo","Zombe Market"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu","Tala Market","Masii Market"],
  "Makueni": ["Wote","Makindu","Kibwezi","Kikima Market"],
  "Nyandarua": ["Ol Kalou","Kinangop","Nyahururu","Engineer Market"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini","Mweiga Market"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana","Kagio Market"],
  "Murang'a": ["Murang'a","Thika","Kenol","Kangema","Kangari Market"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja","Gatundu","Githunguri Market"],
  "Turkana": ["Lodwar","Kakuma","Lokichar"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria"],
  "Samburu": ["Maralal","Wamba","Baragoi"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess","Kachibora Market"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Kesses","Soy","Burnt Forest","Moi's Bridge Market"],
  "Elgeyo Marakwet": ["Iten","Kapsowar","Chepkorio"],
  "Nandi": ["Kapsabet","Nandi Hills","Chepterwai","Kobujoi"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat","Mogotio Market"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti","Doldol Market"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro","Bahati","Mau Narok Market"],
  "Narok": ["Narok","Kilgoris","Ololulunga"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian","Loitoktok","Namanga Market"],
  "Kericho": ["Kericho","Litein","Londiani"],
  "Bomet": ["Bomet","Sotik","Chepalungu","Longisa Market"],
  "Kakamega": [
    "Mumias Town","Mumias Market","Shianda Market","Ekero Market","Shibale Market","Mumias Complex",
    "Butere Town","Butere Market","Malava Town","Malava Market","Matungu Market","Khwisero Market",
    "Lurambi","Kakamega Town","Kakamega Market","Lugari","Likuyani Market","Navakholo Market",
    "Shinyalu Market","Ikolomani Market","Matete Market","Bukura Market","Lumakanda Market",
    "Khayega Market","Mumias West","Mumias East","Eshirulo Market","Lubao Market"
  ],
  "Vihiga": ["Vihiga","Luanda Market","Mbale","Emuhaya","Sabatia","Chavakali Market","Majengo Market","Serem Market"],
  "Bungoma": ["Bungoma Town","Bungoma Market","Kimilili Town","Kimilili Market","Webuye Town","Webuye Market","Sirisia Market","Bumula Market","Mt Elgon Market","Chwele Market","Misikhu Market","Naitiri Market"],
  "Busia": ["Busia Town","Busia Market","Malaba Town","Malaba Market","Nambale Market","Matayos Market","Bumala Market","Amukura Market","Port Victoria Market"],
  "Siaya": ["Siaya","Bondo","Ugunja Market","Yala Market","Ukwala Market","Usenge Market"],
  "Kisumu": ["Kisumu Town","Maseno Market","Ahero Market","Kombewa Market","Muhoroni Market","Sondu Market"],
  "Homa Bay": ["Homa Bay","Oyugis Market","Kendubay Market","Mbita Market","Ndhiwa Market","Sindo Market"],
  "Migori": ["Migori","Rongo Market","Awendo Market","Kehancha Market","Isebania Market"],
  "Kisii": ["Kisii Town","Kisii Market","Ogembo Market","Keroka Market","Suneka Market","Masimba Market"],
  "Nyamira": ["Nyamira","Nyansiongo Market","Ekerubo Market","Manga Market"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Kasaranai","Embakasi","Langata","Dagoretti","Parklands","Kilimani","Lavington","South B","South C","Gikomba Market","Kawangware Market","Kibera Market","Umoja Market","Kangemi Market"],
}

function SearchableDropdown({icon, label, options, value, onChange, placeholder}: {icon:string, label:string, options:string[], value:string, onChange:(v:string)=>void, placeholder:string}){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const h = (e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false)}
    document.addEventListener("mousedown", h); return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter(o=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', minWidth:'180px', flex:1}}>
      <div style={{fontSize:'11px', fontWeight:800, color:'#6b7280', marginBottom:'4px'}}>{icon} {label} ({options.length})</div>
      <div onClick={()=>setOpen(!open)} style={{padding:'11px 12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, fontSize:'13px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {value} <span style={{fontSize:'11px', color:'#9ca3af'}}>▼</span>
      </div>
      {open && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:30, boxShadow:'0 12px 30px rgba(0,0,0,0.15)', overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb', borderBottom:'1px solid #f3f4f6'}}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px', outline:'none'}}/>
          </div>
          <div style={{maxHeight:'260px', overflowY:'auto'}}>
            {filtered.length===0? <div style={{padding:'12px', fontSize:'13px', color:'#9ca3af'}}>No results for "{q}"</div> :
              filtered.map(o=>(
                <div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'10px 12px', cursor:'pointer', fontSize:'13px', fontWeight:o===value?700:500, background:o===value?'#eff6ff':'white', borderBottom:'1px solid #f9fafb', display:'flex', justifyContent:'space-between'}}>
                  <span>{o.includes('Market')?'🛒 ':''}{o}</span>{o===value && <span style={{color:'#2563eb'}}>✓</span>}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

const defaultKejas = [
  {id:1, title:"2 Bedroom - Ekero Market", rent:8000, location:"Ekero Market, Mumias", county:"Kakamega", town:"Ekero Market", mpesa:"0722", lat:"0.334580", lng:"34.485550", photos:[]},
  {id:2, title:"Single - Shianda Market Near Stage", rent:3500, location:"Shianda Market, Mumias East", county:"Kakamega", town:"Shianda Market", mpesa:"0712", lat:"0.273000", lng:"34.500000", photos:[]},
]

export default function Home(){
  const [kejas, setKejas] = useState<any[]>(defaultKejas)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")
  const [selected, setSelected] = useState<any>(null)

  useEffect(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem("kejas")||"[]")
      if(Array.isArray(saved) && saved.length>0) setKejas([...defaultKejas,...saved])
    }catch{}
  },[])

  const filtered = kejas.filter(k=> k.county===county && k.town===town)

  return (
    <>
      <div className="header"><div className="logo">🔑 Keja<span>Connect</span></div><a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}> + List Keja</a></div>
      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in {town}</h1>
          <p>📍 {town}, {county} • {filtered.length} Kejas • Markets + GPS + Photos</p>
          <div style={{display:'flex', gap:'12px', marginTop:'18px', flexWrap:'wrap', alignItems:'flex-end', background:'white', padding:'12px', borderRadius:'14px', border:'1px solid #e5e7eb'}}>
            <SearchableDropdown icon="📍" label="COUNTY" options={Object.keys(countyTowns).sort()} value={county} onChange={(c)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county... e.g Bungoma"/>
            <SearchableDropdown icon="🛒" label="TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search market in ${county}... e.g Shianda`}/>
            <button onClick={()=>{setCounty("Kakamega"); setTown("Mumias Town")}} style={{height:'42px', padding:'0 14px', borderRadius:'10px', border:'1px solid #e5e7eb', background:'#f9fafb', cursor:'pointer', fontSize:'12px', fontWeight:700}}>↺ Reset</button>
          </div>
        </div>

        {filtered.length===0?
          <div style={{background:'white', padding:'32px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}>
            <h3>🏜️ No Kejas in {town} yet</h3><p style={{fontSize:'13px', color:'#6b7280'}}>Be first to list in {town}, {county}!</p>
            <a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List Keja in {town}</a>
          </div>
        :
          <div className="grid">
            {filtered.map((k:any)=>(
              <div key={k.id} className="card" style={{overflow:'hidden', padding:0, cursor:'pointer'}} onClick={()=>setSelected(k)}>
                {k.photos && k.photos[0]?
                  <img src={k.photos[0]} alt={k.title} style={{width:'100%', height:'180px', objectFit:'cover'}}/>
                  :
                  <div style={{width:'100%', height:'130px', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px'}}>🏠</div>
                }
                <div style={{padding:'12px'}}>
                  <div style={{marginBottom:'6px', display:'flex', flexWrap:'wrap', gap:'4px'}}>
                    <span className="badge badge-blue">Available</span>
                    {k.lat && <span className="badge" style={{background:'#dcfce7', color:'#166534', fontSize:'11px'}}>📍 GPS</span>}
                    {k.photos && k.photos.length>0 && <span className="badge" style={{background:'#fef3c7', color:'#92400e', fontSize:'11px'}}>📸 {k.photos.length}</span>}
                  </div>
                  <h3 style={{fontSize:'15px', margin:'6px 0'}}>{k.title}</h3>
                  <div className="meta" style={{fontSize:'12px'}}>📍 {k.town}, {k.county} • {k.location}</div>
                  <div className="price">KSh {k.rent.toLocaleString()} / month</div>
                  {k.photos && k.photos.length>1 && (
                    <div style={{display:'flex', gap:'6px', margin:'8px 0'}}>
                      {k.photos.slice(1,4).map((p:string,i:number)=><img key={i} src={p} style={{width:'45px', height:'35px', objectFit:'cover', borderRadius:'6px', border:'1px solid #e5e7eb'}} alt=""/>)}
                    </div>
                  )}
                  {k.lat && k.lng && (
                    <div style={{display:'flex', gap:'8px', margin:'10px 0'}} onClick={e=>e.stopPropagation()}>
                      <a href={`https://www.google.com/maps?q=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#f3f4f6', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'#111827', border:'1px solid #e5e7eb'}}>🗺️ View</a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#2563eb', padding:'8px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'white'}}>📍 Navigate</a>
                    </div>
                  )}
                  <button className="btn" style={{marginTop:'6px'}}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        }

        <div style={{textAlign:'center', marginTop:'30px', fontSize:'11px', color:'#9ca3af'}}><a href="/admin" style={{color:'#9ca3af'}}>Admin</a> • KejaConnect {county} © 2026</div>
      </div>

      {selected && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}} onClick={()=>setSelected(null)}>
          <div style={{background:'white', borderRadius:'16px', maxWidth:'500px', width:'100%', maxHeight:'90vh', overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            {selected.photos && selected.photos[0] && <img src={selected.photos[0]} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'16px 16px 0 0'}}/>}
            <div style={{padding:'16px'}}>
              <h2 style={{fontSize:'18px', fontWeight:800}}>{selected.title}</h2>
              <div style={{fontSize:'13px', color:'#6b7280', margin:'6px 0'}}>📍 {selected.location}</div>
              <div style={{fontSize:'20px', fontWeight:800, color:'#111827', margin:'8px 0'}}>KSh {selected.rent?.toLocaleString()} / month</div>
              {selected.photos && selected.photos.length>0 && <div style={{display:'flex', gap:'8px', flexWrap:'wrap', margin:'10px 0'}}>{selected.photos.map((p:string,i:number)=><img key={i} src={p} style={{width:'80px', height:'60px', objectFit:'cover', borderRadius:'8px'}}/>)}</div>}
              {selected.lat && <div style={{display:'flex', gap:'8px', margin:'12px 0'}}><a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#f3f4f6', padding:'10px', borderRadius:'8px', fontWeight:700, textDecoration:'none', color:'#111'}}>🗺️ View on Maps</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#2563eb', padding:'10px', borderRadius:'8px', fontWeight:700, textDecoration:'none', color:'white'}}>📍 Navigate to House</a></div>}
              <button onClick={()=>setSelected(null)} style={{width:'100%', background:'#111827', color:'white', padding:'12px', borderRadius:'10px', border:0, fontWeight:700, marginTop:'10px'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
