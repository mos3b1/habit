// src/components/dashboard/progress-ring.tsx

"use client";

type ProgressRingProps = {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label = "Complete",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Color based on value
  const getColor = () => {
    if (value >= 80) return "#22c55e"; // green
    if (value >= 50) return "#eab308"; // yellow
    if (value >= 25) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl text-primary font-semibold">{Math.round(value)}%</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}