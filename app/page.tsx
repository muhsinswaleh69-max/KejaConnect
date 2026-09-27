'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [refCode, setRefCode] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const PROPERTIES = [
    { id: 1, title: '2 Bedroom Ekero - 8000', rent: 8000, location: 'Ekero' },
    { id: 2, title: '1 Bedroom Shibale - 5500', rent: 5500, location: 'Shibale' },
  ]

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setRefCode(p.get('ref') || '')
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">KejaConnect - Fixed Build</h1>
      <p className="text-sm">Ref: {refCode || 'No ref'} - Mumias</p>
      {PROPERTIES.map((p:any) => {
        const fee = p.rent * 0.2
        return (
          <div key={p.id} className="border p-3 mt-3 rounded">
            <p className="font-bold">{p.title}</p>
            <p className="text-xs">Rent {p.rent} - Your 20% = {fee} - Landlord 80% = {p.rent - fee}</p>
            <button onClick={()=>setSelected(p)} className="bg-blue-600 text-white px-3 py-1 rounded mt-2 text-sm">Book</button>
          </div>
        )
      })}
      {selected && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"><div className="bg-white p-4 rounded"><p>Book {selected.title}</p><p>Your cut 20%: {selected.rent*0.2}</p><button onClick={()=>setSelected(null)} className="border px-3 py-1 mt-2 rounded">Close</button></div></div>}
    </div>
  )
}
