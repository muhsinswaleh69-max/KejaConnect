"use client"
import { useEffect, useState, useRef } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Kinango"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Kaloleni","Mtwapa"],
  "Tana River": ["Hola","Garsen","Bura"],
  "Lamu": ["Lamu","Mokowe","Witu"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta"],
  "Garissa": ["Garissa","Dadaab","Balambala"],
  "Wajir": ["Wajir","Habaswein","Tarbaj"],
  "Mandera": ["Mandera","El Wak","Rhamu"],
  "Marsabit": ["Marsabit","Moyale","Laisamis"],
  "Isiolo": ["Isiolo","Garbatulla","Merti"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti"],
  "Embu": ["Embu","Runyenjes","Siakago"],
  "Kitui": ["Kitui","Mwingi","Mutomo"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu"],
  "Makueni": ["Wote","Makindu","Kibwezi"],
  "Nyandarua": ["Ol Kalou","Kinangop","Nyahururu"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana"],
  "Murang'a": ["Murang'a","Thika","Kenol","Kangema"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja","Gatundu"],
  "Turkana": ["Lodwar","Kakuma","Lokichar"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria"],
  "Samburu": ["Maralal","Wamba","Baragoi"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Kesses","Soy"],
  "Elgeyo Marakwet": ["Iten","Kapsowar","Chepkorio"],
  "Nandi": ["Kapsabet","Nandi Hills","Chepterwai"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro"],
  "Narok": ["Narok","Kilgoris","Ololulunga"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian"],
  "Kericho": ["Kericho","Litein","Londiani"],
  "Bomet": ["Bomet","Sotik","Chepalungu"],
  "Kakamega": ["Mumias","Kakamega Town","Malava","Butere","Lugari","Matete","Khwisero","Lurambi","Shinyalu","Ikolomani","Likuyani","Navakholo","Shibale"],
  "Vihiga": ["Vihiga","Luanda","Mbale","Emuhaya","Sabatia"],
  "Bungoma": ["Bungoma Town","Kimilili","Webuye","Sirisia","Bumula","Mt Elgon","Tongaren","Kanduyi","Chwele"],
  "Busia": ["Busia Town","Malaba","Nambale","Matayos","Teso North","Bunyala","Port Victoria"],
  "Siaya": ["Siaya","Bondo","Ugunja","Yala"],
  "Kisumu": ["Kisumu Town","Maseno","Ahero","Kombewa","Muhoroni"],
  "Homa Bay": ["Homa Bay","Oyugis","Kendubay","Mbita","Ndhiwa"],
  "Migori": ["Migori","Rongo","Awendo","Kehancha"],
  "Kisii": ["Kisii Town","Ogembo","Keroka","Suneka"],
  "Nyamira": ["Nyamira","Nyansiongo","Ekerubo"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Kasaranai","Embakasi","Langata","Dagoretti","Parklands","Kilimani","Lavington"],
}

function SearchableDropdown({label, options, value, onChange, placeholder}: {label:string, options:string[], value:string, onChange:(v:string)=>void, placeholder:string}){
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const h = (e:any)=>{ if(ref.current &&!ref.current.contains(e.target)) setOpen(false)}
    document.addEventListener("mousedown", h); return ()=>document.removeEventListener("mousedown", h)
  },[])
  const filtered = options.filter(o=> o.toLowerCase().includes(q.toLowerCase()))
  return (
    <div ref={ref} style={{position:'relative', minWidth:'170px'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'11px 12px', borderRadius:'10px', border:open?'2px solid #111827':'1px solid #d1d5db', background:'white', cursor:'pointer', fontWeight:700, fontSize:'13px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {value || label} <span style={{fontSize:'11px'}}>▼</span>
      </div>
      {open && (
        <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'10px', marginTop:'6px', zIndex:30, boxShadow:'0 10px 25px rgba(0,0,0,0.15)', overflow:'hidden'}}>
          <div style={{padding:'8px', borderBottom:'1px solid #f3f4f6'}}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} style={{width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'13px', outline:'none'}}/>
          </div>
          <div style={{maxHeight:'200px', overflowY:'auto'}}>
            {filtered.length===0? <div style={{padding:'10px', fontSize:'13px', color:'#9ca3af'}}>No results</div> :
              filtered.map(o=>(
                <div key={o} onClick={()=>{onChange(o); setOpen(false); setQ("")}} style={{padding:'9px 12px', cursor:'pointer', fontSize:'13px', fontWeight:o===value?700:400, background:o===value?'#eff6ff':'white', borderBottom:'1px solid #f9fafb'}}>{o}</div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

const defaultKejas = [
  {id:1, title:"2 Bedroom - Ekero", rent:8000, location:"Ekero, Mumias Town", county:"Kakamega", town:"Mumias", mpesa:"0722", yourCut:1600, toLandlord:6400},
  {id:2, title:"Single - Shibale Near MMUST", rent:3500, location:"Shibale, Near MMUST", county:"Kakamega", town:"Mumias", mpesa:"0712", yourCut:700, toLandlord:2800},
]

export default function Home(){
  const [kejas, setKejas] = useState(defaultKejas)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")

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
          <p>{town}, {county} • {filtered.length} Kejas • Each town has its own wall</p>
          <div style={{display:'flex', gap:'10px', marginTop:'16px', flexWrap:'wrap', alignItems:'center'}}>
            <SearchableDropdown label="Select County" options={Object.keys(countyTowns).sort()} value={county} onChange={(c)=>{setCounty(c); setTown(countyTowns[c][0])}} placeholder="Search county... e.g Bungoma"/>
            <SearchableDropdown label="Select Town" options={countyTowns[county]||[]} value={town} onChange={setTown} placeholder={`Search town in ${county}...`}/>
            <button onClick={()=>{setCounty("Kakamega"); setTown("Mumias")}} style={{padding:'10px 12px', borderRadius:'10px', border:'1px solid #e5e7eb', background:'white', cursor:'pointer', fontSize:'12px'}}>Reset</button>
          </div>
        </div>
        {filtered.length===0? <div style={{background:'white', padding:'30px', borderRadius:'16px', textAlign:'center'}}>No Kejas in {town} yet. <a href="/list">List one</a></div> :
          <div className="grid">{filtered.map(k=>(
            <div key={k.id} className="card"><span className="badge badge-blue">Available</span><h3>{k.title}</h3><div className="meta">📍 {k.town}, {k.county}</div><div className="price">KSh {k.rent.toLocaleString()} / month</div><button className="btn">Book - Pay to Platform</button></div>
          ))}</div>
        }
      </div>
    </>
  )
}
