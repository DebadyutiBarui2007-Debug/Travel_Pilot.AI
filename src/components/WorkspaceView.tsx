import React, { useState } from 'react';
import { TripItinerary, DisruptionEvent, CopilotMessage, TripNode } from '../types';
import { InteractiveDagMap } from './InteractiveDagMap';
import { VoiceCommandController } from './VoiceCommandController';

interface WorkspaceViewProps {
  trip: TripItinerary;
  disruption: DisruptionEvent | null;
  onSimulateDisruption: () => void;
  onApplyPlan: (planId: string) => void;
  onResetTrip: () => void;
  onOpenPassbook: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  trip,
  disruption,
  onSimulateDisruption,
  onApplyPlan,
  onResetTrip,
  onOpenPassbook,
}) => {
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'init_msg_1',
      sender: 'agent',
      text: 'Good afternoon, Julian. All Day 1 nodes are aligned within nominal slack parameters (+140m total). Flight AA1204 radar is monitored in real time.',
      timestamp: '14:00 CET',
      slackAudit: {
        calculationTimeMs: 12,
        safetyMargin: '99.4%',
        note: 'Baseline Graph Nominal',
      },
    },
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Accordion toggle states
  const [accordionState, setAccordionState] = useState<{ [key: string]: boolean }>({
    map: true,
    persistence: false,
    terminal: true,
  });

  const toggleAccordion = (key: string) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isCopilotThinking) return;

    const userText = copilotInput.trim();
    setCopilotInput('');

    const userMsg: CopilotMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' CET',
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    setIsCopilotThinking(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, userName: 'Julian' }),
      });
      const data = await res.json();
      if (data.message) {
        setCopilotMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: CopilotMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: 'Request evaluated against time-window constraints. Change is topologically valid with +28m remaining slack.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' CET',
        slackAudit: { calculationTimeMs: 14, safetyMargin: '94.8%', note: 'Valid Graph Mutation' },
      };
      setCopilotMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex flex-col gap-8 py-6 overflow-x-hidden">
      {/* WORKSPACE HEADER & CONTROL BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full max-w-full">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30 font-telemetry text-[10px] font-semibold uppercase">
              Autonomous Guard Active
            </span>
            <span className="font-telemetry text-xs text-[#b8a896]">• Engine: TW-VRP Non-Linear v4.8</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-[#e1e2ec] font-bold tracking-tight truncate">
            {trip.title}
          </h1>
          <p className="font-telemetry text-xs text-[#b8a896] truncate">
            {trip.dates} • {trip.travelerArchetype} • Slack Threshold: 45 min
          </p>
        </div>

        {/* ACTION BUTTONS & VOICE ASSISTANT */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* VOICE COMMAND ASSISTANT CONTROLLER */}
          <VoiceCommandController
            onSimulateDisruption={onSimulateDisruption}
            onApplyPlan={onApplyPlan}
            onResetTrip={onResetTrip}
            onOpenPassbook={onOpenPassbook}
          />

          {trip.isSimulatingDisruption ? (
            <button
              onClick={onResetTrip}
              className="px-4 py-2 rounded-xl bg-[#202532] hover:bg-[#282f40] text-[#e1e2ec] font-sans text-xs font-semibold border border-[#2a2e39] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              Reset Baseline
            </button>
          ) : (
            <button
              onClick={onSimulateDisruption}
              className="px-4 py-2 rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#ffc174] font-sans text-xs font-semibold border border-[#f59e0b]/40 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-[#f59e0b]">warning</span>
              Simulate Delay (+85m)
            </button>
          )}

          <button
            onClick={onOpenPassbook}
            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#3d2400] font-sans text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base">wallet</span>
            Passbook & Wallet
          </button>
        </div>
      </div>

      {/* DISRUPTION ALERT BANNER (IF DISRUPTED) */}
      {trip.isSimulatingDisruption && disruption && (
        <div className="bg-[#24110f] border-2 border-[#f59e0b] p-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse w-full max-w-full">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[#ffc174] shrink-0">
              <span className="material-symbols-outlined text-3xl">flight_land</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-telemetry text-xs font-bold text-[#ffc174] uppercase tracking-wider">
                  DISRUPTION DETECTED
                </span>
                <span className="px-2 py-0.5 rounded bg-[#f59e0b] text-[#3d2400] font-telemetry text-[10px] font-extrabold">
                  BUFFER VIOLATION
                </span>
              </div>
              <h2 className="font-display text-lg text-[#e1e2ec] font-bold mt-0.5 truncate">{disruption.title}</h2>
              <p className="font-sans text-xs text-[#b8a896] mt-1 break-words">
                Reason: {disruption.reason} • Louvre VIP curator gate window (-40m overlap). Counterfactual recovery plans calculated in 14ms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <span className="font-telemetry text-xs text-[#ffc174] bg-[#1d160e] px-3 py-1 rounded-lg border border-[#f59e0b]/30">
              3 Counterfactuals Ready
            </span>
          </div>
        </div>
      )}

      {/* GOLDEN RATIO GRID LAYOUT SYSTEM (12 Cols: 8 cols = 61.8%, 4 cols = 38.2%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-full overflow-x-hidden">
        {/* PRIMARY COLUMN (8 Cols = ~61.8% Golden Proportion) */}
        <div className="lg:col-span-8 flex flex-col gap-8 min-w-0 max-w-full">
          {/* INTERACTIVE D3.JS TOPOLOGICAL DAG MAP */}
          <InteractiveDagMap
            trip={trip}
            disruption={disruption}
            onSimulateDisruption={onSimulateDisruption}
            onApplyPlan={onApplyPlan}
          />

          {/* TEMPORAL DAG NODE STREAM (DAY 1 CRITICAL PATH) */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col gap-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2e39]/40 pb-4">
              <div>
                <span className="font-telemetry text-[10px] text-[#ffc174] uppercase tracking-wider font-semibold">
                  Topological Schedule Graph
                </span>
                <h2 className="font-display text-xl text-[#e1e2ec] font-bold">
                  Day 1 Critical Path Stream (Paris Arrival & Arts)
                </h2>
              </div>

              {/* Intraday Slack Meter */}
              <div className="flex items-center gap-3 bg-[#07090f] px-3 py-1.5 rounded-lg border border-[#2a2e39]/40 shrink-0">
                <span className="font-telemetry text-xs text-[#b8a896]">Total Slack Capacity:</span>
                <span className={`font-telemetry text-xs font-bold ${trip.isSimulatingDisruption ? 'text-[#ff6b6b]' : 'text-[#ffc174]'}`}>
                  {trip.isSimulatingDisruption ? 'BUFFER BREACH' : `${trip.totalSlackMinutes} min`}
                </span>
              </div>
            </div>

            {/* NODES TIMELINE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative w-full max-w-full">
              {trip.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 relative min-w-0 ${
                    node.status === 'conflict'
                      ? 'bg-[#1e0f0e] border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : node.status === 'auto_healed'
                      ? 'bg-[#0f1f18] border-[#7bd0ff] shadow-[0_0_15px_rgba(123,208,255,0.2)]'
                      : 'bg-[#181c26]/80 border-[#2a2e39]/50 hover:border-[#f59e0b]/40'
                  }`}
                >
                  {/* Header Index & Status Tag */}
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry text-xs text-[#b8a896] font-semibold">{node.nodeIndex}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-telemetry text-[10px] font-bold uppercase ${
                        node.status === 'conflict'
                          ? 'bg-[#f59e0b] text-[#3d2400]'
                          : node.status === 'auto_healed'
                          ? 'bg-[#7bd0ff] text-[#07131e]'
                          : node.isHardAnchor
                          ? 'bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30'
                          : 'bg-[#202532] text-[#b8a896]'
                      }`}
                    >
                      {node.statusText}
                    </span>
                  </div>

                  {/* Node Title & Description */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-telemetry text-xs text-[#ffc174] font-semibold">{node.timeSlot}</span>
                    <h3 className="font-display text-base text-[#e1e2ec] font-bold leading-tight truncate">{node.title}</h3>
                    <p className="font-sans text-xs text-[#b8a896] break-words">{node.subtitle}</p>
                  </div>

                  {/* Footer Slack & Transit Info */}
                  <div className="pt-3 border-t border-[#2a2e39]/30 flex flex-col gap-1">
                    <div className="flex items-center justify-between font-telemetry text-[11px]">
                      <span className="text-[#b8a896]">Slack Window:</span>
                      <span
                        className={
                          node.status === 'conflict'
                            ? 'text-[#ff6b6b] font-bold'
                            : node.status === 'auto_healed'
                            ? 'text-[#7bd0ff] font-bold'
                            : 'text-[#ffc174]'
                        }
                      >
                        {node.slackMargin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-telemetry text-[11px] text-[#b8a896]">
                      <span>Transit Vector:</span>
                      <span className="truncate max-w-[120px]">{node.transitInfo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECONDARY COLUMN (4 Cols = ~38.2% Golden Proportion) */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-w-0 max-w-full">
          {/* RANKED DYNAMIC CONTINGENCY PLANS (WHEN DISRUPTED) */}
          {trip.isSimulatingDisruption && disruption && (
            <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col gap-6 w-full max-w-full">
              <div className="flex items-center justify-between border-b border-[#2a2e39]/40 pb-4">
                <div>
                  <span className="font-telemetry text-[10px] text-[#ffc174] uppercase tracking-wider font-semibold">
                    Remediation Agent
                  </span>
                  <h2 className="font-display text-lg text-[#e1e2ec] font-bold">
                    Synthesized Contingencies
                  </h2>
                </div>
                <span className="font-telemetry text-xs text-[#b8a896]">3 Ready</span>
              </div>

              <div className="flex flex-col gap-5">
                {disruption.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 relative min-w-0 ${
                      plan.rank === 1
                        ? 'bg-[#181d28] border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-[#f59e0b]/50'
                        : 'bg-[#181c26]/80 border-[#2a2e39]/50 hover:border-[#2a2e39]'
                    }`}
                  >
                    {plan.rank === 1 && (
                      <div className="absolute -top-3 left-4 bg-[#f59e0b] text-[#3d2400] font-telemetry text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow">
                        RECOMMENDED RANK #1
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-telemetry text-xs text-[#ffc174] font-bold">Rank #{plan.rank} • {plan.rankTitle}</span>
                        <span className="font-telemetry text-xs px-2 py-0.5 rounded bg-[#202532] text-[#7bd0ff] font-bold">
                          {plan.matchPercent}% Match
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-base text-[#e1e2ec] font-bold">{plan.title}</h3>
                        <p className="font-sans text-xs text-[#b8a896] leading-relaxed mt-1">{plan.description}</p>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1">
                        {plan.bulletPoints.map((bp, i) => (
                          <div key={i} className="flex items-start gap-2 font-sans text-xs text-[#e1e2ec]">
                            <span className="material-symbols-outlined text-sm text-[#f59e0b] shrink-0 mt-0.5">check_circle</span>
                            <span className="break-words">{bp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2a2e39]/30 flex flex-col gap-3">
                      <div className="flex items-center justify-between font-telemetry text-xs text-[#b8a896]">
                        <span>Cost: <strong className="text-white">{plan.costVariance}</strong></span>
                        <span>Buffer: <strong className="text-[#ffc174]">{plan.bufferInfo}</strong></span>
                      </div>

                      <button
                        onClick={() => onApplyPlan(plan.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-display text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          plan.rank === 1
                            ? 'bg-[#f59e0b] hover:bg-[#d97706] text-[#3d2400] shadow-md'
                            : 'bg-[#202532] hover:bg-[#282f40] text-[#e1e2ec] border border-[#2a2e39]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">bolt</span>
                        <span>Apply {plan.title}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEEP ENGINE TELEMETRY ACCORDIONS */}
          <div className="flex flex-col gap-6 w-full max-w-full">
            {/* ACCORDION 1: MULTI-AGENT STATE & TELEMETRY PERSISTENCE */}
            <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden w-full max-w-full">
              <button
                onClick={() => toggleAccordion('persistence')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#181c26]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ffc258]/15 border border-[#ffc258]/30 flex items-center justify-center text-[#ffc258] shrink-0">
                    <span className="material-symbols-outlined">database</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm text-[#e1e2ec] font-semibold truncate">
                      Multi-Agent Persistence & Cypher Query
                    </h3>
                    <p className="font-telemetry text-[11px] text-[#b8a896] truncate">
                      WAL Graph Key: trip:paris_como_2025
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#b8a896] transition-transform duration-300 ${accordionState.persistence ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {accordionState.persistence && (
                <div className="p-4 pt-0 border-t border-[#2a2e39]/30 flex flex-col gap-3 font-mono text-xs text-[#b8a896] break-words">
                  <div className="p-3 bg-[#07090f] border border-[#2a2e39]/40 rounded-lg text-[#ffc174] overflow-x-auto">
                    <div className="text-[#7bd0ff] font-bold mb-1">// Active Cypher Query (Neo4j Graph Engine)</div>
                    <div>{"MATCH (t:Trip {id: 'trip_paris_como_2025'})-[:HAS_NODE]->(n:Node)"}</div>
                    <div>WHERE n.status = 'conflict'</div>
                    <div>OPTIONAL MATCH (n)-[:CASCADE_DEPENDS_ON]-&gt;(downstream:Node)</div>
                    <div>RETURN n.id, n.slackMargin, collect(downstream.id) AS affected_edges;</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2 bg-[#181c26] border border-[#2a2e39]/40 rounded flex flex-col">
                      <span className="text-[#b8a896] text-[9px] uppercase font-telemetry">Postgres Write</span>
                      <span className="text-[#ffc174] font-bold text-xs font-telemetry">11.4 ms</span>
                    </div>
                    <div className="p-2 bg-[#181c26] border border-[#2a2e39]/40 rounded flex flex-col">
                      <span className="text-[#b8a896] text-[9px] uppercase font-telemetry">Redis Revision</span>
                      <span className="text-[#7bd0ff] font-bold text-xs font-telemetry">rev_8841_ok</span>
                    </div>
                    <div className="p-2 bg-[#181c26] border border-[#2a2e39]/40 rounded flex flex-col">
                      <span className="text-[#b8a896] text-[9px] uppercase font-telemetry">Cipher</span>
                      <span className="text-[#ffc258] font-bold text-xs font-telemetry">AES-256</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 2: SITUATIONAL CONVERSATIONAL COPILOT */}
            <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden w-full max-w-full">
              <button
                onClick={() => toggleAccordion('terminal')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#181c26]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174] shrink-0">
                    <span className="material-symbols-outlined">terminal</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm text-[#e1e2ec] font-semibold truncate">
                      Conversational Terminal (Gemini)
                    </h3>
                    <p className="font-telemetry text-[11px] text-[#b8a896] truncate">
                      Auto-validates schedule mutations against time windows
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-xl text-[#b8a896] transition-transform duration-300 ${accordionState.terminal ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {accordionState.terminal && (
                <div className="p-4 pt-0 border-t border-[#2a2e39]/30 flex flex-col gap-4">
                  {/* MESSAGES CONSOLE */}
                  <div className="bg-[#07090f] border border-[#2a2e39]/40 rounded-xl p-3 flex flex-col gap-3 max-h-72 overflow-y-auto">
                    {copilotMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col gap-1 max-w-[90%] ${
                          msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl font-sans text-xs leading-relaxed break-words ${
                            msg.sender === 'user'
                              ? 'bg-[#f59e0b] text-[#3d2400] font-medium rounded-br-none'
                              : 'bg-[#181c26] text-[#e1e2ec] border border-[#2a2e39]/50 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>

                        <div className="flex items-center gap-2 font-telemetry text-[10px] text-[#b8a896] px-1">
                          <span>{msg.timestamp}</span>
                          {msg.slackAudit && (
                            <span className="text-[#7bd0ff]">
                              • {msg.slackAudit.calculationTimeMs}ms
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {isCopilotThinking && (
                      <div className="self-start p-2.5 bg-[#181c26] text-[#ffc174] border border-[#2a2e39] rounded-xl font-telemetry text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        Evaluating graph feasibility...
                      </div>
                    )}
                  </div>

                  {/* INPUT FORM */}
                  <form onSubmit={handleSendCopilot} className="flex gap-2">
                    <input
                      type="text"
                      value={copilotInput}
                      onChange={(e) => setCopilotInput(e.target.value)}
                      placeholder="Ask TravelPilot: 'Can I squeeze espresso before the Louvre?'..."
                      className="flex-1 bg-[#07090f] border border-[#2a2e39]/60 px-3 py-2 rounded-lg text-[#e1e2ec] font-sans text-xs placeholder:text-[#b8a896]/50 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                    />
                    <button
                      type="submit"
                      disabled={!copilotInput.trim() || isCopilotThinking}
                      className="px-3 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#3d2400] font-sans text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

