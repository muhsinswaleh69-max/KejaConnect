"use client"
import { useState } from "react"

const countyTowns: Record<string, string[]> = {
  "Kakamega": ["Mumias", "Kakamega Town", "Malava", "Butere", "Lugari", "Matete", "Khwisero", "Lurambi", "Shinyalu", "Ikolomani", "Likuyani", "Navakholo"],
  "Bungoma": ["Bungoma Town", "Kimilili", "Webuye", "Sirisia", "Bumula", "Mt Elgon", "Tongaren", "Kanduyi"],
  "Busia": ["Busia Town", "Malaba", "Nambale", "Matayos", "Teso North", "Teso South", "Bunyala"],
  "Vihiga": ["Vihiga", "Luanda", "Mbale", "Majengo", "Emuhaya", "Sabatia"],
  "Kisumu": ["Kisumu Town", "Maseno", "Ahero", "Kombewa", "Muhoroni", "Nyando"],
  "Siaya": ["Siaya", "Bondo", "Ugunja", "Yala", "Ukwala"],
  "Nairobi": ["Westlands", "CBD", "Karen", "Eastlands", "Roysambu", "Kasaranai", "Embakasi", "Langata", "Dagoretti"],
  "Mombasa": ["Mvita", "Nyali", "Kisauni", "Likoni", "Changamwe", "Jomvu"],
  "Nakuru": ["Nakuru Town", "Naivasha", "Gilgil", "Molo", "Njoro"],
  "Uasin Gishu": ["Eldoret", "Turbo", "Moiben", "Kesses", "Ainabkoi"],
  "Trans Nzoia": ["Kitale", "Kiminini", "Endebess", "Kwanza", "Saboti"],
}

export default function ListPage() {
  const [county, setCounty] = useState("Kakamega")
  const [town, setTown] = useState("Mumias")
  const [form, setForm] = useState({title:"", rent:"", location:"", mpesa:""})
  const [done, setDone] = useState(false)

  const towns = countyTowns[county] || []

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
      location: form.location,
      mpesa: form.mpesa,
      county,
      town,
      yourCut: Math.round(parseInt(form.rent)*0.2),
      toLandlord: Math.round(parseInt(form.rent)*0.8),
      adminFee: ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu"].includes(county)? 5000 : 2000,
      status: "Listed"
    }
    localStorage.setItem("kejas", JSON.stringify([...existing, newKeja]))
    setDone(true)
    setTimeout(()=> window.location.href="/", 1500)
  }

  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ Keja Listed in {town}, {county}!</h2><p>Pay KSh {["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu"].includes(county)?"5,000":"2,000"} Admin Fee to activate. Redirecting...</p></div>

  return (
    <div style={{maxWidth:'500px', margin:'20px auto', background:'white', padding:'24px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
      <h1 style={{fontWeight:800, fontSize:'22px'}}>List Your Keja</h1>
      <p style={{fontSize:'12px', color:'#6b7280', marginBottom:'16px'}}>County → Town dropdown. Minor counties KSh 2K, Major KSh 5K</p>

      <label style={{fontSize:'13px', fontWeight:700}}>① County:</label>
      <select value={county} onChange={e=>handleCountyChange(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #111827', margin:'6px 0 12px', fontWeight:600}}>
        {Object.keys(countyTowns).map(c=><option key={c} value={c}>{c} County</option>)}
      </select>

      <label style={{fontSize:'13px', fontWeight:700}}>② Town in {county}:</label>
      <select value={town} onChange={e=>setTown(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #2563eb', margin:'6px 0 16px', fontWeight:600}}>
        {towns.map(t=><option key={t} value={t}>{t}</option>)}
      </select>

      <label style={{fontSize:'13px', fontWeight:600}}>Keja Title</label>
      <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="e.g. 2 Bedroom - Ekero"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Rent KSh</label>
      <input type="number" value={form.rent} onChange={e=>setForm({...form, rent:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="8000"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Exact Location / Stage</label>
      <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="Near Ekero stage, 2nd floor"/>

      <label style={{fontSize:'13px', fontWeight:600}}>M-Pesa Payout Number</label>
      <input value={form.mpesa} onChange={e=>setForm({...form, mpesa:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="0722xxxxxx"/>

      <div style={{background:'#f0fdf4', padding:'12px', borderRadius:'10px', fontSize:'13px', marginBottom:'16px', border:'1px solid #bbf7d0'}}>
        <b>{county} → {town}</b><br/>Admin Fee: KSh {["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu"].includes(county)?"5,000":"2,000"}<br/>Your 80% = KSh {form.rent?Math.round(parseInt(form.rent)*0.8):0}
      </div>

      <button onClick={handleSubmit} style={{width:'100%', background:'#111827', color:'white', padding:'14px', borderRadius:'10px', border:0, fontWeight:800, cursor:'pointer'}}>List Keja in {town}</button>
    </div>
  )
}
