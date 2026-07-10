"use client";

interface CredibilityMeterProps {
  score: number;
}

export default function CredibilityMeter({ score }: CredibilityMeterProps) {
  const color =
    score >= 85
      ? "bg-emerald-500"
      : score >= 70
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-mono text-white/70">{score}</span>
    </div>
  );
}
