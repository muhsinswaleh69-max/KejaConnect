"use client"
import { useEffect, useState } from "react"

const defaultKejas = [
  {id:1, title:"2 Bedroom - Ekero", rent:8000, location:"Ekero, Mumias", mpesa:"0722545678", yourCut:1600, toLandlord:6400},
  {id:2, title:"Single - Shibale Near MMUST", rent:3500, location:"Shibale", mpesa:"0712345678", yourCut:700, toLandlord:2800},
  {id:3, title:"Bedsitter - Complex", rent:5500, location:"Mumias Complex", mpesa:"0798765432", yourCut:1100, toLandlord:4400},
]

export default function Home(){
  const [kejas, setKejas] = useState(defaultKejas)

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("kejas")||"[]")
    if(saved.length>0) setKejas([...defaultKejas, ...saved])
  },[])

  return (
    <>
      <div className="header">
        <div className="logo">🔑 Keja<span>Connect</span></div>
        <a href="/list" style={{background:'#2563eb', color:'white', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:700}}> + List Keja</a>
      </div>
      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in Mumias</h1>
          <p>{kejas.length} Kejas • Landlord: KSh 2K/5K Admin • Tenant: 20% first month auto-deducted</p>
        </div>
        <div className="grid">
          {kejas.map(k=>(
            <div key={k.id} className="card">
              <span className="badge badge-blue">Available</span> <span className="badge badge-green">Verified Payout: {k.mpesa}</span>
              <h3>{k.title}</h3>
              <div className="meta">{k.location} • Rent KSh {k.rent}</div>
              <div className="price">KSh {k.rent} / month</div>
              <button className="btn" onClick={()=>alert(`To book: Pay KSh ${k.rent} to KejaConnect Till. Landlord gets KSh ${k.toLandlord}, you keep KSh ${k.yourCut} auto.`)}>Book - Pay to Platform</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
