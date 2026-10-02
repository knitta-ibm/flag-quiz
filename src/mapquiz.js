import { COUNTRIES } from './data.js'
import { burstConfetti } from './particles.js'

// ISO alpha-3 → 国名 の対応（data.js の name と一致させる）
const ISO3_TO_NAME = {
  JPN:'日本', USA:'アメリカ', GBR:'イギリス', FRA:'フランス', DEU:'ドイツ',
  CHN:'中国', KOR:'韓国', ITA:'イタリア', ESP:'スペイン', BRA:'ブラジル',
  CAN:'カナダ', AUS:'オーストラリア', IND:'インド', RUS:'ロシア', MEX:'メキシコ',
  SAU:'サウジアラビア', ZAF:'南アフリカ', ARG:'アルゼンチン', NOR:'ノルウェー', SWE:'スウェーデン',
  PRT:'ポルトガル', NLD:'オランダ', BEL:'ベルギー', POL:'ポーランド', CHE:'スイス',
  AUT:'オーストリア', DNK:'デンマーク', FIN:'フィンランド', GRC:'ギリシャ', TUR:'トルコ',
  ISR:'イスラエル', EGY:'エジプト', NGA:'ナイジェリア', KEN:'ケニア', COL:'コロンビア',
  CHL:'チリ', PER:'ペルー', VEN:'ベネズエラ', THA:'タイ', VNM:'ベトナム',
  MYS:'マレーシア', IDN:'インドネシア', PHL:'フィリピン', SGP:'シンガポール', PAK:'パキスタン',
  BGD:'バングラデシュ', NZL:'ニュージーランド', IRN:'イラン', IRQ:'イラク', UKR:'ウクライナ',
  PRI:'プエルトリコ', CUB:'キューバ', URY:'ウルグアイ', PRY:'パラグアイ', PAN:'パナマ',
  GTM:'グアテマラ', BOL:'ボリビア', ROU:'ルーマニア', HUN:'ハンガリー', CZE:'チェコ',
  SVK:'スロバキア', HRV:'クロアチア', SRB:'セルビア', BGR:'ブルガリア',
  MLI:'マリ', SEN:'セネガル', CIV:'コートジボワール', GHA:'ガーナ', TUN:'チュニジア',
  MAR:'モロッコ', DZA:'アルジェリア', ETH:'エチオピア', TZA:'タンザニア', ZMB:'ザンビア',
  ZWE:'ジンバブエ', MOZ:'モザンビーク', CMR:'カメルーン', AGO:'アンゴラ',
  KAZ:'カザフスタン', UZB:'ウズベキスタン', TKM:'トルクメニスタン', MNG:'モンゴル',
  LAO:'ラオス', KHM:'カンボジア', MMR:'ミャンマー', NPL:'ネパール', LKA:'スリランカ',
  ARM:'アルメニア', GEO:'ジョージア', AZE:'アゼルバイジャン', BLR:'ベラルーシ',
  MDA:'モルドバ', ALB:'アルバニア', MKD:'北マケドニア', BIH:'ボスニア・ヘルツェゴビナ',
  SVN:'スロベニア', MNE:'モンテネグロ', LVA:'ラトビア', LTU:'リトアニア', EST:'エストニア',
}

// 名前 → ISO alpha-3
const NAME_TO_ISO3 = Object.fromEntries(Object.entries(ISO3_TO_NAME).map(([k,v]) => [v,k]))

// data.js のフラグ情報を名前で引く
const byName = Object.fromEntries(COUNTRIES.map(c => [c.name, c]))

// ===== STATE =====
let topoData = null
let mapState = {
  questions: [],
  qIndex: 0,
  score: 0,
  correctCount: 0,
  maxStreak: 0,
  streak: 0,
  answered: false,
}

const TOTAL = 10

// ===== UTILS =====
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'))
  document.getElementById(id).classList.remove('hidden')
}

// ===== TopoJSON 取得（キャッシュ） =====
async function loadTopo() {
  if (topoData) return topoData
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  topoData = await res.json()
  return topoData
}

// ISO numeric → ISO alpha-3 変換テーブル（world-atlas は numeric を使う）
// 必要な国だけ列挙
const NUM_TO_ISO3 = {
  '004':'AFG','008':'ALB','012':'DZA','024':'AGO','032':'ARG','036':'AUS','040':'AUT',
  '050':'BGD','056':'BEL','068':'BOL','070':'BIH','076':'BRA','100':'BGR','116':'KHM',
  '120':'CMR','124':'CAN','144':'LKA','152':'CHL','156':'CHN','170':'COL','188':'CRI',
  '192':'CUB','196':'CYP','203':'CZE','204':'BEN','208':'DNK','218':'ECU','818':'EGY',
  '222':'SLV','231':'ETH','246':'FIN','250':'FRA','276':'DEU','288':'GHA','300':'GRC',
  '320':'GTM','332':'HTI','340':'HND','348':'HUN','356':'IND','360':'IDN','364':'IRN',
  '368':'IRQ','372':'IRL','376':'ISR','380':'ITA','388':'JAM','392':'JPN','400':'JOR',
  '398':'KAZ','404':'KEN','408':'PRK','410':'KOR','418':'LAO','422':'LBN','430':'LBR',
  '434':'LBY','440':'LTU','428':'LVA','484':'MEX','496':'MNG','504':'MAR','508':'MOZ',
  '458':'MYS','516':'NAM','524':'NPL','528':'NLD','554':'NZL','566':'NGA','578':'NOR',
  '586':'PAK','591':'PAN','598':'PNG','600':'PRY','604':'PER','608':'PHL','616':'POL',
  '620':'PRT','630':'PRI','642':'ROU','643':'RUS','682':'SAU','686':'SEN','694':'SLE',
  '703':'SVK','705':'SVN','706':'SOM','710':'ZAF','724':'ESP','752':'SWE','756':'CHE',
  '762':'TJK','764':'THA','788':'TUN','792':'TUR','795':'TKM','800':'UGA','804':'UKR',
  '784':'ARE','826':'GBR','840':'USA','858':'URY','860':'UZB','862':'VEN','704':'VNM',
  '887':'YEM','894':'ZMB','716':'ZWE','051':'ARM','031':'AZE','112':'BLR','191':'HRV',
  '268':'GEO','807':'MKD','498':'MDA','499':'MNE','688':'SRB',
  '466':'MLI','384':'CIV','834':'TZA','104':'MMR','233':'EST',
}

// 110m精度の地図では小さすぎて存在しない国（問題から除外）
const TOO_SMALL_FOR_MAP = new Set(['SGP','PRI','XKX'])

// ===== 地図描画 =====
function renderMap(topo, highlightIso3) {
  const svg = d3.select('#map-svg')
  svg.selectAll('*').remove()

  const countries = topojson.feature(topo, topo.objects.countries)
  const projection = d3.geoNaturalEarth1()
    .scale(153)
    .translate([480, 250])

  const path = d3.geoPath().projection(projection)

  // ハイライト対象のnumericコードを求める
  const targetNumeric = Object.entries(NUM_TO_ISO3).find(([,v]) => v === highlightIso3)?.[0]

  svg.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', d => {
      const num = String(d.id).padStart(3, '0')
      return num === targetNumeric ? 'map-country map-highlight' : 'map-country'
    })
    .attr('data-id', d => String(d.id).padStart(3, '0'))

  // ハイライト国が画面に収まるようズーム
  if (targetNumeric) {
    const target = countries.features.find(f => String(f.id).padStart(3,'0') === targetNumeric)
    if (target) {
      const [[x0,y0],[x1,y1]] = path.bounds(target)
      // bounds が壊れていたら（Infinity など）ズームしない
      if (isFinite(x0) && isFinite(y0) && isFinite(x1) && isFinite(y1)) {
        const cx = (x0 + x1) / 2
        const cy = (y0 + y1) / 2
        const w = Math.max(x1 - x0, 40)
        const h = Math.max(y1 - y0, 40)
        const scale = Math.min(8, 0.9 / Math.max(w / 960, h / 500))
        const tx = 480 - scale * cx
        const ty = 250 - scale * cy
        svg.attr('viewBox', `0 0 960 500`)
        svg.selectAll('path')
          .attr('transform', `translate(${tx},${ty}) scale(${scale})`)
          .style('stroke-width', `${1 / scale}px`)
      }
    }
  }
}

// ===== クイズ問題生成 =====
function buildMapQuestions() {
  // data.js に存在 かつ ISO3 マップに存在する国だけ対象（小さすぎる国は除外）
  const valid = COUNTRIES.filter(c => {
    const iso3 = NAME_TO_ISO3[c.name]
    return iso3 && !TOO_SMALL_FOR_MAP.has(iso3)
  })
  return shuffle(valid).slice(0, TOTAL)
}

// ===== クイズ描画 =====
async function renderMapQuestion() {
  const q = mapState.questions[mapState.qIndex]
  const iso3 = NAME_TO_ISO3[q.name]
  mapState.answered = false

  // progress
  const pct = (mapState.qIndex / TOTAL) * 100
  document.getElementById('map-progress-bar').style.width = pct + '%'
  document.getElementById('map-q-counter').textContent = `問題 ${mapState.qIndex + 1} / ${TOTAL}`
  document.getElementById('map-q-score').textContent = `スコア: ${mapState.score}`
  document.getElementById('map-question-label').textContent = 'この色のついた国はどこ？'

  // 地図
  const topo = await loadTopo()
  renderMap(topo, iso3)

  // 選択肢：正解1 + 不正解3（同じ配列から）
  const others = shuffle(COUNTRIES.filter(c => c.name !== q.name && NAME_TO_ISO3[c.name])).slice(0, 3)
  const choices = shuffle([q, ...others])

  const container = document.getElementById('map-choices')
  container.innerHTML = ''
  choices.forEach(c => {
    const btn = document.createElement('button')
    btn.className = 'choice-btn'
    btn.textContent = c.name
    btn.onclick = () => handleMapAnswer(btn, c.name === q.name, q)
    container.appendChild(btn)
  })
}

function handleMapAnswer(btn, isCorrect, q) {
  if (mapState.answered) return
  mapState.answered = true
  document.querySelectorAll('#map-choices .choice-btn').forEach(b => { b.disabled = true })

  if (isCorrect) {
    btn.classList.add('correct')
    burstConfetti(45)
    mapState.streak++
    mapState.maxStreak = Math.max(mapState.maxStreak, mapState.streak)
    const streakBonus = mapState.streak >= 3 ? Math.min(mapState.streak - 2, 5) : 0
    mapState.score += 10 + streakBonus
    mapState.correctCount++
    document.getElementById('map-q-score').textContent = `スコア: ${mapState.score}`
    setTimeout(nextMapQuestion, 900)
  } else {
    btn.classList.add('wrong')
    mapState.streak = 0
    // 正解ボタンをハイライト
    document.querySelectorAll('#map-choices .choice-btn').forEach(b => {
      if (b.textContent === q.name) b.classList.add('correct')
    })
    setTimeout(nextMapQuestion, 1600)
  }
}

function nextMapQuestion() {
  mapState.qIndex++
  if (mapState.qIndex >= TOTAL) {
    showMapResult()
  } else {
    renderMapQuestion()
  }
}

function showMapResult() {
  const acc = Math.round((mapState.correctCount / TOTAL) * 100)
  const emojis = acc >= 90 ? '🏆' : acc >= 70 ? '🌟' : acc >= 50 ? '👍' : '📚'
  const label  = acc >= 90 ? '完璧！素晴らしい！' : acc >= 70 ? 'よくできました！' : acc >= 50 ? 'まずまずです' : 'もっと練習しよう！'

  document.getElementById('result-emoji').textContent = emojis
  document.getElementById('result-score').textContent = mapState.score + 'pt'
  document.getElementById('result-label').textContent = label + '（国の形クイズ）'
  document.getElementById('stat-correct').textContent = `${mapState.correctCount}/${TOTAL}`
  document.getElementById('stat-acc').textContent = acc + '%'
  document.getElementById('stat-streak').textContent = mapState.maxStreak
  document.getElementById('wrong-list').innerHTML = ''

  if (acc >= 70) burstConfetti(acc >= 90 ? 100 : 60)
  showScreen('screen-result')
}

// ===== エントリーポイント =====
export async function startMapQuiz() {
  mapState = { questions: buildMapQuestions(), qIndex: 0, score: 0,
               correctCount: 0, maxStreak: 0, streak: 0, answered: false }
  showScreen('screen-mapquiz')
  await renderMapQuestion()
}
