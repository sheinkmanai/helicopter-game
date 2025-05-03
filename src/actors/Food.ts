import { Actor, Color, CollisionType } from 'excalibur';

export class Food extends Actor {
    constructor(x: number, y: number) {
        super({
            x,
            y,
            width: 20,
            height: 20,
            color: Color.Yellow,
            collisionType: CollisionType.Passive
        });
    }
} 