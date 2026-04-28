function Ending({ winner, onReset }) {
  return (
    <div className="setup-container" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>Vitória!</h1>
      <h2 style={{ marginBottom: '30px', color: '#666' }}>A equipe {winner} venceu!</h2>
      
      <button 
        className="btn-codenames" 
        style={{ margin: '0 auto', padding: '15px 40px', fontSize: '1.2rem' }}
        onClick={onReset}
      >
        Jogar Novamente
      </button>
    </div>
  )
}

export default Ending
