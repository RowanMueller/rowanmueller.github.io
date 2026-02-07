import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">About</h1>
        <p className="welcome-subtitle">Rowan Mueller · B.S. Computer Engineering</p>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Summary</h2>
          <p className="welcome-section__text">
            Hi there! I'm Rowan Mueller, an Engineering student at the University of
        Virginia with a passion for problem solving. Over the past few years, I've built a strong interdisciplinary foundation in software and hardware
        particularly in building at applications to model systems in the scientific and private sectors. I began my career with Java in 2014 building mods and server plugins for Minecraft.
        Since then, I've collaborated with a variety of teams across the stack and gained experience with a range of technologies. My projects include secure web applications, custom control systems, and modeling tools.
        If you talk to my friends they'd say I'm detail oriented, tenacious in problem solving, and can be an indispensable part of any team.
        Outside of engineering, I enjoy playing tennis, gardening, and getting involved with dance at my university.
        If you'd like to learn more, feel free to explore my profile or reach out to me directly!
          </p>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Skills</h2>
          <div className="welcome-actions" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="welcome-action">HTML</span>
            <span className="welcome-action">CSS</span>
            <span className="welcome-action">SQL</span>
            <span className="welcome-action">JS/TS</span>
            <span className="welcome-action">React</span>
            <span className="welcome-action">Python</span>
            <span className="welcome-action">Java</span>
            <span className="welcome-action">KiCad</span>
            <span className="welcome-action">VHDL</span>
            <span className="welcome-action">AutoDesk Fusion</span>
            <span className="welcome-action">R</span>
            <span className="welcome-action">KLayout</span>
            <span className="welcome-action">Pandas</span>
            <span className="welcome-action">MATLAB</span>
            <span className="welcome-action">C/C++</span>
            <span className="welcome-action">Git</span>
            <span className="welcome-action">GitHub</span>
            <span className="welcome-action">Linux</span>
            <span className="welcome-action">Docker</span>
            <span className="welcome-action">Vite</span>
            <span className="welcome-action">Node.js</span>
            <span className="welcome-action">Django</span>
            <span className="welcome-action">MongoDB</span>
            <span className="welcome-action">PostgreSQL</span>
          </div>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">More</h2>
          <p className="welcome-section__text">
            For project details and examples, visit the Projects page or contact me directly.
            <br />
          </p>
        </div>
      </div>
    </section>
  )
}
