import React from 'react';
import { X, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WasteItem } from '../types/waste';
import { STREAM_BINS } from '../data/wasteCatalog';
import { BinTooltip } from './BinTooltip';

interface AntiWishcyclingModalProps {
  item: WasteItem | null;
  onClose: () => void;
}

export const AntiWishcyclingModal: React.FC<AntiWishcyclingModalProps> = ({
  item,
  onClose
}) => {
  if (!item) return null;

  const targetBin = STREAM_BINS[item.targetBinId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/70 text-rose-300 rounded-xl border border-rose-800/80">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                Contamination Intercept Audit
              </span>
              <h3 className="text-lg font-bold text-white">
                {item.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Rationale Callout */}
        <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Environmental Engineering Analysis:</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed font-sans">
            {item.wishcyclingReason || 'This item carries physical or chemical properties that compromise mechanical recovery lines, contaminate high-purity recycled bales, or pose equipment damage risks.'}
          </p>
        </div>

        {/* Item Physical Properties Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Material</span>
            <span className="text-slate-200 font-bold">{item.primaryMaterial.slice(0, 16)}</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Grease Saturation</span>
            <span className={item.greaseSaturationPct > 15 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {item.greaseSaturationPct}%
            </span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Weight</span>
            <span className="text-slate-200 font-bold tabular-nums">{item.weightGrams}g</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Physical State</span>
            <span className="text-slate-200 font-bold">
              {item.isCrushed ? 'Crushed' : 'Intact'}
            </span>
          </div>
        </div>

        {/* Required Action Instructions */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Mandatory Preparation Directives
          </span>
          <div className="space-y-1.5">
            {item.preparationSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Destination */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Routing Verdict:</span>
            <BinTooltip binId={targetBin.id} align="left" showIcon={false}>
              <span className="px-2.5 py-1 rounded font-bold font-mono transition-colors cursor-help inline-block" style={{
                backgroundColor: targetBin.bgLightHex,
                color: targetBin.textColorHex,
                border: `1px solid ${targetBin.colorHex}`
              }}>
                {targetBin.shortCode}
              </span>
            </BinTooltip>
            <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
              ({targetBin.name})
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
