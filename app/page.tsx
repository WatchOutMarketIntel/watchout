'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // ── WATCH DATA ──
    const WATCHES = [
      { brand: 'Rolex', name: 'Submariner Date', ref: '126610LN', price: 14250, change: 2.3, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Rolex_Submariner_Professional.JPG/300px-Rolex_Submariner_Professional.JPG', fb: '🖤' },
      { brand: 'Patek Philippe', name: 'Nautilus', ref: '5711/1A-010', price: 51800, change: -1.1, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Patek_Philippe_Nautilus_5711-1A.jpg/300px-Patek_Philippe_Nautilus_5711-1A.jpg', fb: '🤍' },
      { brand: 'Audemars Piguet', name: 'Royal Oak 41mm', ref: '15500ST', price: 36400, change: 0.8, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Audemars_Piguet_Royal_Oak_15300ST.jpg/300px-Audemars_Piguet_Royal_Oak_15300ST.jpg', fb: '🩶' },
      { brand: 'Rolex', name: 'Daytona', ref: '116500LN', price: 28900, change: -0.6, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Rolex_Daytona_ref_116520.jpg/300px-Rolex_Daytona_ref_116520.jpg', fb: '⬜' },
      { brand: 'Omega', name: 'Speedmaster Pro', ref: '310.30.42.50', price: 6100, change: 4.2, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Omega_Speedmaster_Professional_%22Moonwatch%22.jpg/300px-Omega_Speedmaster_Professional_%22Moonwatch%22.jpg', fb: '⬛' },
      { brand: 'Tudor', name: 'Black Bay 58', ref: 'M79030N', price: 3800, change: 3.1, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tudor_Black_Bay_58_Navy_Blue.jpg/300px-Tudor_Black_Bay_58_Navy_Blue.jpg', fb: '🔵' },
      { brand: 'IWC', name: 'Pilot Chrono', ref: 'IW377709', price: 7200, change: 1.5, img: '', fb: '🟫' },
      { brand: 'Cartier', name: 'Santos Large', ref: 'WSSA0018', price: 8600, change: 0.3, img: '', fb: '🟨' },
      { brand: 'Rolex', name: 'GMT-Master II', ref: '126710BLNR', price: 17400, change: 1.8, img: '', fb: '🔵' },
      { brand: 'A. Lange', name: 'Saxonia Thin', ref: '211.026', price: 22500, change: -0.5, img: '', fb: '🤍' },
      { brand: 'Vacheron', name: 'Overseas', ref: '4500V', price: 28000, change: 0.4, img: '', fb: '🟦' },
      { brand: 'Hublot', name: 'Big Bang Unico', ref: '441.NX.1171', price: 12100, change: -2.0, img: '', fb: '⬛' },
    ];

    const fmt = (p: number) => '$' + p.toLocaleString();
    const fmtChg = (c: number) => (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c).toFixed(1) + '%';

    // ── TAB SYSTEM ──
    const switchTab = (name: string) => {
      document.querySelectorAll('.wo-page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      const page = document.getElementById('page-' + name);
      const tab = document.getElementById('tab-' + name);
      if (page) page.classList.add('active');
      if (tab) tab.classList.add('active');
      window.scrollTo(0, 0);
    };
    (window as any).switchTab = switchTab;

    // ── 3D WINDER ──
    const scene = document.getElementById('winderScene');
    if (!scene) return;
    const N = 6;
    const winderWatches = WATCHES.slice(0, N);
    let winderAngle = 0;
    let winderPaused = false;

    winderWatches.forEach((w, i) => {
      const node = document.createElement('div');
      node.className = 'wcard';
      node.id = `wc${i}`;
      const imgHtml = w.img
        ? `<img class="wcard-img" src="${w.img}" alt="${w.brand} ${w.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"/><div class="wcard-fallback" style="display:none">${w.fb}</div>`
        : `<div class="wcard-fallback" style="display:flex">${w.fb}</div>`;
      node.innerHTML = `<div class="wcard-inner">${imgHtml}<div class="wcard-info"><div class="wcard-brand">${w.brand}</div><div class="wcard-name">${w.name}</div><div class="wcard-row"><span class="wcard-price">${fmt(w.price)}</span><span class="wcard-chg ${w.change >= 0 ? 'up' : 'down'}">${fmtChg(w.change)}</span></div></div></div>`;
      node.addEventListener('click', () => { winderAngle = -(2 * Math.PI / N) * i; });
      scene.appendChild(node);
    });

    const layoutWinder = () => {
      const wrap = document.querySelector('.winder-wrap') as HTMLElement;
      if (!wrap) return;
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      const rX = W * 0.32;
      const rY = H * 0.12;
      const cardW = Math.min(130, W * 0.26);

      const cards = winderWatches.map((w, i) => {
        const theta = (2 * Math.PI / N) * i + winderAngle;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        const depth = (cosT + 1) / 2;
        return { i, x: sinT * rX, y: sinT * rY, depth };
      });

      cards.sort((a, b) => a.depth - b.depth);

      cards.forEach((c, renderOrder) => {
        const node = document.getElementById(`wc${c.i}`);
        if (!node) return;
        const isFront = c.depth > 0.85;
        const isBack = c.depth <= 0.25;

        if (isBack) {
          node.style.cssText = `position:absolute;opacity:0;pointer-events:none;z-index:${renderOrder};width:${cardW}px;`;
          return;
        }

        const scale = isFront ? 1 : 0.72;
        const opacity = isFront ? 1 : 0.45;
        const filter = isFront ? 'none' : 'brightness(0.55)';
        const left = W / 2 + c.x - (cardW * scale) / 2;
        const top = H / 2 + c.y - cardW * 0.75 * scale;

        node.style.cssText = `position:absolute;left:${left}px;top:${top}px;width:${cardW}px;transform:scale(${scale});transform-origin:top center;opacity:${opacity};filter:${filter};z-index:${renderOrder};`;

        if (isFront) {
          node.classList.add('front');
          const wcName = document.getElementById('wcName');
          if (wcName) wcName.textContent = winderWatches[c.i].name;
        } else {
          node.classList.remove('front');
        }
      });
    };

    const animateWinder = () => {
      if (!winderPaused) winderAngle += 0.004;
      layoutWinder();
      requestAnimationFrame(animateWinder);
    };
    requestAnimationFrame(animateWinder);
    window.addEventListener('resize', layoutWinder);

    const winderWrap = document.querySelector('.winder-wrap');
    if (winderWrap) {
      winderWrap.addEventListener('mouseenter', () => winderPaused = true);
      winderWrap.addEventListener('mouseleave', () => winderPaused = false);
    }

    // ── TICKERS ──
    const buildTicker = (id: string, data: typeof WATCHES) => {
      const el = document.getElementById(id);
      if (!el) return;
      [...data, ...data, ...data].forEach(w => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.innerHTML = `<span class="t-s">${w.brand.toUpperCase()}</span><span class="t-p">${fmt(w.price)}</span><span class="${w.change >= 0 ? 'up' : 'down'}">${fmtChg(w.change)}</span>`;
        el.appendChild(item);
      });
    };
    buildTicker('homeTicker', WATCHES);

    const buildDashTicker = (id: string, data: typeof WATCHES) => {
      const el = document.getElementById(id);
      if (!el) return;
      [...data, ...data, ...data].forEach(w => {
        const item = document.createElement('span');
        item.className = 'dt-item';
        item.innerHTML = `<span style="font-weight:500;color:rgba(232,224,208,0.55)">${w.name}</span><span style="color:#c9a84c">${fmt(w.price)}</span><span class="${w.change >= 0 ? 'up' : 'down'}">${fmtChg(w.change)}</span>`;
        el.appendChild(item);
      });
    };
    buildDashTicker('dashTicker', WATCHES.slice(0, 6));

    // ── MARKET TABLE ──
    const buildMarket = (filter: string) => {
      const tbody = document.getElementById('mktBody');
      if (!tbody) return;
      const data = filter === 'all' ? WATCHES : WATCHES.filter(w => w.brand === filter);
      tbody.innerHTML = data.map((w, i) => `
        <tr>
          <td style="color:rgba(232,224,208,0.3);font-size:0.75rem">${i + 1}</td>
          <td><div class="mkt-watch-name">${w.name}</div><div class="mkt-brand">${w.brand} · ${w.ref}</div></td>
          <td class="mkt-price">${fmt(w.price)}</td>
          <td><span class="${w.change >= 0 ? 'badge-up' : 'badge-dn'}">${fmtChg(w.change)}</span></td>
          <td style="color:rgba(232,224,208,0.3);font-size:0.72rem">${Math.floor(Math.random() * 200 + 20)} listings</td>
          <td><button class="alert-btn" onclick="openModal()">+ Alert</button></td>
        </tr>`).join('');
    };
    buildMarket('all');
    (window as any).filterMkt = (btn: HTMLElement, brand: string) => {
      document.querySelectorAll('.mkt-filter').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      buildMarket(brand);
    };

    // ── WATCHLISTS ──
    const myWatchlist = [WATCHES[0], WATCHES[1], WATCHES[2], WATCHES[4]];
    const grid = document.getElementById('wlGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="wl-card">
          <div class="wl-card-head"><div class="wl-card-title">My Collection Targets</div><div class="wl-card-count">${myWatchlist.length} Watches</div></div>
          ${myWatchlist.map(w => `
            <div class="wl-row">
              <div class="wl-thumb">${w.img ? `<img src="${w.img}" alt="${w.name}" onerror="this.parentElement.innerHTML='${w.fb}'">` : w.fb}</div>
              <div class="wl-info"><div class="wl-name">${w.name}</div><div class="wl-ref">${w.brand} · ${w.ref}</div></div>
              <div><div class="wl-price">${fmt(w.price)}</div><div class="wl-chg ${w.change >= 0 ? 'up' : 'down'}">${fmtChg(w.change)}</div></div>
            </div>`).join('')}
          <div class="wl-live"><span class="live-dot"></span>Updated just now</div>
        </div>`;
    }

    // ── ALERTS ──
    let activeAlerts = [
      { watch: 'Rolex Submariner', target: 'Below $13,500', type: 'Email' },
      { watch: 'Patek Philippe Nautilus', target: 'Below $48,000', type: 'SMS' },
    ];
    let currentAltType = 'email';

    const renderAlerts = () => {
      const list = document.getElementById('alertsList');
      if (!list) return;
      if (activeAlerts.length === 0) {
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">No active alerts</div><p class="empty-desc">Set your first alert above.</p></div>`;
        return;
      }
      list.innerHTML = activeAlerts.map((a, i) => `
        <div class="alert-card">
          <div class="alert-card-icon">🔔</div>
          <div class="alert-card-info"><div class="alert-card-watch">${a.watch}</div><div class="alert-card-detail">${a.target} · via ${a.type}</div></div>
          <span class="alert-card-status">Watching</span>
          <button class="alert-card-del" onclick="window.deleteAlert(${i})">✕</button>
        </div>`).join('');
    };
    renderAlerts();

    (window as any).deleteAlert = (i: number) => { activeAlerts.splice(i, 1); renderAlerts(); };
    (window as any).addAlert = () => {
      const w = (document.getElementById('al-watch') as HTMLInputElement)?.value.trim();
      const p = (document.getElementById('al-price') as HTMLInputElement)?.value.trim();
      if (!w || !p) { alert('Please enter a watch name and target price.'); return; }
      activeAlerts.push({ watch: w, target: `Below ${p}`, type: currentAltType === 'email' ? 'Email' : currentAltType === 'sms' ? 'SMS' : 'Email+SMS' });
      renderAlerts();
      (document.getElementById('al-watch') as HTMLInputElement).value = '';
      (document.getElementById('al-price') as HTMLInputElement).value = '';
    };
    (window as any).setAltType = (t: string) => {
      currentAltType = t;
      ['e', 's', 'b'].forEach(k => {
        const map: Record<string, string> = { e: 'email', s: 'sms', b: 'both' };
        document.getElementById(`alt-${k}`)?.classList.toggle('on', map[k] === t);
      });
    };

    // ── MODAL ──
    (window as any).openModal = (type?: string) => {
      const eye = document.getElementById('mEye');
      const h = document.getElementById('mH');
      const sel = document.getElementById('planSel') as HTMLSelectElement;
      if (type === 'free') {
        if (eye) eye.textContent = 'Free Account';
        if (h) h.textContent = 'Get Free Access';
        if (sel) sel.value = 'free';
      } else {
        if (eye) eye.textContent = 'Early Access';
        if (h) h.textContent = 'Join WatchOut';
        if (sel) sel.value = 'personal';
      }
      document.getElementById('overlay')?.classList.add('show');
    };
    (window as any).closeModal = () => document.getElementById('overlay')?.classList.remove('show');
    (window as any).setNotify = (m: string) => {
      ['e', 's', 'b'].forEach(k => {
        const map: Record<string, string> = { e: 'email', s: 'sms', b: 'both' };
        document.getElementById(`nb-${k}`)?.classList.toggle('on', map[k] === m);
      });
    };

    // ── CANCEL ──
    (window as any).confirmCancel = () => {
      if (confirm('Cancel your WatchOut membership?\n\nYour account stays active until end of billing period. We\'ll export all your data.')) {
        alert('Membership cancelled. Check your email for your data export. Thank you for using WatchOut.');
      }
    };

    // ── SCROLL FADE ──
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade').forEach(el => obs.observe(el));

  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#030e1a;--bg2:#050f1c;--bg3:#071624;--bg4:#0a1e30;--bg5:#0d2540;
          --border:rgba(255,255,255,0.07);--border2:rgba(201,168,76,0.3);
          --gold:#c9a84c;--gold2:#deba6a;--gold3:#f0d48a;
          --cream:#e8e0d0;--cream2:rgba(232,224,208,0.55);--cream3:rgba(232,224,208,0.28);
          --green:#3dba7e;--red:#e05858;
        }
        html{scroll-behavior:smooth;}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--cream);overflow-x:hidden;}
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@300;400;500&display=swap');

        /* NAV */
        .topnav{position:fixed;top:0;left:0;right:0;z-index:300;height:56px;background:rgba(3,14,26,0.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 clamp(1rem,3vw,2.5rem);gap:clamp(0.5rem,2vw,1.5rem);}
        .logo{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:var(--cream);letter-spacing:0.06em;text-decoration:none;flex-shrink:0;margin-right:clamp(0.5rem,2vw,1.5rem);}
        .logo em{color:var(--gold);font-style:italic;}
        .nav-tabs{display:flex;align-items:stretch;gap:0;flex:1;height:100%;overflow-x:auto;scrollbar-width:none;}
        .nav-tabs::-webkit-scrollbar{display:none;}
        .nav-tab{display:flex;align-items:center;font-size:0.72rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:var(--cream3);padding:0 clamp(0.7rem,2vw,1.2rem);border:none;background:transparent;cursor:pointer;transition:color 0.2s;white-space:nowrap;border-bottom:2px solid transparent;text-decoration:none;}
        .nav-tab:hover{color:var(--cream2);}
        .nav-tab.active{color:var(--gold2);border-bottom-color:var(--gold);}
        .tab-icon{margin-right:0.4rem;font-size:12px;}
        .nav-r{display:flex;align-items:center;gap:0.5rem;margin-left:auto;flex-shrink:0;}
        .btn-sm{font-size:0.68rem;font-weight:400;letter-spacing:0.08em;color:var(--cream2);padding:0.38rem 0.8rem;border:1px solid var(--border);background:transparent;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;white-space:nowrap;}
        .btn-sm:hover{border-color:var(--border2);color:var(--cream);}
        .btn-sm-gold{font-size:0.68rem;font-weight:500;letter-spacing:0.08em;color:var(--bg);padding:0.38rem 0.9rem;background:var(--gold);border:1px solid var(--gold);cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;white-space:nowrap;}
        .btn-sm-gold:hover{background:var(--gold2);}

        /* PAGES */
        .wo-page{display:none;}
        .wo-page.active{display:block;}

        /* HERO */
        .hero{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px clamp(1rem,4vw,2.5rem) 0;position:relative;overflow:hidden;text-align:center;background:var(--bg);}
        .hero::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 100% 60% at 50% 30%,rgba(8,26,50,0.9) 0%,transparent 70%);}
        .hero-eye{font-size:0.6rem;letter-spacing:0.5em;color:var(--gold);text-transform:uppercase;margin-bottom:0.9rem;position:relative;opacity:0;animation:up 0.7s 0.1s forwards;}
        .hero-h{font-family:'Playfair Display',serif;font-size:clamp(2rem,6vw,4.5rem);font-weight:700;line-height:1.06;color:var(--cream);letter-spacing:-0.01em;margin-bottom:0.8rem;position:relative;opacity:0;animation:up 0.7s 0.22s forwards;}
        .hero-h em{font-style:italic;color:var(--gold2);}
        .hero-sub{font-size:clamp(0.85rem,2vw,1rem);font-weight:300;color:var(--cream2);max-width:400px;line-height:1.7;margin:0 auto 0.8rem;position:relative;opacity:0;animation:up 0.7s 0.32s forwards;}
        .beta-pill{display:inline-flex;align-items:center;gap:0.4rem;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,168,76,0.25);padding:0.28rem 0.75rem;margin-bottom:1.5rem;background:rgba(201,168,76,0.05);opacity:0;animation:up 0.7s 0.42s forwards;position:relative;}
        .bdot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 2s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        /* WINDER */
        .winder-wrap{width:min(500px,90vw);height:min(340px,60vw);position:relative;margin:0 auto 1.5rem;opacity:0;animation:up 0.9s 0.5s forwards;}
        .winder-scene{width:100%;height:100%;position:relative;}
        .deco-ring{position:absolute;border-radius:50%;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%);border:1px solid rgba(201,168,76,0.07);}
        .wcard{position:absolute;cursor:pointer;}
        .wcard-inner{background:rgba(5,15,28,0.95);border:1px solid rgba(201,168,76,0.12);border-radius:12px;overflow:hidden;}
        .wcard.front .wcard-inner{border-color:var(--gold);box-shadow:0 4px 28px rgba(201,168,76,0.18);}
        .wcard-img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:var(--bg4);}
        .wcard-fallback{width:100%;aspect-ratio:1;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:2rem;}
        .wcard-info{padding:0.55rem 0.7rem 0.7rem;}
        .wcard-brand{font-size:0.5rem;letter-spacing:0.3em;color:var(--gold);text-transform:uppercase;margin-bottom:0.1rem;}
        .wcard-name{font-family:'Playfair Display',serif;font-size:clamp(0.72rem,1.8vw,0.82rem);font-weight:500;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:0.3rem;}
        .wcard-row{display:flex;align-items:center;justify-content:space-between;}
        .wcard-price{font-size:0.75rem;font-weight:500;color:var(--gold2);}
        .wcard-chg{font-size:0.65rem;}
        .up{color:#3dba7e;}.down{color:#e05858;}
        .wc{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:0;}
        .wc-label{font-size:0.52rem;letter-spacing:0.35em;color:var(--gold);text-transform:uppercase;margin-bottom:0.2rem;}
        .wc-name{font-family:'Playfair Display',serif;font-size:clamp(0.85rem,2vw,1rem);color:var(--cream);font-weight:500;}

        /* HERO ACTIONS */
        .hero-actions{display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;margin-bottom:2rem;position:relative;opacity:0;animation:up 0.7s 0.65s forwards;}
        .btn-cta{font-size:0.78rem;font-weight:500;letter-spacing:0.08em;padding:0.75rem 1.7rem;background:var(--gold);color:var(--bg);border:none;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;}
        .btn-cta:hover{background:var(--gold2);transform:translateY(-1px);}
        .btn-outline{font-size:0.78rem;font-weight:400;letter-spacing:0.08em;padding:0.75rem 1.7rem;background:transparent;color:var(--cream2);border:1px solid var(--border);cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;}
        .btn-outline:hover{border-color:var(--border2);color:var(--cream);}

        /* FEATURES */
        .features{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);width:100%;opacity:0;animation:up 0.7s 0.8s forwards;position:relative;}
        .feat{background:var(--bg);padding:clamp(1rem,2.5vw,1.6rem) clamp(0.8rem,2vw,1.3rem);text-align:center;transition:background 0.2s;}
        .feat:hover{background:var(--bg3);}
        .feat-icon{width:30px;height:30px;border-radius:50%;background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 0.6rem;font-size:13px;}
        .feat-t{font-family:'Playfair Display',serif;font-size:clamp(0.75rem,2vw,0.85rem);font-weight:500;color:var(--cream);margin-bottom:0.25rem;}
        .feat-d{font-size:clamp(0.68rem,1.5vw,0.75rem);font-weight:300;color:var(--cream3);line-height:1.6;}

        /* TICKER */
        .ticker-bar{border-top:1px solid var(--border);background:var(--bg2);padding:0.45rem 0;overflow:hidden;position:relative;}
        .ticker-label{position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;align-items:center;padding:0 0.8rem;background:linear-gradient(90deg,var(--bg2) 70%,transparent);font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);white-space:nowrap;}
        .ticker-track{display:flex;animation:tick 55s linear infinite;white-space:nowrap;padding-left:110px;}
        .ticker-item{display:inline-flex;align-items:center;gap:0.4rem;padding:0 1.6rem;font-size:0.68rem;color:var(--cream3);border-right:1px solid var(--border);letter-spacing:0.04em;}
        .t-s{font-weight:500;color:var(--cream2);}.t-p{color:var(--gold);}
        @keyframes tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        /* PAGE WRAP */
        .page-wrap{padding:clamp(1.5rem,3vw,2.5rem) clamp(1rem,3vw,2.5rem);min-height:calc(100vh - 56px);margin-top:56px;}
        .page-head{margin-bottom:1.8rem;}
        .page-eye{font-size:0.58rem;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);margin-bottom:0.5rem;}
        .page-h{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3.5vw,2rem);font-weight:700;color:var(--cream);margin-bottom:0.3rem;}
        .page-h em{font-style:italic;color:var(--gold2);}
        .rule{width:32px;height:1px;background:var(--gold);margin:0.7rem 0 0;}

        /* MARKET */
        .mkt-filters{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.5rem;}
        .mkt-filter{font-size:0.68rem;letter-spacing:0.1em;padding:0.4rem 0.9rem;background:transparent;border:1px solid var(--border);color:var(--cream3);cursor:pointer;transition:all 0.2s;}
        .mkt-filter:hover,.mkt-filter.on{border-color:var(--gold);color:var(--gold2);background:rgba(201,168,76,0.07);}
        .mkt-table{width:100%;border-collapse:collapse;border:1px solid var(--border);}
        .mkt-table thead tr{background:var(--bg3);border-bottom:1px solid var(--border2);}
        .mkt-table th{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);font-weight:400;padding:0.7rem 1rem;text-align:left;white-space:nowrap;}
        .mkt-table td{padding:0.75rem 1rem;border-bottom:1px solid var(--border);font-size:0.8rem;vertical-align:middle;}
        .mkt-table tr:last-child td{border-bottom:none;}
        .mkt-table tr:hover td{background:rgba(10,30,48,0.5);}
        .mkt-watch-name{font-family:'Playfair Display',serif;font-size:0.82rem;font-weight:500;color:var(--cream);}
        .mkt-brand{font-size:0.6rem;color:var(--cream3);letter-spacing:0.08em;margin-top:1px;}
        .mkt-price{font-weight:500;color:var(--gold2);}
        .badge-up{display:inline-block;background:rgba(61,186,126,0.1);color:#3dba7e;border:1px solid rgba(61,186,126,0.2);font-size:0.6rem;padding:0.18rem 0.5rem;}
        .badge-dn{display:inline-block;background:rgba(224,88,88,0.1);color:#e05858;border:1px solid rgba(224,88,88,0.2);font-size:0.6rem;padding:0.18rem 0.5rem;}
        .alert-btn{font-size:0.65rem;padding:0.32rem 0.7rem;background:transparent;border:1px solid var(--border);color:var(--cream3);cursor:pointer;transition:all 0.2s;white-space:nowrap;}
        .alert-btn:hover{border-color:var(--gold);color:var(--gold);}

        /* WATCHLISTS */
        .wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr));gap:1rem;}
        .wl-card{background:var(--bg3);border:1px solid var(--border);padding:1.2rem;}
        .wl-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.8rem;border-bottom:1px solid var(--border);}
        .wl-card-title{font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:500;color:var(--cream);}
        .wl-card-count{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);}
        .wl-row{display:flex;align-items:center;gap:0.8rem;padding:0.6rem 0;border-bottom:1px solid var(--border);}
        .wl-row:last-of-type{border-bottom:none;}
        .wl-thumb{width:40px;height:40px;border-radius:8px;background:var(--bg4);border:1px solid rgba(201,168,76,0.15);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem;}
        .wl-thumb img{width:100%;height:100%;object-fit:cover;}
        .wl-info{flex:1;min-width:0;}
        .wl-name{font-family:'Playfair Display',serif;font-size:0.78rem;font-weight:500;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .wl-ref{font-size:0.6rem;color:var(--cream3);}
        .wl-price{font-size:0.78rem;font-weight:500;color:var(--gold2);text-align:right;}
        .wl-chg{font-size:0.65rem;text-align:right;}
        .wl-live{display:flex;align-items:center;gap:0.4rem;font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#3dba7e;margin-top:0.8rem;padding-top:0.7rem;border-top:1px solid var(--border);}
        .live-dot{width:5px;height:5px;border-radius:50%;background:#3dba7e;animation:blink 2s infinite;}
        .dash-ticker{background:var(--bg3);border:1px solid var(--border2);padding:0.8rem 1rem;margin-bottom:1.2rem;}
        .dt-label{font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:0.5rem;display:flex;align-items:center;gap:0.4rem;}
        .dt-inner{overflow:hidden;}
        .dt-track{display:flex;animation:tick 35s linear infinite;white-space:nowrap;}
        .dt-item{display:inline-flex;align-items:center;gap:0.4rem;padding:0 1.2rem;font-size:0.7rem;color:var(--cream3);border-right:1px solid var(--border);}
        .add-wl-btn{display:flex;align-items:center;gap:0.5rem;font-size:0.72rem;letter-spacing:0.1em;padding:0.6rem 1rem;background:transparent;border:1px dashed rgba(201,168,76,0.2);color:var(--cream3);cursor:pointer;transition:all 0.2s;margin-bottom:1rem;}
        .add-wl-btn:hover{border-color:var(--gold);color:var(--gold);}
        .empty-state{padding:3rem 2rem;text-align:center;border:1px dashed rgba(201,168,76,0.15);}
        .empty-icon{font-size:2rem;margin-bottom:0.8rem;opacity:0.4;}
        .empty-title{font-family:'Playfair Display',serif;font-size:1rem;color:var(--cream2);margin-bottom:0.4rem;}
        .empty-desc{font-size:0.78rem;color:var(--cream3);line-height:1.6;}

        /* ALERTS PAGE */
        .alert-form-box{background:var(--bg3);border:1px solid var(--border2);padding:clamp(1.2rem,3vw,2rem);max-width:560px;margin-bottom:2rem;}
        .afb-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:500;color:var(--cream);margin-bottom:1.2rem;}
        .afb-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.7rem;margin-bottom:0.7rem;}
        .afb-label{font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--cream3);display:block;margin-bottom:0.3rem;}
        .afb-input{width:100%;font-family:'Inter',sans-serif;font-size:0.82rem;padding:0.55rem 0.75rem;background:rgba(3,14,26,0.8);border:1px solid var(--border);color:var(--cream);outline:none;transition:border-color 0.2s;}
        .afb-input::placeholder{color:var(--cream3);}
        .afb-input:focus{border-color:var(--gold);}
        .afb-types{display:flex;gap:0.4rem;margin-bottom:0.7rem;}
        .afb-type{flex:1;font-size:0.68rem;letter-spacing:0.08em;padding:0.5rem;background:transparent;border:1px solid var(--border);color:var(--cream3);cursor:pointer;transition:all 0.2s;}
        .afb-type:hover,.afb-type.on{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,0.07);}
        .afb-submit{width:100%;font-size:0.75rem;font-weight:500;letter-spacing:0.1em;padding:0.7rem;background:var(--gold);color:var(--bg);border:none;cursor:pointer;transition:background 0.2s;}
        .afb-submit:hover{background:var(--gold2);}
        .alerts-list{display:flex;flex-direction:column;gap:0.6rem;}
        .alert-card{background:var(--bg3);border:1px solid var(--border);padding:0.9rem 1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
        .alert-card-icon{font-size:1rem;flex-shrink:0;}
        .alert-card-info{flex:1;min-width:160px;}
        .alert-card-watch{font-family:'Playfair Display',serif;font-size:0.85rem;font-weight:500;color:var(--cream);}
        .alert-card-detail{font-size:0.68rem;color:var(--cream3);margin-top:1px;}
        .alert-card-status{font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;padding:0.22rem 0.6rem;border:1px solid rgba(61,186,126,0.3);color:#3dba7e;background:rgba(61,186,126,0.07);}
        .alert-card-del{background:none;border:none;color:var(--cream3);cursor:pointer;font-size:1rem;transition:color 0.2s;}
        .alert-card-del:hover{color:#e05858;}

        /* ACCOUNT */
        .account-grid{display:grid;grid-template-columns:220px 1fr;gap:1.5rem;align-items:start;}
        .account-sidebar{background:var(--bg3);border:1px solid var(--border);padding:1.5rem;}
        .acct-avatar{width:60px;height:60px;border-radius:50%;background:var(--bg5);border:2px solid rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 0.9rem;}
        .acct-name{font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:500;color:var(--cream);text-align:center;margin-bottom:0.2rem;}
        .acct-plan{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);text-align:center;margin-bottom:1.2rem;}
        .acct-menu{list-style:none;display:flex;flex-direction:column;gap:0.1rem;}
        .acct-menu li a,.acct-menu li button{display:block;width:100%;text-align:left;font-size:0.78rem;color:var(--cream2);padding:0.45rem 0.6rem;background:transparent;border:none;cursor:pointer;transition:all 0.2s;text-decoration:none;}
        .acct-menu li a:hover,.acct-menu li button:hover{color:var(--cream);background:rgba(201,168,76,0.06);}
        .acct-divider{height:1px;background:var(--border);margin:0.7rem 0;}
        .account-main{display:flex;flex-direction:column;gap:1rem;}
        .acct-section{background:var(--bg3);border:1px solid var(--border);padding:1.2rem;}
        .acct-section-title{font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:500;color:var(--cream);margin-bottom:1rem;padding-bottom:0.7rem;border-bottom:1px solid var(--border);}
        .acct-row{display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border);font-size:0.8rem;}
        .acct-row:last-child{border-bottom:none;}
        .acct-row-label{color:var(--cream3);}
        .cancel-link{font-size:0.72rem;color:#e05858;background:none;border:none;cursor:pointer;text-decoration:underline;opacity:0.7;transition:opacity 0.2s;}
        .cancel-link:hover{opacity:1;}

        /* PRICING */
        .pricing-section{padding:clamp(3rem,5vw,5rem) clamp(1rem,4vw,3rem);border-top:1px solid var(--border);background:var(--bg2);}
        .sec-eye{font-size:0.58rem;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);margin-bottom:0.5rem;}
        .sec-h{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3.5vw,2rem);font-weight:700;color:var(--cream);margin-bottom:0.3rem;}
        .sec-h em{font-style:italic;color:var(--gold2);}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:1px;background:var(--border);border:1px solid var(--border);margin-top:2rem;}
        .plan{background:var(--bg);padding:clamp(1rem,2.5vw,1.5rem);position:relative;transition:background 0.2s;}
        .plan:hover{background:var(--bg3);}
        .plan.hot{background:var(--bg3);border-top:2px solid var(--gold);}
        .plan-badge{font-size:0.52rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:0.6rem;}
        .plan-name{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:var(--cream);margin-bottom:0.12rem;}
        .plan-sub2{font-size:0.68rem;color:var(--cream3);margin-bottom:0.8rem;}
        .plan-pr{display:flex;align-items:baseline;gap:0.1rem;margin-bottom:0.15rem;}
        .p-d{font-size:0.8rem;color:var(--gold);align-self:flex-start;margin-top:0.25rem;}
        .p-n{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:var(--gold2);line-height:1;}
        .p-p{font-size:0.68rem;color:var(--cream3);}
        .plan-seats2{font-size:0.58rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold);margin-bottom:0.8rem;padding-bottom:0.7rem;border-bottom:1px solid var(--border);}
        .plan-list{list-style:none;margin-bottom:1.2rem;display:flex;flex-direction:column;gap:0.4rem;}
        .plan-list li{font-size:0.75rem;color:rgba(232,224,208,0.55);display:flex;align-items:flex-start;gap:0.35rem;line-height:1.4;}
        .plan-list li::before{content:'—';color:var(--gold);flex-shrink:0;font-size:0.58rem;margin-top:2px;}
        .plan-list li.dim{color:var(--cream3);}
        .plan-list li.dim::before{color:var(--cream3);}
        .plan-btn{width:100%;font-size:0.68rem;font-weight:500;letter-spacing:0.1em;padding:0.6rem;cursor:pointer;transition:all 0.2s;border:1px solid var(--border);background:transparent;color:var(--cream3);}
        .plan-btn:hover{border-color:var(--gold);color:var(--gold);}
        .plan.hot .plan-btn{background:var(--gold);border-color:var(--gold);color:var(--bg);}
        .plan.hot .plan-btn:hover{background:var(--gold2);}
        .plan-adnote{font-size:0.58rem;color:var(--cream3);text-align:center;margin-top:0.4rem;}
        .cancel-bar{background:var(--bg3);border-top:1px solid var(--border);padding:clamp(1.2rem,2.5vw,1.8rem) clamp(1rem,4vw,3rem);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
        .cancel-text{font-family:'Playfair Display',serif;font-size:clamp(0.85rem,2vw,1rem);font-style:italic;color:var(--cream);}
        .cancel-sub{font-size:0.72rem;color:var(--cream3);margin-top:0.2rem;}
        .cancel-sub strong{color:var(--gold);font-weight:400;}

        /* FOOTER */
        footer{background:var(--bg2);border-top:1px solid var(--border);padding:2rem clamp(1rem,4vw,3rem) 1.2rem;}
        .footer-grid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:1.8rem;margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border);}
        .f-brand{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--cream);letter-spacing:0.08em;margin-bottom:0.15rem;}
        .f-tag{font-size:0.52rem;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:0.6rem;}
        .f-desc{font-size:0.75rem;font-weight:300;color:var(--cream3);line-height:1.7;}
        .f-col-t{font-size:0.52rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--gold);margin-bottom:0.7rem;}
        .f-links{list-style:none;display:flex;flex-direction:column;gap:0.38rem;}
        .f-links a{font-size:0.75rem;color:rgba(232,224,208,0.32);text-decoration:none;transition:color 0.2s;}
        .f-links a:hover{color:var(--cream);}
        .footer-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
        .f-legal{font-size:0.65rem;color:rgba(232,224,208,0.18);}
        .f-legal a{color:rgba(232,224,208,0.28);text-decoration:none;}

        /* MODAL */
        .overlay{position:fixed;inset:0;background:rgba(3,14,26,0.95);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity 0.3s;backdrop-filter:blur(14px);}
        .overlay.show{opacity:1;pointer-events:all;}
        .modal{background:var(--bg3);border:1px solid var(--border2);width:100%;max-width:390px;padding:clamp(1.4rem,4vw,2rem);position:relative;transform:translateY(10px);transition:transform 0.3s;}
        .overlay.show .modal{transform:translateY(0);}
        .mx{position:absolute;top:0.8rem;right:0.9rem;background:none;border:none;color:var(--cream3);font-size:1.2rem;cursor:pointer;padding:0.2rem 0.4rem;transition:color 0.2s;}
        .mx:hover{color:var(--cream);}
        .m-eye2{font-size:0.56rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--gold);margin-bottom:0.4rem;}
        .m-h2{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:var(--cream);margin-bottom:1.2rem;}
        .fg{display:flex;flex-direction:column;gap:0.26rem;margin-bottom:0.75rem;}
        .fg label{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--cream3);}
        .fg input,.fg select{font-family:'Inter',sans-serif;font-size:0.82rem;padding:0.55rem 0.75rem;background:rgba(3,14,26,0.85);border:1px solid var(--border);color:var(--cream);outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
        .fg input::placeholder{color:var(--cream3);}
        .fg input:focus,.fg select:focus{border-color:var(--gold);}
        .fg select option{background:var(--bg3);}
        .n-row{display:flex;gap:0.35rem;margin-bottom:0.75rem;}
        .n-btn{flex:1;font-size:0.65rem;letter-spacing:0.08em;padding:0.45rem;background:transparent;border:1px solid var(--border);color:var(--cream3);cursor:pointer;transition:all 0.2s;}
        .n-btn:hover,.n-btn.on{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,0.07);}
        .m-submit{width:100%;font-size:0.75rem;font-weight:500;letter-spacing:0.1em;padding:0.8rem;background:var(--gold);color:var(--bg);border:none;cursor:pointer;transition:background 0.2s;margin-top:0.15rem;}
        .m-submit:hover{background:var(--gold2);}
        .m-note{margin-top:0.6rem;font-size:0.65rem;color:var(--cream3);text-align:center;line-height:1.5;}

        /* RESPONSIVE */
        @media(max-width:760px){
          .footer-grid{grid-template-columns:1fr 1fr;}
          .cancel-bar{flex-direction:column;align-items:flex-start;}
          .account-grid{grid-template-columns:1fr;}
          .afb-grid{grid-template-columns:1fr;}
          .mkt-table th:nth-child(5),.mkt-table td:nth-child(5){display:none;}
        }
        @media(max-width:520px){
          .features{grid-template-columns:1fr;}
          .footer-grid{grid-template-columns:1fr;}
          .hero-actions{flex-direction:column;align-items:center;width:100%;}
          .btn-cta,.btn-outline{width:100%;max-width:280px;text-align:center;}
          .nav-tab{font-size:0;padding:0 0.8rem;}
          .tab-icon{font-size:15px;margin:0;}
        }

        /* ANIMATIONS */
        @keyframes up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade{opacity:0;transform:translateY(10px);transition:opacity 0.55s,transform 0.55s;}
        .fade.in{opacity:1;transform:translateY(0);}
      `}</style>

      {/* ── TOP NAV ── */}
      <nav className="topnav">
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); (window as any).switchTab('home'); }}>WATCH<em>OUT</em></a>
        <div className="nav-tabs">
          {[['home','🏠','Home'],['market','📈','Market'],['watchlists','📋','Watchlists'],['alerts','🔔','Alerts'],['account','👤','Account']].map(([id, icon, label]) => (
            <button key={id} className={`nav-tab${id === 'home' ? ' active' : ''}`} id={`tab-${id}`} onClick={() => (window as any).switchTab(id)}>
              <span className="tab-icon">{icon}</span>{label}
            </button>
          ))}
        </div>
        <div className="nav-r">
          <a href="#" className="btn-sm" onClick={(e) => { e.preventDefault(); (window as any).openModal('free'); }}>Sign In</a>
          <a href="#" className="btn-sm-gold" onClick={(e) => { e.preventDefault(); (window as any).openModal(); }}>Get Started</a>
        </div>
      </nav>

      {/* ── HOME PAGE ── */}
      <div className="wo-page active" id="page-home">
        <section className="hero">
          <p className="hero-eye">Watch Market Intelligence</p>
          <h1 className="hero-h">The market moves.<br /><em>Stay ahead of it.</em></h1>
          <p className="hero-sub">Live prices. Hourly updates. Instant alerts.</p>
          <div className="beta-pill"><span className="bdot"></span>Now in Beta — Early Access Open</div>
          <div className="winder-wrap">
            <div className="winder-scene" id="winderScene">
              <div className="deco-ring" style={{ width: '85%', height: '85%' }}></div>
              <div className="deco-ring" style={{ width: '96%', height: '96%' }}></div>
              <div className="wc" id="wc">
                <div className="wc-label">Now Showing</div>
                <div className="wc-name" id="wcName">—</div>
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#" className="btn-cta" onClick={(e) => { e.preventDefault(); (window as any).openModal(); }}>Start Free — No Card Needed</a>
            <a href="#" className="btn-outline" onClick={(e) => { e.preventDefault(); (window as any).switchTab('market'); }}>Explore the Market</a>
          </div>
          <div className="features">
            <div className="feat"><div className="feat-icon">📈</div><div className="feat-t">Hourly Price Updates</div><p className="feat-d">Every major marketplace scanned every 60 minutes.</p></div>
            <div className="feat"><div className="feat-icon">🔔</div><div className="feat-t">SMS &amp; Email Alerts</div><p className="feat-d">Set a target. Get notified the moment it hits.</p></div>
            <div className="feat"><div className="feat-icon">📋</div><div className="feat-t">Personal Watchlists</div><p className="feat-d">Track any watch by brand, model, or reference.</p></div>
          </div>
        </section>
        <div className="ticker-bar">
          <div className="ticker-label">Most Active</div>
          <div className="ticker-track" id="homeTicker"></div>
        </div>
        <section className="pricing-section">
          <p className="sec-eye">Pricing</p>
          <h2 className="sec-h">Start free. <em>Upgrade when ready.</em></h2>
          <div className="rule"></div>
          <div className="plans">
            {[
              { badge:'Always Free', name:'Free', sub:'Get started today', price:'0', per:'/ mo', seats:'1 user', features:['Basic price tracking','3 watchlist items','Daily updates','1 email alert'], dim:['Ads shown','No price history'], hot:false },
              { badge:'★ Most Popular', name:'Personal', sub:'Collectors & enthusiasts', price:'19', per:'.99 / mo', seats:'Up to 2 users', features:['Unlimited watchlists','Hourly updates','SMS + email alerts','Full price history','Zero ads','14-day free trial'], dim:[], hot:true },
              { badge:'For Teams', name:'Corporate', sub:'Dealers & small teams', price:'79', per:'.99 / mo', seats:'Up to 10 users', features:['Everything in Personal','Team watchlists','Market reports','API access','Zero ads','Priority support'], dim:[], hot:false },
              { badge:'Enterprise', name:'Enterprise', sub:'Large organizations', price:'299', per:'+ / mo', seats:'Unlimited users', features:['Everything in Corporate','Dedicated manager','Custom integrations','White-label reports','SLA guarantee','Zero ads'], dim:[], hot:false },
            ].map(p => (
              <div key={p.name} className={`plan${p.hot ? ' hot' : ''}`}>
                <span className="plan-badge">{p.badge}</span>
                <div className="plan-name">{p.name}</div>
                <div className="plan-sub2">{p.sub}</div>
                <div className="plan-pr"><span className="p-d">$</span><span className="p-n">{p.price}</span><span className="p-p">{p.per}</span></div>
                <div className="plan-seats2">{p.seats}</div>
                <ul className="plan-list">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                  {p.dim.map(f => <li key={f} className="dim">{f}</li>)}
                </ul>
                <button className="plan-btn" onClick={() => (window as any).openModal(p.name === 'Free' ? 'free' : undefined)}>{p.name === 'Enterprise' ? 'Contact Sales' : p.name === 'Free' ? 'Get Free Access' : 'Start Free Trial'}</button>
                {p.name === 'Free' && <p className="plan-adnote">Supported by non-intrusive ads</p>}
              </div>
            ))}
          </div>
        </section>
        <div className="cancel-bar">
          <div>
            <div className="cancel-text">Cancel any time. One click. No questions asked.</div>
            <div className="cancel-sub">Your data is yours. <strong>We export everything on the way out.</strong></div>
          </div>
          <a href="#" className="btn-cta" onClick={(e) => { e.preventDefault(); (window as any).openModal(); }}>Start Free Trial →</a>
        </div>
        <footer>
          <div className="footer-grid">
            <div><div className="f-brand">WATCHOUT</div><span className="f-tag">Market Intelligence · Beta</span><p className="f-desc">Real-time watch market intelligence for collectors, dealers, and investors. Currently in early access.</p></div>
            <div><div className="f-col-t">Product</div><ul className="f-links"><li><a href="#">Market</a></li><li><a href="#">Alerts</a></li><li><a href="#">Watchlists</a></li><li><a href="#">Pricing</a></li></ul></div>
            <div><div className="f-col-t">Company</div><ul className="f-links"><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Blog</a></li></ul></div>
            <div><div className="f-col-t">Legal</div><ul className="f-links"><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Cancel Membership</a></li><li><a href="#">Photo Credits</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <p className="f-legal">© 2026 WatchOut Market Intelligence. Beta. Images via Wikimedia Commons (CC BY-SA).</p>
            <p className="f-legal"><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cancel Anytime</a></p>
          </div>
        </footer>
      </div>

      {/* ── MARKET PAGE ── */}
      <div className="wo-page" id="page-market">
        <div className="page-wrap">
          <div className="page-head"><p className="page-eye">Live Data</p><h2 className="page-h">Market <em>Explorer</em></h2><div className="rule"></div></div>
          <div className="mkt-filters">
            {[['all','All Brands'],['Rolex','Rolex'],['Patek Philippe','Patek Philippe'],['Audemars Piguet','Audemars Piguet'],['Omega','Omega'],['Tudor','Tudor'],['IWC','IWC']].map(([val, label]) => (
              <button key={val} className={`mkt-filter${val === 'all' ? ' on' : ''}`} onClick={(e) => (window as any).filterMkt(e.currentTarget, val)}>{label}</button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="mkt-table"><thead><tr><th>#</th><th>Watch</th><th>Price</th><th>7-Day</th><th>Volume</th><th>Alert</th></tr></thead><tbody id="mktBody"></tbody></table>
          </div>
        </div>
      </div>

      {/* ── WATCHLISTS PAGE ── */}
      <div className="wo-page" id="page-watchlists">
        <div className="page-wrap">
          <div className="page-head"><p className="page-eye">My Collection</p><h2 className="page-h">Your <em>Watchlists</em></h2><div className="rule"></div></div>
          <div className="dash-ticker"><div className="dt-label"><span className="live-dot"></span>Your Watches — Live Feed</div><div className="dt-inner"><div className="dt-track" id="dashTicker"></div></div></div>
          <button className="add-wl-btn" onClick={() => (window as any).openModal()}>+ Create New Watchlist</button>
          <div className="wl-grid" id="wlGrid"></div>
        </div>
      </div>

      {/* ── ALERTS PAGE ── */}
      <div className="wo-page" id="page-alerts">
        <div className="page-wrap">
          <div className="page-head"><p className="page-eye">Price Alerts</p><h2 className="page-h">Never miss <em>the right price.</em></h2><div className="rule"></div></div>
          <div className="alert-form-box">
            <div className="afb-title">Set a New Alert</div>
            <div className="afb-grid">
              <div><label className="afb-label">Watch Name or Ref #</label><input className="afb-input" id="al-watch" type="text" placeholder="e.g. Submariner 126610LN" /></div>
              <div><label className="afb-label">Alert When Price Drops Below</label><input className="afb-input" id="al-price" type="text" placeholder="e.g. $13,500" /></div>
              <div><label className="afb-label">Email Address</label><input className="afb-input" id="al-email" type="email" placeholder="you@example.com" /></div>
              <div><label className="afb-label">Phone (SMS — optional)</label><input className="afb-input" id="al-phone" type="tel" placeholder="+1 (555) 000-0000" /></div>
            </div>
            <div className="afb-types">
              <button className="afb-type on" id="alt-e" onClick={() => (window as any).setAltType('email')}>📧 Email</button>
              <button className="afb-type" id="alt-s" onClick={() => (window as any).setAltType('sms')}>📱 SMS</button>
              <button className="afb-type" id="alt-b" onClick={() => (window as any).setAltType('both')}>Both</button>
            </div>
            <button className="afb-submit" onClick={() => (window as any).addAlert()}>Set Alert →</button>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', color: 'var(--cream)', marginBottom: '0.8rem', fontWeight: 500 }}>Active Alerts</h3>
          <div className="alerts-list" id="alertsList"></div>
        </div>
      </div>

      {/* ── ACCOUNT PAGE ── */}
      <div className="wo-page" id="page-account">
        <div className="page-wrap">
          <div className="page-head"><p className="page-eye">Profile</p><h2 className="page-h">Your <em>Account</em></h2><div className="rule"></div></div>
          <div className="account-grid">
            <div className="account-sidebar">
              <div className="acct-avatar">👤</div>
              <div className="acct-name">Early Access User</div>
              <div className="acct-plan">Beta · Personal Plan</div>
              <ul className="acct-menu">
                <li><a href="#">Profile Settings</a></li>
                <li><a href="#">Notification Preferences</a></li>
                <li><a href="#">Billing &amp; Plan</a></li>
                <div className="acct-divider"></div>
                <li><a href="#">Help &amp; Support</a></li>
                <li><button className="cancel-link" onClick={() => (window as any).confirmCancel()}>Cancel Membership</button></li>
              </ul>
            </div>
            <div className="account-main">
              <div className="acct-section">
                <div className="acct-section-title">📋 Plan Details</div>
                <div className="acct-row"><span className="acct-row-label">Current Plan</span><span style={{ color: 'var(--gold)' }}>Personal — $19.99/mo</span></div>
                <div className="acct-row"><span className="acct-row-label">Users</span><span>1 of 2 used</span></div>
                <div className="acct-row"><span className="acct-row-label">Next Billing</span><span>April 25, 2026</span></div>
                <div className="acct-row"><span className="acct-row-label">Ads</span><span style={{ color: 'var(--green)' }}>None — paid plan</span></div>
                <div className="acct-row"><span className="acct-row-label">Cancel</span><button className="cancel-link" onClick={() => (window as any).confirmCancel()}>Cancel in one click →</button></div>
              </div>
              <div className="acct-section">
                <div className="acct-section-title">🔔 Alert Preferences</div>
                <div className="acct-row"><span className="acct-row-label">Email Alerts</span><span style={{ color: 'var(--green)' }}>On</span></div>
                <div className="acct-row"><span className="acct-row-label">SMS Alerts</span><span>Off — add phone number</span></div>
                <div className="acct-row"><span className="acct-row-label">Frequency</span><span>Immediately (hourly scan)</span></div>
              </div>
              <div className="acct-section">
                <div className="acct-section-title">📈 Your Activity</div>
                <div className="acct-row"><span className="acct-row-label">Watchlist Items</span><span>4</span></div>
                <div className="acct-row"><span className="acct-row-label">Active Alerts</span><span>2</span></div>
                <div className="acct-row"><span className="acct-row-label">Member Since</span><span>March 2026</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      <div className="overlay" id="overlay" onClick={(e) => { if (e.target === e.currentTarget) (window as any).closeModal(); }}>
        <div className="modal">
          <button className="mx" onClick={() => (window as any).closeModal()}>×</button>
          <div className="m-eye2" id="mEye">Early Access</div>
          <div className="m-h2" id="mH">Join WatchOut</div>
          <div className="fg"><label>Full Name</label><input type="text" placeholder="Your name" /></div>
          <div className="fg"><label>Email Address</label><input type="email" placeholder="you@example.com" /></div>
          <div className="fg"><label>Phone — SMS alerts (optional)</label><input type="tel" placeholder="+1 (555) 000-0000" /></div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream3)', display: 'block', marginBottom: '0.35rem' }}>Alert Preference</label>
            <div className="n-row">
              <button className="n-btn on" id="nb-e" onClick={() => (window as any).setNotify('email')}>Email</button>
              <button className="n-btn" id="nb-s" onClick={() => (window as any).setNotify('sms')}>SMS</button>
              <button className="n-btn" id="nb-b" onClick={() => (window as any).setNotify('both')}>Both</button>
            </div>
          </div>
          <div className="fg">
            <label>Plan</label>
            <select id="planSel">
              <option value="free">Free — $0 / month</option>
              <option value="personal">Personal — $19.99 / month</option>
              <option value="corporate">Corporate — $79.99 / month</option>
              <option value="enterprise">Enterprise — Contact Sales</option>
            </select>
          </div>
          <button className="m-submit">Reserve My Spot →</button>
          <p className="m-note">14-day free trial on paid plans. No credit card required. Cancel any time.</p>
        </div>
      </div>
    </>
  );
}
