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
      className="fixed bottom-0 left-0 right-0 h-[60vh] sm:h-[450px] bg-[#0a0a0a] border-t border-white/10 shadow-2xl z-[70] font-mono rounded-none overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 justify-center items-center rounded-none bg-white/5 border border-white/10 text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-white">Smart Maintenance Ledger</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 border border-white/10 text-white/50 hover:text-white hover:border-white transition-colors rounded-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:px-10">
        <div className="max-w-5xl mx-auto space-y-6 text-left">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
             <div>
               <h3 className="text-white text-xs font-bold uppercase tracking-wider">Predictive Pipeline (Last 5 Reports)</h3>
               <p className="text-white/40 text-[10px] mt-1 font-sans">Based on visual anomalies and structural wear patterns detected.</p>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-mono px-3 py-1.5 bg-[#050505] text-white border border-white/10 rounded-none uppercase tracking-widest">
               <TrendingUp className="h-3.5 w-3.5" /> 87% CONFIDENCE SCORE
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Urgent Maintenance */}
            <div className="bg-[#050505] border border-white/10 p-5 hover:border-white transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex justify-between items-start mb-3 font-mono">
                  <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white rounded-none">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-[8px] font-bold text-red-400 px-2 py-0.5 border border-red-500/20 bg-red-950/20 rounded-none">URGENT</span>
                </div>
                <h4 className="text-white text-xs font-bold uppercase">Forklift Route Docks</h4>
                <p className="text-[11px] text-white/60 mt-2 leading-relaxed font-sans">
                  Consistent micro-abrasions detected on South entrance ramps across 3 consecutive scans. Risk of imminent structural slip hazard.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-[9px]">
                <span className="font-mono text-white/40 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Execute in 48h</span>
                <button className="text-white hover:underline uppercase tracking-wider font-bold">
                  Schedule
                </button>
              </div>
            </div>

            {/* Impending Repair */}
            <div className="bg-[#050505] border border-white/10 p-5 hover:border-white transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex justify-between items-start mb-3 font-mono">
                  <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white rounded-none">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span className="text-[8px] font-bold text-amber-400 px-2 py-0.5 border border-amber-500/20 bg-amber-950/20 rounded-none">WARNING</span>
                </div>
                <h4 className="text-white text-xs font-bold uppercase">Pallet Rack Fasteners</h4>
                <p className="text-[11px] text-white/60 mt-2 leading-relaxed font-sans">
                  Visual drift detected in vertical alignment (-2 degrees) on racks E-4 through E-8. Suggests loose fastening connections.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-[9px]">
                <span className="font-mono text-white/40 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Optimize in 7d</span>
                <button className="text-white hover:underline uppercase tracking-wider font-bold">
                  Schedule
                </button>
              </div>
            </div>

            {/* Routine Optimization */}
            <div className="bg-[#050505] border border-white/10 p-5 hover:border-white transition-colors flex flex-col justify-between rounded-none">
              <div>
                <div className="flex justify-between items-start mb-3 font-mono">
                  <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white rounded-none">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400 px-2 py-0.5 border border-emerald-500/20 bg-emerald-950/20 rounded-none">ROUTINE</span>
                </div>
                <h4 className="text-white text-xs font-bold uppercase">Lighting Arrays (Zone C)</h4>
                <p className="text-[11px] text-white/60 mt-2 leading-relaxed font-sans">
                  Shadow analysis shows a 12% luminosity drop. While safe, preemptive replacement improves general AI scanning clarity.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-[9px]">
                <span className="font-mono text-white/40 uppercase flex items-center gap-1.5"><CalendarClock className="h-3 w-3" /> Plan for 30d</span>
                <button className="text-white hover:underline uppercase tracking-wider font-bold">
                  Schedule
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
