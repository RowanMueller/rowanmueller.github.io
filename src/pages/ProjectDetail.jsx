import { useParams, Link } from 'react-router-dom'
import projectsData from '../data/projects.json'
import PixelFrame, { mediaLabel } from '../components/PixelFrame'

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
              <PixelFrame key={i} label={mediaLabel(project, 'images', i)} icon="photo">
                <img src={src} alt={`${project.title} photo ${i + 1}`} className="project-image" />
              </PixelFrame>
            ))}
          </div>
        )}
        {project.videos && project.videos.length > 0 && project.videos.map((src, i) => (
          <PixelFrame key={i} label={mediaLabel(project, 'videos', i)} icon="play" className="project-detail__video-frame">
            <video
              src={encodeURI(src)}
              controls
              playsInline
              preload="metadata"
              className="project-video project-detail__video"
            >
              Your browser does not support the video tag.
            </video>
          </PixelFrame>
        ))}
        {!project.videos && project.video && (
          <PixelFrame label={mediaLabel(project, 'videos', 0)} icon="play" className="project-detail__video-frame">
            <video
              src={encodeURI(project.video)}
              controls
              playsInline
              preload="metadata"
              className="project-video project-detail__video"
            >
              Your browser does not support the video tag.
            </video>
          </PixelFrame>
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
