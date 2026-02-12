import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projects.json'

const WELCOME_TEXT = 'Welcome!'
const PROXIMITY_PX = 5
const JUMP_DURATION_MS = 350

export default function Home() {
  const projects = projectsData.projects || []
  const [jumpingIndex, setJumpingIndex] = useState(null)
  const charRefs = useRef([])
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const isJumpingRef = useRef(false)

  const findNearestInProximity = useCallback(() => {
    const { x, y } = lastMouseRef.current
    let nearestIdx = -1
    let nearestDist = Infinity

    charRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = Math.max(r.left - x, 0, x - r.right)
      const dy = Math.max(r.top - y, 0, y - r.bottom)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= PROXIMITY_PX && dist < nearestDist) {
        nearestDist = dist
        nearestIdx = i
      }
    })

    return nearestIdx
  }, [])

  const triggerJump = useCallback((index) => {
    setJumpingIndex(index)
    isJumpingRef.current = true
    setTimeout(() => {
      setJumpingIndex(null)
      isJumpingRef.current = false
      const nextIdx = findNearestInProximity()
      if (nextIdx !== -1) {
        triggerJump(nextIdx)
      }
    }, JUMP_DURATION_MS)
  }, [findNearestInProximity])

  const handleMouseMove = useCallback((e) => {
    lastMouseRef.current = { x: e.clientX, y: e.clientY }
    if (isJumpingRef.current) return

    const nearestIdx = findNearestInProximity()
    if (nearestIdx !== -1) {
      triggerJump(nearestIdx)
    }
  }, [findNearestInProximity, triggerJump])

  return (
    <section className="welcome-page">
      <div className="welcome-content">
        <h1
          className="welcome-title welcome-title--interactive"
          onMouseMove={handleMouseMove}
        >
          {WELCOME_TEXT.split('').map((char, i) => <span key={i} ref={(el) => { charRefs.current[i] = el }} className={`welcome-title__char ${jumpingIndex === i ? 'welcome-title__char--jump' : ''}`}>{char}</span>)}
        </h1>
        <p className="welcome-subtitle">Rowan Mueller · B.S. Computer Engineering</p>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Start</h2>
          <div className="welcome-actions">
            <Link to="/projects" className="welcome-action">
              <span className="welcome-action__icon">📁</span>
              <span>Open Projects</span>
            </Link>
            <Link to="/about" className="welcome-action">
              <span className="welcome-action__icon">📄</span>
              <span>About</span>
            </Link>
            <Link to="/contact" className="welcome-action">
              <span className="welcome-action__icon">✉️</span>
              <span>Contact</span>
            </Link>
          </div>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Recent Projects</h2>
          <ul className="welcome-recent">
            {projects.slice(0, 5).map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`} className="welcome-recent__link">
                  <span className="welcome-recent__icon">📄</span>
                  <span>{project.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
