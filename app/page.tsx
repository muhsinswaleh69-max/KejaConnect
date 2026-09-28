"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"

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
  "Kitui": ["All Towns", "Kitui Town", "Mwingi", "Mutui", "Kyo"],
  "Machakos": ["All Towns", "Machakos Town", "Athi River", "Mavoko", "Kangundo", "Matuu"],
  "Makueni": ["All Towns", "Wote", "Mtito Andei", "Makindu", "Kibwezi"],
  "Nyandarua": ["All Towns", "Ol Kalou", "Engineer", "Njabini", "Mai Mahiu"],
  "Nyeri": ["All Towns", "Nyeri Town", "Karatina", "Othaya", "Mukurweini"],
  "Kirinyaga": ["All Towns", "Kerugoya", "Kutus", "Sagana", "Wanguru"],
  "Murang'a": ["All Towns", "Murang'a Town", "Kangema", "Kandara", "Maragua"],
  "Kiambu": ["All Towns", "Kiambu Town", "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru", "Githunguri"],
  "Turkana": ["All Towns", "Lodwar", "Kakuma", "Lokichar"],
  "West Pokot": ["All Towns", "Kapenguria", "Chepareria", "Makutano"],
  "Samburu": ["All Towns", "Maralal", "Wamba", "Baragoi"],
  "Trans Nzoia": ["All Towns", "Kitale", "Kiminini", "Endebess", "Kachibora"],
  "Uasin Gishu": ["All Towns", "Eldoret", "Burnt Forest", "Turbo", "Moiben"],
  "Elgeyo Marakwet": ["All Towns", "Iten", "Kapsowar", "Chebiemit"],
  "Nandi": ["All Towns", "Kapsabet", "Nandi Hills", "Kaiboi", "Kobujoi"],
  "Baringo": ["All Towns", "Kabarnet", "Marigat", "Eldama Ravine"],
  "Laikipia": ["All Towns", "Nanyuki", "Rumuruti", "Nyahururu"],
  "Nakuru": ["All Towns", "Nakuru Town", "Naivasha", "Molo", "Gilgil", "Njoro", "Bahati", "Rongai"],
  "Narok": ["All Towns", "Narok Town", "Kilgoris", "Ololulunga"],
  "Kajiado": ["All Towns", "Kajiado Town", "Ngong", "Ongata Rongai", "Kitengela", "Kiserian", "Loitokitok"],
  "Kericho": ["All Towns", "Kericho Town", "Litein", "Kipkelion", "Londiani"],
  "Bomet": ["All Towns", "Bomet Town", "Sotik", "Chepalungu", "Longisa"],
  "Kakamega": ["All Towns", "Kakamega Town", "Mumias Town", "Shianda Market", "Ekero", "Shibale", "Matawa", "Bukura", "Malava", "Butere", "Lugari", "Khayega"],
  "Vihiga": ["All Towns", "Mbale", "Luanda", "Majengo", "Chavakali", "Hamisi", "Emuhaya"],
  "Bungoma": ["All Towns", "Bungoma Town", "Kimilili", "Webuye", "Sirisia", "Chwele", "Malakisi", "Bumula"],
  "Busia": ["All Towns", "Busia Town", "Nambale", "Butula", "Funyula", "Port Victoria", "Bumala"],
  "Siaya": ["All Towns", "Siaya Town", "Bondo", "Ugunja", "Yala", "Usenge"],
  "Kisumu": ["All Towns", "Kisumu Town", "Maseno", "Ahero", "Kombewa", "Muhoroni", "Awasi"],
  "Homa Bay": ["All Towns", "Homa Bay Town", "Oyugis", "Kendubay", "Ndhiwa", "Mbita"],
  "Migori": ["All Towns", "Migori Town", "Rongo", "Kehancha", "Awendo", "Isebania"],
  "Kisii": ["All Towns", "Kisii Town", "Ogembo", "Keroka", "Nyamache", "Suneka"],
  "Nyamira": ["All Towns", "Nyamira Town", "Keroka", "Nyansiongo", "Ekerenyo"],
  "Nairobi": ["All Towns", "Nairobi CBD", "Westlands", "Karen", "Eastlands", "Kayole", "Umoja", "Rongai", "Kasaran", "Embakasi", "Kibera", "Kawangware", "Donholm", "Buruburu", "South C", "Langata"]
}

export default function Home(){
  const [kejas, setKejas] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<'all'|'vacant'|'taken'>('all')
  const [countyFilter, setCountyFilter] = useState("All")
  const [townFilter, setTownFilter] = useState("All Towns")
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('kejas').select('*').order('id',{ascending:false}); setKejas(data||[]) })() },[])
  const filtered = kejas.filter((k:any)=>{
    const txt = `${k.title} ${k.town} ${k.county} ${k.landlord_name||''}`.toLowerCase()
    const matchesSearch = txt.includes(search.toLowerCase())
    const matchesCounty = countyFilter==='All' || k.county===countyFilter || (!k.county && countyFilter==='Kakamega')
    const matchesTown = townFilter==='All Towns' || k.town===townFilter
    const matchesVacant = filter==='all'? true : filter==='vacant'?!k.is_taken : k.is_taken
    return matchesSearch && matchesCounty && matchesTown && matchesVacant
  })
  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><h1 style={{margin:0, fontSize:22}}>KejaConnect 🏠</h1><div style={{fontSize:11, color:'#6b7280'}}>Skynet Cyber 0713614441 • Viewing Fee KSh 200 • 47 Counties Covered</div></div>
        <Link href="/admin" style={{background:'#111', color:'white', padding:'8px 14px', borderRadius:20, textDecoration:'none', fontSize:12, fontWeight:800}}>Admin</Link>
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
        <div style={{display:'flex', gap:8, marginTop:10, flexWrap:'wrap'}}>
          <button onClick={()=>setFilter('all')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='all'?'#111':'#f3f4f6', color:filter==='all'?'white':'#111', fontWeight:700, fontSize:12}}>All {kejas.length}</button>
          <button onClick={()=>setFilter('vacant')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='vacant'?'#22c55e':'#f3f4f6', color:filter==='vacant'?'white':'#111', fontWeight:700, fontSize:12}}>✅ Vacant {kejas.filter((k:any)=>!k.is_taken).length}</button>
          <button onClick={()=>setFilter('taken')} style={{padding:'8px 14px', borderRadius:20, border:'none', background:filter==='taken'?'#ef4444':'#f3f4f6', color:filter==='taken'?'white':'#111', fontWeight:700, fontSize:12}}>🔒 Taken {kejas.filter((k:any)=>k.is_taken).length}</button>
          {countyFilter!=='All' && <span style={{fontSize:11, color:'#6b7280', alignSelf:'center'}}>📍 {countyFilter} {townFilter!=='All Towns'?`→ ${townFilter}`:''} • 47 Counties</span>}
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, marginTop:18}}>
        {filtered.map((k:any)=>(
          <div key={k.id} style={{background:'white', borderRadius:16, border:k.is_taken?'2px solid #fecaca':'2px solid #bbf7d0', overflow:'hidden', position:'relative'}}>
            <div style={{position:'absolute', top:10, left:10, background:k.is_taken?'#ef4444':'#22c55e', color:'white', fontSize:10, padding:'4px 10px', borderRadius:20, fontWeight:800}}>{k.is_taken?'🔒 TAKEN':'✅ VACANT'}</div>
            <div style={{position:'absolute', top:10, right:10, background:'white', fontSize:9, padding:'3px 8px', borderRadius:20, fontWeight:700, border:'1px solid #e5e7eb'}}>{k.county||'Kakamega'} • {k.town}</div>
            <div style={{height:140, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40}}>{k.is_taken?'🔒':'🏠'}</div>
            <div style={{padding:14}}>
              <div style={{fontWeight:800, fontSize:14}}>{k.title}</div>
              <div style={{fontSize:11, color:'#6b7280'}}>📍 {k.county||'Kakamega'} - {k.town} {k.landlord_name?`• ${k.landlord_name}`:''}</div>
              <div style={{fontSize:12, marginTop:4}}>Rent: <b>KSh {k.rent}</b> • Viewing: <b>KSh 200</b></div>
              <div style={{marginTop:12}}>{k.is_taken? <button disabled style={{background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca', padding:'10px', borderRadius:10, fontWeight:800, width:'100%', fontSize:12}}>🔒 TAKEN - {k.town}</button> : <Link href={`/keja/${k.id}`} style={{background:'#111', color:'white', padding:'10px', borderRadius:10, fontWeight:800, textDecoration:'none', textAlign:'center', display:'block', width:'100%', fontSize:12}}>✅ VACANT - {k.town} (KSh 200)</Link>}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
