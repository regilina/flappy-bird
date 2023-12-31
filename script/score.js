import { game } from './game.js'
import {
  FONT_STYLES
} from './config.js'

export default class Score {
  constructor (ctx) {
    this.ctx = ctx
    this.best = parseInt(localStorage.getItem('best')) || 0
    this.value = 0
  }

  draw () {
    this.ctx.fillStyle = '#FFF'
    this.ctx.strokeStyle = '#000'

    if (game.state.current === game.state.game) {
      this.ctx.lineWidth = 2
      this.ctx.font = FONT_STYLES.SCORE_FONT

      this.ctx.fillText(this.value, game.cvs.width / 2, 50)
      this.ctx.strokeText(this.value, game.cvs.width / 2, 50)
    } else if (game.state.current == game.state.over) {
      this.ctx.font = FONT_STYLES.GAME_OVER_FONT

      this.ctx.fillText(this.value, 225, 186)
      this.ctx.strokeText(this.value, 225, 186)
      this.ctx.fillText(this.best, 225, 228)
      this.ctx.strokeText(this.best, 225, 228)
    }
  }

  reset () {
    this.value = 0
  }
}
