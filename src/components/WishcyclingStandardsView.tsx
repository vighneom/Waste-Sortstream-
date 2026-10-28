import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { ANTI_WISHCYCLING_STANDARDS } from '../data/wasteCatalog';

export const WishcyclingStandardsView: React.FC = () => {
  const caseStudies = [
    {
      title: 'Grease Saturation in Paperboard & Kraft Pulping',
      contaminant: 'Triglycerides & cooking oils (>15% concentration)',
      impact: 'Cellulose fibers bond via microscopic hydrogen bridges in aqueous suspension. Hydrophobic lipids coat the fibers, preventing hydration and hydrogen bonding. A single 200g greasy pizza box can ruin an entire 20-metric-ton hydropulper batch, leading to weak paper with oil holes and mill rejection.',
      standardRule: 'Tear off clean lid for paper recycling; strictly divert oil-stained bottom to Municipal Compost or Residual Landfill.'
    },
    {
      title: 'PVC Contamination in PET Flake Extrusion',
      contaminant: 'Polyvinyl Chloride shrink-wrap labels on PET bottles',
      impact: 'PET and PVC have almost identical specific gravities (~1.38 g/cm³), rendering standard float-sink density separation useless. During melt extrusion at 260°C, PVC begins thermal decomposition, liberating toxic gaseous hydrogen chloride (HCl). HCl acid attacks workers, corrodes steel extruder screws, and causes catastrophic polymer yellowing.',
      standardRule: 'SortIQ triggers high-speed mechanical label delabelers or diverts PVC-sleeved bottles to secondary optical sorting before wash tanks.'
    },
    {
      title: 'Carbon Black Optical Absorption Blindspots',
      contaminant: 'Carbon black pigment in microwave food trays',
      impact: 'Carbon black particles absorb photons uniformly across the entire Near-Infrared electromagnetic spectrum (900nm - 1700nm). With zero back-scattered reflectance, NIR sensors register the item as ambient darkness or empty belt, causing high-value polypropylene (PP) to be dumped into landfill.',
      standardRule: 'Flag black polymers for specialized mid-infrared (MIR) sensors or route deterministically to waste-to-energy.'
    },
    {
      title: 'Multilayer Metallized Barrier Laminates (Chip Bags)',
      contaminant: 'Biaxially Oriented Polypropylene (BOPP) + Aluminum Vapor (0.02µm)',
      impact: 'Consumers assume shiny packaging contains recyclable aluminum or plastic. In reality, the polymer and metal layers are thermo-laminated at molecular levels. There is no commercial mechanical process to separate these layers at scale; placing them in recycling bins clogs melt filters.',
      standardRule: 'Label deterministically as Non-Recyclable Residual Waste to prevent contamination.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Environmental Sustainability Engineering Constitution
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Zero-Tolerance Anti-Wishcycling Governance
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            "Wishcycling"—throwing non-recyclables into recycling bins hoping they will somehow be recycled—is the single greatest cause of recycling facility downtime, bale devaluation, and plastic reclaimer financial collapse.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-800/80 px-3.5 py-2 rounded-lg text-xs font-mono text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Strict Deterministic Sorting Mandate</span>
        </div>
      </div>

      {/* Mandatory Terminology Standard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-2">
          Municipal Sorting Vocabulary Standards
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Ambiguous language fuels wishcycling. SortIQ enforces unambiguous, physical-action directives across all public-facing kiosks and restaurant terminals:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Forbidden Vague Terms */}
          <div className="bg-slate-950 border border-rose-900/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rose-900/40 text-rose-400">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">
                Banned Ambiguous Terms (Causes Wishcycling)
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono">✖</span>
                <div>
                  <strong className="text-rose-300">"Single-Stream Recyclables"</strong>
                  <p className="text-slate-400 text-[11px]">Invites contaminated food waste and loose film bags.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono">✖</span>
                <div>
                  <strong className="text-rose-300">"Biodegradable / Eco-Packaging"</strong>
                  <p className="text-slate-400 text-[11px]">Misleads users into throwing PLA cups into PET streams.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono">✖</span>
                <div>
                  <strong className="text-rose-300">"Check Locally"</strong>
                  <p className="text-slate-400 text-[11px]">Passes cognitive burden to user, resulting in wishful tossing.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Mandatory Clear Terms */}
          <div className="bg-slate-950 border border-emerald-900/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-900/40 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">
                Mandatory Deterministic Terms (SortIQ Standard)
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono">✔</span>
                <div>
                  <strong className="text-emerald-300">"Deposit Only: Clear Drained Bottles"</strong>
                  <p className="text-slate-400 text-[11px]">Clear physical condition requirement before deposit.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono">✔</span>
                <div>
                  <strong className="text-emerald-300">"Non-Recyclable: Wet or Greasy Paperboard"</strong>
                  <p className="text-slate-400 text-[11px]">Explicit condition criteria stops fiber batch rejection.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono">✔</span>
                <div>
                  <strong className="text-emerald-300">"Certified Food Scraps Only: No Utensils"</strong>
                  <p className="text-slate-400 text-[11px]">Prevents microplastic fragmentation in digester compost.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engineering Technical Case Studies */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">
          Technical Contamination Case Studies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold block mb-1">
                  Engineering Case Study 0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-100 mb-2">
                  {cs.title}
                </h4>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 mb-3 text-xs">
                  <span className="text-slate-500 font-mono block">Chemical / Mechanical Contaminant:</span>
                  <span className="text-rose-300 font-medium">{cs.contaminant}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cs.impact}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-500 font-mono block mb-0.5">SortIQ Standard Protocol:</span>
                <p className="text-emerald-300 font-medium">
                  {cs.standardRule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
