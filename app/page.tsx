'use client'
import { useState, useEffect } from 'react'

type Property = { id: number; title: string; location: string; rent: number; units: number; posted: string; amenities: string[]; demand: string; landlordMpesa: string }

const PROPERTIES: Property[] = [
  { id: 1, title: '2 Bedroom in Mumias Town - Ekero', location: 'Ekero', rent: 8000, units: 3, posted: '2 days ago', amenities: ['Water','WiFi','Tiled'], demand: 'High demand', landlordMpesa: '0722345678' },
  { id: 2, title: '1 Bedroom in Mumias - Shibale', location: 'Shibale', rent: 5500, units: 5, posted: '1 day ago', amenities: ['Water','Tiled'], demand: 'New', landlordMpesa: '0711223344' },
  { id: 3, title: 'Bedsitter in Mumias - Ekero Junction', location: 'Ekero', rent: 3500, units: 2, posted: '5 hours ago', amenities: ['Water','Electricity'], demand: 'High demand', landlordMpesa: '0700555666' },
]

export default function Page() {
  const [refCode, setRefCode] = useState('')
  const [selected, setSelected] = useState<Property | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRefCode(params.get('ref') || '')
  }, [])

  return (
    <div className="min-h-screen bg-[#eef6ff] p-2 md:p-6">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-[#0f2a5a]">🔑 KejaConnect</h1>
          <div className="flex gap-3">
            <a href="/landlord" className="bg-[#0f2a5a] text-white px-4 py-1.5 rounded-full text-xs font-bold">List Your Keja - KSh 2k/5k</a>
            <a href="/admin" className="border px-4 py-1.5 rounded-full text-xs font-bold">Admin</a>
          </div>
        </div>

        <div className="bg-[#f4f8ff] mx-4 mt-4 p-4 rounded-xl">
          <h2 className="text-xl font-bold text-[#0f2a5a]">{refCode? `${refCode} invited you to find your next Keja` : 'Find your next Keja in Mumias'}</h2>
          <p className="text-sm text-gray-600">Landlords pay KSh 5,000 major towns / KSh 2,000 minor • Tenants: 20% fee first month only (auto-deducted, no skipping)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
          <div className="bg-white border rounded-xl p-5 h-fit">
            <h3 className="font-bold">Business Model</h3>
            <div className="text-xs mt-3 space-y-2 bg-blue-50 p-3 rounded">
              <p><b>Major towns</b> (Nairobi, Msa, Kisumu, Nakuru, Eldoret): KSh 5,000 listing</p>
              <p><b>Minor towns</b> (Mumias, Kakamega, Bungoma, Busia): KSh 2,000 listing</p>
              <p className="border-t pt-2"><b>First month:</b> System auto keeps 20%, sends 80% to landlord M-Pesa registered</p>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROPERTIES.map((p) => {
              const fee = Math.round(p.rent * 0.2)
              const payout = Math.round(p.rent * 0.8)
              return (
                <div key={p.id} className="border rounded-xl overflow-hidden">
                  <div className="h-32 bg-gray-100 flex items-center justify-center text-xs relative">
                    <span className="absolute top-2 left-2 bg-white text-[10px] px-2 py-1 rounded-full border">{p.posted}</span>
                    🏠
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm">{p.title}</h3>
                    <p className="text-[11px] text-gray-500">Payout M-Pesa: {p.landlordMpesa} (registered)</p>
                    <p className="font-bold text-sm mt-2">Rent: KSh {p.rent.toLocaleString()}</p>
                    <p className="text-[10px] text-blue-600">Your 20%: KSh {fee} | To Landlord: KSh {payout}</p>
                    <button onClick={() => setSelected(p)} className="w-full bg-blue-600 text-white rounded-lg py-2 mt-3 text-sm font-bold">Book - Pay to Platform</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold">{selected.title}</h3>
            <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
              <div className="flex justify-between"><span>Tenant pays (to YOU):</span><b>KSh {selected.rent}</b></div>
              <div className="flex justify-between text-blue-600"><span>Your commission (20%):</span><b>KSh {Math.round(selected.rent * 0.2)}</b></div>
              <div className="flex justify-between text-green-600"><span>Auto-send to {selected.landlordMpesa}:</span><b>KSh {Math.round(selected.rent * 0.8)}</b></div>
              <p className="text-[10px] text-gray-500 mt-2">Anti-skip: Money goes to platform Paybill first, then 80% released to landlord's registered M-Pesa. Landlord cannot skip.</p>
            </div>
            <button onClick={() => setSelected(null)} className="w-full border rounded-lg py-2 mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
