import React, { useState } from 'react';
import { sampleDisruptionEvent } from '../data/mockData';

export const ContingencyProtocolsView: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<'recovery' | 'audit' | 'simulation'>('recovery');

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex flex-col gap-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30 font-telemetry text-[10px] uppercase font-bold">
              Recovery Matrix
            </span>
            <span className="font-telemetry text-xs text-[#b8a896]">• Active Sentinel Duty</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-[#e1e2ec] font-bold tracking-tight mt-1">
            Contingency Protocols & Counterfactual Audit
          </h1>
          <p className="font-sans text-xs text-[#b8a896] mt-0.5">
            Pre-computed decision trees for weather anomalies, air traffic strikes, and VIP delay buffers.
          </p>
        </div>

        {/* CONTINGENCY TABS */}
        <div className="flex bg-[#07090f] p-1 rounded-lg border border-[#2a2e39]/40">
          <button
            onClick={() => setSelectedProtocol('recovery')}
            className={`px-3 py-1.5 rounded-md font-sans text-xs transition-all ${
              selectedProtocol === 'recovery' ? 'bg-[#181c26] text-[#e1e2ec] font-semibold' : 'text-[#b8a896]'
            }`}
          >
            Active Recovery Tree
          </button>
          <button
            onClick={() => setSelectedProtocol('audit')}
            className={`px-3 py-1.5 rounded-md font-sans text-xs transition-all ${
              selectedProtocol === 'audit' ? 'bg-[#181c26] text-[#e1e2ec] font-semibold' : 'text-[#b8a896]'
            }`}
          >
            Historical Disruptions
          </button>
          <button
            onClick={() => setSelectedProtocol('simulation')}
            className={`px-3 py-1.5 rounded-md font-sans text-xs transition-all ${
              selectedProtocol === 'simulation' ? 'bg-[#181c26] text-[#e1e2ec] font-semibold' : 'text-[#b8a896]'
            }`}
          >
            Anomalous Stress Lab
          </button>
        </div>
      </div>

      {/* PROTOCOL DETAIL SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT ACTIVE DISRUPTION BENCH (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#2a2e39]/30 pb-3">
              <span className="font-telemetry text-xs text-[#ffc174] font-bold uppercase">
                Active Synthetic Threat Vector #004
              </span>
              <span className="px-2 py-0.5 rounded bg-[#f59e0b] text-[#3d2400] font-telemetry text-[10px] font-extrabold">
                HIGH SEVERITY
              </span>
            </div>

            <div>
              <h2 className="font-display text-lg text-[#e1e2ec] font-bold">{sampleDisruptionEvent.title}</h2>
              <p className="font-sans text-xs text-[#b8a896] mt-1">{sampleDisruptionEvent.reason}</p>
            </div>

            <div className="p-4 bg-[#07090f] border border-[#2a2e39]/40 rounded-lg flex flex-col gap-2 font-telemetry text-xs">
              <div className="text-[#7bd0ff] font-bold">// Engine Recommendation Summary</div>
              <div className="text-[#e1e2ec]">
                Apply Counterfactual Plan #1 to shift private chauffeur transit to express lane, preserving Chef Arnaud Donckele dinner at Plénitude with 0% reservation loss.
              </div>
            </div>
          </div>

          {/* SIMULATED DISRUPTION PLANS */}
          <div className="flex flex-col gap-4">
            {sampleDisruptionEvent.plans.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl shadow-md flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-telemetry text-xs text-[#ffc174] font-bold">
                    Plan #{p.rank}: {p.title}
                  </span>
                  <span className="font-telemetry text-xs text-[#7bd0ff]">{p.matchPercent}% Match</span>
                </div>
                <p className="font-sans text-xs text-[#b8a896] leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between text-xs font-telemetry text-[#b8a896] pt-2 border-t border-[#2a2e39]/30">
                  <span>Buffer: <strong className="text-[#ffc174]">{p.bufferInfo}</strong></span>
                  <span>Cost Variance: <strong className="text-white">{p.costVariance}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT HISTORICAL LOGS & MATRIX (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-xl shadow-xl flex flex-col gap-4">
            <h3 className="font-display text-base text-[#e1e2ec] font-bold">Historical Disruption Resolutions</h3>
            <div className="flex flex-col gap-3 font-telemetry text-xs">
              <div className="p-3 bg-[#181c26] border border-[#2a2e39]/40 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between text-[#ffc174]">
                  <span>Frecciarossa 9593 +45m Delay</span>
                  <span>Oct 12, 2025</span>
                </div>
                <p className="text-[#b8a896] font-sans text-xs">
                  Auto-healed: Swapped Milan Armani Hotel check-in sequence to preserve Duomo rooftop dinner.
                </p>
              </div>

              <div className="p-3 bg-[#181c26] border border-[#2a2e39]/40 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between text-[#7bd0ff]">
                  <span>Thunderstorm Alert at CDG</span>
                  <span>Sep 28, 2025</span>
                </div>
                <p className="text-[#b8a896] font-sans text-xs">
                  Auto-healed: Rerouted private car to Le Bourget VIP terminal. Zero calendar collisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
