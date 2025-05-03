import { Actor, Color, CollisionType } from 'excalibur';

export class StartPlatform extends Actor {
    private readonly MARKER_WIDTH = 40;
    private readonly MARKER_HEIGHT = 10;
    private marker: Actor;

    constructor(x: number, y: number, width: number, height: number) {
        super({
            x,
            y,
            width,
            height,
            color: Color.Green,
            collisionType: CollisionType.Fixed
        });

        // Create the marker (different colored area)
        this.marker = new Actor({
            x: 0, // Relative to platform
            y: -height/2 + this.MARKER_HEIGHT/2, // Position at top of platform
            width: this.MARKER_WIDTH,
            height: this.MARKER_HEIGHT,
            color: Color.Yellow
        });
        this.addChild(this.marker);
    }

    getMarkerPosition(): { x: number, y: number } {
        return {
            x: this.pos.x,
            y: this.pos.y - this.height/2 + this.MARKER_HEIGHT/2
        };
    }
} 