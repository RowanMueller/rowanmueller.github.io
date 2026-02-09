import { Link, useLocation } from 'react-router-dom'
import projectsData from '../data/projects.json'
import SidebarGitHubActivity from './SidebarGitHubActivity'
import { useState } from 'react'

export default function Navbar({ isOpen = false, onClose }) {
  const location = useLocation()
  const projects = projectsData.projects || []
  const [projectsHovered, setProjectsHovered] = useState(false)

  const isProjectsActive = location.pathname === '/projects' || location.pathname.startsWith('/projects/')

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  const handleFolderToggle = () => {
    setProjectsHovered((prev) => !prev)
  }

  return (
    <>
      {onClose && isOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Close menu"
          tabIndex={0}
        />
      )}
      <aside className="sidebar">
        <div className="sidebar-header">
          {onClose && isOpen && (
            <button
              type="button"
              className="sidebar-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              ×
            </button>
          )}
          <span className="sidebar-title">ROOT</span>
          <span className="sidebar-subtitle">rowanmueller.github.io</span>
        </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link
              to="/"
              className={`sidebar-link ${location.pathname === '/' ? 'sidebar-link--active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">index.html</span>
            </Link>
          </li>

          <li
            className="sidebar-item sidebar-item--folder"
            onMouseEnter={() => setProjectsHovered(true)}
            onMouseLeave={() => setProjectsHovered(false)}
          >
            <Link
              to="/projects"
              className={`sidebar-link sidebar-link--folder ${isProjectsActive ? 'sidebar-link--active' : ''}`}
              onClick={(e) => {
                if (window.innerWidth <= 860) {
                  e.preventDefault()
                  handleFolderToggle()
                } else {
                  handleLinkClick()
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
                    onClick={handleLinkClick}
                  >
                    All Projects
                  </Link>
                </li>
                {projects.map((project) => (
                  <li key={project.id} className="sidebar-subitem">
                    <Link
                      to={`/projects/${project.id}`}
                      className={`sidebar-sublink ${location.pathname === `/projects/${project.id}` ? 'sidebar-sublink--active' : ''}`}
                      onClick={handleLinkClick}
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
          </li>

          <li className="sidebar-item">
            <Link
              to="/about"
              className={`sidebar-link ${location.pathname === '/about' ? 'sidebar-link--active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">about.md</span>
            </Link>
          </li>

          <li className="sidebar-item">
            <Link
              to="/contact"
              className={`sidebar-link ${location.pathname === '/contact' ? 'sidebar-link--active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="sidebar-link-icon">📄</span>
              <span className="sidebar-link-label">contact.json</span>
            </Link>
          </li>
        </ul>
      </nav>

      <SidebarGitHubActivity />
    </aside>
    </>
  )
}
