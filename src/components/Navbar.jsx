import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const links = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Rowan Mueller</Link>
      <ul className="nav-links">
        {links.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={location.pathname === path ? 'active' : ''}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
