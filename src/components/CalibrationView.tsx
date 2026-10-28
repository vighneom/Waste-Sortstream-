import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Radio, Camera, Gauge } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export const CalibrationView: React.FC = () => {
  const [darkScanDone, setDarkScanDone] = useState(true);
  const [whiteTileDone, setWhiteTileDone] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [exposureMicroseconds, setExposureMicroseconds] = useState(120);
  const [encoderPulsePPR, setEncoderPulsePPR] = useState(2048);
  const [airPressureSetPoint, setAirPressureSetPoint] = useState(8.2);
  const [calibLog, setCalibLog] = useState<string[]>([
    '02:04:12 - NIR Dark Current baseline acquired (0.012 ± 0.002 R)',
    '02:05:01 - Spectral 99.9% sintered PTFE white reference calibrated',
    '02:05:44 - Rotary encoder quadrature tracking synced at 2,048 PPR',
    '02:06:10 - Pneumatic solenoid air pressure nominal at 8.2 bar'
  ]);

  const handleRunCalibrationCycle = () => {
    setIsCalibrating(true);
    setDarkScanDone(false);
    setWhiteTileDone(false);
    audioEngine.playSensorChirp();
    setTimeout(() => {
      audioEngine.playPneumaticBlast();
      setDarkScanDone(true);
      setWhiteTileDone(true);
      setIsCalibrating(false);
      setCalibLog(prev => [
        `${new Date().toLocaleTimeString()} - Complete 3-point recalibration cycle verified (SNR: 46.2 dB)`,
        ...prev.slice(0, 5)
      ]);
      audioEngine.playSuccessTone();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Field Instrumentation & Sensor Tuning
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Sensor Calibration & Latency Diagnostic Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Maintain sub-50ms deterministic edge classification by compensating for dust deposition on optical lenses, dark current sensor drift, and mechanical conveyor belt stretch.
          </p>
        </div>

        <button
          onClick={handleRunCalibrationCycle}
          disabled={isCalibrating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-all shadow-md shadow-cyan-950 whitespace-nowrap active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
          <span>{isCalibrating ? 'Executing Baseline Scan...' : 'Run Auto-Calibration Routine'}</span>
        </button>
      </div>

      {/* 3 Calibration Workstations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workstation 1: Hyperspectral NIR Baseline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">
              NIR Spectroscopy Optical Head
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div>
                <span className="text-slate-300 font-medium block">Dark Current Drift Scan</span>
                <span className="text-[11px] text-slate-500 font-mono">Zero-photon photodiode bias</span>
              </div>
              <span className={`flex items-center gap-1 font-mono font-bold ${darkScanDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {darkScanDone ? 'PASSED' : 'CALIBRATING'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div>
                <span className="text-slate-300 font-medium block">White Ceramic Baseline Tile</span>
                <span className="text-[11px] text-slate-500 font-mono">99.9% Spectral reflectance</span>
              </div>
              <span className={`flex items-center gap-1 font-mono font-bold ${whiteTileDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {whiteTileDone ? 'CALIBRATED' : 'CALIBRATING'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between font-mono text-slate-400 mb-1">
                <span>Signal-to-Noise Ratio (SNR):</span>
                <strong className="text-cyan-300">46.2 dB</strong>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[92%]" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Operating threshold: &gt; 35.0 dB
              </span>
            </div>
          </div>
        </div>

        {/* Workstation 2: Rotary Encoder & Motion Strobe Sync */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Conveyor Velocity & Optical Exposure
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-400">Area-Scan Shutter Exposure:</span>
                <strong className="text-slate-200 tabular-nums">{exposureMicroseconds} µs</strong>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={exposureMicroseconds}
                onChange={(e) => setExposureMicroseconds(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                Prevents optical motion blur at 2.85 m/s belt speeds
              </span>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-400">Encoder Resolution (PPR):</span>
                <strong className="text-slate-200 tabular-nums">{encoderPulsePPR} PPR</strong>
              </div>
              <select
                value={encoderPulsePPR}
                onChange={(e) => setEncoderPulsePPR(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 font-mono"
              >
                <option value={1024}>1,024 Pulses Per Revolution (Standard)</option>
                <option value={2048}>2,048 Pulses Per Revolution (High-Precision)</option>
                <option value={4096}>4,096 Pulses Per Revolution (Ultra-Fine)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-400">
              <span>Position Tracking Tolerance: </span>
              <strong className="text-emerald-400">± 0.42 mm</strong>
            </div>
          </div>
        </div>

        {/* Workstation 3: Pneumatic Solenoid Manifold */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Pneumatics & Solenoid Latency
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-400">Main Header Air Pressure:</span>
                <strong className="text-cyan-300 tabular-nums">{airPressureSetPoint.toFixed(1)} bar</strong>
              </div>
              <input
                type="range"
                min="6.0"
                max="10.0"
                step="0.2"
                value={airPressureSetPoint}
                onChange={(e) => setAirPressureSetPoint(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                Dry filtered compressed air (ISO 8573-1 Class 1)
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono">
              <span className="text-slate-400">Solenoid Actuation Time:</span>
              <strong className="text-slate-200">4.2 ms</strong>
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono">
              <span className="text-slate-400">Valve Timing Jitter:</span>
              <strong className="text-emerald-400">± 180 µs</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Console Output */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
          <span>Diagnostic Event Stream</span>
          <span>Buffer: Synchronized</span>
        </div>
        <div className="space-y-1 text-slate-300">
          {calibLog.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-cyan-500">▶</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
