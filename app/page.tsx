"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
// FIXED IMPORT - works for both structures
import { supabase } from "../lib/supabase"

export default function Home(){
  const [kejas, setKejas] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<'all'|'vacant'|'taken'>('all')

  useEffect(()=>{
    (async()=>{
      const {data} = await supabase.from('kejas').select('*').order('id',{ascending:false})
      setKejas(data||[])
    })()
  },[])

  const filtered = kejas.filter((k:any)=>{
    const matches = (k.title+k.town).toLowerCase().includes(search.toLowerCase())
    if(filter==='vacant') return matches && !k.is_taken
    if(filter==='taken') return matches && k.is_taken
    return matches
  })

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, background:'#f9fafb', minHeight:'100vh', fontFamily:'sans-serif'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h1 style={{margin:0}}>KejaConnect 🏠</h1>
        <Link href="/admin" style={{background:'#111', color:'white', padding:'8px 14px', borderRadius:20, textDecoration:'none'}}>Admin</Link>
      </div>

      <div style={{display:'flex', gap:10, marginTop:16, flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Shianda, Ekero..." style={{flex:1, padding:12, borderRadius:12, border:'1px solid #ddd'}}/>
        <button onClick={()=>setFilter('all')} style={{padding:'10px 16px', borderRadius:20, border:'none', background: filter==='all' ? '#111':'white', color: filter==='all'?'white':'#111', fontWeight:700}}>All {kejas.length}</button>
        <button onClick={()=>setFilter('vacant')} style={{padding:'10px 16px', borderRadius:20, border:'none', background: filter==='vacant' ? '#22c55e':'white', color: filter==='vacant'?'white':'#111', fontWeight:700}}>Vacant {kejas.filter((k:any)=>!k.is_taken).length}</button>
        <button onClick={()=>setFilter('taken')} style={{padding:'10px 16px', borderRadius:20, border:'none', background: filter==='taken' ? '#ef4444':'white', color: filter==='taken'?'white':'#111', fontWeight:700}}>Taken {kejas.filter((k:any)=>k.is_taken).length}</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, marginTop:20}}>
        {filtered.map((k:any)=>{
          const isTaken = k.is_taken
          const isPaid = k.status?.includes('PAID')
          return (
            <div key={k.id} style={{background:'white', borderRadius:16, border: isTaken ? '2px solid #fecaca':'2px solid #bbf7d0', padding:0, overflow:'hidden', position:'relative'}}>
              <div style={{position:'absolute', top:10, left:10, background: isTaken ? '#ef4444':'#22c55e', color:'white', fontSize:10, padding:'4px 10px', borderRadius:20, fontWeight:800}}>
                {isTaken ? (isPaid ? '🔒 TAKEN & PAID' : '⏳ TAKEN') : '✅ VACANT'}
              </div>
              <div style={{height:140, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40}}>{isTaken?'🔒':'🏠'}</div>
              <div style={{padding:14}}>
                <div style={{fontWeight:800}}>{k.title} - {k.town}</div>
                <div style={{fontSize:13, color:'#6b7280'}}>KSh {k.rent}</div>
                
                {/* THIS IS THE FIXED BUTTON YOU ASKED FOR */}
                <div style={{marginTop:12}}>
                  {k.is_taken ? (
                    <div style={{display:'flex', flexDirection:'column', gap:6}}>
                      <button disabled style={{background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca', padding:'10px', borderRadius:10, fontWeight:800, width:'100%', cursor:'not-allowed'}}>🔒 TAKEN - NOT VACANT</button>
                      <div style={{fontSize:10, color:'#6b7280', textAlign:'center'}}>Booked: {k.tenant_name || 'Tenant'} • {k.booked_at ? new Date(k.booked_at).toLocaleDateString() : ''}</div>
                    </div>
                  ) : (
                    <Link href={`/keja/${k.id}`} style={{background:'#111', color:'white', padding:'10px', borderRadius:10, fontWeight:800, textDecoration:'none', textAlign:'center', display:'block', width:'100%'}}>✅ VACANT - Book Now</Link>
                  )}
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
