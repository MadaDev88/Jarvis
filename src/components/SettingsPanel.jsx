import { useState } from 'react'

export default function SettingsPanel({ settings, setSettings, onClose }) {
  const [local, setLocal] = useState({ ...settings })

  function handleSave() {
    setSettings(local)
    onClose()
  }

  function updateField(key, value) {
    setLocal(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">CONFIGURATION</h2>
          <button className="settings-close" onClick={onClose}>&times;</button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3 className="section-title">General</h3>
            <div className="field">
              <label>Your Name</label>
              <input value={local.userName} onChange={e => updateField('userName', e.target.value)} />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">ElevenLabs Voice</h3>
            <div className="field">
              <label>API Key</label>
              <input type="password" value={local.elevenLabsKey} onChange={e => updateField('elevenLabsKey', e.target.value)} placeholder="Enter ElevenLabs API key" />
            </div>
            <div className="field">
              <label>Voice ID</label>
              <input value={local.elevenLabsVoiceId} onChange={e => updateField('elevenLabsVoiceId', e.target.value)} placeholder="e.g. 21m00Tcm4TlvDq8ikWAM" />
            </div>
            <p className="field-hint">Get your API key from elevenlabs.io. Use a British male voice for the authentic Jarvis experience.</p>
          </div>

          <div className="settings-section">
            <h3 className="section-title">Higgsfield Avatar</h3>
            <div className="field">
              <label>API Key</label>
              <input type="password" value={local.higgsFieldKey} onChange={e => updateField('higgsFieldKey', e.target.value)} placeholder="Enter Higgsfield API key" />
            </div>
            <p className="field-hint">Enables AI-generated avatar video responses. Get your key from higgsfield.ai.</p>
          </div>

          <div className="settings-section">
            <h3 className="section-title">Weather</h3>
            <div className="field">
              <label>OpenWeatherMap API Key</label>
              <input type="password" value={local.weatherApiKey} onChange={e => updateField('weatherApiKey', e.target.value)} placeholder="Enter API key for live weather" />
            </div>
            <div className="field">
              <label>City</label>
              <input value={local.weatherCity} onChange={e => updateField('weatherCity', e.target.value)} />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">Crypto Portfolio</h3>
            <div className="field">
              <label>Tracked Coins (comma separated)</label>
              <input value={(local.cryptoCoins || []).join(', ')} onChange={e => updateField('cryptoCoins', e.target.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean))} placeholder="bitcoin, ethereum, solana" />
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Configuration</button>
        </div>
      </div>

      <style>{`
        .settings-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .settings-modal {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          width: 90%;
          max-width: 560px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 40px rgba(0, 212, 255, 0.1);
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
        }
        .settings-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 4px;
          color: var(--primary);
        }
        .settings-close {
          background: none;
          border: none;
          color: var(--text-dim);
          font-size: 28px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .settings-close:hover { color: var(--danger); }
        .settings-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          color: var(--text-dim);
          margin-bottom: 10px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field label {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-dim);
          margin-bottom: 4px;
        }
        .field input {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 13px;
          outline: none;
        }
        .field input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px var(--primary-dim);
        }
        .field-hint {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          line-height: 1.4;
        }
        .settings-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--border);
        }
        .btn-cancel, .btn-save {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-cancel {
          background: var(--bg-card);
          color: var(--text-dim);
          border: 1px solid var(--border);
        }
        .btn-cancel:hover {
          border-color: var(--text-dim);
        }
        .btn-save {
          background: linear-gradient(135deg, var(--primary), #0099cc);
          color: var(--bg-dark);
        }
        .btn-save:hover {
          box-shadow: 0 0 20px var(--primary-dim);
        }
      `}</style>
    </div>
  )
}
