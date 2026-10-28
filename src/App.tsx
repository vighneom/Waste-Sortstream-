/**
 * SortIQ PureStream OS & Web Portal
 * Municipal Waste Management & Industrial Sensor Segregation Operating System
 */

import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { Toolbar } from './components/Toolbar';
import { IndustrialConveyorView } from './components/IndustrialConveyorView';
import { GuidanceTerminalView } from './components/GuidanceTerminalView';
import { PurityAnalyticsView } from './components/PurityAnalyticsView';
import { CalibrationView } from './components/CalibrationView';
import { WishcyclingStandardsView } from './components/WishcyclingStandardsView';
import { AntiWishcyclingModal } from './components/AntiWishcyclingModal';
import { CustomItemTesterModal } from './components/CustomItemTesterModal';
import { WasteItem, LatencyBreakdown, ActuatorCommandLog, FacilityProfile, CurrencyOption } from './types/waste';
import { PRELOADED_WASTE_ITEMS, STREAM_BINS, SUPPORTED_CURRENCIES } from './data/wasteCatalog';
import { audioEngine } from './services/audioEngine';

const FACILITIES: FacilityProfile[] = [
  {
    id: 'FAC_MRF_03',
    name: 'Municipal MRF Line 03',
    type: 'mrf',
    location: 'Metro Resource Recovery Center',
    conveyorSpeedMps: 2.85,
    beltWidthMm: 1200,
    dailyThroughputTons: 140
  },
  {
    id: 'FAC_REST_01',
    name: 'Commercial Kitchen Station',
    type: 'commercial_kitchen',
    location: 'Central Culinary & Food Prep Hub',
    conveyorSpeedMps: 1.2,
    beltWidthMm: 600,
    dailyThroughputTons: 3.5
  },
  {
    id: 'FAC_KIOSK_09',
    name: 'Smart Drop-off Terminal',
    type: 'domestic_kiosk',
    location: 'Civic Source-Separation Pavilion',
    conveyorSpeedMps: 0.8,
    beltWidthMm: 450,
    dailyThroughputTons: 1.2
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'guidance' | 'analytics' | 'calibration' | 'taxonomy'>('telemetry');
  const [viewMode, setViewMode] = useState<'mrf' | 'guidance'>('mrf');
  const [activeFacility, setActiveFacility] = useState<FacilityProfile>(FACILITIES[0]);
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(2.85);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(SUPPORTED_CURRENCIES[0]);

  // Active waste item on the conveyor
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<WasteItem>(PRELOADED_WASTE_ITEMS[0]);
  const [beltPositionPct, setBeltPositionPct] = useState<number>(10);
  const [activeValves, setActiveValves] = useState<number[]>([]);
  const [pneumaticPressure, setPneumaticPressure] = useState<number>(8.2);
  const [totalPulses, setTotalPulses] = useState<number>(1429);
  const [misfireRate, setMisfireRate] = useState<number>(0.008);

  // Latency breakdown tracker
  const [currentLatency, setCurrentLatency] = useState<LatencyBreakdown>({
    sensorAcquisitionMs: 7.8,
    deepLearningInferenceMs: 21.6,
    actuatorTriggerCalcMs: 3.8,
    plcHandshakeMs: 5.6,
    totalLatencyMs: 38.8,
    thresholdMaxMs: 50.0,
    jitterMicroseconds: 240
  });

  // Recent Actuator Event Logs
  const [recentLogs, setRecentLogs] = useState<ActuatorCommandLog[]>([
    {
      id: 'LOG_01',
      timestamp: '02:05:42.180',
      timestampEpochUs: 1718000000000000,
      item: PRELOADED_WASTE_ITEMS[0],
      destinationBin: 'BIN_A_PET_CLEAR',
      actuatorBank: 'AIR_JET_BANK_01',
      valves: [3, 4],
      pulseDurationUs: 12000,
      isContaminationIntercept: false,
      latency: { ...currentLatency, totalLatencyMs: 38.4 },
      confidenceScore: 0.988
    },
    {
      id: 'LOG_02',
      timestamp: '02:05:43.020',
      timestampEpochUs: 1718000000840000,
      item: PRELOADED_WASTE_ITEMS[1],
      destinationBin: 'BIN_E_RESIDUAL_LANDFILL',
      actuatorBank: 'AIR_JET_BANK_05',
      valves: [18, 19, 20],
      pulseDurationUs: 25000,
      isContaminationIntercept: true,
      latency: { ...currentLatency, totalLatencyMs: 41.2 },
      confidenceScore: 0.976
    },
    {
      id: 'LOG_03',
      timestamp: '02:05:43.910',
      timestampEpochUs: 1718000001730000,
      item: PRELOADED_WASTE_ITEMS[2],
      destinationBin: 'BIN_B_HDPE_RIGID',
      actuatorBank: 'AIR_JET_BANK_02',
      valves: [7, 8, 9],
      pulseDurationUs: 16000,
      isContaminationIntercept: false,
      latency: { ...currentLatency, totalLatencyMs: 39.1 },
      confidenceScore: 0.992
    }
  ]);

  // Modals
  const [selectedWishcyclingItem, setSelectedWishcyclingItem] = useState<WasteItem | null>(null);
  const [isCustomTesterOpen, setIsCustomTesterOpen] = useState<boolean>(false);

  // Sound Engine sync
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioEngine.isEnabled = next;
  };

  // Real-time animation loop for conveyor progression
  const hasScannedRef = useRef(false);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setBeltPositionPct((prev) => {
        const step = conveyorSpeed * 0.45;
        const next = prev + step;

        // At 35% position: Sensor Array Scan
        if (next >= 30 && next <= 45 && !hasScannedRef.current) {
          hasScannedRef.current = true;
          audioEngine.playSensorChirp();
          if (activeItem.isWishcyclingRisk) {
            audioEngine.playContaminationAlarm();
          }
          // Jitter update
          setCurrentLatency((l) => ({
            ...l,
            sensorAcquisitionMs: +(7.5 + Math.random() * 0.8).toFixed(1),
            deepLearningInferenceMs: +(20.5 + Math.random() * 2.0).toFixed(1),
            totalLatencyMs: +(37.0 + Math.random() * 4.0).toFixed(1),
            jitterMicroseconds: Math.floor(180 + Math.random() * 120)
          }));
        }

        // At 65% position: Pneumatic Jet Blast Actuation
        if (next >= 60 && next <= 75 && !hasFiredRef.current) {
          hasFiredRef.current = true;
          setActiveValves(activeItem.actuatorTarget.valves);
          setTotalPulses((p) => p + 1);
          audioEngine.playPneumaticBlast();

          // Log actuation event
          const newLog: ActuatorCommandLog = {
            id: `LOG_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
            timestampEpochUs: Date.now() * 1000,
            item: activeItem,
            destinationBin: activeItem.targetBinId,
            actuatorBank: activeItem.actuatorTarget.manifoldBank,
            valves: activeItem.actuatorTarget.valves,
            pulseDurationUs: activeItem.actuatorTarget.blastDurationMs * 1000,
            isContaminationIntercept: activeItem.isWishcyclingRisk,
            latency: { ...currentLatency },
            confidenceScore: +(0.97 + Math.random() * 0.025).toFixed(3)
          };
          setRecentLogs((logs) => [newLog, ...logs.slice(0, 9)]);

          // Clear active valves after pulse
          setTimeout(() => {
            setActiveValves([]);
          }, activeItem.actuatorTarget.blastDurationMs + 50);
        }

        // Item has fallen into the chute (past 100%) -> Reset and load next item
        if (next >= 100) {
          hasScannedRef.current = false;
          hasFiredRef.current = false;
          setActiveValves([]);

          // Advance to next catalog item
          const nextIdx = (currentItemIndex + 1) % PRELOADED_WASTE_ITEMS.length;
          setCurrentItemIndex(nextIdx);
          setActiveItem(PRELOADED_WASTE_ITEMS[nextIdx]);

          return 0; // Reset belt to infeed hopper
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, conveyorSpeed, activeItem, currentItemIndex, currentLatency]);

  // Manual step button
  const handleSingleStep = () => {
    setBeltPositionPct((prev) => {
      const next = (prev + 20) % 100;
      if (next < 20) {
        const nextIdx = (currentItemIndex + 1) % PRELOADED_WASTE_ITEMS.length;
        setCurrentItemIndex(nextIdx);
        setActiveItem(PRELOADED_WASTE_ITEMS[nextIdx]);
        hasScannedRef.current = false;
        hasFiredRef.current = false;
      }
      return next;
    });
  };

  // Reset stream
  const handleResetStream = () => {
    setBeltPositionPct(0);
    hasScannedRef.current = false;
    hasFiredRef.current = false;
    setActiveValves([]);
    audioEngine.playSensorChirp();
  };

  // User manually selects item to test
  const handleSelectItem = (item: WasteItem) => {
    setActiveItem(item);
    setBeltPositionPct(10);
    hasScannedRef.current = false;
    hasFiredRef.current = false;
    audioEngine.playSensorChirp();
  };

  // User deploys a custom-built test item
  const handleDeployCustomItem = (item: WasteItem) => {
    setActiveItem(item);
    setBeltPositionPct(5);
    hasScannedRef.current = false;
    hasFiredRef.current = false;
    audioEngine.playSensorChirp();
    if (activeTab !== 'telemetry' && activeTab !== 'guidance') {
      setActiveTab('telemetry');
    }
  };

  const handleManualTriggerValve = (valveNum: number) => {
    setActiveValves([valveNum]);
    setTotalPulses((p) => p + 1);
    setTimeout(() => setActiveValves([]), 150);
  };

  const handleSelectTab = (tab: 'telemetry' | 'guidance' | 'analytics' | 'calibration' | 'taxonomy') => {
    setActiveTab(tab);
    if (tab === 'telemetry') {
      setViewMode('mrf');
    } else if (tab === 'guidance') {
      setViewMode('guidance');
    }
  };

  const handleChangeViewMode = (mode: 'mrf' | 'guidance') => {
    setViewMode(mode);
    if (mode === 'mrf') {
      setActiveTab('telemetry');
    } else {
      setActiveTab('guidance');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 3-Zone Top Bar */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenTestDrop={() => setIsCustomTesterOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Primary Workspace Control Bar */}
      <Toolbar
        viewMode={viewMode}
        onChangeViewMode={handleChangeViewMode}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning(!isRunning)}
        onSingleStep={handleSingleStep}
        onResetStream={handleResetStream}
        conveyorSpeed={conveyorSpeed}
        onChangeSpeed={setConveyorSpeed}
        activeFacility={activeFacility}
        onChangeFacility={setActiveFacility}
        facilities={FACILITIES}
        activeContaminationCount={activeItem.isWishcyclingRisk ? 1 : 0}
      />

      {/* Main Content Workspace Container (1440px max width baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {activeTab === 'telemetry' && (
          <IndustrialConveyorView
            activeItem={activeItem}
            beltPositionPct={beltPositionPct}
            conveyorSpeedMps={conveyorSpeed}
            currentLatency={currentLatency}
            activeValves={activeValves}
            pneumaticPressure={pneumaticPressure}
            totalPulses={totalPulses}
            misfireRate={misfireRate}
            recentLogs={recentLogs}
            onSelectTestItem={handleSelectItem}
            onManualTriggerValve={handleManualTriggerValve}
            onOpenWishcyclingInfo={(item) => setSelectedWishcyclingItem(item)}
          />
        )}

        {activeTab === 'guidance' && (
          <GuidanceTerminalView
            activeItem={activeItem}
            onSelectItem={handleSelectItem}
            onOpenWishcyclingInfo={(item) => setSelectedWishcyclingItem(item)}
          />
        )}

        {activeTab === 'analytics' && (
          <PurityAnalyticsView
            currentCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            facilityName={activeFacility.name}
          />
        )}

        {activeTab === 'calibration' && (
          <CalibrationView />
        )}

        {activeTab === 'taxonomy' && (
          <WishcyclingStandardsView />
        )}
      </main>

      {/* Modals */}
      <AntiWishcyclingModal
        item={selectedWishcyclingItem}
        onClose={() => setSelectedWishcyclingItem(null)}
      />

      <CustomItemTesterModal
        isOpen={isCustomTesterOpen}
        onClose={() => setIsCustomTesterOpen(false)}
        onDeployCustomItem={handleDeployCustomItem}
      />

      {/* Clean Industrial Footer conforming to Anti-Slop Discipline */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-3 min-h-[45px] text-xs text-slate-500 flex items-center">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SortIQ PureStream OS</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Tolerance Source Segregation & Spectroscopic Actuation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>ISO 15270 Plastics Recovery</span>
            <span aria-hidden="true">·</span>
            <span>ASTM D6400 Composting Compliance</span>
            <span aria-hidden="true">·</span>
            <span>&lt;50ms Edge Inference</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
