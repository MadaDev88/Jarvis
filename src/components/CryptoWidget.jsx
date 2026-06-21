import { useState, useEffect } from 'react'

export default function CryptoWidget({ settings }) {
  const [prices, setPrices] = useState([])

  useEffect(() => {
    const coins = settings.cryptoCoins || ['bitcoin', 'ethereum', 'solana']

    async function fetchPrices() {
      try {
        const ids = coins.join(',')
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=gbp&include_24hr_change=true`)
        const data = await res.json()
        const result = coins.map(id => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          symbol: { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', cardano: 'ADA', ripple: 'XRP' }[id] || id.toUpperCase(),
          price: data[id]?.gbp || 0,
          change: data[id]?.gbp_24h_change || 0,
        }))
        setPrices(result)
      } catch {
        setPrices(coins.map(id => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          symbol: { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL' }[id] || id.toUpperCase(),
          price: 0,
          change: 0,
        })))
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [settings.cryptoCoins])

  function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="panel crypto-widget">
      <div className="panel-header">
        <span className="panel-label">PORTFOLIO</span>
        <span className="panel-location">LIVE</span>
      </div>
      <div className="crypto-list">
        {prices.map(coin => (
          <div key={coin.id} className="crypto-item">
            <div className="crypto-name">
              <span className="crypto-symbol">{coin.symbol}</span>
              <span className="crypto-fullname">{coin.name}</span>
            </div>
            <div className="crypto-price-info">
              <span className="crypto-price">{coin.price > 0 ? formatPrice(coin.price) : '---'}</span>
              <span className={`crypto-change ${coin.change >= 0 ? 'positive' : 'negative'}`}>
                {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .crypto-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .crypto-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: var(--bg-card);
          border-radius: 8px;
          border: 1px solid transparent;
          transition: border-color 0.3s;
        }
        .crypto-item:hover {
          border-color: var(--border-glow);
        }
        .crypto-name {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .crypto-symbol {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-bright);
        }
        .crypto-fullname {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
        }
        .crypto-price-info {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .crypto-price {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .crypto-change {
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .crypto-change.positive { color: var(--secondary); }
        .crypto-change.negative { color: var(--danger); }
      `}</style>
    </div>
  )
}
