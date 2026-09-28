"use client"
import { useEffect, useState, useRef } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu","Bamburi","Shanzu"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Kinango","Diani","Lunga Lunga"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Kaloleni","Mtwapa","Mariakani Market"],
  "Tana River": ["Hola","Garsen","Bura","Madogo Market"],
  "Lamu": ["Lamu","Mokowe","Witu","Mpeketoni"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta","Mwatate","Wundanyi Market"],
  "Garissa": ["Garissa","Dadaab","Balambala","Bura East Market"],
  "Wajir": ["Wajir","Habaswein","Tarbaj","Buna Market"],
  "Mandera": ["Mandera","El Wak","Rhamu","Takaba Market"],
  "Marsabit": ["Marsabit","Moyale","Laisamis","Loiyangalani Market"],
  "Isiolo": ["Isiolo","Garbatulla","Merti","Kinna Market"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau","Githongo Market","Mikinduri Market"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti","Kathwana Market"],
  "Embu": ["Embu","Runyenjes","Siakago","Kiritiri Market","Ishiara Market"],
  "Kitui": ["Kitui","Mwingi","Mutomo","Zombe Market","Kabati Market"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu","Tala Market","Masii Market"],
  "Makueni": ["Wote","Makindu","Kibwezi","Kikima Market","Sultan Hamud Market"],
  "Nyandarua": ["Ol Kalou","Kinangop","Nyahururu","Engineer Market","Njabini Market"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini","Mweiga Market","Naro Moru Market"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana","Wanguru Market","Kagio Market"],
  "Murang'a": ["Murang'a","Thika","Kenol","Kangema","Kangari Market","Kiriaini Market"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja","Gatundu","Githunguri Market","Kiambu Market"],
  "Turkana": ["Lodwar","Kakuma","Lokichar","Lokichogio Market"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria","Sigor Market"],
  "Samburu": ["Maralal","Wamba","Baragoi","Suguta Market"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess","Cherangany Market","Kachibora Market"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Kesses","Soy","Burnt Forest","Ziwa Market","Moi's Bridge Market"],
  "Elgeyo Marakwet": ["Iten","Kapsowar","Chepkorio","Kapcherop Market"],
  "Nandi": ["Kapsabet","Nandi Hills","Chepterwai","Kobujoi","Kaiboi Market","Kaptumo Market"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat","Mogotio Market","Kabartonjo Market"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti","Doldol Market","Kinamba Market"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro","Bahati","Mau Narok Market","Subukia Market"],
  "Narok": ["Narok","Kilgoris","Ololulunga","Ntulele Market","Ololunga Market"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian","Loitoktok","Namanga Market","Isinya Market"],
  "Kericho": ["Kericho","Litein","Londiani","Sosiot Market","Fort Ternan Market"],
  "Bomet": ["Bomet","Sotik","Chepalungu","Longisa Market","Mogogosiek Market"],
  "Kakamega": [
    "Mumias Town","Mumias Market","Shianda Market","Ekero Market","Shibale Market","Mumias Complex",
    "Butere Town","Butere Market","Malava Town","Malava Market","Matungu Market","Khwisero Market",
    "Lurambi","Kakamega Town","Kakamega Market","Lugari","Likuyani Market","Navakholo Market","Shinyalu Market",
    "Ikolomani Market","Matete Market","Mautuma Market","Kambiri Market","Bukura Market","Kilingili Market",
    "Lumakanda Market","Mois Bridge Market","Khayega Market","Shinyalu Town","Lubao Market",
    "Mumias West","Mumias East","Eshirulo Market","Emuhaya Market","Sabatia Market","Shikoti Market"
  ],
  "Vihiga": ["Vihiga","Luanda Market","Mbale","Emuhaya","Sabatia","Chavakali Market","Majengo Market","Serem Market","Mudete Market"],
  "Bungoma": ["Bungoma Town","Bungoma Market","Kimilili Town","Kimilili Market","Webuye Town","Webuye Market","Sirisia Market","Bumula Market","Mt Elgon Market","Tongaren Market","Kanduyi Market","Chwele Market","Misikhu Market","Kapsokwony Market","Naitiri Market","Bokoli Market"],
  "Busia": ["Busia Town","Busia Market","Malaba Town","Malaba Market","Nambale Market","Matayos Market","Teso North Market","Bunyala Market","Port Victoria Market","Bumala Market","Mundika Market","Amukura Market"],
  "Siaya": ["Siaya","Bondo","Ugunja Market","Yala Market","Ukwala Market","Akala Market","Usenge Market"],
  "Kisumu": ["Kisumu Town","Maseno Market","Ahero Market","Kombewa Market","Muhoroni Market","Nyando Market","Sondu Market","Kibos Market"],
  "Homa Bay": ["Homa Bay","Oyugis Market","Kendubay Market","Mbita Market","Ndhiwa Market","Sindo Market","Rangwe Market","Magunga Market"],
  "Migori": ["Migori","Rongo Market","Awendo Market","Kehancha Market","Isebania Market","Migori Market","Suna Market"],
  "Kisii": ["Kisii Town","Kisii Market","Ogembo Market","Keroka Market","Suneka Market","Nyamache Market","Masimba Market","Gesusu Market"],
  "Nyamira": ["Nyamira","Nyansiongo Market","Ekerubo Market","Manga Market","Keroka Market"],
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
      <div onClick={()=>setOpen(!open)} style={{padding:'11px 12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, fontSize:'13px', display:'flex', justifyContent:'space-between'}}>
        {value} <span style={{fontSize:'11px', color:'#9ca3af'}}>▼</span>
      </div>
      {open && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'12px', marginTop:'6px', zIndex:30, boxShadow:'0 12px 30px rgba(0,0,0,0.15)', overflow:'hidden'}}>
          <div style={{padding:'8px', background:'#f9fafb'}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px'}}/></div>
          <div style={{maxHeight:'250px', overflowY:'auto'}}>
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
  {id:1, title:"2 Bedroom - Ekero Market", rent:8000, location:"Ekero Market, Mumias", county:"Kakamega", town:"Ekero Market", mpesa:"0722", lat:"0.334580", lng:"34.485550"},
  {id:2, title:"Single - Shianda Market Near Stage", rent:3500, location:"Shianda Market, Mumias East", county:"Kakamega", town:"Shianda Market", mpesa:"0712", lat:"0.273000", lng:"34.500000"},
]

export default function Home(){
  const [kejas, setKejas] = useState(defaultKejas)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias Town")
  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("kejas")||"[]")
    if(saved.length>0) setKejas([...defaultKejas,...saved])
  },[])
  const filtered = kejas.filter(k=> k.county===county && k.town===town)
  return (
    <>
      <div className="header"><div className="logo">🔑 Keja<span>Connect</span></div><a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}> + List Keja</a></div>
      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in {town}</h1>
          <p>📍 {town}, {county} • {filtered.length} Kejas • Markets included</p>
          <div style={{display:'flex', gap:'12px', marginTop:'18px', flexWrap:'wrap', alignItems:'flex-end', background:'white', padding:'12px', borderRadius:'14px', border:'1px solid #e5e7eb'}}>
            <SearchableDropdown icon="📍" label="COUNTY" options={Object.keys(countyTowns).sort()} value={county} onChange={(c)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county..."/>
            <SearchableDropdown icon="🛒" label="TOWN / MARKET" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search market in ${county}... e.g Shianda`}/>
            <button onClick={()=>{setCounty("Kakamega"); setTown("Mumias Town")}} style={{height:'42px', padding:'0 14px', borderRadius:'10px', border:'1px solid #e5e7eb', background:'#f9fafb', cursor:'pointer', fontSize:'12px', fontWeight:700}}>↺ Reset</button>
          </div>
        </div>
        {filtered.length===0? <div style={{background:'white', padding:'32px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}><h3>🏜️ No Kejas in {town} yet</h3><p style={{fontSize:'13px', color:'#6b7280'}}>Be first to list in {town}, {county}!</p><a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List Keja in {town}</a></div> :
          <div className="grid">{filtered.map((k:any)=>(
            <div key={k.id} className="card"><span className="badge badge-blue">Available</span>{k.lat && <span className="badge" style={{background:'#dcfce7', color:'#166534', marginLeft:'6px'}}>📍 GPS</span>}<h3 style={{marginTop:'8px'}}>{k.title}</h3><div className="meta">📍 {k.town}, {k.county}</div><div className="price">KSh {k.rent.toLocaleString()} / month</div>{k.lat && <div style={{display:'flex', gap:'8px', margin:'10px 0'}}><a href={`https://www.google.com/maps?q=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#f3f4f6', padding:'9px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'#111827', border:'1px solid #e5e7eb'}}>🗺️ View</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${k.lat},${k.lng}`} target="_blank" style={{flex:1, textAlign:'center', background:'#2563eb', padding:'9px', borderRadius:'8px', fontSize:'12px', fontWeight:700, textDecoration:'none', color:'white'}}>📍 Navigate</a></div>}<button className="btn">Book</button></div>
          ))}</div>
        }
      </div>
    </>
  )
}
