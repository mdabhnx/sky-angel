# Sky Angel

A simple browser-based game where you control an aircraft, avoiding falling objects like birds, clouds, and parachutes, while collecting stars and parachutes to earn points and fuel.

## Features

- **Controls:**

  - Arrow keys to move the aircraft.
  - Pause the game with a button.
  - Resume the game after pausing.

- **Objects:**

  - **Birds:** Colliding with a bird results in a game over.
  - **Stars:** Collect stars to score points.
  - **Parachutes:** Collect parachutes to restore fuel.
  - **Clouds:** Move across the screen without interaction.

- **Game Stats:**
  - Time elapsed.
  - Remaining fuel.
  - Collected stars.

## Technologies Used

- **React:** Frontend library for building the UI.
- **TypeScript:** Type-safe JavaScript for better tooling and code quality.
- **CSS:** Styling for the game and UI elements.

## How to Run the Game Locally

1. **Clone the repository:**

```bash
https://github.com/mdabhnx/sky-angel.git
cd sky-angel
```

2. **Install dependencies:**

Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The game will be accessible in your browser at `http://localhost:5173/`.

## How to Play

1. **Start the Game:** Click the "Start Game" button to begin the game.
2. **Move the Aircraft:** Use the arrow keys (up, down, left, right) to move the aircraft around the screen.
3. **Pause the Game:** Click the "Pause" button to stop the game. Click "Resume" to continue.
4. **Avoid Birds:** Collide with birds to end the game.
5. **Collect Stars and Parachutes:** Stars earn you points, while parachutes restore fuel. Keep an eye on your fuel level!

## Game Over Conditions

- Colliding with a bird results in game over.
- Fuel running out results in game over.

## File Structure

```
/falling-objects-game
├── public
│   └── index.html
├── src
│   ├── helpers
│   │   └── getRandomNumber.ts # Helper function for random number generation
│   └── App.tsx            # Main entry point of the app
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions are always welcome!
