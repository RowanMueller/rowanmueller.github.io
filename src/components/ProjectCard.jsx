export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      {project.video && (
        <video
          src={project.video}
          controls
          playsInline
          className="project-video"
        >
          Your browser does not support the video tag.
        </video>
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
