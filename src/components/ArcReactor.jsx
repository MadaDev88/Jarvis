export default function ArcReactor({ isActive }) {
  return (
    <div className={`arc-reactor ${isActive ? 'active' : ''}`}>
      <div className="reactor-outer">
        <div className="reactor-ring ring-1"></div>
        <div className="reactor-ring ring-2"></div>
        <div className="reactor-ring ring-3"></div>
        <div className="reactor-core"></div>
      </div>

      <style>{`
        .arc-reactor {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }
        .reactor-outer {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reactor-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid var(--primary-dim);
          transition: all 0.5s;
        }
        .ring-1 {
          width: 100%;
          height: 100%;
          border-color: var(--primary-dim);
          animation: rotate 20s linear infinite;
          border-style: dashed;
        }
        .ring-2 {
          width: 75%;
          height: 75%;
          border-color: rgba(0, 212, 255, 0.2);
          animation: rotate 15s linear infinite reverse;
        }
        .ring-3 {
          width: 50%;
          height: 50%;
          border-color: rgba(0, 212, 255, 0.3);
          animation: rotate 10s linear infinite;
          border-style: dotted;
        }
        .reactor-core {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary), transparent);
          box-shadow: 0 0 20px var(--primary-glow), 0 0 40px var(--primary-dim);
          animation: pulse-glow 2s ease-in-out infinite;
          transition: all 0.5s;
        }
        .arc-reactor.active .reactor-core {
          width: 32px;
          height: 32px;
          box-shadow: 0 0 30px var(--primary), 0 0 60px var(--primary-glow), 0 0 90px var(--primary-dim);
        }
        .arc-reactor.active .ring-1 {
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-dim);
        }
        .arc-reactor.active .ring-2 {
          border-color: rgba(0, 212, 255, 0.5);
        }
        .arc-reactor.active .ring-3 {
          border-color: rgba(0, 212, 255, 0.6);
        }
      `}</style>
    </div>
  )
}
