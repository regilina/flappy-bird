import { game } from './game.js'

export default class Bird {
  constructor (ctx, sprite, cvs) {
    this.ctx = ctx
    this.sprite = sprite
    this.cvs = cvs

    this.animation = [
      { sX: 276, sY: 112 },
      { sX: 276, sY: 139 },
      { sX: 276, sY: 164 },
      { sX: 276, sY: 139 }
    ]

    this.x = 50
    this.y = 150
    this.w = 34
    this.h = 26

    this.radius = 12

    this.frame = 0

    this.gravity = 0.25
    this.jump = 4.6
    this.speed = 0
    this.rotation = 0
  }

  draw () {
    const bird = this.animation[this.frame]

    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotation)
    this.ctx.drawImage(
      this.sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    )

    this.ctx.restore()
  }

  flap () {
    this.speed = -this.jump
  }

  update () {
    this.period = game.state.current == game.state.getReady ? 10 : 5
    this.frame += game.frames % this.period == 0 ? 1 : 0
    this.frame = this.frame % this.animation.length

    if (game.state.current == game.state.getReady) {
      this.y = 150
      this.rotation = 0 * game.DEGREE
    } else {
      this.speed += this.gravity
      this.y += this.speed

      if (this.y + this.h / 2 >= this.cvs.height - game.fg.h) {
        this.y = this.cvs.height - game.fg.h - this.h / 2
        if (game.state.current == game.state.game) {
          game.state.current = game.state.over
          game.DIE.play()
        }
      }

      if (this.speed >= this.jump) {
        this.rotation = 90 * game.DEGREE
        this.frame = 1
      } else {
        this.rotation = -25 * game.DEGREE
      }
    }
  }

  speedReset () {
    this.speed = 0
  }
}
