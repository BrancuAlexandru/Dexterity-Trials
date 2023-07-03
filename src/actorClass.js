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
      spriteTexture,
      OrientationIsFlipped,
      drawAttackBox,
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
    this.moveDirection = 'none';
    this.movementSpeed = 0;
    this.canJump = true;
    this.spriteTexture = spriteTexture;
    this.OrientationIsFlipped = OrientationIsFlipped;
    this.drawAttackBox = drawAttackBox;
    this.characterType = characterType;
    this.drawAttackBoxToggle = true;
    this.lightAttackVerticalOffset = 50;
    this.lastAttackUsed = 'none';
    this.lightAttackBox = {
      position: {
        x: this.position.x,
        y: this.position.y + this.lightAttackVerticalOffset
      },
      width: 120,
      height: 50
    };
    this.lightAttackOnCooldown = false;
    this.heavyAttackVerticalOffset = 50;
    this.heavyAttackBox = {
      position: {
        x: this.position.x,
        y: this.position.y + this.heavyAttackVerticalOffset
      },
      width: 120,
      height: 50
    };
    this.heavyAttackOnCooldown = false;
  }

  draw() {
    this.canvasContext.fillStyle = this.spriteTexture;
    this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.lastAttackUsed === 'light') {
      this.canvasContext.fillStyle = 'yellow';
    } else if (this.lastAttackUsed === 'heavy') {
      this.canvasContext.fillStyle = 'purple';
    }

      // Light Attack Box
    if (lastAttacker === this.characterType && this.drawAttackBox && this.drawAttackBoxToggle && !this.lightAttackOnCooldown) {
      this.canvasContext.fillRect(this.lightAttackBox.position.x, this.lightAttackBox.position.y, this.lightAttackBox.width, this.lightAttackBox.height);
    }
      // Heavy Attack Box
    if (lastAttacker === this.characterType && this.drawAttackBox && this.drawAttackBoxToggle && !this.heavyAttackOnCooldown) {
      this.canvasContext.fillRect(this.heavyAttackBox.position.x, this.heavyAttackBox.position.y, this.heavyAttackBox.width, this.heavyAttackBox.height);
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
      this.heavyAttackBox.position.x = this.position.x - 70;
    } else {
      this.lightAttackBox.position.x = this.position.x;
      this.heavyAttackBox.position.x = this.position.x;
    }

    this.lightAttackBox.position.y = this.position.y + this.lightAttackVerticalOffset;
    this.heavyAttackBox.position.y = this.position.y + this.heavyAttackVerticalOffset;

    this.draw();
  }

  jump() {
    this.canJump = false;
    this.velocityY = -19;
  }
  coolDownAttack(type) {
    if (type === 'light') {
      this.lightAttackOnCooldown = true;
      this.heavyAttackOnCooldown = true;
      setTimeout(() => {
        this.drawAttackBoxToggle = false;
        this.lightAttackOnCooldown = false;
      }, 250);
        // also cooling down heavy attack to avoid
        // being able to use both attacks simultaneously
      setTimeout(() => {
        this.heavyAttackOnCooldown = false;
      }, 250);
    } else if (type === 'heavy') {
      this.heavyAttackOnCooldown = true;
      this.lightAttackOnCooldown = true;
      setTimeout(() => {
        this.drawAttackBoxToggle = false;
        this.heavyAttackOnCooldown = false;
      }, 500);
        // also cooling down light attack to avoid
        // being able to use both attacks simultaneously
      setTimeout(() => {
        this.lightAttackOnCooldown = false;
      }, 250);
    }
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
          this.lastAttackUsed = 'light';
          console.log('light hit on ' + `${enemy.characterType}`);
          lastAttacker = this.characterType;
          this.drawAttackBoxToggle = true;
          this.coolDownAttack('light');
        }
      }
    }
  }

  heavyAttack(enemy) {
    if (!this.heavyAttackOnCooldown) {
        // Attack Collision Detection
      if (
        this.position.y + this.heavyAttackVerticalOffset + this.heavyAttackBox.height >= enemy.position.y
          && this.position.y + this.heavyAttackVerticalOffset + this.heavyAttackBox.height <= enemy.position.y + enemy.height
      ) {
        if (
          !this.OrientationIsFlipped
            && this.heavyAttackBox.position.x + this.heavyAttackBox.width >= enemy.position.x
            && this.heavyAttackBox.position.x <= enemy.position.x
      
          || this.OrientationIsFlipped
            && this.heavyAttackBox.position.x <= enemy.position.x + enemy.width
            && this.heavyAttackBox.position.x + this.heavyAttackBox.width >= enemy.position.x + enemy.width
          ) {
          this.lastAttackUsed = 'heavy';
          console.log('heavy hit on ' + `${enemy.characterType}`);
          lastAttacker = this.characterType;
          this.drawAttackBoxToggle = true;
          this.coolDownAttack('heavy');
        }
      }
    }
  }

}