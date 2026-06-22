import { useState } from 'react'
import Panel from '../components/Panel'
import {
  UtensilsCrossed, Users, Package, Plus,
  Check, Clock, AlertTriangle, Phone
} from 'lucide-react'

const tabs = ['Reservations', 'Staff', 'Inventory']

export default function RestaurantPage({ store }) {
  const [activeTab, setActiveTab] = useState('Reservations')
  const [showAddRes, setShowAddRes] = useState(false)
  const [newRes, setNewRes] = useState({ name: '', guests: 2, time: '19:00', date: '', notes: '' })

  function handleAddReservation(e) {
    e.preventDefault()
    store.addReservation({ ...newRes, status: 'pending' })
    setNewRes({ name: '', guests: 2, time: '19:00', date: '', notes: '' })
    setShowAddRes(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Arches Restaurant</h2>
          <p style={styles.subtitle}>2 St Bedes, East Boldon, Tyne & Wear, NE36 0LE</p>
        </div>
        <div style={styles.liveIndicator}>
          <div style={styles.liveDot} />
          LIVE
        </div>
      </div>

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Reservations' && (
        <Panel
          title="Reservations"
          icon={UtensilsCrossed}
          action={
            <button style={styles.addBtn} onClick={() => setShowAddRes(!showAddRes)}>
              <Plus size={14} /> New Booking
            </button>
          }
        >
          {showAddRes && (
            <form onSubmit={handleAddReservation} style={styles.form}>
              <input style={styles.input} placeholder="Guest name" required value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} />
              <input style={styles.input} type="number" min="1" max="20" value={newRes.guests} onChange={e => setNewRes({ ...newRes, guests: parseInt(e.target.value) })} />
              <input style={styles.input} type="date" required value={newRes.date} onChange={e => setNewRes({ ...newRes, date: e.target.value })} />
              <input style={styles.input} type="time" value={newRes.time} onChange={e => setNewRes({ ...newRes, time: e.target.value })} />
              <input style={styles.input} placeholder="Notes (optional)" value={newRes.notes} onChange={e => setNewRes({ ...newRes, notes: e.target.value })} />
              <button type="submit" style={styles.submitBtn}>Add Booking</button>
            </form>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Guests</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.restaurant.reservations
                .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                .map(r => (
                <tr key={r.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{r.time}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: 'var(--text-bright)' }}>{r.name}</td>
                  <td style={styles.td}>{r.guests}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{r.date}</td>
                  <td style={{ ...styles.td, fontSize: '12px', color: 'var(--text-dim)' }}>{r.notes || '—'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      color: r.status === 'confirmed' ? 'var(--secondary)' : 'var(--warning)',
                      background: r.status === 'confirmed' ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
                    }}>
                      {r.status === 'confirmed' ? <Check size={12} /> : <Clock size={12} />}
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {r.status === 'pending' && (
                      <button
                        style={styles.confirmBtn}
                        onClick={() => store.updateReservation(r.id, { status: 'confirmed' })}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {activeTab === 'Staff' && (
        <Panel title="Staff Roster" icon={Users}>
          <div style={styles.staffGrid}>
            {store.restaurant.staff.map(s => (
              <div key={s.id} style={styles.staffCard}>
                <div style={styles.staffAvatar}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles.staffInfo}>
                  <div style={styles.staffName}>{s.name}</div>
                  <div style={styles.staffRole}>{s.role}</div>
                  <div style={styles.staffPhone}><Phone size={11} /> {s.phone}</div>
                </div>
                <div style={{
                  ...styles.staffStatus,
                  color: s.status === 'on-shift' ? 'var(--secondary)' : 'var(--text-dim)',
                  background: s.status === 'on-shift' ? 'rgba(0,255,136,0.1)' : 'rgba(100,116,139,0.1)',
                }}>
                  {s.status === 'on-shift' ? 'On Shift' : 'Off Shift'}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === 'Inventory' && (
        <Panel title="Inventory" icon={Package}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Min</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {store.restaurant.inventory.map(item => (
                <tr key={item.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 600, color: 'var(--text-bright)' }}>{item.item}</td>
                  <td style={{ ...styles.td, fontSize: '12px' }}>{item.category}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>{item.quantity} {item.unit}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{item.minStock} {item.unit}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      color: item.status === 'good' ? 'var(--secondary)' : item.status === 'low' ? 'var(--warning)' : 'var(--danger)',
                      background: item.status === 'good' ? 'rgba(0,255,136,0.1)' : item.status === 'low' ? 'rgba(255,170,0,0.1)' : 'rgba(255,51,102,0.1)',
                    }}>
                      {item.status === 'critical' && <AlertTriangle size={12} />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  )
}

const styles = {
  page: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-bright)', letterSpacing: '1px' },
  subtitle: { fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' },
  liveIndicator: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--secondary)',
    padding: '6px 14px', borderRadius: '8px',
    background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
  },
  liveDot: {
    width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)',
    boxShadow: '0 0 8px var(--secondary)', animation: 'pulse-glow 2s infinite',
  },
  tabs: { display: 'flex', gap: '8px' },
  tab: {
    padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text-dim)', cursor: 'pointer',
    fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
  },
  tabActive: { color: 'var(--primary)', background: 'var(--primary-dim)', borderColor: 'var(--border-glow)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' },
  th: {
    textAlign: 'left', padding: '8px 14px', fontSize: '11px', color: 'var(--text-dim)',
    fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500,
  },
  tr: { background: 'var(--bg-panel)', borderRadius: '8px' },
  td: { padding: '12px 14px', fontSize: '14px', color: 'var(--text)' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 10px', borderRadius: '6px', fontSize: '12px',
    fontWeight: 600, textTransform: 'capitalize',
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
    borderRadius: '8px', border: '1px solid var(--border-glow)',
    background: 'var(--primary-dim)', color: 'var(--primary)',
    cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)',
  },
  confirmBtn: {
    padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(0,255,136,0.3)',
    background: 'rgba(0,255,136,0.1)', color: 'var(--secondary)',
    cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-body)',
  },
  form: {
    display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '16px',
    background: 'var(--bg-panel)', borderRadius: '10px', marginBottom: '16px',
    border: '1px solid var(--border)',
  },
  input: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-dark)', color: 'var(--text)', fontSize: '14px',
    fontFamily: 'var(--font-body)', outline: 'none', flex: '1 1 150px',
  },
  submitBtn: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    background: 'var(--primary)', color: 'var(--bg-dark)',
    cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)',
  },
  staffGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px',
  },
  staffCard: {
    display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
    borderRadius: '10px', background: 'var(--bg-panel)', border: '1px solid var(--border)',
  },
  staffAvatar: {
    width: 42, height: 42, borderRadius: '10px', background: 'var(--primary-dim)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--primary)',
    fontWeight: 700, flexShrink: 0,
  },
  staffInfo: { flex: 1 },
  staffName: { fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)' },
  staffRole: { fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' },
  staffPhone: { fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' },
  staffStatus: {
    fontSize: '11px', fontWeight: 600, padding: '4px 10px',
    borderRadius: '6px', flexShrink: 0,
  },
}
