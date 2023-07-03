let lastAttacker = 'none';

export default class Actor {
  constructor(
    {
      canvas,
      canvasContext,
      floorHeight,
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
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.gravity = 1;
    this.floorHeight = floorHeight;
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
    this.canvasContext.fillStyle = this.spriteTexture;
    this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
      // Attack Box
    if (lastAttacker === this.characterType && this.drawAttackBox && !this.lightAttackOnCooldown) {
      this.canvasContext.fillStyle = 'yellow';
      this.canvasContext.fillRect(this.lightAttackBox.position.x, this.lightAttackBox.position.y, this.lightAttackBox.width, this.lightAttackBox.height);
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
    if (this.velocityY + this.height + this.position.y + this.floorHeight >= this.canvas.height) {
      this.velocityY = 0;
    } else {
      this.velocityY += this.gravity;
    }

      // Jumping
    if (this.velocityY + this.height + this.position.y + this.floorHeight >= this.canvas.height) {
      this.canJump = true;
    }

      // Lateral Movement
    if (this.moveDirection === 'right') {
      if (this.width + this.position.x + 1 < this.canvas.width) {
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