function Card({ word, onClick }) {
  return (
    <div 
      className={`card-item ${word.revealed ? `revealed ${word.type}` : ''}`}
      onClick={onClick}
    >
      {word.text}
    </div>
  )
}

export default Card
