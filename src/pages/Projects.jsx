import ProjectCard from '../components/ProjectCard'
import GitHubActivity from '../components/GitHubActivity'
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
        {projects.length === 3 && (
          <p>3 projects in total</p>
        )}
      </div>
      <GitHubActivity />
    </section>
  )
}
