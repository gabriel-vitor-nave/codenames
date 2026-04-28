import { useState } from 'react'

function Setup({ onStart, words }) {
  const [name1, setName1] = useState('Equipe Vermelha');
  const [name2, setName2] = useState('Equipe Azul');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="setup-container">
      <h1>Codenames: TICs</h1>
      
      <div className="form-group">
        <label style={{ color: 'var(--team-red)' }}>Equipe 1 (Vermelha)</label>
        <input 
          type="text" 
          value={name1} 
          onChange={(e) => setName1(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label style={{ color: 'var(--team-blue)' }}>Equipe 2 (Azul)</label>
        <input 
          type="text" 
          value={name2} 
          onChange={(e) => setName2(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
        <button 
          className="btn-codenames" 
          style={{ flex: 1, background: '#9e9e9e', borderColor: '#bdbdbd' }}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Ocultar Mapa' : 'Ver Mapa'}
        </button>
        <button 
          className="btn-codenames" 
          style={{ flex: 2 }}
          onClick={() => onStart(name1, name2)}
        >
          Começar Jogo
        </button>
      </div>

      {showPreview && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '10px' }}>SPYMASTERS: ANOTEM A CHAVE!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {words.map((w, i) => (
              <div 
                key={i} 
                style={{ 
                  aspectRatio: '1', 
                  backgroundColor: w.type === 'black' ? '#000' : `var(--team-${w.type})` || '#9e9e9e',
                  borderRadius: '4px',
                  opacity: 0.8
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Setup
