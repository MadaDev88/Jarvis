import { useState, useEffect } from 'react'
import Header from './components/Header'
import ArcReactor from './components/ArcReactor'
import VoiceInterface from './components/VoiceInterface'
import CommandInput from './components/CommandInput'
import WeatherWidget from './components/WeatherWidget'
import CryptoWidget from './components/CryptoWidget'
import NewsWidget from './components/NewsWidget'
import CalendarWidget from './components/CalendarWidget'
import SystemStatus from './components/SystemStatus'
import QuickActions from './components/QuickActions'
import AvatarPanel from './components/AvatarPanel'
import ConversationLog from './components/ConversationLog'
import SettingsPanel from './components/SettingsPanel'
import ScanLine from './components/ScanLine'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('jarvis-settings')
    return saved ? JSON.parse(saved) : {
      elevenLabsKey: '',
      elevenLabsVoiceId: '',
      higgsFieldKey: '',
      weatherApiKey: '',
      weatherCity: 'Sunderland',
      cryptoCoins: ['bitcoin', 'ethereum', 'solana'],
      userName: 'Adam',
    }
  })

  useEffect(() => {
    localStorage.setItem('jarvis-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    addMessage('jarvis', 'Systems online. Good ' + getGreeting() + ', ' + settings.userName + '. All modules initialised. How may I assist you today?')
  }, [])

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  function addMessage(sender, text) {
    setMessages(prev => [...prev, { sender, text, time: new Date() }])
  }

  async function handleCommand(text) {
    addMessage('user', text)

    const lower = text.toLowerCase()

    if (lower.includes('time')) {
      const now = new Date()
      respond(`The current time is ${now.toLocaleTimeString('en-GB')} on ${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`)
    } else if (lower.includes('weather')) {
      respond('Fetching weather data for ' + settings.weatherCity + '. Check the weather panel for live updates.')
    } else if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum')) {
      respond('Crypto markets are displayed in the portfolio panel. I can provide detailed analysis on any specific asset.')
    } else if (lower.includes('restaurant') || lower.includes('arches')) {
      respond('Arches Restaurant systems are standing by. I can help with reservations, inventory, staff scheduling, or financial reporting.')
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      respond(`Hello ${settings.userName}. All systems are operational. What would you like to work on?`)
    } else if (lower.includes('status') || lower.includes('system')) {
      respond('All core systems are online. Voice synthesis: active. Avatar engine: standby. Data feeds: connected. Security: nominal.')
    } else if (lower.includes('family') || lower.includes('everly') || lower.includes('casey')) {
      respond('Family module active. Everly is 4 years old — her creative arts programme is on track. Casey is 5 months — developmental milestones are being monitored.')
    } else if (lower.includes('goal') || lower.includes('plan')) {
      respond('Your primary objective: build a billion-pound AI company. Current focus: generate cash flow through Arches, develop hardware product prototypes, and prepare seed funding materials.')
    } else {
      respond(`Processing: "${text}". I've logged your request. Connect an AI backend to enable full natural language processing.`)
    }
  }

  async function respond(text) {
    addMessage('jarvis', text)
    if (settings.elevenLabsKey && settings.elevenLabsVoiceId) {
      await speakWithElevenLabs(text)
    }
  }

  async function speakWithElevenLabs(text) {
    setIsSpeaking(true)
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${settings.elevenLabsVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': settings.elevenLabsKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(url)
        }
        await audio.play()
      } else {
        setIsSpeaking(false)
      }
    } catch {
      setIsSpeaking(false)
    }
  }

  return (
    <div className="jarvis-app">
      <ScanLine />
      <Header onSettingsClick={() => setShowSettings(true)} />

      <div className="dashboard-grid">
        <div className="left-column">
          <WeatherWidget settings={settings} />
          <CryptoWidget settings={settings} />
          <CalendarWidget />
        </div>

        <div className="center-column">
          <ArcReactor isActive={isListening || isSpeaking} />
          <AvatarPanel settings={settings} isSpeaking={isSpeaking} />
          <ConversationLog messages={messages} />
          <div className="input-area">
            <VoiceInterface
              isListening={isListening}
              setIsListening={setIsListening}
              onResult={handleCommand}
            />
            <CommandInput onSubmit={handleCommand} />
          </div>
        </div>

        <div className="right-column">
          <SystemStatus />
          <QuickActions onAction={handleCommand} />
          <NewsWidget />
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
