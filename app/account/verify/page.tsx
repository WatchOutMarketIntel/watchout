'use client';
import { useEffect, useState } from 'react';

// Magic-link verification page (dormant — there is no login entry point yet).
// The token arrives in the URL FRAGMENT (#token=...), which browsers never send
// to a server (absent from access logs and Referer). We read it, POST it to the
// API, and scrub it from the address bar immediately. The API sets an HttpOnly
// session cookie (credentials: 'include'); the token never touches JS storage.
const API = (process.env.NEXT_PUBLIC_API_URL || 'https://watchout-api-production.up.railway.app').replace(/\/+$/, '');

export default function Verify() {
  const [state, setState] = useState<'working' | 'ok' | 'error'>('working');

  useEffect(() => {
    const frag = (window.location.hash || '').replace(/^#/, '');
    const token = new URLSearchParams(frag).get('token') || '';
    // Scrub the token from the URL before anything else.
    try { history.replaceState(null, '', window.location.pathname); } catch {}
    if (!token) { setState('error'); return; }
    fetch(`${API}/auth/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => setState(d && d.ok ? 'ok' : 'error'))
      .catch(() => setState('error'));
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--paper:#F3ECDB;--surface:#FBF6EA;--line:#E6DCC6;--ink:#16140E;--ink-2:#6A6253;--red:#A8362B;
          --serif:var(--font-serif),Georgia,serif;--sans:var(--font-sans),system-ui,sans-serif;}
        body{font-family:var(--sans);background:var(--paper);color:var(--ink);-webkit-font-smoothing:antialiased;}
        .wrap{max-width:460px;margin:0 auto;padding:5rem 1.25rem;text-align:center;}
        .logo{font-family:var(--serif);font-size:1.5rem;font-weight:600;margin-bottom:2rem;}
        .logo em{color:var(--red);font-style:normal;}
        .card{background:var(--surface);border:1px solid var(--line);border-top:2px solid var(--red);padding:2rem;}
        .h{font-family:var(--serif);font-size:1.4rem;font-weight:500;margin-bottom:0.5rem;}
        .d{font-size:0.9rem;color:var(--ink-2);line-height:1.6;}
        .cta{display:inline-block;margin-top:1.2rem;font-size:0.86rem;font-weight:600;padding:0.6rem 1.3rem;background:var(--ink);color:var(--paper);}
      `}</style>
      <div className="wrap">
        <div className="logo">Watch<em>Out</em></div>
        <div className="card">
          {state === 'working' && <><div className="h">Signing you in…</div><p className="d">Verifying your secure link.</p></>}
          {state === 'ok' && <><div className="h">You&rsquo;re signed in</div><p className="d">Your session is set. You can head back to the market.</p><a className="cta" href="/">Go to WatchOut</a></>}
          {state === 'error' && <><div className="h">This link didn&rsquo;t work</div><p className="d">It may have expired, already been used, or be incomplete. Request a fresh sign-in link and try again.</p><a className="cta" href="/">Return home</a></>}
        </div>
      </div>
    </>
  );
}
