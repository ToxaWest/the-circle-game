import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';

const MAX_FILL_LEVEL = 7;
const SPEED_MULTIPLIER = 1.03;
const INITIAL_SPEED = 0.05;

function App() {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);

  // Game State
  const [quadrantFills, setQuadrantFills] = useState([0, 0, 0, 0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState(400);

  // High Score State
  const [highScore, setHighScore] = useState({ score: 0, name: 'N/A' });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // --- High Score and Game Initialization ---
  useEffect(() => {
    const savedHighScore = localStorage.getItem('circleGameHighScore');
    if (savedHighScore) {
      setHighScore(JSON.parse(savedHighScore));
    }
  }, []);

  const handleRestart = () => {
    setQuadrantFills([0, 0, 0, 0]);
    setDisplayedScore(0);
    speedRef.current = INITIAL_SPEED;
    angleRef.current = 0;
    setIsNewHighScore(false);
    setPlayerName('');
    setIsGameOver(false);
  };

  const handleSaveScore = () => {
    const newHighScoreData = { score: displayedScore, name: playerName || 'Anonymous' };
    localStorage.setItem('circleGameHighScore', JSON.stringify(newHighScoreData));
    setHighScore(newHighScoreData);
    setIsNewHighScore(false); // Hide form, show restart button
  };

  // --- Dynamic Sizing Effect ---
  useLayoutEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, window.innerHeight * 0.7) * 0.95;
        setCanvasSize(size > 150 ? size : 150);
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // --- Main Render Loop ---
  useEffect(() => {
    // ... (This effect remains the same, no logic changes needed)
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      context.clearRect(0, 0, canvasSize, canvasSize);
      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      const radius = canvasSize * 0.4;
      const fillStep = radius / (MAX_FILL_LEVEL);
      const dotRadius = radius * 0.08;
      const gameOverFontSize = radius * 0.2;

      const quadrantAngles = [{ start: 0, end: Math.PI / 2 },{ start: Math.PI / 2, end: Math.PI },{ start: Math.PI, end: 3 * Math.PI / 2 },{ start: 3 * Math.PI / 2, end: 2 * Math.PI }];
      quadrantFills.forEach((fillLevel, i) => {
        if (fillLevel > 0) {
          const arcRadius = Math.min(fillLevel * fillStep, radius);
          context.beginPath();
          context.moveTo(centerX, centerY);
          context.arc(centerX, centerY, arcRadius, quadrantAngles[i].start, quadrantAngles[i].end);
          context.closePath();
          context.fillStyle = fillLevel >= MAX_FILL_LEVEL ? '#ff4d4d' : 'rgba(97, 218, 251, 0.5)';
          context.fill();
        }
      });

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.strokeStyle = '#ffffff';
      context.lineWidth = Math.max(2, canvasSize * 0.005);
      context.stroke();
      context.save();
      context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      context.lineWidth = Math.max(1, canvasSize * 0.0025);
      context.beginPath(); context.moveTo(centerX - radius, centerY); context.lineTo(centerX + radius, centerY); context.stroke();
      context.beginPath(); context.moveTo(centerX, centerY - radius); context.lineTo(centerX, centerY + radius); context.stroke();
      context.restore();

      if (isGameOver && !isNewHighScore) {
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvasSize, canvasSize);
        context.font = `${gameOverFontSize}px Arial`;
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText('Game Over', centerX, centerY);
      } else if (!isGameOver) {
        const dotX = centerX + radius * Math.cos(angleRef.current);
        const dotY = centerY + radius * Math.sin(angleRef.current);
        context.beginPath();
        context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
        context.fillStyle = '#61dafb';
        context.fill();
        angleRef.current += speedRef.current;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [quadrantFills, isGameOver, canvasSize, isNewHighScore]);

  // --- Click Handler ---
  const handleCanvasClick = () => {
    if (isGameOver) return;
    const currentAngle = angleRef.current % (2 * Math.PI);
    const normalizedAngle = currentAngle < 0 ? currentAngle + 2 * Math.PI : currentAngle;
    const quadrant = Math.floor(normalizedAngle / (Math.PI / 2));

    if (quadrantFills[quadrant] >= MAX_FILL_LEVEL -1) {
      const finalScore = displayedScore + 1;
      setDisplayedScore(finalScore);
      const newFills = [...quadrantFills];
      newFills[quadrant]++;
      setQuadrantFills(newFills);
      setIsGameOver(true);
      if (finalScore > highScore.score) {
        setIsNewHighScore(true);
      }
      return;
    }

    setDisplayedScore(prevScore => {
      const newScore = prevScore + 1;
      if (newScore > 0 && newScore % 100 === 0) {
        speedRef.current /= 1.3;
      }
      return newScore;
    });

    const newFills = [...quadrantFills];
    newFills[quadrant]++;

    const isNowFullCircle = newFills.every(level => level > 0);
    if (isNowFullCircle) {
      const finalFills = newFills.map(f => Math.max(0, f - 1));
      setQuadrantFills(finalFills);
      speedRef.current /= Math.pow(SPEED_MULTIPLIER, 2);
    } else {
      setQuadrantFills(newFills);
      speedRef.current *= SPEED_MULTIPLIER;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>The Circle Game</h1>
        <div className="game-container">
          <canvas ref={canvasRef} width={canvasSize} height={canvasSize} onClick={handleCanvasClick} />
          <div className="game-stats">
            <div>Points: <span>{displayedScore}</span></div>
            <div>Record: <span>{highScore.name} - {highScore.score}</span></div>
            <div>Speed: <span>{(speedRef.current / INITIAL_SPEED).toFixed(2)}x</span></div>
          </div>

          {isGameOver && (
            isNewHighScore ? (
              <div className="highscore-form">
                <h3>New High Score!</h3>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <button onClick={handleSaveScore}>Save Score</button>
              </div>
            ) : (
              <button onClick={handleRestart}>Restart Game</button>
            )
          )}

          {!isGameOver && <p>Fill the quadrants, but don't let one get too full!</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
