import React, { useState } from 'react';
import { X, Sparkles, Sliders, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { WasteItem, StreamBinId } from '../types/waste';
import { STREAM_BINS } from '../data/wasteCatalog';
import { audioEngine } from '../services/audioEngine';
import { BinTooltip } from './BinTooltip';

interface CustomItemTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployCustomItem: (item: WasteItem) => void;
}

export const CustomItemTesterModal: React.FC<CustomItemTesterModalProps> = ({
  isOpen,
  onClose,
  onDeployCustomItem
}) => {
  const [name, setName] = useState('Takeout Burger Container');
  const [materialType, setMaterialType] = useState<'PET' | 'HDPE' | 'PP' | 'PAPER' | 'ORGANIC' | 'LAMINATE' | 'METAL'>('PAPER');
  const [weightGrams, setWeightGrams] = useState(65);
  const [greasePct, setGreasePct] = useState(24);
  const [isCrushed, setIsCrushed] = useState(true);
  const [hasPvcSleeve, setHasPvcSleeve] = useState(false);
  const [hasCarbonBlack, setHasCarbonBlack] = useState(false);

  if (!isOpen) return null;

  // Real-time classification logic
  let targetBinId: StreamBinId = 'BIN_D_FIBER_CLEAN';
  let isWishcycling = false;
  let reason = '';
  let dominantPeak = 1490;
  let manifold = 'AIR_JET_BANK_04';
  let valves = [14, 15];

  if (materialType === 'PET') {
    dominantPeak = 1130;
    if (hasPvcSleeve) {
      targetBinId = 'BIN_A_PET_CLEAR';
      isWishcycling = true;
      reason = 'PVC shrink label detected. Must be peeled before wash tanks to avoid toxic hydrochloric acid.';
      manifold = 'AIR_JET_BANK_01';
      valves = [5, 6];
    } else {
      targetBinId = 'BIN_A_PET_CLEAR';
      manifold = 'AIR_JET_BANK_01';
      valves = [3, 4];
    }
  } else if (materialType === 'HDPE') {
    dominantPeak = 1215;
    targetBinId = 'BIN_B_HDPE_RIGID';
    manifold = 'AIR_JET_BANK_02';
    valves = [7, 8, 9];
  } else if (materialType === 'ORGANIC') {
    dominantPeak = 1450;
    targetBinId = 'BIN_C_ORGANICS_FOOD_SCRAPS';
    manifold = 'AIR_JET_BANK_03';
    valves = [11, 12];
  } else if (materialType === 'PAPER') {
    dominantPeak = 1490;
    if (greasePct > 15) {
      targetBinId = 'BIN_E_RESIDUAL_LANDFILL';
      isWishcycling = true;
      reason = `Grease saturation (${greasePct}%) exceeds the 15% pulping tolerance threshold. Oil ruins hydrogen bonding in paper mills.`;
      manifold = 'AIR_JET_BANK_05';
      valves = [18, 19];
    } else {
      targetBinId = 'BIN_D_FIBER_CLEAN';
      manifold = 'AIR_JET_BANK_04';
      valves = [14, 15];
    }
  } else if (materialType === 'PP') {
    dominantPeak = 1195;
    if (hasCarbonBlack) {
      targetBinId = 'BIN_E_RESIDUAL_LANDFILL';
      isWishcycling = true;
      reason = 'Carbon black pigment absorbs 100% of NIR radiation, rendering the item invisible to optical sorters.';
      manifold = 'AIR_JET_BANK_05';
      valves = [23, 24];
    } else {
      targetBinId = 'BIN_B_HDPE_RIGID'; // Rigid polyolefins
      manifold = 'AIR_JET_BANK_02';
      valves = [9, 10];
    }
  } else if (materialType === 'LAMINATE') {
    dominantPeak = 1050;
    targetBinId = 'BIN_E_RESIDUAL_LANDFILL';
    isWishcycling = true;
    reason = 'Multi-layer plastic/aluminum laminate cannot be mechanically delaminated.';
    manifold = 'AIR_JET_BANK_05';
    valves = [21, 22];
  } else if (materialType === 'METAL') {
    dominantPeak = 0;
    targetBinId = 'BIN_B_HDPE_RIGID'; // Or secondary metal diverter
    manifold = 'AIR_JET_BANK_02';
    valves = [8, 9];
  }

  const handleDeploy = () => {
    // Generate synthetic spectral curve
    const spectralPoints = [];
    for (let wave = 900; wave <= 1700; wave += 50) {
      const d1 = dominantPeak ? Math.exp(-Math.pow((wave - dominantPeak) / 60, 2)) * 0.45 : 0;
      const ref = hasCarbonBlack ? 0.03 : Math.max(0.05, 0.82 - d1);
      spectralPoints.push({ wavelengthNm: wave, reflectance: parseFloat(ref.toFixed(3)) });
    }

    const newItem: WasteItem = {
      id: `CUSTOM_${Date.now()}`,
      name,
      commonName: `${name} (${materialType})`,
      primaryMaterial: `${materialType} Polymer Matrix`,
      targetBinId,
      targetBinName: STREAM_BINS[targetBinId].name,
      weightGrams,
      greaseSaturationPct: greasePct,
      isCrushed,
      isSoiled: greasePct > 0,
      isOccluded: false,
      hasPvcSleeve,
      hasCarbonBlack,
      isWishcyclingRisk: isWishcycling,
      wishcyclingReason: reason || undefined,
      spectralPoints,
      dominantPeakNm: dominantPeak,
      preparationSteps: [
        greasePct > 15 ? 'Do not place in paper recycling bin' : 'Ensure item is clean and dry',
        hasPvcSleeve ? 'Peel PVC sleeve manually' : 'Deposit in verified chute',
        'Verify with optical sensor'
      ],
      downstreamProcess: {
        facilityType: isWishcycling ? 'Thermal Waste-to-Energy / Landfill' : 'Material Recovery Facility',
        transformationSteps: [
          'Optical recognition scan',
          'Pneumatic air jet sorting',
          isWishcycling ? 'Leachate containment' : 'Flaking and hot wash decontamination'
        ],
        circularityScore: isWishcycling ? 15 : 92,
        finalProduct: isWishcycling ? 'Energy Recovery' : 'High-Purity Secondary Resin'
      },
      actuatorTarget: {
        manifoldBank: manifold,
        valves,
        actuatorType: 'PNEUMATIC_VALVE',
        blastDurationMs: 15
      }
    };

    onDeployCustomItem(newItem);
    audioEngine.playSensorChirp();
    onClose();
  };

  const binConfig = STREAM_BINS[targetBinId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-300 rounded-lg border border-cyan-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Virtual Sensor Lab
              </span>
              <h3 className="text-lg font-bold text-white">
                Test Custom Waste Item
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

        {/* Input Parameters */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Item Label / Description</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Polymer / Base Material</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="PET">PET (Clear #1)</option>
                <option value="HDPE">HDPE (Milk/Detergent #2)</option>
                <option value="PP">PP (Polypropylene #5)</option>
                <option value="PAPER">Paperboard / Cardboard</option>
                <option value="ORGANIC">Organic Food Scrap</option>
                <option value="LAMINATE">Metallized Chip Pouch</option>
                <option value="METAL">Aluminum / Steel Can</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Weight: <strong className="text-cyan-400 font-mono">{weightGrams}g</strong>
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={weightGrams}
                onChange={(e) => setWeightGrams(parseInt(e.target.value))}
                className="w-full accent-cyan-400 mt-2 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-medium">Grease & Oil Saturation</label>
              <span className={`font-mono font-bold ${greasePct > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {greasePct}% {greasePct > 15 ? '(Above 15% Pulping Limit)' : '(Within Dry Tolerance)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={greasePct}
              onChange={(e) => setGreasePct(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Degradation Flags */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-slate-400 font-mono text-[11px] block">Degradation & Optical Condition Flags:</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={isCrushed}
                  onChange={(e) => setIsCrushed(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span className="text-slate-300">Crushed / Flattened</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasPvcSleeve}
                  onChange={(e) => setHasPvcSleeve(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span className="text-slate-300">Heat-Shrink PVC Sleeve</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasCarbonBlack}
                  onChange={(e) => setHasCarbonBlack(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span className="text-slate-300">Carbon Black Pigment</span>
              </label>
            </div>
          </div>

          {/* Live Sensor Verdict Preview Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Live Sensor Classification Preview</span>
              <span className="text-[11px] font-mono text-cyan-400">Latency: 38.4 ms</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Target Routing:</span>
                <BinTooltip binId={binConfig.id} align="left" showIcon={false}>
                  <div className="flex items-center gap-1.5 cursor-help">
                    <span className="font-bold text-sm" style={{ color: binConfig.textColorHex }}>
                      {binConfig.shortCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      ({binConfig.simpleName})
                    </span>
                  </div>
                </BinTooltip>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Hover cursor on bin to see technical meaning
                </span>
              </div>

              {isWishcycling ? (
                <span className="text-xs font-mono text-rose-300 bg-rose-950/60 px-2 py-1 rounded border border-rose-800 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Wishcycling Intercept
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Clean Stream
                </span>
              )}
            </div>

            {isWishcycling && (
              <p className="text-[11px] text-rose-300 leading-tight">
                {reason}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md shadow-cyan-950 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Drop onto Sorting Conveyor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
