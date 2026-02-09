import { useParams, Link } from 'react-router-dom'
import projectsData from '../data/projects.json'

export default function ProjectDetail() {
  const { id } = useParams()
  const projects = projectsData.projects || []
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <section className="page">
        <h1>Project not found</h1>
        <Link to="/projects">← Back to Projects</Link>
      </section>
    )
  }

  return (
    <section className="page project-detail">
      <div className="project-detail__header">
        <Link to="/projects" className="project-detail__back">← All Projects</Link>
        <h1>{project.title}</h1>
      </div>

      <div className="project-detail__content">
        {project.images && project.images.length > 0 && (
          <div className="project-detail__media project-images">
            {project.images.map((src, i) => (
              <img key={i} src={src} alt="" className="project-image" />
            ))}
          </div>
        )}
        {project.videos && project.videos.length > 0 && project.videos.map((src, i) => (
          <video
            key={i}
            src={encodeURI(src)}
            controls
            playsInline
            className="project-video project-detail__video"
          >
            Your browser does not support the video tag.
          </video>
        ))}
        {!project.videos && project.video && (
          <video
            src={encodeURI(project.video)}
            controls
            playsInline
            className="project-video project-detail__video"
          >
            Your browser does not support the video tag.
          </video>
        )}

        <p className="project-detail__description">{project.description}</p>

        {project.technologies && (
          <div className="tech-tags">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            View Project on GitHub →
          </a>
        )}
      </div>
    </section>
  )
}
