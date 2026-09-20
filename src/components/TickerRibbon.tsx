import React from 'react';

export const TickerRibbon: React.FC = () => {
  return (
    <section className="w-full bg-[#07090f]/90 backdrop-blur-md border-b border-[#2a2e39]/40 overflow-hidden py-2.5 shadow-sm select-none">
      <div className="animate-marquee-smooth text-[#b8a896]">
        <span className="font-telemetry text-xs flex items-center gap-2 text-[#ffc174] font-medium px-4">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
          LIVE FLIGHT TELEMETRY: AIRSPACE JFK/CDG MONITORED
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#7bd0ff] font-medium px-4">
          DAG RECALCULATION LATENCY: 14MS
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#e1e2ec] font-medium px-4">
          WEATHER ANOMALIES: 0 DETECTED IN FLORENCE / PARIS / MILAN
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#ffc258] font-medium px-4">
          SOLVER: TW-VRP K-MEANS OPTIMAL ROUTING READY
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#ffc174] font-medium px-4">
          SLACK BUFFER TOLERANCE: 45 MIN ACTIVE
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>

        {/* Repeated for seamless duplication */}
        <span className="font-telemetry text-xs flex items-center gap-2 text-[#ffc174] font-medium px-4">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
          LIVE FLIGHT TELEMETRY: AIRSPACE JFK/CDG MONITORED
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#7bd0ff] font-medium px-4">
          DAG RECALCULATION LATENCY: 14MS
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#e1e2ec] font-medium px-4">
          WEATHER ANOMALIES: 0 DETECTED IN FLORENCE / PARIS / MILAN
        </span>
        <span className="text-[#413b34] font-telemetry text-xs">/</span>
        <span className="font-telemetry text-xs text-[#ffc258] font-medium px-4">
          SOLVER: TW-VRP K-MEANS OPTIMAL ROUTING READY
        </span>
      </div>
    </section>
  );
};
