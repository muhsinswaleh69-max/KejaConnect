"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function KejaConnect() {
  const [kejas, setKejas] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchKejas = async () => {
      const { data } = await supabase.from("kejas").select("*").eq("status", "open").order("created_at", { ascending: false });
      setKejas(data || []);
    };
    fetchKejas();
  }, []);

  const filtered = kejas.filter(k => {
    const matchType = filter === "all" || k.type === filter;
    const matchSearch = k.title.toLowerCase().includes(search.toLowerCase()) || k.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-black">🏠 KejaConnect</h1>
        <div className="flex gap-2">
          <Link href="/landlord" className="bg-white border text-black px-3 py-2 rounded text-sm">My Kejas</Link>
          <Link href="/post-keja" className="bg-black text-white px-4 py-2 rounded text-sm font-bold">+ Post Keja FREE</Link>
        </div>
      </div>

      {/* BANNER - FOR ALL */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4 text-sm">
        <b>Find Keja in Mumias & Western Kenya</b> | No Agent, No Commission | Call Owner Direct | Bedsitter, 1BR, 2BR, Hostel, Shop, Single Room
      </div>

      {/* SEARCH */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search: Mumias town, Shibale, Ekero, Kakamega..." className="w-full border p-3 rounded-lg mb-4" />

      {/* FILTERS - FOR EVERYONE */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button onClick={()=>setFilter("all")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="all"?"bg-black text-white":"bg-white border"}`}>All ({kejas.length})</button>
        <button onClick={()=>setFilter("single")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="single"?"bg-black text-white":"bg-white border"}`}>Single Room</button>
        <button onClick={()=>setFilter("bedsitter")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="bedsitter"?"bg-black text-white":"bg-white border"}`}>Bedsitter</button>
        <button onClick={()=>setFilter("1bed")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="1bed"?"bg-black text-white":"bg-white border"}`}>1 Bedroom</button>
        <button onClick={()=>setFilter("2bed")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="2bed"?"bg-black text-white":"bg-white border"}`}>2 Bedroom</button>
        <button onClick={()=>setFilter("hostel")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="hostel"?"bg-black text-white":"bg-white border"}`}>Hostels</button>
        <button onClick={()=>setFilter("shop")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter==="shop"?"bg-black text-white":"bg-white border"}`}>Shops / Stalls</button>
      </div>

      {/* LIST */}
      <div className="grid gap-3">
        {filtered.length===0 && <div className="text-center py-12 text-gray-500">No keja found in this area. Be first to post!</div>}
        {filtered.map(keja => (
          <div key={keja.id} className="border p-4 rounded-xl bg-white shadow-sm">
            <div className="flex justify-between">
              <div>
                <b className="text-[15px]">{keja.title}</b>
                <div className="text-xs text-gray-500 mt-1">📍 {keja.location} • {keja.type}</div>
              </div>
              <span className="bg-black text-white font-bold px-3 py-1 rounded-full text-sm h-fit">{keja.rent} KES</span>
            </div>
            <div className="text-sm mt-2 text-gray-700">{keja.description}</div>
            <div className="mt-3 flex gap-2">
              <a href={`tel:${keja.landlord_phone}`} className="flex-1 bg-green-600 text-white text-center py-2.5 rounded-lg text-sm font-bold">📞 Call Owner</a>
              <a href={`https://wa.me/${keja.landlord_phone}?text=Hi, naona keja yako ${keja.title} kwa KejaConnect`} className="flex-1 border text-center py-2.5 rounded-lg text-sm font-bold">WhatsApp</a>
            </div>
            <div className="text-[11px] text-gray-400 mt-2">Posted by: {keja.landlord_name} • {new Date(keja.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] text-gray-400 mt-8">KejaConnect © 2026 • Mumias - Western Kenya • Built by Muhsin</div>
    </div>
  );
}
