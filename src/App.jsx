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

  const shuffle = useCallback((array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }, []);

  const initNewGame = useCallback(() => {
    // 1. Selection based on 'weight'
    // Give each word a score: weight * random
    const scoredWords = TIC_WORDS.map(w => ({
      ...w,
      score: (w.weight || 50) * Math.random()
    }));

    // Sort by score descending and take top 16
    const selectedData = scoredWords
      .sort((a, b) => b.score - a.score)
      .slice(0, 16);

    // 2. Assign Assassin based on 'assassinWeight'
    // Score the selected words for the assassin role
    const assassinScored = selectedData.map((w, idx) => ({
      idx,
      aScore: (w.assassinWeight || 0) * Math.random()
    }));
    
    // Sort to find the best candidate for assassin
    const assassinIdx = assassinScored.sort((a, b) => b.aScore - a.aScore)[0].idx;

    // 3. Assign other types (5 Red, 4 Blue, 6 Neutral)
    const otherTypes = shuffle([
      ...Array(5).fill(TYPES.RED),
      ...Array(4).fill(TYPES.BLUE),
      ...Array(6).fill(TYPES.NEUTRAL)
    ]);

    let typePtr = 0;
    const finalWords = selectedData.map((data, i) => {
      let type;
      if (i === assassinIdx) {
        type = TYPES.ASSASSIN;
      } else {
        type = otherTypes[typePtr++];
      }
      return {
        text: data.text,
        type,
        revealed: false
      };
    });

    setGameData({
      words: finalWords,
      currentTurn: TYPES.RED,
      scores: { [TYPES.RED]: 5, [TYPES.BLUE]: 4 },
      hint: '',
      hintCount: 0,
      winner: null,
      isGameOver: false
    });
    document.body.className = '';
  }, [shuffle]);

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
