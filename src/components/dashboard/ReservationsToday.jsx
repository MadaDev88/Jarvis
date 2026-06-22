import { Link } from 'react-router-dom'
import Panel from '../Panel'
import { UtensilsCrossed, ChevronRight } from 'lucide-react'

export default function ReservationsToday({ reservations }) {
  const today = new Date().toISOString().split('T')[0]
  const todayRes = reservations.filter(r => r.date === today)

  return (
    <Panel
      title="Today's Reservations"
      icon={UtensilsCrossed}
      action={
        <Link to="/restaurant" style={styles.viewAll}>
          Manage <ChevronRight size={14} />
        </Link>
      }
    >
      {todayRes.length === 0 ? (
        <div style={styles.empty}>No reservations today</div>
      ) : (
        <div style={styles.list}>
          {todayRes.map(r => (
            <div key={r.id} style={styles.item}>
              <div style={styles.time}>{r.time}</div>
              <div style={styles.info}>
                <div style={styles.name}>{r.name}</div>
                <div style={styles.details}>{r.guests} guests{r.notes ? ` · ${r.notes}` : ''}</div>
              </div>
              <div style={{
                ...styles.status,
                color: r.status === 'confirmed' ? 'var(--secondary)' : 'var(--warning)',
                background: r.status === 'confirmed' ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
              }}>
                {r.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
  },
  time: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    color: 'var(--primary)',
    fontWeight: 600,
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)' },
  details: { fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' },
  status: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '6px',
    textTransform: 'capitalize',
    flexShrink: 0,
  },
  viewAll: {
    fontSize: '12px',
    color: 'var(--primary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  empty: { color: 'var(--text-dim)', fontSize: '14px', textAlign: 'center', padding: '20px' },
}
