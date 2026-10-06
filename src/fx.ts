/* Confetti. Cosmetic only, never used to pick a result. */
export function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const cv = document.createElement('canvas')
  cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:49'
  cv.width = window.innerWidth; cv.height = window.innerHeight; document.body.appendChild(cv)
  const x = cv.getContext('2d'); if (!x) return
  const cols = ['#FF6B4A', '#FFD25E', '#7FD8B0', '#7CC4F0', '#B9A6F2', '#FFA45C']
  const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5, vx: Math.random() * 4 - 2, vy: 2 + Math.random() * 4,
    r: Math.random() * 6, vr: Math.random() * 0.3 - 0.15, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)] }))
  const t0 = performance.now()
  const tick = (t: number) => {
    x.clearRect(0, 0, cv.width, cv.height)
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore() }
    if (t - t0 < 3800) requestAnimationFrame(tick); else cv.remove()
  }
  requestAnimationFrame(tick)
}
