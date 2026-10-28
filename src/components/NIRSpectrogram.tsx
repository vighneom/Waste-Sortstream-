import React, { useState } from 'react';
import { WasteItem } from '../types/waste';

interface NIRSpectrogramProps {
  item: WasteItem | null;
  ambientNoiseLevel?: number;
}

export const NIRSpectrogram: React.FC<NIRSpectrogramProps> = ({ item, ambientNoiseLevel = 0.02 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ wave: number; ref: number; x: number; y: number } | null>(null);

  const width = 540;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minWave = 900;
  const maxWave = 1700;
  const minRef = 0.0;
  const maxRef = 1.0;

  const points = item?.spectralPoints || [
    { wavelengthNm: 900, reflectance: 0.8 },
    { wavelengthNm: 1100, reflectance: 0.78 },
    { wavelengthNm: 1300, reflectance: 0.82 },
    { wavelengthNm: 1500, reflectance: 0.79 },
    { wavelengthNm: 1700, reflectance: 0.81 }
  ];

  // Map wave to X
  const scaleX = (wave: number) => padding.left + ((wave - minWave) / (maxWave - minWave)) * graphWidth;
  // Map ref to Y (inverted)
  const scaleY = (ref: number) => padding.top + graphHeight - ((ref - minRef) / (maxRef - minRef)) * graphHeight;

  // Generate SVG path for the curve
  const pathData = points.reduce((acc, curr, index) => {
    const x = scaleX(curr.wavelengthNm);
    const y = scaleY(curr.reflectance);
    return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill path
  const areaPath = `${pathData} L ${scaleX(points[points.length - 1].wavelengthNm)} ${scaleY(0)} L ${scaleX(points[0].wavelengthNm)} ${scaleY(0)} Z`;

  // Standard reference markers for key polymers
  const referencePeaks = [
    { wave: 1130, label: 'PET C-H 3rd', color: '#06b6d4' },
    { wave: 1215, label: 'HDPE -CH2-', color: '#3b82f6' },
    { wave: 1450, label: 'H2O Moisture', color: '#10b981' },
    { wave: 1490, label: 'Cellulose O-H', color: '#f59e0b' },
    { wave: 1660, label: 'PET Ester', color: '#06b6d4' },
    { wave: 1730, label: 'HDPE 1st Over', color: '#3b82f6' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            NIR Spectroscopy Array (900nm – 1700nm)
          </span>
          <p className="text-sm font-semibold text-slate-200">
            {item ? item.primaryMaterial : 'Idle / White Reference Tile'}
          </p>
        </div>
        <div className="text-right text-xs font-mono text-slate-400">
          <span>Dominant Peak: </span>
          <span className="text-cyan-400 font-bold tabular-nums">
            {item?.dominantPeakNm ? `${item.dominantPeakNm} nm` : 'None (Baseline)'}
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="nirGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
            const y = scaleY(val);
            return (
              <g key={val}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={width - padding.right} 
                  y2={y} 
                  stroke="#1e293b" 
                  strokeWidth="1" 
                  strokeDasharray="2 3"
                />
                <text 
                  x={padding.left - 8} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="text-[10px] fill-slate-500 font-mono tabular-nums"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Vertical wavelength grid */}
          {[900, 1100, 1300, 1500, 1700].map((wave) => {
            const x = scaleX(wave);
            return (
              <g key={wave}>
                <line 
                  x1={x} 
                  y1={padding.top} 
                  x2={x} 
                  y2={height - padding.bottom} 
                  stroke="#1e293b" 
                  strokeWidth="1" 
                />
                <text 
                  x={x} 
                  y={height - padding.bottom + 16} 
                  textAnchor="middle" 
                  className="text-[10px] fill-slate-400 font-mono tabular-nums"
                >
                  {wave}nm
                </text>
              </g>
            );
          })}

          {/* Reference peak marker lines */}
          {referencePeaks.map((ref) => {
            const x = scaleX(ref.wave);
            return (
              <line
                key={ref.wave}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={height - padding.bottom}
                stroke={ref.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#nirGradient)" />

          {/* Main Curve */}
          <path 
            d={pathData} 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const cx = scaleX(pt.wavelengthNm);
            const cy = scaleY(pt.reflectance);
            const isHovered = hoveredPoint?.wave === pt.wavelengthNm;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 2.5}
                className="fill-cyan-300 stroke-slate-950 stroke-1 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint({ wave: pt.wavelengthNm, ref: pt.reflectance, x: cx, y: cy })}
              />
            );
          })}

          {/* Hairline interactive crosshair */}
          {hoveredPoint && (
            <g>
              <line 
                x1={hoveredPoint.x} 
                y1={padding.top} 
                x2={hoveredPoint.x} 
                y2={height - padding.bottom} 
                stroke="#67e8f9" 
                strokeWidth="1" 
                strokeDasharray="2 2"
              />
              <line 
                x1={padding.left} 
                y1={hoveredPoint.y} 
                x2={width - padding.right} 
                y2={hoveredPoint.y} 
                stroke="#67e8f9" 
                strokeWidth="1" 
                strokeDasharray="2 2"
              />
              <circle 
                cx={hoveredPoint.x} 
                cy={hoveredPoint.y} 
                r="4.5" 
                className="fill-cyan-400 stroke-white stroke-2"
              />
            </g>
          )}
        </svg>

        {hoveredPoint && (
          <div 
            className="absolute z-20 pointer-events-none bg-slate-950/95 border border-cyan-500/40 rounded px-2 py-1 text-[11px] font-mono shadow-md"
            style={{ 
              left: `${Math.min(Math.max(10, (hoveredPoint.x / width) * 100), 75)}%`, 
              top: '12px' 
            }}
          >
            <span className="text-slate-300">{hoveredPoint.wave} nm: </span>
            <span className="text-cyan-300 font-bold">{hoveredPoint.ref.toFixed(3)} R</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span>Resolution: 40nm</span>
          <span aria-hidden="true">·</span>
          <span>SNR: {(42.5 - ambientNoiseLevel * 100).toFixed(1)} dB</span>
          <span aria-hidden="true">·</span>
          <span>Integration: 1.8ms</span>
        </div>
        <div className="text-slate-400">
          Target: {item?.primaryMaterial.slice(0, 24) || 'Idle'}
        </div>
      </div>
    </div>
  );
};
