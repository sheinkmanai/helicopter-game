import { Engine, Color } from 'excalibur';
import { GameScene } from './scenes/GameScene';

// Create game instance
const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.Black,
});

// Add the game scene
const gameScene = new GameScene();
game.add('game', gameScene);

// Start the game
game.start(); 