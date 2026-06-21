import { useEffect, useRef } from 'react'

export default function ConversationLog({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="panel conversation-log">
      <div className="panel-header">
        <span className="panel-label">COMMS LOG</span>
        <span className="panel-location">{messages.length} ENTRIES</span>
      </div>
      <div className="log-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`log-entry ${msg.sender}`}>
            <div className="log-meta">
              <span className="log-sender">{msg.sender === 'jarvis' ? 'JARVIS' : 'ADAM'}</span>
              <span className="log-time">{msg.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <p className="log-text">{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <style>{`
        .conversation-log {
          width: 100%;
          max-width: 700px;
          max-height: 300px;
          display: flex;
          flex-direction: column;
        }
        .log-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 240px;
        }
        .log-entry {
          padding: 10px 12px;
          border-radius: 8px;
          animation: fadeIn 0.3s ease;
        }
        .log-entry.jarvis {
          background: rgba(0, 212, 255, 0.05);
          border-left: 3px solid var(--primary);
        }
        .log-entry.user {
          background: rgba(0, 255, 136, 0.05);
          border-left: 3px solid var(--secondary);
        }
        .log-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .log-sender {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
        }
        .log-entry.jarvis .log-sender { color: var(--primary); }
        .log-entry.user .log-sender { color: var(--secondary); }
        .log-time {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
        }
        .log-text {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text);
        }
      `}</style>
    </div>
  )
}
