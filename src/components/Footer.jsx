import PixelIcon from './PixelIcon'

export default function Footer() {
  return (
    <footer className="footer">
      <PixelIcon name="sprout" size={12} />
      <span>&copy; {new Date().getFullYear()} Rowan Mueller</span>
      <span className="footer__spacer" />
      <span>♪ lofi forest</span>
    </footer>
  )
}
