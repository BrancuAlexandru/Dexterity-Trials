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
let lastAttacker = 'none';

class Sprite {
  constructor(
    {
      position,
      velocityY,
      height,
      width,
      moveDirection,
      movementSpeed,
      canJump,
      spriteTexture,
      OrientationIsFlipped,
      drawAttackBox,
      lightAttackVerticalOffset,
      lightAttackOnCooldown,
      characterType
    }
  ) {
    this.position = position;
    this.velocityY = velocityY;
    this.height = height;
    this.width = width;
    this.moveDirection = moveDirection;
    this.movementSpeed = movementSpeed;
    this.canJump = canJump;
    this.lightAttackVerticalOffset = lightAttackVerticalOffset;
    this.lightAttackBox = {
      position: {
        x: this.position.x,
        y: this.position.y + this.lightAttackVerticalOffset
      },
      width: 120,
      height: 50
    };
    this.lightAttackOnCooldown = lightAttackOnCooldown;
    this.spriteTexture = spriteTexture;
    this.OrientationIsFlipped = OrientationIsFlipped;
    this.drawAttackBox = drawAttackBox;
    this.characterType = characterType;
  }

  draw() {
    c.fillStyle = this.spriteTexture;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
      // Attack Box
    if (lastAttacker === this.characterType && this.drawAttackBox && !this.lightAttackOnCooldown) {
      c.fillStyle = 'yellow';
      c.fillRect(this.lightAttackBox.position.x, this.lightAttackBox.position.y, this.lightAttackBox.width, this.lightAttackBox.height);
      this.lightAttackOnCooldown = true;
      const undrawAttackBox = () => {
        this.drawAttackBox = false;
        this.lightAttackOnCooldown = false;
      }
      setTimeout(undrawAttackBox, 250);
    }
  }

  update() {

    this.position.y += this.velocityY;

      // Gravity
    if (this.velocityY + this.height + this.position.y + floorHeight >= canvas.height) {
      this.velocityY = 0;
    } else {
      this.velocityY += gravity;
    }

      // Jumping
    if (this.velocityY + this.height + this.position.y + floorHeight >= canvas.height) {
      this.canJump = true;
    }

      // Lateral Movement
    if (this.moveDirection === 'right') {
      if (this.width + this.position.x + 1 < canvas.width) {
        this.position.x += this.movementSpeed;
      }
    } else if (this.moveDirection === 'left') {
      if (this.position.x > 1) {
        this.position.x -= this.movementSpeed;
      }
    }

      // Attack Box Drawing
    if (this.OrientationIsFlipped) {
      this.lightAttackBox.position.x = this.position.x - 70;
    } else {
      this.lightAttackBox.position.x = this.position.x;
    }

    this.lightAttackBox.position.y = this.position.y + this.lightAttackVerticalOffset;

    this.draw();
  }

  jump() {
    this.canJump = false;
    this.velocityY = -19;
  }

  lightAttack(enemy) {
    if (!this.lightAttackOnCooldown) {
        // Attack Collision Detection
      if (
        this.position.y + this.lightAttackVerticalOffset + this.lightAttackBox.height >= enemy.position.y
          && this.position.y + this.lightAttackVerticalOffset + this.lightAttackBox.height <= enemy.position.y + enemy.height
      ) {
        if (
          !this.OrientationIsFlipped
            && this.lightAttackBox.position.x + this.lightAttackBox.width >= enemy.position.x
            && this.lightAttackBox.position.x <= enemy.position.x
      
          || this.OrientationIsFlipped
            && this.lightAttackBox.position.x <= enemy.position.x + enemy.width
            && this.lightAttackBox.position.x + this.lightAttackBox.width >= enemy.position.x + enemy.width
          ) {
          console.log('hit on ' + `${enemy.characterType}`);
          lastAttacker = this.characterType;
          this.drawAttackBox = true;
        }
      }
    }
  }
}

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = backgroundPattern;
  c.fillRect(0, 0, canvas.width, canvas.height);
  enemy.update();
  player.update();
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
  OrientationIsFlipped: false,
  drawAttackBox: true,
  characterType: 'player',
  lightAttackVerticalOffset: 50,
  lightAttackOnCooldown: false
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
  OrientationIsFlipped: true,
  drawAttackBox: true,
  characterType: 'AI',
  lightAttackVerticalOffset: 50,
  lightAttackOnCooldown: false
});

animate();

let keyIsPressedDown = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  Slash: false
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
  }
})

})();