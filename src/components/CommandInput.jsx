import { useState } from 'react'

export default function CommandInput({ onSubmit }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
    setValue('')
  }

  return (
    <form className="command-input" onSubmit={handleSubmit}>
      <span className="command-prompt">&gt;</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter command or ask Jarvis..."
        autoFocus
      />
      <button type="submit">SEND</button>

      <style>{`
        .command-input {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 4px 8px;
          transition: border-color 0.3s;
        }
        .command-input:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-dim);
        }
        .command-prompt {
          font-family: var(--font-mono);
          color: var(--primary);
          font-size: 18px;
          padding: 0 8px;
        }
        .command-input input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 14px;
          padding: 12px 0;
        }
        .command-input input::placeholder {
          color: var(--text-dim);
        }
        .command-input button {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          background: linear-gradient(135deg, var(--primary), #0099cc);
          border: none;
          color: var(--bg-dark);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .command-input button:hover {
          box-shadow: 0 0 20px var(--primary-dim);
          transform: scale(1.02);
        }
      `}</style>
    </form>
  )
}
