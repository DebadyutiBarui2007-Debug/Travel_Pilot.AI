import React, { useState } from 'react';

interface MissionControlViewProps {
  onLaunchWorkspace: (tripParams?: any) => void;
  isMissionConfirmed?: boolean;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({
  onLaunchWorkspace,
  isMissionConfirmed = false,
}) => {
  const [intakeTab, setIntakeTab] = useState<'nlp' | 'form'>('nlp');
  const [nlpText, setNlpText] = useState('');
  const [destination, setDestination] = useState('Paris & Milan');
  const [dates, setDates] = useState('Oct 14 - Oct 20 (6 Nights)');
  const [archetype, setArchetype] = useState('executive');
  const [transitMode, setTransitMode] = useState('blackcar');
  const [pacingDensity, setPacingDensity] = useState(1.65);
  const [uploadStatus, setUploadStatus] = useState<{ title: string; sub: string }>({
    title: 'Drop PDF tickets, boarding passes, or itinerary .ics',
    sub: 'Zero OCR latency • Supports Amadeus, Sabre, NDC feeds',
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledSuccess, setCompiledSuccess] = useState(false);

  // Confirmation checklist items
  const [checkedPnr, setCheckedPnr] = useState(true);
  const [checkedAnchors, setCheckedAnchors] = useState(true);
  const [checkedTransit, setCheckedTransit] = useState(true);

  // Accordion open states for Architectural Breakdown cards
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    dag: false,
    vrp: false,
    remed: false,
    copilot: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFillSample = () => {
    setNlpText(
      'Paris (3 Nights at Hôtel de Crillon) followed by Frecciarossa high-speed rail to Milan (2 Nights at Armani Hotel). Hard lock: Flight AF007 lands 08:15 Oct 14, reservation at Plénitude 13:30 Oct 14. Priority: Contemporary art galleries, zero backtracking, maximum 25m transit leg tolerance.'
    );
    setUploadStatus({
      title: 'Parsed: AF_E-Ticket_JFK-CDG.pdf & Frecciarossa_9593.ics',
      sub: 'Deterministic constraints extracted: 2 anchors, 4 flexible nodes',
    });
  };

  const handleSimulateUpload = () => {
    setUploadStatus({
      title: 'Simulating NDC/Sabre Parse...',
      sub: 'Resolving airport geometry, luggage transit buffer, and boarding timelines...',
    });
    setTimeout(() => {
      handleFillSample();
    }, 500);
  };

  const handleCompileAndConfirm = async () => {
    setIsCompiling(true);

    try {
      await fetch('/api/trips/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nlpInput: nlpText,
          destination,
          dates,
          travelerArchetype: archetype,
          transitMode,
          pacingDensity,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsCompiling(false);
      setCompiledSuccess(true);
      setTimeout(() => {
        onLaunchWorkspace();
      }, 400);
    }, 700);
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex flex-col gap-10 py-6 relative z-10">
      {/* HERO & TELEMETRY CLUSTER */}
      <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 relative pt-2">
        <div className="flex flex-col max-w-2xl gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#202532] border border-[#f59e0b]/30 text-[#ffc174] font-telemetry text-[10px] uppercase tracking-wider">
              State Engine v4.8
            </span>
            <span className="font-telemetry text-xs text-[#b8a896] flex items-center gap-1.5 ml-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7bd0ff]"></span>
              Synchronized Matrix
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-[#e1e2ec] tracking-tight font-bold mt-1">
            TravelPilot Autonomous{' '}
            <span className="text-[#ffc174] drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Orchestration Engine
            </span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#b8a896] leading-relaxed">
            Avionics-grade itinerary compiler. Parses raw emails, e-tickets, and boundary constraints into deterministic, zero-collision executive itineraries backed by topological temporal graphs.
          </p>
        </div>

        {/* TOP STATUS NOTICE */}
        {!isMissionConfirmed ? (
          <div className="p-4 bg-[#1e1b12] border-2 border-[#f59e0b] rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center gap-3 max-w-md animate-pulse">
            <span className="material-symbols-outlined text-3xl text-[#ffc174]">info</span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-[#ffc174]">Mission Confirmation Required</span>
              <span className="font-sans text-xs text-[#b8a896]">
                Review and confirm mission parameters below to unlock the full Autonomous Workspace & Avionics Suite.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#0d2818] border border-[#10b981]/50 rounded-2xl shadow-md flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-[#34d399]">verified</span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-[#34d399]">Mission Verified & Unlocked</span>
              <span className="font-sans text-xs text-[#b8a896]">
                Full access enabled across Autonomous Workspace, Contingency Protocols & Telemetry Logs.
              </span>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: AUTONOMOUS INTAKE & COMPILATION CONSOLE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT INTAKE FORM (7 cols) */}
        <div className="lg:col-span-7 bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#2a2e39]/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174]">
                <span className="material-symbols-outlined text-xl">tune</span>
              </div>
              <div>
                <h2 className="font-display text-lg text-[#e1e2ec] font-bold">Autonomous Intake Console</h2>
                <p className="font-telemetry text-xs text-[#b8a896]">Initialize boundary constraints and temporal hard anchors</p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-[#07090f] p-1 border border-[#2a2e39]/50 rounded-lg">
              <button
                onClick={() => setIntakeTab('nlp')}
                className={`px-3 py-1 rounded-md font-telemetry text-xs transition-all cursor-pointer ${
                  intakeTab === 'nlp'
                    ? 'bg-[#202532] text-[#ffc174] font-semibold border border-[#f59e0b]/30'
                    : 'text-[#b8a896] hover:text-[#e1e2ec]'
                }`}
              >
                Natural Language / PNR
              </button>
              <button
                onClick={() => setIntakeTab('form')}
                className={`px-3 py-1 rounded-md font-telemetry text-xs transition-all cursor-pointer ${
                  intakeTab === 'form'
                    ? 'bg-[#202532] text-[#ffc174] font-semibold border border-[#f59e0b]/30'
                    : 'text-[#b8a896] hover:text-[#e1e2ec]'
                }`}
              >
                Constraint Matrix
              </button>
            </div>
          </div>

          {/* SAMPLE FILL TRIGGER BUTTON */}
          <button
            onClick={handleFillSample}
            className="w-full p-3 rounded-xl bg-[#1e1b12] border border-[#f59e0b]/40 text-[#ffc174] hover:bg-[#2a2318] transition-all cursor-pointer flex items-center justify-center gap-2 font-telemetry text-xs font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Fill Sample Executive Trip (Paris & Milan)</span>
          </button>

          {/* INTAKE INPUTS */}
          {intakeTab === 'nlp' ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-telemetry text-xs text-[#b8a896] uppercase flex items-center justify-between">
                  <span>Raw PNR / Confirmation Text / Instructions</span>
                  <span className="text-[#ffc174]">NLP Parser v4</span>
                </label>
                <textarea
                  value={nlpText}
                  onChange={(e) => setNlpText(e.target.value)}
                  placeholder="Paste e-tickets, hotel booking emails, or prompt: 'Paris 3 nights at Crillon, hard lunch at Plénitude 1:30 PM Oct 14, then rail to Milan...'"
                  rows={4}
                  className="w-full bg-[#07090f] border border-[#2a2e39]/60 p-3 rounded-xl text-[#e1e2ec] font-sans text-xs focus:border-[#f59e0b] outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* FILE DROPZONE */}
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-[#2a2e39]/60 hover:border-[#f59e0b]/60 bg-[#07090f]/60 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#202532] border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174] shrink-0">
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-xs font-semibold text-[#e1e2ec] truncate">{uploadStatus.title}</span>
                  <span className="font-telemetry text-[11px] text-[#b8a896] truncate">{uploadStatus.sub}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-telemetry text-xs text-[#b8a896] uppercase">Target Destination(s)</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-telemetry text-xs text-[#b8a896] uppercase">Temporal Window</label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-telemetry text-xs text-[#b8a896] uppercase">Traveler Archetype</label>
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b]"
                >
                  <option value="executive">High-Velocity Executive</option>
                  <option value="leisure">VIP Cultural Leisure</option>
                  <option value="diplomat">Diplomatic Delegation</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-telemetry text-xs text-[#b8a896] uppercase">Transit Mode Matrix</label>
                <select
                  value={transitMode}
                  onChange={(e) => setTransitMode(e.target.value)}
                  className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b]"
                >
                  <option value="blackcar">Private Chauffeur + High-Speed Rail</option>
                  <option value="helicopter">Helicopter Transfer + Black Car</option>
                  <option value="commercial">Commercial First Class</option>
                </select>
              </div>
            </div>
          )}

          {/* PACING DENSITY SLIDER */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#2a2e39]/40">
            <div className="flex items-center justify-between font-telemetry text-xs">
              <span className="text-[#b8a896] uppercase">Pacing Density Index</span>
              <span className="text-[#ffc174] font-bold">{pacingDensity.toFixed(2)} (Balanced Executive)</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={pacingDensity}
              onChange={(e) => setPacingDensity(parseFloat(e.target.value))}
              className="w-full accent-[#f59e0b] cursor-pointer"
            />
            <div className="flex justify-between font-telemetry text-[10px] text-[#b8a896]">
              <span>Relaxed (1.0)</span>
              <span>Optimized Tempo (1.75)</span>
              <span>High Throughput (2.5)</span>
            </div>
          </div>

          {/* HARD ANCHORS & SOFT PREFERENCES TAG CLOUD */}
          <div className="flex flex-col gap-2">
            <span className="font-telemetry text-[10px] text-[#b8a896] uppercase tracking-wider">Identified Anchors & Routing Priors</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#202532]/90 border border-[#f59e0b]/30 rounded-full font-telemetry text-xs text-[#ffc174] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                Fixed: AF007 (JFK → CDG)
              </span>
              <span className="px-3 py-1 bg-[#202532]/90 border border-[#7bd0ff]/30 rounded-full font-telemetry text-xs text-[#7bd0ff] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7bd0ff]"></span>
                Anchor: Hôtel de Crillon 3N
              </span>
              <span className="px-3 py-1 bg-[#202532]/90 border border-[#ffc258]/30 rounded-full font-telemetry text-xs text-[#ffc258] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffc258]"></span>
                Constraint: Max 25m Transit Window
              </span>
              <span className="px-3 py-1 bg-[#202532]/90 border border-[#2a2e39]/60 rounded-full font-telemetry text-xs text-[#b8a896] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a08e7a]"></span>
                Preference: Zero Backtracking
              </span>
            </div>
          </div>

          {/* MISSION CONFIRMATION CHECKLIST BOX */}
          <div className="p-4 bg-[#07090f] border-2 border-[#f59e0b]/60 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174]">fact_check</span>
              <span className="font-display text-xs font-bold text-[#e1e2ec] uppercase tracking-wider">
                Mission Information Verification Checklist
              </span>
            </div>

            <div className="flex flex-col gap-2 font-telemetry text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-[#e1e2ec] hover:text-[#ffc174]">
                <input
                  type="checkbox"
                  checked={checkedPnr}
                  onChange={(e) => setCheckedPnr(e.target.checked)}
                  className="accent-[#f59e0b] w-4 h-4 rounded cursor-pointer"
                />
                <span>PNR & E-Ticket Credentials Verified (AF007 + Frecciarossa 9593)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-[#e1e2ec] hover:text-[#ffc174]">
                <input
                  type="checkbox"
                  checked={checkedAnchors}
                  onChange={(e) => setCheckedAnchors(e.target.checked)}
                  className="accent-[#f59e0b] w-4 h-4 rounded cursor-pointer"
                />
                <span>Temporal Anchors Locked (Hôtel de Crillon & Plénitude 13:30)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-[#e1e2ec] hover:text-[#ffc174]">
                <input
                  type="checkbox"
                  checked={checkedTransit}
                  onChange={(e) => setCheckedTransit(e.target.checked)}
                  className="accent-[#f59e0b] w-4 h-4 rounded cursor-pointer"
                />
                <span>Transit Density & Zero-Backtracking Vectors Approved</span>
              </label>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON */}
          <button
            onClick={handleCompileAndConfirm}
            disabled={isCompiling || !checkedPnr || !checkedAnchors || !checkedTransit}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ffc174] to-[#f59e0b] hover:from-[#d97706] hover:to-[#d97706] text-[#3d2400] font-display text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.6)] disabled:opacity-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-2xl ${isCompiling ? 'animate-spin' : ''}`}>
              {isCompiling ? 'sync' : compiledSuccess ? 'task_alt' : 'verified'}
            </span>
            <span>
              {isCompiling
                ? 'Solving Topological Constraints & Parting Curtain...'
                : compiledSuccess
                ? 'Mission Confirmed • Launching Workspace'
                : 'CONFIRM MISSION INFORMATION & LAUNCH AVIONICS SUITE'}
            </span>
          </button>
        </div>

        {/* RIGHT PREVIEW & LIVE GRAPH VALIDATION (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* GRAPH SLACK HUD CARD */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-4 rounded-xl shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174] text-xl">network_intelligence</span>
                <span className="font-display text-base text-[#e1e2ec] font-semibold">Temporal Topology Matrix</span>
              </div>
              <span className="font-telemetry text-xs px-2 py-0.5 rounded bg-[#202532] text-[#7bd0ff] border border-[#7bd0ff]/30">
                Realtime
              </span>
            </div>

            {/* MINI TOPOLOGY GRAPH (SVG Canvas) */}
            <div className="w-full h-36 bg-[#07090f]/90 border border-[#2a2e39]/40 rounded-lg p-1 relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 360 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid Background Lines */}
                <line x1="0" y1="30" x2="360" y2="30" stroke="#a08e7a" strokeDasharray="3 3" opacity="0.15" />
                <line x1="0" y1="60" x2="360" y2="60" stroke="#a08e7a" strokeDasharray="3 3" opacity="0.15" />
                <line x1="0" y1="90" x2="360" y2="90" stroke="#a08e7a" strokeDasharray="3 3" opacity="0.15" />

                {/* Directed Edges */}
                <path d="M40 60 H 110" stroke="#f59e0b" strokeWidth="2.5" />
                <path d="M110 60 Q 145 25 180 30" stroke="#7bd0ff" strokeDasharray="3 3" strokeWidth="1.8" />
                <path d="M110 60 Q 145 95 180 90" stroke="#f59e0b" strokeWidth="2.5" />
                <path d="M180 30 Q 215 35 250 60" stroke="#7bd0ff" strokeWidth="1.8" />
                <path d="M180 90 Q 215 85 250 60" stroke="#f59e0b" strokeWidth="2.5" />
                <path d="M250 60 H 320" stroke="#f59e0b" strokeWidth="2.5" />

                {/* Graph Vertices */}
                <circle cx="40" cy="60" r="7" fill="#0a0d14" stroke="#f59e0b" strokeWidth="2.5" />
                <circle cx="110" cy="60" r="6" fill="#f59e0b" />
                <circle cx="180" cy="30" r="5" fill="#7bd0ff" />
                <circle cx="180" cy="90" r="6" fill="#f59e0b" />
                <circle cx="250" cy="60" r="6" fill="#f59e0b" />
                <circle cx="320" cy="60" r="7" fill="#0a0d14" stroke="#7bd0ff" strokeWidth="2.5" />

                {/* Labels */}
                <text x="25" y="82" fill="#b8a896" fontFamily="JetBrains Mono" fontSize="9">AF007</text>
                <text x="98" y="82" fill="#b8a896" fontFamily="JetBrains Mono" fontSize="9">Crillon</text>
                <text x="145" y="20" fill="#7bd0ff" fontFamily="JetBrains Mono" fontSize="8">Louvre [Flex]</text>
                <text x="148" y="112" fill="#f59e0b" fontFamily="JetBrains Mono" fontSize="8">Plénitude [Hard]</text>
                <text x="225" y="82" fill="#b8a896" fontFamily="JetBrains Mono" fontSize="9">Freccia 9593</text>
                <text x="300" y="82" fill="#7bd0ff" fontFamily="JetBrains Mono" fontSize="9">Armani</text>
              </svg>

              <div className="absolute bottom-2 right-3 font-telemetry text-xs text-[#ffc174] font-medium bg-[#07090f]/80 px-2 py-0.5 rounded border border-[#2a2e39]/30">
                Slack Range: +45m • 0 Cycles
              </div>
            </div>

            {/* ACTIVE VALIDATION READOUT */}
            <div className="bg-[#181c26]/70 border border-[#2a2e39]/30 p-3 rounded-lg flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-telemetry text-xs">
                <span className="text-[#b8a896]">Deterministic Proof Status:</span>
                <span className="text-[#ffc174] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse"></span>
                  DAG Solved (K-Means Validated)
                </span>
              </div>
              <div className="flex items-center justify-between font-telemetry text-xs">
                <span className="text-[#b8a896]">Max Backtracking Penalty:</span>
                <span className="text-[#7bd0ff] font-medium">0.00% (Linear Vector)</span>
              </div>
            </div>
          </div>

          {/* LIVE ITINERARY STAGING DRAFT CARD */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl p-4 rounded-xl shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-base text-[#e1e2ec] font-semibold">Compiled Sequence Preview</span>
              <span className="font-telemetry text-[10px] text-[#b8a896] uppercase">Paris • Milan (Oct 14-20)</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 px-3 bg-[#181c26]/80 border border-[#2a2e39]/30 rounded-lg flex items-center justify-between hover:border-[#f59e0b]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-telemetry text-xs text-[#ffc174] font-semibold">08:15 CET</span>
                  <span className="text-[#534434] font-telemetry text-xs">•</span>
                  <span className="font-sans text-xs text-[#e1e2ec]">Air France AF007 Land at CDG Terminal 2E</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30 font-telemetry text-[10px] font-semibold">HARD ANCHOR</span>
              </div>

              <div className="p-2.5 px-3 bg-[#181c26]/80 border border-[#2a2e39]/30 rounded-lg flex items-center justify-between hover:border-[#7bd0ff]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-telemetry text-xs text-[#7bd0ff] font-semibold">10:00 CET</span>
                  <span className="text-[#534434] font-telemetry text-xs">•</span>
                  <span className="font-sans text-xs text-[#e1e2ec]">Private Transfer to Hôtel de Crillon</span>
                </div>
                <span className="font-telemetry text-xs text-[#b8a896] bg-[#202532] px-2 py-0.5 rounded">+30m Slack</span>
              </div>

              <div className="p-2.5 px-3 bg-[#181c26]/80 border border-[#2a2e39]/30 rounded-lg flex items-center justify-between hover:border-[#f59e0b]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-telemetry text-xs text-[#ffc258] font-semibold">13:30 CET</span>
                  <span className="text-[#534434] font-telemetry text-xs">•</span>
                  <span className="font-sans text-xs text-[#e1e2ec]">Plénitude — Chef Arnaud Donckele</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30 font-telemetry text-[10px] font-semibold">HARD ANCHOR</span>
              </div>

              <div className="p-2.5 px-3 bg-[#181c26]/80 border border-[#2a2e39]/30 rounded-lg flex items-center justify-between hover:border-[#7bd0ff]/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-telemetry text-xs text-[#b8a896] font-semibold">16:45 CET</span>
                  <span className="text-[#534434] font-telemetry text-xs">•</span>
                  <span className="font-sans text-xs text-[#e1e2ec]">Bourse de Commerce Pinault Collection</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#7bd0ff]/30 font-telemetry text-[10px] font-semibold">FLEXIBLE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2a2e39]/30">
              <span className="font-telemetry text-xs text-[#b8a896]">Calculated Contingencies: 3 pre-compiled</span>
              <span className="font-telemetry text-xs text-[#ffc174] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span> Ready for Execution
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL EXPEDITION & ACCORDION SYSTEM */}
      <section className="flex flex-col gap-4 pt-6 border-t border-[#2a2e39]/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="font-telemetry text-[10px] text-[#ffc174] uppercase tracking-wider font-semibold">
              Autonomous Engine Architecture
            </span>
            <h2 className="font-display text-2xl text-[#e1e2ec] font-bold tracking-tight mt-1">
              High-Agency Algorithmic Features
            </h2>
          </div>
          <p className="font-sans text-xs text-[#b8a896] max-w-md">
            Explore the mathematical components powering continuous contingency generation, geo-clustering, and sub-15ms graph healing.
          </p>
        </div>

        {/* EXPANDABLE FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: DAG Engine */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#f59e0b]/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174]">
                  <span className="material-symbols-outlined">account_tree</span>
                </div>
                <span className="font-telemetry text-[10px] text-[#b8a896] px-2 py-0.5 rounded bg-[#181c26] border border-[#2a2e39]/40">DAG CORE</span>
              </div>
              <div>
                <h3 className="font-display text-base text-[#e1e2ec] font-semibold">Unified Graph Dependency Engine</h3>
                <p className="font-sans text-sm text-[#b8a896] mt-1">
                  Represents your entire journey as a strict mathematical Directed Acyclic Graph. Flights and hotel check-ins are rigid anchor vertices.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a2e39]/30">
              <button
                onClick={() => toggleAccordion('dag')}
                className="w-full flex items-center justify-between py-2 text-[#ffc174] font-telemetry text-xs hover:text-[#ffddb8] cursor-pointer transition-colors"
              >
                <span className="font-medium">
                  {openAccordions.dag ? 'Collapse Architectural Breakdown' : 'Expand Architectural Breakdown'}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordions.dag ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordions.dag && (
                <div className="flex flex-col gap-2 pt-2 text-[#b8a896] font-sans text-xs">
                  <div className="p-3 bg-[#07090f]/90 border border-[#2a2e39]/40 rounded-lg font-telemetry text-xs text-[#e1e2ec] flex flex-col gap-1.5">
                    <div className="text-[#ffc174] font-semibold">Graph Properties:</div>
                    <div>• <strong className="text-white">Vertices:</strong> V = {'{Flights, Dinners, Transfers, POIs}'} with Earliest Arrival Time (EAT) & Latest Departure Time (LDT).</div>
                    <div>• <strong className="text-white">Directed Edges:</strong> E = Transit feasibility vectors verified with real-time transit matrices.</div>
                    <div>• <strong className="text-white">Cascade Validation:</strong> If flight AF007 shifts +120m, every downstream connected edge is re-evaluated via topological sorting.</div>
                  </div>
                  <p className="text-[#b8a896] mt-1">
                    Eliminates the fundamental flaw of linear calendars: zero blind cascading collisions when flights run late or museum tickets expire.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: TW-VRP & K-Means Solver */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#7bd0ff]/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#7bd0ff]/15 border border-[#7bd0ff]/30 flex items-center justify-center text-[#7bd0ff]">
                  <span className="material-symbols-outlined">polyline</span>
                </div>
                <span className="font-telemetry text-[10px] text-[#b8a896] px-2 py-0.5 rounded bg-[#181c26] border border-[#2a2e39]/40">OPTIMIZER</span>
              </div>
              <div>
                <h3 className="font-display text-base text-[#e1e2ec] font-semibold">Deterministic TW-VRP & K-Means</h3>
                <p className="font-sans text-sm text-[#b8a896] mt-1">
                  Solves Time-Windowed Vehicle Routing with POI geographic clustering to completely eliminate zig-zag transit and wasted executive hours.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a2e39]/30">
              <button
                onClick={() => toggleAccordion('vrp')}
                className="w-full flex items-center justify-between py-2 text-[#7bd0ff] font-telemetry text-xs hover:text-[#c4e7ff] cursor-pointer transition-colors"
              >
                <span className="font-medium">
                  {openAccordions.vrp ? 'Collapse Mathematical Mechanics' : 'Expand Mathematical Mechanics'}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordions.vrp ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordions.vrp && (
                <div className="flex flex-col gap-2 pt-2 text-[#b8a896] font-sans text-xs">
                  <div className="p-3 bg-[#07090f]/90 border border-[#2a2e39]/40 rounded-lg font-telemetry text-xs text-[#e1e2ec] flex flex-col gap-1.5">
                    <div className="text-[#7bd0ff] font-semibold">Geometric Clustering:</div>
                    <div>• <strong className="text-white">K-Means Sub-clustering:</strong> Day itineraries naturally group into geographic clusters (e.g. 1st Arr. Paris & Marais).</div>
                    <div>• <strong className="text-white">Transit Cost Tensor:</strong> Built with live Mapbox Distance Matrix & real-time urban traffic projections.</div>
                    <div>• <strong className="text-white">Strict Constraint:</strong> Zero backtracking — forward direction of motion prioritized on all days.</div>
                  </div>
                  <p className="text-[#b8a896] mt-1">
                    Guarantees travelers never spend 40 minutes traversing a city only to return to the identical arrondissement later that evening.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 3: Autonomous Disruption Agent */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#ffc258]/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#ffc258]/15 border border-[#ffc258]/30 flex items-center justify-center text-[#ffc258]">
                  <span className="material-symbols-outlined">auto_mode</span>
                </div>
                <span className="font-telemetry text-[10px] text-[#b8a896] px-2 py-0.5 rounded bg-[#181c26] border border-[#2a2e39]/40">RECOVERY AGENT</span>
              </div>
              <div>
                <h3 className="font-display text-base text-[#e1e2ec] font-semibold">Autonomous Disruption Remediation</h3>
                <p className="font-sans text-sm text-[#b8a896] mt-1">
                  Continuous radar for delayed flights, train strikes, and inclement weather. Instantly synthesizes 3 verified counterfactual recovery branches.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a2e39]/30">
              <button
                onClick={() => toggleAccordion('remed')}
                className="w-full flex items-center justify-between py-2 text-[#ffc258] font-telemetry text-xs hover:text-[#ffdead] cursor-pointer transition-colors"
              >
                <span className="font-medium">
                  {openAccordions.remed ? 'Collapse Remediation Protocol' : 'Expand Remediation Protocol'}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordions.remed ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordions.remed && (
                <div className="flex flex-col gap-2 pt-2 text-[#b8a896] font-sans text-xs">
                  <div className="p-3 bg-[#07090f]/90 border border-[#2a2e39]/40 rounded-lg font-telemetry text-xs text-[#e1e2ec] flex flex-col gap-1.5">
                    <div className="text-[#ffc258] font-semibold">Simulated Disruption Matrix (AA1204 +85m):</div>
                    <div>• <strong className="text-white">Option A (Minimal Delay Shift):</strong> Preserves 3-star dinner, compresses gallery by 30 mins, swaps transfer mode to express chauffeur.</div>
                    <div>• <strong className="text-white">Option B (Equivalent Replacement):</strong> Replaces dinner booking with equal tier reservation 450m from hotel.</div>
                    <div>• <strong className="text-white">One-Touch Affirmation:</strong> Push notification arrives with completed graph revision ready for single-tap commit.</div>
                  </div>
                  <p className="text-[#b8a896] mt-1">
                    Eliminates panic in transit lounges. TravelPilot calculates alternatives before gate agents even announce the delay.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 4: Conversational Situational Co-Pilot */}
          <div className="bg-[#13161f]/90 border border-[#2a2e39]/50 backdrop-blur-xl rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#ffddb8]/40">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#ffc174]">
                  <span className="material-symbols-outlined">cognition</span>
                </div>
                <span className="font-telemetry text-[10px] text-[#b8a896] px-2 py-0.5 rounded bg-[#181c26] border border-[#2a2e39]/40">COPILOT</span>
              </div>
              <div>
                <h3 className="font-display text-base text-[#e1e2ec] font-semibold">Situational Conversational Co-Pilot</h3>
                <p className="font-sans text-sm text-[#b8a896] mt-1">
                  An LLM that doesn't hallucinate schedules. Every prompt is bound to the underlying solver engine and validated against real time-windows.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a2e39]/30">
              <button
                onClick={() => toggleAccordion('copilot')}
                className="w-full flex items-center justify-between py-2 text-[#ffc174] font-telemetry text-xs hover:text-[#ffddb8] cursor-pointer transition-colors"
              >
                <span className="font-medium">
                  {openAccordions.copilot ? 'Collapse Copilot Capabilities' : 'Expand Copilot Capabilities'}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordions.copilot ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {openAccordions.copilot && (
                <div className="flex flex-col gap-2 pt-2 text-[#b8a896] font-sans text-xs">
                  <div className="p-3 bg-[#07090f]/90 border border-[#2a2e39]/40 rounded-lg font-telemetry text-xs text-[#e1e2ec] flex flex-col gap-1.5">
                    <div className="text-[#ffc174] font-semibold">Natural Language Graph Mutations:</div>
                    <div>• <strong className="text-white">"Can I fit drinks with Sarah before dinner at 7:30?"</strong> → Engine verifies 52min slack window in Saint-Germain and tests walking buffer.</div>
                    <div>• <strong className="text-white">"Swap Milan afternoon for an architecture tour"</strong> → Automatic replacement of nodes preserving fixed dinner table.</div>
                  </div>
                  <p className="text-[#b8a896] mt-1">
                    Natural dialogue translated cleanly into immutable graph mutations without broken commitments or lost reservations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE VISUAL AUDIT STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-52 bg-[#181c26] border border-[#2a2e39]/40 group">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
            alt="Avionics Grade Assurance"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent p-4 flex flex-col justify-end">
            <span className="font-telemetry text-[10px] text-[#ffc174] uppercase font-semibold">Avionics Grade</span>
            <span className="font-display text-lg text-[#e1e2ec] font-bold">Deterministic Assurance</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg h-52 bg-[#181c26] border border-[#2a2e39]/40 group">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
            alt="Geo-Spatial Precision"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent p-4 flex flex-col justify-end">
            <span className="font-telemetry text-[10px] text-[#7bd0ff] uppercase font-semibold">Geo-Spatial Precision</span>
            <span className="font-display text-lg text-[#e1e2ec] font-bold">Zero Backtracking Transit</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg h-52 bg-[#181c26] border border-[#2a2e39]/40 group">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
            alt="Self-Healing Logic"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent p-4 flex flex-col justify-end">
            <span className="font-telemetry text-[10px] text-[#ffc258] uppercase font-semibold">Self-Healing Logic</span>
            <span className="font-display text-lg text-[#e1e2ec] font-bold">Sub-15ms DAG Resolution</span>
          </div>
        </div>
      </section>
    </div>
  );
};
