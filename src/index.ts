import { Engine, Color, DisplayMode } from 'excalibur';
import { GameScene } from './scenes/GameScene';
import { StartScene } from './scenes/StartScene';
import { GameOverScene } from './scenes/GameOverScene';

// Create game instance
const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.Black,
  displayMode: DisplayMode.Fixed,
  canvasElementId: 'game',
  antialiasing: false
});

// Add the scenes
const startScene = new StartScene();
const gameScene = new GameScene();

game.add('start', startScene);
game.add('game', gameScene);

// Start with the start scene
game.start().then(() => {
  game.goToScene('start');
  console.log('Game started successfully');
}).catch(error => {
  console.error('Error starting game:', error);
}); 