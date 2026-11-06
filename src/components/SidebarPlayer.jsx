import { Link } from 'react-router-dom'
import PixelIcon from './PixelIcon'
import { ambience, useAmbience, CHANNELS } from '../study/ambience'

export default function SidebarPlayer() {
  const a = useAmbience()
  const active = CHANNELS.filter((c) => a.channels[c.id]?.on).map((c) => c.label)

  return (
    <section className={`sidebar-player ${a.playing ? 'sidebar-player--on' : ''}`} aria-label="Forest sounds player">
      <span className="sidebar-player__title">Now playing</span>

      <div className="sidebar-player__row">
        <button
          type="button"
          className="sidebar-player__btn"
          onClick={() => ambience.toggle()}
          aria-pressed={a.playing}
          aria-label={a.playing ? 'Pause forest sounds' : 'Play forest sounds'}
        >
          <PixelIcon name={a.playing ? 'pause' : 'play'} size={20} />
        </button>
        <div className="sidebar-player__meta">
          <span className="sidebar-player__name">
            lofi forest
            <span className="sidebar-player__eq" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
          </span>
          <span className="sidebar-player__mix">
            {active.length ? active.join(' · ') : 'No sounds selected'}
          </span>
        </div>
      </div>

      <label className="sidebar-player__volume">
        <span>vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={a.master}
          aria-label="Forest sounds volume"
          onChange={(e) => ambience.setMaster(Number(e.target.value))}
        />
      </label>

      <Link to="/study" className="sidebar-player__link">Adjust mix →</Link>
    </section>
  )
}
