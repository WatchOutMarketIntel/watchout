'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { nickOf } from '../../nicknames';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://watchout-api-production.up.railway.app').replace(/\/+$/, '');

const fmt = (p?: number | null) => (p == null ? '—' : '$' + Math.round(p).toLocaleString());
const fmtChg = (c?: number | null) => (c == null ? '—' : (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c).toFixed(1) + '%');
const chgCls = (c?: number | null) => (c == null ? 'flat' : c >= 0 ? 'up' : 'down');

// eBay fallback search (used only if a listing has no direct url).
const ebaySearch = (brand: string, name: string, ref: string) =>
  `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent([brand, name, ref].filter(Boolean).join(' '))}&_sacat=31387`;

// A larger price chart (line + soft fill) from the history series.
function chart(history: { price: number; at: string }[]) {
  if (!history || history.length < 2) return '<div class="dt-nochart">Not enough history yet — the chart fills in as snapshots accumulate.</div>';
  const W = 760, H = 220, pad = 10;
  const prices = history.map(h => h.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const n = prices.length;
  const x = (i: number) => pad + (i / (n - 1)) * (W - pad * 2);
  const y = (p: number) => pad + (1 - (p - min) / span) * (H - pad * 2);
  const line = prices.map((p, i) => `${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const area = `${pad},${(H - pad).toFixed(1)} ${line} ${(W - pad).toFixed(1)},${(H - pad).toFixed(1)}`;
  const up = prices[n - 1] >= prices[0];
  const col = up ? '#3E7D5A' : '#A8362B';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="dt-chart" role="img" aria-label="Price history">`
    + `<polygon points="${area}" fill="${col}" opacity="0.07"/>`
    + `<polyline points="${line}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<circle cx="${x(n - 1).toFixed(1)}" cy="${y(prices[n - 1]).toFixed(1)}" r="3.2" fill="${col}"/></svg>`;
}

export default function WatchDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<any>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const previewTier = new URLSearchParams(window.location.search).get('tier');
    const tq = previewTier ? `?tier=${encodeURIComponent(previewTier)}` : '';
    fetch(`${API}/watch/${id}${tq}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => { if (!cancelled) { setData(d); setState(d && d.watch ? 'ok' : 'error'); } })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [id]);

  const w = data?.watch;
  const nick = w ? (w.nickname || nickOf(w.ref)) : '';

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--paper:#F3ECDB;--surface:#FBF6EA;--line:#E6DCC6;--ink:#16140E;--ink-2:#6A6253;--ink-3:#A89E8B;--red:#A8362B;--gain:#3E7D5A;
          --serif:var(--font-serif),Georgia,serif;--sans:var(--font-sans),system-ui,sans-serif;}
        body{font-family:var(--sans);background:var(--paper);color:var(--ink);font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;line-height:1.5;}
        a{color:inherit;text-decoration:none;}
        .up{color:var(--gain);}.down{color:var(--red);}.flat{color:var(--ink-3);}
        .wrap{max-width:900px;margin:0 auto;padding:clamp(1.2rem,4vw,2.5rem) clamp(1rem,4vw,2rem) 4rem;}
        .top{display:flex;align-items:center;justify-content:space-between;padding-bottom:1.4rem;border-bottom:1px solid var(--line);margin-bottom:1.8rem;}
        .logo{font-family:var(--serif);font-size:1.3rem;font-weight:600;}
        .logo em{color:var(--red);font-style:normal;}
        .back{font-size:0.85rem;font-weight:500;border-bottom:1px solid var(--red);padding-bottom:1px;}
        .muted{color:var(--ink-2);font-size:0.95rem;padding:2rem 0;}
        .head{display:grid;grid-template-columns:280px 1fr;gap:clamp(1.4rem,4vw,2.5rem);align-items:start;}
        .photo{aspect-ratio:1;background:#fff;border:1px solid var(--line);overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .photo img{width:100%;height:100%;object-fit:cover;}
        .photo .fb{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#EFE7D5;color:var(--ink-3);font-size:2.4rem;}
        .brand{font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:0.35rem;}
        .name{font-family:var(--serif);font-size:clamp(1.8rem,4vw,2.6rem);font-weight:500;line-height:1.05;}
        .nick{display:inline-block;margin-left:0.6rem;font-size:0.66rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--red);background:rgba(168,54,43,0.08);border:1px solid rgba(168,54,43,0.25);border-radius:999px;padding:0.12rem 0.5rem;vertical-align:middle;}
        .ref{font-size:0.85rem;color:var(--ink-3);margin:0.35rem 0 1.2rem;}
        .price{font-family:var(--serif);font-size:2.4rem;font-weight:600;line-height:1;}
        .chips{display:flex;gap:0.5rem;flex-wrap:wrap;margin:1rem 0 1.3rem;}
        .chip{border:1px solid var(--line);background:var(--surface);padding:0.4rem 0.7rem;font-size:0.8rem;}
        .chip b{display:block;font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.15rem;}
        .chip.locked{border-style:dashed;}
        .chip .lk{font-size:0.72rem;font-weight:600;color:var(--red);white-space:nowrap;}
        .hist-cta{color:var(--red);font-weight:600;border-bottom:1px solid var(--red);}
        .stats{display:flex;gap:1.4rem;flex-wrap:wrap;font-size:0.85rem;color:var(--ink-2);margin-bottom:1.3rem;}
        .stats b{color:var(--ink);font-weight:600;}
        .cta{display:inline-block;font-size:0.86rem;font-weight:600;padding:0.7rem 1.4rem;background:var(--ink);color:var(--paper);}
        .cta:hover{background:#000;}
        .sec{margin-top:2.6rem;}
        .sec-h{font-family:var(--serif);font-size:1.3rem;font-weight:500;margin-bottom:0.4rem;}
        .sec-sub{font-size:0.78rem;color:var(--ink-3);margin-bottom:1rem;}
        .dt-chart{width:100%;height:auto;display:block;border:1px solid var(--line);background:var(--surface);}
        .dt-nochart{font-size:0.85rem;color:var(--ink-3);padding:1.4rem;border:1px dashed var(--ink-3);}
        .listings{display:flex;flex-direction:column;border:1px solid var(--line);}
        .lrow{display:grid;grid-template-columns:1fr auto auto;gap:1rem;align-items:center;padding:0.8rem 1rem;border-bottom:1px solid var(--line);transition:background 0.15s;}
        .lrow:last-child{border-bottom:none;}
        .lrow:hover{background:var(--surface);}
        .ltitle{font-size:0.86rem;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .lcond{font-size:0.72rem;color:var(--ink-3);}
        .lprice{font-weight:600;font-size:0.9rem;}
        .lgo{font-size:0.74rem;font-weight:600;color:var(--red);white-space:nowrap;}
        @media(max-width:640px){.head{grid-template-columns:1fr;}.photo{max-width:280px;}.lrow{grid-template-columns:1fr auto;}.lcond{display:none;}}
      `}</style>
      <div className="wrap">
        <div className="top">
          <a className="logo" href="/">Watch<em>Out</em></a>
          <a className="back" href="/">← Back to market</a>
        </div>

        {state === 'loading' && <div className="muted">Loading…</div>}
        {state === 'error' && <div className="muted">This watch could not be loaded. <a className="back" href="/">Return home</a>.</div>}

        {state === 'ok' && w && (
          <>
            <div className="head">
              <div className="photo">
                {w.image_url
                  ? <img src={w.image_url} alt={`${w.brand} ${w.name}`} onError={(e) => { const t = e.currentTarget; t.style.display = 'none'; (t.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
                  : null}
                <span className="fb" style={{ display: w.image_url ? 'none' : 'flex' }}>⌚</span>
              </div>
              <div>
                <div className="brand">{w.brand}</div>
                <div className="name">{w.name}{nick && <span className="nick">{nick}</span>}</div>
                <div className="ref">{[w.ref ? `Ref. ${w.ref}` : null, w.year, w.material].filter(Boolean).join('  ·  ') || 'Reference —'}</div>
                <div className="price">{fmt(w.price)}</div>
                <div className="chips">
                  <div className="chip"><b>24h</b><span className={chgCls(w.change)}>{fmtChg(w.change)}</span></div>
                  {w.history_locked
                    ? <>
                        <div className="chip locked" title="Unlock with Personal"><b>7d</b><span className="lk">🔒 Personal</span></div>
                        <div className="chip locked" title="Unlock with Personal"><b>30d</b><span className="lk">🔒 Personal</span></div>
                      </>
                    : <>
                        <div className="chip"><b>7d</b><span className={chgCls(w.change_7d)}>{fmtChg(w.change_7d)}</span></div>
                        <div className="chip"><b>30d</b><span className={chgCls(w.change_30d)}>{fmtChg(w.change_30d)}</span></div>
                      </>}
                </div>
                <div className="stats">
                  <span>Low <b>{fmt(w.low)}</b></span>
                  <span>High <b>{fmt(w.high)}</b></span>
                  <span>Listings <b>{w.num_listings ?? '—'}</b></span>
                </div>
                <a className="cta" href={w.listing_url || ebaySearch(w.brand, w.name, w.ref)} target="_blank" rel="noopener noreferrer">View on eBay ↗</a>
              </div>
            </div>

            <div className="sec">
              <h2 className="sec-h">Price history</h2>
              <p className="sec-sub">
                {w.history_locked
                  ? <>Showing the last 24 hours. <a className="hist-cta" href="/?tier=personal">Unlock 7-day, 30-day &amp; full history with Personal →</a></>
                  : <>Average active-listing price, most recent snapshots.</>}
              </p>
              <div dangerouslySetInnerHTML={{ __html: chart(data.history || []) }} />
            </div>

            <div className="sec">
              <h2 className="sec-h">Current listings</h2>
              <p className="sec-sub">{(data.listings || []).length} live listings on eBay right now.</p>
              {(data.listings || []).length === 0
                ? <div className="dt-nochart">No current listings on record.</div>
                : <div className="listings">
                    {(data.listings || []).map((l: any, i: number) => (
                      <a className="lrow" key={i} href={l.url || ebaySearch(w.brand, w.name, w.ref)} target="_blank" rel="noopener noreferrer">
                        <span className="ltitle">{l.title || 'eBay listing'}</span>
                        <span className="lcond">{l.condition || ''}</span>
                        <span className="lprice">{fmt(l.price)} <span className="lgo">↗</span></span>
                      </a>
                    ))}
                  </div>}
            </div>
          </>
        )}
      </div>
    </>
  );
}
