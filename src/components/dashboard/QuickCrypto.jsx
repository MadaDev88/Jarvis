import { useState, useEffect } from 'react'
import Panel from '../Panel'
import { TrendingUp } from 'lucide-react'

export default function QuickCrypto({ coins }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const ids = coins.join(',')
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=gbp&include_24hr_change=true`)
      .then(r => r.json())
      .then(json => {
        setData(coins.map(c => ({
          id: c,
          name: c.charAt(0).toUpperCase() + c.slice(1),
          price: json[c]?.gbp ?? 0,
          change: json[c]?.gbp_24h_change ?? 0,
        })))
      })
      .catch(() => {
        setData(coins.map(c => ({ id: c, name: c.charAt(0).toUpperCase() + c.slice(1), price: 0, change: 0 })))
      })
  }, [coins])

  return (
    <Panel title="Crypto" icon={TrendingUp}>
      <div style={styles.list}>
        {data.map(coin => (
          <div key={coin.id} style={styles.item}>
            <div style={styles.name}>{coin.name}</div>
            <div style={styles.price}>£{coin.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div style={{
              ...styles.change,
              color: coin.change >= 0 ? 'var(--secondary)' : 'var(--danger)',
            }}>
              {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
  },
  name: { fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)', flex: 1 },
  price: { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', marginRight: '14px' },
  change: { fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, minWidth: 60, textAlign: 'right' },
}
