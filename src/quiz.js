import { COUNTRIES, DIFF_CONFIG } from './data.js'
import { state } from './state.js'
import { polandballSVG } from './polandball.js'
import { burstConfetti } from './particles.js'
import { getFlagSvg, svgToDataUri } from './flags.js'

// バトル用にランダムな国旗を2つ選んでキャラとして固定
function pickBattleFlags() {
  const pool = COUNTRIES.filter(c => c.tier === 1)
  const picked = []
  while (picked.length < 2) {
    const c = pool[Math.floor(Math.random() * pool.length)]
    if (!picked.includes(c)) picked.push(c)
  }
  return [picked[0].flag, picked[1].flag]
}

// ===== UTILS =====
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ===== RANKING =====
function getRanking() {
  try { return JSON.parse(localStorage.getItem('flagQuizRanking') || '[]') } catch { return [] }
}
function saveRanking(entry) {
  let r = getRanking()
  r.push(entry)
  r.sort((a, b) => b.score - a.score)
  r = r.slice(0, 10)
  localStorage.setItem('flagQuizRanking', JSON.stringify(r))
}
function renderRanking() {
  const list = document.getElementById('ranking-list')
  const r = getRanking()
  if (r.length === 0) {
    list.innerHTML = '<li style="color:var(--muted);font-size:0.85rem;text-align:center;padding:8px">まだ記録がありません</li>'
    return
  }
  const medals = ['🥇', '🥈', '🥉']
  list.innerHTML = r.map((e, i) => `
    <li class="ranking-item">
      <span class="rank-num">${medals[i] || (i + 1)}</span>
      <span>${e.date}</span>
      <span class="rank-diff">[${e.diff}${e.mode ? ' ' + e.mode : ''}]</span>
      <span class="rank-score">${e.score}pt</span>
    </li>`).join('')
}

// ===== SCREENS =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'))
  document.getElementById(id).classList.remove('hidden')
}

export function goHome() {
  clearTimer()
  state.battleActive = false
  showScreen('screen-home')
  renderRanking()
}

// ===== BATTLE =====
export function openBattleSetup() {
  clearTimer()
  state.battleFlags = pickBattleFlags()
  const [f1, f2] = state.battleFlags
  document.getElementById('setup-mascots').innerHTML = `
    <div class="setup-pb setup-pb1">
      ${polandballSVG(f1, 80, { expression: 'happy', hat: true })}
      <div class="pb-label">P1</div>
    </div>
    <div class="setup-pb-vs">VS</div>
    <div class="setup-pb setup-pb2">
      ${polandballSVG(f2, 80, { expression: 'happy', flip: true })}
      <div class="pb-label">P2</div>
    </div>
  `
  showScreen('screen-battle-setup')
}

export function selectBattleDiff(btn) {
  document.querySelectorAll('.bdiff-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  state.currentDiff = btn.dataset.diff
}

export function startBattle() {
  const n1 = document.getElementById('battle-name1').value.trim() || 'プレイヤー1'
  const n2 = document.getElementById('battle-name2').value.trim() || 'プレイヤー2'
  state.battleNames = [n1, n2]
  state.battleScores = [0, 0]
  state.battleCorrects = [0, 0]
  state.battleActive = true
  state.battlePlayer = 1
  state.battleQuestions = buildQuestions()
  state.currentMode = 'flag2name'
  state.questionModes = []
  _startPlayerRound()
}

function _startPlayerRound() {
  const p = state.battlePlayer
  state.questions = state.battleQuestions
  state.qIndex = 0
  state.score = 0
  state.streak = 0
  state.maxStreak = 0
  state.correctCount = 0
  state.wrongItems = []
  showScreen('screen-quiz')
  const pbSvg = polandballSVG(state.battleFlags[p - 1], 28, { expression: 'normal' })
  document.getElementById('q-score').innerHTML =
    `<span class="battle-header-pb">${pbSvg}</span>${state.battleNames[p - 1]}: 0pt`
  renderQuestion()
}

export function startNextPlayerRound() {
  _startPlayerRound()
}

function showBattleHandoff() {
  const p = state.battlePlayer
  state.battleScores[p - 1] = state.score
  state.battleCorrects[p - 1] = state.correctCount
  if (p === 1) {
    state.battlePlayer = 2
    const [n1, n2] = state.battleNames
    const [f1, f2] = state.battleFlags
    document.getElementById('handoff-pb').innerHTML = `
      <div class="handoff-pb-inner">
        <div class="handoff-pb-item handoff-pb-done">
          ${polandballSVG(f1, 64, { expression: 'sad' })}
          <div class="pb-label">${n1}</div>
          <div class="pb-score-tag">${state.battleScores[0]}pt</div>
        </div>
        <div class="handoff-pb-arrow">→</div>
        <div class="handoff-pb-item handoff-pb-next pb-bounce">
          ${polandballSVG(f2, 80, { expression: 'happy', flip: true })}
          <div class="pb-label">${n2}</div>
        </div>
      </div>`
    document.getElementById('handoff-title').textContent = `${n2} の番！`
    document.getElementById('handoff-sub').textContent = '端末を渡してください'
    document.getElementById('handoff-score').innerHTML = ''
    document.getElementById('handoff-btn').textContent = '準備OK！ ▶'
    showScreen('screen-battle-handoff')
  } else {
    showBattleResult()
  }
}

function showBattleResult() {
  const [n1, n2] = state.battleNames
  const [s1, s2] = state.battleScores
  const [c1, c2] = state.battleCorrects
  const [f1, f2] = state.battleFlags
  const total = state.battleQuestions.length
  const p1expr = s1 > s2 ? 'happy' : s1 < s2 ? 'sad' : 'normal'
  const p2expr = s2 > s1 ? 'happy' : s2 < s1 ? 'sad' : 'normal'
  const p1hat  = s1 >= s2
  const p2hat  = s2 > s1
  let winnerHtml
  if (s1 > s2) {
    winnerHtml = `<div class="winner-trophy">🏆</div><div class="winner-name">${n1} の勝ち！</div>`
    burstConfetti(80)
  } else if (s2 > s1) {
    winnerHtml = `<div class="winner-trophy">🏆</div><div class="winner-name">${n2} の勝ち！</div>`
    burstConfetti(80)
  } else {
    winnerHtml = `<div class="winner-trophy">🤝</div><div class="winner-name">引き分け！</div>`
  }
  document.getElementById('battle-winner').innerHTML = winnerHtml
  document.getElementById('battle-pb-row').innerHTML = `
    <div class="result-pb-wrap">
      <div class="result-pb-item ${s1 >= s2 ? 'pb-winner' : ''}">
        ${polandballSVG(f1, 90, { expression: p1expr, hat: p1hat })}
        <div class="pb-label">${n1}</div>
      </div>
      <div class="result-pb-vs">VS</div>
      <div class="result-pb-item ${s2 > s1 ? 'pb-winner' : ''}">
        ${polandballSVG(f2, 90, { expression: p2expr, hat: p2hat, flip: true })}
        <div class="pb-label">${n2}</div>
      </div>
    </div>`
  document.getElementById('battle-scores-final').innerHTML = `
    <div class="bscore-row ${s1 >= s2 ? 'bscore-win' : ''}">
      <span class="bscore-name">${n1}</span><span class="bscore-pt">${s1}pt</span>
    </div>
    <div class="bscore-vs">VS</div>
    <div class="bscore-row ${s2 > s1 ? 'bscore-win' : ''}">
      <span class="bscore-name">${n2}</span><span class="bscore-pt">${s2}pt</span>
    </div>`
  document.getElementById('battle-stats-grid').innerHTML = `
    <div class="bstat"><span class="bstat-key">正解数</span><span>${c1}/${total}</span><span>${c2}/${total}</span></div>
    <div class="bstat"><span class="bstat-key">正答率</span><span>${Math.round(c1/total*100)}%</span><span>${Math.round(c2/total*100)}%</span></div>`
  showScreen('screen-battle-result')
}

// ===== QUIZ FLOW =====
function buildQuestions() {
  const cfg = DIFF_CONFIG[state.currentDiff]
  let pool = COUNTRIES.filter(c => cfg.tiers.includes(c.tier))
  // 首都モードは capital が存在する国だけ対象（tier:4 は除外）
  if (state.currentMode === 'capital') pool = pool.filter(c => c.capital)
  return shuffle(pool).slice(0, cfg.total)
}

export function startQuiz() {
  clearTimer()
  state.questions = buildQuestions()
  state.qIndex = 0
  state.score = 0
  state.streak = 0
  state.maxStreak = 0
  state.correctCount = 0
  state.wrongItems = []
  // mix モードは問題ごとにランダムで方向を決定（最低1問ずつ両方向が含まれるよう保証）
  if (state.currentMode === 'mix') {
    const dirs = state.questions.map(() => Math.random() < 0.5 ? 'flag2name' : 'name2flag')
    // 両方向が1問以上含まれるよう保証
    if (!dirs.includes('flag2name')) dirs[0] = 'flag2name'
    if (!dirs.includes('name2flag')) dirs[dirs.length - 1] = 'name2flag'
    state.questionModes = dirs
  } else {
    state.questionModes = []
  }
  showScreen('screen-quiz')
  renderQuestion()
}

// 現在の問題の実際の方向を返す（mix なら questionModes から取得）
function currentQuestionMode() {
  if (state.currentMode === 'mix') return state.questionModes[state.qIndex]
  return state.currentMode
}

// 首都モードかどうか
function isCapitalMode() {
  return state.currentMode === 'capital'
}

function renderQuestion() {
  const cfg = DIFF_CONFIG[state.currentDiff]
  const q = state.questions[state.qIndex]
  const isName2Flag = currentQuestionMode() === 'name2flag'
  state.answered = false
  state.hintUsed = false

  // progress
  const pct = (state.qIndex / state.questions.length) * 100
  document.getElementById('progress-bar').style.width = pct + '%'
  document.getElementById('q-counter').textContent = `問題 ${state.qIndex + 1} / ${state.questions.length}`
  document.getElementById('q-score').textContent = `スコア: ${state.score}`

  // 問題カード表示
  const flagEl = document.getElementById('flag-display')
  flagEl.classList.remove('shake')
  if (isName2Flag) {
    flagEl.innerHTML = `<span class="question-name">${q.name}</span>`
  } else {
    // 首都モードも国旗を表示（国旗→首都を答える）
    const svgStr = getFlagSvg(q.name)
    if (svgStr) {
      flagEl.innerHTML = `<img class="flag-svg-img" src="${svgToDataUri(svgStr)}" alt="${q.name}">`
    } else {
      flagEl.innerHTML = `<span class="flag-emoji">${q.flag}</span>`
      if (window.twemoji) twemoji.parse(flagEl, { folder: 'svg', ext: '.svg' })
    }
  }

  // hint reset
  document.getElementById('hint-text').textContent = ''
  const hintBtn = document.getElementById('hint-btn')
  hintBtn.disabled = false
  hintBtn.textContent = `💡 ヒント (-${cfg.hintCost}pt)`

  // choices
  const capitalMode = isCapitalMode()
  const pool = COUNTRIES.filter(c => cfg.tiers.includes(c.tier) && c.name !== q.name && (!capitalMode || c.capital))
  const wrong3 = shuffle(pool).slice(0, 3)
  const choices = shuffle([q, ...wrong3])

  const container = document.getElementById('choices')
  container.innerHTML = ''
  choices.forEach(c => {
    const btn = document.createElement('button')
    if (isName2Flag) {
      // 国旗絵文字を選択肢に表示（照合・ログ用にdata属性も付ける）
      btn.className = 'choice-btn flag-choice'
      btn.dataset.countryName = c.name
      btn.dataset.countryFlag = c.flag
      const svgStr = getFlagSvg(c.name)
      if (svgStr) {
        btn.innerHTML = `<img class="flag-svg-img flag-svg-choice" src="${svgToDataUri(svgStr)}" alt="${c.name}">`
      } else {
        btn.innerHTML = `<span class="flag-emoji">${c.flag}</span>`
        if (window.twemoji) twemoji.parse(btn, { folder: 'svg', ext: '.svg' })
      }
    } else if (capitalMode) {
      // 首都モード：選択肢は首都名
      btn.className = 'choice-btn'
      btn.dataset.capital = c.capital
      btn.textContent = c.capital
    } else {
      btn.className = 'choice-btn'
      btn.textContent = c.name
    }
    // 正解判定：首都モードは capital 一致、それ以外は name 一致
    const correct = capitalMode ? c.capital === q.capital : c.name === q.name
    btn.onclick = () => handleAnswer(btn, correct, q)
    container.appendChild(btn)
  })

  // timer
  if (cfg.time > 0) {
    state.timeLeft = cfg.time
    document.getElementById('timer-label').textContent = `⏱ ${state.timeLeft}秒`
    document.getElementById('timer-bar').style.width = '100%'
    document.getElementById('timer-bar').style.background = 'var(--green)'
    startTimer(cfg.time, q)
  } else {
    document.getElementById('timer-label').textContent = ''
    document.getElementById('timer-bar').style.width = '0'
  }
}

function startTimer(total, q) {
  clearTimer()
  state.timerInterval = setInterval(() => {
    state.timeLeft--
    const pct = (state.timeLeft / total) * 100
    const bar = document.getElementById('timer-bar')
    bar.style.width = pct + '%'
    bar.style.background = pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--yellow)' : 'var(--red)'
    document.getElementById('timer-label').textContent = `⏱ ${state.timeLeft}秒`
    if (state.timeLeft <= 0) {
      clearTimer()
      if (!state.answered) {
        state.answered = true
        state.streak = 0
        document.getElementById('hint-btn').disabled = true
        state.wrongItems.push({ flag: q.flag, name: q.name, yours: '時間切れ', hint: q.hint, capital: q.capital })
        markCorrectBtn(isCapitalMode() ? q.capital : q.name)
        document.getElementById('flag-display').classList.add('shake')
        setTimeout(nextQuestion, 1600)
      }
    }
  }, 1000)
}

function clearTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null }
}

function markCorrectBtn(correctVal) {
  document.querySelectorAll('.choice-btn').forEach(b => {
    // name2flag モードはdata属性、首都モードはdataset.capital、それ以外はtextContent
    const match = b.dataset.countryName
      ? b.dataset.countryName === correctVal
      : b.dataset.capital
        ? b.dataset.capital === correctVal
        : b.textContent === correctVal
    if (match) b.classList.add('correct')
    b.disabled = true
  })
}

function handleAnswer(btn, isCorrect, q) {
  if (state.answered) return
  state.answered = true
  clearTimer()
  document.getElementById('hint-btn').disabled = true
  document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true })

  if (isCorrect) {
    btn.classList.add('correct')
    burstConfetti(45)
    const cfg = DIFF_CONFIG[state.currentDiff]
    const base = cfg.time === 0 ? 10 : Math.ceil(10 + state.timeLeft * 0.5)
    const bonus = state.hintUsed ? 0 : 2
    state.streak++
    state.maxStreak = Math.max(state.maxStreak, state.streak)
    const streakBonus = state.streak >= 3 ? Math.min(state.streak - 2, 5) : 0
    const gained = base + bonus + streakBonus
    state.score += gained
    state.correctCount++
    if (state.battleActive) {
      const pbSvg = polandballSVG(state.battleFlags[state.battlePlayer - 1], 28, { expression: 'happy' })
      document.getElementById('q-score').innerHTML =
        `<span class="battle-header-pb">${pbSvg}</span>${state.battleNames[state.battlePlayer - 1]}: ${state.score}pt`
    } else {
      document.getElementById('q-score').textContent = `スコア: ${state.score}`
    }
    setTimeout(nextQuestion, 900)
  } else {
    btn.classList.add('wrong')
    markCorrectBtn(isCapitalMode() ? q.capital : q.name)
    state.streak = 0
    document.getElementById('flag-display').classList.add('shake')
    const yourAnswer = btn.dataset.countryName
      ? `${btn.dataset.countryFlag} ${btn.dataset.countryName}`
      : btn.textContent
    state.wrongItems.push({ flag: q.flag, name: q.name, yours: yourAnswer, hint: q.hint, capital: q.capital })
    setTimeout(nextQuestion, 1600)
  }
}

function nextQuestion() {
  state.qIndex++
  if (state.qIndex >= state.questions.length) {
    if (state.battleActive) {
      showBattleHandoff()
    } else {
      showResult()
    }
  } else {
    renderQuestion()
  }
}

export function showHint() {
  if (state.hintUsed || state.answered) return
  const q = state.questions[state.qIndex]
  state.hintUsed = true
  document.getElementById('hint-text').textContent = `ヒント: ${q.hint}`
  document.getElementById('hint-btn').disabled = true
}

export function selectDiff(btn) {
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  state.currentDiff = btn.dataset.diff
}

export function selectMode(btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  state.currentMode = btn.dataset.mode
}

// ===== RESULT =====
function showResult() {
  const total = state.questions.length
  const acc = Math.round((state.correctCount / total) * 100)
  const emojis = acc >= 90 ? '🏆' : acc >= 70 ? '🌟' : acc >= 50 ? '👍' : '📚'
  const labels = acc >= 90 ? '完璧！素晴らしい！' : acc >= 70 ? 'よくできました！' : acc >= 50 ? 'まずまずです' : 'もっと練習しよう！'

  document.getElementById('result-emoji').textContent = emojis
  document.getElementById('result-score').textContent = state.score + 'pt'
  document.getElementById('result-label').textContent = labels
  document.getElementById('stat-correct').textContent = `${state.correctCount}/${total}`
  document.getElementById('stat-acc').textContent = acc + '%'
  document.getElementById('stat-streak').textContent = state.maxStreak

  const wl = document.getElementById('wrong-list')
  if (state.wrongItems.length > 0) {
    wl.innerHTML = `<h3>❌ 間違えた問題 (${state.wrongItems.length}問)</h3>` +
      state.wrongItems.map(w => {
        const svgStr = getFlagSvg(w.name)
        const flagHtml = svgStr
          ? `<img class="flag-svg-img flag-svg-wrong" src="${svgToDataUri(svgStr)}" alt="${w.name}">`
          : `<span class="flag-emoji">${w.flag}</span>`
        return `
        <div class="wrong-item">
          <span class="wrong-flag">${flagHtml}</span>
          <div>
            <div class="wrong-name">${w.name}${w.capital ? ' <span class="wrong-capital">🏛️ ' + w.capital + '</span>' : ''}</div>
            <div class="wrong-your">あなたの答え: ${w.yours}</div>
            ${w.hint ? '<div class="wrong-advice">💡 ' + w.hint + '</div>' : ''}
          </div>
        </div>`
      }).join('')
    if (window.twemoji) twemoji.parse(wl, { folder: 'svg', ext: '.svg' })
  } else {
    wl.innerHTML = '<div style="text-align:center;color:var(--green);padding:16px;font-weight:600">全問正解！🎉</div>'
  }

  const now = new Date()
  const date = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  const modeLabel = { flag2name: '🚩→🔤', name2flag: '🔤→🚩', mix: '🔀mix' }[state.currentMode] || ''
  saveRanking({ score: state.score, diff: state.currentDiff, mode: modeLabel, date })

  if (acc >= 70) burstConfetti(acc >= 90 ? 100 : 60)
  showScreen('screen-result')
}
