"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu","Mwembe Tayari","Kongowea","Mackinnon","Tudor"],
  "Kwale": ["Kwale Town","Ukunda","Diani","Msambweni","Lunga Lunga","Kinango","Tiwi","Matuga"],
  "Kilifi": ["Kilifi Town","Malindi","Watamu","Mariakani","Kaloleni","Mtwapa","Mazeras","Ganze"],
  "Tana River": ["Hola","Garsen","Bura","Madogo","Kipini"],
  "Lamu": ["Lamu Town","Mokowe","Faza","Mpeketoni","Witu"],
  "Taita Taveta": ["Voi","Taveta","Wundanyi","Mwatate","Maungu"],
  "Garissa": ["Garissa Town","Dadaab","Ijara","Balambala","Lagdera"],
  "Wajir": ["Wajir Town","Habaswein","Tarbaj","Wajir South","Eldas"],
  "Mandera": ["Mandera Town","El Wak","Rhamu","Takaba","Banisa"],
  "Marsabit": ["Marsabit Town","Moyale","Laisamis","North Horr","Sololo"],
  "Isiolo": ["Isiolo Town","Merti","Garbatulla","Kinna"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau","Mikinduri","Gakoromone"],
  "Tharaka-Nithi": ["Chuka","Chogoria","Marimanti","Kathwana"],
  "Embu": ["Embu Town","Runyenjes","Manyatta","Kiritiri","Siakago"],
  "Kitui": ["Kitui Town","Mwingi","Mutomo","Kabati","Migwani"],
  "Machakos": ["Machakos Town","Mavoko","Athi River","Kangundo","Matuu","Tala"],
  "Makueni": ["Wote","Makindu","Mtito Andei","Kibwezi","Emali"],
  "Nyandarua": ["Ol Kalou","Nyahururu","Engineer","Ol Joro Orok","Njabini"],
  "Nyeri": ["Nyeri Town","Othaya","Karatina","Mukurweini","Narumoru"],
  "Kirinyaga": ["Kerugoya","Kagio","Sagana","Kutus","Wanguru"],
  "Murang'a": ["Murang'a Town","Kangema","Kandara","Maragua","Kenol"],
  "Kiambu": ["Kiambu Town","Thika","Ruiru","Limuru","Kikuyu","Juja","Githunguri","Gatundu"],
  "Turkana": ["Lodwar","Kakuma","Lokichar","Lokichoggio"],
  "West Pokot": ["Kapenguria","Makutano","Sigor","Chepareria"],
  "Samburu": ["Maralal","Baragoi","Wamba","Archers Post"],
  "Trans-Nzoia": ["Kitale","Endebess","Kiminini","Kwanza"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Soy","Burnt Forest"],
  "Elgeyo-Marakwet": ["Iten","Kapsowar","Chepkorio"],
  "Nandi": ["Kapsabet","Nandi Hills","Mosoriot","Kabiyet"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat","Mogotio"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti","Doldol"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro","Rongai","Bahati"],
  "Narok": ["Narok Town","Kilgoris","Ololulunga","Suswa"],
  "Kajiado": ["Kajiado Town","Ngong","Kitengela","Kiserian","Ongata Rongai","Namanga"],
  "Kericho": ["Kericho Town","Litein","Kipkelion","Londiani"],
  "Bomet": ["Bomet Town","Sotik","Longisa","Mogogosiek"],
  "Kakamega": ["Kakamega Town","Mumias Town","Mumias Market","Shianda Market","Ekero Market","Shibale Market","Butere Town","Butere Market","Malava Town","Malava Market","Matungu Market","Khwisero Market","Lurambi","Lugari","Likuyani","Navakholo","Shinyalu","Bukura","Lumakanda"],
  "Vihiga": ["Vihiga Town","Luanda","Mbale","Emuhaya","Sabatia","Chavakali"],
  "Bungoma": ["Bungoma Town","Kimilili","Webuye","Sirisia","Chwele","Bumula","Malakisi"],
  "Busia": ["Busia Town","Malaba","Nambale","Bumala","Port Victoria","Funyula"],
  "Siaya": ["Siaya Town","Bondo","Ugunja","Usenge","Yala"],
  "Kisumu": ["Kisumu Town","Maseno","Ahero","Kombewa","Muhoroni","Nyamasaria","Kondele"],
  "Homa Bay": ["Homa Bay Town","Oyugis","Kendubay","Mbita","Ndhiwa","Rodi Kopany"],
  "Migori": ["Migori Town","Rongo","Kehancha","Awendo","Isebania"],
  "Kisii": ["Kisii Town","Ogembo","Nyamache","Suneka","Keroka"],
  "Nyamira": ["Nyamira Town","Nyansiongo","Keroka","Esise","Manga"],
  "Nairobi City": ["Westlands","CBD","Karen","Eastlands","Roysambu","Embakasi","Langata","Kawangware","Gikomba","Kibera","Mathare","Umoja","Kayole","Dandora","Kariobangi","Dagoretti","Parklands","Buruburu","Donholm","Kasarani","Ruaka"]
}

export default function Home(){
  const [kejas, setKejas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Shianda Market")
  const [countySearch, setCountySearch] = useState("")
  const [townSearch, setTownSearch] = useState("")

  useEffect(()=>{
    supabase.from('kejas').select('*').order('created_at',{ascending:false}).then(({data})=>{ if(data) setKejas(data); setLoading(false) })
  },[])

  const filtered = kejas.filter(k=> k.county===county && k.town===town)
  const counties = Object.keys(countyTowns).sort().filter(c=> c.toLowerCase().includes(countySearch.toLowerCase()))
  const towns = (countyTowns[county]||[]).filter(t=> t.toLowerCase().includes(townSearch.toLowerCase()))

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'sans-serif'}}>
      <div style={{background:'white', padding:'12px 16px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:10}}>
        <div style={{fontWeight:800}}>🔑 Keja<span style={{color:'#2563eb'}}>Connect</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', textDecoration:'none', fontWeight:700}}>+ List Keja</a>
      </div>
      <div style={{maxWidth:'900px', margin:'0 auto', padding:'16px'}}>
        <div style={{background:'#111827', color:'white', borderRadius:'16px', padding:'20px'}}>
          <h1 style={{margin:0, fontSize:'20px'}}>Find your next Keja in {town}</h1>
          <p style={{fontSize:'13px', color:'#9ca3af', marginTop:'6px'}}>{loading? 'Loading...': `${filtered.length} Kejas in ${town}, ${county} • Live ☁️`}</p>

          <div style={{background:'white', padding:'12px', borderRadius:'14px', marginTop:'16px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <div style={{flex:1, minWidth:'200px'}}>
              <div style={{fontSize:'11px', fontWeight:800, color:'#6b7280'}}>📍 COUNTY (47)</div>
              <input value={countySearch} onChange={e=>setCountySearch(e.target.value)} placeholder="Search county e.g Nairobi" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', marginTop:'4px'}}/>
              <select value={county} onChange={e=>{setCounty(e.target.value); setTown(countyTowns[e.target.value][0])}} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', marginTop:'6px', fontWeight:700}}>
                {counties.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{flex:1, minWidth:'200px'}}>
              <div style={{fontSize:'11px', fontWeight:800, color:'#6b7280'}}>🛒 TOWN / MARKET</div>
              <input value={townSearch} onChange={e=>setTownSearch(e.target.value)} placeholder={`Search in ${county}...`} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', marginTop:'4px'}}/>
              <select value={town} onChange={e=>setTown(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #d1d5db', marginTop:'6px', fontWeight:700}}>
                {towns.map(t=> <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading? <div style={{background:'white', padding:'20px', borderRadius:'12px', textAlign:'center', marginTop:'16px'}}>🔄 Loading from cloud...</div>
        : filtered.length===0? (
          <div style={{background:'white', padding:'32px', borderRadius:'16px', textAlign:'center', marginTop:'16px', border:'1px dashed #d1d5db'}}>
            <div style={{fontSize:'32px'}}>🏜️</div><h3>No Kejas in {town} yet</h3><a href="/list" style={{display:'inline-block', marginTop:'12px', background:'#111827', color:'white', padding:'10px 18px', borderRadius:'8px', textDecoration:'none', fontWeight:700}}>List House in {town}</a>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'14px', marginTop:'16px'}}>
            {filtered.map((k:any)=>(
              <div key={k.id} style={{background:'white', borderRadius:'14px', border:'1px solid #e5e7eb', overflow:'hidden'}}>
                {k.photos?.[0]? <img src={k.photos[0]} style={{width:'100%', height:'160px', objectFit:'cover'}}/> : <div style={{height:'100px', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px'}}>🏠</div>}
                <div style={{padding:'12px'}}>
                  <h3 style={{fontSize:'14px', fontWeight:800, margin:0}}>{k.title}</h3>
                  <div style={{fontSize:'11px', color:'#6b7280'}}>📍 {k.town}, {k.county}</div>
                  <div style={{fontSize:'16px', fontWeight:800, marginTop:'6px'}}>KSh {Number(k.rent).toLocaleString()}</div>
                  <a href={`/keja/${k.id}`} style={{display:'block', textAlign:'center', marginTop:'8px', background:'#111827', color:'white', padding:'8px', borderRadius:'8px', textDecoration:'none', fontSize:'13px'}}>View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
