'use client';
import { useEffect } from 'react';
import LiveDial from './LiveDial';
import { nickOf } from './nicknames';

// Inline Lucide-style SVG icons — consistent 1.6 stroke, colored via currentColor.
const _svg = (inner: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const SVG: Record<string, string> = {
  home: _svg('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
  market: _svg('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),
  watchlists: _svg('<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'),
  alerts: _svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
  account: _svg('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  trending: _svg('<path d="M3 17 9 11l4 4 8-8"/><path d="M16 7h5v5"/>'),
  watch: _svg('<circle cx="12" cy="12" r="5.5"/><path d="M12 9.5V12l1.6 1.2"/><path d="M8.6 6.6 8 3.2h8l-.6 3.4"/><path d="M8.6 17.4 8 20.8h8l-.6-3.4"/>'),
  mail: _svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  phone: _svg('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
  lock: _svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
};

// ── SEASONAL "FEATURED WATCH" CAPSULE (config-driven; swap quarterly) ──
// To rotate: edit this object — season label, accent, the featured reference,
// a hero image, and a one-line note. ~2-minute change. Hook for co-marketing.
const FEATURED = {
  season: 'Summer 2026',
  accent: '#A8362B',
  brand: 'Omega',
  model: 'Speedmaster Professional',
  reference: '310.30.42.50.01.001',
  image: '',  // optional override; falls back to live data / SVG if empty
  blurb: 'The Moonwatch — hand-wound, the only chronograph flight-qualified by NASA. A reference point for the whole sports-chronograph market.',
  cta: 'See it on the market',
};

export default function Home() {
  useEffect(() => {
    // ── WATCH DATA (placeholder; replaced by live data from the API below) ──
    const PLACEHOLDER = [
      { brand: 'Rolex', name: 'Submariner Date', ref: '126610LN', price: 14250, change: 2.3, img: '', count: 120 },
      { brand: 'Patek Philippe', name: 'Nautilus', ref: '5711/1A-010', price: 51800, change: -1.1, img: '', count: 40 },
      { brand: 'Audemars Piguet', name: 'Royal Oak 41mm', ref: '15500ST', price: 36400, change: 0.8, img: '', count: 35 },
      { brand: 'Rolex', name: 'Daytona', ref: '116500LN', price: 28900, change: -0.6, img: '', count: 90 },
      { brand: 'Omega', name: 'Speedmaster Pro', ref: '310.30.42.50', price: 6100, change: 4.2, img: '', count: 110 },
      { brand: 'Tudor', name: 'Black Bay 58', ref: 'M79030N', price: 3800, change: 3.1, img: '', count: 75 },
      { brand: 'IWC', name: 'Pilot Chrono', ref: 'IW377709', price: 7200, change: 1.5, img: '', count: 30 },
      { brand: 'Cartier', name: 'Santos Large', ref: 'WSSA0018', price: 8600, change: 0.3, img: '', count: 28 },
      { brand: 'Rolex', name: 'GMT-Master II', ref: '126710BLNR', price: 17400, change: 1.8, img: '', count: 60 },
      { brand: 'Vacheron', name: 'Overseas', ref: '4500V', price: 28000, change: 0.4, img: '', count: 18 },
    ];

    const fmt = (p: number) => '$' + Math.round(p).toLocaleString();
    // Change is a real 24h-window % (or null when there isn't ≥24h of history).
    // Null renders as a neutral "—" rather than a misleading +0.0%.
    const fmtChg = (c: number | null | undefined) =>
      (c == null) ? '—' : (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c).toFixed(1) + '%';
    const chgClass = (c: number | null | undefined) =>
      (c == null) ? 'flat' : (c >= 0 ? 'up' : 'down');

    // Link a watch to its EXACT eBay listing (the one its photo came from). Falls
    // back to a durable category-scoped search only when we have no listing_url
    // yet — that never 404s the way a single ended listing can.
    const ebayUrl = (w: any) => {
      if (w.listing_url) return w.listing_url;
      const q = [w.brand, w.name, w.ref].filter(Boolean).join(' ');
      return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&_sacat=31387`;
    };
    // Small nickname badge markup (empty string when the ref has no nickname).
    const nickBadge = (w: any) => w.nickname ? `<span class="nick">${w.nickname}</span>` : '';
    // The sub-line metadata: Ref · Year · Material (only the parts we have).
    const subMeta = (w: any) => [w.ref, w.year, w.material].filter(Boolean).join(' · ');
    const subMetaBrand = (w: any) => [w.brand, w.ref, w.year, w.material].filter(Boolean).join(' · ');
    // Cards link INTO the watch's detail page; only fall back to the eBay search
    // for placeholder rows that have no id (API down).
    const watchUrl = (w: any) => w.id ? `/w/${w.id}` : ebayUrl(w);

    // Reusable photo markup with the clean SVG fallback (missing OR failed load).
    const photoInner = (w: any, imgCls: string, fbCls: string) => w.img
      ? `<img class="${imgCls}" src="${w.img}" alt="${w.brand} ${w.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><span class="${fbCls}" style="display:none">${SVG.watch}</span>`
      : `<span class="${fbCls}" style="display:flex">${SVG.watch}</span>`;

    // Tiny inline sparkline (oldest→newest). Gain green / loss red; dash when <2 pts.
    const sparkline = (prices?: number[]) => {
      if (!prices || prices.length < 2) return '<span class="spark-empty">—</span>';
      const W = 88, H = 28, pad = 3;
      const min = Math.min(...prices), max = Math.max(...prices);
      const span = max - min || 1;
      const n = prices.length;
      const xy = (p: number, i: number) => {
        const x = pad + (i / (n - 1)) * (W - pad * 2);
        const y = pad + (1 - (p - min) / span) * (H - pad * 2);
        return [x, y] as const;
      };
      const pts = prices.map((p, i) => xy(p, i).map(v => v.toFixed(1)).join(',')).join(' ');
      const [lx, ly] = xy(prices[n - 1], n - 1);
      const color = prices[n - 1] >= prices[0] ? '#3E7D5A' : '#A8362B';
      return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true">`
        + `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.7" fill="${color}"/></svg>`;
    };

    // Everything below renders from whatever watch list it's given (live or placeholder).
    const init = (WATCHES: any[], meta: any = {}) => {
    const ent = meta.ent || { market_cap: null, alerts: true, watchlists: true, ads: false, history_days: null };
    const totalRefs = meta.total || WATCHES.length;
    // A reusable "unlock" CTA that opens the join/upgrade modal.
    const lockCta = (label: string, planName = 'Personal') =>
      `<button class="lock-cta" onclick="openModal()">Unlock with ${planName}</button>`;
    // ── TAB SYSTEM ──
    const switchTab = (name: string) => {
      document.querySelectorAll('.wo-page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('page-' + name)?.classList.add('active');
      document.getElementById('tab-' + name)?.classList.add('active');
      // Market always opens fresh: reset the brand filter to "All" and rebuild,
      // so you never land on a prior scroll/filter state.
      if (name === 'market') {
        document.querySelectorAll('.mkt-filter').forEach((b, i) => b.classList.toggle('on', i === 0));
        buildMarket('all');
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;   // belt-and-suspenders for the reset-to-top
    };
    (window as any).switchTab = switchTab;

    // One representative watch PER BRAND. Within a brand we prefer a watch that
    // actually has a 24h change (a real mover) and, among those, the most liquid
    // — so the home surfaces live movement and variety instead of a wall of "—"
    // or six copies of one reference.
    const oneEachBrand = (() => {
      const ranked = [...WATCHES].sort((a, b) => {
        const ah = a.change == null ? 0 : 1, bh = b.change == null ? 0 : 1;
        if (ah !== bh) return bh - ah;                 // has a 24h change first
        return (b.count || 0) - (a.count || 0);        // then most liquid
      });
      const seen = new Set<string>();
      const out: any[] = [];
      for (const w of ranked) { if (w.brand && !seen.has(w.brand)) { seen.add(w.brand); out.push(w); } }
      return out;
    })();
    // "Most active" = the biggest absolute daily movers, capped at 12. Until price
    // history exists every change is 0, so this is simply one-per-brand by volume;
    // it becomes a true mover ranking once snapshots accumulate.
    const mostActive = oneEachBrand.slice().sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 12);

    // ── TODAY'S MOVERS — seamless horizontal marquee ──
    // Duplicate the set and animate translateX 0 → -50%, so the strip loops with
    // no seam. Purely horizontal, never stops (CSS animation); pauses on hover.
    const moversTrack = document.getElementById('moversTrack');
    if (moversTrack) {
      const movers = oneEachBrand.slice(0, 10);
      const card = (w: any) =>
        `<a class="mv-card" href="${watchUrl(w)}" aria-label="${w.brand} ${w.name} details">`
        + `<div class="mv-photo">${photoInner(w, 'mv-img', 'mv-fb')}</div>`
        + `<div class="mv-info"><div class="mv-brand">${w.brand}</div>`
        + `<div class="mv-name">${w.name}${nickBadge(w)}</div>`
        + `<div class="mv-row"><span class="mv-price">${fmt(w.price)}</span>`
        + `<span class="${chgClass(w.change)}">${fmtChg(w.change)}</span></div></div></a>`;
      // Duplicate the set — the two halves are identical, so translating by -50%
      // lands exactly where it started → a seamless infinite loop.
      moversTrack.innerHTML = movers.length ? [...movers, ...movers].map(card).join('') : '';
    }

    // ── MOST-ACTIVE TICKER ──
    const ticker = document.getElementById('homeTicker');
    if (ticker) {
      [...mostActive, ...mostActive, ...mostActive].forEach(w => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.innerHTML = `<span class="t-s">${w.brand.toUpperCase()}</span><span class="t-p">${fmt(w.price)}</span><span class="${chgClass(w.change)}">${fmtChg(w.change)}</span>`;
        ticker.appendChild(item);
      });
    }
    const dashTicker = document.getElementById('dashTicker');
    if (dashTicker) {
      const six = oneEachBrand.slice(0, 6);
      [...six, ...six, ...six].forEach(w => {
        const item = document.createElement('span');
        item.className = 'dt-item';
        item.innerHTML = `<span class="dt-n">${w.name}</span><span class="dt-p">${fmt(w.price)}</span><span class="${chgClass(w.change)}">${fmtChg(w.change)}</span>`;
        dashTicker.appendChild(item);
      });
    }

    // ── HOME MARKET PREVIEW (a few spacious rows) ──
    const preview = document.getElementById('previewBody');
    if (preview) {
      preview.innerHTML = oneEachBrand.slice(0, 5).map(w => `
        <a class="pv-row" href="${watchUrl(w)}">
          <div class="pv-photo">${photoInner(w, 'pv-img', 'pv-fb')}</div>
          <div class="pv-id"><div class="pv-name">${w.name}${nickBadge(w)}</div><div class="pv-ref">${subMetaBrand(w)}</div></div>
          <div class="pv-price">${fmt(w.price)}</div>
          <div class="pv-chg ${chgClass(w.change)}">${fmtChg(w.change)}</div>
        </a>`).join('');
    }

    // ── HOME SPOTLIGHT (photo-forward cards, red top-rule) ──
    const spot = document.getElementById('spotlightGrid');
    if (spot) {
      spot.innerHTML = oneEachBrand.slice(0, 4).map(w => `
        <a class="spot-card" href="${watchUrl(w)}">
          <div class="spot-photo">${photoInner(w, 'spot-img', 'spot-fb')}</div>
          <div class="spot-body">
            <div class="spot-brand">${w.brand}</div>
            <div class="spot-name">${w.name}</div>
            <div class="spot-ref">${w.nickname || w.ref || '—'}</div>
            <div class="spot-row"><span class="spot-price">${fmt(w.price)}</span><span class="${chgClass(w.change)}">${fmtChg(w.change)}</span></div>
          </div>
        </a>`).join('');
    }

    // ── FEATURED CAPSULE photo (use config image, else best live match, else SVG) ──
    const featPhoto = document.getElementById('featuredPhoto');
    if (featPhoto) {
      const match = WATCHES.find(w => (w.ref && FEATURED.reference && w.ref.replace(/\s/g, '').toLowerCase().includes(FEATURED.reference.replace(/\s/g, '').toLowerCase().slice(0, 6)))
        || (w.brand === FEATURED.brand));
      const fw = { brand: FEATURED.brand, name: FEATURED.model, ref: FEATURED.reference,
                   img: FEATURED.image || (match && match.img) || '' };
      featPhoto.innerHTML = `<a href="${ebayUrl(fw)}" target="_blank" rel="noopener noreferrer" aria-label="${FEATURED.brand} ${FEATURED.model} on eBay">${photoInner(fw, 'feat-img', 'feat-fb')}</a>`;
    }

    // ── MARKET TABLE (Market tab) ──
    const buildMarket = (filter: string) => {
      const tbody = document.getElementById('mktBody');
      if (!tbody) return;
      const data = filter === 'all' ? WATCHES : WATCHES.filter(w => w.brand === filter);
      tbody.innerHTML = data.map((w, i) => `
        <tr>
          <td class="mkt-rank">${i + 1}</td>
          <td>
            <a class="mkt-id" href="${watchUrl(w)}">
              <span class="mkt-photo">${photoInner(w, 'mkt-img', 'mkt-fb')}</span>
              <span><span class="mkt-watch-name">${w.name}${nickBadge(w)}</span><span class="mkt-brand">${subMetaBrand(w)}</span></span>
            </a>
          </td>
          <td class="mkt-price">${fmt(w.price)}</td>
          <td><div class="mkt-trend">${sparkline((w as any).spark)}<span class="${w.change == null ? 'badge-flat' : (w.change >= 0 ? 'badge-up' : 'badge-dn')}">${fmtChg(w.change)}</span></div></td>
          <td class="mkt-vol">${(w as any).count != null ? (w as any).count : '—'} listings</td>
          <td><button class="alert-btn" onclick="openModal()">+ Alert</button></td>
        </tr>`).join('');
      // Locked-rows teaser: when the free tier capped the payload, show how many
      // more references are behind the paywall (only on the unfiltered view).
      const locked = totalRefs - WATCHES.length;
      if (ent.market_cap && filter === 'all' && locked > 0) {
        tbody.innerHTML += `
          <tr class="mkt-lock-row"><td colspan="6">
            <div class="mkt-lock">
              <div class="mkt-lock-t"><span class="lock-ico">${SVG.lock}</span>${locked.toLocaleString()} more references locked</div>
              <div class="mkt-lock-d">Free shows the top ${WATCHES.length} by listing volume. See the full market with Personal.</div>
              ${lockCta('market', 'Personal')}
            </div>
          </td></tr>`;
      }
    };
    buildMarket('all');
    // ── ADS SLOT (free/anonymous only; house upgrade placeholder — no 3rd-party, no PII) ──
    const adSlot = document.getElementById('adSlot');
    if (adSlot) {
      if (ent.ads) {
        adSlot.innerHTML = `<div class="ad-inner"><span class="ad-eye">Advertisement</span>
          <div class="ad-body"><div class="ad-h">Go ad-free with Personal</div>
          <p class="ad-d">Full market, 7-day &amp; 30-day price history, and instant alerts — without ads.</p></div>
          <button class="ad-cta" onclick="openModal()">Upgrade</button></div>`;
        adSlot.style.display = 'block';
      } else {
        adSlot.style.display = 'none';
      }
    }
    // ── ALERTS LOCK (free tier) ──
    const alertsLock = document.getElementById('alertsLock');
    const alertsBox = document.getElementById('alertsBox');
    if (alertsLock && alertsBox) {
      if (!ent.alerts) {
        alertsBox.style.display = 'none';
        alertsLock.style.display = 'flex';
        alertsLock.innerHTML = `<div class="feature-lock">
          <span class="lock-ico-lg">${SVG.lock}</span>
          <div class="feature-lock-t">Price alerts are a Personal feature</div>
          <p class="feature-lock-d">Set a target price or % move and we'll email you the moment it hits. Included with Personal and above.</p>
          ${lockCta('alerts', 'Personal')}</div>`;
      } else {
        alertsLock.style.display = 'none';
        alertsBox.style.display = '';
      }
    }
    (window as any).filterMkt = (btn: HTMLElement, brand: string) => {
      document.querySelectorAll('.mkt-filter').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      buildMarket(brand);
    };

    // ── WATCHLISTS ──
    const myWatchlist = oneEachBrand.slice(0, 4);
    const grid = document.getElementById('wlGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="wl-card">
          <div class="wl-card-head"><div class="wl-card-title">My Collection Targets</div><div class="wl-card-count">${myWatchlist.length} Watches</div></div>
          ${myWatchlist.map(w => `
            <a class="wl-row" href="${watchUrl(w)}">
              <div class="wl-thumb">${photoInner(w, 'wl-img', 'wl-thumb-fb')}</div>
              <div class="wl-info"><div class="wl-name">${w.name}${nickBadge(w)}</div><div class="wl-ref">${subMetaBrand(w)}</div></div>
              <div><div class="wl-price">${fmt(w.price)}</div><div class="wl-chg ${chgClass(w.change)}">${fmtChg(w.change)}</div></div>
            </a>`).join('')}
          <div class="wl-live"><span class="live-dot"></span>Updated hourly</div>
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
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">${SVG.alerts}</div><div class="empty-title">No active alerts</div><p class="empty-desc">Set your first alert above.</p></div>`;
        return;
      }
      list.innerHTML = activeAlerts.map((a, i) => `
        <div class="alert-card">
          <div class="alert-card-icon" aria-hidden="true">${SVG.alerts}</div>
          <div class="alert-card-info"><div class="alert-card-watch">${a.watch}</div><div class="alert-card-detail">${a.target} · via ${a.type}</div></div>
          <span class="alert-card-status">Watching</span>
          <button class="alert-card-del" onclick="window.deleteAlert(${i})" aria-label="Delete alert">✕</button>
        </div>`).join('');
    };
    renderAlerts();
    (window as any).deleteAlert = (i: number) => { activeAlerts.splice(i, 1); renderAlerts(); };
    (window as any).addAlert = () => {
      const w = (document.getElementById('al-watch') as HTMLInputElement)?.value.trim();
      const p = (document.getElementById('al-price') as HTMLInputElement)?.value.trim();
      const email = (document.getElementById('al-email') as HTMLInputElement)?.value.trim();
      if (!w || !p) { alert('Please enter a watch name and target price.'); return; }
      if (!email || !email.includes('@')) { alert('Please enter your email so we can notify you.'); return; }
      const target = Number(p.replace(/[^0-9.]/g, '')) || null;
      // Persist the rule via the API (email-first; SMS deferred). Optimistically
      // show it, and keep it shown even if the network hiccups.
      activeAlerts.push({ watch: w, target: `Below ${p}`, type: 'Email' });
      renderAlerts();
      (document.getElementById('al-watch') as HTMLInputElement).value = '';
      (document.getElementById('al-price') as HTMLInputElement).value = '';
      fetch(`${API}/alerts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ref_query: w, target_price: target, direction: 'below' }),
      }).catch(() => { /* rule still shown locally; will retry on next submit */ });
    };
    (window as any).setAltType = (t: string) => {
      currentAltType = t;
      const map: Record<string, string> = { e: 'email', s: 'sms', b: 'both' };
      ['e', 's', 'b'].forEach(k => document.getElementById(`alt-${k}`)?.classList.toggle('on', map[k] === t));
    };

    // ── MODAL ──
    (window as any).openModal = (type?: string) => {
      const eye = document.getElementById('mEye');
      const h = document.getElementById('mH');
      const sel = document.getElementById('planSel') as HTMLSelectElement;
      if (type === 'free') {
        if (eye) eye.textContent = 'Free account';
        if (h) h.textContent = 'Get free access';
        if (sel) sel.value = 'free';
      } else {
        if (eye) eye.textContent = 'Early access';
        if (h) h.textContent = 'Join WatchOut';
        if (sel) sel.value = 'personal';
      }
      document.getElementById('overlay')?.classList.add('show');
    };
    (window as any).closeModal = () => document.getElementById('overlay')?.classList.remove('show');
    (window as any).setNotify = (m: string) => {
      const map: Record<string, string> = { e: 'email', s: 'sms', b: 'both' };
      ['e', 's', 'b'].forEach(k => document.getElementById(`nb-${k}`)?.classList.toggle('on', map[k] === m));
    };
    (window as any).confirmCancel = () => {
      if (confirm('Cancel your WatchOut membership?\n\nYour account stays active until end of billing period. We\'ll export all your data.')) {
        alert('Membership cancelled. Check your email for your data export. Thank you for using WatchOut.');
      }
    };

    // ── SCROLL FADE ──
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade').forEach(el => obs.observe(el));

    // Deep-link to a tab via ?view=market|watchlists|alerts|account (also lets the
    // gate demo screenshot a specific tab). Preserves any ?tier= preview param.
    const view = new URLSearchParams(window.location.search).get('view');
    if (view && document.getElementById('page-' + view)) switchTab(view);
    }; // end init

    // ── LOAD LIVE DATA ──
    const API = (process.env.NEXT_PUBLIC_API_URL || 'https://watchout-api-production.up.railway.app').replace(/\/+$/, '');
    let cancelled = false;
    const wkey = (b: string, n: string, r: string) => `${b}|${n}|${r || ''}`;
    // Optional ?tier= preview override (only honored by the API when TIER_PREVIEW
    // is on — for pre-auth gate demos). Once real auth is wired this is unused.
    const previewTier = new URLSearchParams(window.location.search).get('tier');
    const tq = (sep: string) => (previewTier ? `${sep}tier=${encodeURIComponent(previewTier)}` : '');
    Promise.all([
      fetch(`${API}/market${tq('?')}`).then(r => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${API}/market/history?points=24${tq('&')}`).then(r => (r.ok ? r.json() : { history: [] })).catch(() => ({ history: [] })),
    ])
      .then(([d, h]: any[]) => {
        if (cancelled) return;
        const sparks: Record<string, number[]> = {};
        (h.history || []).forEach((s: any) => { sparks[wkey(s.brand, s.name, s.ref)] = s.prices || []; });
        const live = (d.watches || []).map((w: any) => ({
          id: w.id,
          brand: w.brand,
          name: w.name,
          ref: w.ref || '',
          nickname: w.nickname || nickOf(w.ref),   // curated CSV nickname wins, else built-in map
          price: Number(w.price) || 0,
          change: w.change == null ? null : Number(w.change),      // 24h window (nullable)
          change7d: w.change_7d == null ? null : Number(w.change_7d),
          count: w.num_listings,
          spark: sparks[wkey(w.brand, w.name, w.ref)] || [],
          img: w.image_url || '',
          listing_url: w.listing_url || '',
          year: w.year || '',
          material: w.material || '',
        }));
        // Entitlements drive the locked states + ads slot; default to "unlocked"
        // so the placeholder path (API down) still shows everything.
        const ent = d.entitlements || { market_cap: null, alerts: true, watchlists: true, ads: false, history_days: null };
        const meta = { ent, total: d.total || live.length, tier: d.tier || 'anonymous' };
        init(live.length ? live : PLACEHOLDER, meta);
      })
      .catch(() => { if (!cancelled) init(PLACEHOLDER); });

    // WatchOut Index headline band — independent of the market fetch; hides
    // itself if there's no index yet so nothing ever looks broken.
    fetch(`${API}/index?points=30`)
      .then(r => (r.ok ? r.json() : null))
      .then(idx => {
        const el = document.getElementById('indexBand');
        if (cancelled || !el || !idx || idx.value == null) return;
        const c = idx.change_24h;
        const cls = c == null ? 'flat' : (c >= 0 ? 'up' : 'down');
        const chg = c == null ? '—' : (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c).toFixed(2) + '%';
        el.innerHTML =
          `<span class="idx-label">WatchOut Index</span>`
          + `<span class="idx-val">${idx.value.toFixed(2)}</span>`
          + `<span class="idx-chg ${cls}">${chg}<span class="idx-win">24h</span></span>`
          + `<span class="idx-spark">${sparkline(idx.series)}</span>`
          + `<span class="idx-meta">${idx.constituents || 0} refs · base 100</span>`;
        el.classList.add('on');
      })
      .catch(() => { /* no index yet — band stays hidden */ });

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --paper:#F3ECDB;   /* page background */
          --surface:#FBF6EA; /* cards/panels */
          --line:#E6DCC6;    /* hairline borders */
          --ink:#16140E;     /* primary text */
          --ink-2:#6A6253;   /* secondary text */
          --ink-3:#A89E8B;   /* tertiary/labels */
          --red:#A8362B;     /* accent + down/loss */
          --gain:#3E7D5A;    /* up/gain */
          --serif:var(--font-serif),Georgia,'Times New Roman',serif;
          --sans:var(--font-sans),system-ui,-apple-system,sans-serif;
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--paper);color:var(--ink);overflow-x:hidden;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;line-height:1.5;}
        a{color:inherit;text-decoration:none;}
        .num{font-variant-numeric:tabular-nums;}
        .up{color:var(--gain);}.down{color:var(--red);}.flat{color:var(--ink-3);}

        /* ── MONETIZATION: locked states, upgrade CTAs, ad slot ── */
        .lock-cta{display:inline-block;font-size:0.78rem;font-weight:600;letter-spacing:0.01em;padding:0.55rem 1.1rem;background:var(--ink);color:var(--paper);border:none;cursor:pointer;transition:background 0.15s;}
        .lock-cta:hover{background:#000;}
        .lock-ico svg{width:14px;height:14px;vertical-align:-2px;margin-right:0.4rem;color:var(--red);}
        .lock-ico-lg svg{width:30px;height:30px;color:var(--red);}
        /* Locked market rows teaser */
        .mkt-lock-row td{padding:0 !important;background:var(--surface);}
        .mkt-lock{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;padding:1.1rem 1rem;border-top:2px solid var(--red);}
        .mkt-lock-t{font-family:var(--serif);font-size:1.05rem;font-weight:500;color:var(--ink);}
        .mkt-lock-d{font-size:0.82rem;color:var(--ink-3);flex:1;min-width:180px;}
        /* Generic feature lock panel (alerts, etc.) */
        .feature-lock{display:flex;flex-direction:column;align-items:flex-start;gap:0.6rem;max-width:600px;background:var(--surface);border:1px solid var(--line);border-top:2px solid var(--red);padding:clamp(1.4rem,4vw,2.2rem);}
        .feature-lock-t{font-family:var(--serif);font-size:1.3rem;font-weight:500;color:var(--ink);}
        .feature-lock-d{font-size:0.9rem;color:var(--ink-2);line-height:1.6;}
        .alerts-lock{margin-bottom:2rem;}
        /* Ad slot — free/anon only; house upgrade, no third-party */
        .ad-slot{padding:0 clamp(1rem,4vw,3rem);}
        .ad-inner{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;max-width:1180px;margin:1.4rem auto 0;padding:0.9rem 1.1rem;background:var(--surface);border:1px dashed var(--ink-3);}
        .ad-eye{font-size:0.56rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-3);}
        .ad-body{flex:1;min-width:180px;}
        .ad-h{font-family:var(--serif);font-size:1rem;font-weight:500;color:var(--ink);}
        .ad-d{font-size:0.8rem;color:var(--ink-3);margin-top:0.1rem;}
        .ad-cta{font-size:0.78rem;font-weight:600;padding:0.5rem 1.1rem;background:var(--ink);color:var(--paper);border:none;cursor:pointer;}
        .ad-cta:hover{background:#000;}
        /* Nickname badge — small, quiet, sits beside the model name */
        .nick{display:inline-block;margin-left:0.5rem;font-family:var(--sans);font-size:0.6rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--red);background:rgba(168,54,43,0.08);border:1px solid rgba(168,54,43,0.25);border-radius:999px;padding:0.08rem 0.42rem;vertical-align:middle;white-space:nowrap;}

        /* NAV */
        .topnav{position:fixed;top:0;left:0;right:0;z-index:300;height:60px;background:rgba(243,236,219,0.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 clamp(1rem,3vw,2.5rem);gap:clamp(0.5rem,2vw,1.5rem);}
        .logo{font-family:var(--serif);font-size:1.4rem;font-weight:600;color:var(--ink);letter-spacing:0.01em;flex-shrink:0;margin-right:clamp(0.5rem,2vw,1.5rem);}
        .logo em{color:var(--red);font-style:normal;}
        .nav-tabs{display:flex;align-items:stretch;gap:0;flex:1;height:100%;overflow-x:auto;scrollbar-width:none;}
        .nav-tabs::-webkit-scrollbar{display:none;}
        .nav-tab{display:flex;align-items:center;font-size:0.82rem;font-weight:500;color:var(--ink-2);padding:0 clamp(0.6rem,1.6vw,1rem);border:none;background:transparent;cursor:pointer;transition:color 0.15s;white-space:nowrap;border-bottom:2px solid transparent;}
        .nav-tab:hover{color:var(--ink);}
        .nav-tab.active{color:var(--ink);border-bottom-color:var(--red);}
        .tab-icon{display:inline-flex;align-items:center;margin-right:0.4rem;}
        .tab-icon svg{width:15px;height:15px;}
        .nav-r{display:flex;align-items:center;gap:0.5rem;margin-left:auto;flex-shrink:0;}
        .btn-sm{font-size:0.8rem;font-weight:500;color:var(--ink);padding:0.4rem 0.95rem;border:1px solid var(--ink);background:transparent;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
        .btn-sm:hover{background:var(--ink);color:var(--paper);}

        /* PAGES */
        .wo-page{display:none;}
        .wo-page.active{display:block;}
        .band{padding:clamp(40px,6vw,52px) clamp(1rem,4vw,3rem);border-bottom:1px solid var(--line);}
        .band-head{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:1.8rem;flex-wrap:wrap;}
        .kicker{font-family:var(--sans);font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.5rem;}
        .band-h{font-family:var(--serif);font-size:clamp(1.5rem,3.4vw,2.1rem);font-weight:500;color:var(--ink);line-height:1.1;}
        .band-link{font-size:0.85rem;font-weight:500;color:var(--ink);border-bottom:1px solid var(--red);padding-bottom:1px;cursor:pointer;white-space:nowrap;}
        .band-cap{font-size:0.8rem;color:var(--ink-3);}

        /* HERO */
        .hero{margin-top:60px;padding:clamp(44px,7vw,84px) clamp(1rem,4vw,3rem);border-bottom:1px solid var(--line);}
        .hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:clamp(1.5rem,5vw,4rem);align-items:center;max-width:1180px;margin:0 auto;}
        .hero-eye{font-size:0.74rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--red);margin-bottom:1rem;}
        .hero-h{font-family:var(--serif);font-size:clamp(2.4rem,6vw,4.2rem);font-weight:600;line-height:1.02;color:var(--ink);letter-spacing:-0.01em;margin-bottom:1.1rem;}
        .hero-sub{font-size:clamp(0.95rem,1.6vw,1.12rem);color:var(--ink-2);max-width:34ch;line-height:1.6;margin-bottom:1.8rem;}
        .hero-cta{display:inline-block;font-size:0.9rem;font-weight:600;letter-spacing:0.01em;padding:0.85rem 1.8rem;background:var(--ink);color:var(--paper);cursor:pointer;transition:background 0.15s;}
        .hero-cta:hover{background:#000;}
        .hero-dial{display:flex;justify-content:center;align-items:center;}
        .hero-dial svg{width:min(360px,80vw);height:auto;}

        /* WATCHOUT INDEX BAND */
        .idx-band{display:none;align-items:center;gap:clamp(0.8rem,2.5vw,1.8rem);flex-wrap:wrap;padding:0.9rem clamp(1rem,4vw,3rem);background:var(--surface);border-bottom:1px solid var(--line);}
        .idx-band.on{display:flex;}
        .idx-label{font-size:0.66rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);}
        .idx-val{font-family:var(--serif);font-size:1.5rem;font-weight:600;color:var(--ink);line-height:1;}
        .idx-chg{font-size:0.85rem;font-weight:600;display:inline-flex;align-items:baseline;gap:0.35rem;}
        .idx-win{font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-3);}
        .idx-spark{display:inline-flex;align-items:center;}
        .idx-spark .spark{width:120px;height:26px;}
        .idx-meta{font-size:0.72rem;color:var(--ink-3);margin-left:auto;}

        /* MOVERS — seamless horizontal marquee */
        .movers-strip{overflow:hidden;position:relative;width:100%;
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);}
        .mv-track{display:flex;gap:1rem;width:max-content;animation:mv-scroll 55s linear infinite;will-change:transform;}
        .movers-strip:hover .mv-track{animation-play-state:paused;}
        @keyframes mv-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .mv-card{display:block;flex:0 0 auto;width:172px;background:var(--surface);border:1px solid var(--line);overflow:hidden;transition:border-color 0.15s;}
        .mv-card:hover{border-color:var(--ink);}
        .mv-photo{width:100%;aspect-ratio:1;background:#fff;}
        .mv-img{width:100%;height:100%;object-fit:cover;display:block;}
        .mv-fb{width:100%;aspect-ratio:1;background:#EFE7D5;display:flex;align-items:center;justify-content:center;}
        .mv-fb svg{width:34%;height:34%;color:var(--ink-3);}
        .mv-info{padding:0.6rem 0.7rem 0.7rem;}
        .mv-brand{font-size:0.56rem;font-weight:600;letter-spacing:0.18em;color:var(--red);text-transform:uppercase;margin-bottom:0.15rem;}
        .mv-name{font-family:var(--serif);font-size:0.95rem;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:0.3rem;}
        .mv-row{display:flex;align-items:center;justify-content:space-between;font-size:0.78rem;}
        .mv-price{font-weight:600;}
        @media(prefers-reduced-motion:reduce){.mv-track{animation:none;}}

        /* MARKET PREVIEW (home) */
        .pv-list{max-width:760px;}
        .pv-row{display:grid;grid-template-columns:48px 1fr auto auto;align-items:center;gap:1rem;padding:0.95rem 0.4rem;border-bottom:1px solid var(--line);transition:background 0.15s;}
        .pv-row:hover{background:var(--surface);}
        .pv-photo{width:48px;height:48px;background:#EFE7D5;overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .pv-img{width:100%;height:100%;object-fit:cover;}
        .pv-fb{width:100%;height:100%;align-items:center;justify-content:center;}
        .pv-fb svg{width:46%;height:46%;color:var(--ink-3);}
        .pv-name{font-family:var(--serif);font-size:1.05rem;font-weight:500;color:var(--ink);}
        .pv-ref{font-size:0.74rem;color:var(--ink-3);margin-top:1px;}
        .pv-price{font-weight:600;font-size:0.95rem;text-align:right;}
        .pv-chg{font-size:0.82rem;text-align:right;min-width:74px;}

        /* SPOTLIGHT */
        .spot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr));gap:1.4rem;}
        .spot-card{display:block;background:var(--surface);border:1px solid var(--line);border-top:2px solid var(--red);transition:transform 0.15s;}
        .spot-card:hover{transform:translateY(-2px);}
        .spot-photo{width:100%;aspect-ratio:4/3;background:#fff;overflow:hidden;}
        .spot-img{width:100%;height:100%;object-fit:cover;display:block;}
        .spot-fb{width:100%;height:100%;align-items:center;justify-content:center;background:#EFE7D5;}
        .spot-fb svg{width:28%;height:28%;color:var(--ink-3);}
        .spot-body{padding:0.9rem 1rem 1.1rem;}
        .spot-brand{font-size:0.58rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.25rem;}
        .spot-name{font-family:var(--serif);font-size:1.15rem;font-weight:500;color:var(--ink);line-height:1.15;}
        .spot-ref{font-size:0.74rem;color:var(--ink-3);margin:0.15rem 0 0.7rem;}
        .spot-row{display:flex;align-items:center;justify-content:space-between;font-size:0.88rem;}
        .spot-price{font-weight:600;}

        /* FEATURED CAPSULE */
        .featured{background:var(--surface);}
        .feat-grid{display:grid;grid-template-columns:0.8fr 1.2fr;gap:clamp(1.5rem,4vw,3rem);align-items:center;max-width:1080px;margin:0 auto;}
        .feat-photo{aspect-ratio:1;background:#fff;border:1px solid var(--line);overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .feat-photo a{display:block;width:100%;height:100%;}
        .feat-img{width:100%;height:100%;object-fit:cover;display:block;}
        .feat-fb{width:100%;height:100%;align-items:center;justify-content:center;background:#EFE7D5;}
        .feat-fb svg{width:30%;height:30%;color:var(--ink-3);}
        .feat-season{display:inline-block;font-size:0.68rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#fff;background:var(--red);padding:0.25rem 0.7rem;margin-bottom:1rem;}
        .feat-brand{font-size:0.72rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:var(--red);margin-bottom:0.3rem;}
        .feat-name{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.3rem);font-weight:500;color:var(--ink);line-height:1.08;}
        .feat-ref{font-size:0.82rem;color:var(--ink-3);margin:0.3rem 0 1rem;}
        .feat-blurb{font-size:0.98rem;color:var(--ink-2);line-height:1.65;max-width:50ch;margin-bottom:1.4rem;}
        .feat-cta{display:inline-block;font-size:0.86rem;font-weight:600;color:var(--ink);border-bottom:1px solid var(--red);padding-bottom:2px;cursor:pointer;}

        /* TICKER */
        .ticker-bar{background:var(--surface);border-bottom:1px solid var(--line);padding:0.6rem 0;overflow:hidden;position:relative;}
        .ticker-label{position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;align-items:center;padding:0 1rem;background:var(--surface);font-size:0.62rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--red);white-space:nowrap;border-right:1px solid var(--line);}
        .ticker-track{display:flex;animation:tick 60s linear infinite;white-space:nowrap;padding-left:130px;}
        .ticker-item{display:inline-flex;align-items:center;gap:0.45rem;padding:0 1.5rem;font-size:0.78rem;color:var(--ink-2);border-right:1px solid var(--line);}
        .t-s{font-weight:600;color:var(--ink);letter-spacing:0.04em;}.t-p{font-weight:500;}
        @keyframes tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @media(prefers-reduced-motion:reduce){.ticker-track{animation:none;}}

        /* PAGE WRAP (inner tabs) */
        .page-wrap{padding:clamp(1.8rem,4vw,3rem) clamp(1rem,4vw,3rem);min-height:calc(100vh - 60px);margin-top:60px;}
        .page-head{margin-bottom:2rem;}
        .page-h{font-family:var(--serif);font-size:clamp(1.7rem,4vw,2.4rem);font-weight:500;color:var(--ink);}
        .rule{width:36px;height:2px;background:var(--red);margin-top:0.8rem;}

        /* MARKET TABLE */
        .mkt-filters{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.5rem;}
        .mkt-filter{font-size:0.8rem;padding:0.42rem 0.95rem;background:transparent;border:1px solid var(--line);color:var(--ink-2);cursor:pointer;transition:all 0.15s;}
        .mkt-filter:hover,.mkt-filter.on{border-color:var(--red);color:var(--ink);background:var(--surface);}
        .mkt-table{width:100%;border-collapse:collapse;}
        .mkt-table thead tr{border-bottom:1.5px solid var(--ink);}
        .mkt-table th{font-size:0.66rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-3);padding:0.65rem 1rem;text-align:left;white-space:nowrap;}
        .mkt-table td{padding:0.85rem 1rem;border-bottom:1px solid var(--line);font-size:0.9rem;vertical-align:middle;}
        .mkt-table tr:hover td{background:var(--surface);}
        .mkt-rank{color:var(--ink-3);font-size:0.8rem;}
        .mkt-id{display:flex;align-items:center;gap:0.8rem;}
        .mkt-photo{width:42px;height:42px;flex:none;background:#EFE7D5;overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .mkt-img{width:100%;height:100%;object-fit:cover;}
        .mkt-fb{width:100%;height:100%;align-items:center;justify-content:center;}
        .mkt-fb svg{width:46%;height:46%;color:var(--ink-3);}
        .mkt-watch-name{display:block;font-family:var(--serif);font-size:1rem;font-weight:500;color:var(--ink);}
        .mkt-brand{display:block;font-size:0.7rem;color:var(--ink-3);margin-top:1px;}
        .mkt-price{font-weight:600;}
        .mkt-vol{color:var(--ink-3);font-size:0.78rem;}
        .mkt-trend{display:flex;align-items:center;gap:0.7rem;}
        .spark{width:88px;height:28px;display:block;flex:none;overflow:visible;}
        .spark-empty{width:88px;flex:none;display:inline-block;text-align:center;color:var(--ink-3);}
        .badge-up,.badge-dn{display:inline-block;font-size:0.74rem;font-weight:600;padding:0.16rem 0.55rem;border-radius:999px;border:1px solid;}
        .badge-up{color:var(--gain);border-color:rgba(62,125,90,0.3);background:rgba(62,125,90,0.08);}
        .badge-dn{color:var(--red);border-color:rgba(168,54,43,0.3);background:rgba(168,54,43,0.08);}
        .badge-flat{color:var(--ink-3);border-color:var(--line);background:transparent;}
        .alert-btn{font-size:0.78rem;padding:0.36rem 0.8rem;background:transparent;border:1px solid var(--line);color:var(--ink-2);cursor:pointer;transition:all 0.15s;white-space:nowrap;}
        .alert-btn:hover{border-color:var(--red);color:var(--red);}

        /* WATCHLISTS */
        .wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:1.2rem;}
        .wl-card{background:var(--surface);border:1px solid var(--line);padding:1.3rem;}
        .wl-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;padding-bottom:0.8rem;border-bottom:1px solid var(--line);}
        .wl-card-title{font-family:var(--serif);font-size:1.1rem;font-weight:500;color:var(--ink);}
        .wl-card-count{font-size:0.64rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:var(--red);}
        .wl-row{display:flex;align-items:center;gap:0.9rem;padding:0.7rem 0;border-bottom:1px solid var(--line);transition:background 0.15s;}
        .wl-row:hover{background:var(--paper);}
        .wl-thumb{width:44px;height:44px;background:#EFE7D5;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .wl-img{width:100%;height:100%;object-fit:cover;}
        .wl-thumb-fb{align-items:center;justify-content:center;width:100%;height:100%;}
        .wl-thumb-fb svg{width:46%;height:46%;color:var(--ink-3);}
        .wl-info{flex:1;min-width:0;}
        .wl-name{font-family:var(--serif);font-size:0.98rem;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .wl-ref{font-size:0.72rem;color:var(--ink-3);}
        .wl-price{font-size:0.92rem;font-weight:600;text-align:right;}
        .wl-chg{font-size:0.78rem;text-align:right;}
        .wl-live{display:flex;align-items:center;gap:0.45rem;font-size:0.66rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--gain);margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid var(--line);}
        .live-dot{width:6px;height:6px;border-radius:50%;background:var(--gain);}
        .dash-ticker{background:var(--surface);border:1px solid var(--line);padding:0.8rem 1rem;margin-bottom:1.3rem;}
        .dt-label{font-size:0.62rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.5rem;display:flex;align-items:center;gap:0.4rem;}
        .dt-inner{overflow:hidden;}
        .dt-track{display:flex;animation:tick 40s linear infinite;white-space:nowrap;}
        .dt-item{display:inline-flex;align-items:center;gap:0.5rem;padding:0 1.3rem;font-size:0.8rem;color:var(--ink-2);border-right:1px solid var(--line);}
        .dt-n{font-weight:500;color:var(--ink);}.dt-p{font-weight:500;}
        .add-wl-btn{display:inline-flex;align-items:center;gap:0.5rem;font-size:0.82rem;font-weight:500;padding:0.6rem 1.1rem;background:transparent;border:1px dashed var(--ink-3);color:var(--ink-2);cursor:pointer;transition:all 0.15s;margin-bottom:1.2rem;}
        .add-wl-btn:hover{border-color:var(--red);color:var(--red);}
        .empty-state{padding:3rem 2rem;text-align:center;border:1px dashed var(--ink-3);}
        .empty-icon{display:flex;justify-content:center;margin-bottom:0.8rem;}
        .empty-icon svg{width:32px;height:32px;color:var(--ink-3);}
        .empty-title{font-family:var(--serif);font-size:1.15rem;color:var(--ink-2);margin-bottom:0.4rem;}
        .empty-desc{font-size:0.85rem;color:var(--ink-3);}

        /* ALERTS */
        .alert-form-box{background:var(--surface);border:1px solid var(--line);padding:clamp(1.3rem,3vw,2rem);max-width:600px;margin-bottom:2rem;}
        .afb-title{font-family:var(--serif);font-size:1.2rem;font-weight:500;color:var(--ink);margin-bottom:1.3rem;}
        .afb-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:0.8rem;}
        .afb-label{font-size:0.66rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);display:block;margin-bottom:0.35rem;}
        .afb-input{width:100%;font-family:var(--sans);font-size:0.9rem;padding:0.6rem 0.8rem;background:var(--paper);border:1px solid var(--line);color:var(--ink);outline:none;transition:border-color 0.15s;}
        .afb-input::placeholder{color:var(--ink-3);}
        .afb-input:focus{border-color:var(--red);}
        .afb-types{display:flex;gap:0.4rem;margin-bottom:0.8rem;}
        .afb-type{flex:1;font-size:0.8rem;padding:0.55rem;background:transparent;border:1px solid var(--line);color:var(--ink-2);cursor:pointer;transition:all 0.15s;}
        .afb-type:hover,.afb-type.on{border-color:var(--red);color:var(--red);background:var(--paper);}
        .afb-submit{width:100%;font-size:0.86rem;font-weight:600;padding:0.8rem;background:var(--ink);color:var(--paper);border:none;cursor:pointer;transition:background 0.15s;}
        .afb-submit:hover{background:#000;}
        .alerts-h{font-family:var(--serif);font-size:1.2rem;color:var(--ink);margin-bottom:0.9rem;font-weight:500;}
        .alerts-list{display:flex;flex-direction:column;gap:0.6rem;}
        .alert-card{background:var(--surface);border:1px solid var(--line);padding:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
        .alert-card-icon{flex:none;display:flex;}.alert-card-icon svg{width:20px;height:20px;color:var(--red);}
        .alert-card-info{flex:1;min-width:160px;}
        .alert-card-watch{font-family:var(--serif);font-size:1rem;font-weight:500;color:var(--ink);}
        .alert-card-detail{font-size:0.76rem;color:var(--ink-3);margin-top:1px;}
        .alert-card-status{font-size:0.66rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:0.24rem 0.65rem;border:1px solid rgba(62,125,90,0.3);color:var(--gain);background:rgba(62,125,90,0.08);}
        .alert-card-del{background:none;border:none;color:var(--ink-3);cursor:pointer;font-size:1rem;transition:color 0.15s;}
        .alert-card-del:hover{color:var(--red);}

        /* ACCOUNT */
        .account-grid{display:grid;grid-template-columns:240px 1fr;gap:1.5rem;align-items:start;}
        .account-sidebar{background:var(--surface);border:1px solid var(--line);padding:1.6rem;}
        .acct-avatar{width:64px;height:64px;border-radius:50%;background:var(--paper);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;margin:0 auto 0.9rem;}
        .acct-avatar svg{width:28px;height:28px;color:var(--red);}
        .acct-name{font-family:var(--serif);font-size:1.05rem;font-weight:500;color:var(--ink);text-align:center;margin-bottom:0.2rem;}
        .acct-plan{font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--red);text-align:center;margin-bottom:1.3rem;}
        .acct-menu{list-style:none;display:flex;flex-direction:column;gap:0.1rem;}
        .acct-menu li a,.acct-menu li button{display:block;width:100%;text-align:left;font-size:0.86rem;color:var(--ink-2);padding:0.5rem 0.6rem;background:transparent;border:none;cursor:pointer;transition:all 0.15s;}
        .acct-menu li a:hover,.acct-menu li button:hover{color:var(--ink);background:var(--paper);}
        .acct-divider{height:1px;background:var(--line);margin:0.7rem 0;}
        .account-main{display:flex;flex-direction:column;gap:1rem;}
        .acct-section{background:var(--surface);border:1px solid var(--line);padding:1.3rem;}
        .acct-section-title{font-family:var(--serif);font-size:1.05rem;font-weight:500;color:var(--ink);margin-bottom:1rem;padding-bottom:0.7rem;border-bottom:1px solid var(--line);}
        .acct-row{display:flex;justify-content:space-between;align-items:center;padding:0.55rem 0;border-bottom:1px solid var(--line);font-size:0.88rem;}
        .acct-row:last-child{border-bottom:none;}
        .acct-row-label{color:var(--ink-3);}
        .cancel-link{font-size:0.8rem;color:var(--red);background:none;border:none;cursor:pointer;text-decoration:underline;}

        /* PRICING */
        .sec-eye{font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.5rem;}
        .sec-h{font-family:var(--serif);font-size:clamp(1.6rem,3.4vw,2.2rem);font-weight:500;color:var(--ink);}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:2rem;}
        .plan{background:var(--surface);padding:clamp(1.1rem,2.5vw,1.6rem);position:relative;}
        .plan.hot{border-top:2px solid var(--red);}
        .plan-badge{font-size:0.58rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:var(--red);display:block;margin-bottom:0.6rem;}
        .plan-name{font-family:var(--serif);font-size:1.2rem;font-weight:500;color:var(--ink);margin-bottom:0.1rem;}
        .plan-sub2{font-size:0.74rem;color:var(--ink-3);margin-bottom:0.9rem;}
        .plan-pr{display:flex;align-items:baseline;gap:0.1rem;margin-bottom:0.2rem;}
        .p-d{font-size:0.95rem;color:var(--ink-2);align-self:flex-start;margin-top:0.3rem;}
        .p-n{font-family:var(--serif);font-size:2.2rem;font-weight:600;color:var(--ink);line-height:1;}
        .p-p{font-size:0.74rem;color:var(--ink-3);}
        .plan-seats2{font-size:0.6rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.9rem;padding-bottom:0.8rem;border-bottom:1px solid var(--line);}
        .plan-list{list-style:none;margin-bottom:1.3rem;display:flex;flex-direction:column;gap:0.45rem;}
        .plan-list li{font-size:0.82rem;color:var(--ink-2);display:flex;align-items:flex-start;gap:0.4rem;line-height:1.4;}
        .plan-list li::before{content:'—';color:var(--red);flex-shrink:0;}
        .plan-list li.dim{color:var(--ink-3);}
        .plan-list li.dim::before{color:var(--ink-3);}
        .plan-btn{width:100%;font-size:0.8rem;font-weight:600;padding:0.65rem;cursor:pointer;transition:all 0.15s;border:1px solid var(--ink);background:transparent;color:var(--ink);}
        .plan-btn:hover{background:var(--ink);color:var(--paper);}
        .plan.hot .plan-btn{background:var(--ink);color:var(--paper);}
        .plan.hot .plan-btn:hover{background:#000;}
        .plan-adnote{font-size:0.62rem;color:var(--ink-3);text-align:center;margin-top:0.4rem;}
        .cancel-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
        .cancel-text{font-family:var(--serif);font-size:clamp(1.05rem,2vw,1.3rem);color:var(--ink);}
        .cancel-sub{font-size:0.8rem;color:var(--ink-3);margin-top:0.25rem;}
        .cancel-sub strong{color:var(--ink-2);font-weight:600;}

        /* FOOTER */
        footer{background:var(--surface);padding:2.4rem clamp(1rem,4vw,3rem) 1.4rem;}
        .footer-grid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:1.8rem;margin-bottom:1.6rem;padding-bottom:1.6rem;border-bottom:1px solid var(--line);}
        .f-brand{font-family:var(--serif);font-size:1.3rem;font-weight:600;color:var(--ink);margin-bottom:0.15rem;}
        .f-brand em{color:var(--red);font-style:normal;}
        .f-tag{font-size:0.58rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--red);display:block;margin-bottom:0.7rem;}
        .f-desc{font-size:0.82rem;color:var(--ink-3);line-height:1.7;max-width:34ch;}
        .f-col-t{font-size:0.6rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.8rem;}
        .f-links{list-style:none;display:flex;flex-direction:column;gap:0.42rem;}
        .f-links a{font-size:0.82rem;color:var(--ink-2);transition:color 0.15s;}
        .f-links a:hover{color:var(--red);}
        .footer-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
        .f-legal{font-size:0.72rem;color:var(--ink-3);}
        .f-legal a{color:var(--ink-2);}

        /* MODAL */
        .overlay{position:fixed;inset:0;background:rgba(22,20,14,0.45);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity 0.2s;backdrop-filter:blur(4px);}
        .overlay.show{opacity:1;pointer-events:all;}
        .modal{background:var(--surface);border:1px solid var(--line);width:100%;max-width:400px;padding:clamp(1.5rem,4vw,2rem);position:relative;}
        .mx{position:absolute;top:0.8rem;right:0.95rem;background:none;border:none;color:var(--ink-3);font-size:1.3rem;cursor:pointer;line-height:1;}
        .mx:hover{color:var(--ink);}
        .m-eye2{font-size:0.66rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.4rem;}
        .m-h2{font-family:var(--serif);font-size:1.5rem;font-weight:500;color:var(--ink);margin-bottom:1.3rem;}
        .fg{display:flex;flex-direction:column;gap:0.3rem;margin-bottom:0.8rem;}
        .fg label{font-size:0.64rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);}
        .fg input,.fg select{font-family:var(--sans);font-size:0.9rem;padding:0.6rem 0.8rem;background:var(--paper);border:1px solid var(--line);color:var(--ink);outline:none;transition:border-color 0.15s;-webkit-appearance:none;}
        .fg input::placeholder{color:var(--ink-3);}
        .fg input:focus,.fg select:focus{border-color:var(--red);}
        .n-row{display:flex;gap:0.4rem;margin-bottom:0.8rem;}
        .n-btn{flex:1;font-size:0.78rem;padding:0.5rem;background:transparent;border:1px solid var(--line);color:var(--ink-2);cursor:pointer;transition:all 0.15s;}
        .n-btn:hover,.n-btn.on{border-color:var(--red);color:var(--red);background:var(--paper);}
        .m-submit{width:100%;font-size:0.86rem;font-weight:600;padding:0.85rem;background:var(--ink);color:var(--paper);border:none;cursor:pointer;transition:background 0.15s;margin-top:0.2rem;}
        .m-submit:hover{background:#000;}
        .m-note{margin-top:0.7rem;font-size:0.72rem;color:var(--ink-3);text-align:center;line-height:1.5;}

        /* RESPONSIVE */
        @media(max-width:860px){
          .hero-grid{grid-template-columns:1fr;text-align:center;}
          .hero-sub{margin-left:auto;margin-right:auto;}
          .hero-dial{order:-1;}
          .feat-grid{grid-template-columns:1fr;}
          .account-grid{grid-template-columns:1fr;}
        }
        @media(max-width:760px){
          .footer-grid{grid-template-columns:1fr 1fr;}
          .afb-grid{grid-template-columns:1fr;}
          .mkt-table th:nth-child(4),.mkt-table td:nth-child(4){display:none;}
          .mkt-table th:nth-child(5),.mkt-table td:nth-child(5){display:none;}
        }
        @media(max-width:520px){
          .footer-grid{grid-template-columns:1fr;}
          .nav-tab span:not(.tab-icon){display:none;}
          .tab-icon{margin:0;}
          .tab-icon svg{width:18px;height:18px;}
          .pv-row{grid-template-columns:42px 1fr auto;}
          .pv-chg{display:none;}
        }

        /* ANIMATIONS */
        .fade{opacity:0;transform:translateY(10px);transition:opacity 0.5s,transform 0.5s;}
        .fade.in{opacity:1;transform:translateY(0);}
        @media(prefers-reduced-motion:reduce){*{animation:none !important;transition:none !important;}}
      `}</style>

      {/* ── TOP NAV ── */}
      <nav className="topnav">
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); (window as any).switchTab('home'); }}>Watch<em>Out</em></a>
        <div className="nav-tabs">
          {[['home','Home'],['market','Market'],['watchlists','Watchlists'],['alerts','Alerts'],['account','Account']].map(([id, label]) => (
            <button key={id} className={`nav-tab${id === 'home' ? ' active' : ''}`} id={`tab-${id}`} onClick={() => (window as any).switchTab(id)}>
              <span className="tab-icon" dangerouslySetInnerHTML={{ __html: SVG[id] }} /><span>{label}</span>
            </button>
          ))}
        </div>
        <div className="nav-r">
          <a href="#" className="btn-sm" onClick={(e) => { e.preventDefault(); (window as any).openModal('free'); }}>Sign in</a>
        </div>
      </nav>

      {/* ── HOME PAGE ── */}
      <div className="wo-page active" id="page-home">
        {/* Hero */}
        <section className="hero">
          <div className="hero-grid">
            <div>
              <p className="hero-eye">Watch market intelligence</p>
              <h1 className="hero-h">Know what it&rsquo;s worth.</h1>
              <p className="hero-sub">Live secondary-market prices for the world&rsquo;s most collected watches &mdash; refreshed hourly.</p>
              <a href="#" className="hero-cta" onClick={(e) => { e.preventDefault(); (window as any).switchTab('market'); }}>Explore the market</a>
            </div>
            <div className="hero-dial"><LiveDial size={340} /></div>
          </div>
        </section>

        {/* WatchOut Index — slim headline band (populated from /index) */}
        <div className="idx-band" id="indexBand"></div>

        {/* Today's movers turnstile */}
        <section className="band fade">
          <div className="band-head">
            <div><p className="kicker">Today&rsquo;s movers</p><h2 className="band-h">Watches on the move</h2></div>
            <span className="band-cap">Updates daily</span>
          </div>
          <div className="movers-strip"><div className="mv-track" id="moversTrack"></div></div>
        </section>

        {/* Most-active ticker */}
        <div className="ticker-bar">
          <div className="ticker-label">Most active</div>
          <div className="ticker-track" id="homeTicker"></div>
        </div>

        {/* Ad slot — free/anonymous only (house upgrade placeholder; populated in init) */}
        <div className="ad-slot" id="adSlot" style={{ display: 'none' }}></div>

        {/* Featured capsule (config-driven, quarterly) */}
        <section className="band featured fade">
          <div className="feat-grid">
            <div className="feat-photo" id="featuredPhoto"></div>
            <div>
              <span className="feat-season" style={{ background: FEATURED.accent }}>{FEATURED.season} · Featured</span>
              <div className="feat-brand">{FEATURED.brand}</div>
              <div className="feat-name">{FEATURED.model}</div>
              <div className="feat-ref">Ref. {FEATURED.reference}</div>
              <p className="feat-blurb">{FEATURED.blurb}</p>
              <a href="#" className="feat-cta" onClick={(e) => { e.preventDefault(); (window as any).switchTab('market'); }}>{FEATURED.cta} &rarr;</a>
            </div>
          </div>
        </section>

        {/* Market preview */}
        <section className="band fade">
          <div className="band-head">
            <div><p className="kicker">Live data</p><h2 className="band-h">Market</h2></div>
            <span className="band-link" onClick={() => (window as any).switchTab('market')}>View full market &rarr;</span>
          </div>
          <div className="pv-list" id="previewBody"></div>
        </section>

        {/* Spotlight */}
        <section className="band fade">
          <div className="band-head">
            <div><p className="kicker">Spotlight</p><h2 className="band-h">Worth a closer look</h2></div>
          </div>
          <div className="spot-grid" id="spotlightGrid"></div>
        </section>

        {/* Pricing */}
        <section className="band fade">
          <p className="sec-eye">Pricing</p>
          <h2 className="sec-h">Start free. Upgrade when ready.</h2>
          <div className="plans">
            {[
              { badge:'Always free', name:'Free', sub:'Get started today', price:'0', per:'/ mo', seats:'1 user', features:['Basic price tracking','3 watchlist items','Daily updates','1 email alert'], dim:['Ads shown','No price history'], hot:false },
              { badge:'Most popular', name:'Personal', sub:'Collectors & enthusiasts', price:'19', per:'.99 / mo', seats:'Up to 2 users', features:['Unlimited watchlists','Hourly updates','SMS + email alerts','Full price history','Zero ads','14-day free trial'], dim:[], hot:true },
              { badge:'For teams', name:'Corporate', sub:'Dealers & small teams', price:'79', per:'.99 / mo', seats:'Up to 10 users', features:['Everything in Personal','Team watchlists','Market reports','API access','Zero ads','Priority support'], dim:[], hot:false },
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
                <button className="plan-btn" onClick={() => (window as any).openModal(p.name === 'Free' ? 'free' : undefined)}>{p.name === 'Enterprise' ? 'Contact sales' : p.name === 'Free' ? 'Get free access' : 'Start free trial'}</button>
                {p.name === 'Free' && <p className="plan-adnote">Supported by non-intrusive ads</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Cancel bar */}
        <section className="band">
          <div className="cancel-bar">
            <div>
              <div className="cancel-text">Cancel any time. One click. No questions asked.</div>
              <div className="cancel-sub">Your data is yours. <strong>We export everything on the way out.</strong></div>
            </div>
            <a href="#" className="hero-cta" onClick={(e) => { e.preventDefault(); (window as any).openModal(); }}>Start free trial &rarr;</a>
          </div>
        </section>

        <footer>
          <div className="footer-grid">
            <div><div className="f-brand">Watch<em>Out</em></div><span className="f-tag">Market intelligence · Beta</span><p className="f-desc">Real-time watch market intelligence for collectors, dealers, and investors. Currently in early access.</p></div>
            <div><div className="f-col-t">Product</div><ul className="f-links"><li><a href="#" onClick={(e)=>{e.preventDefault();(window as any).switchTab('market');}}>Market</a></li><li><a href="#" onClick={(e)=>{e.preventDefault();(window as any).switchTab('alerts');}}>Alerts</a></li><li><a href="#" onClick={(e)=>{e.preventDefault();(window as any).switchTab('watchlists');}}>Watchlists</a></li></ul></div>
            <div><div className="f-col-t">Company</div><ul className="f-links"><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Blog</a></li></ul></div>
            <div><div className="f-col-t">Legal</div><ul className="f-links"><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Photo credits</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <p className="f-legal">© 2026 WatchOut Market Intelligence. Beta. Listing photos shown in context, linked to their eBay source.</p>
            <p className="f-legal"><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cancel anytime</a></p>
          </div>
        </footer>
      </div>

      {/* ── MARKET PAGE ── */}
      <div className="wo-page" id="page-market">
        <div className="page-wrap">
          <div className="page-head"><p className="kicker">Live data</p><h2 className="page-h">Market explorer</h2><div className="rule"></div></div>
          <div className="mkt-filters">
            {[['all','All brands'],['Rolex','Rolex'],['Patek Philippe','Patek Philippe'],['Audemars Piguet','Audemars Piguet'],['Omega','Omega'],['Tudor','Tudor'],['IWC','IWC']].map(([val, label]) => (
              <button key={val} className={`mkt-filter${val === 'all' ? ' on' : ''}`} onClick={(e) => (window as any).filterMkt(e.currentTarget, val)}>{label}</button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="mkt-table"><thead><tr><th>#</th><th>Watch</th><th>Price</th><th>7-day</th><th>Volume</th><th>Alert</th></tr></thead><tbody id="mktBody"></tbody></table>
          </div>
        </div>
      </div>

      {/* ── WATCHLISTS PAGE ── */}
      <div className="wo-page" id="page-watchlists">
        <div className="page-wrap">
          <div className="page-head"><p className="kicker">My collection</p><h2 className="page-h">Your watchlists</h2><div className="rule"></div></div>
          <div className="dash-ticker"><div className="dt-label"><span className="live-dot"></span>Your watches — live feed</div><div className="dt-inner"><div className="dt-track" id="dashTicker"></div></div></div>
          <button className="add-wl-btn" onClick={() => (window as any).openModal()}>+ Create new watchlist</button>
          <div className="wl-grid" id="wlGrid"></div>
        </div>
      </div>

      {/* ── ALERTS PAGE ── */}
      <div className="wo-page" id="page-alerts">
        <div className="page-wrap">
          <div className="page-head"><p className="kicker">Price alerts</p><h2 className="page-h">Never miss the right price</h2><div className="rule"></div></div>
          {/* Locked state for free tier (populated in init); hidden otherwise */}
          <div className="alerts-lock" id="alertsLock" style={{ display: 'none' }}></div>
          <div id="alertsBox">
          <div className="alert-form-box">
            <div className="afb-title">Set a new alert</div>
            <div className="afb-grid">
              <div><label className="afb-label">Watch name or ref #</label><input className="afb-input" id="al-watch" type="text" placeholder="e.g. Submariner 126610LN" /></div>
              <div><label className="afb-label">Alert when price drops below</label><input className="afb-input" id="al-price" type="text" placeholder="e.g. $13,500" /></div>
              <div><label className="afb-label">Email address</label><input className="afb-input" id="al-email" type="email" placeholder="you@example.com" /></div>
              <div><label className="afb-label">Phone (SMS — optional)</label><input className="afb-input" id="al-phone" type="tel" placeholder="+1 (555) 000-0000" /></div>
            </div>
            <div className="afb-types">
              <button className="afb-type on" id="alt-e" onClick={() => (window as any).setAltType('email')}>Email</button>
              <button className="afb-type" id="alt-s" onClick={() => (window as any).setAltType('sms')}>SMS</button>
              <button className="afb-type" id="alt-b" onClick={() => (window as any).setAltType('both')}>Both</button>
            </div>
            <button className="afb-submit" onClick={() => (window as any).addAlert()}>Set alert &rarr;</button>
          </div>
          <h3 className="alerts-h">Active alerts</h3>
          <div className="alerts-list" id="alertsList"></div>
          </div>{/* end #alertsBox */}
        </div>
      </div>

      {/* ── ACCOUNT PAGE ── */}
      <div className="wo-page" id="page-account">
        <div className="page-wrap">
          <div className="page-head"><p className="kicker">Profile</p><h2 className="page-h">Your account</h2><div className="rule"></div></div>
          <div className="account-grid">
            <div className="account-sidebar">
              <div className="acct-avatar" dangerouslySetInnerHTML={{ __html: SVG.account }} />
              <div className="acct-name">Early Access User</div>
              <div className="acct-plan">Beta · Personal plan</div>
              <ul className="acct-menu">
                <li><a href="#">Profile settings</a></li>
                <li><a href="#">Notification preferences</a></li>
                <li><a href="#">Billing &amp; plan</a></li>
                <div className="acct-divider"></div>
                <li><a href="#">Help &amp; support</a></li>
                <li><button className="cancel-link" onClick={() => (window as any).confirmCancel()}>Cancel membership</button></li>
              </ul>
            </div>
            <div className="account-main">
              <div className="acct-section">
                <div className="acct-section-title">Plan details</div>
                <div className="acct-row"><span className="acct-row-label">Current plan</span><span>Personal — $19.99/mo</span></div>
                <div className="acct-row"><span className="acct-row-label">Users</span><span>1 of 2 used</span></div>
                <div className="acct-row"><span className="acct-row-label">Next billing</span><span>April 25, 2026</span></div>
                <div className="acct-row"><span className="acct-row-label">Ads</span><span style={{ color: 'var(--gain)' }}>None — paid plan</span></div>
                <div className="acct-row"><span className="acct-row-label">Cancel</span><button className="cancel-link" onClick={() => (window as any).confirmCancel()}>Cancel in one click &rarr;</button></div>
              </div>
              <div className="acct-section">
                <div className="acct-section-title">Alert preferences</div>
                <div className="acct-row"><span className="acct-row-label">Email alerts</span><span style={{ color: 'var(--gain)' }}>On</span></div>
                <div className="acct-row"><span className="acct-row-label">SMS alerts</span><span>Off — add phone number</span></div>
                <div className="acct-row"><span className="acct-row-label">Frequency</span><span>Immediately (hourly scan)</span></div>
              </div>
              <div className="acct-section">
                <div className="acct-section-title">Your activity</div>
                <div className="acct-row"><span className="acct-row-label">Watchlist items</span><span>4</span></div>
                <div className="acct-row"><span className="acct-row-label">Active alerts</span><span>2</span></div>
                <div className="acct-row"><span className="acct-row-label">Member since</span><span>March 2026</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      <div className="overlay" id="overlay" onClick={(e) => { if (e.target === e.currentTarget) (window as any).closeModal(); }}>
        <div className="modal">
          <button className="mx" onClick={() => (window as any).closeModal()} aria-label="Close">×</button>
          <div className="m-eye2" id="mEye">Early access</div>
          <div className="m-h2" id="mH">Join WatchOut</div>
          <div className="fg"><label>Full name</label><input type="text" placeholder="Your name" /></div>
          <div className="fg"><label>Email address</label><input type="email" placeholder="you@example.com" /></div>
          <div className="fg"><label>Phone — SMS alerts (optional)</label><input type="tel" placeholder="+1 (555) 000-0000" /></div>
          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ fontSize: '0.64rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '0.35rem' }}>Alert preference</label>
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
              <option value="enterprise">Enterprise — Contact sales</option>
            </select>
          </div>
          <button className="m-submit">Reserve my spot &rarr;</button>
          <p className="m-note">14-day free trial on paid plans. No credit card required. Cancel any time.</p>
        </div>
      </div>
    </>
  );
}
