export type StreamBinId = 
  | 'BIN_A_PET_CLEAR'
  | 'BIN_B_HDPE_RIGID'
  | 'BIN_C_ORGANICS_FOOD_SCRAPS'
  | 'BIN_D_FIBER_CLEAN'
  | 'BIN_E_RESIDUAL_LANDFILL';

export interface SpectralPoint {
  wavelengthNm: number;
  reflectance: number;
}

export interface WasteItem {
  id: string;
  name: string;
  commonName: string;
  primaryMaterial: string;
  targetBinId: StreamBinId;
  targetBinName: string;
  weightGrams: number;
  greaseSaturationPct: number;
  isCrushed: boolean;
  isSoiled: boolean;
  isOccluded: boolean;
  hasPvcSleeve?: boolean;
  hasCarbonBlack?: boolean;
  isWishcyclingRisk: boolean;
  wishcyclingReason?: string;
  spectralPoints: SpectralPoint[];
  dominantPeakNm: number;
  preparationSteps: string[];
  downstreamProcess: {
    facilityType: string;
    transformationSteps: string[];
    circularityScore: number;
    finalProduct: string;
  };
  actuatorTarget: {
    manifoldBank: string;
    valves: number[];
    actuatorType: 'PNEUMATIC_VALVE' | 'DELTA_ROBOT' | 'DIVERTER_GATE';
    blastDurationMs: number;
  };
}

export interface LatencyBreakdown {
  sensorAcquisitionMs: number;
  deepLearningInferenceMs: number;
  actuatorTriggerCalcMs: number;
  plcHandshakeMs: number;
  totalLatencyMs: number;
  thresholdMaxMs: number;
  jitterMicroseconds: number;
}

export interface ActuatorCommandLog {
  id: string;
  timestamp: string;
  timestampEpochUs: number;
  item: WasteItem;
  destinationBin: StreamBinId;
  actuatorBank: string;
  valves: number[];
  pulseDurationUs: number;
  isContaminationIntercept: boolean;
  latency: LatencyBreakdown;
  confidenceScore: number;
}

export interface StreamBinConfig {
  id: StreamBinId;
  name: string;
  simpleName: string;
  shortCode: string;
  technicalAcronym: string;
  colorHex: string;
  bgLightHex: string;
  borderColorHex: string;
  textColorHex: string;
  acceptedMaterials: string[];
  strictlyProhibited: string[];
  downstreamDestination: string;
  meaning: {
    scientificDefinition: string;
    everydayExamples: string;
    whyItMatters: string;
  };
}

export interface FacilityProfile {
  id: string;
  name: string;
  type: 'mrf' | 'commercial_kitchen' | 'domestic_kiosk' | 'industrial_plant';
  location: string;
  conveyorSpeedMps: number;
  beltWidthMm: number;
  dailyThroughputTons: number;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  ratePerUSD: number;
  locale: string;
}

