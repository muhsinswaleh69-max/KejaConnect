"use client"
import { useEffect, useState } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Kinango","Lunga Lunga"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Kaloleni","Mtwapa"],
  "Tana River": ["Hola","Garsen","Bura"],
  "Lamu": ["Lamu","Mokowe","Witu"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta","Mwatate"],
  "Garissa": ["Garissa","Dadaab","Balambala"],
  "Wajir": ["Wajir","Habaswein","Tarbaj"],
  "Mandera": ["Mandera","El Wak","Rhamu"],
  "Marsabit": ["Marsabit","Moyale","Laisamis"],
  "Isiolo": ["Isiolo","Garbatulla","Merti"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti"],
  "Embu": ["Embu","Runyenjes","Siakago"],
  "Kitui": ["Kitui","Mwingi","Mutomo","Kauwi"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu"],
  "Makueni": ["Wote","Makindu","Kibwezi","Mtito Andei"],
  "Nyandarua": ["Ol Kalou","Kinangop","Nyahururu"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini","Tetu"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana","Kagio"],
  "Murang'a": ["Murang'a","Thika","Kenol","Kangema","Kandara"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Juja"],
  "Turkana": ["Lodwar","Kakuma","Lokichar"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria"],
  "Samburu": ["Maralal","Wamba","Baragoi"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess","Kwanza"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Kesses","Soy"],
  "Elgeyo Marakwet": ["Iten","Kapsowar","Chepkorio"],
  "Nandi": ["Kapsabet","Nandi Hills","Chepterwai","Kobujoi"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat","Mogotio"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro"],
  "Narok": ["Narok","Kilgoris","Ololulunga","Suswa"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian"],
  "Kericho": ["Kericho","Litein","Londiani","Kipkelion"],
  "Bomet": ["Bomet","Sotik","Chepalungu","Konoin"],
  "Kakamega": ["Mumias","Kakamega Town","Malava","Butere","Lugari","Matete","Khwisero","Lurambi","Shinyalu","Ikolomani","Likuyani","Navakholo","Shibale"],
  "Vihiga": ["Vihiga","Luanda","Mbale","Emuhaya","Sabatia"],
  "Bungoma": ["Bungoma Town","Kimilili","Webuye","Sirisia","Bumula","Mt Elgon","Tongaren","Kanduyi","Chwele"],
  "Busia": ["Busia Town","Malaba","Nambale","Matayos","Teso North","Bunyala","Port Victoria"],
  "Siaya": ["Siaya","Bondo","Ugunja","Yala","Ukwala"],
  "Kisumu": ["Kisumu Town","Maseno","Ahero","Kombewa","Muhoroni"],
  "Homa Bay": ["Homa Bay","Oyugis","Kendubay","Mbita","Ndhiwa"],
  "Migori": ["Migori","Rongo","Awendo","Kehancha","Isebania"],
  "Kisii": ["Kisii Town","Ogembo","Keroka","Suneka","Nyamache"],
  "Nyamira": ["Nyamira","Nyansiongo","Ekerubo","Manga"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Kasaranai","Embakasi","Langata","Dagoretti","Parklands","Kilimani"],
}

const defaultKejas = [
  {id:1, title:"2 Bedroom - Ekero", rent:8000, location:"Ekero, Mumias Town", county:"Kakamega", town:"Mumias", mpesa:"0722545678", yourCut:1600, toLandlord:6400},
  {id:2, title:"Single - Shibale Near MMUST", rent:3500, location:"Shibale, Near MMUST", county:"Kakamega", town:"Mumias", mpesa:"0712345678", yourCut:700, toLandlord:2800},
  {id:3, title:"Bedsitter - Mumias Complex", rent:5500, location:"Mumias Complex, Tiled", county:"Kakamega", town:"Kakamega Town", mpesa:"0798765432", yourCut:1100, toLandlord:4400},
]

export default function Home(){
  const [kejas, setKejas] = useState(defaultKejas)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("kejas")||"[]")
    if(saved.length>0) {
      // Ensure old saved have county/town
      const normalized = saved.map((k:any)=>({
        county: k.county || "Bungoma",
        town: k.town || "Bungoma Town",
       ...k
      }))
      setKejas([...defaultKejas,...normalized])
    }
  },[])

  const towns = countyTowns[county] || []

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty)
    setTown(countyTowns[newCounty][0])
  }

  // FILTER - Only show Kejas for selected town
  const filtered = kejas.filter(k =>
    (k.county === county && k.town === town) ||
    (k.county === undefined && county === "Kakamega" && town === "Mumias") // backward compat
  )

  return (
    <>
      <div className="header">
        <div className="logo">🔑 Keja<span>Connect</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}> + List Keja</a>
      </div>

      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in {town}</h1>
          <p>{town}, {county} • {filtered.length} Kejas available • Choose different town to see its own wall</p>

          <div style={{display:'flex', gap:'10px', marginTop:'14px', flexWrap:'wrap'}}>
            <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #111827', fontWeight:700, minWidth:'160px'}}>
              {Object.keys(countyTowns).sort().map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #2563eb', fontWeight:600, minWidth:'160px'}}>
              {towns.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0? (
          <div style={{background:'white', padding:'40px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}>
            <h3 style={{fontWeight:800}}>No Kejas in {town} yet</h3>
            <p style={{fontSize:'13px', color:'#6b7280'}}>Be first to list in {town}, {county}!</p>
            <a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List Keja in {town}</a>
          </div>
        ) : (
          <div className="grid">
            {filtered.map(k=>(
              <div key={k.id} className="card">
                <div style={{marginBottom:'6px'}}>
                  <span className="badge badge-blue">Available</span>
                  <span className="badge badge-green">✓ Verified Landlord</span>
                </div>
                <h3>{k.title}</h3>
                <div className="meta">{k.location} • 📍 {k.town}, {k.county} • Rent KSh {k.rent.toLocaleString()}</div>
                <div className="price">KSh {k.rent.toLocaleString()} / month</div>
                <button className="btn" onClick={()=>alert(`BOOKING ${k.town}:\nPay KSh ${k.rent} to KejaConnect Till\n\nAuto Split:\n• Platform keeps: KSh ${k.yourCut} (20%)\n• Landlord gets: KSh ${k.toLandlord} (80%)\n\nNo skipping!`)}>Book - Pay to Platform</button>
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign:'center', marginTop:'30px', fontSize:'12px', color:'#9ca3af'}}>
          <a href="/admin" style={{color:'#9ca3af'}}>Admin</a> • KejaConnect {county} © 2026 • Each town has its own wall now
        </div>
      </div>
    </>
  )
}
