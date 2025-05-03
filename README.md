# Helicopter Game

A 2D game built with Excalibur.js where you control a human-powered helicopter to collect food while avoiding enemies.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:9000`

## Game Controls

- Press `W` or `Up Arrow` to paddle the helicopter upward
- Collect yellow food items
- Avoid purple (flying) and orange (walking) enemies
- Land on green platforms to rest

## Development

The game is built using:
- TypeScript
- Excalibur.js game engine
- Webpack for bundling

### Project Structure

- `src/` - Source code
  - `index.ts` - Main entry point
  - `scenes/` - Game scenes
  - `actors/` - Game objects (helicopter, enemies, etc.)
- `dist/` - Built files (generated)

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. 