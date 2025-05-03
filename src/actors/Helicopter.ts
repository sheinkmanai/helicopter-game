import { Actor, Color, Vector, CollisionType, Physics } from 'excalibur';

export class Helicopter extends Actor {
    private readonly PADDLE_FORCE = 100;
    private readonly MAX_SPEED = 300;
    private readonly HORIZONTAL_SPEED = 180;
    private readonly HORIZONTAL_ACCELERATION = 100;
    private readonly HORIZONTAL_DECELERATION = 50;
    private readonly MAX_HEALTH = 100;
    private readonly TOP_DAMAGE = 5;
    private readonly FOOD_SCORE = 5;
    private readonly HOME_RADIUS = 30;
    private readonly ACCELERATION = 60;
    private readonly DECELERATION = 30;
    private readonly GRAVITY = 20;
    private readonly AIR_RESISTANCE = 0.985;
    private isGrounded: boolean = false;
    private health: number;
    private score: number;
    private startPosition: Vector;
    private targetVerticalSpeed: number = 0;

    constructor(x: number, y: number) {
        super({
            x,
            y,
            width: 40,
            height: 20,
            color: Color.Red,
            collisionType: CollisionType.Active
        });

        // Add a small marker at the top
        const topMarker = new Actor({
            x: 0,
            y: -this.height / 2,
            width: 4,
            height: 4,
            color: Color.Blue
        });
        this.addChild(topMarker);

        // Set up physics
        this.body.useGravity = true;
        this.body.friction = 0.1;
        this.body.rotation = 0; // Set initial rotation to 0
        this.health = this.MAX_HEALTH;
        this.score = 0;
        this.startPosition = new Vector(x, y);
    }

    isAtHome(): boolean {
        const distance = this.pos.distance(this.startPosition);
        return distance <= this.HOME_RADIUS;
    }

    getStartPosition(): Vector {
        return this.startPosition;
    }

    paddle() {
        this.targetVerticalSpeed = -this.MAX_SPEED;
        this.vel.y = Math.max(this.vel.y - this.ACCELERATION, -this.MAX_SPEED);
    }

    moveLeft() {
        if (!this.isGrounded) {
            this.vel.x = Math.max(this.vel.x - this.HORIZONTAL_ACCELERATION, -this.HORIZONTAL_SPEED);
        }
    }

    moveRight() {
        if (!this.isGrounded) {
            this.vel.x = Math.min(this.vel.x + this.HORIZONTAL_ACCELERATION, this.HORIZONTAL_SPEED);
        }
    }

    stopHorizontalMovement() {
        if (this.vel.x > 0) {
            this.vel.x = Math.max(0, this.vel.x - this.HORIZONTAL_DECELERATION);
        } else if (this.vel.x < 0) {
            this.vel.x = Math.min(0, this.vel.x + this.HORIZONTAL_DECELERATION);
        }
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
        if (!this.isGrounded) {
            this.vel.y = Math.min(this.vel.y + this.GRAVITY, this.MAX_SPEED);
        }

        this.vel.x *= this.AIR_RESISTANCE;
        if (!this.isGrounded) {
            this.vel.y *= this.AIR_RESISTANCE;
        }

        if (Math.abs(this.vel.y) > this.MAX_SPEED) {
            this.vel.y = Math.sign(this.vel.y) * this.MAX_SPEED;
        }

        if (this.pos.x < 20) {
            this.pos.x = 20;
            this.vel.x = Math.min(0, this.vel.x + this.HORIZONTAL_DECELERATION);
        } else if (this.pos.x > 780) {
            this.pos.x = 780;
            this.vel.x = Math.max(0, this.vel.x - this.HORIZONTAL_DECELERATION);
        }

        if (this.pos.y < 20) {
            this.pos.y = 20;
            this.vel.y = 0;
            this.takeDamage(this.TOP_DAMAGE);
        }

        this.isGrounded = false;

        this.rotation = 0;
        this.angularVelocity = 0;
    }

    onCollisionStart(other: Actor) {
        // Check if we're colliding with a platform from above
        if (other.body.collisionType === CollisionType.Fixed) {
            const topOfHelicopter = this.pos.y - this.height / 2;
            const bottomOfPlatform = other.pos.y + other.height / 2;

            // If we're below the platform and moving upward
            if (topOfHelicopter >= bottomOfPlatform - 5 && this.vel.y < 0) {
                this.takeDamage(this.TOP_DAMAGE);
                this.vel.y = 0; // Stop upward movement
                this.pos.y = bottomOfPlatform + this.height / 2; // Adjust position
            }
            // If we're above the platform and moving downward
            else if (this.pos.y + this.height / 2 <= other.pos.y - other.height / 2 + 5 && this.vel.y >= 0) {
                this.isGrounded = true;
                this.vel.y = 0; // Stop vertical movement
                this.pos.y = other.pos.y - other.height / 2 - this.height / 2; // Adjust position
            }
        }
    }
} 