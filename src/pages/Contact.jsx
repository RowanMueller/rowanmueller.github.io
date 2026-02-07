export default function Contact() {
  return (
    <section className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">Contact</h1>
        <p className="welcome-subtitle">Rowan Mueller · B.S. Computer Engineering</p>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Contact Me</h2>
          <p className="welcome-section__text">
            <a href="mailto:bzz2nh@virginia.edu">bzz2nh@virginia.edu</a>
            <p></p>
            <a href="mailto:RowanMuelle@gmail.com">RowanMuelle@gmail.com</a>
          </p>  
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Profiles</h2>
          <ul className="welcome-recent">
            <li>
              <a className="welcome-recent__link" href="https://github.com/rowanmueller" target="_blank" rel="noreferrer">
                <span className="welcome-recent__icon">🔗</span>
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a className="welcome-recent__link" href="https://www.linkedin.com/in/rowan-mueller-a01a21285/" target="_blank" rel="noreferrer">
                <span className="welcome-recent__icon">🔗</span>
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-section__title">Message</h2>
          <p className="welcome-section__text">
            Prefer a chat? Shoot me an email and we can set up a time to talk!
          </p>
        </div>
      </div>
    </section>
  )
}
