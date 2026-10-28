import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, Monitor, ShieldAlert } from 'lucide-react';
import { FacilityProfile } from '../types/waste';

interface ToolbarProps {
  viewMode: 'mrf' | 'guidance';
  onChangeViewMode: (mode: 'mrf' | 'guidance') => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onSingleStep: () => void;
  onResetStream: () => void;
  conveyorSpeed: number;
  onChangeSpeed: (speed: number) => void;
  activeFacility: FacilityProfile;
  onChangeFacility: (facility: FacilityProfile) => void;
  facilities: FacilityProfile[];
  activeContaminationCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onChangeViewMode,
  isRunning,
  onToggleRunning,
  onSingleStep,
  onResetStream,
  conveyorSpeed,
  onChangeSpeed,
  activeFacility,
  onChangeFacility,
  facilities,
  activeContaminationCount
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* View Mode Segmented Control (Allowed functional buttons) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => onChangeViewMode('mrf')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'mrf'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Industrial MRF Console</span>
          </button>
          <button
            onClick={() => onChangeViewMode('guidance')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'guidance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Source-Segregation Kiosk</span>
          </button>
        </div>

        {activeContaminationCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2.5 py-1 rounded-md font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{activeContaminationCount} Contaminant Intercepts Active</span>
          </div>
        )}
      </div>

      {/* Sensor Conveyor & Simulation Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Facility Profile Selector */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="facility-select" className="text-slate-400 font-medium whitespace-nowrap">Location:</label>
          <select
            id="facility-select"
            value={activeFacility.id}
            onChange={(e) => {
              const selected = facilities.find(f => f.id === e.target.value);
              if (selected) onChangeFacility(selected);
            }}
            className="bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {facilities.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.location})
              </option>
            ))}
          </select>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 whitespace-nowrap">Conveyor:</span>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.1"
            value={conveyorSpeed}
            onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-cyan-300 tabular-nums w-14">
            {conveyorSpeed.toFixed(2)} m/s
          </span>
        </div>

        {/* Play / Pause / Step Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleRunning}
            className={`p-1.5 rounded-md border text-xs font-medium transition-colors ${
              isRunning 
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-300 hover:bg-amber-900/50' 
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/50'
            }`}
            title={isRunning ? 'Pause Sensor Feed' : 'Run Sensor Feed'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onSingleStep}
            disabled={isRunning}
            className="p-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Advance Single Item Step"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetStream}
            className="p-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Stream Buffer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
