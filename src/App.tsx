import React, { useState, useEffect, useRef } from "react";
import { getRandomNumber } from "./helpers/getRandomNumber";

type GameObjectType = "parachute" | "star" | "cloud" | "bird";

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: GameObjectType;
  width: number;
  height: number;
}

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [stars, setStars] = useState(0);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [aircraftPosition, setAircraftPosition] = useState({
    top: 500,
    left: 512,
  });
  const [isGameOver, setIsGameOver] = useState(false);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const aircraftRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsGameStarted(true);
    setTimer(0);
    setFuel(10);
    setStars(0);
    setGameObjects([]);
    setAircraftPosition({ top: 500, left: 512 });
    setIsGameOver(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!aircraftRef.current || !gameContainerRef.current) return;

    const step = 20;
    const container = gameContainerRef.current.getBoundingClientRect();
    const { top, left } = aircraftPosition;

    if (e.key === "ArrowUp" && top > 0) {
      setAircraftPosition((prev) => ({ ...prev, top: prev.top - step }));
    } else if (e.key === "ArrowDown" && top + 50 < container.height) {
      setAircraftPosition((prev) => ({ ...prev, top: prev.top + step }));
    } else if (e.key === "ArrowLeft" && left > 0) {
      setAircraftPosition((prev) => ({ ...prev, left: prev.left - step }));
    } else if (e.key === "ArrowRight" && left + 50 < container.width) {
      setAircraftPosition((prev) => ({ ...prev, left: prev.left + step }));
    }
  };

  const handleRetry = () => {
    startGame();
  };

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted, isGameOver]);

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      const spawnInterval = setInterval(() => {
        const containerHeight = gameContainerRef.current?.clientHeight || 768;
        const containerWidth = gameContainerRef.current?.clientWidth || 1024;
        const spawnTypes: GameObjectType[] = [
          "parachute",
          "star",
          "cloud",
          "bird",
        ];
        const spawnType =
          spawnTypes[Math.floor(Math.random() * spawnTypes.length)];
        console.log("spawnType", spawnType);

        const verticalPositions = {
          // Generate random y position for clouds and birds across the entire screen
          cloud: getRandomNumber(0, containerHeight - 60), // Cloud's height is 60
          bird: getRandomNumber(0, containerHeight - 40), // Bird's height is 40
        };

        const newObject: GameObject = {
          id: Date.now(),
          x: containerWidth + 50, // Ensure the object starts from off-screen (right side)
          y:
            spawnType === "cloud" || spawnType === "bird"
              ? verticalPositions[spawnType] // Random vertical position across the entire screen
              : spawnType === "parachute"
              ? -50 // Start above the screen for parachutes
              : Math.random() * (containerHeight / 2), // Random fall for stars
          type: spawnType,
          width: spawnType === "cloud" ? 100 : 30,
          height: spawnType === "cloud" ? 60 : 30,
        };

        setGameObjects((prev) => [...prev, newObject]);
      }, 1000);

      const moveInterval = setInterval(() => {
        setGameObjects(
          (prev) =>
            prev
              .map((obj) => ({
                ...obj,
                x: obj.x - 5, // Move left
                y: ["parachute", "star"].includes(obj.type) ? obj.y + 5 : obj.y, // Add gravity effect to some objects
              }))
              .filter((obj) => obj.x > -50 && obj.y < 768) // Remove off-screen objects
        );
      }, 50);

      return () => {
        clearInterval(spawnInterval);
        clearInterval(moveInterval);
      };
    }
  }, [isGameStarted, isGameOver]);

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      const collisionInterval = setInterval(() => {
        if (!aircraftRef.current) return;

        const aircraft = aircraftRef.current.getBoundingClientRect();

        setGameObjects((prev) =>
          prev.filter((obj) => {
            const objElement = document.getElementById(`${obj.type}-${obj.id}`);
            const objRect = objElement?.getBoundingClientRect();

            if (objRect) {
              // Check for collision using bounding boxes
              const colliding =
                aircraft.left < objRect.left + objRect.width &&
                aircraft.left + aircraft.width > objRect.left &&
                aircraft.top < objRect.top + objRect.height &&
                aircraft.top + aircraft.height > objRect.top;

              if (colliding) {
                switch (obj.type) {
                  case "bird":
                    setIsGameOver(true);
                    return false;
                  case "star":
                    setStars((prevStars) => prevStars + 1);
                    return false;
                  case "parachute":
                    setFuel((prevFuel) => Math.min(100, prevFuel + 10));
                    return false;
                  default:
                    return true;
                }
              }
            }
            return true;
          })
        );
      }, 10);

      return () => clearInterval(collisionInterval);
    }
  }, [isGameStarted, isGameOver, gameObjects]);

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setFuel((prev) => Math.max(0, prev - 1));
        if (fuel <= 1) setIsGameOver(true);
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [isGameStarted, isGameOver, fuel]);

  return (
    <div id="game-container" ref={gameContainerRef}>
      {!isGameStarted && !isGameOver && (
        <button onClick={startGame} className="start-game">
          Start Game
        </button>
      )}

      {isGameStarted && !isGameOver && (
        <>
          <div id="hud">
            <p>Time: {timer}s</p>
            <p>Fuel: {fuel}</p>
            <p>Stars: {stars}</p>
          </div>
          <div
            id="aircraft"
            ref={aircraftRef}
            style={{
              position: "absolute",
              top: `${aircraftPosition.top}px`,
              left: `${aircraftPosition.left}px`,
              width: "50px",
              height: "50px",
            }}
          />
          {gameObjects.map((obj) => (
            <div
              key={obj.id}
              id={`${obj.type}-${obj.id}`}
              className={obj.type}
              style={{
                position: "absolute",
                top: `${obj.y}px`,
                left: `${obj.x}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                // borderRadius: obj.type === "star" ? "50%" : "0",
              }}
            />
          ))}
        </>
      )}

      {isGameOver && (
        <div id="game-over">
          <p>Game Over! Final Score: {stars}</p>
          <button onClick={handleRetry} id="retry-button">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
