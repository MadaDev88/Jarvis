export default function CalendarWidget() {
  const events = [
    { title: "Everly's Birthday", date: '7 May', icon: '🎂', type: 'family' },
    { title: "Adam's Birthday", date: '8 May', icon: '🎉', type: 'family' },
    { title: "Wife's Birthday", date: '9 May', icon: '💕', type: 'family' },
    { title: 'Arches Weekly Review', date: 'Every Monday', icon: '📊', type: 'business' },
    { title: 'AI Hardware R&D', date: 'Ongoing', icon: '🔧', type: 'project' },
    { title: "Casey's Milestone Check", date: 'Monthly', icon: '👶', type: 'family' },
  ]

  return (
    <div className="panel calendar-widget">
      <div className="panel-header">
        <span className="panel-label">CALENDAR</span>
        <span className="panel-location">UPCOMING</span>
      </div>
      <div className="event-list">
        {events.map((event, i) => (
          <div key={i} className={`event-item event-${event.type}`}>
            <span className="event-icon">{event.icon}</span>
            <div className="event-info">
              <span className="event-title">{event.title}</span>
              <span className="event-date">{event.date}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .event-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .event-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: var(--bg-card);
          border-radius: 8px;
          border-left: 3px solid var(--border);
        }
        .event-family { border-left-color: var(--accent); }
        .event-business { border-left-color: var(--primary); }
        .event-project { border-left-color: var(--secondary); }
        .event-icon { font-size: 18px; }
        .event-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .event-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }
        .event-date {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  )
}
