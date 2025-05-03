import { Scene, Actor, Color, Engine, Label, Font, FontUnit, Input } from 'excalibur';
import { GameScene } from './GameScene';

export class GameOverScene extends Scene {
    private restartButton!: Actor;
    private gameOverLabel!: Label;
    private scoreLabel!: Label;

    constructor(private finalScore: number) {
        super();
    }

    onInitialize(engine: Engine) {
        // Create Game Over text
        this.gameOverLabel = new Label({
            text: 'Game Over',
            font: new Font({
                family: 'Arial',
                size: 48,
                unit: FontUnit.Px,
                color: Color.Red
            })
        });
        this.gameOverLabel.pos.x = engine.halfDrawWidth;
        this.gameOverLabel.pos.y = engine.halfDrawHeight - 100;
        this.add(this.gameOverLabel);

        // Create final score text
        this.scoreLabel = new Label({
            text: `Final Score: ${this.finalScore}`,
            font: new Font({
                family: 'Arial',
                size: 32,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        this.scoreLabel.pos.x = engine.halfDrawWidth;
        this.scoreLabel.pos.y = engine.halfDrawHeight;
        this.add(this.scoreLabel);

        // Create restart button
        this.restartButton = new Actor({
            x: engine.halfDrawWidth,
            y: engine.halfDrawHeight + 100,
            width: 200,
            height: 50,
            color: Color.Green
        });

        // Add button text
        const buttonText = new Label({
            text: 'Restart Game',
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        buttonText.pos.x = -50; // Center text on button
        buttonText.pos.y = -8;
        this.restartButton.addChild(buttonText);

        // Add hover effect
        this.restartButton.on('pointerenter', () => {
            this.restartButton.color = new Color(144, 238, 144); // Light green
        });

        this.restartButton.on('pointerleave', () => {
            this.restartButton.color = Color.Green;
        });

        // Add click handler
        this.restartButton.on('pointerup', () => {
            // Create a new game scene instance
            const newGameScene = new GameScene();
            engine.add('game', newGameScene);
            engine.goToScene('game');
        });

        this.add(this.restartButton);

        // Also allow restarting with spacebar
        engine.input.keyboard.on('press', (evt) => {
            if (evt.key === Input.Keys.Space) {
                // Create a new game scene instance
                const newGameScene = new GameScene();
                engine.add('game', newGameScene);
                engine.goToScene('game');
            }
        });
    }
} 