import React, { useState, useEffect, useRef } from "react";

interface GameObject {
  id: number;
  x: number;
  y: number;
  type?: "parachute" | "star" | "cloud" | "bird";
}

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [fuel, setFuel] = useState(10);
  const [stars, setStars] = useState(0);
  const [parachutes, setParachutes] = useState<GameObject[]>([]);
  const [clouds, setClouds] = useState<GameObject[]>([]);
  const [birds, setBirds] = useState<GameObject[]>([]);
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
    setFuel(100);
    setStars(0);
    setParachutes([]);
    setClouds([]);
    setBirds([]);
    setAircraftPosition({ top: 500, left: 512 });
    setIsGameOver(false);
  };

  // Aircraft movement logic
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

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted, isGameOver, aircraftPosition]);

  // Generate and move game objects
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      // Generate parachutes and stars
      const parachuteInterval = setInterval(() => {
        setParachutes((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 974,
            y: 0,
            type: Math.random() > 0.5 ? "parachute" : "star",
          },
        ]);
      }, 2000);

      // Generate clouds
      const cloudInterval = setInterval(() => {
        setClouds((prev) => [
          ...prev,
          { id: Date.now(), x: 1024, y: Math.random() * 700, type: "cloud" },
        ]);
      }, 3000);

      // Generate birds
      const birdInterval = setInterval(() => {
        setBirds((prev) => [
          ...prev,
          { id: Date.now(), x: 1024, y: Math.random() * 700, type: "bird" },
        ]);
      }, 2500);

      // Move objects
      const moveObjects = setInterval(() => {
        setParachutes((prev) =>
          prev.map((p) => ({ ...p, y: p.y + 5 })).filter((p) => p.y < 768)
        );
        setClouds((prev) =>
          prev.map((c) => ({ ...c, x: c.x - 2 })).filter((c) => c.x > -100)
        );
        setBirds((prev) =>
          prev.map((b) => ({ ...b, x: b.x - 5 })).filter((b) => b.x > -50)
        );
      }, 50);

      return () => {
        clearInterval(parachuteInterval);
        clearInterval(cloudInterval);
        clearInterval(birdInterval);
        clearInterval(moveObjects);
      };
    }
  }, [isGameStarted, isGameOver]);

  // Timer and fuel decrement
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
        <button onClick={startGame}>Start Game</button>
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
            }}
          />
          {parachutes.map((item) => (
            <div
              key={item.id}
              className={item.type}
              style={{
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
              }}
            />
          ))}
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className="cloud"
              style={{
                position: "absolute",
                top: `${cloud.y}px`,
                left: `${cloud.x}px`,
              }}
            />
          ))}
          {birds.map((bird) => (
            <div
              key={bird.id}
              className="bird"
              style={{
                position: "absolute",
                top: `${bird.y}px`,
                left: `${bird.x}px`,
              }}
            />
          ))}
        </>
      )}
      {isGameOver && <div>Game Over! Score: {stars}</div>}
    </div>
  );
};

export default App;
