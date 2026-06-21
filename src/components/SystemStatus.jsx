import { useState, useEffect } from 'react'

export default function SystemStatus() {
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const systems = [
    { name: 'Voice Synthesis', status: 'online', module: 'ElevenLabs' },
    { name: 'Avatar Engine', status: 'standby', module: 'Higgsfield' },
    { name: 'Data Analytics', status: 'online', module: 'Core' },
    { name: 'Crypto Feed', status: 'online', module: 'CoinGecko' },
    { name: 'Restaurant API', status: 'standby', module: 'Arches' },
    { name: 'Security', status: 'online', module: 'Shield' },
  ]

  return (
    <div className="panel system-status">
      <div className="panel-header">
        <span className="panel-label">SYSTEMS</span>
        <span className="panel-location">{formatUptime(uptime)}</span>
      </div>
      <div className="system-list">
        {systems.map((sys, i) => (
          <div key={i} className="system-item">
            <div className="system-info">
              <span className={`sys-dot ${sys.status}`}></span>
              <span className="sys-name">{sys.name}</span>
            </div>
            <span className={`sys-status ${sys.status}`}>{sys.status.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <style>{`
        .system-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .system-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: var(--bg-card);
          border-radius: 6px;
        }
        .system-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sys-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .sys-dot.online {
          background: var(--secondary);
          box-shadow: 0 0 6px var(--secondary);
        }
        .sys-dot.standby {
          background: var(--warning);
          box-shadow: 0 0 6px var(--warning);
        }
        .sys-dot.offline {
          background: var(--danger);
          box-shadow: 0 0 6px var(--danger);
        }
        .sys-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
        }
        .sys-status {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 1px;
        }
        .sys-status.online { color: var(--secondary); }
        .sys-status.standby { color: var(--warning); }
        .sys-status.offline { color: var(--danger); }
      `}</style>
    </div>
  )
}
