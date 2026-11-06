import PixelIcon from './PixelIcon'

/*
 * Wraps a photo or video so it sits inside the forest scene:
 * stepped pixel corners, a moss bracket with vine sprites, a dithered
 * scanline/tint overlay that lifts on hover, and an optional title tab.
 */
export default function PixelFrame({ children, label, icon = 'scroll', variant = 'media', className = '' }) {
  return (
    <figure className={`pixel-frame pixel-frame--${variant} ${label ? 'pixel-frame--labelled' : ''} ${className}`}>
      {label && (
        <figcaption className="pixel-frame__label">
          <PixelIcon name={icon} size={12} />
          <span>{label}</span>
        </figcaption>
      )}
      <div className="pixel-frame__inner">
        {children}
        <div className="pixel-frame__overlay" aria-hidden="true" />
      </div>
      {['tl', 'tr', 'bl', 'br'].map((pos) => (
        <span key={pos} className={`pixel-frame__corner pixel-frame__corner--${pos}`} aria-hidden="true">
          <PixelIcon name="corner" size={24} />
        </span>
      ))}
    </figure>
  )
}

/*
 * Display label for a project's media, never the real file name.
 * Uses project.captions[index] when provided, otherwise a made-up name
 * built from the project title, e.g. "solar_system_02.mp4".
 */
export function mediaLabel(project, kind, index) {
  const custom = project.captions?.[kind]?.[index]
  if (custom) return custom
  const slug = (project.title || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join('_')
  const n = String(index + 1).padStart(2, '0')
  return `${slug}_${n}.${kind === 'videos' ? 'mp4' : 'png'}`
}
