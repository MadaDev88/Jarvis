import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Bot, User, Zap } from 'lucide-react'

export default function AssistantPage({ store }) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const logRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (store.messages.length === 0) {
      const hour = new Date().getHours()
      const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
      store.addMessage('jarvis', `Systems online. Good ${greeting}, ${store.settings.userName}. All modules initialised. How may I assist you today?`)
    }
  }, [])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [store.messages])

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    processCommand(input.trim())
    setInput('')
  }

  function processCommand(text) {
    store.addMessage('user', text)
    const lower = text.toLowerCase()

    if (lower.includes('time')) {
      const now = new Date()
      respond(`The current time is ${now.toLocaleTimeString('en-GB')} on ${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`)
    } else if (lower.includes('weather')) {
      respond(`Fetching weather data for ${store.settings.weatherCity}. Check the weather panel for live updates.`)
    } else if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum')) {
      respond('Crypto markets are displayed in the Finance module. I can provide detailed analysis on any specific asset.')
    } else if (lower.includes('restaurant') || lower.includes('arches')) {
      const confirmed = store.restaurant.reservations.filter(r => r.status === 'confirmed').length
      const pending = store.restaurant.reservations.filter(r => r.status === 'pending').length
      const onShift = store.restaurant.staff.filter(s => s.status === 'on-shift').length
      const critical = store.restaurant.inventory.filter(i => i.status === 'critical').length
      respond(`Arches Restaurant status: ${confirmed} confirmed reservations, ${pending} pending. ${onShift} staff on shift. ${critical > 0 ? `WARNING: ${critical} inventory items critically low.` : 'Inventory levels nominal.'}`)
    } else if (lower.includes('task') || lower.includes('todo')) {
      const active = store.tasks.filter(t => t.status !== 'completed')
      const high = active.filter(t => t.priority === 'high')
      respond(`You have ${active.length} active tasks, ${high.length} of which are high priority. Top priority: "${high[0]?.title || 'None'}". Navigate to Tasks & Goals for full management.`)
    } else if (lower.includes('goal') || lower.includes('plan')) {
      respond(`Your primary objective: build a billion-pound AI company. Current focus: generate cash flow through Arches, develop hardware product prototypes, and prepare seed funding materials. Check the Goals section for milestone tracking.`)
    } else if (lower.includes('finance') || lower.includes('revenue') || lower.includes('profit')) {
      const totalRev = store.finance.revenue.reduce((a, b) => a + b.amount, 0)
      const totalExp = store.finance.expenses.reduce((a, b) => a + b.amount, 0)
      respond(`YTD Revenue: £${(totalRev/1000).toFixed(0)}k. YTD Profit: £${((totalRev-totalExp)/1000).toFixed(0)}k. Today's take: £${store.finance.todayRevenue.toLocaleString()} from ${store.finance.todayCovers} covers.`)
    } else if (lower.includes('staff') || lower.includes('team')) {
      const onShift = store.restaurant.staff.filter(s => s.status === 'on-shift')
      respond(`Currently ${onShift.length} staff on shift: ${onShift.map(s => `${s.name} (${s.role})`).join(', ')}.`)
    } else if (lower.includes('inventory') || lower.includes('stock')) {
      const issues = store.restaurant.inventory.filter(i => i.status !== 'good')
      if (issues.length === 0) {
        respond('All inventory levels are nominal. No restocking required.')
      } else {
        respond(`Inventory alerts: ${issues.map(i => `${i.item} (${i.status} - ${i.quantity} ${i.unit})`).join(', ')}. Recommend placing orders for critical items immediately.`)
      }
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      respond(`Hello ${store.settings.userName}. All systems are operational. What would you like to work on?`)
    } else if (lower.includes('family') || lower.includes('everly') || lower.includes('casey')) {
      respond('Family module active. Everly is 4 years old — her creative arts programme is on track. Casey is 5 months — developmental milestones are being monitored.')
    } else if (lower.includes('status') || lower.includes('system')) {
      respond('All core systems online. Dashboard: active. Restaurant module: connected. Finance tracking: live. Task management: synced. Voice interface: ready.')
    } else if (lower.includes('help')) {
      respond('I can help with: restaurant management (reservations, staff, inventory), financial overview, task tracking, crypto prices, weather, goal planning, and more. Try asking about any of these topics.')
    } else {
      respond(`Processing: "${text}". I've logged your request. Connect an AI backend (like Claude API) to enable full natural language processing and autonomous task execution.`)
    }
  }

  function respond(text) {
    setTimeout(() => store.addMessage('jarvis', text), 300)
  }

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-GB'
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      processCommand(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderLeft}>
            <div style={styles.botIcon}><Bot size={20} /></div>
            <div>
              <div style={styles.chatTitle}>J.A.R.V.I.S. Assistant</div>
              <div style={styles.chatSub}>Business Intelligence AI</div>
            </div>
          </div>
          <div style={styles.onlineBadge}>
            <div style={styles.onlineDot} />
            Online
          </div>
        </div>

        <div ref={logRef} style={styles.messages}>
          {store.messages.map((msg, i) => (
            <div key={i} style={{
              ...styles.msgRow,
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {msg.sender === 'jarvis' && (
                <div style={styles.msgAvatar}><Zap size={14} /></div>
              )}
              <div style={{
                ...styles.msgBubble,
                background: msg.sender === 'user' ? 'var(--primary-dim)' : 'var(--bg-panel)',
                borderColor: msg.sender === 'user' ? 'var(--border-glow)' : 'var(--border)',
              }}>
                <div style={styles.msgText}>{msg.text}</div>
                <div style={styles.msgTime}>
                  {new Date(msg.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div style={{ ...styles.msgAvatar, background: 'rgba(0,255,136,0.1)', borderColor: 'rgba(0,255,136,0.2)' }}>
                  <User size={14} color="var(--secondary)" />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.inputRow}>
          <button
            type="button"
            onClick={toggleListening}
            style={{
              ...styles.micBtn,
              background: isListening ? 'rgba(255,51,102,0.2)' : 'var(--bg-panel)',
              borderColor: isListening ? 'var(--danger)' : 'var(--border)',
              color: isListening ? 'var(--danger)' : 'var(--text-dim)',
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            style={styles.chatInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Jarvis anything..."
          />
          <button type="submit" style={styles.sendBtn}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <div style={styles.sidebar}>
        <Panel title="Quick Commands">
          {[
            'Restaurant status',
            'Show tasks',
            'Financial summary',
            'Check inventory',
            'Staff on shift',
            'System status',
          ].map(cmd => (
            <button
              key={cmd}
              style={styles.quickCmd}
              onClick={() => processCommand(cmd)}
            >
              {cmd}
            </button>
          ))}
        </Panel>

        <Panel title="Capabilities">
          <div style={styles.capList}>
            {[
              'Restaurant management',
              'Financial tracking',
              'Task & goal management',
              'Crypto portfolio',
              'Staff scheduling',
              'Inventory monitoring',
              'Voice commands',
              'Calendar & events',
            ].map((cap, i) => (
              <div key={i} style={styles.capItem}>
                <div style={styles.capDot} />
                {cap}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div style={panelStyles.panel}>
      <div style={panelStyles.title}>{title}</div>
      {children}
    </div>
  )
}

const panelStyles = {
  panel: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '18px',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600,
    color: 'var(--text-bright)', letterSpacing: '1.5px', textTransform: 'uppercase',
    marginBottom: '14px',
  },
}

const styles = {
  page: { padding: '24px 32px', display: 'flex', gap: '20px', height: 'calc(100vh - 80px)' },
  container: {
    flex: 1, display: 'flex', flexDirection: 'column',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  botIcon: {
    width: 40, height: 40, borderRadius: '12px', background: 'var(--primary-dim)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
    border: '1px solid var(--border-glow)',
  },
  chatTitle: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', letterSpacing: '1px' },
  chatSub: { fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' },
  onlineBadge: {
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
    color: 'var(--secondary)', fontFamily: 'var(--font-mono)',
  },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 8px var(--secondary)' },
  messages: {
    flex: 1, overflow: 'auto', padding: '20px', display: 'flex',
    flexDirection: 'column', gap: '12px',
  },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  msgAvatar: {
    width: 30, height: 30, borderRadius: '8px', background: 'var(--primary-dim)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--primary)', border: '1px solid var(--border-glow)', flexShrink: 0,
  },
  msgBubble: {
    maxWidth: '70%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid', fontSize: '14px',
  },
  msgText: { color: 'var(--text)', lineHeight: 1.5 },
  msgTime: { fontSize: '10px', color: 'var(--text-dim)', marginTop: '6px', textAlign: 'right' },
  inputRow: {
    display: 'flex', gap: '10px', padding: '16px 20px',
    borderTop: '1px solid var(--border)', background: 'var(--bg-panel)',
  },
  micBtn: {
    width: 44, height: 44, borderRadius: '10px', border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
  },
  chatInput: {
    flex: 1, padding: '12px 16px', borderRadius: '10px',
    border: '1px solid var(--border)', background: 'var(--bg-dark)',
    color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: '10px', border: '1px solid var(--border-glow)',
    background: 'var(--primary-dim)', color: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
  },
  sidebar: { width: 280, display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 },
  quickCmd: {
    display: 'block', width: '100%', padding: '10px 14px', marginBottom: '6px',
    borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-panel)', color: 'var(--text)', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'var(--font-body)', textAlign: 'left',
    transition: 'all 0.2s',
  },
  capList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  capItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '13px', color: 'var(--text-dim)',
  },
  capDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--secondary)', flexShrink: 0 },
}
