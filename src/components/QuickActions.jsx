export default function QuickActions({ onAction }) {
  const actions = [
    { label: 'System Status', command: 'system status', icon: '◈' },
    { label: 'Weather Report', command: 'weather update', icon: '◉' },
    { label: 'Crypto Markets', command: 'crypto update', icon: '◆' },
    { label: 'Arches Update', command: 'arches restaurant status', icon: '◇' },
    { label: 'Goal Review', command: 'review my goals', icon: '◎' },
    { label: 'Family Check', command: 'family update', icon: '♦' },
  ]

  return (
    <div className="panel quick-actions">
      <div className="panel-header">
        <span className="panel-label">QUICK ACTIONS</span>
      </div>
      <div className="action-grid">
        {actions.map((action, i) => (
          <button
            key={i}
            className="action-btn"
            onClick={() => onAction(action.command)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          cursor: pointer;
          transition: all 0.3s;
          font-family: var(--font-body);
        }
        .action-btn:hover {
          border-color: var(--primary);
          background: rgba(0, 212, 255, 0.05);
          box-shadow: 0 0 12px var(--primary-dim);
          transform: translateY(-2px);
        }
        .action-icon {
          font-size: 20px;
          color: var(--primary);
        }
        .action-label {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
