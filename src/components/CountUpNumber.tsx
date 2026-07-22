import React, { useEffect, useState, useRef } from "react";

interface CountUpNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (val: number) => string;
}

export default function CountUpNumber({
  value,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  formatter
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = displayValue;
    const targetVal = value;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Exponential ease-out curve for smooth deceleration
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (targetVal - startVal) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetVal);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  const formatted = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
