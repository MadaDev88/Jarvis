export default function Panel({ title, icon: Icon, children, action, style = {} }) {
  return (
    <div style={{ ...styles.panel, ...style }}>
      {(title || action) && (
        <div style={styles.header}>
          <div style={styles.titleRow}>
            {Icon && <Icon size={16} style={{ color: 'var(--primary)' }} />}
            {title && <h3 style={styles.title}>{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

const styles = {
  panel: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px',
    animation: 'fadeIn 0.4s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-bright)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
}
