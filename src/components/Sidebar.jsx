import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, TrendingUp, ListTodo,
  MessageSquare, Settings, Target, Zap
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/restaurant', icon: UtensilsCrossed, label: 'Restaurant' },
  { to: '/finance', icon: TrendingUp, label: 'Finance' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks & Goals' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Zap size={24} color="var(--primary)" />
        </div>
        <div>
          <div style={styles.logoText}>J.A.R.V.I.S.</div>
          <div style={styles.logoSub}>Business Intelligence</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.statusBox}>
        <div style={styles.statusDot} />
        <div>
          <div style={styles.statusLabel}>All Systems Online</div>
          <div style={styles.statusSub}>6 modules active</div>
        </div>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    zIndex: 100,
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    padding: '0 8px',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: '12px',
    background: 'var(--primary-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-glow)',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--primary)',
    letterSpacing: '2px',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    color: 'var(--text-dim)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  navItemActive: {
    color: 'var(--primary)',
    background: 'var(--primary-dim)',
    borderColor: 'var(--border-glow)',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.15)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--secondary)',
    boxShadow: '0 0 8px var(--secondary)',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--secondary)',
  },
  statusSub: {
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
}
