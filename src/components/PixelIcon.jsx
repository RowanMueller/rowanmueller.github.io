/*
 * Tiny 8x8 bitmap icons. Each row is a string; characters map to palette
 * entries ('.' is transparent). Rendered as crisp SVG rects.
 */

const PALETTE = {
  g: '#7fb069', // leaf green
  d: '#3d7f3f', // dark green
  b: '#8b5a2b', // bark
  y: '#f4d35e', // firefly yellow
  o: '#d9a441', // amber
  c: '#e8e4c9', // cream
  m: '#9bab8a', // moss grey
  r: '#c8553d', // mushroom red
}

const ICONS = {
  leaf: [
    '......gg',
    '....gggg',
    '...ggdgg',
    '..ggdggg',
    '.ggdggg.',
    '.gdggg..',
    '.dgg....',
    'd.......',
  ],
  folder: [
    '........',
    'ooo.....',
    'oyyo....',
    'oooooooo',
    'oyyyyyyo',
    'oyyyyyyo',
    'oyyyyyyo',
    'oooooooo',
  ],
  scroll: [
    '.cccccc.',
    'cmccccmc',
    '.cmmmmc.',
    '.cccccc.',
    '.cmmmmc.',
    '.cccccc.',
    'cmccccmc',
    '.cccccc.',
  ],
  letter: [
    '........',
    'cccccccc',
    'ccmccmcc',
    'cmcmmcmc',
    'cccmmccc',
    'cccccccc',
    'cccccccc',
    '........',
  ],
  mushroom: [
    '..rrrr..',
    '.rcrrcr.',
    'rrrrrrcr',
    'rcrrrrrr',
    '...cc...',
    '...cc...',
    '..cccc..',
    '........',
  ],
  sprout: [
    '........',
    '.gg..gg.',
    'gddg.gdg',
    '.gddgdg.',
    '...dd...',
    '...d....',
    '..bbbb..',
    '.bbbbbb.',
  ],
  link: [
    '........',
    '.yyy....',
    'y...y...',
    'y..yyy..',
    '.yyy..y.',
    '...y..y.',
    '....yyy.',
    '........',
  ],
}

export default function PixelIcon({ name, size = 16, className = '' }) {
  const rows = ICONS[name]
  if (!rows) return null
  const rects = []
  rows.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      const fill = PALETTE[ch]
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />)
    })
  })
  return (
    <svg
      className={`pixel-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}
