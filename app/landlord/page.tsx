'use client'
import { useState } from 'react'

const MAJOR_TOWNS = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Kisii','Thika','Nakuru','Kiambu']
const MINOR_TOWNS = ['Mumias','Kakamega','Bungoma','Busia','Webuye','Malaba','Butere','Mumias Town','Shibale','Ekero']

export default function LandlordPage(){
  const [town, setTown] = useState('Mumias')
  const [townType, setTownType] = useState('minor')

  const fee = townType === 'major'? 5000 : 2000

  const checkTown = (value:string) => {
    setTown(value)
    if(MAJOR_TOWNS.map(t=>t.toLowerCase()).includes(value.toLowerCase())){
      setTownType('major')
    } else {
      setTownType('minor')
    }
  }

  return (
    <div className="min-h-screen bg-[#eef6ff] p-6 flex justify-center">
      <div className="bg-white max-w-md w-full rounded-xl p-6 shadow">
        <h1 className="text-xl font-bold text-[#0f2a5a]">List Your Property on KejaConnect</h1>
        <p className="text-sm text-gray-600 mt-1">Pay once, get tenants forever.</p>

        <div className="mt-6 space-y-4">
          <div><label className="text-sm font-semibold">Your Name</label><input className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="John - Landlord"/></div>
          <div><label className="text-sm font-semibold">Phone</label><input className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="07..."/></div>
          <div>
            <label className="text-sm font-semibold">Town / Area</label>
            <input value={town} onChange={e=>checkTown(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="e.g. Mumias"/>
            <p className="text-xs mt-1">Detected: <span className={townType==='major'?'text-orange-600 font-bold':'text-green-600 font-bold'}>{townType.toUpperCase()} TOWN</span></p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between text-sm"><span>Listing Fee ({townType} town)</span><span className="font-bold">KSh {fee.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm mt-1"><span>Commission on booking</span><span>0% from landlord (you take 20% from tenant)</span></div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold"><span>Total to Pay Now</span><span>KSh {fee.toLocaleString()}</span></div>
            <p className="text-[11px] text-gray-500 mt-2">{townType==='major'?'Major towns = KSh 5,000 because high demand, more marketing cost.':'Minor towns = KSh 2,000 discounted for local landlords.'}</p>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Pay KSh {fee.toLocaleString()} via M-Pesa</button>
          <p className="text-xs text-center text-gray-400">After payment, you can add up to 10 houses</p>
        </div>
      </div>
    </div>
  )
}
