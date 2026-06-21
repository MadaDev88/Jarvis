export default function AvatarPanel({ settings, isSpeaking }) {
  return (
    <div className={`panel avatar-panel ${isSpeaking ? 'speaking' : ''}`}>
      <div className="panel-header">
        <span className="panel-label">AVATAR</span>
        <span className="panel-location">{isSpeaking ? 'SPEAKING' : 'STANDBY'}</span>
      </div>
      <div className="avatar-container">
        <div className="avatar-placeholder">
          <div className="avatar-rings">
            <div className="avatar-ring a-ring-1"></div>
            <div className="avatar-ring a-ring-2"></div>
          </div>
          <div className="avatar-face">
            <div className="avatar-eye left"></div>
            <div className="avatar-eye right"></div>
            <div className={`avatar-mouth ${isSpeaking ? 'talking' : ''}`}></div>
          </div>
        </div>
        <div className="avatar-label">
          {settings.higgsFieldKey
            ? 'Higgsfield Avatar Active'
            : 'Add Higgsfield API key in settings to enable AI avatar'}
        </div>
      </div>

      <style>{`
        .avatar-panel {
          width: 100%;
          max-width: 700px;
        }
        .avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
        }
        .avatar-placeholder {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-rings {
          position: absolute;
          inset: 0;
        }
        .avatar-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid var(--primary-dim);
        }
        .a-ring-1 {
          animation: rotate 8s linear infinite;
          border-style: dashed;
        }
        .a-ring-2 {
          inset: 10px;
          animation: rotate 6s linear infinite reverse;
          border-color: rgba(0, 212, 255, 0.15);
        }
        .speaking .a-ring-1 {
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-dim);
        }
        .avatar-face {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .avatar-eye {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
          transition: all 0.3s;
        }
        .speaking .avatar-eye {
          box-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary-glow);
        }
        .avatar-mouth {
          width: 30px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
          transition: all 0.15s;
          position: absolute;
          bottom: 15px;
        }
        .avatar-mouth.talking {
          animation: talk 0.3s ease-in-out infinite alternate;
        }
        @keyframes talk {
          0% { height: 3px; width: 30px; border-radius: 2px; }
          100% { height: 12px; width: 20px; border-radius: 50%; }
        }
        .avatar-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
