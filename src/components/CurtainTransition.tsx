import React, { useEffect, useState } from 'react';

interface CurtainTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  targetTabName?: string;
}

export const CurtainTransition: React.FC<CurtainTransitionProps> = ({
  isActive,
  onComplete,
  targetTabName = 'Autonomous Workspace',
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'done'>('closed');

  useEffect(() => {
    if (isActive) {
      setPhase('opening');
      // Trigger opening sequence
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setPhase('closed');
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none flex overflow-hidden">
      {/* LEFT CURTAIN PANEL */}
      <div
        className={`w-1/2 h-full bg-gradient-to-r from-[#07090f] via-[#13161f] to-[#1e2330] border-r-2 border-[#f59e0b] shadow-[15px_0_40px_rgba(245,158,11,0.4)] flex flex-col justify-center items-end pr-8 transition-transform duration-1000 ease-in-out ${
          phase === 'opening' ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col items-end opacity-40">
          <span className="font-telemetry text-xs text-[#ffc174] font-bold tracking-widest uppercase">
            AVIONICS UNLOCKED
          </span>
          <span className="font-display text-2xl text-[#e1e2ec] font-bold">TRAVELPILOT</span>
        </div>
      </div>

      {/* RIGHT CURTAIN PANEL */}
      <div
        className={`w-1/2 h-full bg-gradient-to-l from-[#07090f] via-[#13161f] to-[#1e2330] border-l-2 border-[#f59e0b] shadow-[-15px_0_40px_rgba(245,158,11,0.4)] flex flex-col justify-center items-start pl-8 transition-transform duration-1000 ease-in-out ${
          phase === 'opening' ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col items-start opacity-40">
          <span className="font-telemetry text-xs text-[#10b981] font-bold tracking-widest uppercase">
            ORCHESTRATION SUITE
          </span>
          <span className="font-display text-2xl text-[#e1e2ec] font-bold">{targetTabName}</span>
        </div>
      </div>

      {/* CENTER GOLDEN SPARKLE RADIANCE FLARE */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          phase === 'opening' ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
        }`}
      >
        <div className="w-40 h-40 rounded-full bg-[#f59e0b]/20 border-2 border-[#f59e0b] flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.8)] backdrop-blur-md">
          <span className="material-symbols-outlined text-5xl text-[#ffc174] animate-spin">
            auto_awesome
          </span>
        </div>
      </div>
    </div>
  );
};
