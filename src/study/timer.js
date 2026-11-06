/*
 * Focus timer that lives outside React so it keeps counting while the
 * visitor browses other pages. Completed focus sessions "plant" a tree in
 * today's grove (kept in this browser's localStorage only).
 */
import { useSyncExternalStore } from 'react'
import { ambience } from './ambience'

export const MODES = [
  { id: 'focus25', label: '25 min', minutes: 25, focus: true },
  { id: 'focus50', label: '50 min', minutes: 50, focus: true },
  { id: 'focus90', label: '90 min', minutes: 90, focus: true },
  { id: 'break5', label: '5 min break', minutes: 5, focus: false },
]

const STORAGE_KEY = 'study-grove-v1'
const today = () => new Date().toISOString().slice(0, 10)

function loadGrove() {
  try {
    const g = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (g && g.date === today()) return g
    return { date: today(), trees: 0, minutes: 0, totalTrees: g?.totalTrees || 0 }
  } catch {
    return { date: today(), trees: 0, minutes: 0, totalTrees: 0 }
  }
}

function saveGrove(g) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g))
  } catch {
    /* ignore */
  }
}

class FocusTimer {
  constructor() {
    this.listeners = new Set()
    const mode = MODES[0]
    this.state = {
      modeId: mode.id,
      durationMs: mode.minutes * 60_000,
      remainingMs: mode.minutes * 60_000,
      running: false,
      justFinished: false,
      grove: loadGrove(),
    }
    this.endAt = 0
    this.interval = null
  }

  subscribe = (fn) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = () => this.state

  set(patch) {
    this.state = { ...this.state, ...patch }
    this.listeners.forEach((fn) => fn())
  }

  get mode() {
    return MODES.find((m) => m.id === this.state.modeId)
  }

  setMode(id) {
    const mode = MODES.find((m) => m.id === id)
    if (!mode) return
    this.stopInterval()
    this.set({ modeId: id, durationMs: mode.minutes * 60_000, remainingMs: mode.minutes * 60_000, running: false, justFinished: false })
  }

  start() {
    if (this.state.running) return
    const remaining = this.state.remainingMs > 0 ? this.state.remainingMs : this.state.durationMs
    this.endAt = Date.now() + remaining
    this.set({ running: true, remainingMs: remaining, justFinished: false })
    this.interval = setInterval(this.tick, 250)
  }

  pause() {
    if (!this.state.running) return
    this.stopInterval()
    this.set({ running: false, remainingMs: Math.max(0, this.endAt - Date.now()) })
  }

  reset() {
    this.stopInterval()
    this.set({ running: false, remainingMs: this.state.durationMs, justFinished: false })
  }

  stopInterval() {
    clearInterval(this.interval)
    this.interval = null
  }

  tick = () => {
    const remaining = Math.max(0, this.endAt - Date.now())
    if (remaining > 0) {
      this.set({ remainingMs: remaining })
      return
    }
    this.stopInterval()
    let grove = this.state.grove
    if (grove.date !== today()) grove = { date: today(), trees: 0, minutes: 0, totalTrees: grove.totalTrees }
    if (this.mode.focus) {
      grove = {
        ...grove,
        trees: grove.trees + 1,
        minutes: grove.minutes + this.mode.minutes,
        totalTrees: (grove.totalTrees || 0) + 1,
      }
      saveGrove(grove)
    }
    this.set({ running: false, remainingMs: 0, justFinished: true, grove })
    ambience.chime()
  }
}

export const focusTimer = new FocusTimer()

export function useFocusTimer() {
  return useSyncExternalStore(focusTimer.subscribe, focusTimer.getSnapshot)
}

export function formatClock(ms) {
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
