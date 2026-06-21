import { useRef, useCallback } from 'react'

export default function VoiceInterface({ isListening, setIsListening, onResult }) {
  const recognitionRef = useRef(null)

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-GB'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening, onResult, setIsListening])

  return (
    <button
      className={`voice-btn ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
      title={isListening ? 'Stop listening' : 'Speak to Jarvis'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
      {isListening && <span className="voice-pulse"></span>}

      <style>{`
        .voice-btn {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--bg-card);
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .voice-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .voice-btn.listening {
          border-color: var(--danger);
          color: var(--danger);
          box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
        }
        .voice-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid var(--danger);
          animation: pulse-glow 1s ease-in-out infinite;
        }
      `}</style>
    </button>
  )
}
