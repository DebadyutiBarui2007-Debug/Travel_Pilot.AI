import React, { useState } from 'react';
import { UserProfile, ActiveDevice } from '../types';
import { UserAvatar } from './UserAvatar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  devices: ActiveDevice[];
  onLogin: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  devices: initialDevices,
  onLogin,
}) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••••••');
  const [devicesList, setDevicesList] = useState<ActiveDevice[]>(initialDevices);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncStatus('Initiating AES-256 Key Exchange across active nodes...');

    setTimeout(() => {
      onLogin(email);
      setIsSyncing(false);
      setSyncStatus('Authentication successful! Sessions synchronized.');
      setTimeout(() => {
        setSyncStatus(null);
        onClose();
      }, 600);
    }, 800);
  };

  const handleRotateKey = () => {
    setIsSyncing(true);
    setSyncStatus('Rotating Ephemeral Cipher Keys (ECDH-384)...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('New Key Hash Generated: 0x' + Math.random().toString(16).substring(2, 10) + '... Verified');
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1000);
  };

  const handleDisconnectDevice = (id: string) => {
    setDevicesList((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090f]/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] bg-[#13161f] border border-[#2a2e39]/60 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 my-auto overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#2a2e39]/40 pb-4 sticky top-0 bg-[#13161f] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#ffc174] shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h2 className="font-display text-lg text-[#e1e2ec] font-bold leading-tight">
                Multi-Device Cryptographic Auth
              </h2>
              <p className="font-telemetry text-xs text-[#b8a896]">AES-256 GCM Key Exchange Active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181c26] text-[#b8a896] hover:text-[#e1e2ec] transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* STATUS BANNER */}
        {syncStatus && (
          <div className="p-3 bg-[#1e1b12] border border-[#f59e0b]/50 rounded-xl font-telemetry text-xs text-[#ffc174] flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            <span>{syncStatus}</span>
          </div>
        )}

        {/* USER PROFILE CARD */}
        <div className="p-4 bg-[#07090f] border border-[#2a2e39]/50 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar src={user.avatarUrl} name={user.name} className="w-12 h-12" />
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-sm font-bold text-[#e1e2ec] truncate">{user.name}</span>
              <span className="font-telemetry text-xs text-[#ffc174] truncate">{user.email}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#202532] text-[#7bd0ff] border border-[#7bd0ff]/30 font-telemetry text-xs font-bold shrink-0">
            {user.tier}
          </span>
        </div>

        {/* CONNECTED DEVICES SYNCHRONIZATION */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-telemetry text-xs text-[#b8a896] uppercase font-semibold">
              Synchronized Devices ({devicesList.length})
            </span>
            <button
              type="button"
              onClick={handleRotateKey}
              className="font-telemetry text-xs text-[#ffc174] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">key_visualizer</span>
              Rotate Keys
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {devicesList.map((d) => (
              <div
                key={d.id}
                className="p-3 bg-[#181c26] border border-[#2a2e39]/40 rounded-lg flex items-center justify-between font-telemetry text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-base text-[#ffc174] shrink-0">
                    {d.deviceName.includes('MacBook')
                      ? 'laptop_mac'
                      : d.deviceName.includes('iPhone')
                      ? 'smartphone'
                      : 'tablet_mac'}
                  </span>
                  <span className="text-[#e1e2ec] font-medium truncate">{d.deviceName}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={d.isCurrent ? 'text-[#7bd0ff] font-bold' : 'text-[#b8a896]'}>{d.lastActive}</span>
                  {!d.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleDisconnectDevice(d.id)}
                      className="text-[#b8a896] hover:text-[#ff6b6b] p-0.5 rounded transition-colors cursor-pointer"
                      title="Disconnect device"
                    >
                      <span className="material-symbols-outlined text-sm">no_sim</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUTHENTICATION / LOGIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-[#2a2e39]/40 pt-4">
          <div className="flex flex-col gap-1">
            <label className="font-telemetry text-xs text-[#b8a896]">Executive Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-telemetry text-xs text-[#b8a896]">Security Token / Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#07090f] border border-[#2a2e39]/60 p-2.5 rounded-lg text-[#e1e2ec] font-sans text-xs outline-none focus:border-[#f59e0b] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-[#3d2400] font-sans text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>{isSyncing ? 'Authenticating & Synchronizing...' : 'Authenticate & Sync Sessions'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
