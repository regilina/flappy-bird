const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = imgURL;

const SPEED = 3.1;
let index = 0;

const render = () => {
  index += 0.3;
  
  const backgroudX = -((index * SPEED) % canvas.width);

  const bgSource = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartOneResult = {
    x: backgroudX + canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };


  // вторая часть фонового изображения, которая
  // идёт следом за первой
  const bgPartTwoResult = {
    x: backgroudX,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartOneResult.x,
    bgPartOneResult.y,
    bgPartOneResult.width,
    bgPartOneResult.height
  );
  
  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartTwoResult.x,
    bgPartTwoResult.y,
    bgPartTwoResult.width,
    bgPartTwoResult.height
  );

  window.requestAnimationFrame(render);
};

img.onload = render;