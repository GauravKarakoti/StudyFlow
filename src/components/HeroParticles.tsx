import { memo } from "react";

// Generate particles statically outside the component
// This ensures they are created exactly once when the module loads
// and NEVER regenerate, regardless of re-renders or parent updates.
const particles = [...Array(30)].map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${2 + Math.random() * 4}s`,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.5 + 0.3,
}));

const HeroParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-primary/40 rounded-full animate-twinkle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

export default memo(HeroParticles);
