import Actor from './actorClass.js';

( () => {

let backgroundSprite = document.getElementById('backgroundSprite');
const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, 1024, 576);

let backgroundPattern = canvasContext.createPattern(backgroundSprite, 'no-repeat');

const player = new Actor({
  canvas: canvas,
  canvasContext: canvasContext,
  floorHeight: 95,
  position: {
    x: 100, 
    y: 331 
  },
  velocityY: 0,
  height: 150,
  width: 50,
  moveDirection: 'none',
  movementSpeed: 0,
  canJump: true,
  spriteTexture: 'red',
  OrientationIsFlipped: false,
  drawAttackBox: true,
  characterType: 'player',
  lightAttackVerticalOffset: 50,
  heavyAttackVerticalOffset: 50,
});

const enemy = new Actor({
  canvas: canvas,
  canvasContext: canvasContext,
  floorHeight: 95,
  position: {
    x: 874,
    y: 331
  },
  velocityY: 0,
  height: 150,
  width: 50,
  moveDirection: 'none',
  movementSpeed: 0,
  canJump: true,
  spriteTexture: 'blue',
  OrientationIsFlipped: true,
  drawAttackBox: true,
  characterType: 'AI',
  lightAttackVerticalOffset: 50,
  heavyAttackVerticalOffset: 50,
});

setInterval(() => {
  enemy.lightAttack(player);
}, 2000)

setInterval(() => {
  enemy.heavyAttack(player);
}, 3000)

const animate = () => {
  window.requestAnimationFrame(animate);
  canvasContext.fillStyle = backgroundPattern;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  enemy.update();
  player.update();
}

let keyIsPressedDown = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  Slash: false,
  Dot: false
}

window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'ArrowRight':
      player.movementSpeed = 9;
      player.moveDirection = 'right';
      keyIsPressedDown.ArrowRight = true;
      player.OrientationIsFlipped = false;
      break;
    case 'ArrowLeft':
      keyIsPressedDown.ArrowLeft = true;
      player.movementSpeed = 9;
      player.moveDirection = 'left';
      player.OrientationIsFlipped = true;
      break;
    case 'ArrowUp':
      if (player.canJump) {
        player.jump();
        keyIsPressedDown.ArrowUp = true;
      }
      break;
    case 'ArrowDown':
      break;
    case '/':
      keyIsPressedDown.Slash = true;
      player.lightAttack(enemy);
      break;
    case '.':
      keyIsPressedDown.Dot = true;
      player.heavyAttack(enemy);
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'ArrowRight':
      keyIsPressedDown.ArrowRight = false;
      if (!keyIsPressedDown.ArrowLeft) {
        player.movementSpeed = 0;
        player.moveDirection = 'none';
      } else {
        player.moveDirection = 'left';
        player.OrientationIsFlipped = true;
      }
      break;
    case 'ArrowLeft':
      keyIsPressedDown.ArrowLeft = false;
      if (!keyIsPressedDown.ArrowRight) {
        player.movementSpeed = 0;
        player.moveDirection = 'none';
      } else {
        player.moveDirection = 'right';
        player.OrientationIsFlipped = false;
      }
      break;
    case 'ArrowUp':
      keyIsPressedDown.ArrowUp = false;
      break;
    case 'ArrowDown':
      break;
    case '/':
      keyIsPressedDown.Slash = false;
      break;
    case '.':
      keyIsPressedDown.Dot = false;
      break;
  }
})

animate();

})();