import ProjectCard from '../components/ProjectCard'
import projectsData from '../data/projects.json'

export default function Projects() {
  const projects = projectsData.projects || []

  return (
    <section className="page projects">
      <h1>Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <p>No projects yet. Add projects to <code>src/data/projects.json</code> or run the Python generator.</p>
        )}
      </div>
    </section>
  )
}
