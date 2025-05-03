import { Actor, Color, Vector, CollisionType } from 'excalibur';

export class Helicopter extends Actor {
    private readonly PADDLE_FORCE = 300;
    private readonly MAX_SPEED = 400;
    private readonly GRAVITY = 800;

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
        this.body.gravity = this.GRAVITY;
    }

    paddle() {
        // Apply upward force when paddling
        this.vel.y = Math.max(this.vel.y - this.PADDLE_FORCE, -this.MAX_SPEED);
    }

    onPreUpdate() {
        // Limit maximum speed
        if (Math.abs(this.vel.y) > this.MAX_SPEED) {
            this.vel.y = Math.sign(this.vel.y) * this.MAX_SPEED;
        }
    }
} 