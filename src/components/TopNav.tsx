import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface TopNavProps {
  activeTab: 'telemetry' | 'guidance' | 'analytics' | 'calibration' | 'taxonomy';
  onSelectTab: (tab: 'telemetry' | 'guidance' | 'analytics' | 'calibration' | 'taxonomy') => void;
  onOpenTestDrop: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenTestDrop,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark in display face */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onSelectTab('telemetry'); }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          SortIQ PureStream OS
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
            activeTab === 'telemetry' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Live Telemetry
        </button>
        <button
          onClick={() => onSelectTab('guidance')}
          className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
            activeTab === 'guidance' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Guidance Terminal
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
            activeTab === 'analytics' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Purity Analytics
        </button>
        <button
          onClick={() => onSelectTab('calibration')}
          className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
            activeTab === 'calibration' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Hardware Calibration
        </button>
        <button
          onClick={() => onSelectTab('taxonomy')}
          className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
            activeTab === 'taxonomy' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Wishcycling Standards
        </button>
      </nav>

      {/* Zone 3: Primary Action & Utilities */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Industrial Acoustics' : 'Enable Industrial Acoustics'}
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          aria-label={soundEnabled ? 'Mute acoustics' : 'Enable acoustics'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={onOpenTestDrop}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-sm shadow-cyan-950 whitespace-nowrap shrink-0 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test Custom Item</span>
        </button>
      </div>
    </header>
  );
};
