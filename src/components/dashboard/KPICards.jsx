import { TrendingUp, Users, PoundSterling, UtensilsCrossed } from 'lucide-react'

export default function KPICards({ finance, restaurant }) {
  const cards = [
    {
      label: "Today's Revenue",
      value: `£${finance.todayRevenue.toLocaleString()}`,
      change: '+12.5%',
      positive: true,
      icon: PoundSterling,
      color: 'var(--secondary)',
    },
    {
      label: 'Covers Today',
      value: finance.todayCovers,
      change: '+8 vs avg',
      positive: true,
      icon: Users,
      color: 'var(--primary)',
    },
    {
      label: 'Avg Spend / Head',
      value: `£${finance.avgSpendPerHead.toFixed(2)}`,
      change: '+£3.20',
      positive: true,
      icon: TrendingUp,
      color: 'var(--accent)',
    },
    {
      label: 'Active Reservations',
      value: restaurant.reservations.filter(r => r.status === 'confirmed').length,
      change: `${restaurant.reservations.filter(r => r.status === 'pending').length} pending`,
      positive: null,
      icon: UtensilsCrossed,
      color: 'var(--warning)',
    },
  ]

  return (
    <div style={styles.grid}>
      {cards.map((card, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.cardTop}>
            <div>
              <div style={styles.label}>{card.label}</div>
              <div style={styles.value}>{card.value}</div>
            </div>
            <div style={{ ...styles.iconBox, background: card.color + '15', borderColor: card.color + '30' }}>
              <card.icon size={20} style={{ color: card.color }} />
            </div>
          </div>
          <div style={{
            ...styles.change,
            color: card.positive === null ? 'var(--text-dim)' : card.positive ? 'var(--secondary)' : 'var(--danger)',
          }}>
            {card.change}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px',
    animation: 'fadeIn 0.4s ease-out',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-dim)',
    marginBottom: '6px',
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-bright)',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
  },
  change: {
    marginTop: '10px',
    fontSize: '12px',
    fontWeight: 600,
  },
}
