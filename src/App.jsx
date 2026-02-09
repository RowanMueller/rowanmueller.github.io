import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const getPageTitle = () => {
    if (location.pathname === '/projects') return 'Projects'
    if (location.pathname.startsWith('/projects/')) return 'Project'
    if (location.pathname === '/about') return 'About'
    if (location.pathname === '/contact') return 'Contact'
    return 'rowanmueller.github.io'
  }

  return (
    <div className={`app-layout ${isHome ? 'route-home' : 'route-content'}`}>
      <header className="mobile-header">
        {!isHome ? (
          <Link to="/" className="mobile-header__back" aria-label="Return to home">
            ←
          </Link>
        ) : (
          <span className="mobile-header__spacer" aria-hidden="true" />
        )}
        <span className="mobile-header__title">{getPageTitle()}</span>
      </header>
      <Navbar />
      <div className="app-content">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
