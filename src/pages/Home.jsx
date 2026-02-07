import { Link } from 'react-router-dom'
import projectsData from '../data/projects.json'

export default function Home() {
  const projects = projectsData.projects || []

  return (
    <section className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome</h1>
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
