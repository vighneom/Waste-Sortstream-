import React from 'react';
import { Wind, Gauge, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface ActuatorMatrixProps {
  activeValves: number[];
  pneumaticPressureBar: number;
  totalPulsesFired: number;
  misfireRatePct: number;
  timingJitterUs: number;
  onManualTriggerValve?: (valveNum: number) => void;
}

export const ActuatorMatrix: React.FC<ActuatorMatrixProps> = ({
  activeValves,
  pneumaticPressureBar,
  totalPulsesFired,
  misfireRatePct,
  timingJitterUs,
  onManualTriggerValve
}) => {
  const totalValves = 32;
  const valves = Array.from({ length: totalValves }, (_, i) => i + 1);

  const handleManualPurge = (vNum: number) => {
    audioEngine.playPneumaticBlast();
    if (onManualTriggerValve) {
      onManualTriggerValve(vNum);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Pneumatic Air-Jet Manifold (32 Solenoid Valves)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <strong className="text-slate-200 tabular-nums">{pneumaticPressureBar.toFixed(1)} bar</strong>
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Jitter: <strong className="text-slate-200 tabular-nums">±{timingJitterUs} µs</strong></span>
        </div>
      </div>

      {/* 32-valve grid array */}
      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-2 bg-slate-950 border border-slate-800/80 rounded-md">
        {valves.map((vNum) => {
          const isActive = activeValves.includes(vNum);
          return (
            <button
              key={vNum}
              onClick={() => handleManualPurge(vNum)}
              title={`Solenoid Valve #${vNum} (Click to manual purge)`}
              className={`h-9 flex flex-col items-center justify-center rounded text-[10px] font-mono transition-all border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-md shadow-cyan-500/50 scale-105'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-[9px] opacity-70">V</span>
              <span>{vNum}</span>
            </button>
          );
        })}
      </div>

      {/* Actuation telemetry bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fired Pulses: <strong className="text-slate-200 tabular-nums">{totalPulsesFired}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span>Pulse Duration: <strong className="text-slate-200">12ms</strong></span>
          <span aria-hidden="true">·</span>
          <span>Misfire Rate: <strong className="text-emerald-400 tabular-nums">{misfireRatePct.toFixed(3)}%</strong></span>
        </div>
      </div>
    </div>
  );
};
