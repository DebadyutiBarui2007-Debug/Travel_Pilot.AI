import React from 'react';
import { NotificationSettings, NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: Partial<NotificationSettings>) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#07090f]/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#13161f] border-l border-[#2a2e39]/60 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-[#2a2e39]/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174] text-2xl">notifications_active</span>
              <h2 className="font-display text-lg text-[#e1e2ec] font-bold">Real-Time Alerts & Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#181c26] text-[#b8a896] hover:text-[#e1e2ec] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* GRANULAR NOTIFICATION SETTINGS */}
          <div className="flex flex-col gap-3 bg-[#07090f] border border-[#2a2e39]/50 p-4 rounded-xl">
            <span className="font-telemetry text-xs text-[#ffc174] uppercase font-bold tracking-wider">
              Granular Controls
            </span>

            <div className="flex items-center justify-between py-1 border-b border-[#2a2e39]/30">
              <span className="font-sans text-xs text-[#e1e2ec]">Push Notifications</span>
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={(e) => onUpdateSettings({ pushEnabled: e.target.checked })}
                className="accent-[#f59e0b] cursor-pointer w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#2a2e39]/30">
              <span className="font-sans text-xs text-[#e1e2ec]">In-App Broadcasts</span>
              <input
                type="checkbox"
                checked={settings.inAppEnabled}
                onChange={(e) => onUpdateSettings({ inAppEnabled: e.target.checked })}
                className="accent-[#f59e0b] cursor-pointer w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#2a2e39]/30">
              <span className="font-sans text-xs text-[#e1e2ec]">Flight Delay & Radar Alerts</span>
              <input
                type="checkbox"
                checked={settings.flightDelays}
                onChange={(e) => onUpdateSettings({ flightDelays: e.target.checked })}
                className="accent-[#f59e0b] cursor-pointer w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#2a2e39]/30">
              <span className="font-sans text-xs text-[#e1e2ec]">Slack Buffer Breaches</span>
              <input
                type="checkbox"
                checked={settings.slackBufferBreaches}
                onChange={(e) => onUpdateSettings({ slackBufferBreaches: e.target.checked })}
                className="accent-[#f59e0b] cursor-pointer w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="font-sans text-xs text-[#e1e2ec]">Audio Chime</span>
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) => onUpdateSettings({ soundAlerts: e.target.checked })}
                className="accent-[#f59e0b] cursor-pointer w-4 h-4"
              />
            </div>
          </div>

          {/* LIVE ALERTS HISTORY */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-telemetry text-xs text-[#b8a896] uppercase">Active Alert Feed</span>
              <button
                onClick={onMarkAllRead}
                className="font-telemetry text-xs text-[#ffc174] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-lg border flex flex-col gap-1 ${
                    n.type === 'alert'
                      ? 'bg-[#1e0f0e] border-[#f59e0b]'
                      : n.type === 'success'
                      ? 'bg-[#0f1f18] border-[#7bd0ff]'
                      : 'bg-[#181c26] border-[#2a2e39]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-[#e1e2ec]">{n.title}</span>
                    <span className="font-telemetry text-[10px] text-[#b8a896]">{n.timestamp}</span>
                  </div>
                  <p className="font-sans text-xs text-[#b8a896] leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#181c26] hover:bg-[#202532] text-[#e1e2ec] font-sans text-xs font-semibold rounded-lg border border-[#2a2e39] transition-colors cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
