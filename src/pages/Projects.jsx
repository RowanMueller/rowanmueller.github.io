import { Link } from 'react-router-dom'
import projectsData from '../data/projects.json'

export default function Projects() {
  const projects = projectsData.projects || []

  return (
    <section className="page projects-overview">
      <h1>Projects</h1>
      <div className="projects-stack">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-stack-item"
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.technologies && (
              <div className="tech-tags">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
