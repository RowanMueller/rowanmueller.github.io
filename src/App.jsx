import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className={`app-layout ${isHome ? 'route-home' : 'route-content'} ${sidebarOpen ? 'sidebar-open' : ''}`}
    >
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {!isHome && (
        <header className="mobile-header">
          <button
            type="button"
            className="mobile-header__hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="mobile-header__title">rowanmueller.github.io</span>
        </header>
      )}
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
