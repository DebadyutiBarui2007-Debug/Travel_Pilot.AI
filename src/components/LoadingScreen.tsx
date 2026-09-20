import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Golden Ratio Vector Space...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const statuses = [
      'Initializing Golden Ratio Vector Space (1.618033)...',
      'Calibrating Sub-15ms Geo-Temporal DAG Engine...',
      'Computing TW-VRP K-Means Spatial Clusters...',
      'Synchronizing Multi-Agent Avionics Protocols...',
      'Mission Control Ready.',
    ];

    const duration = 2700; // 2.7s total
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setStatusText('Mission Control Online');
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const statusIdx = Math.min(
          Math.floor((next / 100) * statuses.length),
          statuses.length - 1
        );
        setStatusText(statuses[statusIdx]);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#05070c] flex flex-col items-center justify-center p-6 text-[#e1e2ec] transition-opacity duration-500 selection:bg-none ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Golden Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Golden Spiral Animation Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
        {/* Outer Rotating Golden Fibonaci Rings */}
        <div className="absolute inset-0 border border-[#f59e0b]/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-[#ffc174]/20 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
        <div className="absolute inset-10 border border-[#d97706]/40 rounded-full animate-[spin_6s_linear_infinite]"></div>

        {/* Animated Golden Spiral SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48 sm:w-60 sm:h-60 transform -rotate-90 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
        >
          {/* Fibonacci Logarithmic Spiral Path */}
          <path
            d="M 100,100 A 1,1 0 0,1 101,100 A 2,2 0 0,1 103,100 A 3,3 0 0,1 106,100 A 5,5 0 0,1 111,100 A 8,8 0 0,1 119,100 A 13,13 0 0,1 132,100 A 21,21 0 0,1 153,100 A 34,34 0 0,1 187,100"
            fill="none"
            stroke="url(#goldenGradient)"
            strokeWidth="3"
            strokeDasharray="400"
            strokeDashoffset={400 - (progress / 100) * 400}
            strokeLinecap="round"
            className="transition-all duration-75"
          />

          {/* Complementary Geometric Phi Rectangles */}
          <rect x="20" y="20" width="160" height="160" fill="none" stroke="#2a2e39" strokeWidth="0.5" />
          <rect x="20" y="20" width="98.8" height="160" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.4" />
          <rect x="118.8" y="20" width="61.2" height="98.8" fill="none" stroke="#ffc174" strokeWidth="0.5" strokeOpacity="0.4" />

          <defs>
            <linearGradient id="goldenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ffc174" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Logo Core */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#13161f] border-2 border-[#f59e0b] flex items-center justify-center text-[#ffc174] shadow-[0_0_25px_rgba(245,158,11,0.6)]">
            <span className="material-symbols-outlined text-3xl animate-pulse">flight_takeoff</span>
          </div>
        </div>
      </div>

      {/* Progress & Telemetry Labels */}
      <div className="w-full max-w-md flex flex-col items-center gap-3 z-10">
        <div className="flex items-center justify-between w-full font-telemetry text-xs">
          <span className="text-[#ffc174] font-bold tracking-widest uppercase">
            TRAVELPILOT AVIONICS
          </span>
          <span className="text-[#f59e0b] font-mono font-extrabold text-sm">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-[#13161f] border border-[#2a2e39]/60 rounded-full p-0.5 overflow-hidden shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#10b981] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Dynamic Status Text */}
        <div className="flex items-center gap-2 font-telemetry text-xs text-[#b8a896] mt-1">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
          <span className="truncate">{statusText}</span>
        </div>
      </div>

      {/* Footer Phi Standard Watermark */}
      <div className="absolute bottom-6 font-telemetry text-[11px] text-[#b8a896]/60 tracking-wider">
        GOLDEN RATIO ORCHESTRATION ENGINE • $\Phi = 1.61803398875$
      </div>
    </div>
  );
};
