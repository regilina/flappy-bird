import { game } from './game.js'
import {
  GAME_CONSTANTS
} from './config.js'

export default class Pipes {
  constructor (ctx, sprite, cvs) {
    this.ctx = ctx
    this.sprite = sprite
    this.cvs = cvs

    this.position = []

    this.top = {
      sX: 553,
      sY: 0
    }
    this.bottom = {
      sX: 502,
      sY: 0
    }

    this.w = 53
    this.h = 400

    this.maxYPos = -150

    this.gap = GAME_CONSTANTS.PIPE_GAP
    this.dx = GAME_CONSTANTS.PIPE_SPEED
  }

  draw () {
    for (let i = 0; i < this.position.length; i++) {
      const p = this.position[i]

      const topYPos = p.y
      const bottomYPos = p.y + this.h + this.gap

      this.ctx.drawImage(
        this.sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      )

      this.ctx.drawImage(
        this.sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      )
    }
  }

  update () {
    if (game.state.current !== game.state.game) return

    if (game.frames % 100 == 0) {
      this.position.push({
        x: this.cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      })
    }
    for (let i = 0; i < this.position.length; i++) {
      const p = this.position[i]

      const bottomPipeYPos = p.y + this.h + this.gap

      if (
        game.bird.x + game.bird.radius > p.x &&
              game.bird.x - game.bird.radius < p.x + this.w &&
              game.bird.y + game.bird.radius > p.y &&
              game.bird.y - game.bird.radius < p.y + this.h
      ) {
        game.state.current = game.state.over
        game.HIT.play()
      }
      if (
        game.bird.x + game.bird.radius > p.x &&
              game.bird.x - game.bird.radius < p.x + this.w &&
              game.bird.y + game.bird.radius > bottomPipeYPos &&
              game.bird.y - game.bird.radius < bottomPipeYPos + this.h
      ) {
        game.state.current = game.state.over
        game.HIT.play()
      }

      p.x -= this.dx

      if (p.x + this.w <= 0) {
        this.position.shift()
        game.score.value += 1
        game.SCORE_S.play()
        game.score.best = Math.max(game.score.value, game.score.best)
        localStorage.setItem('best', game.score.best)
      }
    }
  }

  reset () {
    this.position = []
  }
}
