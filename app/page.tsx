"use client"
import { useEffect, useState } from "react"

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

const allLocations: {county:string, town:string}[] = []
Object.entries(countyTowns).forEach(([county, towns])=>{
  towns.forEach(town=> allLocations.push({county, town}))
})

const defaultKejas = [
  {id:1, title:"2 Bedroom - Ekero", rent:8000, location:"Ekero, Mumias Town", county:"Kakamega", town:"Mumias", mpesa:"0722545678", yourCut:1600, toLandlord:6400},
  {id:2, title:"Single - Shibale Near MMUST", rent:3500, location:"Shibale, Near MMUST", county:"Kakamega", town:"Mumias", mpesa:"0712345678", yourCut:700, toLandlord:2800},
  {id:3, title:"Bedsitter - Mumias Complex", rent:5500, location:"Mumias Complex, Tiled", county:"Kakamega", town:"Kakamega Town", mpesa:"0798765432", yourCut:1100, toLandlord:4400},
]

export default function Home(){
  const [kejas, setKejas] = useState(defaultKejas)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")
  const [search, setSearch] = useState("")
  const [showSug, setShowSug] = useState(false)

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("kejas")||"[]")
    if(saved.length>0) setKejas([...defaultKejas,...saved])
  },[])

  const towns = countyTowns[county] || []

  const filteredSuggestions = search.length>0
   ? allLocations.filter(l=>
        l.county.toLowerCase().includes(search.toLowerCase()) ||
        l.town.toLowerCase().includes(search.toLowerCase())
      ).slice(0,8)
    : []

  const handleSelectSuggestion = (c:string, t:string) => {
    setCounty(c); setTown(t); setSearch(`${t}, ${c}`); setShowSug(false)
  }

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty)
    setTown(countyTowns[newCounty][0])
    setSearch("")
  }

  const handleSearchClick = () => {
    if(filteredSuggestions.length>0){
      handleSelectSuggestion(filteredSuggestions[0].county, filteredSuggestions[0].town)
    }
  }

  const filteredKejas = kejas.filter(k=> k.county===county && k.town===town)

  return (
    <>
      <div className="header">
        <div className="logo">🔑 Keja<span>Connect</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700, textDecoration:'none'}}> + List Keja</a>
      </div>

      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in {town}</h1>
          <p>{town}, {county} • {filteredKejas.length} Kejas • Each town has its own wall</p>

          {/* SEARCH BAR */}
          <div style={{position:'relative', marginTop:'16px', display:'flex', gap:'8px'}}>
            <div style={{position:'relative', flex:1}}>
              <input
                value={search}
                onChange={e=>{setSearch(e.target.value); setShowSug(true)}}
                onFocus={()=>setShowSug(true)}
                placeholder="🔍 Search county or town... e.g. Bungoma, Nairobi, Mumias"
                style={{width:'100%', padding:'12px 14px', borderRadius:'10px', border:'2px solid #111827', fontWeight:600, fontSize:'14px'}}
              />
              {showSug && filteredSuggestions.length>0 && (
                <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e5e7eb', borderRadius:'10px', marginTop:'4px', zIndex:20, boxShadow:'0 8px 20px rgba(0,0,0,0.12)', maxHeight:'240px', overflowY:'auto'}}>
                  {filteredSuggestions.map((s,i)=>(
                    <div key={i} onClick={()=>handleSelectSuggestion(s.county, s.town)} style={{padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid #f3f4f6', fontSize:'13px', fontWeight:600}}>
                      📍 {s.town} <span style={{color:'#6b7280', fontWeight:400}}>— {s.county}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSearchClick} style={{background:'#111827', color:'white', padding:'0 18px', borderRadius:'10px', border:0, fontWeight:800, cursor:'pointer'}}>Search</button>
          </div>

          <div style={{display:'flex', gap:'10px', marginTop:'12px', flexWrap:'wrap'}}>
            <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{padding:'10px 12px', borderRadius:'10px', border:'1px solid #d1d5db', fontWeight:700, minWidth:'150px'}}>
              {Object.keys(countyTowns).sort().map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={town} onChange={e=>setTown(e.target.value)} style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #2563eb', fontWeight:600, minWidth:'150px'}}>
              {towns.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={()=>{setSearch(""); setCounty("Kakamega"); setTown("Mumias")}} style={{padding:'10px', borderRadius:'10px', border:'1px solid #e5e7eb', background:'white', cursor:'pointer', fontSize:'13px'}}>Reset to Mumias</button>
          </div>
        </div>

        {filteredKejas.length === 0? (
          <div style={{background:'white', padding:'40px', borderRadius:'16px', textAlign:'center', border:'1px dashed #d1d5db'}}>
            <h3 style={{fontWeight:800}}>No Kejas in {town} yet</h3>
            <p style={{fontSize:'13px', color:'#6b7280'}}>Be first to list in {town}, {county}!</p>
            <a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List Keja in {town}</a>
          </div>
        ) : (
          <div className="grid">
            {filteredKejas.map(k=>(
              <div key={k.id} className="card">
                <div style={{marginBottom:'6px'}}>
                  <span className="badge badge-blue">Available</span>
                  <span className="badge badge-green">✓ Verified Landlord</span>
                </div>
                <h3>{k.title}</h3>
                <div className="meta">📍 {k.town}, {k.county} • Rent KSh {k.rent.toLocaleString()}</div>
                <div className="price">KSh {k.rent.toLocaleString()} / month</div>
                <button className="btn" onClick={()=>alert(`BOOKING ${k.town}:\nPay KSh ${k.rent} to KejaConnect Till`)}>Book - Pay to Platform</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
