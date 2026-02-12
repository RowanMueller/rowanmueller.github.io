import { useState, useEffect } from 'react'

const GITHUB_USERNAME = 'rowanmueller'

export default function SidebarGitHubActivity() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

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
        if (!eventsRes.ok) {
          const fallback = await fetchFromRepos()
          setRepos(fallback.slice(0, 4))
          return
        }
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

        setRepos(repoList.slice(0, 4))
      } catch {
        const fallback = await fetchFromRepos()
        setRepos(fallback.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  if (loading) {
    return (
      <div className="sidebar-recent">
        <span className="sidebar-recent__title">Recent Activity</span>
        <p className="sidebar-recent__muted">Loading…</p>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="sidebar-recent">
        <span className="sidebar-recent__title">Recent Activity</span>
        <p className="sidebar-recent__muted">No recent commits</p>
      </div>
    )
  }

  const duplicatedRepos = [...repos, ...repos]

  return (
    <div className="sidebar-recent">
      <span className="sidebar-recent__title">Recent Activity</span>
      <div className="sidebar-recent__scroll-wrapper">
        <ul className="sidebar-recent__list sidebar-recent__list--scroll">
          {duplicatedRepos.map((item, idx) => (
            <li key={`${item.repo}-${idx}`} className="sidebar-recent__item">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-recent__link"
              >
                <span className="sidebar-recent__label">{item.repo.split('/').pop().toLowerCase()}</span>
                <span className="sidebar-recent__count">{item.count} commit{item.count !== 1 ? 's' : ''}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
