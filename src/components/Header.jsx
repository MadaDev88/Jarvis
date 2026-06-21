import { useState, useEffect } from 'react'

export default function Header({ onSettingsClick }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">◇</span>
          <span className="logo-text">J.A.R.V.I.S.</span>
        </div>
        <span className="logo-sub">Just A Rather Very Intelligent System</span>
      </div>
      <div className="header-center">
        <div className="header-time">{time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
        <div className="header-date">{time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>ALL SYSTEMS ONLINE</span>
        </div>
        <button className="settings-btn" onClick={onSettingsClick} title="Settings">
          ⚙
        </button>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(0, 212, 255, 0.05), transparent);
          backdrop-filter: blur(10px);
        }
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          font-size: 28px;
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 6px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-sub {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .header-center {
          text-align: center;
        }
        .header-time {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--primary);
          letter-spacing: 4px;
          text-shadow: 0 0 20px var(--primary-glow);
        }
        .header-date {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
          letter-spacing: 1px;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--secondary);
          letter-spacing: 1px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--secondary);
          box-shadow: 0 0 8px var(--secondary);
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
        .settings-btn {
          background: var(--bg-glass);
          border: 1px solid var(--border);
          color: var(--text-dim);
          font-size: 20px;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .settings-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 12px var(--primary-dim);
        }
        @media (max-width: 768px) {
          .header { flex-wrap: wrap; gap: 12px; justify-content: center; }
          .logo-text { font-size: 18px; letter-spacing: 3px; }
          .header-time { font-size: 20px; }
        }
      `}</style>
    </header>
  )
}
