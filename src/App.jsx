import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { TIC_WORDS } from './data/words'
import Setup from './components/Setup'
import GameBoard from './components/GameBoard'
import Ending from './components/Ending'

const TYPES = {
  RED: 'red',
  BLUE: 'blue',
  NEUTRAL: 'neutral',
  ASSASSIN: 'black'
};

function App() {
  const [screen, setScreen] = useState('setup');
  const [teamRed, setTeamRed] = useState('TIME 1');
  const [teamBlue, setTeamBlue] = useState('TIME 2');
  const [gameData, setGameData] = useState({
    words: [],
    currentTurn: TYPES.RED,
    scores: { [TYPES.RED]: 5, [TYPES.BLUE]: 4 },
    hint: '',
    hintCount: 0,
    winner: null,
    isGameOver: false
  });

  const shuffle = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const initNewGame = useCallback(() => {
    const selectedWords = shuffle(TIC_WORDS).slice(0, 16);
    const types = shuffle([
      ...Array(5).fill(TYPES.RED),
      ...Array(4).fill(TYPES.BLUE),
      ...Array(6).fill(TYPES.NEUTRAL),
      TYPES.ASSASSIN
    ]);

    const words = selectedWords.map((text, i) => ({
      text,
      type: types[i],
      revealed: false
    }));

    setGameData({
      words,
      currentTurn: TYPES.RED,
      scores: { [TYPES.RED]: 5, [TYPES.BLUE]: 4 },
      hint: '',
      hintCount: 0,
      winner: null,
      isGameOver: false
    });
    document.body.className = '';
  }, []);

  useEffect(() => {
    initNewGame();
  }, [initNewGame]);

  const startGame = (name1, name2) => {
    setTeamRed(name1 || 'TIME 1');
    setTeamBlue(name2 || 'TIME 2');
    setScreen('game');
  };

  const handleEndGame = (winner) => {
    setScreen('ending');
    setGameData(prev => ({ ...prev, winner, isGameOver: true }));
  };

  const resetGame = () => {
    initNewGame();
    setScreen('setup');
  };

  return (
    <div className="app-container">
      {screen === 'setup' && (
        <Setup 
          onStart={startGame} 
          words={gameData.words} 
        />
      )}
      
      {screen === 'game' && (
        <GameBoard 
          gameData={gameData}
          setGameData={setGameData}
          teamRed={teamRed}
          teamBlue={teamBlue}
          onEnd={handleEndGame}
          onReset={resetGame}
        />
      )}

      {screen === 'ending' && (
        <Ending 
          winner={gameData.winner === TYPES.RED ? teamRed : teamBlue}
          onReset={resetGame}
        />
      )}
    </div>
  )
}

export default App
