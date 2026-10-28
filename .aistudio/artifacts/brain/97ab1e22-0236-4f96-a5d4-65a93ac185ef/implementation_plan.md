# SortIQ PureStream OS & Web Portal

A high-speed sensor-driven municipal and industrial waste segregation operating system and guidance portal. Designed by an Environmental Sustainability Engineer, this platform interfaces with simulated and live optical RGB, Near-Infrared (NIR) hyperspectral spectroscopy, and gravimetric load cells to classify materials with ≥95% accuracy and under 50ms processing latency, triggering physical air-jet actuators while delivering unambiguous anti-wishcycling guidance to home, restaurant, and industrial operators.

## User Review & Critical Decisions

> [!IMPORTANT]
> Because questions were skipped in Phase 1, recommended architectural defaults have been applied:
> 1. **Dual-Operational Architecture**: Provides seamless switching between **Industrial MRF Conveyor & Actuator Console** (high-speed belt, NIR spectral charts, 32-valve pneumatic manifold logs) and the **Source-Segregation Guidance Terminal** (high-contrast kitchen/domestic operator kiosk with clear anti-wishcycling rules).
> 2. **Interactive Sensor & Actuator Simulator**: A real-time physics and optical conveyor simulator running at 240 FPS / 2.85 m/s belt speed with drop-in item testing, visual degradation controls (crushed, soiled, grease saturation), and instant sub-50ms trigger logs.
> 3. **Deterministic Anti-Wishcycling Governance**: Eliminates ambiguous greenwashing terms ("eco-friendly", "biodegradable", "single-stream") in favor of strict, deterministic disposal directives with downstream industrial recovery steps (flaking, hot wash, pelletization, anaerobic digestion).

- **Confirmed Decision 1**: Dual operational mode supporting both high-throughput MRF facilities and frontline kitchen/domestic sorting stations.
- **Confirmed Decision 2**: Integrated NIR spectroscopy signature analyzer with absorption peak matching (PET at 1130/1660nm, HDPE at 1215/1730nm, Organics at 1450/1940nm, Paperboard at 1490/1590nm).
- **Confirmed Decision 3**: Hardware calibration and latency budget audit bench with dark/white reference baselines, belt encoder synchronization, and pneumatic valve jitter tracking.

---

## 1. Overview & Core Concept

- **What It Does**: SortIQ PureStream OS ingests tri-sensor telemetry (RGB area-scan cameras, NIR hyperspectral spectrometers, and gravimetric digital load cells), runs quantized edge classification to identify polymer composition and contamination states within 40ms, fires pneumatic diverters/solenoids, and provides users with exact downstream recycling preparation instructions.
- **Target Audience / Persona**:
  - *MRF Plant Operators & Automation Engineers*: Need low-latency conveyor stream telemetry, valve firing verification, and bale purity tracking.
  - *Kitchen & Hospitality Staff / Factory Floor Sorters*: Need instant visual instructions (which bin, preparation requirements, anti-wishcycling alerts) without ambiguity.
  - *Sustainability Compliance Officers*: Require verifiable diversion tonnages, contamination interception metrics, and circularity lifecycle data.
- **Key Value**: Stops the catastrophic economic and mechanical damage caused by "wishcycling" (e.g., greasy pizza boxes ruining paper pulpers, PVC chlorine gas during rPET extrusion, or un-rinsed jugs downgrading high-value HDPE bales).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Live High-Speed Conveyor & Actuator Telemetry (Industrial Mode)**:
   - User watches a high-speed conveyor belt (2.85 m/s) with items passing under the synchronized optical strobe and NIR array.
   - For every detected item (e.g., clear PET bottle, grease-stained takeout container, HDPE milk jug, aluminium can, composite chip pouch):
     - RGB bounding box and visual degradation tags (`crushed`, `soiled`, `occluded`) appear.
     - Real-time NIR reflectance curve renders against standard library fingerprints.
     - Gravimetric weight readout updates.
     - Processing latency breakdown is logged ($8\text{ms}$ capture + $22\text{ms}$ inference + $4\text{ms}$ trigger + $6\text{ms}$ PLC = $40\text{ms} < 50\text{ms}$ threshold).
     - Target actuator (e.g., Pneumatic Air Jet Bank 04, Valves 7–9) fires with microsecond timing.
   - User can pause, inspect, manually drop custom items, alter belt speed, or introduce severe visual degradation.

2. **Source-Segregation Guidance Terminal (Kiosk / Domestic / Commercial Mode)**:
   - High-contrast, large-format station designed for mounting over waste bins in kitchens, restaurants, or community drop-offs.
   - Interactive item drop or barcode/camera scan simulator: Operator drops/scans an item.
   - Large high-visibility status verdict: Target bin color, exact stream name, and unambiguous instructions (e.g., "DEPOSIT IN BIN A: CLEAR PET", "RINSE RESIDUE", "REMOVE PVC SLEEVE", or "ROUTE TO BIN E: RESIDUAL TRASH - GREASE CONTAMINATED >15%").
   - Actionable circular economy pathway: Visualizes what happens next to the material (e.g., "Mechanical grinding → Caustic hot wash at 85°C → Optical flake sorter → Food-grade rPET pellets for new bottles").

3. **Stream Purity & Anti-Wishcycling Analytics**:
   - Bale purity gauge for each stream (PET, HDPE, Organics, Clean Fiber, Residual) tracking target $\ge 98\%$ purity floor.
   - Wishcycling Interception Counter: Demonstrates kilograms of contaminants diverted away from recyclers, financial penalties avoided, and landfill methane reduction.

4. **Hardware Calibration & Sensor Diagnostics Bench**:
   - Hyperspectral camera baseline calibration (White Ceramic Reference vs. Dark Current calibration).
   - Conveyor speed encoder pulse sync to prevent high-speed optical motion blur.
   - Pneumatic air pressure monitor (8 bar nominal) with valve latency and jitter testing.

### Visual Identity & Theme

- **Aesthetic Direction**: Clinical Precision Industrial Instrument / Clean Environmental Engineering. Flat, disciplined surfaces with hairline borders (`#E2E8F0` light / `#1E293B` dark), crisp technical geometry, and zero ornamental AI fluff.
- **Color Palette & Distribution (60-30-10 Rule)**:
  - *60% Neutral Ground*: Pristine clinical laboratory slate (`#090D16` dark mode / `#F8FAFC` light mode default with high-contrast accessibility).
  - *30% Structural Panels*: Flat container surfaces (`#0F172A` / `#FFFFFF`), 1px borders (`#1E293B` / `#E2E8F0`), and coordinate grid axes.
  - *10% Precision Stream Colors*:
    - **Bin A (PET Clear)**: Electric Cyan (`#06B6D4`)
    - **Bin B (HDPE Rigid)**: Cobalt Blue (`#3B82F6`)
    - **Bin C (Organics & Compost)**: Forest Emerald (`#10B981`)
    - **Bin D (Clean Fiber / Paperboard)**: Amber Ocher (`#F59E0B`)
    - **Bin E (Residual Landfill / Contaminated)**: Slate Rose / Crimson (`#F43F5E`)
- **Typography & Precision Notation**:
  - Headings & Interface: `Plus Jakarta Sans` / clean geometric typography.
  - Telemetry & Measurements: Dedicated tabular monospace (`font-mono tabular-nums`, `JetBrains Mono` style) for all wavelengths, microsecond timestamps, conveyor velocities, and weights.
  - Metric Display: Prominent numeric values with small, muted uppercase unit markers (`text-2xl font-semibold` + `text-xs font-mono text-slate-400 ml-1.5`).
- **Zero-Pill Discipline**: All status labels, timestamps, and categories rendered as clean, unboxed text with typographic separators (`·` or `/`). Segmented controls and operational mode switchers are styled as clean, functional buttons without garish bubble pills.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Hardware Simulator with Realistic Tri-Sensor Telemetry Engine**:
  - *Chosen Approach*: Implement a deterministic, high-frequency tick generator simulating the 240 FPS industrial camera, NIR hyperspectral spectrometer (900nm–1700nm wave curve), and strain-gauge load cell, coupled with a full manual test-drop catalog of real-world waste items (PET soda bottles, HDPE milk jugs, greasy pizza boxes, metallized chip bags, bioplastic PLA cups, compostable food waste).
  - *Why*: Allows anyone (evaluator, plant manager, or sustainability student) to experience the real-time sensor processing and sub-50ms actuator logic without needing physical USB spectrometers attached.
  - *Alternatives Considered*: Pure static mock views (rejected: failed to capture real-time conveyor physics, latency budget constraints, or anti-wishcycling interception triggers).

- **Decision 2: Strict Deterministic Taxonomy vs. Greenwashed Generic Labels**:
  - *Chosen Approach*: Replace misleading terms like "Recyclable", "Eco-friendly", or "Single-stream" with strict, ISO-compliant material codes and physical preparation checklists. Food-greased paperboard is strictly routed to Residual/Compost with explicit reasoning.
  - *Why*: As specified by senior environmental engineers, wishcycling is the leading cause of MRF downtime, mill batch rejection, and microplastic contamination.
  - *Alternatives Considered*: Vague standard "blue bin" labels (rejected: perpetuates contamination).

- **Decision 3: Dual Mode (Industrial Telemetry Console vs. Source Guidance Kiosk)**:
  - *Chosen Approach*: Provide a prominent, persistent mode switcher in the application toolbar allowing one-click toggling between the **MRF Industrial Console** and the **Kitchen/Domestic Guidance Kiosk**.
  - *Why*: The sensor hardware is versatile and deployed in both high-velocity industrial conveyors and high-volume commercial kitchens or community collection points.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SortIQ PureStream OS                            │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│     MRF Industrial Console           │  │  Guidance & Kiosk Terminal    │
│  - 240 FPS Conveyor Belt Stream      │  │  - Zero-Ambiguity Bin Verdict │
│  - Real-time NIR Spectral Curve      │  │  - Preparation Step Checklist │
│  - Sub-50ms Latency Budget Monitor   │  │  - Downstream Circularity Map │
│  - 32-Valve Pneumatic Manifold State │  │  - Contamination Audio/Visual │
└──────────────────────────────────────┘  └───────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│     Stream Purity & Analytics        │  │ Hardware Calibration Engine   │
│  - Bale Purity Indices (≥98% floor)  │  │ - NIR White/Dark Reference    │
│  - Wishcycling Interception Tonnage  │  │ - Rotary Encoder Belt Sync    │
│  - Economic Penalty Avoidance ($)    │  │ - Pneumatic Solenoid Jitter   │
└──────────────────────────────────────┘  └───────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Real-Time Sensor & Actuator Core Engine                │
│  - Tri-Sensor Ingest: RGB (240 FPS), NIR (900-1700nm), Load Cell (<15ms)│
│  - Fast Classification Model (<22ms quantized inference)               │
│  - Actuator Dispatcher: Air Jet Manifolds, Delta Robots, Diverters    │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Architecture

1. **Sensor Ingestion Packet (`SensorIngestPacket`)**:
   - `timestamp_utc_us`: Microsecond timestamp for jitter tracking.
   - `optical_payload`: Frame ID, bounding box $[x_{min}, y_{min}, x_{max}, y_{max}]$, degradation flags (`crushed`, `soiled`, `grease_pct`, `occluded`).
   - `spectral_payload`: Array of 20 wavelength points ($900\text{nm}$ to $1700\text{nm}$), dominant peak, polymer fingerprint.
   - `gravimetric_payload`: Load cell weight in grams ($\pm 0.1\text{g}$).
   - `conveyor_speed_mps`: Current belt velocity ($0.5$ to $4.0\text{m/s}$).

2. **Actuator Trigger Command (`ActuatorCommand`)**:
   - `command_id`: Unique execution identifier.
   - `target_actuator_id`: Pneumatic air jet bank (Valves 1–32) or Delta robot.
   - `destination_bin_id`: `BIN_A_PET_CLEAR`, `BIN_B_HDPE_RIGID`, `BIN_C_ORGANICS`, `BIN_D_FIBER_CLEAN`, `BIN_E_RESIDUAL`.
   - `latency_breakdown`: Optical capture, NIR inference, trigger calc, PLC handshake, total latency ($\le 50\text{ms}$).
   - `rejection_flag`: True if item is contaminated or cross-stream risk.

3. **Waste Taxonomy & Material Library**:
   - Exhaustive definitions for PET, HDPE, PP, Organics, Clean Paperboard, Soiled Cardboard, Multilayer Laminates (chip bags), Expanded Polystyrene, Aluminum, and PVC Contaminants.
   - Downstream circularity workflows (e.g., optical flake sorting, hot wash, anaerobic digestion, pyrolysis).

4. **Simulation & Hardware Calibration State**:
   - Conveyor run/pause, belt speed slider, automatic stream generation vs. manual item drop test.
   - NIR dark/white reference calibration status, signal-to-noise ratio (SNR), and rotary encoder synchronization.
