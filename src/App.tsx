import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { TickerRibbon } from './components/TickerRibbon';
import { MissionControlView } from './components/MissionControlView';
import { WorkspaceView } from './components/WorkspaceView';
import { ContingencyProtocolsView } from './components/ContingencyProtocolsView';
import { TelemetryAuditView } from './components/TelemetryAuditView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { PassbookModal } from './components/PassbookModal';
import { LoadingScreen } from './components/LoadingScreen';
import { GoldenRatioBackground } from './components/GoldenRatioBackground';
import { CurtainTransition } from './components/CurtainTransition';

import { initialTrip, sampleDisruptionEvent, mockUserProfile, mockActiveDevices, mockNotificationSettings, mockNotifications } from './data/mockData';
import { TripItinerary, DisruptionEvent, UserProfile, ActiveDevice, NotificationSettings, NotificationItem, TelemetryMetrics } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('mission-control-dashboard');
  const [isMissionConfirmed, setIsMissionConfirmed] = useState<boolean>(false);
  const [isCurtainActive, setIsCurtainActive] = useState<boolean>(false);
  const [curtainTargetTab, setCurtainTargetTab] = useState<string>('Autonomous Workspace');
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const [trip, setTrip] = useState<TripItinerary>(initialTrip);
  const [disruption, setDisruption] = useState<DisruptionEvent | null>(null);
  const [user, setUser] = useState<UserProfile>(mockUserProfile);
  const [devices, setDevices] = useState<ActiveDevice[]>(mockActiveDevices);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  const [telemetry, setTelemetry] = useState<TelemetryMetrics>({
    latencyMs: 14,
    syncDelayMs: 12,
    dagCollisions: 0,
    twvrpStatus: 'Standby',
    activeMemoryMb: 42,
    dbQueryTimeMs: 11.2,
    throughputRps: 1420,
    cipherAlgorithm: 'AES-256-GCM',
    activeAgents: 3,
    resiliencePercent: 99.4,
  });

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);

  // React Query provider manages telemetry caching and revalidation
  const { data: healthData } = useQuery({
    queryKey: ['telemetryHealth'],
    queryFn: async () => {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health fetch error');
      return res.json();
    },
    refetchInterval: 8000,
    staleTime: 4000,
  });

  useEffect(() => {
    if (healthData) {
      setTelemetry((prev) => ({
        ...prev,
        latencyMs: healthData.telemetrySyncMs || 14,
        syncDelayMs: healthData.telemetrySyncMs || 12,
        dagCollisions: healthData.collisions || 0,
        twvrpStatus: healthData.twvrpStatus || 'Standby',
        activeMemoryMb: healthData.activeMemoryMb || 42,
        dbQueryTimeMs: parseFloat(healthData.dbQueryLatencyMs) || 11.2,
      }));
    }
  }, [healthData]);

  // Handle SSE Real-Time Sync Stream
  useEffect(() => {
    const eventSource = new EventSource('/api/sync/events');
    
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'TELEMETRY_HEARTBEAT') {
          setTelemetry((prev) => ({
            ...prev,
            syncDelayMs: data.syncMs || 12,
            resiliencePercent: data.resiliencePercent || 99.4,
          }));
        }
      } catch (err) {
        console.error('SSE Error:', err);
      }
    };

    return () => eventSource.close();
  }, []);

  // Disruption Simulation Actions
  const handleSimulateDisruption = async () => {
    try {
      const res = await fetch('/api/disruption/simulate', { method: 'POST' });
      const data = await res.json();
      if (data.trip) setTrip(data.trip);
      if (data.disruption) setDisruption(data.disruption);
    } catch (e) {
      setTrip((prev) => ({ ...prev, isSimulatingDisruption: true, collisionCount: 1 }));
      setDisruption(sampleDisruptionEvent);
    }
  };

  const handleApplyPlan = async (planId: string) => {
    try {
      const res = await fetch('/api/disruption/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.trip) setTrip(data.trip);
      setDisruption(null);
    } catch (e) {
      setTrip((prev) => ({
        ...prev,
        isSimulatingDisruption: false,
        collisionCount: 0,
        resiliencePercent: 99.4,
      }));
      setDisruption(null);
    }
  };

  const handleResetTrip = async () => {
    try {
      const res = await fetch('/api/disruption/reset', { method: 'POST' });
      const data = await res.json();
      if (data.trip) setTrip(data.trip);
      setDisruption(null);
    } catch (e) {
      setTrip(initialTrip);
      setDisruption(null);
    }
  };

  // Launch Workspace with Curtain Opening Animation
  const handleLaunchWorkspace = () => {
    setCurtainTargetTab('Autonomous Workspace');
    setIsCurtainActive(true);
  };

  const handleCurtainComplete = () => {
    setIsCurtainActive(false);
    setIsMissionConfirmed(true);
    setActiveTab('autonomous-dag-workspace');
  };

  const handleAttemptLockedTab = (tabLabel: string) => {
    setLockedToast(tabLabel);
    setTimeout(() => {
      setLockedToast(null);
    }, 3500);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#07090f] text-[#e1e2ec] font-sans selection:bg-[#f59e0b]/20 selection:text-[#ffc174] flex flex-col overflow-x-hidden relative">
      {/* 1. APP LOADING SPLASH SCREEN */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* 2. DYNAMIC GOLDEN RATIO BACKGROUND ANIMATION */}
      <GoldenRatioBackground />

      {/* 3. CURTAIN OPENING TRANSITION */}
      <CurtainTransition
        isActive={isCurtainActive}
        onComplete={handleCurtainComplete}
        targetTabName={curtainTargetTab}
      />

      {/* LOCKED TOAST NOTIFICATION */}
      {lockedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-[#1e1b12] border-2 border-[#f59e0b] text-[#ffc174] px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] font-telemetry text-xs flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">lock</span>
          <span>
            Access to <strong>{lockedToast}</strong> is locked! Please verify and confirm all mission details on Mission Control first.
          </span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        telemetry={telemetry}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isMissionConfirmed={isMissionConfirmed}
        onAttemptLockedTab={handleAttemptLockedTab}
      />

      {/* Main Container Push down for Fixed Header */}
      <main className="flex-1 pt-20 flex flex-col relative z-10">
        {/* Live Running Telemetry Ribbon Ticker */}
        <TickerRibbon />

        {/* Dynamic Screen Tab Views */}
        <div className="flex-1">
          {activeTab === 'mission-control-dashboard' && (
            <MissionControlView
              onLaunchWorkspace={handleLaunchWorkspace}
              isMissionConfirmed={isMissionConfirmed}
            />
          )}

          {activeTab === 'autonomous-dag-workspace' && isMissionConfirmed && (
            <WorkspaceView
              trip={trip}
              disruption={disruption}
              onSimulateDisruption={handleSimulateDisruption}
              onApplyPlan={handleApplyPlan}
              onResetTrip={handleResetTrip}
              onOpenPassbook={() => setIsPassbookOpen(true)}
            />
          )}

          {activeTab === 'contingency-protocols' && isMissionConfirmed && <ContingencyProtocolsView />}

          {activeTab === 'telemetry-audit-log' && isMissionConfirmed && <TelemetryAuditView telemetry={telemetry} />}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#07090f]/90 border-t border-[#2a2e39]/50 py-8 px-4 md:px-8 mt-12 text-[#b8a896] font-telemetry text-xs relative z-10 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
            <span>TravelPilot Autonomous Orchestration Engine v4.8 • Golden Ratio ($\Phi = 1.618$) Geometry</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Server Port: 3000 (Cloud Run)</span>
            <span>AES-256-GCM Cryptographic Ledger</span>
            <span>Sub-15ms Graph Resolver</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={(newSettings) => setNotificationSettings((prev) => ({ ...prev, ...newSettings }))}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        devices={devices}
        onLogin={(email) => setUser((prev) => ({ ...prev, email }))}
      />

      <PassbookModal
        isOpen={isPassbookOpen}
        onClose={() => setIsPassbookOpen(false)}
        tripTitle={trip.title}
      />
    </div>
  );
}
