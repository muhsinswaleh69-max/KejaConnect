"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import Link from "next/link"

export default function PaymentsPage(){
  const [bookings, setBookings] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterCounty, setFilterCounty] = useState("All")

  useEffect(()=>{ fetchBookings() },[])
  const fetchBookings = async()=>{
    const {data} = await supabase.from('bookings').select('*').order('created_at',{ascending:false})
    if(data) setBookings(data)
  }

  const filtered = bookings.filter(b=>{
    const matchSearch = !search || b.tenant_name?.toLowerCase().includes(search.toLowerCase()) || b.landlord_name?.toLowerCase().includes(search.toLowerCase()) || b.receipt_no?.toLowerCase().includes(search.toLowerCase()) || b.mpesa_code?.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  const totalRent = filtered.reduce((s,b)=>s+(b.rent_amount||0),0)
  const totalCommission = filtered.reduce((s,b)=>s+(b.commission_amount|| Math.round((b.rent_amount||0)*0.2)),0)
  const totalViewing = filtered.length * 200
  const totalPlatform = totalCommission + totalViewing
  const totalLandlordPayout = filtered.reduce((s,b)=>s+(b.landlord_payout|| (b.rent_amount - Math.round(b.rent_amount*0.2))),0)

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:16, fontFamily:'sans-serif', background:'#f9fafb', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{fontSize:20, fontWeight:800}}>💰 Payments - You vs Landlord</h1>
        <Link href="/admin" style={{padding:'8px 14px', background:'#111', color:'white', borderRadius:8, textDecoration:'none', fontSize:12, fontWeight:700}}>← Admin</Link>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:10, marginTop:16}}>
        <div style={{background:'white', padding:14, borderRadius:12, border:'1px solid #e5e7eb'}}><div style={{fontSize:11, color:'#6b7280'}}>Total Bookings</div><div style={{fontSize:20, fontWeight:800}}>{filtered.length}</div></div>
        <div style={{background:'#fef3c7', padding:14, borderRadius:12, border:'1px solid #fbbf24'}}><div style={{fontSize:11}}>Your Commission 20%</div><div style={{fontSize:20, fontWeight:800, color:'#b45309'}}>KSh {totalCommission.toLocaleString()}</div></div>
        <div style={{background:'#dcfce7', padding:14, borderRadius:12, border:'1px solid #86efac'}}><div style={{fontSize:11}}>Viewing Fees (KSh 200 each)</div><div style={{fontSize:20, fontWeight:800, color:'#16a34a'}}>KSh {totalViewing.toLocaleString()}</div></div>
        <div style={{background:'#111', color:'white', padding:14, borderRadius:12}}><div style={{fontSize:11, opacity:0.7}}>YOUR TOTAL PROFIT</div><div style={{fontSize:22, fontWeight:900}}>KSh {totalPlatform.toLocaleString()}</div><div style={{fontSize:10, opacity:0.7}}>Commission + Viewing</div></div>
        <div style={{background:'white', padding:14, borderRadius:12, border:'1px solid #ddd'}}><div style={{fontSize:11, color:'#6b7280'}}>Landlords Paid (80%)</div><div style={{fontSize:20, fontWeight:800}}>KSh {totalLandlordPayout.toLocaleString()}</div></div>
        <div style={{background:'white', padding:14, borderRadius:12, border:'1px solid #ddd'}}><div style={{fontSize:11, color:'#6b7280'}}>Total Rent Collected</div><div style={{fontSize:20, fontWeight:800}}>KSh {totalRent.toLocaleString()}</div></div>
      </div>

      <div style={{marginTop:16, display:'flex', gap:8}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Tenant, Landlord, Receipt, M-Pesa Code..." style={{flex:1, padding:10, borderRadius:8, border:'1px solid #ddd'}}/>
        <button onClick={fetchBookings} style={{padding:'10px 14px', background:'white', border:'1px solid #ddd', borderRadius:8, fontSize:12}}>🔄 Refresh</button>
      </div>

      <div style={{marginTop:16, background:'white', borderRadius:12, overflow:'hidden', border:'1px solid #e5e7eb'}}>
        <div style={{padding:12, fontWeight:800, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
          <span>All Transactions</span>
          <span style={{fontSize:11, color:'#6b7280'}}>Newest first</span>
        </div>
        {filtered.length===0? <div style={{padding:20, textAlign:'center', color:'#9ca3af'}}>No bookings yet. Book a house to see payments here.</div> :
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', fontSize:12, borderCollapse:'collapse'}}>
            <thead style={{background:'#f9fafb', textAlign:'left'}}>
              <tr><th style={{padding:10}}>Date</th><th style={{padding:10}}>Receipt</th><th style={{padding:10}}>House / Town</th><th style={{padding:10}}>Tenant</th><th style={{padding:10}}>Landlord</th><th style={{padding:10}}>M-Pesa Codes</th><th style={{padding:10}}>Rent</th><th style={{padding:10}}>Your 20%</th><th style={{padding:10}}>Landlord 80%</th><th style={{padding:10}}>Your Profit</th></tr>
            </thead>
            <tbody>
              {filtered.map(b=> {
                const commission = b.commission_amount || Math.round((b.rent_amount||0)*0.2)
                const landlordPayout = b.landlord_payout || (b.rent_amount - commission)
                const profit = (b.platform_profit || (200+commission))
                return (
                <tr key={b.id} style={{borderTop:'1px solid #f3f4f6'}}>
                  <td style={{padding:10}}>{new Date(b.created_at).toLocaleDateString('en-KE')}<br/><span style={{fontSize:10, color:'#9ca3af'}}>{new Date(b.created_at).toLocaleTimeString()}</span></td>
                  <td style={{padding:10}}><b>{b.receipt_no}</b><br/><span style={{fontSize:10, background:'#111', color:'white', padding:'1px 4px', borderRadius:4}}>{b.payout_code}</span></td>
                  <td style={{padding:10}}>{b.keja_id} <br/><span style={{fontSize:10, color:'#6b7280'}}>{b.landlord_name}</span></td>
                  <td style={{padding:10}}>{b.tenant_name}<br/><span style={{fontSize:10}}>{b.tenant_phone}</span></td>
                  <td style={{padding:10}}>{b.landlord_name}<br/><span style={{fontSize:10}}>{b.landlord_phone}</span></td>
                  <td style={{padding:10}}><div style={{fontSize:10}}>Viewing: <b style={{color:'#16a34a'}}>{b.viewing_mpesa_code||b.viewing_code}</b> ✓</div><div style={{fontSize:10}}>Rent: <b>{b.mpesa_code}</b> ✓</div></td>
                  <td style={{padding:10}}>KSh {b.rent_amount?.toLocaleString()}</td>
                  <td style={{padding:10, background:'#fef3c7', fontWeight:700}}>KSh {commission.toLocaleString()}</td>
                  <td style={{padding:10}}>KSh {landlordPayout.toLocaleString()}</td>
                  <td style={{padding:10, background:'#dcfce7', fontWeight:800, color:'#16a34a'}}>KSh {profit.toLocaleString()}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        }
      </div>

      <div style={{marginTop:16, background:'#f0f9ff', padding:12, borderRadius:10, border:'1px solid #bae6fd', fontSize:12}}>
        <b>How it works for Litein example (Rent KSh 2000):</b><br/>
        Tenant pays: Viewing 200 + Rent 2000 = 2200<br/>
        You keep: 200 (viewing) + 400 (20% of 2000) = <b>KSh 600 profit</b><br/>
        Landlord gets: 1600 (80%)<br/>
        Both M-Pesa codes saved: GVSJH745CHMBX and GHS543GVGJ38
      </div>
    </div>
  )
}
