import React, { useState } from 'react';
import { HelpCircle, Info, Sparkles, Recycle, ArrowRight } from 'lucide-react';
import { StreamBinConfig, StreamBinId } from '../types/waste';
import { STREAM_BINS } from '../data/wasteCatalog';

interface BinTooltipProps {
  binId: StreamBinId;
  children?: React.ReactNode;
  showIcon?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const BinTooltip: React.FC<BinTooltipProps> = ({
  binId,
  children,
  showIcon = true,
  align = 'center',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const bin: StreamBinConfig = STREAM_BINS[binId];

  if (!bin) return null;

  const alignmentClass = 
    align === 'left' ? 'left-0' :
    align === 'right' ? 'right-0' :
    'left-1/2 -translate-x-1/2';

  return (
    <div 
      className={`relative inline-block cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {/* Target Element */}
      {children ? (
        children
      ) : (
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono border transition-all hover:scale-102"
          style={{
            backgroundColor: bin.bgLightHex,
            color: bin.textColorHex,
            borderColor: bin.borderColorHex
          }}
        >
          <span>{bin.shortCode}</span>
          {showIcon && <HelpCircle className="w-3 h-3 opacity-70" />}
        </span>
      )}

      {/* Floating Meaning Tooltip Card (Appears on Hover / Cursor) */}
      {isVisible && (
        <div 
          className={`absolute bottom-full mb-2 ${alignmentClass} w-72 sm:w-80 bg-slate-950/98 border border-slate-700/90 rounded-xl p-3.5 shadow-2xl z-50 text-left pointer-events-none animate-fade-in backdrop-blur-md`}
          style={{ borderColor: bin.colorHex }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Destination Bin & Meaning
              </span>
              <h4 className="text-xs font-bold font-sans" style={{ color: bin.textColorHex }}>
                {bin.name}
              </h4>
            </div>
            <span 
              className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold"
              style={{
                backgroundColor: bin.bgLightHex,
                color: bin.textColorHex,
                border: `1px solid ${bin.borderColorHex}`
              }}
            >
              {bin.shortCode.split('·')[0].trim()}
            </span>
          </div>

          {/* Technical Material Meaning */}
          <div className="space-y-2 text-[11px]">
            <div>
              <span className="text-slate-400 font-mono text-[10px] block">
                Technical Meaning & Polymer:
              </span>
              <p className="text-slate-200 font-medium leading-snug">
                {bin.technicalAcronym}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[10px] block">
                What this material means:
              </span>
              <p className="text-slate-300 leading-snug">
                {bin.meaning.scientificDefinition}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[10px] block">
                Everyday Items That Go Here:
              </span>
              <p className="text-emerald-300 font-medium leading-snug">
                {bin.meaning.everydayExamples}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px]">
              <span className="text-slate-400 font-mono block">Why Proper Sorting Matters:</span>
              <p className="text-slate-300 italic leading-snug mt-0.5">
                {bin.meaning.whyItMatters}
              </p>
            </div>
          </div>

          {/* Subtle triangle arrow */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950"
          />
        </div>
      )}
    </div>
  );
};
