import { Scene, Actor, Color, Engine, Label, Font, FontUnit, Input } from 'excalibur';

export class StartScene extends Scene {
    private startButton!: Actor;
    private titleLabel!: Label;

    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        // Create title
        this.titleLabel = new Label({
            text: 'Helicopter Game',
            font: new Font({
                family: 'Arial',
                size: 48,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        this.titleLabel.pos.x = engine.halfDrawWidth;
        this.titleLabel.pos.y = engine.halfDrawHeight - 100;
        this.add(this.titleLabel);

        // Create start button
        this.startButton = new Actor({
            x: engine.halfDrawWidth,
            y: engine.halfDrawHeight + 50,
            width: 200,
            height: 50,
            color: Color.Green
        });

        // Add button text
        const buttonText = new Label({
            text: 'Start Game',
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White
            })
        });
        buttonText.pos.x = -50; // Center text on button
        buttonText.pos.y = -8;
        this.startButton.addChild(buttonText);

        // Add hover effect
        this.startButton.on('pointerenter', () => {
            this.startButton.color = new Color(144, 238, 144); // Light green
        });

        this.startButton.on('pointerleave', () => {
            this.startButton.color = Color.Green;
        });

        // Add click handler
        this.startButton.on('pointerup', () => {
            engine.goToScene('game');
        });

        this.add(this.startButton);

        // Also allow starting with spacebar
        engine.input.keyboard.on('press', (evt) => {
            if (evt.key === Input.Keys.Space) {
                engine.goToScene('game');
            }
        });
    }
} 