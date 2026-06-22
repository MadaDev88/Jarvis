import { useState } from 'react'
import Panel from '../components/Panel'
import { Settings, User, Key, Cloud, Coins, Save } from 'lucide-react'

export default function SettingsPage({ store }) {
  const [local, setLocal] = useState({ ...store.settings })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    store.updateSettings(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Settings</h2>
        <button style={styles.saveBtn} onClick={handleSave}>
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={styles.grid}>
        <Panel title="Profile" icon={User}>
          <div style={styles.field}>
            <label style={styles.label}>Display Name</label>
            <input style={styles.input} value={local.userName} onChange={e => setLocal({ ...local, userName: e.target.value })} />
          </div>
        </Panel>

        <Panel title="Voice (ElevenLabs)" icon={Key}>
          <div style={styles.field}>
            <label style={styles.label}>API Key</label>
            <input style={styles.input} type="password" value={local.elevenLabsKey} onChange={e => setLocal({ ...local, elevenLabsKey: e.target.value })} placeholder="Enter ElevenLabs API key" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Voice ID</label>
            <input style={styles.input} value={local.elevenLabsVoiceId} onChange={e => setLocal({ ...local, elevenLabsVoiceId: e.target.value })} placeholder="Enter Voice ID" />
          </div>
        </Panel>

        <Panel title="Weather" icon={Cloud}>
          <div style={styles.field}>
            <label style={styles.label}>OpenWeatherMap API Key</label>
            <input style={styles.input} type="password" value={local.weatherApiKey} onChange={e => setLocal({ ...local, weatherApiKey: e.target.value })} placeholder="Enter API key" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>City</label>
            <input style={styles.input} value={local.weatherCity} onChange={e => setLocal({ ...local, weatherCity: e.target.value })} />
          </div>
        </Panel>

        <Panel title="Crypto Tracking" icon={Coins}>
          <div style={styles.field}>
            <label style={styles.label}>Coins (comma separated)</label>
            <input style={styles.input} value={local.cryptoCoins.join(', ')} onChange={e => setLocal({ ...local, cryptoCoins: e.target.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) })} />
          </div>
          <div style={styles.hint}>Uses CoinGecko IDs: bitcoin, ethereum, solana, cardano, etc.</div>
        </Panel>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-bright)', letterSpacing: '1px' },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
    borderRadius: '10px', border: '1px solid var(--border-glow)',
    background: 'var(--primary-dim)', color: 'var(--primary)',
    cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-body)',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '12px', color: 'var(--text-dim)',
    fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase',
    marginBottom: '8px',
  },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid var(--border)', background: 'var(--bg-dark)',
    color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  hint: { fontSize: '12px', color: 'var(--text-dim)', marginTop: '-8px' },
}
