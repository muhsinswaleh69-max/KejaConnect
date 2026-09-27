export default function Home() {
  return (
    <>
      <div className="header">
        <div className="logo">🔑 Keja<span>Connect</span></div>
        <div style={{fontSize:'12px'}} className="badge badge-blue">List Your Keja - KSh 2K/5K Admin</div>
      </div>

      <div className="container">
        <div className="hero">
          <h1>Find your next Keja in Mumias</h1>
          <p>Landlords pay KSh 5,000 major towns / KSh 2,000 minor • Tenants: 20% fee first month only (auto-deducted, no skipping)</p>
        </div>

        <div className="model-box">
          <h3>Business Model</h3>
          <p><b>Major towns</b> (Nairobi, Msa, Kisumu, Nakuru, Eldoret): KSh 5,000 listing</p>
          <p><b>Minor towns</b> (Mumias, Kakamega, Bungoma, Busia): KSh 2,000 listing</p>
          <p style={{marginTop:'10px'}}><b>First month:</b> System auto keeps 20%, sends 80% to landlord M-Pesa registered</p>
        </div>

        <div className="grid">
          <div className="card">
            <div><span className="badge badge-blue">2 days ago</span> <span className="badge badge-green">Verified</span></div>
            <h3>2 Bedroom in Mumias Town - Ekero</h3>
            <div className="meta">Payout M-Pesa: 0722545678 (registered)</div>
            <div className="meta">Rent: KSh 8,000</div>
            <div className="meta">Your 20%: KSh 1600 • To Landlord: KSh 6400</div>
            <div className="price">KSh 8,000 / month</div>
            <button className="btn">Book - Pay to Platform</button>
          </div>

          <div className="card">
            <div><span className="badge badge-blue">1 day ago</span> <span className="badge badge-orange">New</span></div>
            <h3>Single Room - Shibale Near MMUST</h3>
            <div className="meta">Payout M-Pesa: 0712345678</div>
            <div className="meta">Rent: KSh 3,500 - Water + Elec incl.</div>
            <div className="price">KSh 3,500 / month</div>
            <button className="btn">Book - Pay to Platform</button>
          </div>

          <div className="card">
            <div><span className="badge badge-blue">5 hours ago</span></div>
            <h3>Bedsitter - Mumias Complex</h3>
            <div className="meta">Payout M-Pesa: 0798765432</div>
            <div className="meta">Rent: KSh 5,500 - Tiled + Kitchen</div>
            <div className="price">KSh 5,500 / month</div>
            <button className="btn">Book - Pay to Platform</button>
          </div>
        </div>
      </div>
    </>
  )
}
