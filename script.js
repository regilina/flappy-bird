class Game {
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

class Background {
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

class Foreground {
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

class Bird {
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

class Message {
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

class Pipes {
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
    this.gap = 240
    this.maxYPos = -150
    this.dx = 2
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

class Score {
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
      this.ctx.font = '35px Teko'
      this.ctx.fillText(this.value, game.cvs.width / 2, 50)
      this.ctx.strokeText(this.value, game.cvs.width / 2, 50)
    } else if (game.state.current == game.state.over) {
      this.ctx.font = '25px Teko'
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

const game = new Game()
game.start()
