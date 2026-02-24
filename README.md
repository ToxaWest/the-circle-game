# The Circle Game

A simple, reflex-based game built with React, featuring a responsive design, PWA capabilities, and a local high score system.

## How to Play

Click on the canvas when the moving dot enters a quadrant. Each click fills the quadrant a little and increases the dot's speed.

**Game Mechanics:**
*   **Filling Quadrants:** Click to fill the quadrant where the dot is. Each click increases the fill level of that quadrant.
*   **Speed Increase:** The dot's speed increases with every successful click.
*   **Full Circle Bonus/Reset:** When all four quadrants have at least one level of fill, all quadrants are reset (fill level reduced by 1), and the dot's speed is significantly reduced (by 3 clicks back). This provides a temporary reprieve from high speeds.
*   **Game Over:** The game ends if any single quadrant becomes completely full (reaches `MAX_FILL_LEVEL`).
*   **High Score:** Your best score is saved locally in your browser. If you achieve a new high score, you'll be prompted to enter your name.
*   **Speed Halving:** For every 100 points you score, the dot's speed is automatically halved, providing periodic difficulty adjustments.

## Features

*   **Responsive Design:** Adapts to various screen sizes, including mobile devices.
*   **Progressive Web App (PWA):** Installable on your device for an app-like experience and offline access.
*   **Local High Score System:** Compete against yourself and track your best performance.
*   **Dynamic Speed Adjustment:** Speed increases with score, but is reset on full circles and halved on 100-point milestones.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm install`

Installs all necessary dependencies, including Workbox for PWA features.

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. Your app is ready to be deployed!

## PWA (Progressive Web App)

This application is configured as a PWA. To use the full PWA features:

1.  Run `npm run build`.
2.  Deploy the `build` folder to a static server.
3.  Access the app via HTTPS. Most browsers will then offer to "Install app" or "Add to Home screen".

For full icon support across all platforms, you may need to generate various PNG sizes of the `favicon.svg` and update `public/manifest.json` accordingly.
