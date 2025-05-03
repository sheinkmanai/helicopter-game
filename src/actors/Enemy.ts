import { Actor, Color, CollisionType, Vector, Physics, Engine } from 'excalibur';

type EnemyType = 'flying' | 'walking';

export class Enemy extends Actor {
    private readonly SPEED = 100;
    private readonly CHASE_DISTANCE = 300;
    private type: EnemyType;
    private direction: number = 1;
    private playerPos: Vector = new Vector(0, 0);

    constructor(x: number, y: number, type: EnemyType) {
        super({
            x,
            y,
            width: 30,
            height: 30,
            color: type === 'flying' ? Color.Magenta : Color.Orange,
            collisionType: CollisionType.Active
        });

        this.type = type;
        
        if (type === 'walking') {
            this.body.useGravity = true;
        }
    }

    setPlayerPosition(pos: Vector) {
        this.playerPos = pos;
    }

    onPreUpdate(engine: Engine, delta: number) {
        if (this.type === 'flying') {
            // Flying enemies move back and forth
            this.pos.x += this.SPEED * this.direction * delta;
            
            // Change direction when reaching screen bounds
            if (this.pos.x < 0 || this.pos.x > 800) {
                this.direction *= -1;
            }
        } else {
            // Walking enemies chase the player if within range
            const distanceToPlayer = this.pos.distance(this.playerPos);
            if (distanceToPlayer < this.CHASE_DISTANCE) {
                const direction = this.playerPos.sub(this.pos).normalize();
                this.vel.x = direction.x * this.SPEED;
            } else {
                this.vel.x = 0;
            }
        }
    }
} 