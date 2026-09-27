"use client"
import { useState } from "react"

export default function Admin() {
  const [pin, setPin] = useState("")
  const [logged, setLogged] = useState(false)
  const ADMIN_PIN = "2026" // Change this to your own PIN later

  const kejas = [
    { id: 1, title: "2 Bedroom - Ekero", rent: 8000, mpesa: "0722545678", tenant: "Not Booked", yourCut: 1600, toLandlord: 6400, status: "Listed" },
    { id: 2, title: "Single - Shibale", rent: 3500, mpesa: "0712345678", tenant: "John - 0711xxx", yourCut: 700, toLandlord: 2800, status: "Paid - Awaiting Payout" },
    { id: 3, title: "Bedsitter - Complex", rent: 5500, mpesa: "0798765432", tenant: "Not Booked", yourCut: 1100, toLandlord: 4400, status: "Listed" },
  ]

  if (!logged) {
    return (
      <div style={{maxWidth:'400px', margin:'80px auto', background:'white', padding:'24px', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
        <h2 style={{fontWeight:800, marginBottom:'8px'}}>🔒 Admin Login</h2>
        <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'16px'}}>Only Muhsin - Enter PIN</p>
        <input 
          type="password" 
          placeholder="Enter PIN: 2026"
          value={pin}
          onChange={e=>setPin(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #d1d5db', marginBottom:'12px'}}
        />
        <button 
          onClick={()=> pin === ADMIN_PIN ? setLogged(true) : alert("Wrong PIN!")}
          style={{width:'100%', background:'#111827', color:'white', padding:'12px', borderRadius:'10px', border:0, fontWeight:700, cursor:'pointer'}}
        >
          Login
        </button>
        <p style={{fontSize:'11px', color:'#9ca3af', marginTop:'12px'}}>Default PIN is 2026 - Change it in code after</p>
      </div>
    )
  }

  const totalYourCut = kejas.reduce((s,k)=> s + k.yourCut, 0)

  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'20px 16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h1 style={{fontWeight:800}}>Admin Dashboard</h1>
        <button onClick={()=>setLogged(false)} style={{padding:'8px 14px', borderRadius:'8px', border:'1px solid #e5e7eb', background:'white', cursor:'pointer'}}>Logout</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
        <div style={{background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e5e7eb'}}><div style={{fontSize:'12px', color:'#6b7280'}}>Total Listings</div><div style={{fontSize:'20px', fontWeight:800}}>{kejas.length}</div></div>
        <div style={{background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e5e7eb'}}><div style={{fontSize:'12px', color:'#6b7280'}}>Your 20% Potential</div><div style={{fontSize:'20px', fontWeight:800, color:'#16a34a'}}>KSh {totalYourCut}</div></div>
        <div style={{background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e5e7eb'}}><div style={{fontSize:'12px', color:'#6b7280'}}>To Payout Landlords</div><div style={{fontSize:'20px', fontWeight:800}}>KSh {kejas.reduce((s,k)=>s+k.toLandlord,0)}</div></div>
      </div>

      {kejas.map(k=>(
        <div key={k.id} style={{background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e5e7eb', marginBottom:'12px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div><b>{k.title}</b><div style={{fontSize:'13px', color:'#6b7280'}}>Rent KSh {k.rent} • M-Pesa {k.mpesa}</div><div style={{fontSize:'13px'}}>Tenant: {k.tenant} • Status: {k.status}</div></div>
            <div style={{textAlign:'right'}}><div style={{fontSize:'12px'}}>Your Cut</div><div style={{fontWeight:800, color:'#16a34a'}}>KSh {k.yourCut}</div><div style={{fontSize:'12px', marginTop:'6px'}}>To Landlord</div><div style={{fontWeight:800}}>KSh {k.toLandlord}</div></div>
          </div>
          <button style={{marginTop:'12px', background:'#2563eb', color:'white', border:0, padding:'8px 12px', borderRadius:'8px', cursor:'pointer'}}>Mark as Paid to Landlord M-Pesa</button>
        </div>
      ))}
    </div>
  )
}
