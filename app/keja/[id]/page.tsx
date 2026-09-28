"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useParams } from "next/navigation"

export default function KejaDetails(){
  const {id} = useParams()
  const [keja, setKeja] = useState<any>(null)
  useEffect(()=>{ supabase.from('kejas').select('*').eq('id', id).single().then(({data})=>setKeja(data)) },[id])
  if(!keja) return <div style={{padding:20}}>Loading keja...</div>
  return (
    <div style={{maxWidth:700, margin:'0 auto', background:'white', minHeight:'100vh'}}>
      <img src={keja.photos?.[0]} style={{width:'100%', height:300, objectFit:'cover'}}/>
      <div style={{padding:16}}>
        <h1 style={{margin:0, color:'#111827'}}>{keja.title}</h1>
        <p style={{color:'#6b7280'}}>📍 {keja.town}, {keja.county} • KSh {Number(keja.rent).toLocaleString()}</p>

        <div style={{background:'#f0fdf4', padding:14, borderRadius:12, marginTop:16, border:'1px solid #bbf7d0'}}>
          <div style={{fontWeight:800, fontSize:12, marginBottom:8}}>👤 LANDLORD CONTACT</div>
          <div style={{fontSize:14}}>Name: {keja.landlord_name || 'Not provided'}</div>
          <div style={{fontSize:15, marginTop:6, fontWeight:700}}>📞 {keja.phone}</div>
          <div style={{display:'flex', gap:10, marginTop:12}}>
            <a href={`tel:${keja.phone}`} style={{flex:1, background:'#111827', color:'white', padding:12, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>📞 Call Now</a>
            <a href={`https://wa.me/254${keja.whatsapp?.slice(-9)}?text=Hi, I saw your keja in ${keja.town} on KejaConnect`} target="_blank" style={{flex:1, background:'#22c55e', color:'white', padding:12, borderRadius:10, textAlign:'center', textDecoration:'none', fontWeight:700}}>WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  )
}
