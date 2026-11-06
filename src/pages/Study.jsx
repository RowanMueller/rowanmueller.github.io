import PixelIcon from '../components/PixelIcon'
import TreeSprite, { TREE_STAGES } from '../study/TreeSprite'
import { ambience, useAmbience, CHANNELS, PRESETS } from '../study/ambience'
import { focusTimer, useFocusTimer, MODES, formatClock } from '../study/timer'
import '../styles/study.css'

function treeStage(progress, finished) {
  if (finished) return TREE_STAGES - 1
  return Math.min(TREE_STAGES - 2, Math.floor(progress * (TREE_STAGES - 1)))
}

function FocusCard() {
  const t = useFocusTimer()
  const mode = MODES.find((m) => m.id === t.modeId)
  const progress = 1 - t.remainingMs / t.durationMs
  const started = t.running || t.remainingMs < t.durationMs

  let status = mode.focus ? 'Plant a seed and start focusing.' : 'Take a breather.'
  if (t.running) status = mode.focus ? 'Growing… stay with it.' : 'On a break.'
  else if (t.justFinished) status = mode.focus ? 'A tree was planted in your grove!' : 'Break over. Ready for another?'
  else if (started) status = 'Paused.'

  return (
    <section className="study-card study-focus" aria-labelledby="focus-title">
      <h2 id="focus-title" className="welcome-section__title">Focus timer</h2>

      <div className="study-focus__tree">
        {mode.focus ? (
          <TreeSprite stage={treeStage(progress, t.justFinished)} size={160} title="Your growing tree" />
        ) : (
          <TreeSprite stage={TREE_STAGES - 1} size={160} title="Resting tree" />
        )}
        <div className="study-focus__progress" aria-hidden="true">
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>

      <p className="study-focus__clock" role="timer" aria-live="off">{formatClock(t.remainingMs)}</p>
      <p className="study-focus__status" aria-live="polite">{status}</p>

      <div className="study-chips" role="radiogroup" aria-label="Session length">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={t.modeId === m.id}
            className={`study-chip ${t.modeId === m.id ? 'study-chip--active' : ''}`}
            onClick={() => focusTimer.setMode(m.id)}
            disabled={t.running}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="study-controls">
        {t.running ? (
          <button type="button" className="study-btn study-btn--primary" onClick={() => focusTimer.pause()}>
            <PixelIcon name="pause" size={14} /> Pause
          </button>
        ) : (
          <button type="button" className="study-btn study-btn--primary" onClick={() => focusTimer.start()}>
            <PixelIcon name="play" size={14} /> {started && !t.justFinished ? 'Resume' : 'Start'}
          </button>
        )}
        <button type="button" className="study-btn" onClick={() => focusTimer.reset()} disabled={!started && !t.justFinished}>
          Reset
        </button>
      </div>
    </section>
  )
}

function MixerCard() {
  const a = useAmbience()

  return (
    <section className="study-card study-mixer" aria-labelledby="mixer-title">
      <h2 id="mixer-title" className="welcome-section__title">Forest sounds</h2>

      <div className="study-mixer__top">
        <button
          type="button"
          className={`study-play ${a.playing ? 'study-play--on' : ''}`}
          onClick={() => ambience.toggle()}
          aria-pressed={a.playing}
          aria-label={a.playing ? 'Pause forest sounds' : 'Play forest sounds'}
        >
          <PixelIcon name={a.playing ? 'pause' : 'play'} size={28} />
        </button>
        <label className="study-slider study-slider--master">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={a.master}
            onChange={(e) => ambience.setMaster(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="study-chips study-presets" aria-label="Presets">
        {PRESETS.map((p) => (
          <button key={p.id} type="button" className="study-chip" onClick={() => ambience.applyPreset(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      <ul className="study-channels">
        {CHANNELS.map((c) => {
          const ch = a.channels[c.id]
          return (
            <li key={c.id} className={`study-channel ${ch.on ? 'study-channel--on' : ''}`}>
              <button
                type="button"
                className="study-channel__toggle"
                aria-pressed={ch.on}
                onClick={() => ambience.setChannel(c.id, { on: !ch.on })}
              >
                <PixelIcon name={c.icon} size={18} />
                <span>{c.label}</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={ch.volume}
                aria-label={`${c.label} volume`}
                onChange={(e) => ambience.setChannel(c.id, { volume: Number(e.target.value), on: true })}
              />
            </li>
          )
        })}
      </ul>
      <p className="study-note">All sounds are generated live in your browser. Keeps playing while you browse the site.</p>
    </section>
  )
}

function Grove() {
  const t = useFocusTimer()
  const { trees, minutes, totalTrees } = t.grove
  return (
    <section className="study-card study-grove" aria-labelledby="grove-title">
      <h2 id="grove-title" className="welcome-section__title">Today&apos;s grove</h2>
      {trees === 0 ? (
        <p className="study-grove__empty">No trees yet today. Finish a focus session to plant one.</p>
      ) : (
        <div className="study-grove__trees">
          {Array.from({ length: trees }, (_, i) => (
            <TreeSprite key={i} stage={TREE_STAGES - 1} size={48} />
          ))}
        </div>
      )}
      <p className="study-grove__stats">
        <span>{trees} tree{trees === 1 ? '' : 's'} today</span>
        <span>{minutes} min focused</span>
        <span>{totalTrees} planted all-time</span>
      </p>
    </section>
  )
}

export default function Study() {
  return (
    <section className="welcome-page">
      <div className="welcome-content study">
        <h1 className="welcome-title">Study with me</h1>
        <p className="welcome-subtitle">
          Put on some forest sounds, start a timer, and grow a tree for every session. It&apos;s how I track my own
          study and work time.
        </p>
        <div className="study-grid">
          <FocusCard />
          <MixerCard />
        </div>
        <Grove />
      </div>
    </section>
  )
}
