"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  as: Component = "div",
  delay = 0,
  durationMs = 600,
  yOffsetPx = 16,
  className = "",
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const baseClasses =
    "transition-all will-change-transform opacity-0 translate-y-4";
  const visibleClasses = "opacity-100 translate-y-0";

  return (
    <Component
      ref={containerRef}
      className={`${baseClasses} ${isVisible ? visibleClasses : ""} ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        transform: isVisible ? undefined : `translateY(${yOffsetPx}px)`,
      }}
    >
      {children}
    </Component>
  );
}

