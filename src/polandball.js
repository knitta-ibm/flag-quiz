/**
 * ポーランドボール SVG ジェネレーター
 * 国旗の代表色2色を使って丸いキャラクターを生成する
 */

// 国旗ごとの代表色（上/左色, 下/右色）
const FLAG_COLORS = {
  '🇯🇵': ['#ffffff','#bc002d'],
  '🇺🇸': ['#B22234','#3C3B6E'],
  '🇬🇧': ['#012169','#C8102E'],
  '🇫🇷': ['#002395','#ED2939'],
  '🇩🇪': ['#000000','#FFCE00'],
  '🇨🇳': ['#DE2910','#FFDE00'],
  '🇰🇷': ['#ffffff','#003478'],
  '🇮🇹': ['#009246','#CE2B37'],
  '🇪🇸': ['#AA151B','#F1BF00'],
  '🇧🇷': ['#009C3B','#FFDF00'],
  '🇨🇦': ['#FF0000','#ffffff'],
  '🇦🇺': ['#00008B','#CC0000'],
  '🇮🇳': ['#FF9933','#138808'],
  '🇷🇺': ['#ffffff','#0039A6'],
  '🇲🇽': ['#006847','#CE1126'],
  '🇸🇦': ['#006C35','#ffffff'],
  '🇿🇦': ['#007A4D','#FFB612'],
  '🇦🇷': ['#74ACDF','#ffffff'],
  '🇳🇴': ['#EF2B2D','#003680'],
  '🇸🇪': ['#006AA7','#FECC02'],
  '🇵🇹': ['#006600','#FF0000'],
  '🇳🇱': ['#AE1C28','#21468B'],
  '🇧🇪': ['#000000','#FAE042'],
  '🇵🇱': ['#ffffff','#DC143C'],
  '🇨🇭': ['#FF0000','#ffffff'],
  '🇦🇹': ['#ED2939','#ffffff'],
  '🇩🇰': ['#C60C30','#ffffff'],
  '🇫🇮': ['#ffffff','#003580'],
  '🇬🇷': ['#0D5EAF','#ffffff'],
  '🇹🇷': ['#E30A17','#ffffff'],
  '🇮🇱': ['#ffffff','#0038b8'],
  '🇪🇬': ['#CE1126','#000000'],
  '🇳🇬': ['#008751','#ffffff'],
  '🇰🇪': ['#006600','#BB0000'],
  '🇨🇴': ['#FCD116','#003087'],
  '🇨🇱': ['#D52B1E','#0039A6'],
  '🇵🇪': ['#D91023','#ffffff'],
  '🇻🇪': ['#CF142B','#00247D'],
  '🇹🇭': ['#A51931','#2D2A4A'],
  '🇻🇳': ['#DA251D','#FFCD00'],
  '🇲🇾': ['#CC0001','#010066'],
  '🇮🇩': ['#CE1126','#ffffff'],
  '🇵🇭': ['#0038A8','#CE1126'],
  '🇸🇬': ['#EF3340','#ffffff'],
  '🇵🇰': ['#01411C','#ffffff'],
  '🇧🇩': ['#006A4E','#F42A41'],
  '🇳🇿': ['#00247D','#CC142B'],
  '🇮🇷': ['#239f40','#DA0000'],
  '🇮🇶': ['#CE1126','#000000'],
  '🇺🇦': ['#005BBB','#FFD500'],
  '🇨🇺': ['#002A8F','#CF142B'],
  '🇺🇾': ['#ffffff','#5EB6E4'],
  '🇵🇾': ['#D52B1E','#0038A8'],
  '🇵🇦': ['#DA121A','#1C3F94'],
  '🇬🇹': ['#4997D0','#ffffff'],
  '🇧🇴': ['#D52B1E','#007A33'],
  '🇷🇴': ['#002B7F','#FCD116'],
  '🇭🇺': ['#CE2939','#477050'],
  '🇨🇿': ['#D7141A','#11457E'],
  '🇸🇰': ['#ffffff','#EE1C25'],
  '🇭🇷': ['#FF0000','#0093DD'],
  '🇷🇸': ['#C6363C','#0C4076'],
  '🇧🇬': ['#ffffff','#00966E'],
}

const DEFAULT_COLORS = ['#5b8dee','#3ecf8e']

function getColors(flag) {
  return FLAG_COLORS[flag] || DEFAULT_COLORS
}

/**
 * ポーランドボールSVG文字列を返す
 * @param {string} flag  国旗絵文字
 * @param {number} size  直径 px
 * @param {Object} opts  { expression: 'normal'|'happy'|'sad'|'dead', hat: bool, angle: number }
 */
export function polandballSVG(flag, size = 100, opts = {}) {
  const { expression = 'normal', hat = false, flip = false } = opts
  const [c1, c2] = getColors(flag)
  const r = size / 2
  const cx = r
  const cy = r

  // 国旗の上下分割（clip-path で上半球 = c1、下半球 = c2）
  const stripes = `
    <defs>
      <clipPath id="ball-clip-${size}">
        <circle cx="${cx}" cy="${cy}" r="${r - 1}"/>
      </clipPath>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="${c2}"/>
    <rect x="0" y="0" width="${size}" height="${r}" fill="${c1}" clip-path="url(#ball-clip-${size})"/>
  `

  // 目の位置
  const eyeY = cy - r * 0.08
  const eyeOffX = r * 0.22
  const eyeR = r * 0.13
  const pupilR = eyeR * 0.55
  const eyeColor = '#ffffff'
  const pupilColor = '#1a1a2e'

  let leftPupilDy = 0, rightPupilDy = 0, mouthPath = ''

  if (expression === 'happy') {
    leftPupilDy = eyeR * 0.2
    rightPupilDy = eyeR * 0.2
    mouthPath = `<path d="M${cx - r*0.18} ${cy + r*0.22} Q${cx} ${cy + r*0.42} ${cx + r*0.18} ${cy + r*0.22}" stroke="#1a1a2e" stroke-width="${r*0.07}" fill="none" stroke-linecap="round"/>`
  } else if (expression === 'sad') {
    leftPupilDy = -eyeR * 0.2
    rightPupilDy = -eyeR * 0.2
    mouthPath = `<path d="M${cx - r*0.18} ${cy + r*0.32} Q${cx} ${cy + r*0.18} ${cx + r*0.18} ${cy + r*0.32}" stroke="#1a1a2e" stroke-width="${r*0.07}" fill="none" stroke-linecap="round"/>`
  } else if (expression === 'dead') {
    // ×目
    const xSize = eyeR * 0.7
    mouthPath = `<path d="M${cx - r*0.18} ${cy + r*0.28} L${cx + r*0.18} ${cy + r*0.28}" stroke="#1a1a2e" stroke-width="${r*0.07}" stroke-linecap="round"/>`
    const eyes = `
      <line x1="${cx - eyeOffX - xSize}" y1="${eyeY - xSize}" x2="${cx - eyeOffX + xSize}" y2="${eyeY + xSize}" stroke="#1a1a2e" stroke-width="${r*0.09}" stroke-linecap="round"/>
      <line x1="${cx - eyeOffX + xSize}" y1="${eyeY - xSize}" x2="${cx - eyeOffX - xSize}" y2="${eyeY + xSize}" stroke="#1a1a2e" stroke-width="${r*0.09}" stroke-linecap="round"/>
      <line x1="${cx + eyeOffX - xSize}" y1="${eyeY - xSize}" x2="${cx + eyeOffX + xSize}" y2="${eyeY + xSize}" stroke="#1a1a2e" stroke-width="${r*0.09}" stroke-linecap="round"/>
      <line x1="${cx + eyeOffX + xSize}" y1="${eyeY - xSize}" x2="${cx + eyeOffX - xSize}" y2="${eyeY + xSize}" stroke="#1a1a2e" stroke-width="${r*0.09}" stroke-linecap="round"/>
    `
    const shadow = `<ellipse cx="${cx}" cy="${cy + r - r*0.1}" rx="${r*0.6}" ry="${r*0.12}" fill="rgba(0,0,0,0.18)"/>`
    const outline = `<circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="${r*0.04}"/>`
    const flipAttr = flip ? `transform="scale(-1,1) translate(-${size},0)"` : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ${flipAttr}>${shadow}${stripes}${eyes}${mouthPath}${outline}</svg>`
  } else {
    mouthPath = `<path d="M${cx - r*0.15} ${cy + r*0.27} Q${cx} ${cy + r*0.35} ${cx + r*0.15} ${cy + r*0.27}" stroke="#1a1a2e" stroke-width="${r*0.06}" fill="none" stroke-linecap="round"/>`
  }

  const eyes = `
    <circle cx="${cx - eyeOffX}" cy="${eyeY}" r="${eyeR}" fill="${eyeColor}"/>
    <circle cx="${cx - eyeOffX}" cy="${eyeY + leftPupilDy}" r="${pupilR}" fill="${pupilColor}"/>
    <circle cx="${cx + eyeOffX}" cy="${eyeY}" r="${eyeR}" fill="${eyeColor}"/>
    <circle cx="${cx + eyeOffX}" cy="${eyeY + rightPupilDy}" r="${pupilR}" fill="${pupilColor}"/>
  `

  // ハイライト（テカリ）
  const highlight = `<ellipse cx="${cx - r*0.2}" cy="${cy - r*0.3}" rx="${r*0.22}" ry="${r*0.14}" fill="rgba(255,255,255,0.28)" transform="rotate(-30,${cx - r*0.2},${cy - r*0.3})"/>`

  // 影
  const shadow = `<ellipse cx="${cx}" cy="${cy + r - r*0.1}" rx="${r*0.6}" ry="${r*0.12}" fill="rgba(0,0,0,0.18)"/>`
  const outline = `<circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="${r*0.04}"/>`

  // 帽子（トップハット）
  const hatSvg = hat ? `
    <rect x="${cx - r*0.38}" y="${cy - r*0.95}" width="${r*0.76}" height="${r*0.55}" rx="${r*0.06}" fill="#1a1a1a"/>
    <rect x="${cx - r*0.52}" y="${cy - r*0.43}" width="${r*1.04}" height="${r*0.16}" rx="${r*0.04}" fill="#1a1a1a"/>
  ` : ''

  const flipAttr = flip ? `transform="scale(-1,1) translate(-${size},0)"` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ${flipAttr}>
    ${shadow}${stripes}${hatSvg}${eyes}${mouthPath}${highlight}${outline}
  </svg>`
}
