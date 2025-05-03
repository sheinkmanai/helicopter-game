import { Scene, Actor, Color, Engine, Label, Font, FontUnit, Input } from 'excalibur';
import { GameScene } from './GameScene';

export class StageCompleteScene extends Scene {
    private nextStageButton!: Actor;
    private stageCompleteLabel!: Label;
    private scoreLabel!: Label;

    constructor(private finalScore: number) {
        super();
    }

    onInitialize(engine: Engine) {
        // Create Stage Complete text
        this.stageCompleteLabel = new Label({
            text: 'Stage Complete!',
            font: new Font({
                family: 'Arial',
                size: 48,
                unit: FontUnit.Px,
                color: Color.Green
            })
        });
        this.stageCompleteLabel.pos.x = engine.halfDrawWidth;
        this.stageCompleteLabel.pos.y = engine.halfDrawHeight - 100;
        this.add(this.stageCompleteLabel);

        // Create final score text
        this.scoreLabel = new Label({
            text: `Score: ${this.finalScore}`,
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

        // Create next stage button
        this.nextStageButton = new Actor({
            x: engine.halfDrawWidth,
            y: engine.halfDrawHeight + 100,
            width: 200,
            height: 50,
            color: Color.Green
        });

        // Add button text
        const buttonText = new Label({
            text: 'Next Stage',
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        buttonText.pos.x = -50; // Center text on button
        buttonText.pos.y = -8;
        this.nextStageButton.addChild(buttonText);

        // Add hover effect
        this.nextStageButton.on('pointerenter', () => {
            this.nextStageButton.color = new Color(144, 238, 144); // Light green
        });

        this.nextStageButton.on('pointerleave', () => {
            this.nextStageButton.color = Color.Green;
        });

        // Add click handler
        this.nextStageButton.on('pointerup', () => {
            // Create a new game scene instance
            const newGameScene = new GameScene();
            engine.add('game', newGameScene);
            engine.goToScene('game');
        });

        this.add(this.nextStageButton);

        // Also allow continuing with spacebar
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