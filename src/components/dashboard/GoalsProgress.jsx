import Panel from '../Panel'
import { Target } from 'lucide-react'

export default function GoalsProgress({ goals }) {
  return (
    <Panel title="Goals" icon={Target}>
      <div style={styles.list}>
        {goals.map(goal => (
          <div key={goal.id} style={styles.item}>
            <div style={styles.header}>
              <div style={styles.title}>{goal.title}</div>
              <span style={styles.timeframe}>{goal.timeframe}</span>
            </div>
            <div style={styles.barWrap}>
              <div style={styles.bar}>
                <div style={{
                  ...styles.fill,
                  width: `${goal.progress}%`,
                  background: goal.progress >= 70 ? 'var(--secondary)' : goal.progress >= 30 ? 'var(--primary)' : 'var(--accent)',
                }} />
              </div>
              <span style={styles.pct}>{goal.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  item: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  title: { fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' },
  timeframe: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    fontFamily: 'var(--font-mono)',
  },
  barWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    background: 'var(--border)',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  pct: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    minWidth: 30,
    textAlign: 'right',
  },
}
