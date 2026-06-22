import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Panel from '../Panel'
import { TrendingUp } from 'lucide-react'

export default function RevenueChart({ revenue, expenses }) {
  const data = revenue.map((r, i) => ({
    month: r.month,
    revenue: r.amount,
    expenses: expenses[i]?.amount || 0,
    profit: r.amount - (expenses[i]?.amount || 0),
  }))

  return (
    <Panel title="Revenue & Profit" icon={TrendingUp}>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#1e293b' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#1e293b' }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#0d1321', border: '1px solid #1e293b', borderRadius: 10, fontFamily: 'Rajdhani' }}
              labelStyle={{ color: '#64748b' }}
              formatter={(value) => [`£${value.toLocaleString()}`, '']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#00d4ff" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="profit" stroke="#00ff88" fill="url(#profGrad)" strokeWidth={2} name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
