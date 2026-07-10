'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { nickOf } from '../../nicknames';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://watchout-api-production.up.railway.app').replace(/\/+$/, '');

const fmt = (p?: number | null) => (p == null ? '—' : '$' + Math.round(p).toLocaleString());
const fmtChg = (c?: number | null) => (c == null ? '—' : (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c).toFixed(1) + '%');
const chgCls = (c?: number | null) => (c == null ? 'flat' : c >= 0 ? 'up' : 'down');

// eBay fallback search (used only if a listing has no direct url).
const ebaySearch = (brand: string, name: string, ref: string) =>
  `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent([brand, name, ref].filter(Boolean).join(' '))}&_sacat=31387`;

type Pt = { price: number; at: string; n?: number | null };
const abbr$ = (v: number) => {
  const a = Math.abs(v);
  // Below $100k, keep one decimal so tight-range gridlines stay distinguishable
  // ($33.5k vs $34k); above, whole-k is enough.
  if (a >= 1000) return '$' + (v / 1000).toFixed(a >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'k';
  return '$' + Math.round(v).toLocaleString();
};
const dayMs = 86400000;

// Interactive price-history chart: dated X axis, $-labelled Y axis (not forced to
// zero — a ~10% band around min/max), gridlines, and a hover tooltip (date, avg
// price, listing count). Thin history (<5 points) shows a "collecting" message
// rather than a misleading line.
function PriceChart({ history }: { history: Pt[] }) {
  const [hover, setHover] = useState<number | null>(null);
  if (!history || history.length < 5) {
    return <div className="dt-nochart">Collecting history — chart improves daily. ({history?.length || 0} snapshot{(history?.length || 0) === 1 ? '' : 's'} so far.)</div>;
  }
  const W = 820, H = 300, padL = 54, padR = 16, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const prices = history.map(h => h.price);
  const dates = history.map(h => new Date(h.at));
  const n = prices.length;
  const dmin = Math.min(...prices), dmax = Math.max(...prices);
  const rawSpan = dmax - dmin;
  const pad = rawSpan > 0 ? rawSpan * 0.1 : Math.max(dmax * 0.05, 1);   // ~10% band, never zero-height
  const yMin = dmin - pad, yMax = dmax + pad, ySpan = yMax - yMin;
  const x = (i: number) => padL + (i / (n - 1)) * plotW;
  const y = (p: number) => padT + (1 - (p - yMin) / ySpan) * plotH;

  const spanDays = (dates[n - 1].getTime() - dates[0].getTime()) / dayMs;
  const fmtAxisDate = (d: Date) => {
    const mon = d.toLocaleString('en-US', { month: 'short' });
    if (spanDays > 90) return `${mon} '${String(d.getFullYear()).slice(2)}`;   // monthly scale
    return `${mon} ${d.getDate()}`;                                            // day/weekly scale
  };
  const fmtFullDate = (d: Date) =>
    d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const yTicks = 4;
  const ys = Array.from({ length: yTicks + 1 }, (_, k) => yMin + (ySpan * k) / yTicks);
  const xTickCount = Math.min(6, n);
  const xs = Array.from({ length: xTickCount }, (_, k) => Math.round((k / (xTickCount - 1)) * (n - 1)));

  const line = prices.map((p, i) => `${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const area = `${padL},${(padT + plotH).toFixed(1)} ${line} ${(padL + plotW).toFixed(1)},${(padT + plotH).toFixed(1)}`;
  const up = prices[n - 1] >= prices[0];
  const col = up ? '#3E7D5A' : '#A8362B';

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vbx = ((e.clientX - r.left) / r.width) * W;
    const frac = Math.max(0, Math.min(1, (vbx - padL) / plotW));
    setHover(Math.round(frac * (n - 1)));
  };
  const hi = hover == null ? null : history[hover];

  return (
    <div className="dt-chartwrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="dt-chart" role="img" aria-label="Price history"
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {ys.map((v, k) => (
          <g key={k}>
            <line x1={padL} y1={y(v)} x2={padL + plotW} y2={y(v)} stroke="#E6DCC6" strokeWidth="1" />
            <text x={padL - 8} y={y(v) + 3.5} textAnchor="end" className="dt-axl">{abbr$(v)}</text>
          </g>
        ))}
        {xs.map((i, k) => (
          <text key={k} x={x(i)} y={H - 10} textAnchor={k === 0 ? 'start' : k === xs.length - 1 ? 'end' : 'middle'} className="dt-axl">{fmtAxisDate(dates[i])}</text>
        ))}
        <polygon points={area} fill={col} opacity="0.07" />
        <polyline points={line} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {hi && <line x1={x(hover as number)} y1={padT} x2={x(hover as number)} y2={padT + plotH} stroke="#A89E8B" strokeWidth="1" strokeDasharray="3 3" />}
        <circle cx={x(n - 1)} cy={y(prices[n - 1])} r="3.2" fill={col} />
        {hi && <circle cx={x(hover as number)} cy={y(hi.price)} r="4" fill={col} stroke="#FBF6EA" strokeWidth="1.5" />}
      </svg>
      {hi && (
        <div className="dt-tip" style={{ left: `${(x(hover as number) / W) * 100}%` }}>
          <div className="dt-tip-d">{fmtFullDate(dates[hover as number])}</div>
          <div className="dt-tip-p">{fmt(hi.price)}{hi.n != null && <span className="dt-tip-n"> · {hi.n} listings</span>}</div>
        </div>
      )}
    </div>
  );
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
        .dt-chartwrap{position:relative;}
        .dt-chart{width:100%;height:auto;display:block;border:1px solid var(--line);background:var(--surface);cursor:crosshair;}
        .dt-axl{font-family:var(--sans);font-size:10px;fill:var(--ink-3);}
        .dt-tip{position:absolute;top:8px;transform:translateX(-50%);background:var(--ink);color:var(--paper);padding:0.4rem 0.6rem;border-radius:4px;font-size:0.74rem;pointer-events:none;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.18);z-index:2;}
        .dt-tip-d{font-size:0.66rem;opacity:0.75;margin-bottom:0.1rem;}
        .dt-tip-p{font-weight:600;font-variant-numeric:tabular-nums;}
        .dt-tip-n{font-weight:400;opacity:0.8;}
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
              <PriceChart history={data.history || []} />
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
