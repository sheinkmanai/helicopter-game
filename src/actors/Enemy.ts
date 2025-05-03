import { Actor, Color, CollisionType, Vector, Physics, Engine } from 'excalibur';

export enum EnemyType {
    SLOW = 'slow',      // Blue, slowest
    MEDIUM = 'medium',  // Green, medium speed
    FAST = 'fast',      // Yellow, fast
    SPEEDY = 'speedy'   // Red, fastest
}

export class Enemy extends Actor {
    private readonly PLATFORM_MARGIN = 2;
    private platform: Actor | null = null;
    private direction: number = 1;
    private speed: number;

    constructor(x: number, y: number, platform: Actor, type: EnemyType = EnemyType.MEDIUM) {
        super({
            x,
            y,
            width: 20,
            height: 20,
            color: Color.Blue, // Default color, will be updated after super
            collisionType: CollisionType.Active
        });

        this.body.useGravity = false;
        this.body.friction = 0.1;
        // Store the platform reference
        this.platform = platform;
        // Set speed based on type
        this.speed = this.getSpeedForType(type);
        // Set random initial direction (1 for right, -1 for left)
        this.direction = Math.random() < 0.5 ? 1 : -1;
        // Start moving immediately in the random direction
        this.vel.x = this.speed * this.direction;
        // Position the enemy on the platform
        this.pos.y = platform.pos.y - platform.height/2 - this.height/2;
        // Set the correct color based on type
        this.color = this.getColorForType(type);
    }

    private getSpeedForType(type: EnemyType): number {
        switch (type) {
            case EnemyType.SLOW:
                return 50;  // Slowest
            case EnemyType.MEDIUM:
                return 100; // Medium speed
            case EnemyType.FAST:
                return 150; // Fast
            case EnemyType.SPEEDY:
                return 200; // Fastest
        }
    }

    private getColorForType(type: EnemyType): Color {
        switch (type) {
            case EnemyType.SLOW:
                return Color.Blue;
            case EnemyType.MEDIUM:
                return Color.Green;
            case EnemyType.FAST:
                return Color.Yellow;
            case EnemyType.SPEEDY:
                return Color.Red;
        }
    }

    private checkPlatformEdges() {
        if (!this.platform) return;

        const platformLeft = this.platform.pos.x - this.platform.width/2;
        const platformRight = this.platform.pos.x + this.platform.width/2;
        const enemyLeft = this.pos.x - this.width/2;
        const enemyRight = this.pos.x + this.width/2;

        // Check if enemy is at platform edges
        if (enemyLeft <= platformLeft + this.PLATFORM_MARGIN) {
            this.direction = 1;
            this.pos.x = platformLeft + this.PLATFORM_MARGIN + this.width/2;
        } else if (enemyRight >= platformRight - this.PLATFORM_MARGIN) {
            this.direction = -1;
            this.pos.x = platformRight - this.PLATFORM_MARGIN - this.width/2;
        }
    }

    setPlayerPosition(playerPos: Vector) {
        if (this.platform) {
            // Keep vertical position fixed on platform
            this.pos.y = this.platform.pos.y - this.platform.height/2 - this.height/2;
            this.vel.y = 0;
            
            // Check platform edges
            this.checkPlatformEdges();
        }
        
        // Move in current direction
        this.vel.x = this.speed * this.direction;
    }

    onPreUpdate(engine: Engine, delta: number) {
        // Always maintain movement
        this.vel.x = this.speed * this.direction;
        
        if (this.platform) {
            // Keep walking enemies on their platform
            this.pos.y = this.platform.pos.y - this.platform.height/2 - this.height/2;
            this.vel.y = 0;
            
            // Check platform edges
            this.checkPlatformEdges();
        }
    }
} 