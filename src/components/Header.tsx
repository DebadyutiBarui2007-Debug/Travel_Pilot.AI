import React, { useState } from 'react';
import { UserProfile, TelemetryMetrics } from '../types';
import { UserAvatar } from './UserAvatar';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  telemetry: TelemetryMetrics;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  isMissionConfirmed: boolean;
  onAttemptLockedTab: (tabLabel: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  user,
  telemetry,
  unreadCount,
  onOpenNotifications,
  onOpenAuth,
  isMissionConfirmed,
  onAttemptLockedTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'mission-control-dashboard', label: 'Mission Control' },
    { id: 'autonomous-dag-workspace', label: 'Autonomous Workspace' },
    { id: 'contingency-protocols', label: 'Contingency Protocols' },
    { id: 'telemetry-audit-log', label: 'Telemetry & Audit' },
  ];

  const handleTabClick = (tabId: string, tabLabel: string) => {
    if (!isMissionConfirmed && tabId !== 'mission-control-dashboard') {
      onAttemptLockedTab(tabLabel);
      return;
    }
    onTabChange(tabId);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#07090f]/95 backdrop-blur-xl border-b border-[#2a2e39]/60 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Logo Branding */}
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          onClick={() => onTabChange('mission-control-dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#202532] to-[#13161f] border border-[#f59e0b] flex items-center justify-center text-[#ffc174] shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform shrink-0">
            <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg text-[#e1e2ec] tracking-tight leading-none font-bold">
              TravelPilot
            </span>
            <span className="font-telemetry text-[10px] text-[#ffc174] tracking-widest uppercase mt-0.5 font-semibold flex items-center gap-1">
              <span className="hidden sm:inline">Autonomous Avionics</span>
              {isMissionConfirmed ? (
                <span className="text-[#10b981] text-[9px] font-extrabold px-1 rounded bg-[#10b981]/10 border border-[#10b981]/30">UNLOCKED</span>
              ) : (
                <span className="text-[#f59e0b] text-[9px] font-extrabold px-1 rounded bg-[#f59e0b]/10 border border-[#10b981]/30">LOCKED</span>
              )}
            </span>
          </div>
        </div>

        {/* Live Engine Status Monitors (Compact on large screens, hidden on medium) */}
        <div className="hidden 2xl:flex items-center gap-3 px-3.5 py-1.5 bg-[#13161f]/80 border border-[#2a2e39]/50 rounded-full shadow-inner shrink-0">
          <div className="flex items-center gap-2 px-1.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse"></span>
            <span className="font-telemetry text-xs text-[#b8a896]">DAG Engine:</span>
            <span className="font-telemetry text-xs text-[#7bd0ff] font-semibold">{telemetry.dagCollisions} Collisions</span>
          </div>
          <div className="w-px h-3 bg-[#2a2e39]"></div>
          <div className="flex items-center gap-2 px-1.5 py-0.5">
            <span className="font-telemetry text-xs text-[#b8a896]">Sync:</span>
            <span className="font-telemetry text-xs text-[#ffc258] font-semibold">{telemetry.syncDelayMs}ms</span>
          </div>
          <div className="w-px h-3 bg-[#2a2e39]"></div>
          <div className="flex items-center gap-2 px-1.5 py-0.5">
            <span className="font-telemetry text-xs text-[#b8a896]">Solver:</span>
            <span className="font-telemetry text-xs text-[#ffc174] font-semibold">{telemetry.twvrpStatus}</span>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#13161f]/90 p-1 border border-[#2a2e39]/40 rounded-xl max-w-full overflow-x-auto shrink">
          {tabs.map((tab) => {
            const isLocked = !isMissionConfirmed && tab.id !== 'mission-control-dashboard';
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.label)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#f59e0b] text-[#3d2400] font-bold shadow-sm'
                    : isLocked
                    ? 'text-[#b8a896]/60 hover:text-[#b8a896] hover:bg-[#181c26]'
                    : 'text-[#b8a896] hover:text-[#e1e2ec] hover:bg-[#202532]'
                }`}
              >
                <span>{tab.label}</span>
                {isLocked && (
                  <span className="material-symbols-outlined text-xs text-[#f59e0b]">lock</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Notifications, User Profile & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto">
          {/* Notification Trigger Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-[#13161f] border border-[#2a2e39]/70 text-[#b8a896] hover:text-[#e1e2ec] hover:border-[#f59e0b]/60 transition-all cursor-pointer shrink-0 shadow-sm"
            title="Notifications & Alerts"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f59e0b] text-[#3d2400] font-telemetry text-[10px] font-bold flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Button - FIXED & PROMINENTLY ACCESSIBLE */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#13161f] border border-[#2a2e39]/70 hover:border-[#f59e0b]/60 hover:bg-[#181c26] transition-all cursor-pointer shrink-0 shadow-sm"
            title="Manage Profile & Security Credentials"
          >
            <div className="relative shrink-0">
              <UserAvatar src={user.avatarUrl} name={user.name} className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-2 ring-[#07090f] shadow-sm"></span>
            </div>

            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="font-sans text-xs font-bold text-[#e1e2ec] leading-none">{user.name}</span>
              <span className="font-telemetry text-[9px] text-[#ffc174] tracking-wider uppercase font-semibold mt-0.5 bg-[#202532] px-1.5 py-0.2 rounded border border-[#f59e0b]/30">
                {user.tier}
              </span>
            </div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-[#13161f] border border-[#2a2e39]/70 text-[#b8a896] hover:text-[#e1e2ec] cursor-pointer shrink-0"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07090f]/98 border-b border-[#2a2e39]/60 p-4 flex flex-col gap-2 animate-fade-in shadow-2xl">
          {tabs.map((tab) => {
            const isLocked = !isMissionConfirmed && tab.id !== 'mission-control-dashboard';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabClick(tab.id, tab.label);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl font-sans text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#f59e0b] text-[#3d2400] font-bold'
                    : 'text-[#b8a896] bg-[#13161f] border border-[#2a2e39]/50 hover:text-[#e1e2ec]'
                }`}
              >
                <span>{tab.label}</span>
                {isLocked && (
                  <span className="material-symbols-outlined text-sm text-[#f59e0b]">lock</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

