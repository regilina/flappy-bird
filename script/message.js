import { game } from './game.js'

export default class Message {
  constructor (ctx, sprite, cvs, sX, sY, w, h, x, y) {
    this.ctx = ctx
    this.sprite = sprite
    this.cvs = cvs

    this.sX = sX
    this.sY = sY
    this.w = w
    this.h = h
    this.x = x
    this.y = y
  }

  draw () {
    if (game.state.current == game.state.getReady || game.state.current == game.state.over) {
      this.ctx.drawImage(
        this.sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      )
    }
  }
}
