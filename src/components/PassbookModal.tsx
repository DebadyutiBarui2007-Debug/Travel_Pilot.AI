import React from 'react';

interface PassbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
}

export const PassbookModal: React.FC<PassbookModalProps> = ({ isOpen, onClose, tripTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090f]/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md max-h-[85vh] sm:max-h-[90vh] bg-[#13161f] border border-[#2a2e39]/60 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 my-auto overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#2a2e39]/40 pb-4 sticky top-0 bg-[#13161f] z-10">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ffc174] text-2xl">wallet</span>
            <h2 className="font-display text-lg text-[#e1e2ec] font-bold">Apple Wallet / Passbook Export</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181c26] text-[#b8a896] hover:text-[#e1e2ec] transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* PASSBOOK BOARDING PASS CARD */}
        <div className="bg-gradient-to-br from-[#202532] to-[#13161f] border-2 border-[#f59e0b] rounded-2xl p-5 flex flex-col gap-4 text-[#e1e2ec] shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2a2e39]/60 pb-3">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-telemetry text-[10px] text-[#ffc174] uppercase font-bold">TRAVELPILOT AVIONICS</span>
              <span className="font-display text-sm font-bold truncate">{tripTitle}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#f59e0b] text-[#3d2400] font-telemetry text-[10px] font-extrabold shrink-0">
              EXECUTIVE VIP
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 font-telemetry text-xs">
            <div>
              <span className="text-[#b8a896] text-[10px] uppercase">Passenger</span>
              <div className="font-bold text-[#e1e2ec] mt-0.5">JULIAN STERLING</div>
            </div>
            <div>
              <span className="text-[#b8a896] text-[10px] uppercase">Cryptographic Key</span>
              <div className="font-bold text-[#7bd0ff] mt-0.5">0x8F92...C14E</div>
            </div>
          </div>

          <div className="p-3 bg-[#07090f] border border-[#2a2e39]/40 rounded-xl flex items-center justify-center gap-3">
            {/* SIMULATED QR CODE */}
            <div className="w-20 h-20 bg-white p-1 rounded flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-black flex flex-wrap gap-0.5 p-1">
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-black"></div>
              </div>
            </div>
            <div className="flex flex-col font-telemetry text-xs text-[#b8a896]">
              <span className="text-[#ffc174] font-bold">Scan at Hotel & VIP Lounges</span>
              <span>Offline Cryptographic Proof</span>
              <span>Valid across Paris, Milan & Como</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] text-[#3d2400] font-sans text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Add to Apple Wallet / Download PKPass</span>
        </button>
      </div>
    </div>
  );
};
