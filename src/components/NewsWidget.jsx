import { useState, useEffect } from 'react'

export default function NewsWidget() {
  const [news] = useState([
    { title: 'AI Hardware Market Expected to Reach $200B by 2030', source: 'TechCrunch', time: '2h ago', category: 'AI' },
    { title: 'UK Government Announces New AI Funding Initiative', source: 'BBC', time: '4h ago', category: 'UK' },
    { title: 'Bitcoin Surges Past New Resistance Level', source: 'CoinDesk', time: '5h ago', category: 'Crypto' },
    { title: 'Restaurant Industry Embraces AI Automation', source: 'Forbes', time: '8h ago', category: 'Business' },
    { title: 'Smart Home Technology Trends for 2026', source: 'Wired', time: '12h ago', category: 'Tech' },
  ])

  const categoryColors = {
    AI: 'var(--primary)',
    UK: 'var(--accent)',
    Crypto: 'var(--warning)',
    Business: 'var(--secondary)',
    Tech: '#a78bfa',
  }

  return (
    <div className="panel news-widget">
      <div className="panel-header">
        <span className="panel-label">NEWS FEED</span>
        <span className="panel-location">CURATED</span>
      </div>
      <div className="news-list">
        {news.map((item, i) => (
          <div key={i} className="news-item">
            <div className="news-category" style={{ color: categoryColors[item.category] }}>
              {item.category}
            </div>
            <div className="news-title">{item.title}</div>
            <div className="news-meta">
              <span>{item.source}</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .news-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .news-item {
          padding: 10px;
          background: var(--bg-card);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .news-item:hover {
          border-color: var(--border-glow);
          transform: translateX(4px);
        }
        .news-category {
          font-family: var(--font-display);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .news-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          line-height: 1.3;
          margin-bottom: 6px;
        }
        .news-meta {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  )
}
