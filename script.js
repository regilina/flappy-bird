import Background from './background.js'
import Foreground from './foreground.js'
import Bird from './bird.js'
import Message from './message.js'
import Pipes from './pipes.js'
import Score from './score.js'

export default class Game {
  constructor () {
    this.cvs = document.getElementById('bird')
    this.ctx = this.cvs.getContext('2d')
    this.frames = 0
    this.DEGREE = Math.PI / 180

    this.sprite = new Image()
    this.sprite.src = 'img/sprite.png'

    this.loadSounds()

    this.state = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2
    }

    this.startBtn = {
      x: 120,
      y: 263,
      w: 83,
      h: 29
    }

    this.bg = new Background(this.ctx, this.sprite, this.cvs)
    this.fg = new Foreground(this.ctx, this.sprite, this.cvs)
    this.bird = new Bird(this.ctx, this.sprite, this.cvs)
    this.getReady = new Message(
      this.ctx,
      this.sprite,
      this.cvs,
      0,
      228,
      173,
      152,
      this.cvs.width / 2 - 173 / 2,
      80
    )
    this.gameOver = new Message(
      this.ctx,
      this.sprite,
      this.cvs,
      175,
      228,
      225,
      202,
      this.cvs.width / 2 - 225 / 2,
      90
    )
    this.pipes = new Pipes(this.ctx, this.sprite, this.cvs)
    this.score = new Score(this.ctx)
  }

  loadSounds () {
    this.SCORE_S = new Audio()
    this.SCORE_S.src = 'audio/sfx_point.wav'

    this.FLAP = new Audio()
    this.FLAP.src = 'audio/sfx_flap.wav'

    this.HIT = new Audio()
    this.HIT.src = 'audio/sfx_hit.wav'

    this.SWOOSHING = new Audio()
    this.SWOOSHING.src = 'audio/sfx_swooshing.wav'

    this.DIE = new Audio()
    this.DIE.src = 'audio/sfx_die.wav'
  }

  handleCanvasClick (evt) {
    switch (this.state.current) {
      case this.state.getReady:
        this.state.current = this.state.game
        this.SWOOSHING.play()
        break
      case this.state.game:
        if (this.bird.y - this.bird.radius <= 0) return
        this.bird.flap()
        this.FLAP.play()
        break
      case this.state.over:
        const rect = this.cvs.getBoundingClientRect()
        const clickX = evt.clientX - rect.left
        const clickY = evt.clientY - rect.top

        if (
          clickX >= this.startBtn.x &&
                  clickX <= this.startBtn.x + this.startBtn.w &&
                  clickY >= this.startBtn.y &&
                  clickY <= this.startBtn.y + this.startBtn.h
        ) {
          this.pipes.reset()
          this.bird.speedReset()
          this.score.reset()
          this.state.current = this.state.getReady
        }
        break
    }
  }

  draw () {
    this.ctx.fillStyle = '#70c5ce'
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height)

    this.bg.draw()
    this.pipes.draw()
    this.fg.draw()
    this.bird.draw()
    this.getReady.draw()
    this.gameOver.draw()
    this.score.draw()
  }

  update () {
    this.bird.update()
    this.fg.update()
    this.pipes.update()
  }

  loop () {
    this.update()
    this.draw()
    this.frames++

    requestAnimationFrame(this.loop.bind(this))
  }

  start () {
    this.cvs.addEventListener('click', this.handleCanvasClick.bind(this))
    this.loop()
  }
}

export const game = new Game()
game.start()
