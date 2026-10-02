import './style.css'
import { goHome, startQuiz, showHint, selectDiff, selectMode,
         openBattleSetup, startBattle, selectBattleDiff, startNextPlayerRound } from './quiz.js'
import { startMapQuiz } from './mapquiz.js'

// HTML のインラインイベントハンドラから呼べるようグローバルに公開
window.goHome = goHome
window.startQuiz = startQuiz
window.showHint = showHint
window.selectDiff = selectDiff
window.selectMode = selectMode
window.openBattleSetup = openBattleSetup
window.startBattle = startBattle
window.selectBattleDiff = selectBattleDiff
window.startNextPlayerRound = startNextPlayerRound
window.startMapQuiz = startMapQuiz

// ===== THEME =====
function applyBgImage(dataUrl) {
  document.body.style.backgroundImage = `url(${dataUrl})`
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundPosition = 'center'
  document.body.style.backgroundAttachment = 'fixed'
  document.getElementById('bg-image-clear').classList.add('visible')
}

function clearBgImage() {
  document.body.style.backgroundImage = ''
  document.body.style.backgroundSize = ''
  document.body.style.backgroundPosition = ''
  document.body.style.backgroundAttachment = ''
  document.getElementById('bg-image-clear').classList.remove('visible')
  localStorage.removeItem('flagQuizBgImage')
  // ファイル入力をリセット
  document.getElementById('bg-image-input').value = ''
}

function applyTheme({ bg, surface, card, text, muted, border }) {
  const r = document.documentElement.style
  r.setProperty('--bg',      bg)
  r.setProperty('--surface', surface || shiftColor(bg, 10))
  r.setProperty('--card',    card    || shiftColor(bg, 20))
  if (text)   r.setProperty('--text',   text)
  if (muted)  r.setProperty('--muted',  muted)
  if (border) r.setProperty('--border', border)
}

function shiftColor(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((n >> 16) & 0xff) + amount)
  const g = Math.min(255, ((n >>  8) & 0xff) + amount)
  const b = Math.min(255,  (n        & 0xff) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function saveTheme(data) {
  localStorage.setItem('flagQuizTheme', JSON.stringify(data))
}

function loadTheme() {
  try { return JSON.parse(localStorage.getItem('flagQuizTheme')) } catch { return null }
}

function initTheme() {
  const saved = loadTheme()
  if (saved) applyTheme(saved)

  // 保存済み背景画像を復元
  const savedImg = localStorage.getItem('flagQuizBgImage')
  if (savedImg) applyBgImage(savedImg)

  // プリセットのクリック
  document.getElementById('theme-presets').addEventListener('click', e => {
    const btn = e.target.closest('.theme-swatch:not(.theme-custom)')
    if (!btn) return
    const data = {
      bg:      btn.dataset.bg,
      surface: btn.dataset.surface,
      card:    btn.dataset.card,
      text:    btn.dataset.text   || null,
      muted:   btn.dataset.muted  || null,
      border:  btn.dataset.border || null,
    }
    applyTheme(data)
    saveTheme(data)
    updateActiveSwatches(btn.dataset.bg)
  })

  // カスタムカラーピッカー
  const picker = document.getElementById('custom-bg-picker')
  picker.addEventListener('input', () => {
    const data = { bg: picker.value, surface: null, card: null }
    applyTheme(data)
  })
  picker.addEventListener('change', () => {
    const data = { bg: picker.value, surface: null, card: null }
    saveTheme(data)
    updateActiveSwatches(null)
  })

  // 背景画像アップロード
  document.getElementById('bg-image-input').addEventListener('change', e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target.result
      applyBgImage(dataUrl)
      try {
        localStorage.setItem('flagQuizBgImage', dataUrl)
      } catch {
        // localStorage 容量超過時は保存しない（表示はそのまま継続）
      }
    }
    reader.readAsDataURL(file)
  })

  // 画像削除ボタン
  document.getElementById('bg-image-clear').addEventListener('click', clearBgImage)

  // 初期アクティブ状態
  updateActiveSwatches(saved?.bg || '#0f1117')
}

function updateActiveSwatches(activeBg) {
  document.querySelectorAll('.theme-swatch:not(.theme-custom)').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.bg === activeBg)
  })
}

initTheme()

goHome()
