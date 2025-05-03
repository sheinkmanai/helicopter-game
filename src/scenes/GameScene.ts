import { Scene, Actor, Color, Vector, Input, Keys } from 'excalibur';
import { Helicopter } from '../actors/Helicopter';
import { Platform } from '../actors/Platform';
import { Food } from '../actors/Food';
import { Enemy } from '../actors/Enemy';

export class GameScene extends Scene {
    private helicopter: Helicopter;
    private platforms: Platform[] = [];
    private foods: Food[] = [];
    private enemies: Enemy[] = [];

    constructor() {
        super();
    }

    onInitialize() {
        // Create helicopter
        this.helicopter = new Helicopter(400, 300);
        this.add(this.helicopter);

        // Create platforms
        this.createPlatforms();

        // Create initial food items
        this.spawnFood();

        // Create enemies
        this.spawnEnemies();
    }

    private createPlatforms() {
        // Create ground platform
        const ground = new Platform(400, 550, 800, 20);
        this.add(ground);
        this.platforms.push(ground);

        // Create some elevated platforms
        const platform1 = new Platform(200, 400, 200, 20);
        const platform2 = new Platform(600, 300, 200, 20);
        const platform3 = new Platform(400, 200, 200, 20);

        this.add(platform1);
        this.add(platform2);
        this.add(platform3);

        this.platforms.push(platform1, platform2, platform3);
    }

    private spawnFood() {
        // Spawn food on random platforms
        this.platforms.forEach(platform => {
            if (Math.random() < 0.7) { // 70% chance to spawn food on each platform
                const food = new Food(
                    platform.pos.x + (Math.random() - 0.5) * (platform.width - 20),
                    platform.pos.y - 20
                );
                this.add(food);
                this.foods.push(food);
            }
        });
    }

    private spawnEnemies() {
        // Spawn some flying enemies
        for (let i = 0; i < 3; i++) {
            const enemy = new Enemy(
                Math.random() * 800,
                Math.random() * 400,
                'flying'
            );
            this.add(enemy);
            this.enemies.push(enemy);
        }

        // Spawn some walking enemies on platforms
        this.platforms.forEach(platform => {
            if (Math.random() < 0.3) { // 30% chance to spawn enemy on each platform
                const enemy = new Enemy(
                    platform.pos.x,
                    platform.pos.y - 30,
                    'walking'
                );
                this.add(enemy);
                this.enemies.push(enemy);
            }
        });
    }

    onPreUpdate(engine: Engine, delta: number) {
        // Handle helicopter controls
        if (engine.input.keyboard.isHeld(Keys.Up) || engine.input.keyboard.isHeld(Keys.W)) {
            this.helicopter.paddle();
        }

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(delta, this.helicopter.pos);
        });
    }
} 