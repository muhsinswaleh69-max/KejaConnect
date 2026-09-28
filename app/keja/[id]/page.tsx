  const bookHouse = async(e:any)=>{
    e.preventDefault()
    if(!tenantName||!tenantPhone||!rentMpesaCode) return alert('Enter Name, Phone & Rent Code')
    if(rentMpesaCode.toUpperCase()===viewingCode.toUpperCase()) return alert('Rent Code cannot be same as Viewing Code')
    setPaying(true)
    const payoutCode=`SKY-${Date.now().toString().slice(-6)}`
    const receiptNo=`RCPT-${Date.now().toString().slice(-8)}`
    const now=new Date()
    
    try {
      // 20% COMMISSION
      const rentInt=parseInt(keja.rent)
      const commission=Math.round(rentInt*0.20)
      const landlordPayout=rentInt-commission
      const platformProfit=200+commission

      // 1. Mark house TAKEN
      const {error:kejaError} = await supabase.from('kejas').update({is_taken:true, status:'TAKEN - PAID', tenant_name:tenantName, tenant_phone:tenantPhone, tenant_id:tenantId, payout_code:payoutCode, payout_at:now.toISOString()}).eq('id',keja.id)
      if(kejaError) throw kejaError

      const receipt={receiptNo,payoutCode,viewingCode:viewingCode.toUpperCase(),rentMpesaCode:rentMpesaCode.toUpperCase(),houseTitle:keja.title,county:keja.county,town:keja.town,rent:rentInt,viewingFee:200,commission,landlordPayout,platformProfit,totalPaid:rentInt+200,tenantName,tenantPhone,tenantId,landlordName:keja.landlord_name,landlordPhone:keja.phone,date:now.toLocaleString('en-KE'),latitude:keja.latitude,longitude:keja.longitude}
      setReceiptData(receipt)

      // 2. Insert booking - THIS WAS FAILING BEFORE
      const {error:bookError} = await supabase.from('bookings').insert({
        keja_id:keja.id,
        receipt_no:receiptNo,
        mpesa_code:rentMpesaCode.toUpperCase(),
        viewing_mpesa_code:viewingCode.toUpperCase(),
        tenant_name:tenantName,
        tenant_phone:tenantPhone,
        tenant_id:tenantId,
        rent_amount:rentInt,
        commission_amount:commission,
        landlord_payout:landlordPayout,
        platform_profit:platformProfit,
        payout_code:payoutCode,
        landlord_name:keja.landlord_name,
        landlord_phone:keja.phone
      })
      if(bookError) {
        console.error(bookError)
        alert(`⚠️ House marked TAKEN but Payment not saved in dashboard: ${bookError.message}\n\nGo to Supabase and run the SQL I gave you to disable RLS.`)
      } else {
        console.log("✅ Booking saved to payments dashboard")
      }

      setKeja({...keja,is_taken:true}); setStep('receipt')
    } catch(err:any){
      alert("❌ Error: "+err.message)
      console.error(err)
    }
    setPaying(false)
  }
