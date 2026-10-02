// 旧国・絵文字のない国の国旗SVG
// flagSVG(name) → SVG文字列を返す

const FLAGS = {

  // オスマン帝国：赤地に白い三日月と星
  'オスマン帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#c8102e"/>
    <circle cx="430" cy="300" r="130" fill="white"/>
    <circle cx="470" cy="300" r="105" fill="#c8102e"/>
    <polygon points="540,300 580,260 585,310" fill="white" transform="rotate(-15,540,300)"/>
    <polygon points="540,170 555,215 595,215 563,240 575,285 540,260 505,285 517,240 485,215 525,215" fill="white" transform="translate(30,30) scale(0.9)"/>
  </svg>`,

  // オーストリア＝ハンガリー帝国：赤白赤の横縞（オーストリア側）
  'オーストリア＝ハンガリー帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#ED2939"/>
    <rect y="200" width="900" height="200" fill="white"/>
    <rect y="400" width="900" height="200" fill="#ED2939"/>
    <g transform="translate(350,180) scale(0.9)">
      <rect x="80" y="20" width="60" height="200" fill="#FFD700"/>
      <rect x="20" y="80" width="200" height="60" fill="#FFD700"/>
    </g>
  </svg>`,

  // プロイセン王国：白地に黒い鷲
  'プロイセン王国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="300" fill="#000"/>
    <rect y="300" width="900" height="300" fill="white"/>
    <text x="450" y="330" font-size="220" text-anchor="middle" fill="#FFD700" font-family="serif">🦅</text>
  </svg>`,

  // 大英帝国：ユニオンジャック（🇬🇧と同じデザイン）
  '大英帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" stroke-width="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/>
    <path d="M30,0 V30 M0,15 H60" stroke="white" stroke-width="10"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>
  </svg>`,

  // ナチス・ドイツ：黒赤黄の三色旗（鉤十字は省略、黒縦縞で表現）
  'ナチス・ドイツ': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#000"/>
    <rect y="200" width="900" height="200" fill="#DE0000"/>
    <rect y="400" width="900" height="200" fill="#FFCE00"/>
    <circle cx="450" cy="300" r="90" fill="white"/>
    <circle cx="450" cy="300" r="75" fill="#DE0000"/>
    <text x="450" y="340" font-size="100" text-anchor="middle" fill="black" font-family="serif" font-weight="bold">✙</text>
  </svg>`,

  // ローマ帝国：紫地に金の鷲（SPQR）
  'ローマ帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#5c1a82"/>
    <text x="450" y="280" font-size="180" text-anchor="middle" fill="#FFD700" font-family="serif" font-weight="bold">SPQR</text>
    <text x="450" y="460" font-size="130" text-anchor="middle" fill="#FFD700" font-family="serif">🦅</text>
  </svg>`,

  // モンゴル帝国：青地に金のソヨンボ風デザイン
  'モンゴル帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="300" height="600" fill="#C4272F"/>
    <rect x="300" width="300" height="600" fill="#2255A4"/>
    <rect x="600" width="300" height="600" fill="#C4272F"/>
    <circle cx="450" cy="220" r="60" fill="#FFD700"/>
    <polygon points="450,120 470,180 430,180" fill="#FFD700"/>
    <rect x="410" y="290" width="80" height="20" fill="#FFD700"/>
    <rect x="410" y="320" width="80" height="20" fill="#FFD700"/>
    <rect x="410" y="350" width="80" height="20" fill="#FFD700"/>
  </svg>`,

  // ビザンツ帝国：黄地に黒い双頭鷲
  'ビザンツ帝国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#FFD700"/>
    <text x="450" y="420" font-size="380" text-anchor="middle" fill="#000" font-family="serif">⚜</text>
    <text x="450" y="380" font-size="320" text-anchor="middle" fill="#1a1a1a" font-family="serif" font-weight="bold">𝔅</text>
    <rect x="0" y="0" width="900" height="600" fill="none" stroke="#8B6914" stroke-width="24"/>
  </svg>`,
  // ソビエト連邦：赤地に金の鎌と槌と赤い星
  'ソビエト連邦': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#CC0000"/>
    <text x="180" y="310" font-size="260" text-anchor="middle" fill="#FFD700" font-family="serif">☭</text>
    <polygon points="180,50 196,100 248,100 207,128 222,178 180,150 138,178 153,128 112,100 164,100" fill="#FFD700"/>
  </svg>`,

  // 東ドイツ：黒赤黄の三色旗＋中央に東ドイツ国章（コンパスと麦穂）
  '東ドイツ': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#000"/>
    <rect y="200" width="900" height="200" fill="#CC0000"/>
    <rect y="400" width="900" height="200" fill="#FFCE00"/>
    <circle cx="450" cy="300" r="80" fill="none" stroke="#000" stroke-width="8"/>
    <text x="450" y="330" font-size="90" text-anchor="middle" fill="#000" font-family="serif">⚙</text>
  </svg>`,

  // ユーゴスラビア：青白赤の横縞＋中央に赤い五芒星
  'ユーゴスラビア': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#003DA5"/>
    <rect y="200" width="900" height="200" fill="white"/>
    <rect y="400" width="900" height="200" fill="#CC0000"/>
    <polygon points="450,190 470,250 535,250 482,287 502,348 450,310 398,348 418,287 365,250 430,250" fill="#CC0000" stroke="#FFD700" stroke-width="6"/>
  </svg>`,

  // チェコスロバキア：白赤の横縞＋青い三角形
  'チェコスロバキア': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="300" fill="white"/>
    <rect y="300" width="900" height="300" fill="#CC0000"/>
    <polygon points="0,0 400,300 0,600" fill="#003DA5"/>
  </svg>`,

  // 南ベトナム：黄地に赤い三本線
  '南ベトナム': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#FFDA00"/>
    <rect x="0" y="220" width="900" height="50" fill="#CC0000"/>
    <rect x="0" y="300" width="900" height="50" fill="#CC0000"/>
    <rect x="0" y="380" width="900" height="50" fill="#CC0000"/>
  </svg>`,

  // ワイマール共和国：黒赤黄の三色旗（現ドイツと同じ）
  'ワイマール共和国': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#000"/>
    <rect y="200" width="900" height="200" fill="#CC0000"/>
    <rect y="400" width="900" height="200" fill="#FFCE00"/>
    <text x="450" y="360" font-size="64" text-anchor="middle" fill="rgba(0,0,0,0.25)" font-family="sans-serif" font-weight="bold">1919–1933</text>
  </svg>`,

  // ザイール：緑地に黄い円＋腕と松明（旗のデザインを簡略化）
  'ザイール': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#007A5E"/>
    <circle cx="450" cy="300" r="120" fill="#FFCD00" stroke="#CC0000" stroke-width="14"/>
    <text x="450" y="355" font-size="130" text-anchor="middle" fill="#CC0000">✊</text>
  </svg>`,

  // 南イエメン：赤白黒の横縞＋青い三角形と赤い五芒星
  '南イエメン': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#CC0000"/>
    <rect y="200" width="900" height="200" fill="white"/>
    <rect y="400" width="900" height="200" fill="#000"/>
    <polygon points="0,0 350,300 0,600" fill="#0047AB"/>
    <polygon points="175,220 192,272 247,272 202,303 219,355 175,324 131,355 148,303 103,272 158,272" fill="#CC0000"/>
  </svg>`,
}

/**
 * flag フィールドの値がSVGで表示すべきかどうか判定（flag==='svg'）
 */
export function isSvgFlag(flag) {
  return flag === 'svg'
}

/**
 * SVGをdata URIに変換してimg srcとして使える形式を返す
 */
export function svgToDataUri(svgStr) {
  const encoded = encodeURIComponent(svgStr.trim())
  return `data:image/svg+xml,${encoded}`
}

/**
 * 国名からSVG文字列を返す（なければnull）
 */
export function getFlagSvg(name) {
  return FLAGS[name] || null
}
