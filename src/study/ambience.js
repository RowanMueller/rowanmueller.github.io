/*
 * Procedural forest ambience built on the Web Audio API.
 * Every sound is synthesized in the browser (noise + oscillators), so there
 * are no audio files to host or license and nothing ever loops audibly.
 *
 * A single engine lives for the whole app so sound keeps playing while the
 * visitor moves between pages. React reads it through useAmbience().
 */
import { useSyncExternalStore } from 'react'

export const CHANNELS = [
  { id: 'rain', label: 'Rain', icon: 'rain', volume: 0.55 },
  { id: 'wind', label: 'Wind in the pines', icon: 'leaf', volume: 0.35 },
  { id: 'stream', label: 'Creek', icon: 'stream', volume: 0.4 },
  { id: 'birds', label: 'Songbirds', icon: 'bird', volume: 0.35 },
  { id: 'crickets', label: 'Crickets', icon: 'moon', volume: 0.3 },
  { id: 'fire', label: 'Campfire', icon: 'fire', volume: 0.2 },
  { id: 'lofi', label: 'Lofi keys', icon: 'note', volume: 0.5 },
]

export const PRESETS = [
  { id: 'lofi-fire', label: 'Lofi campfire', on: ['lofi', 'fire'] },
  { id: 'rainy', label: 'Rainy forest', on: ['rain', 'wind', 'lofi'] },
  { id: 'morning', label: 'Morning creek', on: ['stream', 'birds', 'wind'] },
  { id: 'night', label: 'Night camp', on: ['crickets', 'fire', 'lofi'] },
  { id: 'deep', label: 'Deep focus', on: ['rain', 'stream'] },
]

const STORAGE_KEY = 'study-ambience-v2'

// What plays the first time someone presses play: lofi keys (medium) + a low campfire
export const DEFAULT_MIX = ['lofi', 'fire']
const LOOKAHEAD = 1.5 // seconds scheduled ahead (survives background-tab timer throttling)

function loadSettings() {
  const defaults = {
    master: 0.7,
    channels: Object.fromEntries(
      CHANNELS.map((c) => [c.id, { on: DEFAULT_MIX.includes(c.id), volume: c.volume }]),
    ),
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved) return defaults
    for (const c of CHANNELS) {
      if (saved.channels?.[c.id]) defaults.channels[c.id] = { ...defaults.channels[c.id], ...saved.channels[c.id] }
    }
    if (typeof saved.master === 'number') defaults.master = saved.master
  } catch {
    /* storage unavailable: use defaults */
  }
  return defaults
}

function saveSettings(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ master: state.master, channels: state.channels }))
  } catch {
    /* ignore */
  }
}

/* ---------- noise buffers ---------- */
function makeNoise(ctx, kind, seconds = 4) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      if (kind === 'white') d[i] = w * 0.5
      else if (kind === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179
        b1 = 0.99332 * b1 + w * 0.0750759
        b2 = 0.969 * b2 + w * 0.153852
        b3 = 0.8665 * b3 + w * 0.3104856
        b4 = 0.55 * b4 + w * 0.5329522
        b5 = -0.7616 * b5 - w * 0.016898
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
        b6 = w * 0.115926
      } else {
        last = (last + 0.02 * w) / 1.02
        d[i] = last * 3.5
      }
    }
    // crossfade the ends so the loop point is seamless
    const fade = Math.floor(ctx.sampleRate * 0.05)
    for (let i = 0; i < fade; i++) {
      const t = i / fade
      d[len - fade + i] = d[len - fade + i] * (1 - t) + d[i] * t
    }
  }
  return buf
}

function loopSource(ctx, buffer) {
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  src.loopStart = 0.05
  src.start(0, Math.random() * buffer.duration)
  return src
}

function lfo(ctx, freq, depth, target) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.frequency.value = freq
  g.gain.value = depth
  osc.connect(g).connect(target)
  osc.start()
  return osc
}

const rand = (a, b) => a + Math.random() * (b - a)

/* ---------- continuous layers ---------- */
const BUILDERS = {
  rain(ctx, out, noise) {
    const src = loopSource(ctx, noise.pink)
    const hp = new BiquadFilterNode(ctx, { type: 'highpass', frequency: 450 })
    const lp = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 7500 })
    const g = new GainNode(ctx, { gain: 0.9 })
    src.connect(hp).connect(lp).connect(g).connect(out)
    const rumble = loopSource(ctx, noise.brown)
    const rlp = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 220 })
    const rg = new GainNode(ctx, { gain: 0.35 })
    rumble.connect(rlp).connect(rg).connect(out)
  },
  wind(ctx, out, noise) {
    const src = loopSource(ctx, noise.brown)
    const bp = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: 420, Q: 0.6 })
    const g = new GainNode(ctx, { gain: 0.7 })
    src.connect(bp).connect(g).connect(out)
    lfo(ctx, 0.06, 260, bp.frequency)
    lfo(ctx, 0.11, 0.35, g.gain)
  },
  stream(ctx, out, noise) {
    const src = loopSource(ctx, noise.white)
    const bp = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: 1600, Q: 0.8 })
    const bp2 = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: 650, Q: 1.2 })
    const lp = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 4200 })
    const g = new GainNode(ctx, { gain: 0.55 })
    src.connect(bp).connect(lp)
    src.connect(bp2).connect(lp)
    lp.connect(g).connect(out)
    lfo(ctx, 3.1, 380, bp.frequency)
    lfo(ctx, 0.23, 120, bp2.frequency)
    lfo(ctx, 5.7, 0.12, g.gain)
  },
  fire(ctx, out, noise) {
    const src = loopSource(ctx, noise.brown)
    const lp = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 320 })
    const g = new GainNode(ctx, { gain: 0.8 })
    src.connect(lp).connect(g).connect(out)
    lfo(ctx, 0.4, 0.2, g.gain)
  },
}

/* ---------- scheduled (event) layers ---------- */
const SCHEDULERS = {
  birds(ctx, out, t) {
    const pan = new StereoPannerNode(ctx, { pan: rand(-0.8, 0.8) })
    pan.connect(out)
    const notes = Math.floor(rand(2, 6))
    const base = rand(2400, 4600)
    let at = t
    for (let i = 0; i < notes; i++) {
      const dur = rand(0.06, 0.16)
      const osc = new OscillatorNode(ctx, { type: 'sine', frequency: base * rand(0.85, 1.15) })
      osc.frequency.exponentialRampToValueAtTime(base * rand(0.65, 1.45), at + dur)
      const g = new GainNode(ctx, { gain: 0 })
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(rand(0.25, 0.45), at + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0008, at + dur)
      osc.connect(g).connect(pan)
      osc.start(at)
      osc.stop(at + dur + 0.02)
      at += dur + rand(0.03, 0.12)
    }
    return t + rand(1.4, 6)
  },
  crickets(ctx, out, t) {
    const pan = new StereoPannerNode(ctx, { pan: rand(-0.9, 0.9) })
    pan.connect(out)
    const freq = rand(4200, 4900)
    const osc = new OscillatorNode(ctx, { type: 'sine', frequency: freq })
    const g = new GainNode(ctx, { gain: 0 })
    osc.connect(g).connect(pan)
    const pulses = Math.floor(rand(3, 5))
    let at = t
    for (let i = 0; i < pulses; i++) {
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.22, at + 0.006)
      g.gain.linearRampToValueAtTime(0, at + 0.022)
      at += 0.042
    }
    osc.start(t)
    osc.stop(at + 0.05)
    return t + rand(0.25, 0.9)
  },
  fire(ctx, out, t, noise) {
    const src = ctx.createBufferSource()
    src.buffer = noise.white
    const bp = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: rand(1200, 4500), Q: rand(0.8, 3) })
    const g = new GainNode(ctx, { gain: 0 })
    const dur = rand(0.004, 0.025)
    g.gain.setValueAtTime(rand(0.3, 0.9), t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(bp).connect(g).connect(out)
    src.start(t, rand(0, 3))
    src.stop(t + dur + 0.01)
    return t + (Math.random() < 0.25 ? rand(0.02, 0.08) : rand(0.08, 0.45))
  },
  lofi(ctx, out, t, _noise, state) {
    // Fmaj7 - Em7 - Dm7 - Cmaj7, one chord per bar at ~70 bpm
    const CHORDS = [
      [53, 57, 60, 64],
      [52, 55, 59, 62],
      [50, 53, 57, 60],
      [48, 52, 55, 59],
    ]
    const bar = 60 / 70 * 4
    const chord = CHORDS[state.bar % CHORDS.length]
    state.bar += 1
    const lp = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 1100, Q: 0.4 })
    lp.connect(out)
    const hz = (m) => 440 * 2 ** ((m - 69) / 12)
    chord.forEach((m, i) => {
      const at = t + i * 0.035 // gentle strum
      const osc = new OscillatorNode(ctx, { type: 'triangle', frequency: hz(m), detune: rand(-7, 7) })
      const g = new GainNode(ctx, { gain: 0 })
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.07, at + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, at + bar * 0.95)
      osc.connect(g).connect(lp)
      osc.start(at)
      osc.stop(at + bar)
    })
    const bass = new OscillatorNode(ctx, { type: 'sine', frequency: hz(chord[0] - 12) })
    const bg = new GainNode(ctx, { gain: 0 })
    bg.gain.setValueAtTime(0, t)
    bg.gain.linearRampToValueAtTime(0.12, t + 0.05)
    bg.gain.exponentialRampToValueAtTime(0.001, t + bar * 0.9)
    bass.connect(bg).connect(out)
    bass.start(t)
    bass.stop(t + bar)
    return t + bar
  },
}

class AmbienceEngine {
  constructor() {
    this.listeners = new Set()
    const saved = loadSettings()
    this.state = { playing: false, master: saved.master, channels: saved.channels }
    this.ctx = null
    this.nodes = {}
    this.next = {}
    this.lofiState = { bar: 0 }
    this.timer = null
  }

  subscribe = (fn) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = () => this.state

  set(patch) {
    this.state = { ...this.state, ...patch }
    saveSettings(this.state)
    this.listeners.forEach((fn) => fn())
  }

  ensureContext() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    this.ctx = new Ctx()
    const ctx = this.ctx
    this.noise = { white: makeNoise(ctx, 'white'), pink: makeNoise(ctx, 'pink'), brown: makeNoise(ctx, 'brown') }
    this.masterGain = new GainNode(ctx, { gain: 0 })
    const comp = new DynamicsCompressorNode(ctx, { threshold: -18, ratio: 3 })
    this.masterGain.connect(comp).connect(ctx.destination)
    for (const c of CHANNELS) {
      const g = new GainNode(ctx, { gain: 0 })
      g.connect(this.masterGain)
      this.nodes[c.id] = { gain: g, built: false }
    }
  }

  buildChannel(id) {
    const node = this.nodes[id]
    if (node.built) return
    node.built = true
    BUILDERS[id]?.(this.ctx, node.gain, this.noise)
  }

  applyGains(ramp = 0.4) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const { master, channels, playing } = this.state
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setTargetAtTime(playing ? master : 0, now, ramp / 3)
    for (const c of CHANNELS) {
      const ch = channels[c.id]
      if (ch.on) this.buildChannel(c.id)
      const g = this.nodes[c.id].gain.gain
      g.cancelScheduledValues(now)
      g.setTargetAtTime(ch.on ? ch.volume : 0, now, ramp / 3)
    }
  }

  tick = () => {
    const ctx = this.ctx
    if (!ctx || !this.state.playing) return
    const horizon = ctx.currentTime + LOOKAHEAD
    for (const id of Object.keys(SCHEDULERS)) {
      if (!this.state.channels[id]?.on) {
        this.next[id] = null
        continue
      }
      if (this.next[id] == null || this.next[id] < ctx.currentTime) this.next[id] = ctx.currentTime + 0.05
      while (this.next[id] < horizon) {
        this.next[id] = SCHEDULERS[id](ctx, this.nodes[id].gain, this.next[id], this.noise, this.lofiState)
      }
    }
  }

  async play() {
    this.ensureContext()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.set({ playing: true })
    this.applyGains(0.8)
    this.tick()
    clearInterval(this.timer)
    this.timer = setInterval(this.tick, 200)
  }

  pause() {
    this.set({ playing: false })
    this.applyGains(0.5)
    clearInterval(this.timer)
    this.timer = null
    this.next = {}
    const ctx = this.ctx
    setTimeout(() => {
      if (ctx && !this.state.playing) ctx.suspend()
    }, 700)
  }

  toggle() {
    return this.state.playing ? this.pause() : this.play()
  }

  setMaster(v) {
    this.set({ master: v })
    this.applyGains(0.1)
  }

  setChannel(id, patch) {
    this.set({ channels: { ...this.state.channels, [id]: { ...this.state.channels[id], ...patch } } })
    this.applyGains(0.3)
  }

  applyPreset(presetId) {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const channels = { ...this.state.channels }
    for (const c of CHANNELS) channels[c.id] = { ...channels[c.id], on: preset.on.includes(c.id) }
    this.set({ channels })
    this.applyGains(0.8)
    if (!this.state.playing) this.play()
  }

  /* soft two-note bell for timer completion; plays even if ambience is paused */
  chime() {
    this.ensureContext()
    const ctx = this.ctx
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime + 0.05
    ;[880, 1318.5].forEach((f, i) => {
      const at = t + i * 0.28
      const osc = new OscillatorNode(ctx, { type: 'sine', frequency: f })
      const g = new GainNode(ctx, { gain: 0 })
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.18, at + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0005, at + 2.2)
      osc.connect(g).connect(ctx.destination)
      osc.start(at)
      osc.stop(at + 2.3)
    })
    if (!this.state.playing) setTimeout(() => !this.state.playing && ctx.suspend(), 3000)
  }
}

export const ambience = new AmbienceEngine()

export function useAmbience() {
  return useSyncExternalStore(ambience.subscribe, ambience.getSnapshot)
}
