import React, { useState, useEffect, useRef } from 'react';

interface VoiceCommandControllerProps {
  onSimulateDisruption: () => void;
  onApplyPlan: (planId: string) => void;
  onResetTrip: () => void;
  onOpenPassbook?: () => void;
}

export const VoiceCommandController: React.FC<VoiceCommandControllerProps> = ({
  onSimulateDisruption,
  onApplyPlan,
  onResetTrip,
  onOpenPassbook,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      const lowerText = currentTranscript.toLowerCase().trim();
      setTranscript(lowerText);

      // Match voice commands
      if (
        lowerText.includes('emergency override') ||
        lowerText.includes('emergency') ||
        lowerText.includes('override') ||
        lowerText.includes('simulate disruption')
      ) {
        onSimulateDisruption();
        triggerCommandFeedback('EMERGENCY OVERRIDE TRIGGERED (+85m Delay Simulated)');
        recognition.stop();
        setIsListening(false);
      } else if (
        lowerText.includes('re-route plan') ||
        lowerText.includes('reroute plan') ||
        lowerText.includes('reroute') ||
        lowerText.includes('re route') ||
        lowerText.includes('apply plan')
      ) {
        onApplyPlan('plan_minimal_shift');
        triggerCommandFeedback('RE-ROUTE PLAN APPLIED (Top Counterfactual Committed)');
        recognition.stop();
        setIsListening(false);
      } else if (
        lowerText.includes('reset baseline') ||
        lowerText.includes('reset trip') ||
        lowerText.includes('reset')
      ) {
        onResetTrip();
        triggerCommandFeedback('TRIP BASELINE RESET TO NOMINAL');
        recognition.stop();
        setIsListening(false);
      } else if (
        (lowerText.includes('export passbook') || lowerText.includes('wallet') || lowerText.includes('passbook')) &&
        onOpenPassbook
      ) {
        onOpenPassbook();
        triggerCommandFeedback('PASSBOOK & WALLET OPENED');
        recognition.stop();
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onSimulateDisruption, onApplyPlan, onResetTrip, onOpenPassbook]);

  // Keyboard accessibility shortcut (Alt + V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  const triggerCommandFeedback = (msg: string) => {
    setLastCommand(msg);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Simulated Fallback for browsers without Web Speech API
      if (!isListening) {
        setIsListening(true);
        setTranscript('Simulating voice input: "Emergency Override"...');
        setTimeout(() => {
          onSimulateDisruption();
          triggerCommandFeedback('VOICE OVERRIDE EXECUTED (+85m Delay)');
          setIsListening(false);
          setTranscript('');
        }, 1200);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      {/* MINIMALIST VOICE TRIGGER BUTTON */}
      <button
        onClick={toggleListening}
        aria-label="Toggle Voice Control Speech Recognition (Keyboard shortcut: Alt+V)"
        title="Voice Commands: Say 'Emergency Override', 'Re-route Plan', or 'Reset Baseline' (Alt+V)"
        className={`px-3 py-2 rounded-xl font-telemetry text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md border ${
          isListening
            ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#fca5a5] shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
            : 'bg-[#181c26] border-[#2a2e39]/60 hover:border-[#f59e0b]/50 text-[#e1e2ec] hover:text-[#ffc174]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <span className={`material-symbols-outlined text-base ${isListening ? 'animate-bounce text-[#ef4444]' : 'text-[#f59e0b]'}`}>
            {isListening ? 'mic' : 'mic_none'}
          </span>
          {isListening && (
            <span className="absolute -inset-1 rounded-full bg-[#ef4444]/30 animate-ping"></span>
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="leading-none text-[11px] font-bold">
            {isListening ? 'Listening Voice Commands...' : 'Voice Assist'}
          </span>
          <span className="text-[9px] text-[#b8a896] leading-none mt-0.5">Alt + V</span>
        </div>
      </button>

      {/* LIVE TRANSCRIPT FEEDBACK POPOVER */}
      {isListening && (
        <div
          aria-live="polite"
          className="absolute top-12 left-0 z-50 bg-[#07090f]/95 border-2 border-[#f59e0b] p-3 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] w-72 backdrop-blur-md flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between font-telemetry text-[10px] text-[#ffc174] uppercase font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
              Say A Command
            </span>
            <span>Speech API</span>
          </div>

          <p className="font-sans text-xs text-[#e1e2ec] italic bg-[#13161f] p-2 rounded border border-[#2a2e39]/50 min-h-[36px]">
            {transcript || '"Emergency Override", "Re-route Plan", "Reset Baseline"'}
          </p>

          <div className="flex items-center justify-between font-telemetry text-[9px] text-[#b8a896]">
            <span>Try: "Emergency Override"</span>
            <span>Or: "Re-route Plan"</span>
          </div>
        </div>
      )}

      {/* COMMAND CONFIRMATION TOAST BANNER */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[90] bg-[#1a140a] border-2 border-[#f59e0b] text-[#ffc174] p-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] font-telemetry text-xs flex items-center gap-3 animate-slide-up backdrop-blur-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[#ffc174] shrink-0">
            <span className="material-symbols-outlined text-lg">graphic_eq</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#ffc174] uppercase text-[10px]">Voice Command Executed</span>
            <span className="font-sans text-xs text-white">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
