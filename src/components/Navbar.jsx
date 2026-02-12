import { Link, useLocation } from 'react-router-dom'
import projectsData from '../data/projects.json'
import SidebarGitHubActivity from './SidebarGitHubActivity'
import { useState, useRef, useEffect } from 'react'

const DROPDOWN_CLOSE_DELAY = 600

export default function Navbar() {
  const location = useLocation()
  const projects = projectsData.projects || []
  const [projectsHovered, setProjectsHovered] = useState(false)
  const closeTimeoutRef = useRef(null)

  const isProjectsActive = location.pathname === '/projects' || location.pathname.startsWith('/projects/')

  const handleFolderToggle = () => {
    setProjectsHovered((prev) => !prev)
  }

  const handleProjectsMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setProjectsHovered(true)
  }

  const handleProjectsMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setProjectsHovered(false)
      closeTimeoutRef.current = null
    }, DROPDOWN_CLOSE_DELAY)
  }

  const cancelCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  useEffect(() => {
    setProjectsHovered(false)
  }, [location.pathname])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">ROOT</span>
          <span className="sidebar-subtitle">rowanmueller.github.io</span>
        </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link
              to="/"
              className={`sidebar-link ${location.pathname === '/' ? 'sidebar-link--active' : ''}`}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">index.html</span>
            </Link>
          </li>

          <li
            className="sidebar-item sidebar-item--folder"
            onMouseEnter={handleProjectsMouseEnter}
            onMouseLeave={handleProjectsMouseLeave}
          >
            <Link
              to="/projects"
              className={`sidebar-link sidebar-link--folder ${isProjectsActive ? 'sidebar-link--active' : ''}`}
              onClick={(e) => {
                if (window.innerWidth <= 860) {
                  e.preventDefault()
                  handleFolderToggle()
                }
              }}
            >
              <span className="sidebar-link-icon">📁</span>
              <span className="sidebar-link-label">projects</span>
              <span className="sidebar-link-chevron">{projectsHovered ? '▼' : '▶'}</span>
            </Link>
            <ul className={`sidebar-sublist ${projectsHovered ? 'sidebar-sublist--open' : ''}`}>
                <li className="sidebar-subitem">
                  <Link
                    to="/projects"
                    className={`sidebar-sublink ${location.pathname === '/projects' ? 'sidebar-sublink--active' : ''}`}
                  >
                    All Projects
                  </Link>
                </li>
                {projects.map((project) => (
                  <li key={project.id} className="sidebar-subitem">
                    <Link
                      to={`/projects/${project.id}`}
                      className={`sidebar-sublink ${location.pathname === `/projects/${project.id}` ? 'sidebar-sublink--active' : ''}`}
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
          </li>

          <li
            className="sidebar-item"
            onMouseEnter={cancelCloseTimeout}
          >
            <Link
              to="/about"
              className={`sidebar-link ${location.pathname === '/about' ? 'sidebar-link--active' : ''}`}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">about.md</span>
            </Link>
          </li>

          <li
            className="sidebar-item"
            onMouseEnter={cancelCloseTimeout}
          >
            <Link
              to="/contact"
              className={`sidebar-link ${location.pathname === '/contact' ? 'sidebar-link--active' : ''}`}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">contact.json</span>
            </Link>
          </li>
        </ul>
      </nav>

      <SidebarGitHubActivity />
    </aside>
  )
}
