import { useState } from 'react'
import Card from './Card'

function GameBoard({ gameData, setGameData, teamRed, teamBlue, onEnd, onReset }) {
  const [currentHint, setCurrentHint] = useState('');
  const [currentCount, setCurrentCount] = useState(0);

  const handleReveal = (index) => {
    if (gameData.isGameOver || gameData.words[index].revealed) return;

    const newWords = [...gameData.words];
    const card = newWords[index];
    card.revealed = true;

    const newScores = { ...gameData.scores };
    let newTurn = gameData.currentTurn;
    let gameOver = false;
    let winner = null;

    if (card.type === 'black') {
      gameOver = true;
      winner = gameData.currentTurn === 'red' ? 'blue' : 'red';
    } else if (card.type === 'neutral') {
      newTurn = gameData.currentTurn === 'red' ? 'blue' : 'red';
      setCurrentHint('');
      setCurrentCount(0);
    } else if (card.type !== gameData.currentTurn) {
      newScores[card.type]--;
      if (newScores[card.type] === 0) {
        gameOver = true;
        winner = card.type;
      } else {
        newTurn = gameData.currentTurn === 'red' ? 'blue' : 'red';
        setCurrentHint('');
        setCurrentCount(0);
      }
    } else {
      newScores[card.type]--;
      if (newScores[card.type] === 0) {
        gameOver = true;
        winner = card.type;
      }
    }

    setGameData(prev => ({
      ...prev,
      words: newWords,
      scores: newScores,
      currentTurn: newTurn,
      isGameOver: gameOver,
      winner: winner
    }));

    if (gameOver) {
      onEnd(winner);
    }
  };

  const endTurn = () => {
    setGameData(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'red' ? 'blue' : 'red'
    }));
    setCurrentHint('');
    setCurrentCount(0);
  };

  return (
    <div className="game-layout">
      {/* RED AREA */}
      <div className={`team-area red ${gameData.currentTurn === 'red' ? 'active' : ''}`}>
        <div className="team-info">
          <h2 style={{ color: 'var(--team-red)' }}>{teamRed}</h2>
          <p className="score-info">Palavras restantes: {gameData.scores.red}</p>
        </div>
        
        <div className="hint-box">
          <h3>Dica Atual</h3>
          {gameData.currentTurn === 'red' && currentHint ? (
            <>
              <span className="hint-text">{currentHint}</span>
              <span className="hint-number">{currentCount}</span>
            </>
          ) : (
            <span style={{ color: '#999' }}>Aguardando dica...</span>
          )}
        </div>

        {gameData.currentTurn === 'red' && (
          <button className="btn-codenames btn-red" onClick={endTurn}>
            Passar a vez
          </button>
        )}
      </div>

      {/* GRID AREA */}
      <div className="board-area">
        <div className="game-grid">
          {gameData.words.map((word, i) => (
            <Card 
              key={i} 
              word={word} 
              onClick={() => handleReveal(i)} 
            />
          ))}
        </div>

        <div className="controls">
          <input 
            type="text" 
            placeholder="Dica do Spymaster..." 
            value={currentHint}
            onChange={(e) => setCurrentHint(e.target.value)}
          />
          <input 
            type="number" 
            min="0" 
            max="9" 
            value={currentCount}
            onChange={(e) => setCurrentCount(parseInt(e.target.value) || 0)}
          />
          <button className="btn-codenames" onClick={() => {}}>
            Registrar Dica
          </button>
          <button className="btn-codenames" style={{ background: '#666', borderColor: '#888' }} onClick={onReset}>
            Sair
          </button>
        </div>
      </div>

      {/* BLUE AREA */}
      <div className={`team-area blue ${gameData.currentTurn === 'blue' ? 'active' : ''}`}>
        <div className="team-info">
          <h2 style={{ color: 'var(--team-blue)', textAlign: 'right' }}>{teamBlue}</h2>
          <p className="score-info" style={{ textAlign: 'right' }}>Palavras restantes: {gameData.scores.blue}</p>
        </div>

        <div className="hint-box">
          <h3>Dica Atual</h3>
          {gameData.currentTurn === 'blue' && currentHint ? (
            <>
              <span className="hint-text">{currentHint}</span>
              <span className="hint-number">{currentCount}</span>
            </>
          ) : (
            <span style={{ color: '#999' }}>Aguardando dica...</span>
          )}
        </div>

        {gameData.currentTurn === 'blue' && (
          <button className="btn-codenames btn-blue" onClick={endTurn}>
            Passar a vez
          </button>
        )}
      </div>
    </div>
  )
}

export default GameBoard
