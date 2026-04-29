import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Card from './Card'

// Simple SFX manager using Web Audio API
const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'select') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'shake') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else if (type === 'explode') {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < ctx.sampleRate * 0.5; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    noise.start();
    noise.stop(ctx.currentTime + 0.5);
  } else if (type === 'popup') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'sad') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }
};

function GameBoard({ gameData, setGameData, teamRed, teamBlue, onEnd, onReset }) {
  const [currentHint, setCurrentHint] = useState('');
  const [currentCount, setCurrentCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [showTurnPopup, setShowTurnPopup] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);

  // Update body class for background
  useEffect(() => {
    if (gameData.isGameOver && gameData.winner) {
      document.body.className = `body-${gameData.winner}`;
    } else {
      document.body.className = `body-${gameData.currentTurn}`;
    }
  }, [gameData.currentTurn, gameData.isGameOver, gameData.winner]);

  // Show turn popup on turn change
  useEffect(() => {
    if (gameData.isGameOver) return;
    setShowTurnPopup(true);
    playSound('popup');
    const timer = setTimeout(() => setShowTurnPopup(false), 2000);
    return () => clearTimeout(timer);
  }, [gameData.currentTurn, gameData.isGameOver]);

  const handleCardClick = (index) => {
    if (gameData.isGameOver || gameData.words[index].revealed || animatingIndex !== null) return;

    if (selectedIndex === index) {
      startRevealSequence(index);
    } else {
      setSelectedIndex(index);
      playSound('select');
    }
  };

  const startRevealSequence = async (index) => {
    setSelectedIndex(null);
    setAnimatingIndex(index);
    playSound('shake');

    await new Promise(r => setTimeout(r, 1000));

    if (gameData.words[index].type === 'black') {
      playSound('sad');
    } else {
      playSound('explode');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: getConfettiColors(gameData.words[index].type)
      });
    }

    processReveal(index);
    setAnimatingIndex(null);
  };

  const getConfettiColors = (type) => {
    if (type === 'red') return ['#ff416c', '#ff4b2b'];
    if (type === 'blue') return ['#4facfe', '#00f2fe'];
    if (type === 'black') return ['#000000', '#333333'];
    return ['#cccccc', '#eeeeee'];
  };

  const processReveal = (index) => {
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
    } else if (card.type !== gameData.currentTurn) {
      newScores[card.type]--;
      if (newScores[card.type] === 0) {
        gameOver = true;
        winner = card.type;
      } else {
        newTurn = gameData.currentTurn === 'red' ? 'blue' : 'red';
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
      winner: winner,
      hint: newTurn !== prev.currentTurn ? '' : prev.hint,
      hintCount: newTurn !== prev.currentTurn ? 0 : prev.hintCount
    }));

    if (gameOver) {
      // Delay slightly to show color reveal
      setTimeout(() => onEnd(winner), 1500);
    }
  };

  const registerHint = () => {
    if (!currentHint) return;
    setGameData(prev => ({
      ...prev,
      hint: currentHint,
      hintCount: currentCount
    }));
    setShowHintPopup(true);
    playSound('popup');
    setTimeout(() => setShowHintPopup(false), 2000);
  };

  const endTurn = () => {
    setGameData(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'red' ? 'blue' : 'red',
      hint: '',
      hintCount: 0
    }));
    setCurrentHint('');
    setCurrentCount(0);
    setSelectedIndex(null);
  };

  return (
    <div className="game-layout">
      <AnimatePresence>
        {showTurnPopup && (
          <motion.div className="popup-overlay" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ x: '-100vw', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100vw', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, transparent 0%, #1a1a1a 15%, #1a1a1a 85%, transparent 100%)',
                padding: '40px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', left: '15%', opacity: 0.15, height: '120%' }}>
                <svg viewBox="0 0 24 24" height="100%" fill="white"><path d="M12,2A5,5 0 0,1 17,7A5,5 0 0,1 12,12A5,5 0 0,1 7,7A5,5 0 0,1 12,2M12,14C15.31,14 20,15.67 20,19V22H4V19C4,15.67 8.69,14 12,14Z"/></svg>
              </div>
              <h1 style={{ color: 'white', fontSize: '4rem', fontFamily: 'var(--font-alt)', textTransform: 'uppercase', letterSpacing: '4px' }}>
                VEZ DO TIME <span style={{ color: gameData.currentTurn === 'red' ? '#ff4b2b' : '#4facfe' }}>
                  {gameData.currentTurn === 'red' ? teamRed : teamBlue}
                </span>
              </h1>
            </motion.div>
          </motion.div>
        )}

        {showHintPopup && (
          <motion.div className="popup-overlay">
            <motion.div 
              className="popup-content"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
            >
              <h3 style={{ fontSize: '1.5rem', color: '#666' }}>NOVA DICA</h3>
              <h1 style={{ fontSize: '5rem' }}>{gameData.hint}</h1>
              <h2 style={{ fontSize: '2.5rem' }}>QUANTIDADE: {gameData.hintCount}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className={`team-area red ${gameData.currentTurn === 'red' ? 'active' : ''}`}>
        <div className="team-info">
          <h2 style={{ color: '#d32f2f', fontSize: '2.5rem' }}>{teamRed}</h2>
          <p className="score-info">PALAVRAS: {gameData.scores.red}</p>
        </div>
        <div className="hint-box">
          <h3>Dica Atual</h3>
          {gameData.hint ? (
            <>
              <span className="hint-text" style={{ fontSize: gameData.hint.length > 8 ? '3rem' : '5rem' }}>{gameData.hint}</span>
              <span className="hint-number">{gameData.hintCount}</span>
            </>
          ) : (
            <span style={{ color: '#bbb', fontSize: '1.5rem' }}>Aguardando...</span>
          )}
        </div>
        {gameData.currentTurn === 'red' && <button className="btn-codenames" onClick={endTurn} style={{ marginTop: 'auto' }}>Finalizar Turno</button>}
      </motion.div>

      <div className="board-area">
        <div className="game-grid">
          {gameData.words.map((word, i) => (
            <Card key={i} word={word} isSelected={selectedIndex === i} isAnimating={animatingIndex === i} onClick={() => handleCardClick(i)} />
          ))}
        </div>
        <div className="controls">
          <input type="text" placeholder="ESCREVA A DICA..." value={currentHint} onChange={(e) => setCurrentHint(e.target.value.toUpperCase())} />
          <input type="number" min="0" max="9" value={currentCount} onChange={(e) => setCurrentCount(parseInt(e.target.value) || 0)} style={{ width: '80px' }} />
          <button className="btn-codenames" onClick={registerHint}>Registrar</button>
          <button className="btn-codenames" style={{ background: '#333' }} onClick={onReset}>Sair</button>
        </div>
      </div>

      <motion.div className={`team-area blue ${gameData.currentTurn === 'blue' ? 'active' : ''}`}>
        <div className="team-info">
          <h2 style={{ color: '#1976d2', textAlign: 'right', fontSize: '2.5rem' }}>{teamBlue}</h2>
          <p className="score-info" style={{ textAlign: 'right' }}>PALAVRAS: {gameData.scores.blue}</p>
        </div>
        <div className="hint-box">
          <h3>Dica Atual</h3>
          {gameData.hint ? (
            <>
              <span className="hint-text" style={{ fontSize: gameData.hint.length > 8 ? '3rem' : '5rem' }}>{gameData.hint}</span>
              <span className="hint-number">{gameData.hintCount}</span>
            </>
          ) : (
            <span style={{ color: '#bbb', fontSize: '1.5rem' }}>Aguardando...</span>
          )}
        </div>
        {gameData.currentTurn === 'blue' && <button className="btn-codenames" onClick={endTurn} style={{ marginTop: 'auto' }}>Finalizar Turno</button>}
      </motion.div>
    </div>
  )
}

export default GameBoard
