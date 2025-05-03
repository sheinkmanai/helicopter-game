import { Actor, Color, CollisionType } from 'excalibur';

export class Platform extends Actor {
    constructor(x: number, y: number, width: number, height: number) {
        super({
            x,
            y,
            width,
            height,
            color: Color.Green,
            collisionType: CollisionType.Fixed
        });
    }
} 