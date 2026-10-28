import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  AlertOctagon, 
  Coins, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Check,
  HelpCircle 
} from 'lucide-react';
import { STREAM_BINS, SUPPORTED_CURRENCIES } from '../data/wasteCatalog';
import { CurrencyOption } from '../types/waste';
import { audioEngine } from '../services/audioEngine';
import { BinTooltip } from './BinTooltip';

interface PurityAnalyticsViewProps {
  currentCurrency?: CurrencyOption;
  onCurrencyChange?: (currency: CurrencyOption) => void;
  facilityName?: string;
}

export const PurityAnalyticsView: React.FC<PurityAnalyticsViewProps> = ({
  currentCurrency,
  onCurrencyChange,
  facilityName = 'Municipal MRF Line 03'
}) => {
  const [internalCurrency, setInternalCurrency] = useState<CurrencyOption>(
    currentCurrency || SUPPORTED_CURRENCIES[0]
  );
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const activeCurrency = currentCurrency || internalCurrency;

  const handleSelectCurrency = (code: string) => {
    const selected = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (selected) {
      setInternalCurrency(selected);
      if (onCurrencyChange) {
        onCurrencyChange(selected);
      }
    }
  };

  // Base avoidance value in USD ($42,600)
  const baseAvoidanceUSD = 42600;
  const convertedTotal = Math.round(baseAvoidanceUSD * activeCurrency.ratePerUSD);

  // Formatter for selected currency
  const formatCurrencyValue = (val: number) => {
    try {
      return new Intl.NumberFormat(activeCurrency.locale, {
        maximumFractionDigits: 0
      }).format(val);
    } catch {
      return val.toLocaleString();
    }
  };

  // Penalty Breakdown Items (Calculated in selected currency)
  const penaltyBreakdowns = [
    {
      title: 'Hydropulper Oil Batch Rejection Fees',
      description: 'Avoided contamination charges when paper mills reject saturated corrugated bales.',
      sharePct: 60,
      amountUSD: Math.round(baseAvoidanceUSD * 0.6),
      amount: Math.round(convertedTotal * 0.6)
    },
    {
      title: 'Secondary rPET Acidification Downgrade Claims',
      description: 'Avoided value deductions from PVC-induced hydrochloric degradation in wash lines.',
      sharePct: 25,
      amountUSD: Math.round(baseAvoidanceUSD * 0.25),
      amount: Math.round(convertedTotal * 0.25)
    },
    {
      title: 'Landfill Regulatory & Leachate Surcharges',
      description: 'Avoided municipal tipping fees and hazardous leachate treatment penalties.',
      sharePct: 15,
      amountUSD: Math.round(baseAvoidanceUSD * 0.15),
      amount: Math.round(convertedTotal * 0.15)
    }
  ];

  const streamPurityData = [
    {
      binId: 'BIN_A_PET_CLEAR',
      name: 'Clear PET Flake Bales',
      currentPurityPct: 98.8,
      targetFloorPct: 98.0,
      historical24hPct: 98.5,
      tonnageSorted: 42.4,
      contaminantRatePct: 1.2,
      riskLevel: 'LOW',
      status: 'GRADE-A BALE'
    },
    {
      binId: 'BIN_B_HDPE_RIGID',
      name: 'Rigid HDPE Natural & Colored',
      currentPurityPct: 98.2,
      targetFloorPct: 98.0,
      historical24hPct: 97.9,
      tonnageSorted: 31.8,
      contaminantRatePct: 1.8,
      riskLevel: 'LOW',
      status: 'GRADE-A BALE'
    },
    {
      binId: 'BIN_C_ORGANICS_FOOD_SCRAPS',
      name: 'Kitchen Organics & Food Scraps',
      currentPurityPct: 99.4,
      targetFloorPct: 98.0,
      historical24hPct: 99.2,
      tonnageSorted: 58.6,
      contaminantRatePct: 0.6,
      riskLevel: 'OPTIMAL',
      status: 'GRADE-A BALE'
    },
    {
      binId: 'BIN_D_FIBER_CLEAN',
      name: 'Clean Kraft OCC & Packaging',
      currentPurityPct: 97.9,
      targetFloorPct: 98.0,
      historical24hPct: 96.8,
      tonnageSorted: 76.2,
      contaminantRatePct: 2.1,
      riskLevel: 'MODERATE_WATCH',
      status: 'DOWNGRADE RISK'
    },
    {
      binId: 'BIN_E_RESIDUAL_LANDFILL',
      name: 'Residual Intercepted Waste',
      currentPurityPct: 100.0,
      targetFloorPct: 95.0,
      historical24hPct: 100.0,
      tonnageSorted: 19.5,
      contaminantRatePct: 0.0,
      riskLevel: 'OPTIMAL',
      status: 'GRADE-A BALE'
    }
  ];

  const wishcyclingMetrics = {
    contaminantsInterceptedKg: 14820,
    co2eLandfillOffsetMT: 34.6,
    screenJamDowntimeHours: 0.0
  };

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export as CSV for Audit & Spreadsheet compliance
  const handleExportCSV = () => {
    const timestampIso = new Date().toISOString();
    const dateFormatted = timestampIso.slice(0, 10);

    const lines: string[] = [
      `# SORTIQ PURESTREAM OS - AUDIT COMPLIANCE & STREAM PURITY REPORT`,
      `# Generated UTC: ${timestampIso}`,
      `# Facility: ${facilityName}`,
      `# Compliance Standards: ISO 15270 (Plastics Recovery) · ASTM D6400 (Composting)`,
      `# Selected Currency: ${activeCurrency.name} (${activeCurrency.code}) - Exchange Rate: 1 USD = ${activeCurrency.ratePerUSD} ${activeCurrency.code}`,
      ``,
      `--- SECTION 1: STREAM PURITY INDICES (PURITY FLOOR >= 98.0%) ---`,
      `Stream ID,Stream Description,Target Floor (%),Current Purity (%),Historical 24h Purity (%),Sorted Tonnage (MT),Contamination Rate (%),Audit Status`
    ];

    streamPurityData.forEach((s) => {
      lines.push(
        `"${s.binId}","${s.name}",${s.targetFloorPct},${s.currentPurityPct},${s.historical24hPct},${s.tonnageSorted},${s.contaminantRatePct},"${s.status}"`
      );
    });

    lines.push(
      ``,
      `--- SECTION 2: WISHCYCLING INTERCEPTION & ENVIRONMENTAL METRICS ---`,
      `Metric Description,Quantity,Unit,Compliance Impact`,
      `"Contaminants Intercepted At Source",${wishcyclingMetrics.contaminantsInterceptedKg},"kg","Non-recyclable paperboard and multi-layer laminates diverted from paper pulpers"`,
      `"CO2e Landfill Methane Offset",${wishcyclingMetrics.co2eLandfillOffsetMT},"MT CO2e","Abatement through continuous thermophilic anaerobic digestion of food waste"`,
      `"Disc Screen Jam Downtime Avoided",${wishcyclingMetrics.screenJamDowntimeHours},"Hours","Zero film wrap tangles in high-speed rotary sizing disc screens"`,
      ``,
      `--- SECTION 3: FINANCIAL PENALTY AVOIDANCE & AUDIT SAVINGS (${activeCurrency.code}) ---`,
      `Penalty Category,Share (%),Amount in USD,Amount in ${activeCurrency.code},Description`
    );

    penaltyBreakdowns.forEach((p) => {
      lines.push(
        `"${p.title}",${p.sharePct},${p.amountUSD},${p.amount},"${p.description}"`
      );
    });

    lines.push(
      `"TOTAL PENALTY AVOIDED",100,${baseAvoidanceUSD},${convertedTotal},"Total saved in batch contamination fines and municipal tipping surcharges"`
    );

    const csvContent = lines.join('\n');
    triggerDownload(csvContent, `SortIQ_Purity_Audit_Report_${dateFormatted}.csv`, 'text/csv;charset=utf-8;');
    
    audioEngine.playSuccessTone();
    setShowExportMenu(false);
    setExportFeedback(`Exported CSV Report (${dateFormatted})`);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  // Export as JSON for API & system ingestion
  const handleExportJSON = () => {
    const timestampIso = new Date().toISOString();
    const dateFormatted = timestampIso.slice(0, 10);

    const reportPayload = {
      report_metadata: {
        system_name: 'SortIQ PureStream OS',
        version: '4.2.0-LTS',
        report_type: 'Audit Compliance & Stream Purity Report',
        generated_at_utc: timestampIso,
        facility_name: facilityName,
        compliance_standards: [
          'ISO 15270:2008 Plastics Recovery and Recycling Guidelines',
          'ASTM D6400 Standard Specification for Solid and Compostable Plastics',
          'EPA Municipal Solid Waste Characterization'
        ]
      },
      financial_penalty_metrics: {
        base_currency: 'USD',
        base_total_avoided_usd: baseAvoidanceUSD,
        active_currency: {
          code: activeCurrency.code,
          name: activeCurrency.name,
          symbol: activeCurrency.symbol.trim(),
          exchange_rate_per_usd: activeCurrency.ratePerUSD
        },
        converted_total_avoided: convertedTotal,
        penalty_breakdown: penaltyBreakdowns.map((p) => ({
          category: p.title,
          share_percentage: p.sharePct,
          amount_usd: p.amountUSD,
          amount_selected_currency: p.amount,
          audit_description: p.description
        }))
      },
      wishcycling_interception_data: {
        contaminants_intercepted_kg: wishcyclingMetrics.contaminantsInterceptedKg,
        co2e_landfill_offset_mt: wishcyclingMetrics.co2eLandfillOffsetMT,
        screen_jam_downtime_hours: wishcyclingMetrics.screenJamDowntimeHours
      },
      stream_purity_indices: streamPurityData.map((s) => ({
        stream_id: s.binId,
        stream_name: s.name,
        target_purity_floor_pct: s.targetFloorPct,
        current_purity_pct: s.currentPurityPct,
        historical_24h_purity_pct: s.historical24hPct,
        tonnage_sorted_mt: s.tonnageSorted,
        contaminant_rate_pct: s.contaminantRatePct,
        risk_level: s.riskLevel,
        bale_status: s.status
      }))
    };

    const jsonContent = JSON.stringify(reportPayload, null, 2);
    triggerDownload(jsonContent, `SortIQ_Purity_Audit_Report_${dateFormatted}.json`, 'application/json;charset=utf-8;');
    
    audioEngine.playSuccessTone();
    setShowExportMenu(false);
    setExportFeedback(`Exported JSON Report (${dateFormatted})`);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Quality Assurance & Material Economics
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Bale Purity & Wishcycling Interception Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            In municipal recycling, a 2% contamination rate can trigger entire bale rejection at paper mills and plastic reclaimers. SortIQ enforces strict source-segregation verification to safeguard material market prices.
          </p>
        </div>

        {/* Global Controls: Export Report, Currency Selector & Purity Floor */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Export Report Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-sm shadow-cyan-950 cursor-pointer active:scale-95 whitespace-nowrap"
              title="Download audit compliance report in CSV or JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {showExportMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-60 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl p-1.5 z-30 animate-fade-in"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select Audit Export Format
                </div>
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-900 rounded-md transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block font-medium">Export CSV Spreadsheet</strong>
                    <span className="text-[10px] text-slate-400 font-mono">For Auditors & Excel (.csv)</span>
                  </div>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-900 rounded-md transition-colors text-left"
                >
                  <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="block font-medium">Export JSON Telemetry</strong>
                    <span className="text-[10px] text-slate-400 font-mono">For MRF Systems & APIs (.json)</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Currency Dropdown Selector in Header */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <label htmlFor="header-currency-select" className="text-slate-400 font-medium">Currency:</label>
            <select
              id="header-currency-select"
              value={activeCurrency.code}
              onChange={(e) => handleSelectCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-100 rounded px-2 py-0.5 focus:outline-none focus:border-cyan-400 cursor-pointer font-bold"
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol.trim()}) - {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Purity Floor: </span>
            <strong className="text-emerald-400">≥ 98.0% Pure</strong>
          </div>
        </div>
      </div>

      {/* Export Confirmation Toast */}
      {exportFeedback && (
        <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-200 font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportFeedback}</span>
          </div>
          <span className="text-slate-400 text-[11px]">Audit compliance file downloaded</span>
        </div>
      )}

      {/* 4 Quantitative Proof Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Wishcycling Intercepted */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Wishcycling Intercepted</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">14,820</span>
              <span className="text-xs font-mono text-slate-400 uppercase">kg</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Greaseboard & laminates diverted from paper pulpers
          </span>
        </div>

        {/* Metric 2: Mill Penalty Avoidance (Multi-Currency Feature) */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-300">
                  Mill Penalty Avoidance
                </span>
              </div>
              
              {/* Quick in-card currency selector */}
              <div className="flex items-center gap-1">
                <select
                  value={activeCurrency.code}
                  onChange={(e) => handleSelectCurrency(e.target.value)}
                  title="Select display currency"
                  className="bg-slate-950 border border-slate-700 hover:border-emerald-500 text-emerald-400 text-[11px] font-mono rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol.trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Multi-Currency Total Display */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 tabular-nums">
                {activeCurrency.symbol}{formatCurrencyValue(convertedTotal)}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                {activeCurrency.code}
              </span>
            </div>

            {/* Conversion footnote if not USD */}
            {activeCurrency.code !== 'USD' && (
              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                Ref: $42,600 USD (Rate: 1 USD = {activeCurrency.ratePerUSD} {activeCurrency.code})
              </span>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Saved in contamination fines
            </span>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showBreakdown ? 'Hide' : 'Details'}</span>
              {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Metric 3: CO2e Landfill Offset */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">CO2e Landfill Offset</span>
              <Leaf className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold text-cyan-400 tabular-nums">34.6</span>
              <span className="text-xs font-mono text-slate-400 uppercase">MT CO2e</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Methane abatement through anaerobic food scrap digestion
          </span>
        </div>

        {/* Metric 4: Screen Jam Downtime */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Screen Jam Downtime</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold text-blue-400 tabular-nums">0.0</span>
              <span className="text-xs font-mono text-slate-400 uppercase">Hours</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Zero plastic film tangles in rotary disc screens
          </span>
        </div>
      </div>

      {/* Expandable Penalty Avoidance Breakdown Section */}
      {showBreakdown && (
        <div className="bg-slate-900/95 border border-emerald-900/50 rounded-xl p-5 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Itemized Penalty Avoidance Breakdown ({activeCurrency.code})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Selected Currency: <strong className="text-emerald-400">{activeCurrency.name} ({activeCurrency.symbol.trim()})</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {penaltyBreakdowns.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>{item.sharePct}% of Total Savings</span>
                    <span className="text-emerald-400 font-bold">{activeCurrency.code}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                    {activeCurrency.symbol}{formatCurrencyValue(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bale Purity Indices Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Downstream Bale Purity Metrics
            </span>
            <h3 className="text-base font-bold text-white">
              Municipal Stream Recovery Performance
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {streamPurityData.map((stream) => {
            const binConfig = STREAM_BINS[stream.binId as keyof typeof STREAM_BINS];
            const meetsFloor = stream.currentPurityPct >= stream.targetFloorPct;
            return (
              <div 
                key={stream.binId}
                className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Stream Info */}
                <div className="md:w-1/3">
                  <BinTooltip binId={binConfig.id} align="left" showIcon={false}>
                    <div className="flex items-center gap-2 mb-1 cursor-help group">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: binConfig.colorHex }}
                      />
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {binConfig.shortCode}
                      </span>
                      <HelpCircle className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 opacity-60" />
                    </div>
                  </BinTooltip>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    {binConfig.name}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Sorted: {stream.tonnageSorted} metric tons · Contaminants: {stream.contaminantRatePct}%
                  </span>
                </div>

                {/* Progress Bar & Numeric Purity */}
                <div className="md:w-1/3">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Purity Rating</span>
                    <strong className={meetsFloor ? 'text-emerald-400 tabular-nums' : 'text-amber-400 tabular-nums'}>
                      {stream.currentPurityPct.toFixed(1)}% (Floor: {stream.targetFloorPct}%)
                    </strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${meetsFloor ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, stream.currentPurityPct)}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="md:w-1/4 flex md:justify-end items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded border ${
                    meetsFloor 
                      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800' 
                      : 'text-amber-400 bg-amber-950/40 border-amber-800'
                  }`}>
                    {meetsFloor ? 'GRADE-A BALE' : 'DOWNGRADE RISK'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
