class Background {
  constructor (img, canvas) {
    this.img = img
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.SPEED = 3.1
    this.index = 0
  }

  render () {
    this.index += 0.3
    const backgroudX = -((this.index * this.SPEED) % this.canvas.width)

    const bgSource = {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    }

    const bgPartOneResult = {
      x: backgroudX + this.canvas.width,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    }

    const bgPartTwoResult = {
      x: backgroudX,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.ctx.drawImage(
      this.img,
      bgSource.x,
      bgSource.y,
      bgSource.width,
      bgSource.height,
      bgPartOneResult.x,
      bgPartOneResult.y,
      bgPartOneResult.width,
      bgPartOneResult.height
    )

    this.ctx.drawImage(
      this.img,
      bgSource.x,
      bgSource.y,
      bgSource.width,
      bgSource.height,
      bgPartTwoResult.x,
      bgPartTwoResult.y,
      bgPartTwoResult.width,
      bgPartTwoResult.height
    )
  }
}

class Bird {
  constructor (img, canvas) {
    this.img = img
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.SIZE = [51, 36]
    this.index = 0
  }

  render () {
    const birdSource = {
      x: 432,
      y: Math.floor((this.index % 9) / 3) * this.SIZE[1],
      width: this.SIZE[0],
      height: this.SIZE[1]
    }

    const birdResult = {
      x: this.canvas.width / 2 - this.SIZE[0] / 2,
      y: 200,
      width: this.SIZE[0],
      height: this.SIZE[1]
    }

    this.ctx.drawImage(
      this.img,
      birdSource.x,
      birdSource.y,
      birdSource.width,
      birdSource.height,
      birdResult.x,
      birdResult.y,
      birdResult.width,
      birdResult.height
    )
  }
}

class Game {
  constructor (imgURL, canvasId) {
    this.img = new Image()
    this.img.src = imgURL
    this.canvas = document.getElementById(canvasId)
    this.background = new Background(this.img, this.canvas)
    this.bird = new Bird(this.img, this.canvas)

    this.img.onload = () => this.render()
  }

  render () {
    this.background.render()
    this.bird.render()
    window.requestAnimationFrame(() => this.render())
  }
}

const imgURL = 'https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png'
const canvasId = 'canvas'

const game = new Game(imgURL, canvasId)
