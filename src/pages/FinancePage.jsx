import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import Panel from '../components/Panel'
import { PoundSterling, TrendingUp, Target, Wallet } from 'lucide-react'

const COLORS = ['#00d4ff', '#00ff88', '#ff6b35', '#ffaa00', '#ff3366']

export default function FinancePage({ store }) {
  const [crypto, setCrypto] = useState([])
  const { finance, settings } = store

  useEffect(() => {
    const ids = settings.cryptoCoins.join(',')
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=gbp&include_24hr_change=true&include_market_cap=true`)
      .then(r => r.json())
      .then(json => {
        setCrypto(settings.cryptoCoins.map(c => ({
          name: c.charAt(0).toUpperCase() + c.slice(1),
          price: json[c]?.gbp ?? 0,
          change: json[c]?.gbp_24h_change ?? 0,
          cap: json[c]?.gbp_market_cap ?? 0,
        })))
      })
      .catch(() => {})
  }, [settings.cryptoCoins])

  const profitData = finance.revenue.map((r, i) => ({
    month: r.month,
    revenue: r.amount,
    expenses: finance.expenses[i]?.amount || 0,
    profit: r.amount - (finance.expenses[i]?.amount || 0),
  }))

  const totalRev = finance.revenue.reduce((a, b) => a + b.amount, 0)
  const totalExp = finance.expenses.reduce((a, b) => a + b.amount, 0)
  const totalProfit = totalRev - totalExp
  const margin = ((totalProfit / totalRev) * 100).toFixed(1)

  const expenseBreakdown = [
    { name: 'Food & Beverage', value: 42 },
    { name: 'Staff', value: 30 },
    { name: 'Rent & Utilities', value: 15 },
    { name: 'Marketing', value: 8 },
    { name: 'Other', value: 5 },
  ]

  const monthProgress = ((finance.monthActual / finance.monthTarget) * 100).toFixed(0)

  return (
    <div style={styles.page}>
      <div style={styles.kpis}>
        {[
          { label: 'YTD Revenue', value: `£${(totalRev / 1000).toFixed(0)}k`, sub: '6 months', color: 'var(--primary)' },
          { label: 'YTD Profit', value: `£${(totalProfit / 1000).toFixed(0)}k`, sub: `${margin}% margin`, color: 'var(--secondary)' },
          { label: 'Monthly Target', value: `£${(finance.monthTarget / 1000).toFixed(0)}k`, sub: `${monthProgress}% achieved`, color: 'var(--warning)' },
          { label: "Today's Take", value: `£${finance.todayRevenue.toLocaleString()}`, sub: `${finance.todayCovers} covers`, color: 'var(--accent)' },
        ].map((kpi, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={styles.kpiLabel}>{kpi.label}</div>
            <div style={{ ...styles.kpiValue, color: kpi.color }}>{kpi.value}</div>
            <div style={styles.kpiSub}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={styles.twoCol}>
        <Panel title="Revenue vs Expenses" icon={TrendingUp}>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={profitData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#1e293b' }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#0d1321', border: '1px solid #1e293b', borderRadius: 10 }} formatter={v => `£${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#ff6b35" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Expense Breakdown" icon={PoundSterling}>
          <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1321', border: '1px solid #1e293b', borderRadius: 10 }} formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={styles.legend}>
              {expenseBreakdown.map((item, i) => (
                <div key={i} style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: COLORS[i] }} />
                  <span style={styles.legendLabel}>{item.name}</span>
                  <span style={styles.legendVal}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Monthly Target Progress" icon={Target}>
        <div style={styles.targetWrap}>
          <div style={styles.targetInfo}>
            <span>£{finance.monthActual.toLocaleString()} / £{finance.monthTarget.toLocaleString()}</span>
            <span style={{ color: parseInt(monthProgress) >= 90 ? 'var(--secondary)' : 'var(--warning)' }}>{monthProgress}%</span>
          </div>
          <div style={styles.targetBar}>
            <div style={{ ...styles.targetFill, width: `${Math.min(100, monthProgress)}%` }} />
          </div>
        </div>
      </Panel>

      <Panel title="Crypto Portfolio" icon={Wallet}>
        {crypto.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', padding: '20px', textAlign: 'center' }}>Loading market data...</div>
        ) : (
          <div style={styles.cryptoGrid}>
            {crypto.map(coin => (
              <div key={coin.name} style={styles.cryptoCard}>
                <div style={styles.cryptoName}>{coin.name}</div>
                <div style={styles.cryptoPrice}>£{coin.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{
                  fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-mono)',
                  color: coin.change >= 0 ? 'var(--secondary)' : 'var(--danger)',
                }}>
                  {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}% 24h
                </div>
                {coin.cap > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                    MCap: £{(coin.cap / 1e9).toFixed(1)}B
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

const styles = {
  page: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  kpis: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  kpiCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '20px',
  },
  kpiLabel: { fontSize: '13px', color: 'var(--text-dim)' },
  kpiValue: { fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, margin: '6px 0 4px' },
  kpiSub: { fontSize: '12px', color: 'var(--text-dim)' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  legend: { display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 140 },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  legendDot: { width: 10, height: 10, borderRadius: 3, flexShrink: 0 },
  legendLabel: { fontSize: '12px', color: 'var(--text)', flex: 1 },
  legendVal: { fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' },
  targetWrap: { padding: '8px 0' },
  targetInfo: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
    fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text)',
  },
  targetBar: { height: 12, borderRadius: 6, background: 'var(--border)' },
  targetFill: {
    height: '100%', borderRadius: 6,
    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
    transition: 'width 0.5s ease',
  },
  cryptoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' },
  cryptoCard: {
    padding: '18px', borderRadius: '12px', background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
  },
  cryptoName: { fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginBottom: '8px' },
  cryptoPrice: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '4px' },
}
