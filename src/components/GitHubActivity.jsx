import { useState, useEffect } from 'react'

const GITHUB_USERNAME = 'rowanmueller'

export default function GitHubActivity() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFromRepos() {
      const reposRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5&type=owner`
      )
      if (!reposRes.ok) return []
      const reposData = await reposRes.json()
      const result = []
      for (const repo of reposData) {
        const repoName = repo.full_name
        const commitsRes = await fetch(
          `https://api.github.com/repos/${repoName}/commits?author=${GITHUB_USERNAME}&per_page=100`
        )
        if (!commitsRes.ok) continue
        const repoCommits = await commitsRes.json()
        if (repoCommits.length > 0) {
          result.push({
            repo: repoName,
            count: repoCommits.length,
            url: repo.html_url || `https://github.com/${repoName}`,
          })
        }
      }
      return result
    }

    async function fetchActivity() {
      try {
        const eventsRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`
        )
        if (!eventsRes.ok) throw new Error(eventsRes.status === 403 ? 'Rate limited' : 'Failed to fetch')
        const events = await eventsRes.json()

        const repoCounts = {}
        for (const event of events) {
          if (event.type !== 'PushEvent' || !event.payload?.commits?.length) continue
          const repoName = event.repo?.name || ''
          const count = event.payload.commits.length
          repoCounts[repoName] = (repoCounts[repoName] || 0) + count
        }

        let repoList = Object.entries(repoCounts).map(([repo, count]) => ({
          repo,
          count,
          url: `https://github.com/${repo}`,
        }))

        if (repoList.length === 0) {
          repoList = await fetchFromRepos()
        }

        setRepos(repoList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  if (loading) {
    return (
      <div className="github-activity github-activity--loading">
        <h2 className="github-activity__title">Recent Activity</h2>
        <p className="github-activity__muted">Loading commits…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="github-activity github-activity--error">
        <h2 className="github-activity__title">Recent Activity</h2>
        <p className="github-activity__muted">{error}</p>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="github-activity">
        <h2 className="github-activity__title">Recent Activity</h2>
        <p className="github-activity__muted">No recent public commits</p>
      </div>
    )
  }

  return (
    <div className="github-activity">
      <h2 className="github-activity__title">Recent Activity</h2>
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="github-activity__profile"
      >
        @{GITHUB_USERNAME}
      </a>
      <ul className="github-activity__list">
        {repos.map((item) => (
          <li key={item.repo} className="github-activity__item">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="github-activity__link"
            >
              <span className="github-activity__repo">{item.repo}</span>
              <span className="github-activity__count">
                {item.count} recent commit{item.count !== 1 ? 's' : ''}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
