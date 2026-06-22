import { useState, useEffect } from 'react'
import { Bell, Search, User } from 'lucide-react'

export default function TopBar({ pageTitle }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header style={styles.topBar}>
      <div>
        <h1 style={styles.title}>{pageTitle}</h1>
        <div style={styles.date}>
          {time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}
          {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
      <div style={styles.right}>
        <button style={styles.iconBtn} title="Search">
          <Search size={18} />
        </button>
        <button style={styles.iconBtn} title="Notifications">
          <Bell size={18} />
          <span style={styles.badge}>3</span>
        </button>
        <div style={styles.avatar}>
          <User size={18} />
        </div>
      </div>
    </header>
  )
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-bright)',
    letterSpacing: '1px',
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-dim)',
    marginTop: '2px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBtn: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'var(--danger)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '10px',
    background: 'var(--primary-dim)',
    border: '1px solid var(--border-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
  },
}
