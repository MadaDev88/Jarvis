export default function ScanLine() {
  return (
    <>
      <div className="scan-line"></div>
      <style>{`
        .scan-line {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary-dim), transparent);
          animation: scan-line 8s linear infinite;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.3;
        }
      `}</style>
    </>
  )
}
