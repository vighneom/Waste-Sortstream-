import { StreamBinConfig, StreamBinId, WasteItem, CurrencyOption } from '../types/waste';

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', ratePerUSD: 1.0, locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', ratePerUSD: 0.92, locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', ratePerUSD: 0.79, locale: 'en-GB' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', ratePerUSD: 84.50, locale: 'en-IN' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', ratePerUSD: 1.38, locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', ratePerUSD: 1.54, locale: 'en-AU' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', ratePerUSD: 154.0, locale: 'ja-JP' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', ratePerUSD: 3.67, locale: 'en-AE' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', ratePerUSD: 1.34, locale: 'en-SG' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF ', ratePerUSD: 0.88, locale: 'de-CH' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', ratePerUSD: 5.75, locale: 'pt-BR' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', ratePerUSD: 7.24, locale: 'zh-CN' }
];


export const STREAM_BINS: Record<StreamBinId, StreamBinConfig> = {
  BIN_A_PET_CLEAR: {
    id: 'BIN_A_PET_CLEAR',
    name: 'Clear Drink Bottles & Clear Containers',
    simpleName: 'Plastic Bottles',
    shortCode: 'Bin A · Plastic Bottles',
    technicalAcronym: 'PET / PETE #1 (Polyethylene Terephthalate)',
    colorHex: '#06b6d4', // Cyan
    bgLightHex: 'rgba(6, 182, 212, 0.1)',
    borderColorHex: 'rgba(6, 182, 212, 0.4)',
    textColorHex: '#22d3ee',
    acceptedMaterials: [
      'Clear transparent beverage bottles (water, soda)',
      'Clear fruit & salad clamshell containers',
      'Unpigmented transparent food containers'
    ],
    strictlyProhibited: [
      'PVC shrink labels (chlorine hazard)',
      'Black pigmented plastics',
      'Bottles with liquid contents (>10ml)'
    ],
    downstreamDestination: 'Bottle-to-bottle decontamination & food-grade pelletization',
    meaning: {
      scientificDefinition: 'Polyethylene Terephthalate (Resin Code #1): Clear, shatterproof thermoplastic polyester used worldwide for beverage packaging.',
      everydayExamples: 'Water bottles, soda bottles, salad containers, cooking oil bottles.',
      whyItMatters: 'Extremely valuable when kept clean. Melted, decontaminated, and pelletized into new food-grade bottles, saving 70% energy compared to virgin plastic.'
    }
  },
  BIN_B_HDPE_RIGID: {
    id: 'BIN_B_HDPE_RIGID',
    name: 'Hard Plastic Jugs, Tubs & Bottles',
    simpleName: 'Hard Plastic Jugs',
    shortCode: 'Bin B · Hard Plastic Jugs',
    technicalAcronym: 'HDPE #2 (High-Density Polyethylene)',
    colorHex: '#3b82f6', // Cobalt blue
    bgLightHex: 'rgba(59, 130, 246, 0.1)',
    borderColorHex: 'rgba(59, 130, 246, 0.4)',
    textColorHex: '#60a5fa',
    acceptedMaterials: [
      'Translucent natural milk and water jugs',
      'Colored laundry detergent & shampoo bottles (#2)',
      'Rigid plastic buckets and secondary household jugs'
    ],
    strictlyProhibited: [
      'Hazardous engine oil jugs',
      'LDPE thin grocery films/bags',
      'Expanded polystyrene foam cups'
    ],
    downstreamDestination: 'Continuous twin-screw extrusion into corrugated stormwater drainage pipe',
    meaning: {
      scientificDefinition: 'High-Density Polyethylene (Resin Code #2): A tough, impact-resistant polyolefin polymer known for high tensile strength and chemical resistance.',
      everydayExamples: 'Milk jugs, laundry detergent bottles, shampoo bottles, yogurt tubs, bleach jugs.',
      whyItMatters: 'Shredded, washed, and extruded into heavy-duty corrugated drainage pipes and new detergent bottles that last over 50 years.'
    }
  },
  BIN_C_ORGANICS_FOOD_SCRAPS: {
    id: 'BIN_C_ORGANICS_FOOD_SCRAPS',
    name: 'Food Scraps & Kitchen Compost',
    simpleName: 'Food Scraps',
    shortCode: 'Bin C · Food Waste',
    technicalAcronym: 'Organic Biomass & Food Waste',
    colorHex: '#10b981', // Emerald
    bgLightHex: 'rgba(16, 185, 129, 0.1)',
    borderColorHex: 'rgba(16, 185, 129, 0.4)',
    textColorHex: '#34d399',
    acceptedMaterials: [
      'Raw fruit & vegetable peels and trimmings',
      'Coffee grounds, tea leaves, unbleached paper filters',
      'Leftover plate food scraps and meal preps',
      'Certified ASTM D6400 BPI compostables'
    ],
    strictlyProhibited: [
      'Plastic grocery wrappers, stickers & fruit tags',
      'Wire twist-ties and metal foil',
      'Glass, pet waste, or treated wood'
    ],
    downstreamDestination: 'Thermophilic anaerobic digestion with biogenic methane energy generation & digestate fertilizer',
    meaning: {
      scientificDefinition: 'Biodegradable Organic Biomass: High-moisture plant and food residues containing nitrogen, potassium, and biological carbon.',
      everydayExamples: 'Apple cores, banana peels, vegetable trimmings, coffee grounds, leftover food.',
      whyItMatters: 'Digested by beneficial bacteria without oxygen to generate renewable electricity/gas and rich organic compost, stopping methane emissions in landfills.'
    }
  },
  BIN_D_FIBER_CLEAN: {
    id: 'BIN_D_FIBER_CLEAN',
    name: 'Dry Cardboard & Clean Paper',
    simpleName: 'Paper & Cardboard',
    shortCode: 'Bin D · Paper & Boxes',
    technicalAcronym: 'Cellulose Fiber & Corrugated OCC',
    colorHex: '#f59e0b', // Amber
    bgLightHex: 'rgba(245, 158, 11, 0.1)',
    borderColorHex: 'rgba(245, 158, 11, 0.4)',
    textColorHex: '#fbbf24',
    acceptedMaterials: [
      'Clean flattened corrugated shipping cartons (boxes)',
      'Office copy paper, notebooks & envelopes',
      'Clean dry kraft grocery paper sacks'
    ],
    strictlyProhibited: [
      'Food-soiled pizza boxes (grease >15%)',
      'Wax-coated frozen meal boxes',
      'Thermal receipt paper (contains toxic BPA/BPS)'
    ],
    downstreamDestination: 'Hydropulping fiber reclamation for testliner & kraft boxboard',
    meaning: {
      scientificDefinition: 'Cellulose Fiber & Old Corrugated Containers (OCC): Interlocking plant fibers bonded through hydrogen bonding during water drying.',
      everydayExamples: 'Amazon/shipping delivery boxes, paper bags, copy paper, dry cereal boxes.',
      whyItMatters: 'Repulped with warm water to create new cardboard. Grease and food oils prevent fibers from bonding, ruining 20-ton paper batches.'
    }
  },
  BIN_E_RESIDUAL_LANDFILL: {
    id: 'BIN_E_RESIDUAL_LANDFILL',
    name: 'Non-Recyclable Trash & Soiled Items',
    simpleName: 'Non-Recyclable Trash',
    shortCode: 'Bin E · Trash / Landfill',
    technicalAcronym: 'Residual Waste & Multi-Material Contaminants',
    colorHex: '#f43f5e', // Rose/Crimson
    bgLightHex: 'rgba(244, 63, 94, 0.1)',
    borderColorHex: 'rgba(244, 63, 94, 0.4)',
    textColorHex: '#fb7185',
    acceptedMaterials: [
      'Multilayer metallized pouches (foil chip bags, granola bars)',
      'Grease-soaked pizza boxes & oily takeout containers (>15% grease)',
      'Broken ceramics, incandescent bulbs, composite items',
      'Carbon-black unidentifiable plastic food trays'
    ],
    strictlyProhibited: [
      'Hazardous chemicals & paint solvents',
      'Lithium-ion batteries (severe fire hazard)',
      'Biohazard medical syringes'
    ],
    downstreamDestination: 'High-density sanitary engineered landfill or Waste-to-Energy incineration with flue-gas scrubbing',
    meaning: {
      scientificDefinition: 'Residual Municipal Solid Waste: Mixed, contaminated, or multilayer composite materials that cannot be physically separated or mechanically recovered.',
      everydayExamples: 'Potato chip bags, greasy pizza box bottoms, plastic straws, toothpaste tubes, composite food wrappers.',
      whyItMatters: 'Putting these in recycling ruins clean materials. Keeping them in Trash protects paper pulpers and recycling machinery from costly shutdowns.'
    }
  }
};

// Generates synthetic NIR reflectance points between 900nm and 1700nm based on polymer characteristics
function generateSpectralCurve(dominantPeak: number, secondaryPeak: number, baseline: number, noiseAmp: number) {
  const points = [];
  for (let wave = 900; wave <= 1700; wave += 40) {
    const d1 = Math.exp(-Math.pow((wave - dominantPeak) / 60, 2)) * 0.45;
    const d2 = secondaryPeak ? Math.exp(-Math.pow((wave - secondaryPeak) / 50, 2)) * 0.28 : 0;
    const noise = (Math.sin(wave * 0.1) + Math.cos(wave * 0.05)) * noiseAmp;
    const val = Math.max(0.05, Math.min(0.95, baseline - d1 - d2 + noise));
    points.push({ wavelengthNm: wave, reflectance: parseFloat(val.toFixed(3)) });
  }
  return points;
}

export const PRELOADED_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'ITEM_PET_001',
    name: 'Clear 500ml Water Bottle',
    commonName: 'Spring Water Bottle (PET #1)',
    primaryMaterial: 'Polyethylene Terephthalate',
    targetBinId: 'BIN_A_PET_CLEAR',
    targetBinName: 'Bin A: Clear PET',
    weightGrams: 24.2,
    greaseSaturationPct: 0,
    isCrushed: false,
    isSoiled: false,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: false,
    spectralPoints: generateSpectralCurve(1130, 1660, 0.82, 0.02),
    dominantPeakNm: 1130,
    preparationSteps: [
      'Drain all residual water',
      'Screw cap on bottle (caps are captured in float-sink tanks)',
      'Do not crush fully if using optical sorting'
    ],
    downstreamProcess: {
      facilityType: 'Secondary Plastic Reclaimer (rPET)',
      transformationSteps: [
        'Rotary trommel de-labeling',
        'Wet granulator grinding into 10mm flakes',
        '85°C caustic hot wash with surfactant',
        'Float-sink separation (PET sinks, PP caps float)',
        'Solid-state polycondensation (SSP) for food-grade FDA approval',
        'Pelletized for new bottle preforms'
      ],
      circularityScore: 94,
      finalProduct: '100% Recycled Food-Contact Beverage Bottles'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_01',
      valves: [3, 4],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 12
    }
  },
  {
    id: 'ITEM_GREASY_BOX_002',
    name: 'Grease-Soaked Delivery Pizza Box',
    commonName: 'Corrugated Pizza Container (Grease Saturation: 38%)',
    primaryMaterial: 'Grease-Contaminated Cellulose Fiber',
    targetBinId: 'BIN_E_RESIDUAL_LANDFILL',
    targetBinName: 'Bin E: Residual Landfill',
    weightGrams: 215.0,
    greaseSaturationPct: 38,
    isCrushed: true,
    isSoiled: true,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: true,
    wishcyclingReason: 'Wishcycling Interception: Food oil and butter lipids saturate cellulose fibers. Grease cannot dissolve in water during repulping; it forms oil slicks that ruin entire 20-ton paper batches.',
    spectralPoints: generateSpectralCurve(1490, 1590, 0.55, 0.04),
    dominantPeakNm: 1490,
    preparationSteps: [
      'Tear off clean lid for paper recycling (if completely unsoiled)',
      'Place grease-saturated bottom half strictly into Bin E or municipal compost',
      'Never place greasy cardboard into clean fiber streams'
    ],
    downstreamProcess: {
      facilityType: 'Waste-to-Energy / High-Leachate Sanitary Landfill',
      transformationSteps: [
        'Volumetric hydraulic compaction',
        'Placement in lined sanitary cell with leachate capture',
        'Anaerobic methane extraction for local grid electricity'
      ],
      circularityScore: 12,
      finalProduct: 'Methane Landfill Gas Energy Recovery'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_05',
      valves: [18, 19, 20],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 25
    }
  },
  {
    id: 'ITEM_HDPE_JUG_003',
    name: '1-Gallon Natural Milk Jug',
    commonName: 'Translucent Dairy Bottle (HDPE #2)',
    primaryMaterial: 'High-Density Polyethylene',
    targetBinId: 'BIN_B_HDPE_RIGID',
    targetBinName: 'Bin B: Rigid HDPE',
    weightGrams: 64.8,
    greaseSaturationPct: 0,
    isCrushed: false,
    isSoiled: false,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: false,
    spectralPoints: generateSpectralCurve(1215, 1730, 0.78, 0.015),
    dominantPeakNm: 1215,
    preparationSteps: [
      'Rinse residual dairy with warm water to prevent sour odor and bacterial slime',
      'Leave HDPE cap attached',
      'Deposit in Rigid Plastic Bin'
    ],
    downstreamProcess: {
      facilityType: 'Polyolefin Recycling Plant',
      transformationSteps: [
        'Mechanical hammer-mill shredding',
        'Float-sink wash tank (HDPE floats at 0.95 g/cm³ density)',
        'Continuous melt extrusion with vacuum degassing',
        'Strand pelletization'
      ],
      circularityScore: 91,
      finalProduct: 'Corrugated Agricultural Drainage Pipe & Detergent Bottles'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_02',
      valves: [7, 8, 9],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 16
    }
  },
  {
    id: 'ITEM_CHIP_BAG_004',
    name: 'Foil-Lined Potato Chip Pouch',
    commonName: 'Multilayer Metallized Film (BOPP / LDPE / AL)',
    primaryMaterial: 'Multilayer Metallized Laminate Film',
    targetBinId: 'BIN_E_RESIDUAL_LANDFILL',
    targetBinName: 'Bin E: Residual Landfill',
    weightGrams: 9.6,
    greaseSaturationPct: 18,
    isCrushed: true,
    isSoiled: true,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: true,
    wishcyclingReason: 'Wishcycling Interception: Metallized pouches fuse aluminum foil at molecular thickness to plastic films. Mechanical reclaimers cannot delaminate these layers, resulting in clogged melt filters.',
    spectralPoints: generateSpectralCurve(1050, 1420, 0.38, 0.05),
    dominantPeakNm: 1050,
    preparationSteps: [
      'Do not throw into rigid plastics or clean film bins',
      'Dispose directly into general waste / landfill bin',
      'Search for brand return-to-store specialized takeback programs'
    ],
    downstreamProcess: {
      facilityType: 'Refuse Derived Fuel (RDF) Processing',
      transformationSteps: [
        'Shredding and blending with dry combustible refuse',
        'Pelletization into solid recovered fuel',
        'High-temperature cement kiln co-firing'
      ],
      circularityScore: 18,
      finalProduct: 'Kiln Thermal Energy Replacement for Coal'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_05',
      valves: [21, 22],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 10
    }
  },
  {
    id: 'ITEM_ORGANIC_SCRAP_005',
    name: 'Kitchen Prep Vegetable & Fruit Scraps',
    commonName: 'Raw Vegetable Trimmings & Coffee Grounds',
    primaryMaterial: 'Biodegradable Organic Biomass (Moisture: 72%)',
    targetBinId: 'BIN_C_ORGANICS_FOOD_SCRAPS',
    targetBinName: 'Bin C: Pure Organics',
    weightGrams: 142.0,
    greaseSaturationPct: 2,
    isCrushed: true,
    isSoiled: true,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: false,
    spectralPoints: generateSpectralCurve(1450, 1940, 0.42, 0.03),
    dominantPeakNm: 1450,
    preparationSteps: [
      'Peel all non-compostable PLU stickers off fruits',
      'Remove rubber bands, twist ties, and wire tags',
      'Deposit in kitchen organics caddy'
    ],
    downstreamProcess: {
      facilityType: 'Continuous Thermophilic Anaerobic Digester',
      transformationSteps: [
        'Rotary maceration into organic slurry',
        'Pasteurization at 70°C for pathogen elimination',
        '30-day mesophilic anaerobic digestion',
        'Biogas desulfurization and methane generation',
        'Centrifuge dewatering into soil-amendment cake'
      ],
      circularityScore: 98,
      finalProduct: 'Renewable Compressed Natural Gas (R-CNG) & Class-A Organic Compost'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_03',
      valves: [11, 12, 13],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 20
    }
  },
  {
    id: 'ITEM_CARDBOARD_CLEAN_006',
    name: 'Clean Corrugated Shipping Carton',
    commonName: 'Amazon / Shipping Box (Dry OCC)',
    primaryMaterial: 'Unbleached Kraft Cellulose Fiber',
    targetBinId: 'BIN_D_FIBER_CLEAN',
    targetBinName: 'Bin D: Clean Fiber',
    weightGrams: 180.0,
    greaseSaturationPct: 0,
    isCrushed: true,
    isSoiled: false,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: false,
    isWishcyclingRisk: false,
    spectralPoints: generateSpectralCurve(1490, 1590, 0.72, 0.01),
    dominantPeakNm: 1490,
    preparationSteps: [
      'Flatten carton completely to conserve collection truck volume',
      'Strip packing tape wider than 50mm if heavily applied',
      'Remove all plastic bubble pouches and styrofoam inserts'
    ],
    downstreamProcess: {
      facilityType: 'Containerboard Paper Mill',
      transformationSteps: [
        'Continuous pulper immersion with warm water agitation',
        'Pressure screening to remove staples and residual tape',
        'Centrifugal cleaning to reject sand and grit',
        'Fourdrinier paper machine sheet formation and steam drying'
      ],
      circularityScore: 96,
      finalProduct: '100% Recycled Medium & Linerboard for Packaging'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_04',
      valves: [14, 15, 16],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 22
    }
  },
  {
    id: 'ITEM_PVC_CONTAMINATED_007',
    name: 'PET Beverage Bottle with Full PVC Sleeve',
    commonName: 'Sports Drink with Heat-Shrink PVC Wrap',
    primaryMaterial: 'PET Body with Polyvinyl Chloride Sleeve',
    targetBinId: 'BIN_A_PET_CLEAR',
    targetBinName: 'Bin A: Clear PET (Secondary Processing Required)',
    weightGrams: 31.4,
    greaseSaturationPct: 0,
    isCrushed: false,
    isSoiled: false,
    isOccluded: true,
    hasPvcSleeve: true,
    hasCarbonBlack: false,
    isWishcyclingRisk: true,
    wishcyclingReason: 'Contamination Threat: PVC has identical density to PET (1.38 g/cm³) and cannot be separated in float-sink tanks. When heated, PVC releases toxic hydrochloric acid (HCl), degrading PET chains and blackening resin.',
    spectralPoints: generateSpectralCurve(1250, 1660, 0.65, 0.03),
    dominantPeakNm: 1250,
    preparationSteps: [
      'Locate the perforated zipper line on the label',
      'Peel and discard the PVC plastic label into Bin E',
      'Rinse and deposit the clear PET bottle body into Bin A'
    ],
    downstreamProcess: {
      facilityType: 'Secondary Optical Sorter with High-Speed Label Stripper',
      transformationSteps: [
        'Rotary blade delabeler puncture',
        'Pneumatic label aspiration air curtain',
        'NIR secondary verification scan',
        'Hot caustic granulation'
      ],
      circularityScore: 78,
      finalProduct: 'Standard Industrial rPET Flake'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_01',
      valves: [5, 6],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 14
    }
  },
  {
    id: 'ITEM_BLACK_PLASTIC_008',
    name: 'Black Microwave Food Tray',
    commonName: 'Black Carbon-Pigmented Takeout Tray (PP #5)',
    primaryMaterial: 'Carbon-Black Polypropylene',
    targetBinId: 'BIN_E_RESIDUAL_LANDFILL',
    targetBinName: 'Bin E: Residual Landfill',
    weightGrams: 34.0,
    greaseSaturationPct: 8,
    isCrushed: false,
    isSoiled: true,
    isOccluded: false,
    hasPvcSleeve: false,
    hasCarbonBlack: true,
    isWishcyclingRisk: true,
    wishcyclingReason: 'Sensor Blindspot: Carbon black pigment absorbs near-infrared radiation completely. Standard NIR optical sorters receive zero reflected photons and treat the item as empty conveyor belt, sending it to landfill.',
    spectralPoints: [
      { wavelengthNm: 900, reflectance: 0.04 },
      { wavelengthNm: 1100, reflectance: 0.03 },
      { wavelengthNm: 1300, reflectance: 0.03 },
      { wavelengthNm: 1500, reflectance: 0.02 },
      { wavelengthNm: 1700, reflectance: 0.02 }
    ],
    dominantPeakNm: 0,
    preparationSteps: [
      'Unless your municipality specifically advertises black-plastic mid-IR or AI optical upgrades, place in Bin E',
      'Avoid purchasing single-use carbon black packaging',
      'Rinse food residues before disposal'
    ],
    downstreamProcess: {
      facilityType: 'Advanced Chemical Pyrolysis / Sanitary Landfill',
      transformationSteps: [
        'Thermal anaerobic depolymerization (pyrolysis) if advanced chemical facility exists',
        'Otherwise managed via sanitary engineered landfill'
      ],
      circularityScore: 22,
      finalProduct: 'Pyrolysis Oil / Synthetic Crude Naphtha'
    },
    actuatorTarget: {
      manifoldBank: 'AIR_JET_BANK_05',
      valves: [23, 24],
      actuatorType: 'PNEUMATIC_VALVE',
      blastDurationMs: 15
    }
  }
];

export const ANTI_WISHCYCLING_STANDARDS = [
  {
    forbidden: 'Single-Stream Recyclables',
    required: 'Deposit strictly into verified material chutes; no mixed organics with fiber.',
    reason: 'Single-stream leads to 25%+ average contamination, ruining valuable fiber.'
  },
  {
    forbidden: 'Biodegradable Plastic Cups',
    required: 'Sort as Residual unless verified ASTM D6400 industrial facility available.',
    reason: 'PLA looks like PET but melts at 150°C instead of 260°C, ruining PET recycling batches.'
  },
  {
    forbidden: 'Food-Soiled Paper Containers',
    required: 'Tear off clean lids only; send greasy bottoms (>15% oil) to compost or residual.',
    reason: 'Oil fibers cannot form hydrogen bonds in water during repulping.'
  },
  {
    forbidden: 'Plastic Grocery Shopping Bags',
    required: 'Store drop-off only; never place loose bags on sorting conveyor belts.',
    reason: 'Thin films wrap around rotary sorting screens, shutting down MRF lines for hours.'
  }
];
