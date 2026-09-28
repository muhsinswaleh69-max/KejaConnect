{k.is_taken ? (
  <div style={{display:'flex', flexDirection:'column', gap:6, width:'100%'}}>
    <button 
      disabled 
      style={{
        background:'#fee2e2', 
        color:'#dc2626', 
        border:'1px solid #fecaca',
        padding:'10px 14px', 
        borderRadius:10, 
        fontWeight:800,
        width:'100%',
        cursor:'not-allowed'
      }}
    >
      🔒 TAKEN - NOT VACANT
    </button>
    <div style={{fontSize:10, color:'#6b7280', textAlign:'center'}}>
      Booked: {k.tenant_name || 'Tenant'} • {k.booked_at ? new Date(k.booked_at).toLocaleDateString() : 'Recently'}
    </div>
  </div>
) : (
  <Link 
    href={`/keja/${k.id}`}
    style={{
      background:'#111', 
      color:'white', 
      padding:'10px 14px', 
      borderRadius:10, 
      fontWeight:800,
      textDecoration:'none',
      textAlign:'center',
      display:'block',
      width:'100%'
    }}
  >
    ✅ VACANT - Book Now
  </Link>
)}
