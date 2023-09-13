import { game } from './game.js'

export default class Foreground {
  constructor (ctx, sprite, cvs) {
    this.ctx = ctx
    this.sprite = sprite
    this.cvs = cvs

    this.sX = 276
    this.sY = 0
    this.w = 224
    this.h = 112
    this.dx = 2 // Скорость движения земли

    // Рассчитываем количество экземпляров земли
    this.numberOfInstances = Math.ceil(this.cvs.width / this.w) + 1

    // Создаем массив для хранения позиций каждого экземпляра
    this.positions = Array.from({ length: this.numberOfInstances }, (_, i) => ({
      x: i * this.w,
      y: this.cvs.height - this.h
    }))
  }

  draw () {
    for (const position of this.positions) {
      this.ctx.drawImage(
        this.sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        position.x,
        position.y,
        this.w,
        this.h
      )
    }
  }

  update () {
    if (game.state.current == game.state.game) {
      for (const position of this.positions) {
        position.x -= this.dx
        if (position.x + this.w < 0) {
          // Если экземпляр земли полностью вышел за пределы холста, перемещаем его в конец
          position.x += this.numberOfInstances * this.w
        }
      }
    }
  }
}
