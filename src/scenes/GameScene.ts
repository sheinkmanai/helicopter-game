import { Scene, Actor, Color, Vector, Input, Engine, Physics, CollisionType, Label, Font, FontUnit } from 'excalibur';
import { Helicopter } from '../actors/Helicopter';
import { Platform } from '../actors/Platform';
import { StartPlatform } from '../actors/StartPlatform';
import { Food } from '../actors/Food';
import { Enemy } from '../actors/Enemy';
import { GameOverScene } from './GameOverScene';
import { StageCompleteScene } from './StageCompleteScene';

export class GameScene extends Scene {
    private helicopter!: Helicopter;
    private platforms: Platform[] = [];
    private startPlatform!: StartPlatform;
    private foods: Food[] = [];
    private enemies: Enemy[] = [];
    private scoreLabel!: Label;
    private healthLabel!: Label;
    private isGameOver: boolean = false;
    private isStageComplete: boolean = false;

    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        // Enable physics
        Physics.useRealisticPhysics();
        Physics.gravity = new Vector(0, 800);

        // Create score label (top left)
        this.scoreLabel = new Label({
            text: 'Score: 0',
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        this.scoreLabel.pos.x = 20;
        this.scoreLabel.pos.y = 30;
        this.add(this.scoreLabel);

        // Create health label (top right)
        this.healthLabel = new Label({
            text: 'HP: 100',
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        this.healthLabel.pos.x = engine.drawWidth - 120;
        this.healthLabel.pos.y = 30;
        this.add(this.healthLabel);

        // Create platforms
        this.createPlatforms();

        // Create helicopter at the start platform marker
        const startPos = this.startPlatform.getMarkerPosition();
        this.helicopter = new Helicopter(startPos.x, startPos.y - 20); // Position slightly above the marker
        this.add(this.helicopter);

        // Create initial food items
        this.spawnFood();

        // Create enemies
        this.spawnEnemies();

        // Set up collision handlers
        this.setupCollisions();

        // Set up keyboard controls
        this.setupControls(engine);

        // Listen for helicopter death
        this.helicopter.on('kill', () => {
            if (!this.isGameOver) {
                this.isGameOver = true;
                const gameOverScene = new GameOverScene(this.helicopter.getScore());
                engine.add('gameOver', gameOverScene);
                engine.goToScene('gameOver');
            }
        });
    }

    private updateScore(points: number) {
        this.scoreLabel.text = `Score: ${this.helicopter.getScore()}`;
    }

    private updateHealth() {
        this.healthLabel.text = `HP: ${this.helicopter.getHealth()}`;
    }

    private setupControls(engine: Engine) {
        // Vertical movement (paddling)
        engine.input.keyboard.on('hold', (evt) => {
            if (evt.key === Input.Keys.Up || evt.key === Input.Keys.W) {
                this.helicopter.paddle();
            }
        });

        // Horizontal movement
        engine.input.keyboard.on('hold', (evt) => {
            if (evt.key === Input.Keys.Left || evt.key === Input.Keys.A) {
                this.helicopter.moveLeft();
            } else if (evt.key === Input.Keys.Right || evt.key === Input.Keys.D) {
                this.helicopter.moveRight();
            }
        });

        // Stop horizontal movement when keys are released
        engine.input.keyboard.on('release', (evt) => {
            if ((evt.key === Input.Keys.Left || evt.key === Input.Keys.A) && 
                !engine.input.keyboard.isHeld(Input.Keys.Right) && 
                !engine.input.keyboard.isHeld(Input.Keys.D)) {
                this.helicopter.stopHorizontalMovement();
            }
            if ((evt.key === Input.Keys.Right || evt.key === Input.Keys.D) && 
                !engine.input.keyboard.isHeld(Input.Keys.Left) && 
                !engine.input.keyboard.isHeld(Input.Keys.A)) {
                this.helicopter.stopHorizontalMovement();
            }
        });
    }

    private setupCollisions() {
        // Helicopter collision with food
        this.helicopter.on('collisionstart', (evt) => {
            if (evt.other instanceof Food) {
                evt.other.kill();
                this.foods = this.foods.filter(f => f !== evt.other);
                this.helicopter.addScore();
                this.updateScore(0); // Update display with new score
            }
        });

        // Helicopter collision with enemies
        this.helicopter.on('collisionstart', (evt) => {
            if (evt.other instanceof Enemy) {
                console.log('Collision with enemy!');
                this.helicopter.takeDamage(10); // Take damage from enemy
                this.updateHealth(); // Update health display
            }
        });
    }

    private createPlatforms() {
        // Create start platform
        this.startPlatform = new StartPlatform(100, 500, 200, 20);
        this.add(this.startPlatform);
        this.platforms.push(this.startPlatform);

        // Create ground platform
        const ground = new Platform(400, 550, 800, 20);
        this.add(ground);
        this.platforms.push(ground);

        // Generate random number of platforms (between 3 and 7)
        const numPlatforms = Math.floor(Math.random() * 5) + 3;
        
        // Create random platforms
        for (let i = 0; i < numPlatforms; i++) {
            // Random width between 150 and 250
            const width = Math.floor(Math.random() * 100) + 150;
            
            // Random x position, ensuring it's within screen bounds
            const x = Math.floor(Math.random() * (800 - width)) + width/2;
            
            // Random y position between 150 and 450
            const y = Math.floor(Math.random() * 300) + 150;
            
            // Check if this platform overlaps with any existing platform
            let overlaps = false;
            for (const platform of this.platforms) {
                const horizontalOverlap = Math.abs(x - platform.pos.x) < (width + platform.width) / 2;
                const verticalOverlap = Math.abs(y - platform.pos.y) < 50; // Minimum vertical spacing
                if (horizontalOverlap && verticalOverlap) {
                    overlaps = true;
                    break;
                }
            }

            // If no overlap, create the platform
            if (!overlaps) {
                const platform = new Platform(x, y, width, 20);
                this.add(platform);
                this.platforms.push(platform);
            } else {
                // If there was an overlap, try again
                i--;
            }
        }
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

    private checkStageComplete() {
        // Check if all food is collected and helicopter is at home
        if (this.foods.length === 0 && this.helicopter.isAtHome() && !this.isStageComplete) {
            console.log('Stage Complete!');
            this.isStageComplete = true;
            const stageCompleteScene = new StageCompleteScene(this.helicopter.getScore());
            this.engine.add('stageComplete', stageCompleteScene);
            this.engine.goToScene('stageComplete');
        }
    }

    onPreUpdate(engine: Engine, delta: number) {
        // Update enemy player positions
        this.enemies.forEach(enemy => {
            enemy.setPlayerPosition(this.helicopter.pos);
        });

        // Update health display
        this.updateHealth();

        // Check for stage completion
        this.checkStageComplete();
    }
} 