import PixelFrame, { mediaLabel } from './PixelFrame'

export default function ProjectCard({ project, compact }) {
  return (
    <article className={`project-card ${compact ? 'project-card--compact' : ''}`}>
      <h3>{project.title}</h3>
      {!compact && project.images && project.images.length > 0 && (
        <div className="project-images">
          {project.images.map((src, i) => (
            <PixelFrame key={i} label={mediaLabel(project, 'images', i)} icon="photo">
              <img src={src} alt="" className="project-image" />
            </PixelFrame>
          ))}
        </div>
      )}
      {!compact && project.video && (
        <PixelFrame label={mediaLabel(project, 'videos', 0)} icon="play">
          <video
            src={encodeURI(project.video)}
            controls
            playsInline
            preload="metadata"
            className="project-video"
          >
            Your browser does not support the video tag.
          </video>
        </PixelFrame>
      )}
      <p>{project.description}</p>
      {project.technologies && (
        <div className="tech-tags">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      )}
      {project.link && (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
          View Project
        </a>
      )}
    </article>
  )
}
