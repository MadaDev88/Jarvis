"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "green" | "amber" | "purple" | "blue" | "cyan" | "red";
  className?: string;
}

const variants: Record<string, string> = {
  default: "bg-white/10 text-white/80",
  green: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
  purple: "bg-purple-500/20 text-purple-400",
  blue: "bg-blue-500/20 text-blue-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  red: "bg-red-500/20 text-red-400",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
