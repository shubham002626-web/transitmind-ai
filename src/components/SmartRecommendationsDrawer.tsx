import { motion } from "motion/react";
import { X, Lightbulb, Wrench, CalendarClock, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";

interface SmartRecommendationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartRecommendationsDrawer({ isOpen, onClose }: SmartRecommendationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 h-[60vh] sm:h-[450px] bg-slate-900 border-t border-white/[0.05] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-[70] font-sans rounded-t-3xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="h-16 border-b border-white/[0.05] flex items-center justify-between px-6 bg-slate-950/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 justify-center items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Lightbulb className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg text-slate-100">Smart Maintenance Recommendations</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:px-10">
        
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
             <div>
               <h3 className="text-slate-200 text-sm font-semibold">Predictive Pipeline (Last 5 Reports)</h3>
               <p className="text-slate-400 text-xs mt-1">Based on visual anomalies and structural wear patterns detected.</p>
             </div>
             <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
               <TrendingUp className="h-3.5 w-3.5" /> 87% Confidence Score
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Urgent Maintenance */}
            <div className="bg-white/[0.02] border border-red-500/10 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-500 px-2 py-0.5 rounded bg-red-500/10">URGENT</span>
                </div>
                <h4 className="text-slate-200 text-sm font-bold">Forklift Route Docks</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Consistent micro-abrasions detected on South entrance ramps across 3 consecutive scans. Risk of imminent structural slip hazard.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Execute in 48h</span>
                <button className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                  Schedule <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Impending Repair */}
            <div className="bg-white/[0.02] border border-amber-500/10 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">WARNING</span>
                </div>
                <h4 className="text-slate-200 text-sm font-bold">Pallet Rack Fasteners</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Visual drift detected in vertical alignment (-2 degrees) on racks E-4 through E-8. Suggests loose fastening connections.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Optimize in 7d</span>
                <button className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                  Schedule <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Routine Optimization */}
            <div className="bg-white/[0.02] border border-emerald-500/10 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendUpIcon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10">ROUTINE</span>
                </div>
                <h4 className="text-slate-200 text-sm font-bold">Lighting Arrays (Zone C)</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Shadow analysis shows a 12% luminosity drop. While safe, preemptive replacement improves general AI scanning clarity.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Plan for 30d</span>
                <button className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                  Schedule <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}

// Just a quick local wrapper icon if not imported
function TrendUpIcon(props: any) {
  return <TrendingUp {...props} />;
}
