'use client'
import { useState, useEffect } from 'react'

type Property = {
  id: number
  title: string
  location: string
  rent: number
  units: number
  posted: string
  amenities: string[]
  demand: string
}

const PROPERTIES: Property[] = [
  { id: 1, title: '2 Bedroom in Mumias Town - Ekero', location: 'Ekero', rent: 8000, units: 3, posted: '2 days ago', amenities: ['Water', 'WiFi', 'Tiled'], demand: 'High demand' },
  { id: 2, title: '1 Bedroom in Mumias - Shibale', location: 'Shibale', rent: 5500, units: 5, posted: '1 day ago', amenities: ['Water', 'Tiled'], demand: 'New' },
  { id: 3, title: 'Bedsitter in Mumias - Ekero Junction', location: 'Ekero', rent: 3500, units: 2, posted: '5 hours ago', amenities: ['Water', 'Electricity'], demand: 'High demand' },
  { id: 4, title: '2 Bedroom in Mumias - Bombani', location: 'Bombani', rent: 12000, units: 1, posted: '3 days ago', amenities: ['Water', 'WiFi', 'Tiled', 'Parking'], demand: 'High demand' },
]

export default function Page() {
  const [refCode, setRefCode] = useState<string>('')
  const [selected, setSelected] = useState<Property | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref') || params.get('referralCode')
    if (ref) setRefCode(ref)
  }, [])

  return (
    <div className="min-h-screen bg-[#eef6ff] p-2 md:p-6">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-[#0f2a5a]">🔑 KejaConnect</h1>
          <div className="font-semibold text-sm">{refCode? `Ref: ${refCode}` : 'Mumias, KE'}</div>
        </div>

        <div className="bg-[#f4f8ff] mx-4 mt-4 p-4 rounded-xl">
          <h2 className="text-xl font-bold text-[#0f2a5a]">{refCode? `${refCode} invited you to find your next Keja` : 'Find your next Keja in Mumias'}</h2>
          <p className="text-sm text-gray-600">{PROPERTIES.length} verified rentals • 20% service fee first month only • Anti-skip system active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {PROPERTIES.map((p) => {
            const fee = Math.round(p.rent * 0.2)
            const landlord = Math.round(p.rent * 0.8)
            return (
              <div key={p.id} className="border rounded-xl overflow-hidden bg-white">
                <div className="h-32 bg-gray-100 flex items-center justify-center text-xs relative">
                  <span className="absolute top-2 left-2 bg-white text-[10px] px-2 py-1 rounded-full border">{p.posted} • {p.demand}</span>
                  🏠 Photo
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm">{p.title}</h3>
                  <p className="text-xs text-gray-500">KejaConnect • {p.units} Units Left</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.amenities.map((a) => <span key={a} className="text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border">{a}</span>)}
                  </div>
                  <p className="font-bold text-sm mt-3">Rent: KSh {p.rent.toLocaleString()}/mo</p>
                  <p className="text-[10px] text-gray-500">You keep KSh {fee} (20%) | Landlord KSh {landlord}</p>
                  <button onClick={() => setSelected(p)} className="w-full bg-blue-600 text-white rounded-lg py-2 mt-3 text-sm font-semibold">Book Now</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold">{selected.title}</h3>
            <div className="mt-3 text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between"><span>Total Rent:</span><span className="font-bold">KSh {selected.rent}</span></div>
              <div className="flex justify-between text-blue-600"><span>Your 20%:</span><span className="font-bold">KSh {Math.round(selected.rent * 0.2)}</span></div>
              <div className="flex justify-between"><span>To Landlord:</span><span>KSh {Math.round(selected.rent * 0.8)}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setSelected(null)} className="flex-1 border rounded-lg py-2">Close</button>
              <button className="flex-1 bg-blue-600 text-white rounded-lg py-2">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
