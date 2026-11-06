/* Original 16x16 pixel tree in five growth stages (seed -> full tree). */

const PALETTE = {
  g: '#7fb069',
  d: '#3d7f3f',
  h: '#a8d08d',
  b: '#8b5a2b',
  s: '#4a3423',
  t: '#6b4a2b',
  y: '#f4d35e',
}

const SOIL = '..tsssssssssst..'

const STAGES = [
  // 0: seed
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '......g.g.......', '.......d........', SOIL],
  // 1: sprout
  ['', '', '', '', '', '', '', '', '', '....gg...gg.....', '.....gg.gg......', '.......d........', '.......d........', '.......d........', '.......b........', SOIL],
  // 2: sapling
  ['', '', '', '', '', '', '.......g........', '......ggg.......', '.....gggdg......', '....ggdggdg.....', '.....gggdg......', '......gdg.......', '.......b........', '.......b........', '......bbb.......', SOIL],
  // 3: young tree
  ['', '', '......ggg.......', '....gggggg......', '...ggggdgggg....', '..gggdggggdgg...', '..ggggggdgggg...', '...gdggggggdg...', '....gggdgggg....', '.....ddgddd.....', '.......bb.......', '.......bb.......', '.......bb.......', '......bbbb......', '.....bb..bb.....', SOIL],
  // 4: full tree with fireflies
  ['.....hhhhh......', '...hhgggggh..y..', '..hgggggggggh...', '.hggggdggggggh..', '.gggdggggggdggg.', 'ggggggggdggggggg', '.ggdggggggggdgg.', '.gggggdgggggggg.', '..gggggggdgggg..', 'y..ddgggggdd....', '......bbb.......', '.......bb.......', '.......bb.......', '......bbbb......', '.....bb..bbb....', SOIL],
]

export default function TreeSprite({ stage = 4, size = 64, className = '', title }) {
  const rows = STAGES[Math.max(0, Math.min(STAGES.length - 1, stage))]
  const rects = []
  rows.forEach((row, y) => {
    row.padEnd(16, '.').slice(0, 16).split('').forEach((ch, x) => {
      const fill = PALETTE[ch]
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />)
    })
  })
  return (
    <svg
      className={`tree-sprite ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {rects}
    </svg>
  )
}

export const TREE_STAGES = STAGES.length
