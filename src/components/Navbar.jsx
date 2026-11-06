import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import projectsData from '../data/projects.json'
import PixelIcon from './PixelIcon'
import SidebarPlayer from './SidebarPlayer'

const FILES = [
  { to: '/', icon: 'leaf', label: 'index.html' },
  { to: '/research', icon: 'flask', label: 'research.bib' },
  { to: '/study', icon: 'sprout', label: 'study-with-me.sh' },
  { to: '/about', icon: 'scroll', label: 'about.md' },
  { to: '/contact', icon: 'letter', label: 'contact.json' },
]

export default function Navbar() {
  const location = useLocation()
  const projects = projectsData.projects || []
  const isProjectsRoute = location.pathname === '/projects' || location.pathname.startsWith('/projects/')
  const [open, setOpen] = useState(isProjectsRoute)

  // Open the folder when arriving on a project page; otherwise leave it as the visitor set it
  useEffect(() => {
    if (isProjectsRoute) setOpen(true)
  }, [isProjectsRoute])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title"><PixelIcon name="sprout" size={12} />ROOT</span>
        <span className="sidebar-subtitle">rowanmueller.github.io</span>
      </div>
      <nav className="sidebar-nav" aria-label="Site">
        <ul className="sidebar-list">
          {FILES.map((f) => (
            <li key={f.to} className="sidebar-item">
              <Link
                to={f.to}
                className={`sidebar-link ${location.pathname === f.to ? 'sidebar-link--active' : ''}`}
                aria-current={location.pathname === f.to ? 'page' : undefined}
              >
                <span className="sidebar-link-icon"><PixelIcon name={f.icon} /></span>
                <span className="sidebar-link-label">{f.label}</span>
              </Link>
            </li>
          ))}

          {/* Last in the list, so expanding it never pushes other items around */}
          <li className="sidebar-item sidebar-item--folder">
            <button
              type="button"
              className={`sidebar-link sidebar-link--folder ${isProjectsRoute ? 'sidebar-link--active' : ''}`}
              aria-expanded={open}
              aria-controls="sidebar-projects"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sidebar-link-icon"><PixelIcon name="folder" /></span>
              <span className="sidebar-link-label">projects/</span>
              <span className="sidebar-link-chevron" aria-hidden="true">{open ? '▼' : '▶'}</span>
            </button>
            <ul id="sidebar-projects" className={`sidebar-sublist ${open ? 'sidebar-sublist--open' : ''}`} hidden={!open}>
              <li className="sidebar-subitem">
                <Link
                  to="/projects"
                  className={`sidebar-sublink ${location.pathname === '/projects' ? 'sidebar-sublink--active' : ''}`}
                >
                  All projects
                </Link>
              </li>
              {projects.map((project) => {
                const to = `/projects/${project.id}`
                return (
                  <li key={project.id} className="sidebar-subitem">
                    <Link
                      to={to}
                      className={`sidebar-sublink ${location.pathname === to ? 'sidebar-sublink--active' : ''}`}
                      aria-current={location.pathname === to ? 'page' : undefined}
                    >
                      {project.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>

      <SidebarPlayer />
    </aside>
  )
}
