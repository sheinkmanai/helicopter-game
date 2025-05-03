import { Actor, Color, Vector, CollisionType, Physics } from 'excalibur';

export class Helicopter extends Actor {
    private readonly PADDLE_FORCE = 300;
    private readonly MAX_SPEED = 400;
    private readonly HORIZONTAL_SPEED = 200;
    private readonly MAX_HEALTH = 100;
    private readonly TOP_DAMAGE = 5;
    private readonly FOOD_SCORE = 5;
    private isGrounded: boolean = false;
    private health: number;
    private score: number;

    constructor(x: number, y: number) {
        super({
            x,
            y,
            width: 40,
            height: 40,
            color: Color.Red,
            collisionType: CollisionType.Active
        });

        // Enable physics
        this.body.useGravity = true;
        this.health = this.MAX_HEALTH;
        this.score = 0;
    }

    paddle() {
        // Apply upward force when paddling
        this.vel.y = Math.max(this.vel.y - this.PADDLE_FORCE, -this.MAX_SPEED);
    }

    moveLeft() {
        if (!this.isGrounded) {
            this.vel.x = -this.HORIZONTAL_SPEED;
        }
    }

    moveRight() {
        if (!this.isGrounded) {
            this.vel.x = this.HORIZONTAL_SPEED;
        }
    }

    stopHorizontalMovement() {
        this.vel.x = 0;
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount);
        // Change color based on health percentage
        const healthPercentage = this.health / this.MAX_HEALTH;
        this.color = new Color(255, healthPercentage * 255, healthPercentage * 255);
        
        if (this.health <= 0) {
            this.kill();
        }
    }

    addScore() {
        this.score += this.FOOD_SCORE;
    }

    getHealth(): number {
        return this.health;
    }

    getScore(): number {
        return this.score;
    }

    onPreUpdate() {
        // Limit maximum vertical speed
        if (Math.abs(this.vel.y) > this.MAX_SPEED) {
            this.vel.y = Math.sign(this.vel.y) * this.MAX_SPEED;
        }

        // Keep helicopter within screen bounds
        if (this.pos.x < 20) {
            this.pos.x = 20;
            this.vel.x = 0;
        } else if (this.pos.x > 780) {
            this.pos.x = 780;
            this.vel.x = 0;
        }

        // Check for top screen collision and apply damage
        if (this.pos.y < 20) {
            this.pos.y = 20;
            this.vel.y = 0;
            this.takeDamage(this.TOP_DAMAGE);
        }

        // Reset grounded state at the start of each update
        this.isGrounded = false;
    }

    onCollisionStart(other: Actor) {
        // Check if we're colliding with a platform from above
        if (other.body.collisionType === CollisionType.Fixed) {
            const bottomOfHelicopter = this.pos.y + this.height / 2;
            const topOfPlatform = other.pos.y - other.height / 2;
            
            // If we're above the platform and moving downward
            if (bottomOfHelicopter <= topOfPlatform + 5 && this.vel.y >= 0) {
                this.isGrounded = true;
                this.vel.y = 0; // Stop vertical movement
                this.pos.y = topOfPlatform - this.height / 2; // Adjust position
            }
        }
    }
} 