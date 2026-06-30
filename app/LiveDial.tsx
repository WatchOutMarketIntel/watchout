'use client';
import { useEffect, useRef } from 'react';

export default function LiveDial({ size = 280 }: { size?: number }) {
  const hr = useRef<SVGLineElement>(null);
  const mn = useRef<SVGLineElement>(null);
  const sc = useRef<SVGLineElement>(null);
  const ss = useRef<SVGLineElement>(null);
  useEffect(() => {
    let raf = 0;
    const set = (el: SVGLineElement | null, deg: number, cx: number, cy: number) =>
      el && el.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`);
    const tick = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      set(hr.current, h * 30, 130, 130);
      set(mn.current, m * 6, 130, 130);
      set(sc.current, s * 6, 130, 130);
      set(ss.current, s * 6, 84, 130);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" role="img"
         aria-label="Live chronograph showing the current time">
      <defs>
        <path id="topArc" d="M 18 130 a 112 112 0 1 1 224 0" fill="none" />
        <path id="botArc" d="M 10 130 a 120 120 0 1 0 240 0" fill="none" />
      </defs>
      <circle cx="130" cy="130" r="128" fill="#1b1813" />
      <circle cx="130" cy="130" r="124" fill="none" stroke="#3a342a" strokeWidth="0.8" />
      <circle cx="130" cy="130" r="106" fill="none" stroke="#3a342a" strokeWidth="0.8" />
      <circle cx="130" cy="130" r="102" fill="#F1E7D2" />
      <text fontSize="11" letterSpacing="3" fill="#D8CBAE" fontWeight="500">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">MANHATTAN · NEW YORK</textPath>
      </text>
      <text fontSize="11" letterSpacing="3.5" fill="#D8CBAE" fontWeight="500">
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">EST. 2026</textPath>
      </text>
      <circle cx="130" cy="130" r="94" fill="none" stroke="#A8362B" strokeWidth="3.2" strokeDasharray="1.4 8" />
      <g stroke="#16140E" strokeWidth="3" strokeLinecap="round">
        {[0,30,60,120,150,210,240,300,330].map(a => (
          <line key={a} x1="130" y1="42" x2="130" y2="54" transform={`rotate(${a} 130 130)`} />
        ))}
      </g>
      <text x="130" y="86" textAnchor="middle" style={{ fontFamily: 'var(--font-serif), "EB Garamond", serif' }} fontSize="14" fontWeight="600" fill="#16140E">WatchOut</text>
      <text x="130" y="100" textAnchor="middle" fontSize="11" letterSpacing="1" fill="#6A6253">Market Intelligence</text>
      <g>
        <circle cx="176" cy="130" r="20" fill="#1c1813" /><line x1="176" y1="130" x2="176" y2="118" stroke="#E9DEC6" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="84" cy="130" r="20" fill="#1c1813" /><line ref={ss} x1="84" y1="130" x2="84" y2="118" stroke="#A8362B" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="130" cy="176" r="20" fill="#1c1813" /><line x1="130" y1="176" x2="130" y2="164" stroke="#E9DEC6" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <line ref={hr} x1="130" y1="142" x2="130" y2="90" stroke="#16140E" strokeWidth="5.5" strokeLinecap="round" />
      <line ref={mn} x1="130" y1="144" x2="130" y2="62" stroke="#16140E" strokeWidth="3.6" strokeLinecap="round" />
      <line ref={sc} x1="130" y1="156" x2="130" y2="56" stroke="#A8362B" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="130" cy="130" r="5" fill="#16140E" /><circle cx="130" cy="130" r="2" fill="#A8362B" />
    </svg>
  );
}
