import { useEffect, useRef } from 'react'

/*
 * Procedural pixel-art forest drawn at a low internal resolution
 * (BASE_H px tall) and scaled up with `image-rendering: pixelated`.
 * The static scene is painted once per resize to an offscreen canvas;
 * only the fireflies and falling leaves animate, at a lofi frame rate.
 */

const BASE_H = 180
const FPS = 12

const C = {
  skyTop: '#0b1622',
  skyMid: '#13283a',
  skyLow: '#1d3b3c',
  horizon: '#2c5245',
  moon: '#f3ecc8',
  moonShade: '#d8cf9f',
  halo: '#3a5e58',
  star: '#c9d6c2',
  ridgeFar: '#1d3b36',
  mist: '#4d7461',
  ridgeMid: '#16302a',
  pineMid: '#122820',
  pineMidHi: '#1d3d2c',
  canopy: '#0f2a1c',
  canopyMid: '#1a4a2c',
  canopyHi: '#2f6b3a',
  canopyTop: '#4f8f46',
  trunk: '#1a130e',
  trunkHi: '#2b2016',
  ground: '#0c1c12',
  groundHi: '#16301d',
  grass: '#2f6b3a',
  grassHi: '#5c9a4a',
  fern: '#3d7f3f',
  mushroom: '#c8553d',
  mushroomDot: '#f3ecc8',
  flower: '#e8b7d4',
  flower2: '#f4d35e',
  firefly: '#f4e27a',
  fireflyGlow: '#8a8a3a',
  leafA: '#7fb069',
  leafB: '#d9a441',
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), w, h)
}

/* Dithered vertical blend between two colors over [y0, y1). */
function ditherBand(ctx, W, y0, y1, top, bottom) {
  for (let y = y0; y < y1; y++) {
    const t = (y - y0) / (y1 - y0)
    for (let x = 0; x < W; x++) {
      const threshold = (BAYER[y & 3][x & 3] + 0.5) / 16
      px(ctx, x, y, t > threshold ? bottom : top)
    }
  }
}

function drawPine(ctx, cx, baseY, h, color, hi) {
  const top = baseY - h
  const maxHalf = Math.max(2, Math.round(h * 0.28))
  const tiers = Math.max(2, Math.round(h / 9))
  const tierH = h / tiers
  for (let y = top; y < baseY - 2; y++) {
    const p = (y - top) / h
    const inTier = ((y - top) % tierH) / tierH
    const half = Math.round(maxHalf * (p * 0.75 + inTier * 0.25 * p + 0.05))
    ctx.fillStyle = color
    ctx.fillRect(cx - half, y, half * 2 + 1, 1)
    if (hi && half > 1 && inTier > 0.55) px(ctx, cx - half, y, hi)
  }
  px(ctx, cx, baseY - 3, C.trunk, 1, 3)
}

function drawBlob(ctx, r, cx, cy, radius, colors) {
  const [dark, mid, hi, top] = colors
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const d = Math.sqrt(x * x + y * y) + (r() - 0.5) * 1.6
      if (d > radius) continue
      // light comes from upper-right (the moon)
      const light = (x - y) / (radius * 2) + (r() - 0.5) * 0.35
      let col = dark
      if (light > 0.05) col = mid
      if (light > 0.38) col = hi
      if (light > 0.6 && top) col = top
      px(ctx, cx + x, cy + y, col)
    }
  }
}

function drawTree(ctx, r, cx, baseY, h) {
  const trunkW = Math.max(3, Math.round(h / 12))
  ctx.fillStyle = C.trunk
  ctx.fillRect(cx - Math.floor(trunkW / 2), baseY - h * 0.55, trunkW, h * 0.55 + 2)
  px(ctx, cx + Math.floor(trunkW / 2) - 1, baseY - h * 0.55, C.trunkHi, 1, h * 0.55)
  // roots
  px(ctx, cx - trunkW, baseY - 1, C.trunk, trunkW * 2, 2)
  const blobs = 6 + Math.floor(r() * 4)
  const crownY = baseY - h * 0.7
  for (let i = 0; i < blobs; i++) {
    const bx = cx + (r() - 0.5) * h * 0.55
    const by = crownY + (r() - 0.6) * h * 0.4
    const br = Math.round(h * (0.13 + r() * 0.1))
    drawBlob(ctx, r, bx, by, br, [C.canopy, C.canopyMid, C.canopyHi, C.canopyTop])
  }
}

function drawFern(ctx, r, x, baseY) {
  const fronds = 3 + Math.floor(r() * 3)
  for (let f = 0; f < fronds; f++) {
    const dir = f % 2 === 0 ? 1 : -1
    const len = 4 + Math.floor(r() * 6)
    for (let i = 0; i < len; i++) {
      const fx = x + dir * i
      const fy = baseY - Math.round(Math.sin((i / len) * Math.PI * 0.9) * (len * 0.6)) - f
      px(ctx, fx, fy, i % 3 === 0 ? C.grassHi : C.fern)
    }
  }
}

function drawMushroom(ctx, x, baseY) {
  px(ctx, x, baseY - 2, C.mushroomDot, 1, 2)
  px(ctx, x - 1, baseY - 3, C.mushroom, 3, 1)
  px(ctx, x, baseY - 4, C.mushroom)
  px(ctx, x - 1, baseY - 3, C.mushroomDot)
}

function paintScene(ctx, W, H) {
  const r = rng(1729)
  ctx.clearRect(0, 0, W, H)

  // Sky
  const horizonY = Math.round(H * 0.62)
  ditherBand(ctx, W, 0, Math.round(H * 0.25), C.skyTop, C.skyMid)
  ditherBand(ctx, W, Math.round(H * 0.25), Math.round(H * 0.48), C.skyMid, C.skyLow)
  ditherBand(ctx, W, Math.round(H * 0.48), horizonY, C.skyLow, C.horizon)

  // Stars
  for (let i = 0; i < W * 0.12; i++) {
    const sx = Math.floor(r() * W)
    const sy = Math.floor(r() * H * 0.35)
    px(ctx, sx, sy, r() > 0.8 ? C.moon : C.star)
  }

  // Moon with dithered halo
  const mx = Math.round(W * 0.78)
  const my = Math.round(H * 0.17)
  const mr = 9
  for (let y = -mr * 2; y <= mr * 2; y++) {
    for (let x = -mr * 2; x <= mr * 2; x++) {
      const d = Math.sqrt(x * x + y * y)
      if (d <= mr) {
        const shade = x + y > mr * 0.6 || (r() > 0.93 && d < mr - 2)
        px(ctx, mx + x, my + y, shade ? C.moonShade : C.moon)
      } else if (d <= mr * 1.9) {
        const t = 1 - (d - mr) / (mr * 0.9)
        if (t > (BAYER[(my + y) & 3][(mx + x) & 3] + 0.5) / 16 + 0.25) px(ctx, mx + x, my + y, C.halo)
      }
    }
  }

  // Far ridge of pines
  const farBase = horizonY + 6
  ctx.fillStyle = C.ridgeFar
  ctx.fillRect(0, farBase - 4, W, H - farBase + 4)
  for (let x = -4; x < W + 4; x += 3 + Math.floor(r() * 4)) {
    drawPine(ctx, x, farBase, 12 + Math.floor(r() * 14), C.ridgeFar)
  }

  // Mist layer
  for (let y = farBase - 6; y < farBase + 8; y++) {
    const t = 1 - Math.abs(y - (farBase + 1)) / 8
    for (let x = 0; x < W; x++) {
      const wave = Math.sin(x / 11 + y) * 0.15
      if (t + wave > (BAYER[y & 3][x & 3] + 0.5) / 16 + 0.35) px(ctx, x, y, C.mist)
    }
  }

  // Mid ridge
  const midBase = Math.round(H * 0.8)
  ctx.fillStyle = C.ridgeMid
  ctx.fillRect(0, midBase - 3, W, H - midBase + 3)
  for (let x = -6; x < W + 6; x += 5 + Math.floor(r() * 7)) {
    drawPine(ctx, x, midBase, 22 + Math.floor(r() * 22), C.pineMid, C.pineMidHi)
  }

  // Ground
  const groundY = Math.round(H * 0.88)
  ditherBand(ctx, W, groundY - 2, groundY + 4, C.ridgeMid, C.ground)
  ctx.fillStyle = C.ground
  ctx.fillRect(0, groundY + 4, W, H - groundY - 4)

  // Big foreground trees framing the edges
  const treeH = Math.round(H * 0.75)
  drawTree(ctx, r, Math.round(W * 0.04), groundY + 2, treeH)
  drawTree(ctx, r, Math.round(W * 0.96), groundY + 2, Math.round(treeH * 0.9))
  if (W > 260) drawTree(ctx, r, Math.round(W * 0.62), groundY + 4, Math.round(treeH * 0.55))

  // Grass, ferns, mushrooms, flowers
  for (let x = 0; x < W; x++) {
    const h = Math.floor(r() * 3)
    for (let i = 0; i < h; i++) px(ctx, x, groundY - i, i === h - 1 && r() > 0.6 ? C.grassHi : C.grass)
    if (r() > 0.6) px(ctx, x, groundY + 3 + Math.floor(r() * (H - groundY - 4)), C.groundHi)
  }
  for (let i = 0; i < W / 18; i++) drawFern(ctx, r, Math.floor(r() * W), groundY + 1 + Math.floor(r() * 6))
  for (let i = 0; i < W / 45; i++) drawMushroom(ctx, Math.floor(r() * W), groundY + 4 + Math.floor(r() * 6))
  for (let i = 0; i < W / 14; i++) {
    px(ctx, Math.floor(r() * W), groundY - 1 + Math.floor(r() * 10), r() > 0.5 ? C.flower : C.flower2)
  }
}

function makeParticles(W, H) {
  const r = rng(42)
  const flies = Array.from({ length: Math.round(W / 14) }, () => ({
    x: r() * W,
    y: H * 0.45 + r() * H * 0.5,
    phase: r() * Math.PI * 2,
    speed: 0.15 + r() * 0.25,
    blink: r() * Math.PI * 2,
  }))
  const leaves = Array.from({ length: Math.round(W / 40) }, () => ({
    x: r() * W,
    y: r() * H,
    vy: 0.25 + r() * 0.35,
    sway: r() * Math.PI * 2,
    color: r() > 0.5 ? C.leafA : C.leafB,
  }))
  return { flies, leaves }
}

export default function ForestBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const scene = document.createElement('canvas')
    const sctx = scene.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = BASE_H
    let particles = makeParticles(1, 1)
    let raf = 0
    let last = 0
    let t = 0

    const resize = () => {
      const vw = window.innerWidth || 1280
      const vh = window.innerHeight || 720
      W = Math.min(1200, Math.max(160, Math.round((BASE_H * vw) / vh)))
      canvas.width = scene.width = W
      canvas.height = scene.height = H
      paintScene(sctx, W, H)
      particles = makeParticles(W, H)
      draw()
    }

    const draw = () => {
      if (!scene.width || !scene.height) return
      ctx.drawImage(scene, 0, 0)
      for (const l of particles.leaves) {
        const x = l.x + Math.sin(t * 0.05 + l.sway) * 3
        px(ctx, x, l.y, l.color, 2, 1)
        px(ctx, x + (Math.sin(t * 0.1 + l.sway) > 0 ? 1 : 0), l.y + 1, l.color)
      }
      for (const f of particles.flies) {
        const x = f.x + Math.sin(t * 0.04 * f.speed * 4 + f.phase) * 6
        const y = f.y + Math.cos(t * 0.03 * f.speed * 4 + f.phase) * 4
        const on = Math.sin(t * 0.12 + f.blink) > -0.2
        if (!on) continue
        ctx.globalAlpha = 0.5
        px(ctx, x - 1, y, C.fireflyGlow, 3, 1)
        px(ctx, x, y - 1, C.fireflyGlow, 1, 3)
        ctx.globalAlpha = 1
        px(ctx, x, y, C.firefly)
      }
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (now - last < 1000 / FPS) return
      last = now
      t += 1
      for (const l of particles.leaves) {
        l.y += l.vy
        if (l.y > H) {
          l.y = -2
          l.x = Math.random() * W
        }
      }
      draw()
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduceMotion) raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="forest-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="forest-bg__canvas" />
      <div className="forest-bg__vignette" />
    </div>
  )
}
