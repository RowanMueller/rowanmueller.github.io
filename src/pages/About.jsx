import { Link } from 'react-router-dom'
import skillsData from '../data/skills.json'
import PixelFrame from '../components/PixelFrame'

const skillGroups = skillsData.groups || []

export default function About() {
  return (
    <section className="welcome-page">
      <div className="welcome-content">
        <div className="about-header">
          <PixelFrame variant="portrait" className="about-profile">
            <img
              src="/assets/images/profile.jpg"
              alt="Rowan Mueller"
              className="about-profile-img"
            />
          </PixelFrame>
          <div>
            <h1 className="welcome-title">About</h1>
            <p className="welcome-subtitle">Rowan Mueller · B.S. Electrical &amp; Computer Engineering · UVA</p>
          </div>
        </div>

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
          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div key={group.name} className="skill-group">
                <h3 className="skill-group__name">{group.name}</h3>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <span key={item} className="welcome-action">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">More</h2>
          <p className="welcome-section__text">
            See <Link to="/research">Research</Link> for publications and lab work,{' '}
            <Link to="/projects">Projects</Link> for builds, or <Link to="/contact">get in touch</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
