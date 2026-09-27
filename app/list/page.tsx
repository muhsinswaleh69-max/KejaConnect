"use client"
import { useState } from "react"

export default function ListPage() {
  const [form, setForm] = useState({title:"", rent:"", location:"", mpesa:"", town:"Mumias"})
  const [done, setDone] = useState(false)

  const handleSubmit = () => {
    if(!form.title || !form.rent || !form.mpesa) return alert("Fill all fields")
    const existing = JSON.parse(localStorage.getItem("kejas") || "[]")
    const newKeja = {
      id: Date.now(),
      title: form.title,
      rent: parseInt(form.rent),
      location: form.location,
      mpesa: form.mpesa,
      town: form.town,
      yourCut: Math.round(parseInt(form.rent)*0.2),
      toLandlord: Math.round(parseInt(form.rent)*0.8),
      adminFee: form.town==="Mumias"||form.town==="Kakamega"?"2000":"5000",
      status: "Listed - Pending Admin Fee"
    }
    localStorage.setItem("kejas", JSON.stringify([...existing, newKeja]))
    setDone(true)
    setTimeout(()=> window.location.href="/", 1500)
  }

  if(done) return <div style={{maxWidth:'500px', margin:'80px auto', textAlign:'center', background:'white', padding:'30px', borderRadius:'16px'}}><h2>✅ Keja Listed!</h2><p>Pay KSh {form.town==="Mumias"?"2,000":"5,000"} Admin Fee via M-Pesa Till to activate. Redirecting...</p></div>

  return (
    <div style={{maxWidth:'500px', margin:'30px auto', background:'white', padding:'24px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
      <h1 style={{fontWeight:800, fontSize:'22px'}}>List Your Keja</h1>
      <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'16px'}}>Mumias/Kakamega KSh 2K, Nairobi/Msa/Kisumu/Nakuru/Eldoret KSh 5K Admin</p>
      
      <label style={{fontSize:'13px', fontWeight:600}}>Keja Title (e.g. 2 Bedroom Ekero)</label>
      <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="2 Bedroom - Ekero"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Monthly Rent KSh</label>
      <input type="number" value={form.rent} onChange={e=>setForm({...form, rent:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="8000"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Location</label>
      <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="Ekero, near stage"/>

      <label style={{fontSize:'13px', fontWeight:600}}>M-Pesa for Payout (Registered)</label>
      <input value={form.mpesa} onChange={e=>setForm({...form, mpesa:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 12px'}} placeholder="0722xxxxxx"/>

      <label style={{fontSize:'13px', fontWeight:600}}>Town</label>
      <select value={form.town} onChange={e=>setForm({...form, town:e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', margin:'6px 0 16px'}}>
        <option>Mumias</option><option>Kakamega</option><option>Bungoma</option><option>Busia</option><option>Kisumu</option><option>Nairobi</option><option>Mombasa</option><option>Nakuru</option><option>Eldoret</option>
      </select>

      <div style={{background:'#f3f4f6', padding:'12px', borderRadius:'10px', fontSize:'13px', marginBottom:'16px'}}>
        First month: You get 80% = KSh {form.rent?Math.round(parseInt(form.rent)*0.8):0} | KejaConnect 20% = KSh {form.rent?Math.round(parseInt(form.rent)*0.2):0} (Auto, no skipping)
      </div>

      <button onClick={handleSubmit} style={{width:'100%', background:'#111827', color:'white', padding:'12px', borderRadius:'10px', border:0, fontWeight:700, cursor:'pointer'}}>List Keja - Pay Admin Fee Next</button>
      <a href="/" style={{display:'block', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'#6b7280'}}>Back to Kejas</a>
    </div>
  )
}
