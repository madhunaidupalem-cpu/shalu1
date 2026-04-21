import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    // Clear board
    context.fillStyle = '#0a0a0a';
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    snake.forEach((segment, index) => {
      context.fillStyle = '#00f3ff';
      context.beginPath();
      context.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        2
      );
      context.fill();

      // Add glow
      context.shadowBlur = 8;
      context.shadowColor = '#00f3ff';
    });

    // Draw food
    context.fillStyle = '#ff00ff';
    context.shadowBlur = 10;
    context.shadowColor = '#ff00ff';
    context.beginPath();
    context.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    context.fill();
    context.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative border-2 border-gray-800 rounded-[2px] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-[#0a0a0a]"
        />
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-20">
            {isGameOver ? (
              <>
                <h2 className="text-2xl font-bold neon-text-pink mb-2 tracking-tighter">GAME_OVER</h2>
                <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Final_Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 border border-neon-pink text-neon-pink text-xs font-bold uppercase hover:bg-neon-pink/10 transition-colors tracking-widest"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold neon-text-blue mb-8 tracking-tighter uppercase">Snake_OS v1.2</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 border border-neon-blue text-neon-blue text-xs font-bold uppercase hover:bg-neon-blue/10 transition-colors tracking-widest"
                >
                  INITIALIZE
                </button>
                <p className="mt-4 text-[9px] text-gray-600 uppercase tracking-widest">Awaiting local input...</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
