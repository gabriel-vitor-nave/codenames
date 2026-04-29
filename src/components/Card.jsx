import { motion } from 'framer-motion'

function Card({ word, isSelected, isAnimating, onClick }) {
  // Dynamic font size based on word length
  const getFontSize = (text) => {
    if (text.length > 12) return '1.2rem';
    if (text.length > 9) return '1.5rem';
    return '1.8rem';
  };

  return (
    <motion.div 
      className={`card-item ${word.revealed ? `revealed ${word.type}` : ''} ${isSelected ? 'selected' : ''} ${isAnimating ? 'animating-reveal' : ''}`}
      onClick={onClick}
      whileHover={{ scale: word.revealed ? 0.95 : 1.02 }}
      layout
    >
      <div className="card-top"></div>
      <div className="card-line"></div>
      <div className="card-word-box">
        <span className="card-word" style={{ fontSize: getFontSize(word.text) }}>{word.text}</span>
      </div>
    </motion.div>
  )
}

export default Card
