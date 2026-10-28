import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, ChevronRight, Recycle, HelpCircle, Loader2 } from 'lucide-react';
import { WasteItem } from '../types/waste';
import { STREAM_BINS, PRELOADED_WASTE_ITEMS } from '../data/wasteCatalog';
import { audioEngine } from '../services/audioEngine';
import { BinTooltip } from './BinTooltip';

interface GuidanceTerminalViewProps {
  activeItem: WasteItem;
  onSelectItem: (item: WasteItem) => void;
  onOpenWishcyclingInfo: (item: WasteItem) => void;
}

export const GuidanceTerminalView: React.FC<GuidanceTerminalViewProps> = ({
  activeItem,
  onSelectItem,
  onOpenWishcyclingInfo
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isScanning, setIsScanning] = useState(false);

  const targetBin = STREAM_BINS[activeItem.targetBinId];

  const handleToggleStep = (stepIndex: number) => {
    const key = `${activeItem.id}_${stepIndex}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    audioEngine.playSensorChirp();
  };

  const handleSimulateScan = (item: WasteItem) => {
    setIsScanning(true);
    audioEngine.playSensorChirp();
    setTimeout(() => {
      onSelectItem(item);
      setIsScanning(false);
      if (item.isWishcyclingRisk) {
        audioEngine.playContaminationAlarm();
      } else {
        audioEngine.playSuccessTone();
      }
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Mode High-Contrast Banner Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Point-of-Deposit Guidance Terminal
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Real-Time Material Verification & Chute Routing
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Place an item under the sensor scanner. The spectral sensor identifies polymer structure and soil contamination in milliseconds, providing deterministic disposal commands to eliminate wishcycling.
          </p>
        </div>

        {/* Item Selector / Simulation Scanner */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Place Item:</span>
          {PRELOADED_WASTE_ITEMS.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSimulateScan(item)}
              disabled={isScanning}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all flex items-center gap-1.5 ${
                activeItem.id === item.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              } ${isScanning ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isScanning && activeItem.id === item.id && (
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              )}
              <span>{item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Large-Format Deterministic Verdict Beacon */}
      <div 
        className="rounded-2xl p-6 md:p-8 border-2 transition-all shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: targetBin ? targetBin.bgLightHex : '#0f172a',
          borderColor: targetBin ? targetBin.colorHex : '#38bdf8'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Big Verdict */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span 
                className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-md font-bold"
                style={{
                  backgroundColor: `${targetBin.colorHex}25`,
                  color: targetBin.textColorHex,
                  border: `1px solid ${targetBin.colorHex}60`
                }}
              >
                Verified Destination Chute
              </span>

              {activeItem.isWishcyclingRisk && (
                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Wishcycling Intercepted
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ color: targetBin.textColorHex }}
              >
                {targetBin.shortCode}
              </h1>
              <p className="text-base font-semibold text-slate-200">
                {targetBin.name}
              </p>
            </div>

            {/* Hover Tooltip to explain technical polymer meanings */}
            <div className="pt-0.5">
              <BinTooltip binId={targetBin.id} align="left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 hover:border-cyan-400 text-xs text-slate-300 transition-all shadow-sm">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    What is <strong className="text-white">{targetBin.technicalAcronym.split('(')[0].trim()}</strong>? Hover cursor for meaning
                  </span>
                </div>
              </BinTooltip>
            </div>

            <p className="text-lg font-semibold text-slate-100">
              Scanned Item: {activeItem.name}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
              <span>Polymer: <strong className="text-white">{activeItem.primaryMaterial}</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Weight: <strong className="text-white tabular-nums">{activeItem.weightGrams}g</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Grease: <strong className={activeItem.greaseSaturationPct > 15 ? 'text-rose-400' : 'text-emerald-400'}>{activeItem.greaseSaturationPct}%</strong></span>
            </div>

            {/* Downstream Destination statement */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
              <span className="font-mono text-slate-400 block mb-0.5">Municipal Destination:</span>
              <p className="font-medium text-slate-200">
                {targetBin.downstreamDestination}
              </p>
            </div>
          </div>

          {/* Right Column: Required Action Checklist */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800/80 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Preparation Checklist Before Deposit
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Mandatory for Purity
              </span>
            </div>

            <div className="space-y-2.5">
              {activeItem.preparationSteps.map((step, idx) => {
                const stepKey = `${activeItem.id}_${idx}`;
                const isChecked = completedSteps[stepKey] || false;
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleStep(idx)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-800/70 text-slate-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeItem.isWishcyclingRisk && (
              <button
                onClick={() => onOpenWishcyclingInfo(activeItem)}
                className="mt-3 w-full py-2 px-3 text-xs font-medium text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/80 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Why is this item non-recyclable?</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Downstream Industrial Lifecycle Roadmap (What happens to this waste) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Recycle className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Industrial Circularity Roadmap
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">
              Downstream Journey & Material Transformation
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Circularity Index:
            </span>
            <span className={`text-base font-mono font-extrabold px-2.5 py-0.5 rounded border tabular-nums ${
              activeItem.downstreamProcess.circularityScore >= 80
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                : activeItem.downstreamProcess.circularityScore >= 50
                ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                : 'text-rose-400 bg-rose-950/60 border-rose-800'
            }`}>
              {activeItem.downstreamProcess.circularityScore} / 100
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs font-mono text-slate-400">Primary Reclamation Facility: </span>
          <span className="text-sm font-semibold text-cyan-300">
            {activeItem.downstreamProcess.facilityType}
          </span>
        </div>

        {/* Step-by-step Transformation Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeItem.downstreamProcess.transformationSteps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">
                  Phase 0{idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-snug">
                  {step}
                </p>
              </div>

              {idx < activeItem.downstreamProcess.transformationSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Product Output Card */}
        <div className="mt-5 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-mono">Recovered High-Purity Output:</span>
            <span className="font-semibold text-emerald-300">{activeItem.downstreamProcess.finalProduct}</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Zero-landfill compliance threshold met
          </span>
        </div>
      </div>
    </div>
  );
};
