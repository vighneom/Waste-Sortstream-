import React, { useState } from 'react';
import { Camera, Radio, Scale, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import { WasteItem, LatencyBreakdown, ActuatorCommandLog } from '../types/waste';
import { STREAM_BINS, PRELOADED_WASTE_ITEMS } from '../data/wasteCatalog';
import { NIRSpectrogram } from './NIRSpectrogram';
import { ActuatorMatrix } from './ActuatorMatrix';
import { LatencyBudgetMonitor } from './LatencyBudgetMonitor';
import { BinTooltip } from './BinTooltip';

interface IndustrialConveyorViewProps {
  activeItem: WasteItem | null;
  beltPositionPct: number; // 0 to 100%
  conveyorSpeedMps: number;
  currentLatency: LatencyBreakdown;
  activeValves: number[];
  pneumaticPressure: number;
  totalPulses: number;
  misfireRate: number;
  recentLogs: ActuatorCommandLog[];
  onSelectTestItem: (item: WasteItem) => void;
  onManualTriggerValve: (valve: number) => void;
  onOpenWishcyclingInfo: (item: WasteItem) => void;
}

export const IndustrialConveyorView: React.FC<IndustrialConveyorViewProps> = ({
  activeItem,
  beltPositionPct,
  conveyorSpeedMps,
  currentLatency,
  activeValves,
  pneumaticPressure,
  totalPulses,
  misfireRate,
  recentLogs,
  onSelectTestItem,
  onManualTriggerValve,
  onOpenWishcyclingInfo
}) => {
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  // Ingestion status based on conveyor position
  // 0% - 25%: Entering / Infeed
  // 25% - 50%: Sensor Array (RGB Camera + NIR Spectrometer + Load Cell)
  // 50% - 75%: Jet Manifold Decision Zone (<50ms calculation)
  // 75% - 100%: Pneumatic Jet Actuation & Chute Deflection
  const isUnderSensor = beltPositionPct >= 20 && beltPositionPct <= 55;
  const isUnderActuator = beltPositionPct > 55 && beltPositionPct <= 85;

  const targetBin = activeItem ? STREAM_BINS[activeItem.targetBinId] : null;

  return (
    <div className="space-y-6">
      {/* Contamination Alert Banner if Wishcycling Risk Detected */}
      {activeItem?.isWishcyclingRisk && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-900/60 rounded-md text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  Contamination Intercept Triggered
                </span>
                <span className="text-xs text-rose-300 font-medium">· Anti-Wishcycling Protocol Active</span>
              </div>
              <p className="text-xs text-rose-200 mt-0.5">
                {activeItem.wishcyclingReason || 'Item contains non-separable composite layers or severe grease saturation.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenWishcyclingInfo(activeItem)}
            className="px-3 py-1 text-xs font-semibold text-rose-200 bg-rose-900/80 hover:bg-rose-850 rounded border border-rose-700 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            Read Engineering Rationale
          </button>
        </div>
      )}

      {/* Main Conveyor Stage & Optical Sensor Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        {/* Stage Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                High-Speed Sorting Conveyor Line 03
              </span>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Tri-Sensor Optical & Pneumatic Stage</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Belt Velocity: {conveyorSpeedMps.toFixed(2)} m/s · 240 FPS Global Shutter)
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonPayload(!showJsonPayload)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showJsonPayload ? 'Hide Telemetry JSON' : 'Inspect Edge Packet'}</span>
            </button>
          </div>
        </div>

        {/* Physical Conveyor Simulation Belt Graphic */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-lg h-56 w-full overflow-hidden flex flex-col justify-between p-3 select-none">
          {/* Top Sensor Stations Gantries */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-4 z-10">
            {/* Station 1: Infeed */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">0.0m</span>
              <span className="text-slate-300">Infeed Hopper</span>
            </div>

            {/* Station 2: Optical & NIR Sensor Head */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors ${
              isUnderSensor ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sensors: RGB + NIR + Load Cell</span>
            </div>

            {/* Station 3: Pneumatic Jet Manifold */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-colors ${
              isUnderActuator ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Air-Jet Manifold (32 Solenoids)</span>
            </div>

            {/* Station 4: Separation Chutes */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300">Bin Chutes A–E</span>
              <span className="text-slate-500">2.8m</span>
            </div>
          </div>

          {/* Conveyor Belt Track */}
          <div className="relative h-24 my-auto bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-y border-slate-800 flex items-center">
            {/* Belt mechanical texture tick lines */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #334155 0px, #334155 2px, transparent 2px, transparent 24px)',
                backgroundPositionX: `${beltPositionPct * 3}px`
              }}
            />

            {/* Sensor Strobe & Scan Beam Overlay */}
            <div className="absolute left-[30%] w-24 h-full bg-cyan-500/10 border-x border-cyan-500/30 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-cyan-400/60 shadow-lg shadow-cyan-400 animate-pulse" />
            </div>

            {/* Pneumatic Blast Jet Zone Overlay */}
            <div className="absolute left-[65%] w-20 h-full bg-indigo-500/10 border-x border-indigo-500/30 flex items-center justify-center pointer-events-none">
              {isUnderActuator && activeValves.length > 0 && (
                <div className="absolute inset-0 bg-cyan-400/20 animate-ping" />
              )}
            </div>

            {/* Traveling Waste Item on the Belt */}
            {activeItem && (
              <div
                className="absolute z-20 flex flex-col items-center transition-all duration-75"
                style={{
                  left: `calc(${beltPositionPct}% - 40px)`,
                  top: '12px'
                }}
              >
                {/* Physical Item Graphic representation */}
                <div className={`px-2.5 py-1.5 rounded border text-xs font-semibold shadow-lg transition-transform ${
                  isUnderSensor ? 'scale-110 border-cyan-400 ring-2 ring-cyan-500/40' : ''
                } ${
                  isUnderActuator ? 'translate-y-2 border-indigo-400' : ''
                }`}
                style={{
                  backgroundColor: targetBin ? targetBin.bgLightHex : '#1e293b',
                  borderColor: targetBin ? targetBin.colorHex : '#475569',
                  color: targetBin ? targetBin.textColorHex : '#f8fafc'
                }}>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>{activeItem.name}</span>
                    <span className="text-[10px] font-mono text-slate-300 tabular-nums">({activeItem.weightGrams}g)</span>
                  </div>
                </div>

                {/* Bounding Box metadata tags */}
                <div className="flex items-center gap-1 text-[9px] font-mono mt-1 text-slate-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-800">
                  {activeItem.isCrushed && <span className="text-amber-400">CRUSHED</span>}
                  {activeItem.greaseSaturationPct > 0 && (
                    <span className="text-rose-400">GREASE: {activeItem.greaseSaturationPct}%</span>
                  )}
                  {activeItem.hasPvcSleeve && <span className="text-rose-400">PVC SLEEVE</span>}
                  {activeItem.hasCarbonBlack && <span className="text-purple-400">CARBON BLACK</span>}
                  {!activeItem.isCrushed && activeItem.greaseSaturationPct === 0 && !activeItem.hasPvcSleeve && !activeItem.hasCarbonBlack && (
                    <span className="text-emerald-400">CLEAN FORM</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Destination Chutes / Bins */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
            {Object.values(STREAM_BINS).map((bin) => {
              const isTargetForCurrent = activeItem?.targetBinId === bin.id;
              return (
                <BinTooltip key={bin.id} binId={bin.id} showIcon={false} className="w-full">
                  <div
                    className={`p-2 rounded border text-center transition-all cursor-help ${
                      isTargetForCurrent && isUnderActuator
                        ? 'ring-2 shadow-lg scale-102'
                        : 'opacity-85 hover:opacity-100 hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: bin.bgLightHex,
                      borderColor: isTargetForCurrent ? bin.colorHex : 'rgba(255,255,255,0.12)',
                      boxShadow: isTargetForCurrent ? `0 0 12px ${bin.colorHex}40` : 'none'
                    }}
                  >
                    <span className="text-[10px] font-mono block font-bold truncate" style={{ color: bin.textColorHex }}>
                      {bin.shortCode}
                    </span>
                    <span className="text-[9px] text-slate-300 truncate block mt-0.5">
                      {bin.simpleName}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono block truncate opacity-80">
                      Hover for meaning
                    </span>
                  </div>
                </BinTooltip>
              );
            })}
          </div>
        </div>

        {/* Quick Item Drop Tray - Allows user to drop specific waste test cases */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
              Drop Test Item on Belt:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRELOADED_WASTE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectTestItem(item)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap ${
                    activeItem?.id === item.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
            <span>Cycle Latency: <strong className="text-cyan-400 tabular-nums">{currentLatency.totalLatencyMs.toFixed(1)} ms</strong></span>
            <span aria-hidden="true">·</span>
            <span>Budget Ceiling: <strong className="text-emerald-400 tabular-nums">&lt;50 ms</strong></span>
          </div>
        </div>

        {/* Optional Live JSON Inspection Drawer */}
        {showJsonPayload && activeItem && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1">
              <span>Edge Telemetry & Actuator Handshake Packet</span>
              <span>Timestamp: {Date.now()}000 µs</span>
            </div>
            <pre className="text-[11px] text-cyan-300 leading-relaxed">
{JSON.stringify({
  sensor_station_id: "MRF_LINE_03_OPT_NIR_01",
  conveyor_speed_mps: conveyorSpeedMps,
  optical_payload: {
    item_id: activeItem.id,
    classification: activeItem.name,
    is_crushed: activeItem.isCrushed,
    grease_saturation_pct: activeItem.greaseSaturationPct,
    pvc_sleeve_detected: activeItem.hasPvcSleeve || false,
    carbon_black_flag: activeItem.hasCarbonBlack || false
  },
  spectral_payload: {
    dominant_polymer: activeItem.primaryMaterial,
    dominant_peak_nm: activeItem.dominantPeakNm,
    confidence_score: 0.984
  },
  gravimetric_payload: {
    measured_weight_grams: activeItem.weightGrams
  },
  actuator_command: {
    target_bank: activeItem.actuatorTarget.manifoldBank,
    valves_fired: activeItem.actuatorTarget.valves,
    blast_duration_ms: activeItem.actuatorTarget.blastDurationMs,
    target_bin: activeItem.targetBinId,
    total_latency_ms: currentLatency.totalLatencyMs
  }
}, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Synchronized Real-Time Tri-Panel Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NIR Hyperspectral Curve */}
        <NIRSpectrogram item={activeItem} />

        {/* 32-Valve Pneumatic Manifold */}
        <ActuatorMatrix
          activeValves={activeValves}
          pneumaticPressureBar={pneumaticPressure}
          totalPulsesFired={totalPulses}
          misfireRatePct={misfireRate}
          timingJitterUs={currentLatency.jitterMicroseconds}
          onManualTriggerValve={onManualTriggerValve}
        />
      </div>

      {/* Latency Budget Monitor */}
      <LatencyBudgetMonitor
        latency={currentLatency}
      />

      {/* Recent Actuation Event Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 transition-all w-full">
        <div 
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          title="Click to toggle expand/collapse"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Actuator Event Stream & Telemetry Audit Trail
            </span>
            {isTableExpanded && (
              <h3 className="text-sm font-semibold text-slate-200">
                Low-Latency Dispatch Log (&lt;50ms Response)
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Showing last {recentLogs.length} events
            </span>
            <button
              type="button"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 cursor-pointer"
            >
              {isTableExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {isTableExpanded && (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3 font-medium">Timestamp</th>
                  <th className="py-2 px-3 font-medium">Item Description</th>
                  <th className="py-2 px-3 font-medium">Polymer / Material</th>
                  <th className="py-2 px-3 font-medium">Destination Bin</th>
                  <th className="py-2 px-3 font-medium">Actuator Bank</th>
                  <th className="py-2 px-3 font-medium text-right">Latency</th>
                  <th className="py-2 px-3 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentLogs.map((log) => {
                  const bin = STREAM_BINS[log.destinationBin];

                  return (
                    <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-2 px-3 text-slate-500 tabular-nums">
                        {log.timestamp}
                      </td>
                      <td className="py-2 px-3 text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{log.item.name}</span>
                          {log.isContaminationIntercept && (
                            <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1 py-0.5 rounded border border-rose-800/60">
                              INTERCEPT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {log.item.primaryMaterial.slice(0, 22)}
                      </td>
                      <td className="py-2 px-3">
                        <BinTooltip binId={log.destinationBin} align="left" showIcon={false}>
                          <span 
                            className="px-2.5 py-1 rounded text-[11px] font-bold border transition-colors inline-flex items-center" 
                            style={{
                              backgroundColor: bin?.bgLightHex || '#1e293b',
                              color: bin?.textColorHex || '#f8fafc',
                              borderColor: bin?.borderColorHex || 'transparent'
                            }}
                          >
                            {bin?.shortCode || log.destinationBin}
                          </span>
                        </BinTooltip>
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {log.actuatorBank} (V{log.valves.join(',')})
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums">
                        <span className={log.latency.totalLatencyMs <= 50 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {log.latency.totalLatencyMs.toFixed(1)} ms
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-300">
                        {(log.confidenceScore * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
