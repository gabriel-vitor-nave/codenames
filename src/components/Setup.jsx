import { useState } from 'react'
import { motion } from 'framer-motion'

function Setup({ onStart, words }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <motion.div
      className="setup-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxHeight: '95vh', overflowY: 'auto', padding: '20px' }}
    >
      <h1 style={{
        fontSize: '3.5rem',
        marginBottom: '20px',
        color: '#222',
        textShadow: '2px 2px 0px rgba(0,0,0,0.05)',
        lineHeight: 1
      }}>
        CODENAMES<br /><span style={{ color: 'var(--team-blue)', fontSize: '2.5rem' }}>TICs AVANÇADAS</span>
      </h1>

      <div className="setup-form-box" style={{
        background: 'rgba(255,255,255,0.8)',
        padding: '30px',
        borderRadius: '30px',
        border: '6px solid white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div className="form-group">
          <label style={{ color: 'var(--team-red)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Time 1 (Vermelho)</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value.toUpperCase())}
            placeholder="NOME DO TIME..."
            style={{ fontSize: '1.5rem', padding: '15px' }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label style={{ color: 'var(--team-blue)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Time 2 (Azul)</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value.toUpperCase())}
            placeholder="NOME DO TIME..."
            style={{ fontSize: '1.5rem', padding: '15px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button
            className="btn-codenames"
            style={{ flex: 1, background: 'linear-gradient(180deg, #999, #666)', fontSize: '1.2rem' }}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Ocultar Mapa' : 'Ver Mapa'}
          </button>
          <button
            className="btn-codenames"
            style={{ flex: 2, fontSize: '1.2rem' }}
            onClick={() => onStart(name1, name2)}
          >
            Começar Jogo
          </button>
        </div>
      </div>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: '20px',
            padding: '20px',
            background: 'white',
            borderRadius: '24px',
            border: '6px solid #eee',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            maxWidth: '700px',
            margin: '20px auto 0'
          }}
        >
          <p style={{ fontSize: '1rem', fontWeight: '900', textAlign: 'center', marginBottom: '15px', color: '#444' }}>
            ANOTEM A CHAVE!
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {words.map((w, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1.5',
                  backgroundColor: w.type === 'black' ? '#000' : (w.type === 'neutral' ? '#9e9e9e' : `var(--team-${w.type})`),
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '900',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                  minHeight: '50px'
                }}
              >
                {w.text}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Setup
