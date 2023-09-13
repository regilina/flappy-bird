export default class Background {
  constructor (ctx, sprite, cvs) {
    this.ctx = ctx
    this.sprite = sprite
    this.cvs = cvs

    this.sX = 0
    this.sY = 0
    this.w = 275
    this.h = 226
    this.x = 0
    this.y = this.cvs.height - 226
  }

  draw () {
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

    this.ctx.drawImage(
      this.sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    )
  }
}
