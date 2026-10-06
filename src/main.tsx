import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { PAGES, TOOLS } from './pages'
import { LEGAL, EMAIL } from './legal'
import { confetti } from './fx'
import './style.css'

const BRAND = 'Pickora'
const COLORS = ['#FF6B4A', '#FFD25E', '#7FD8B0', '#7CC4F0', '#B9A6F2', '#FFA45C']

/* fair randomness */
const rnd = (n: number) => { const m = Math.floor(0x100000000 / n) * n, a = new Uint32Array(1)
  do crypto.getRandomValues(a); while (a[0] >= m); return a[0] % n }
const shuffle = <T,>(l: T[]) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]] } return a }

function useSaved<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, set] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init } })
  return [v, (x: T) => { set(x); try { localStorage.setItem(key, JSON.stringify(x)) } catch { /* ignore */ } }]
}
const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); return true } catch { return false } }
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* wheel */
function Wheel({ opts, rot, ms, onSpin, busy }: { opts: string[]; rot: number; ms: number; onSpin: () => void; busy: boolean }) {
  const n = opts.length, a = 360 / n, R = 150
  const pt = (d: number) => [R + R * Math.sin(d * Math.PI / 180), R - R * Math.cos(d * Math.PI / 180)]
  return <div className="wheelbox">
    <div className="pointer" aria-hidden="true" />
    <svg viewBox="0 0 300 300" className="wheel" style={{ transform: `rotate(${rot}deg)`, transition: `transform ${ms}ms cubic-bezier(.12,.6,.1,1)` }} aria-hidden="true">
      {n === 1 ? <circle cx={R} cy={R} r={R} fill={COLORS[0]} /> : opts.map((o, i) => { const [x1, y1] = pt(i * a), [x2, y2] = pt((i + 1) * a)
        return <g key={i}><path d={`M${R},${R} L${x1},${y1} A${R},${R} 0 ${a > 180 ? 1 : 0} 1 ${x2},${y2}Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="2" />
          <text x={R} y={R} transform={`rotate(${(i + .5) * a - 90} ${R} ${R})`} textAnchor="end" dx={R - 14} dy="5" fontSize={n > 12 ? 10 : 14} fontWeight="700" fill="#1b1b1f">{o.length > 14 ? o.slice(0, 13) + '…' : o}</text></g> })}
    </svg>
    <button className="spin" onClick={onSpin} disabled={busy} aria-label="Spin the wheel">SPIN</button>
  </div>
}

function WheelTool({ id, start, names }: { id: string; start: string[]; names?: boolean }) {
  const [opts, setOpts] = useSaved<string[]>('pk-' + id, start)
  const [rot, setRot] = useState(0), [ms, setMs] = useState(0), [busy, setBusy] = useState(false)
  const [res, setRes] = useState(''), [win, setWin] = useState<number | null>(null), [msg, setMsg] = useState('')
  const clean = opts.map(o => o.trim()).filter(Boolean)
  const spin = () => {
    if (clean.length < 2) { setMsg('Add at least two options to spin.'); return }
    setMsg(''); const w = rnd(clean.length), a = 360 / clean.length, d = reduced() ? 0 : 4200
    setBusy(true); setMs(d); setRot(r => r - (r % 360) + 360 * 6 - (w + .5) * a)
    setTimeout(() => { setRes(clean[w]); setBusy(false); setWin(w); confetti() }, d + 50)
  }
  const set = (i: number, v: string) => setOpts(opts.map((o, k) => k === i ? v : o))
  const remove = () => { let c = -1; setOpts(opts.filter(o => { if (!o.trim()) return true; c++; return c !== win })); setWin(null) }
  useEffect(() => { if (win === null) return; const f = (e: KeyboardEvent) => { if (e.key === 'Escape') setWin(null) }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f) }, [win])
  return <div className="tool two">
    <div>{clean.length ? <Wheel opts={clean} rot={rot} ms={ms} onSpin={spin} busy={busy} /> : <p className="msg">Add some options to begin.</p>}</div>
    <div className="panel">
      <div className="result" role="status" aria-live="polite">{res ? <><small>Your result</small><b>{res}</b>
        <button className="btn ghost" onClick={async () => setMsg(await copy(res) ? 'Copied!' : 'Could not copy.')}>Copy</button></> : <small>Spin to get a result</small>}</div>
      <h2 className="lbl">Options</h2>
      {names ? <textarea aria-label="Names, one per line" rows={10} value={opts.join('\n')} onChange={e => setOpts(e.target.value.split('\n'))} /> : opts.map((o, i) => <div className="row" key={i}><input aria-label={`Option ${i + 1}`} value={o} maxLength={60} onChange={e => set(i, e.target.value)} />
        <button className="x" aria-label={`Remove option ${i + 1}`} onClick={() => setOpts(opts.filter((_, k) => k !== i))}>×</button></div>)}
      <div className="btns"><button className="btn" onClick={() => opts.length < 24 && setOpts([...opts, ''])}>+ Add</button>
        <button className="btn" onClick={() => setOpts(shuffle(opts))}>Shuffle</button>
        <button className="btn" onClick={() => { setOpts(start); setRes('') }}>Reset</button></div>
      {msg && <p className="msg" role="alert">{msg}</p>}
    </div>
    {win !== null && <div className="ov" onClick={() => setWin(null)}><div className="dlg" role="dialog" aria-modal="true" aria-label="Winner" onClick={e => e.stopPropagation()}>
      <div className="dh">And the winner is</div><div className="db"><b>{clean[win]}</b></div>
      <div className="da"><button className="btn" autoFocus onClick={() => setWin(null)}>Close</button><button className="btn big" onClick={remove}>Remove</button></div></div></div>}
    </div>
}

function Coin() {
  const [side, setSide] = useState('Heads'), [rot, setRot] = useState(0), [busy, setBusy] = useState(false)
  const [c, setC] = useSaved('pk-coin', { Heads: 0, Tails: 0 })
  const flip = () => { const s = rnd(2) ? 'Tails' : 'Heads', d = reduced() ? 0 : 1200; setBusy(true)
    setRot(r => r - (r % 360) + 360 * 5 + (s === 'Tails' ? 180 : 0))
    setTimeout(() => { setSide(s); setBusy(false); setC({ ...c, [s]: c[s as 'Heads'] + 1 }) }, d) }
  return <div className="tool center">
    <div className="coinwrap"><div className="coin" style={{ transform: `rotateY(${rot}deg)` }}><span className="f h">H</span><span className="f t">T</span></div></div>
    <div className="result" role="status" aria-live="polite"><small>Result</small><b>{side}</b></div>
    <button className="btn big" onClick={flip} disabled={busy}>FLIP</button>
    <p className="count">Heads {c.Heads} · Tails {c.Tails} <button className="lk" onClick={() => setC({ Heads: 0, Tails: 0 })}>Reset</button></p></div>
}

function Num() {
  const [min, setMin] = useState(1), [max, setMax] = useState(100), [cnt, setCnt] = useState(1), [nd, setNd] = useState(true)
  const [out, setOut] = useState<number[]>([]), [msg, setMsg] = useState('')
  const go = () => {
    if (![min, max, cnt].every(Number.isInteger)) return setMsg('Please enter whole numbers.')
    if (min > max) return setMsg('Minimum must not be bigger than maximum.')
    if (cnt < 1 || cnt > 100) return setMsg('Choose between 1 and 100 numbers.')
    const span = max - min + 1; if (nd && cnt > span) return setMsg(`Only ${span} different numbers fit in that range.`)
    setMsg(''); const r: number[] = []
    while (r.length < cnt) { const v = min + rnd(span); if (!nd || !r.includes(v)) r.push(v) }
    setOut(r)
  }
  const f = (l: string, v: number, s: (n: number) => void) => <label className="fld">{l}<input type="number" value={v} onChange={e => s(parseInt(e.target.value))} /></label>
  return <div className="tool two"><div className="panel">{f('Minimum', min, setMin)}{f('Maximum', max, setMax)}{f('How many numbers', cnt, setCnt)}
    <label className="chk"><input type="checkbox" checked={nd} onChange={e => setNd(e.target.checked)} /> No duplicates</label>
    <button className="btn big" onClick={go}>GENERATE</button>{msg && <p className="msg" role="alert">{msg}</p>}</div>
    <div className="result big" role="status" aria-live="polite">{out.length ? <><small>Your numbers</small><b className="nums">{out.join(', ')}</b>
      <button className="btn ghost" onClick={() => copy(out.join(', '))}>Copy</button></> : <small>Press Generate</small>}</div></div>
}

function Teams() {
  const [txt, setTxt] = useState(''), [k, setK] = useState(2), [teams, setTeams] = useState<string[][]>([]), [msg, setMsg] = useState('')
  const go = () => {
    const names = txt.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    if (names.length < 2) return setMsg('Add at least two names.')
    const n = Math.min(Math.max(1, k || 1), names.length), t: string[][] = Array.from({ length: n }, () => [])
    shuffle(names).forEach((nm, i) => t[i % n].push(nm)); setMsg(''); setTeams(t)
  }
  return <div className="tool two"><div className="panel"><label className="fld">Names (one per line or comma separated)<textarea rows={8} value={txt} onChange={e => setTxt(e.target.value)} /></label>
    <label className="fld">Number of teams<input type="number" min={1} value={k} onChange={e => setK(parseInt(e.target.value))} /></label>
    <button className="btn big" onClick={go}>{teams.length ? 'SHUFFLE AGAIN' : 'MAKE TEAMS'}</button>{msg && <p className="msg" role="alert">{msg}</p>}</div>
    <div role="status" aria-live="polite">{teams.map((t, i) => <div className="team" key={i}><h3>Team {i + 1}</h3><p>{t.join(', ')}</p></div>)}
      {teams.length > 0 && <button className="btn ghost" onClick={() => copy(teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n'))}>Copy teams</button>}</div></div>
}

function Foot() {
  return <footer className="ft"><p>{BRAND}. Free tools that run in your browser. Nothing you enter is sent anywhere.</p>
    <p><a href="/about">About</a> · <a href="/privacy-policy">Privacy Policy</a> · <a href="/contact">Contact</a></p></footer>
}

function App() {
  const id = document.body.dataset.page || 'home', p = PAGES[id], lg = LEGAL[id]
  if (lg) return <>
    <header className="hd"><a className="logo" href="/"><i />{BRAND}</a></header>
    <main><section className="top"><h1>{lg.h}</h1></section>
      <section className="txt" style={{ borderTop: 0, marginTop: 0 }}>{lg.b.map(([t, x]) => <div key={t}><h2>{t}</h2><p>{x.split(EMAIL).flatMap((part, i, a) => i < a.length - 1 ? [part, <a key={i} href={'mailto:' + EMAIL}>{EMAIL}</a>] : [part])}</p></div>)}</section></main>
    <Foot /></>
  const here = id === 'home' ? '/' : '/' + id
  const tool = id === 'home' ? <WheelTool id="wheel-of-names" names start={['Hanna', 'Beatriz', 'Fatima', 'Gabriel', 'Ali', 'Diya', 'Charles', 'Eric']} /> : id === 'yes-or-no-wheel' ? <WheelTool id={id} start={['Yes', 'No']} /> : id === 'what-to-eat-wheel' ? <WheelTool id={id} start={['Pizza', 'Burger', 'Pasta', 'Indian', 'Chinese', 'Mexican', 'Sushi', 'Salad']} />
    : id === 'flip-a-coin' ? <Coin /> : id === 'random-number-generator' ? <Num /> : id === 'team-picker' ? <Teams /> : null
  return <>
    <header className="hd"><a className="logo" href="/"><i />{BRAND}</a></header>
    <main>
      <nav className="tabs" aria-label="Tools">{TOOLS.map(t => <a key={t.path} className="tab" href={t.path} aria-current={t.path === here ? 'page' : undefined}>{t.name}</a>)}</nav>
      <section className="top"><h1>{p.h1}</h1><p className="lead">{p.intro}</p></section>
      <section aria-label="Tool">{tool}</section>
      <div className="ad" aria-hidden="true" />
      <section className="txt"><h2>How to use</h2><p>{p.how}</p><h2>Tips</h2><ul>{p.tips.map(t => <li key={t}>{t}</li>)}</ul>
        <h2>FAQ</h2>{p.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      {tool && <section className="txt"><h2>More free tools</h2><ul className="more">{TOOLS.filter(t => t.path !== here).map(t => <li key={t.path}><a href={t.path}>{t.name}</a></li>)}</ul></section>}
    </main>
    <Foot /></>
}
createRoot(document.getElementById('root')!).render(<App />)
