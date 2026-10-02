/**
 * 紙吹雪パーティクルエフェクト
 */

const COLORS = ['#5b8dee','#3ecf8e','#f5c542','#f66d6d','#c084fc','#fb923c','#34d399']

let canvas, ctx, particles = [], animId = null

function init() {
  canvas = document.getElementById('particle-canvas')
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
}

function resize() {
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
}

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.size  = Math.random() * 8 + 4
    this.vx    = (Math.random() - 0.5) * 8
    this.vy    = Math.random() * -12 - 4
    this.gravity = 0.45
    this.drag    = 0.97
    this.angle   = Math.random() * Math.PI * 2
    this.spin    = (Math.random() - 0.5) * 0.3
    this.alpha   = 1
    this.fade    = Math.random() * 0.015 + 0.008
    this.shape   = Math.random() < 0.5 ? 'rect' : 'circle'
  }

  update() {
    this.vy    += this.gravity
    this.vx    *= this.drag
    this.vy    *= this.drag
    this.x     += this.vx
    this.y     += this.vy
    this.angle += this.spin
    this.alpha -= this.fade
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle   = this.color
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles = particles.filter(p => p.alpha > 0)
  particles.forEach(p => { p.update(); p.draw() })
  if (particles.length > 0) {
    animId = requestAnimationFrame(loop)
  } else {
    animId = null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

/**
 * 正解パーティクルを発射する
 * @param {number} count  パーティクル数（デフォルト 60）
 */
export function burstConfetti(count = 60) {
  if (!canvas) init()

  // 画面中央上部からバースト
  const cx = window.innerWidth  / 2
  const cy = window.innerHeight * 0.35

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(
      cx + (Math.random() - 0.5) * 80,
      cy + (Math.random() - 0.5) * 40
    ))
  }

  if (!animId) {
    animId = requestAnimationFrame(loop)
  }
}
