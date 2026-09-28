"use client"
import { useEffect, useState } from "react"

const ADMIN_PASSWORD = "Skynet@2026" // CHANGE THIS TO YOUR SECRET

export default function AdminLayout({children}:{children:React.ReactNode}){
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState("")
  const [checked, setChecked] = useState(false)

  useEffect(()=>{
    if(localStorage.getItem("skynet_admin_auth")==="true") setAuth(true)
    setChecked(true)
  },[])

  const login = (e:any)=>{
    e.preventDefault()
    if(pass===ADMIN_PASSWORD){
      localStorage.setItem("skynet_admin_auth","true")
      setAuth(true)
    } else alert("❌ Wrong Password! Only owner can view.")
  }

  const logout = ()=>{
    localStorage.removeItem("skynet_admin_auth")
    setAuth(false)
    setPass("")
  }

  if(!checked) return <div style={{padding:20}}>Checking...</div>

  if(!auth){
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', fontFamily:'sans-serif'}}>
        <form onSubmit={login} style={{background:'white', padding:24, borderRadius:16, border:'1px solid #ddd', width:'90%', maxWidth:360}}>
          <div style={{fontSize:22, fontWeight:900, textAlign:'center'}}>🔒 Skynet Owner Only</div>
          <div style={{fontSize:12, color:'#6b7280', textAlign:'center', marginTop:6}}>Enter secret password to view Payments & Admin</div>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Secret Password" type="password" style={{width:'100%', padding:12, borderRadius:10, border:'2px solid #111', marginTop:16}}/>
          <button type="submit" style={{width:'100%', padding:12, background:'#111', color:'white', borderRadius:10, marginTop:10, fontWeight:800, border:'none'}}>UNLOCK ADMIN</button>
          <div style={{fontSize:10, color:'#9ca3af', marginTop:10, textAlign:'center'}}>Default: Skynet@2026 - Change it in app/admin/layout.tsx</div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div style={{background:'#111', color:'white', padding:'8px 16px', display:'flex', justifyContent:'space-between', fontFamily:'sans-serif', fontSize:12}}>
        <span>🔒 Owner Mode - {ADMIN_PASSWORD}</span>
        <button onClick={logout} style={{background:'#ef4444', color:'white', border:'none', padding:'4px 10px', borderRadius:6, fontWeight:700}}>Logout</button>
      </div>
      {children}
    </div>
  )
}
