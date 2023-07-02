( () => {
let backgroundSprite = document.getElementById('backgroundSprite');
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

let backgroundPattern = c.createPattern(backgroundSprite, 'no-repeat');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, 1024, 576);

let gravity = 1;
let floorHeight = 95;

class Sprite {
  constructor({position, velocityY, height, width, moveDirection, movementSpeed, canJump, spriteTexture, isOrientationFlipped}) {
    this.position = position;
    this.velocityY = velocityY;
    this.height = height;
    this.width = width;
    this.moveDirection = moveDirection;
    this.movementSpeed = movementSpeed;
    this.canJump = canJump;
    this.lightAttackBox = {
      position,
      width: 120,
      height: 50
    };
    this.spriteTexture = spriteTexture;
    this.isOrientationFlipped = isOrientationFlipped;
  }

  draw() {
    c.fillStyle = this.spriteTexture;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Attack Box
    c.fillStyle = 'yellow';
    c.fillRect(this.lightAttackBox.position.x, this.lightAttackBox.position.y, this.lightAttackBox.width, this.lightAttackBox.height);
  }

  update() {
    if (this.isOrientationFlipped) {
      this.lightAttackBox.position = {
        x: this.position.x - 70,
        y: this.position.y + 100
      }
    } else {
      this.lightAttackBox.position = {
        x: this.position.x,
        y: this.position.y + 100
      }
    }

    this.draw();
    this.position.y += this.velocityY;

    // Gravity
    if (this.velocityY + this.height + this.position.y + floorHeight >= canvas.height) {
      this.velocityY = 0;
    } else {
      this.velocityY += gravity;
    }

    if (this.velocityY + this.height + this.position.y + floorHeight >= canvas.height) {
      this.canJump = true;
    }

    // Lateral Movement
    if (this.moveDirection === 'right') {
      if (this.width + this.position.x < canvas.width) {
        this.position.x += this.movementSpeed;
      }
    } else if (this.moveDirection === 'left') {
      if (this.position.x > 0) {
        this.position.x -= this.movementSpeed;
      }
    }
  }

  jump() {
    this.canJump = false;
    this.velocityY = -19;
  }
}

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = backgroundPattern;
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

const player = new Sprite({
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
  isOrientationFlipped: false
});

const enemy = new Sprite({
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
  isOrientationFlipped: true
});

animate();

let keyIsPressedDown = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false
}

window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'ArrowRight':
      player.movementSpeed = 9;
      player.moveDirection = 'right';
      keyIsPressedDown.ArrowRight = true;
      player.isOrientationFlipped = false;
      break;
    case 'ArrowLeft':
      keyIsPressedDown.ArrowLeft = true;
      player.movementSpeed = 9;
      player.moveDirection = 'left';
      player.isOrientationFlipped = true;
      break;
    case 'ArrowUp':
      if (player.canJump) {
        player.jump();
        keyIsPressedDown.ArrowUp = true;
      }
      break;
    case 'ArrowDown':
      break;
  }
})

// check if a valid key is still down before resetting movement
window.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'ArrowRight':
      keyIsPressedDown.ArrowRight = false;
      if (!keyIsPressedDown.ArrowLeft) {
        player.movementSpeed = 0;
        player.moveDirection = 'none';
      } else {
        player.moveDirection = 'left';
        player.isOrientationFlipped = true;
      }
      break;
    case 'ArrowLeft':
      keyIsPressedDown.ArrowLeft = false;
      if (!keyIsPressedDown.ArrowRight) {
        player.movementSpeed = 0;
        player.moveDirection = 'none';
      } else {
        player.moveDirection = 'right';
        player.isOrientationFlipped = false;
      }
      break;
    case 'ArrowUp':
      keyIsPressedDown.ArrowUp = false;
      break;
    case 'ArrowDown':
      break;
  }
})

})();