// ===== ゲーム状態 =====
export const state = {
  currentDiff: 'easy',
  currentMode: 'flag2name', // 'flag2name' | 'name2flag' | 'mix'
  questionModes: [],        // mix 時に各問題の実際の方向を保持
  questions: [],
  qIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  wrongItems: [],
  timerInterval: null,
  timeLeft: 0,
  answered: false,
  hintUsed: false,

  // ===== バトル =====
  battleActive: false,
  battlePlayer: 1,
  battleNames: ['プレイヤー1', 'プレイヤー2'],
  battleScores: [0, 0],
  battleCorrects: [0, 0],
  battleQuestions: [],
  battleFlags: ['🇯🇵', '🇺🇸'],
}
