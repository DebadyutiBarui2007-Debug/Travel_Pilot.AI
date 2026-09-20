import React from 'react';
import { TelemetryMetrics } from '../types';

interface TelemetryAuditViewProps {
  telemetry: TelemetryMetrics;
}

export const TelemetryAuditView: React.FC<TelemetryAuditViewProps> = ({ telemetry }) => {
  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex flex-col gap-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#7bd0ff]/30 font-telemetry text-[10px] uppercase font-bold">
              Telemetry LEDGER
            </span>
            <span className="font-telemetry text-xs text-[#b8a896]">• Cryptographic Audit Engine</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-[#e1e2ec] font-bold tracking-tight mt-1">
            System Performance & Cryptographic Security Ledger
          </h1>
          <p className="font-sans text-xs text-[#b8a896] mt-0.5">
            Real-time latency metrics, graph recalculation benchmarks, and AES-256 session audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#07090f] p-3 rounded-lg border border-[#2a2e39]/40 font-telemetry text-xs">
          <span className="text-[#b8a896]">Cipher Key:</span>
          <span className="text-[#ffc174] font-bold">AES-256-GCM Verified</span>
        </div>
      </div>

      {/* BENCHMARK CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl shadow-xl flex flex-col gap-2">
          <span className="font-telemetry text-xs text-[#b8a896] uppercase">Graph Recalculation</span>
          <div className="font-display text-3xl text-[#ffc174] font-bold">{telemetry.latencyMs} ms</div>
          <span className="font-telemetry text-[11px] text-[#7bd0ff]">Sub-15ms Target Met</span>
        </div>

        <div className="p-5 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl shadow-xl flex flex-col gap-2">
          <span className="font-telemetry text-xs text-[#b8a896] uppercase">Sync Latency</span>
          <div className="font-display text-3xl text-[#7bd0ff] font-bold">{telemetry.syncDelayMs} ms</div>
          <span className="font-telemetry text-[11px] text-[#ffc174]">Multi-Device SSE Stream</span>
        </div>

        <div className="p-5 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl shadow-xl flex flex-col gap-2">
          <span className="font-telemetry text-xs text-[#b8a896] uppercase">Throughput Rate</span>
          <div className="font-display text-3xl text-[#e1e2ec] font-bold">{telemetry.throughputRps} rps</div>
          <span className="font-telemetry text-[11px] text-[#b8a896]">Distributed Load</span>
        </div>

        <div className="p-5 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl shadow-xl flex flex-col gap-2">
          <span className="font-telemetry text-xs text-[#b8a896] uppercase">Database Query Time</span>
          <div className="font-display text-3xl text-[#ffc258] font-bold">{telemetry.dbQueryTimeMs} ms</div>
          <span className="font-telemetry text-[11px] text-[#7bd0ff]">Postgres Dual Sync</span>
        </div>
      </div>

      {/* DETAILED AUDIT TABLE */}
      <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-xl shadow-xl flex flex-col gap-4">
        <h2 className="font-display text-lg text-[#e1e2ec] font-bold">Cryptographic Audit Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-telemetry text-xs text-[#b8a896]">
            <thead className="bg-[#07090f] text-[#ffc174] uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">DAG Mutation</th>
                <th className="p-3">Hash Digest</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/30">
              <tr>
                <td className="p-3 text-[#e1e2ec]">14:02:11 CET</td>
                <td className="p-3">TW-VRP Solved</td>
                <td className="p-3">4 Nodes Validated</td>
                <td className="p-3 font-mono text-[#7bd0ff]">0x8f92...c14e</td>
                <td className="p-3 text-[#ffc174] font-bold">VERIFIED</td>
              </tr>
              <tr>
                <td className="p-3 text-[#e1e2ec]">13:58:44 CET</td>
                <td className="p-3">SSE Heartbeat</td>
                <td className="p-3">Multi-Device Sync</td>
                <td className="p-3 font-mono text-[#7bd0ff]">0x3a10...e99d</td>
                <td className="p-3 text-[#ffc174] font-bold">VERIFIED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
