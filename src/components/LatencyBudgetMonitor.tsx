import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { LatencyBreakdown } from '../types/waste';

interface LatencyBudgetMonitorProps {
  latency: LatencyBreakdown;
}

export const LatencyBudgetMonitor: React.FC<LatencyBudgetMonitorProps> = ({
  latency
}) => {
  const isWithinBudget = latency.totalLatencyMs <= latency.thresholdMaxMs;
  const percentageOfBudget = Math.min(100, (latency.totalLatencyMs / latency.thresholdMaxMs) * 100);

  const stages = [
    { name: 'Optical Strobe & Stitching', ms: latency.sensorAcquisitionMs, budget: 8, color: 'bg-cyan-500' },
    { name: 'Spectral TensorRT INT8', ms: latency.deepLearningInferenceMs, budget: 22, color: 'bg-blue-500' },
    { name: 'Actuator Trajectory Calc', ms: latency.actuatorTriggerCalcMs, budget: 4, color: 'bg-indigo-500' },
    { name: 'Industrial PLC Handshake', ms: latency.plcHandshakeMs, budget: 6, color: 'bg-emerald-500' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Real-Time Latency Budget (&lt;50ms Ceiling)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
            isWithinBudget 
              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80' 
              : 'text-rose-400 bg-rose-950/40 border-rose-800/80'
          }`}>
            {latency.totalLatencyMs.toFixed(1)} ms / {latency.thresholdMaxMs} ms
          </span>
        </div>
      </div>

      {/* Progress Bar of Budget */}
      <div className="w-full bg-slate-950 rounded-full h-2.5 mb-3 overflow-hidden border border-slate-800 flex">
        {stages.map((stage, idx) => {
          const widthPct = (stage.ms / latency.thresholdMaxMs) * 100;
          return (
            <div
              key={idx}
              style={{ width: `${widthPct}%` }}
              className={`${stage.color} h-full transition-all duration-300`}
              title={`${stage.name}: ${stage.ms.toFixed(1)}ms`}
            />
          );
        })}
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {stages.map((st, idx) => (
          <div key={idx} className="bg-slate-950/70 border border-slate-800/70 rounded p-2 text-center">
            <span className="text-[10px] text-slate-400 truncate block">{st.name}</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-sm font-mono font-bold text-slate-200 tabular-nums">{st.ms.toFixed(1)}</span>
              <span className="text-[10px] font-mono text-slate-500">ms</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">Target: ≤{st.budget}ms</span>
          </div>
        ))}
      </div>

      {/* Footer KPI line without model accuracy or min floor */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Ingestion: <strong className="text-emerald-400">Deterministic Sub-50ms Cycle</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Timing Jitter: <strong className="text-slate-200 tabular-nums">±{latency.jitterMicroseconds} µs</strong></span>
        </div>
      </div>
    </div>
  );
};
