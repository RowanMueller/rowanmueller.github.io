import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PixelIcon from './PixelIcon'
import { ambience, useAmbience } from '../study/ambience'
import { useFocusTimer, formatClock } from '../study/timer'
import '../styles/study.css'

const BASE_TITLE = 'Rowan Mueller | Portfolio'

export default function Footer() {
  const { playing } = useAmbience()
  const timer = useFocusTimer()
  const timerActive = timer.running || (timer.remainingMs < timer.durationMs && !timer.justFinished)

  // Show the countdown in the tab title while a session runs, on any page
  useEffect(() => {
    document.title = timer.running ? `${formatClock(timer.remainingMs)} · Study with me` : BASE_TITLE
  }, [timer.running, timer.remainingMs])

  return (
    <footer className="footer">
      <PixelIcon name="sprout" size={12} />
      <span>&copy; {new Date().getFullYear()} Rowan Mueller</span>
      <span className="footer__spacer" />
      {timerActive && (
        <Link to="/study" className="footer-timer" title="Open Study with me">
          ⏱ {formatClock(timer.remainingMs)}
          {!timer.running && ' (paused)'}
        </Link>
      )}
      <button
        type="button"
        className={`footer-player ${playing ? 'footer-player--on' : ''}`}
        onClick={() => ambience.toggle()}
        aria-pressed={playing}
        title={playing ? 'Pause forest sounds' : 'Play forest sounds'}
      >
        <PixelIcon name={playing ? 'pause' : 'play'} size={10} />
        ♪ lofi forest
      </button>
    </footer>
  )
}
