"use client"
import { useState } from "react"

const countyTowns: Record<string, string[]> = {
  "Mombasa": ["Mvita","Nyali","Kisauni","Likoni","Changamwe","Jomvu","Tudor","Bamburi"],
  "Kwale": ["Kwale","Ukunda","Msambweni","Kinango","Lunga Lunga","Tiwi","Diani"],
  "Kilifi": ["Kilifi","Malindi","Watamu","Mariakani","Kaloleni","Mtwapa","Kilifi South","Magarini"],
  "Tana River": ["Hola","Garsen","Bura","Madogo","Kipini"],
  "Lamu": ["Lamu","Mokowe","Witu","Faza","Kiunga"],
  "Taita Taveta": ["Voi","Wundanyi","Taveta","Mwatate","Maungu"],
  "Garissa": ["Garissa","Dadaab","Balambala","Lagdera","Ijara","Fafi"],
  "Wajir": ["Wajir","Habaswein","Tarbaj","Wajir East","Eldas","Buna"],
  "Mandera": ["Mandera","El Wak","Rhamu","Takaba","Banissa","Lafey"],
  "Marsabit": ["Marsabit","Moyale","Laisamis","North Horr","Sololo"],
  "Isiolo": ["Isiolo","Garbatulla","Merti","Kinna"],
  "Meru": ["Meru Town","Maua","Nkubu","Timau","Mitunguu","Mikinduri"],
  "Tharaka Nithi": ["Chuka","Chogoria","Marimanti","Chiakariga"],
  "Embu": ["Embu","Runyenjes","Siakago","Manyatta","Kiritiri"],
  "Kitui": ["Kitui","Mwingi","Mutomo","Kauwi","Zombe","Kyuso"],
  "Machakos": ["Machakos","Mavoko","Athi River","Kangundo","Matuu","Kathiani","Mwala"],
  "Makueni": ["Wote","Makindu","Kibwezi","Mtito Andei","Mbooni","Kathonzweni"],
  "Nyandarua": ["Ol Kalou","Kinangop","Nyahururu","Engineer","Njabini"],
  "Nyeri": ["Nyeri","Karatina","Othaya","Mukurweini","Tetu","Kieni","Chaka"],
  "Kirinyaga": ["Kerugoya","Kutus","Sagana","Kagio","Wanguru"],
  "Murang'a": ["Murang'a","Thika","Kenol","Kangema","Kandara","Maragua","Kigumo"],
  "Kiambu": ["Kiambu","Thika","Ruiru","Limuru","Kikuyu","Githunguri","Juja","Gatundu"],
  "Turkana": ["Lodwar","Kakuma","Lokichar","Lokichogio","Kainuk"],
  "West Pokot": ["Kapenguria","Makutano","Chepareria","Sigor","Kacheliba"],
  "Samburu": ["Maralal","Wamba","Baragoi","Archers Post"],
  "Trans Nzoia": ["Kitale","Kiminini","Endebess","Kwanza","Saboti"],
  "Uasin Gishu": ["Eldoret","Turbo","Moiben","Kesses","Ainabkoi","Soy","Burnt Forest"],
  "Elgeyo Marakwet": ["Iten","Kapsowar","Chepkorio","Kapcherop"],
  "Nandi": ["Kapsabet","Nandi Hills","Chepterwai","Kobujoi","Mosoriot","Kaiboi"],
  "Baringo": ["Kabarnet","Eldama Ravine","Marigat","Mogotio","Chemolingot"],
  "Laikipia": ["Nanyuki","Nyahururu","Rumuruti","Kinamba","Doldol"],
  "Nakuru": ["Nakuru Town","Naivasha","Gilgil","Molo","Njoro","Bahati","Rongai"],
  "Narok": ["Narok","Kilgoris","Ololulunga","Suswa","Mara"],
  "Kajiado": ["Kajiado","Kitengela","Ngong","Ongata Rongai","Kiserian","Loitoktok","Namanga"],
  "Kericho": ["Kericho","Litein","Londiani","Kipkelion","Fort Ternan"],
  "Bomet": ["Bomet","Sotik","Chepalungu","Konoin"],
  "Kakamega": ["Mumias","Kakamega Town","Malava","Butere","Lugari","Matete","Khwisero","Lurambi","Shinyalu","Ikolomani","Likuyani","Navakholo","Shibale"],
  "Vihiga": ["Vihiga","Luanda","Mbale","Emuhaya","Sabatia","Chavakali"],
  "Bungoma": ["Bungoma Town","Kimilili","Webuye","Sirisia","Bumula","Mt Elgon","Tongaren","Kanduyi","Chwele"],
  "Busia": ["Busia Town","Malaba","Nambale","Matayos","Teso North","Teso South","Bunyala","Port Victoria"],
  "Siaya": ["Siaya","Bondo","Ugunja","Yala","Ukwala","Usigu"],
  "Kisumu": ["Kisumu Town","Maseno","Ahero","Kombewa","Muhoroni","Nyando"],
  "Homa Bay": ["Homa Bay","Oyugis","Kendubay","Mbita","Ndhiwa","Sindo","Rangwe"],
  "Migori": ["Migori","Rongo","Awendo","Kehancha","Isebania","Suna"],
  "Kisii": ["Kisii Town","Ogembo","Keroka","Suneka","Nyamache","Marani"],
  "Nyamira": ["Nyamira","Nyansiongo","Ekerubo","Keroka","Manga","Borabu"],
  "Nairobi": ["Westlands","CBD","Karen","Eastlands","Roysambu","Kasaranai","Embakasi","Langata","Dagoretti","Parklands","Kilimani","Lavington"],
}

const majorCounties = ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Kiambu","Kajiado","Machakos","Nyeri","Nandi","Murang'a","Meru","Kitui","Kisii","Kilifi","Kericho","Homa Bay","Busia","Bungoma","Kakamega"]

export default function ListPage() {
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")
  const [form, setForm] = useState({title:"", rent:"", location:"", mpesa:""})
  const [done, setDone] = useState(false)

  const towns = countyTowns[county] || []
  const isMajor = majorCounties.includes(county)

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty)
    setTown(countyTowns[newCounty][0])
  }

  const handleSubmit = () => {
    if(!form.title ||!form.rent ||!form.mpesa) return alert("Fill all fields")
    const existing = JSON.parse(localStorage.getItem("kejas") || "[]")
    const newKeja = {
      id: Date.now(),
      title: form.title,
      rent: parseInt(form.rent),
      location: `${form.location}, ${town}, ${county}`,
      mpesa: form.mpesa,
      county, town,
      adminFee: isMajor?5000:2000,
      yourCut: Math.round(parseInt(form.rent)*0.2),
      toLandlord: Math.round(parseInt(form.rent)*0.8),
    }
    localStorage.setItem("kejas", JSON.stringify([...existing, newKeja]))
    setDone(true)
    setTimeout(()=> window.location.href="/", 1500)
  }

  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ Listed in {town}, {county}!</h2><p>Redirecting...</p></div>

  return (
    <div style={{maxWidth:'550px', margin:'20px auto', background:'white', padding:'24px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
      <h1 style={{fontWeight:800, fontSize:'22px'}}>List Your Keja - All Kenya</h1>
      <p style={{fontSize:'12px', color:'#6b7280', marginBottom:'16px'}}>Select County → Town</p>

      <label style={{fontSize:'13px', fontWeight:700}}>① County:</label>
      <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #111827', margin:'6px 0 12px', fontWeight:600}}>
        {Object.keys(countyTowns).sort().map(c=><option key={c} value={c}>{c}</option>)}
      </select>

      <label style={{fontSize:'13px', fontWeight:700}}>② Town in {county}:</label>
      <select value={town} onChange={e=>setTown(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #2563eb', margin:'6px 0 16px', fontWeight:600}}>
        {towns.map(t=><option key={t} value={t}>{t}</option>)}
      </select>

      <label style={{fontSize:'13px', fontWeight:600}}>Keja Title</label>
      <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="e.g. 2 Bedroom - Ekero"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Rent KSh</label>
      <input type="number" value={form.rent} onChange={e=>setForm({...form, rent:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="8000"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Exact Stage / Plot</label>
      <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="Near Ekero stage, 2nd floor"/>

      <label style={{fontSize:'13px', fontWeight:600}}>M-Pesa Payout Number</label>
      <input value={form.mpesa} onChange={e=>setForm({...form, mpesa:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 16px'}} placeholder="0722xxxxxx"/>

      <button onClick={handleSubmit} style={{width:'100%', background:'#111827', color:'white', padding:'14px', borderRadius:'10px', border:0, fontWeight:800, cursor:'pointer'}}>List Keja in {town}</button>
      <a href="/" style={{display:'block', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'#6b7280', textDecoration:'none'}}>← Back to Kejas</a>
    </div>
  )
}
