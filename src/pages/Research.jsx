import researchData from '../data/research.json'
import PixelIcon from '../components/PixelIcon'

const STATUS_LABEL = {
  ongoing: 'Ongoing',
  published: 'Published',
  completed: 'Completed',
}

export default function Research() {
  const publications = researchData.publications || []
  const projects = researchData.projects || []
  const recognition = researchData.recognition || []

  return (
    <section className="welcome-page">
      <div className="welcome-content research">
        <h1 className="welcome-title">Research</h1>
        <p className="welcome-subtitle">Publications, lab work and recognition</p>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Publications</h2>
          {publications.length === 0 ? (
            <p className="welcome-section__text research__empty">Publications coming soon.</p>
          ) : (
            <ol className="research-pubs">
              {publications.map((pub) => (
                <li key={pub.id} className="research-pub">
                  <PixelIcon name="scroll" size={16} />
                  <div>
                    <p className="research-pub__title">
                      {pub.link ? (
                        <a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                      ) : (
                        pub.title
                      )}
                    </p>
                    {pub.authors && <p className="research-pub__authors">{pub.authors}</p>}
                    <p className="research-pub__meta">
                      <em>{pub.venue}</em>
                      {pub.year && <> · {pub.year}</>}
                      {pub.type && <> · {pub.type}</>}
                      {pub.doi && (
                        <>
                          {' · '}DOI:{' '}
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                            {pub.doi}
                          </a>
                        </>
                      )}
                    </p>
                    {pub.note && <p className="research-pub__note">{pub.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Research Projects</h2>
          <div className="research-projects">
            {projects.map((proj) => (
              <article key={proj.id} className="research-project">
                <header className="research-project__header">
                  <h3 className="research-project__title">{proj.title}</h3>
                  {proj.status && (
                    <span className={`research-status research-status--${proj.status}`}>
                      {STATUS_LABEL[proj.status] || proj.status}
                    </span>
                  )}
                </header>
                <p className="research-project__meta">
                  {[proj.role, proj.org, proj.period].filter(Boolean).join(' · ')}
                </p>
                {proj.summary && <p className="research-project__summary">{proj.summary}</p>}
                {proj.bullets?.length > 0 && (
                  <ul className="research-project__bullets">
                    {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {proj.technologies?.length > 0 && (
                  <div className="tech-tags">
                    {proj.technologies.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                )}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View publication →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>

        {recognition.length > 0 && (
          <div className="welcome-section">
            <h2 className="welcome-section__title">Recognition</h2>
            <ul className="research-awards">
              {recognition.map((r) => (
                <li key={r.title} className="research-award">
                  <PixelIcon name="star" size={14} />
                  <div>
                    <p className="research-award__title">
                      {r.title} <span className="research-award__year">{r.year}</span>
                    </p>
                    {r.detail && <p className="research-award__detail">{r.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
