'use client';
import { useEffect, useRef } from 'react';

export default function Home() {
  useEffect(() => {
    // Build hero hour marks
    const marksContainer = document.getElementById('heroMarks');
    if (marksContainer) {
      for (let i = 0; i < 12; i++) {
        const mark = document.createElement('div');
        mark.style.cssText = `
          position:absolute; width:2px; height:18px;
          background:rgba(184,147,63,0.15); top:0; left:50%;
          transform-origin:bottom center;
          transform:rotate(${i * 30}deg);
        `;
        marksContainer.appendChild(mark);
      }
    }

    // Build ticker
    const watches = [
      { symbol: 'ROLEX SUB 126610', price: '$14,250', change: '+2.3%', up: true },
      { symbol: 'PATEK 5711/1A', price: '$51,800', change: '-1.1%', up: false },
      { symbol: 'AP ROYAL OAK 15500', price: '$36,400', change: '+0.8%', up: true },
      { symbol: 'OMEGA SPEEDMASTER', price: '$6,100', change: '+4.2%', up: true },
      { symbol: 'ROLEX DAYTONA 116500', price: '$28,900', change: '-0.6%', up: false },
      { symbol: 'IWC PILOT CHRONO', price: '$7,200', change: '+1.5%', up: true },
      { symbol: 'CARTIER SANTOS', price: '$8,600', change: '+0.3%', up: true },
      { symbol: 'TUDOR BLACK BAY', price: '$3,800', change: '+3.1%', up: true },
    ];
    const ticker = document.getElementById('ticker');
    if (ticker) {
      [...watches, ...watches].forEach(w => {
        const el = document.createElement('span');
        el.style.cssText = `
          display:inline-flex; align-items:center; gap:0.5rem;
          padding:0 2.5rem; font-family:'Cormorant Garamond',serif;
          font-size:0.8rem; letter-spacing:0.1em; color:#d6c9b0;
          border-right:1px solid rgba(184,147,63,0.2);
        `;
        el.innerHTML = `
          <span style="font-weight:700;color:#fdfbf7">${w.symbol}</span>
          <span style="color:#d4aa5a">${w.price}</span>
          <span style="color:${w.up ? '#6fcf97' : '#eb5757'}">${w.change}</span>
        `;
        ticker.appendChild(el);
      });
    }

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in,.stat-item,.step-item').forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      <style>{`
        :root {
          --navy:#0f1f3d; --navy-deep:#08142a; --navy-mid:#1a3260; --navy-light:#2a4a8a;
          --cream:#f5f0e8; --cream-warm:#ede5d4; --cream-dark:#d6c9b0;
          --gold:#b8933f; --gold-light:#d4aa5a; --gold-pale:#e8d5a0;
          --white:#fdfbf7; --text-dark:#0f1f3d; --text-muted:#4a5568;
        }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        body { font-family:'Cormorant Garamond',Georgia,serif; background:var(--cream); color:var(--text-dark); }
        nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 4rem; height:72px; background:rgba(8,20,42,0.96); backdrop-filter:blur(12px); border-bottom:1px solid rgba(184,147,63,0.25); }
        .nav-logo-text { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:var(--cream); letter-spacing:0.08em; }
        .nav-logo-sub { font-family:'Cormorant Garamond',serif; font-size:0.6rem; font-weight:300; color:var(--gold-light); letter-spacing:0.35em; text-transform:uppercase; display:block; margin-top:1px; }
        .nav-links { display:flex; align-items:center; gap:2.5rem; list-style:none; }
        .nav-links a { font-family:'Cormorant Garamond',serif; font-size:0.85rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--cream-dark); text-decoration:none; transition:color 0.3s; }
        .nav-links a:hover { color:var(--gold-light); }
        .nav-cta { border:1px solid var(--gold)!important; color:var(--gold-light)!important; padding:0.45rem 1.3rem; cursor:pointer; }
        .nav-cta:hover { background:var(--gold)!important; color:var(--navy-deep)!important; }
        .hero { min-height:100vh; background:var(--navy-deep); position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; padding:6rem 2rem 4rem; }
        .hero-bg-circle { position:absolute; border-radius:50%; opacity:0.04; border:1px solid var(--cream); top:50%; left:50%; transform:translate(-50%,-50%); }
        .hero-marks { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:680px; height:680px; }
        .hero-scanline { position:absolute; width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(184,147,63,0.3),transparent); animation:scanline 8s ease-in-out infinite; }
        @keyframes scanline { 0%,100%{top:20%;opacity:0} 20%{opacity:1} 80%{opacity:1} 0%{top:20%} 100%{top:80%} }
        .hero-content { position:relative; z-index:2; text-align:center; max-width:860px; }
        .hero-eyebrow { font-family:'Cormorant Garamond',serif; font-size:0.72rem; letter-spacing:0.45em; text-transform:uppercase; color:var(--gold-light); margin-bottom:1.8rem; opacity:0; animation:fadeUp 1s 0.3s forwards; }
        .hero-title { font-family:'Playfair Display',serif; font-size:clamp(3.5rem,8vw,6.5rem); font-weight:700; color:var(--cream); line-height:1.05; margin-bottom:0.2rem; opacity:0; animation:fadeUp 1s 0.5s forwards; }
        .hero-title em { font-style:italic; color:var(--gold-light); }
        .hero-title-sub { font-family:'Playfair Display',serif; font-size:clamp(1rem,2.5vw,1.6rem); font-style:italic; color:var(--cream-dark); margin-bottom:2rem; opacity:0; animation:fadeUp 1s 0.65s forwards; }
        .hero-divider { width:80px; height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); margin:0 auto 2rem; opacity:0; animation:fadeUp 1s 0.8s forwards; }
        .hero-desc { font-size:clamp(1rem,1.8vw,1.25rem); font-weight:300; color:rgba(245,240,232,0.75); line-height:1.8; max-width:600px; margin:0 auto 3rem; opacity:0; animation:fadeUp 1s 1s forwards; }
        .hero-actions { display:flex; gap:1.2rem; justify-content:center; flex-wrap:wrap; opacity:0; animation:fadeUp 1s 1.2s forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .btn-primary { font-family:'Cormorant Garamond',serif; font-size:0.85rem; font-weight:500; letter-spacing:0.25em; text-transform:uppercase; padding:1rem 2.5rem; background:var(--gold); color:var(--navy-deep); border:none; cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.3s; }
        .btn-primary:hover { background:var(--gold-light); transform:translateY(-1px); }
        .btn-secondary { font-family:'Cormorant Garamond',serif; font-size:0.85rem; letter-spacing:0.25em; text-transform:uppercase; padding:1rem 2.5rem; background:transparent; color:var(--cream); border:1px solid rgba(245,240,232,0.35); cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.3s; }
        .btn-secondary:hover { border-color:var(--gold-light); color:var(--gold-light); }
        .hero-ticker { position:absolute; bottom:0; left:0; right:0; background:rgba(15,31,61,0.9); border-top:1px solid rgba(184,147,63,0.2); padding:0.6rem 0; overflow:hidden; z-index:3; }
        .ticker-track { display:flex; animation:ticker 35s linear infinite; white-space:nowrap; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .stats-bar { background:var(--cream-warm); border-top:1px solid var(--cream-dark); border-bottom:1px solid var(--cream-dark); padding:2.5rem 4rem; display:flex; justify-content:center; }
        .stat-item { flex:1; max-width:220px; text-align:center; padding:0 2rem; border-right:1px solid var(--cream-dark); opacity:0; transform:translateY(15px); transition:opacity 0.7s,transform 0.7s; }
        .stat-item:last-child { border-right:none; }
        .stat-item.visible { opacity:1; transform:translateY(0); }
        .stat-number { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:var(--navy); }
        .stat-label { font-family:'Cormorant Garamond',serif; font-size:0.72rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--text-muted); }
        section { padding:7rem 4rem; }
        .section-eyebrow { font-size:0.7rem; letter-spacing:0.45em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }
        .section-title { font-family:'Playfair Display',serif; font-size:clamp(2rem,4vw,3rem); font-weight:700; line-height:1.15; color:var(--navy); margin-bottom:1.2rem; }
        .section-title em { font-style:italic; color:var(--navy-light); }
        .section-body { font-size:1.15rem; font-weight:300; line-height:1.9; color:var(--text-muted); max-width:540px; }
        .gold-rule { width:60px; height:1px; background:var(--gold); margin-bottom:1.8rem; }
        .feature-tracking { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; max-width:1200px; margin:0 auto; }
        .feature-tracking-visual { background:var(--navy-deep); padding:2rem; position:relative; box-shadow:0 24px 60px rgba(15,31,61,0.3); }
        .chart-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid rgba(184,147,63,0.2); }
        .chart-watch-name { font-family:'Playfair Display',serif; font-size:1rem; color:var(--cream); font-weight:600; }
        .chart-watch-ref { font-size:0.7rem; color:var(--gold-light); letter-spacing:0.2em; }
        .chart-price-current { font-family:'Playfair Display',serif; font-size:1.6rem; color:var(--gold-light); font-weight:700; }
        .chart-price-change { font-size:0.85rem; color:#6fcf97; }
        .chart-svg-wrap { height:140px; margin-bottom:1.2rem; }
        .chart-svg-wrap svg { width:100%; height:100%; }
        .chart-labels { display:flex; justify-content:space-between; font-size:0.65rem; letter-spacing:0.1em; color:rgba(245,240,232,0.35); text-transform:uppercase; }
        .alert-rows { margin-top:1.2rem; border-top:1px solid rgba(184,147,63,0.15); padding-top:1.2rem; display:flex; flex-direction:column; gap:0.65rem; }
        .alert-row { display:flex; align-items:center; justify-content:space-between; padding:0.55rem 0.8rem; background:rgba(26,50,96,0.5); border-left:2px solid var(--gold); }
        .alert-row-label { font-size:0.75rem; color:var(--cream-dark); letter-spacing:0.08em; }
        .alert-badge { font-size:0.62rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.2rem 0.6rem; background:rgba(111,207,151,0.15); color:#6fcf97; border:1px solid rgba(111,207,151,0.3); }
        .alert-badge.watch { background:rgba(184,147,63,0.15); color:var(--gold-light); border-color:rgba(184,147,63,0.3); }
        .feature-watchlist { background:var(--navy); padding:7rem 4rem; }
        .feature-watchlist-inner { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; max-width:1200px; margin:0 auto; }
        .watchlist-card { background:rgba(8,20,42,0.7); border:1px solid rgba(184,147,63,0.2); padding:1.5rem; box-shadow:0 20px 50px rgba(0,0,0,0.4); }
        .watchlist-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; }
        .watchlist-title { font-family:'Playfair Display',serif; font-size:0.95rem; color:var(--cream); font-weight:600; }
        .watchlist-count { font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-light); }
        .watch-row { display:grid; grid-template-columns:auto 1fr auto auto; gap:1rem; align-items:center; padding:0.75rem 0; border-bottom:1px solid rgba(184,147,63,0.1); }
        .watch-row:last-of-type { border-bottom:none; }
        .watch-row-icon { width:36px; height:36px; border-radius:50%; background:rgba(26,50,96,0.8); border:1px solid rgba(184,147,63,0.3); display:flex; align-items:center; justify-content:center; }
        .watch-row-name { font-family:'Playfair Display',serif; font-size:0.82rem; color:var(--cream); }
        .watch-row-ref { font-size:0.65rem; color:rgba(245,240,232,0.4); letter-spacing:0.1em; }
        .watch-row-price { font-family:'Libre Baskerville',serif; font-size:0.85rem; color:var(--gold-light); text-align:right; }
        .watch-row-change { font-size:0.75rem; text-align:right; min-width:50px; }
        .up { color:#6fcf97; } .down { color:#eb5757; }
        .watchlist-footer { margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(184,147,63,0.15); display:flex; justify-content:space-between; align-items:center; }
        .watchlist-updated { font-size:0.68rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(245,240,232,0.3); }
        .watchlist-pulse { display:flex; align-items:center; gap:0.4rem; font-size:0.68rem; letter-spacing:0.15em; text-transform:uppercase; color:#6fcf97; }
        .pulse-dot { width:6px; height:6px; border-radius:50%; background:#6fcf97; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        .how-it-works { background:var(--cream-warm); text-align:center; padding:7rem 4rem; }
        .steps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--cream-dark); max-width:1100px; margin:0 auto 4rem; border:1px solid var(--cream-dark); }
        .step-item { background:var(--white); padding:2.5rem 2rem; opacity:0; transform:translateY(20px); transition:opacity 0.7s,transform 0.7s; }
        .step-item.visible { opacity:1; transform:translateY(0); }
        .step-item:nth-child(2){transition-delay:0.1s} .step-item:nth-child(3){transition-delay:0.2s} .step-item:nth-child(4){transition-delay:0.3s}
        .step-number { font-family:'Playfair Display',serif; font-size:3rem; font-weight:700; color:var(--cream-dark); line-height:1; margin-bottom:1.2rem; }
        .step-title { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:600; color:var(--navy); margin-bottom:0.7rem; }
        .step-desc { font-size:1rem; font-weight:300; color:var(--text-muted); line-height:1.7; }
        .pricing { background:var(--navy-deep); padding:7rem 4rem; text-align:center; }
        .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; max-width:1000px; margin:0 auto; }
        .pricing-card { background:rgba(15,31,61,0.6); border:1px solid rgba(184,147,63,0.2); padding:2.5rem 2rem; text-align:left; position:relative; transition:border-color 0.3s; }
        .pricing-card:hover { border-color:rgba(184,147,63,0.5); }
        .pricing-card.featured { border-color:var(--gold); background:rgba(26,50,96,0.5); }
        .featured-badge { position:absolute; top:-1px; left:50%; transform:translateX(-50%); background:var(--gold); color:var(--navy-deep); font-size:0.62rem; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; padding:0.25rem 1.2rem; }
        .plan-name { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:600; color:var(--cream); margin-bottom:0.3rem; }
        .plan-desc { font-size:0.82rem; color:rgba(245,240,232,0.45); margin-bottom:1.5rem; }
        .plan-price { display:flex; align-items:baseline; gap:0.25rem; margin-bottom:0.5rem; }
        .plan-price-amount { font-family:'Playfair Display',serif; font-size:2.8rem; font-weight:700; color:var(--gold-light); line-height:1; }
        .plan-price-dollar { font-size:1.2rem; color:var(--gold); align-self:flex-start; margin-top:0.5rem; }
        .plan-price-period { font-size:0.85rem; color:rgba(245,240,232,0.4); }
        .plan-users { font-size:0.78rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold-light); margin-bottom:1.8rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(184,147,63,0.15); }
        .plan-features { list-style:none; margin-bottom:2rem; display:flex; flex-direction:column; gap:0.7rem; }
        .plan-features li { font-size:0.95rem; color:rgba(245,240,232,0.7); display:flex; align-items:flex-start; gap:0.6rem; line-height:1.4; }
        .plan-features li::before { content:'—'; color:var(--gold); flex-shrink:0; font-size:0.7rem; margin-top:3px; }
        .plan-cta { width:100%; font-size:0.82rem; font-weight:500; letter-spacing:0.25em; text-transform:uppercase; padding:0.9rem 1.5rem; cursor:pointer; border:1px solid rgba(184,147,63,0.4); background:transparent; color:var(--cream-dark); transition:all 0.3s; font-family:'Cormorant Garamond',serif; }
        .plan-cta:hover { background:rgba(184,147,63,0.15); border-color:var(--gold); color:var(--gold-light); }
        .pricing-card.featured .plan-cta { background:var(--gold); border-color:var(--gold); color:var(--navy-deep); font-weight:700; }
        .pricing-card.featured .plan-cta:hover { background:var(--gold-light); }
        .pricing-cancel-note { margin-top:2rem; font-size:0.9rem; color:rgba(245,240,232,0.35); }
        .coming-soon { background:var(--cream-warm); padding:6rem 4rem; text-align:center; }
        .coming-soon-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; max-width:900px; margin:3rem auto 0; }
        .coming-card { padding:2rem; border:1px solid var(--cream-dark); background:var(--white); text-align:left; }
        .coming-tag { font-size:0.62rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold); margin-bottom:0.8rem; }
        .coming-title { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:600; color:var(--navy); margin-bottom:0.6rem; }
        .coming-desc { font-size:0.95rem; font-weight:300; color:var(--text-muted); line-height:1.7; }
        .cancel-promise { background:var(--navy); padding:4rem; text-align:center; }
        .cancel-promise-title { font-family:'Playfair Display',serif; font-size:1.6rem; color:var(--cream); margin-bottom:0.8rem; font-style:italic; }
        .cancel-promise-body { font-size:1.1rem; font-weight:300; color:rgba(245,240,232,0.55); line-height:1.8; }
        .cancel-promise-body strong { color:var(--gold-light); font-weight:400; }
        footer { background:var(--navy-deep); border-top:1px solid rgba(184,147,63,0.2); padding:4rem 4rem 2rem; }
        .footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3rem; padding-bottom:3rem; border-bottom:1px solid rgba(184,147,63,0.15); }
        .footer-brand-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; color:var(--cream); letter-spacing:0.08em; margin-bottom:0.3rem; }
        .footer-brand-tagline { font-size:0.7rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold-light); margin-bottom:1rem; display:block; }
        .footer-brand-desc { font-size:0.92rem; font-weight:300; color:rgba(245,240,232,0.4); line-height:1.8; }
        .footer-col-title { font-size:0.68rem; font-weight:500; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold-light); margin-bottom:1.2rem; }
        .footer-links { list-style:none; display:flex; flex-direction:column; gap:0.6rem; }
        .footer-links a { font-size:0.92rem; font-weight:300; color:rgba(245,240,232,0.45); text-decoration:none; transition:color 0.3s; }
        .footer-links a:hover { color:var(--cream); }
        .footer-bottom { display:flex; justify-content:space-between; align-items:center; }
        .footer-legal { font-size:0.75rem; color:rgba(245,240,232,0.25); }
        .footer-legal a { color:rgba(245,240,232,0.4); text-decoration:none; }
        .modal-overlay { position:fixed; inset:0; background:rgba(8,20,42,0.92); z-index:1000; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.4s; backdrop-filter:blur(8px); }
        .modal-overlay.open { opacity:1; pointer-events:all; }
        .modal { background:var(--cream); max-width:480px; width:90%; padding:3rem; position:relative; transform:translateY(20px); transition:transform 0.4s; }
        .modal-overlay.open .modal { transform:translateY(0); }
        .modal-close { position:absolute; top:1rem; right:1.2rem; background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted); }
        .modal-title { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:var(--navy); margin-bottom:0.4rem; }
        .modal-sub { font-size:0.85rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:1.5rem; }
        .modal-form { display:flex; flex-direction:column; gap:1rem; }
        .form-field { display:flex; flex-direction:column; gap:0.35rem; }
        .form-field label { font-size:0.72rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-muted); }
        .form-field input,.form-field select { font-family:'Cormorant Garamond',serif; font-size:1rem; padding:0.75rem 1rem; border:1px solid var(--cream-dark); background:var(--white); color:var(--navy); outline:none; transition:border-color 0.3s; }
        .form-field input:focus,.form-field select:focus { border-color:var(--navy-light); }
        .modal-submit { font-family:'Cormorant Garamond',serif; font-size:0.85rem; font-weight:600; letter-spacing:0.25em; text-transform:uppercase; padding:1rem; background:var(--navy); color:var(--cream); border:none; cursor:pointer; transition:background 0.3s; margin-top:0.5rem; }
        .modal-submit:hover { background:var(--navy-light); }
        .modal-disclaimer { margin-top:1rem; font-size:0.8rem; color:var(--text-muted); text-align:center; line-height:1.6; }
        .fade-in { opacity:0; transform:translateY(20px); transition:opacity 0.8s,transform 0.8s; }
        .fade-in.visible { opacity:1; transform:translateY(0); }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <span className="nav-logo-text">WATCHOUT</span>
          <span className="nav-logo-sub">Market Intelligence</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#coming">Coming Soon</a></li>
          <li><a href="#" className="nav-cta" onClick={(e)=>{e.preventDefault();(document.getElementById('modalOverlay') as HTMLElement).classList.add('open')}}>Get Early Access</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-circle" style={{width:'700px',height:'700px'}}></div>
        <div className="hero-bg-circle" style={{width:'560px',height:'560px'}}></div>
        <div className="hero-bg-circle" style={{width:'420px',height:'420px',opacity:0.07}}></div>
        <div className="hero-marks" id="heroMarks"></div>
        <div className="hero-scanline"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">The Intelligent Watch Market</p>
          <h1 className="hero-title">Know the <em>true value</em><br/>of every watch.</h1>
          <p className="hero-title-sub">Before you buy. Before you sell. Before anyone else does.</p>
          <div className="hero-divider"></div>
          <p className="hero-desc">WatchOut tracks real-time prices across every major marketplace, alerts you the moment your target watch moves, and gives you the market intelligence that was once reserved for dealers.</p>
          <div className="hero-actions">
            <a href="#" className="btn-primary" onClick={(e)=>{e.preventDefault();(document.getElementById('modalOverlay') as HTMLElement).classList.add('open')}}>Start Free Trial</a>
            <a href="#features" className="btn-secondary">See How It Works</a>
          </div>
        </div>
        <div className="hero-ticker"><div className="ticker-track" id="ticker"></div></div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {[['180K+','Listings Tracked'],['60 min','Update Frequency'],['1,200+','Models in Database'],['$22B','Market Monitored']].map(([n,l])=>(
          <div className="stat-item" key={l}><div className="stat-number">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      {/* FEATURE: PRICE TRACKING */}
      <section id="features" style={{background:'var(--white)'}}>
        <div className="feature-tracking">
          <div>
            <p className="section-eyebrow fade-in">Live Price Intelligence</p>
            <h2 className="section-title fade-in">Market prices,<br/><em>updated every hour.</em></h2>
            <div className="gold-rule fade-in"></div>
            <p className="section-body fade-in">Most watch buyers make decisions on stale data. WatchOut pulls live pricing from every major marketplace — Chrono24, eBay, Hodinkee, and more — every 60 minutes, so you always know exactly where the market stands.</p>
            <p className="section-body fade-in" style={{marginTop:'1rem',fontStyle:'italic',color:'var(--navy-light)'}}>Set a target price. Get an alert the moment it hits. Never miss the right moment to buy or sell again.</p>
          </div>
          <div className="feature-tracking-visual fade-in">
            <div className="chart-header">
              <div><div className="chart-watch-name">Rolex Submariner</div><div className="chart-watch-ref">Ref. 126610LN · 41mm</div></div>
              <div style={{textAlign:'right'}}><div className="chart-price-current">$14,250</div><div className="chart-price-change">▲ +$320 this week</div></div>
            </div>
            <div className="chart-svg-wrap">
              <svg viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8933f" stopOpacity="0.5"/><stop offset="100%" stopColor="#b8933f" stopOpacity="0"/></linearGradient></defs>
                <line stroke="rgba(184,147,63,0.1)" strokeWidth="1" x1="0" y1="35" x2="400" y2="35"/>
                <line stroke="rgba(184,147,63,0.1)" strokeWidth="1" x1="0" y1="70" x2="400" y2="70"/>
                <line stroke="rgba(184,147,63,0.1)" strokeWidth="1" x1="0" y1="105" x2="400" y2="105"/>
                <path fill="url(#chartGrad)" opacity="0.3" d="M0,100 C40,95 80,80 120,85 C160,90 200,60 250,50 C290,42 330,55 370,38 L400,35 L400,140 L0,140 Z"/>
                <path fill="none" stroke="#b8933f" strokeWidth="2" strokeLinejoin="round" d="M0,100 C40,95 80,80 120,85 C160,90 200,60 250,50 C290,42 330,55 370,38 L400,35"/>
                {[[0,100],[120,85],[250,50],[400,35]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="4" fill="#d4aa5a" stroke="#08142a" strokeWidth="2"/>)}
              </svg>
            </div>
            <div className="chart-labels"><span>6 months ago</span><span>4 months</span><span>2 months</span><span>Today</span></div>
            <div className="alert-rows">
              <div className="alert-row"><span className="alert-row-label">Alert: Price drops below $13,500</span><span className="alert-badge watch">Watching</span></div>
              <div className="alert-row"><span className="alert-row-label">Patek Philippe 5711 · below $52,000</span><span className="alert-badge">Active</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE: WATCHLISTS */}
      <section className="feature-watchlist" id="watchlists">
        <div className="feature-watchlist-inner">
          <div className="watchlist-card fade-in">
            <div className="watchlist-header"><div className="watchlist-title">My Collection Targets</div><div className="watchlist-count">4 Watches</div></div>
            {[
              {name:'Rolex Submariner Date',ref:'126610LN',price:'$14,250',change:'+2.3%',up:true},
              {name:'Patek Philippe Nautilus',ref:'5711/1A-010',price:'$51,800',change:'-1.1%',up:false},
              {name:'AP Royal Oak',ref:'15500ST.OO.1220ST',price:'$36,400',change:'+0.8%',up:true},
              {name:'Omega Speedmaster Pro',ref:'310.30.42.50.01.001',price:'$6,100',change:'+4.2%',up:true},
            ].map(w=>(
              <div className="watch-row" key={w.ref}>
                <div className="watch-row-icon">⌚</div>
                <div><div className="watch-row-name">{w.name}</div><div className="watch-row-ref">{w.ref}</div></div>
                <div className="watch-row-price">{w.price}</div>
                <div className={`watch-row-change ${w.up?'up':'down'}`}>{w.change}</div>
              </div>
            ))}
            <div className="watchlist-footer">
              <span className="watchlist-updated">Last updated 14 min ago</span>
              <span className="watchlist-pulse"><span className="pulse-dot"></span>Live</span>
            </div>
          </div>
          <div>
            <p className="section-eyebrow fade-in" style={{color:'var(--gold-light)'}}>Personal Watchlists</p>
            <h2 className="section-title fade-in" style={{color:'var(--cream)'}}>Track the watches<br/><em style={{color:'var(--gold-pale)'}}>that matter to you.</em></h2>
            <div className="gold-rule fade-in" style={{background:'var(--gold-light)'}}></div>
            <p className="section-body fade-in" style={{color:'rgba(245,240,232,0.6)'}}>Build unlimited personal watchlists by model, brand, or reference number. Follow the exact watches you want, see their price history at a glance, and get notified the instant something changes.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how">
        <p className="section-eyebrow">Simple by Design</p>
        <h2 className="section-title" style={{margin:'0 auto',maxWidth:'500px'}}>How <em>WatchOut</em> works</h2>
        <div className="gold-rule" style={{margin:'1.2rem auto 3rem'}}></div>
        <div className="steps-grid">
          {[
            ['01','Create Your Account','Sign up in under two minutes. Choose your plan. No credit card required for your first 14 days.'],
            ['02','Build Your Watchlist','Search by brand, model, or reference number. Organize by collection, wish list, or resale target.'],
            ['03','Set Price Alerts','Define your target price. WatchOut scans every major marketplace every hour and alerts you instantly.'],
            ['04','Make Informed Moves','Buy with confidence. Sell at the right time. The market does not wait — and now, neither do you.'],
          ].map(([n,t,d])=>(
            <div className="step-item" key={n}><div className="step-number">{n}</div><div className="step-title">{t}</div><p className="step-desc">{d}</p></div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <p className="section-eyebrow" style={{color:'var(--gold-light)'}}>Simple, Transparent Pricing</p>
        <h2 className="section-title" style={{color:'var(--cream)'}}>Intelligence that pays<br/><em style={{color:'var(--gold-pale)'}}>for itself.</em></h2>
        <div className="gold-rule" style={{margin:'1rem auto 1.2rem'}}></div>
        <p className="section-body" style={{color:'rgba(245,240,232,0.6)',margin:'0 auto 4rem',textAlign:'center'}}>No hidden fees. No lock-in contracts. Cancel any time with one click.</p>
        <div className="pricing-grid">
          <div className="pricing-card fade-in">
            <div className="plan-name">Personal</div><div className="plan-desc">For collectors &amp; enthusiasts</div>
            <div className="plan-price"><span className="plan-price-dollar">$</span><span className="plan-price-amount">19</span><span className="plan-price-period">.99 / mo</span></div>
            <div className="plan-users">Up to 2 users per account</div>
            <ul className="plan-features">{['Unlimited personal watchlists','Hourly price updates','Unlimited price alerts','Full price history','Brand & model monitoring','14-day free trial'].map(f=><li key={f}>{f}</li>)}</ul>
            <button className="plan-cta" onClick={()=>(document.getElementById('modalOverlay') as HTMLElement).classList.add('open')}>Start Free Trial</button>
          </div>
          <div className="pricing-card featured fade-in">
            <div className="featured-badge">Most Popular</div>
            <div className="plan-name">Corporate</div><div className="plan-desc">For dealers &amp; small teams</div>
            <div className="plan-price"><span className="plan-price-dollar">$</span><span className="plan-price-amount">79</span><span className="plan-price-period">.99 / mo</span></div>
            <div className="plan-users">Up to 10 users per account</div>
            <ul className="plan-features">{['Everything in Personal','Team-shared watchlists','Dealer-grade market reports','API access','Priority support','Custom segment tracking'].map(f=><li key={f}>{f}</li>)}</ul>
            <button className="plan-cta" onClick={()=>(document.getElementById('modalOverlay') as HTMLElement).classList.add('open')}>Start Free Trial</button>
          </div>
          <div className="pricing-card fade-in">
            <div className="plan-name">Enterprise</div><div className="plan-desc">For large organizations</div>
            <div className="plan-price"><span className="plan-price-dollar">$</span><span className="plan-price-amount">299</span><span className="plan-price-period">+ / mo</span></div>
            <div className="plan-users">Unlimited users</div>
            <ul className="plan-features">{['Everything in Corporate','Dedicated account manager','Custom integrations','White-label reporting','SLA-backed uptime','Annual billing discount'].map(f=><li key={f}>{f}</li>)}</ul>
            <button className="plan-cta" onClick={()=>(document.getElementById('modalOverlay') as HTMLElement).classList.add('open')}>Contact Sales</button>
          </div>
        </div>
        <p className="pricing-cancel-note"><strong style={{color:'rgba(245,240,232,0.6)'}}>Cancel any time in one click.</strong> No phone calls. No forms. No guilt.</p>
      </section>

      {/* COMING SOON */}
      <section className="coming-soon" id="coming">
        <p className="section-eyebrow">On the Horizon</p>
        <h2 className="section-title">What&apos;s <em>coming next.</em></h2>
        <div className="gold-rule" style={{margin:'1rem auto'}}></div>
        <div className="coming-soon-grid">
          {[
            ['In Development','AI Photo Identification','Photograph any watch and instantly receive full model details, market value, and comparable listings. No name required.'],
            ['Beta Soon','Peer-to-Peer Marketplace','Buy and sell directly with other collectors. AI-assisted valuations. WatchOut acts as the trusted middleman.'],
            ['Planned','Jewelry & Sneaker Markets','The same intelligent price tracking engine — expanded to fine jewelry and limited-edition sneakers.'],
          ].map(([tag,title,desc])=>(
            <div className="coming-card fade-in" key={title}><div className="coming-tag">{tag}</div><div className="coming-title">{title}</div><p className="coming-desc">{desc}</p></div>
          ))}
        </div>
      </section>

      {/* CANCEL PROMISE */}
      <section className="cancel-promise">
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{fontSize:'2rem',marginBottom:'1rem',opacity:0.6}}>🔓</div>
          <h3 className="cancel-promise-title">Our cancellation promise.</h3>
          <p className="cancel-promise-body">We built WatchOut to earn your loyalty every month — not trap you into it.<br/><strong>Cancel in one click, any time, no questions asked.</strong><br/>Your account closes at end of your billing period. We will export all your watchlists on the way out.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">WATCHOUT</div>
            <span className="footer-brand-tagline">Market Intelligence</span>
            <p className="footer-brand-desc">Real-time watch market intelligence for collectors, dealers, and investors.</p>
          </div>
          {[['Product',['Price Tracking','Watchlists','Alerts','Market Reports']],['Company',['About','Pricing','Blog','Contact']],['Legal',['Privacy Policy','Terms of Service','Cancel Membership']]].map(([title,links])=>(
            <div key={title as string}><div className="footer-col-title">{title}</div><ul className="footer-links">{(links as string[]).map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="footer-legal">© 2026 WatchOut Market Intelligence. All rights reserved.</p>
          <p className="footer-legal"><a href="#">Privacy</a> &nbsp;·&nbsp; <a href="#">Terms</a> &nbsp;·&nbsp; <a href="#">Cancel Anytime</a></p>
        </div>
      </footer>

      {/* MODAL */}
      <div className="modal-overlay" id="modalOverlay" onClick={(e)=>{if(e.target===e.currentTarget)(e.currentTarget as HTMLElement).classList.remove('open')}}>
        <div className="modal">
          <button className="modal-close" onClick={()=>(document.getElementById('modalOverlay') as HTMLElement).classList.remove('open')}>×</button>
          <div className="modal-sub">Early Access</div>
          <h2 className="modal-title">Join WatchOut</h2>
          <div className="modal-form">
            <div className="form-field"><label>Full Name</label><input type="text" placeholder="James Whitmore"/></div>
            <div className="form-field"><label>Email Address</label><input type="email" placeholder="james@example.com"/></div>
            <div className="form-field"><label>Plan</label><select><option>Personal — $19.99 / month</option><option>Corporate — $79.99 / month</option><option>Enterprise — Contact Sales</option></select></div>
            <button className="modal-submit">Reserve My Spot →</button>
          </div>
          <p className="modal-disclaimer">14-day free trial. No credit card required. Cancel any time in one click.</p>
        </div>
      </div>
    </>
  );
}