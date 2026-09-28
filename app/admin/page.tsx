"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AdminPage(){
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState("")
  const [unlocks, setUnlocks] = useState<any[]>([])
  const [kejas, setKejas] = useState<any[]>([])

  const ADMIN_PASS = "467108" // Your LOOP Account Number = password

  useEffect(()=>{
    if(localStorage.getItem('skynet_admin')==='yes') setAuth(true)
  },[])

  useEffect(()=>{
    if(!auth) return
    loadData()
  },[auth])

  const loadData = async()=>{
    const {data: u} = await supabase.from('unlocks').select('*').order('unlocked_at', {ascending:false})
    const {data: k} = await supabase.from('kejas').select('*')
    setUnlocks(u||[])
    setKejas(k||[])
  }

  const handleLogin = ()=>{
    if(pass===ADMIN_PASS){
      localStorage.setItem('skynet_admin','yes')
      setAuth(true)
    } else alert("Wrong password! Use Account Number: 467108")
  }

  const getKejaTitle = (id:any)=>{
    const found = kejas.find(k=>k.id==id)
    return found? `${found.title} - KSh ${found.rent}` : `Keja #${id}`
  }

  const total = unlocks.length * 300

  if(!auth) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f3f4f6'}}>
      <div style={{background:'white', padding:24, borderRadius:16, width:340, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin:0, color:'#111827'}}>🔐 Skynet Cyber Admin</h2>
        <p style={{fontSize:12, color:'#6b7280'}}>Enter password to view M-Pesa payments</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password = 467108" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #d1d5db', marginTop:12}}/>
        <button onClick={handleLogin} style={{width:'100%', marginTop:12, background:'#111827', color:'white', padding:12, borderRadius:8, fontWeight:800, border:'none'}}>Login</button>
        <div style={{fontSize:10, marginTop:8, color:'#9ca3af', textAlign:'center'}}>LOOP BIZ Paybill 714888 Acc 467108<br/>0713614441</div>
      </div>
    </div>
  )

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{color:'#111827'}}>💰 Admin - KejaConnect</h1>
        <button onClick={()=>{localStorage.removeItem('skynet_admin'); setAuth(false)}} style={{background:'#e5e7eb', padding:'8px 12px', borderRadius:8, border:'none'}}>Logout</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:16}}>
        <div style={{background:'white', padding:16, borderRadius:12, border:'1px solid #e5e7eb'}}>
          <div style={{fontSize:12, color:'#6b7280'}}>TOTAL VIEWING FEES</div>
          <div style={{fontSize:22, fontWeight:800, color:'#111827'}}>KSh {total.toLocaleString()}</div>
          <div style={{fontSize:11, color:'#6b7280'}}>{unlocks.length} tenants paid</div>
        </div>
        <div style={{background:'white', padding:16, borderRadius:12, border:'1px solid #e5e7eb'}}>
          <div style={{fontSize:12, color:'#6b7280'}}>TOTAL KEJAS</div>
          <div style={{fontSize:22, fontWeight:800, color:'#111827'}}>{kejas.length}</div>
          <div style={{fontSize:11, color:'#6b7280'}}>Live listings</div>
        </div>
        <div style={{background:'white', padding:16, borderRadius:12, border:'1px solid #e5e7eb'}}>
          <div style={{fontSize:12, color:'#6b7280'}}>LOOP BIZ</div>
          <div style={{fontSize:14, fontWeight:800}}>714888 / 467108</div>
          <div style={{fontSize:11, color:'#22c55e'}}>Active</div>
        </div>
      </div>

      <div style={{background:'white', marginTop:20, borderRadius:12, overflow:'hidden', border:'1px solid #e5e7eb'}}>
        <div style={{padding:14, fontWeight:800, borderBottom:'1px solid #e5e7eb', color:'#111827'}}>Recent Payments (Unlocks)</div>
        {unlocks.length===0 && <div style={{padding:20, color:'#6b7280', fontSize:13}}>No payments yet. When tenant pays KSh 300, they will appear here.</div>}
        {unlocks.map((u,i)=>(
          <div key={i} style={{padding:12, borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', fontSize:13}}>
            <div>
              <div style={{fontWeight:700, color:'#111827'}}>{getKejaTitle(u.keja_id)}</div>
              <div style={{color:'#6b7280', fontSize:12}}>Tenant: {u.tenant_phone} • M-Pesa: <b style={{color:'#dc2626'}}>{u.mpesa_code}</b></div>
              <div style={{color:'#9ca3af', fontSize:11}}>{new Date(u.unlocked_at).toLocaleString()}</div>
            </div>
            <a href={`tel:${u.tenant_phone}`} style={{background:'#111827', color:'white', padding:'6px 10px', borderRadius:8, height:30, textDecoration:'none', fontSize:12}}>Call</a>
          </div>
        ))}
      </div>

      <div style={{marginTop:16, fontSize:11, color:'#6b7280'}}>Tip: Check LOOP BIZ SMS to verify M-Pesa code matches KSh 300. Then call tenant to arrange viewing.</div>
    </div>
  )
}
