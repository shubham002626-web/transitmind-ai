import { motion } from "motion/react";
import { X, ArrowRightLeft, FileSearch, ShieldCheck, AlertTriangle } from "lucide-react";
import { Report } from "../types";

interface CompareSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  targetReport: Report | null;
}

export default function CompareSidebar({ isOpen, onClose, targetReport }: CompareSidebarProps) {
  if (!isOpen || !targetReport) return null;

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-16 left-0 bottom-0 w-full sm:w-[380px] bg-[#0a0a0a] border-r border-white/10 shadow-2xl z-[60] flex flex-col font-mono rounded-none"
    >
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#050505]">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-white" />
          <span className="font-bold text-xs uppercase tracking-wider text-white">Baseline Comparison</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 border border-white/10 text-white/50 hover:text-white hover:border-white transition-colors rounded-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="p-4 bg-[#050505] border border-white/10 rounded-none">
          <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5 uppercase">
            <FileSearch className="h-4 w-4 text-white" /> Standard Baseline Model
          </h3>
          <p className="text-[10px] text-white/60 leading-relaxed font-sans">
            Comparing selected report #{targetReport.id.substring(0, 8)} against the operational safety standard model for this sector.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] text-white/40 px-1 border-b border-white/5 pb-2">
            <span className="uppercase">Metric</span>
            <span className="flex-1 text-center uppercase">Baseline</span>
            <span className="flex-1 text-right uppercase">Current</span>
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-white/60 w-1/3">Safety Index</span>
            <span className="w-1/3 text-center font-bold text-white">100%</span>
            <span className="w-1/3 text-right font-bold text-white">
              {targetReport.safetyScore}%
            </span>
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-white/60 w-1/3">Yard Efficiency</span>
            <span className="w-1/3 text-center font-bold text-white">95%</span>
            <span className="w-1/3 text-right font-bold text-white">
              {targetReport.warehouseScore}%
            </span>
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-white/60 w-1/3">Anomalies</span>
            <span className="w-1/3 text-center font-bold text-white">0</span>
            <span className="w-1/3 text-right font-bold text-white">
              {targetReport.issues.length}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">COMPLIANCE DEVIATIONS</h4>
          {targetReport.issues.length === 0 ? (
             <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-[#050505] p-3 rounded-none border border-emerald-500/20">
               <ShieldCheck className="h-4 w-4" />
               MATCHES BASELINE PERFECTLY.
             </div>
          ) : (
            targetReport.issues.map(issue => (
              <div key={issue.id} className="p-3 bg-[#050505] border border-white/10 rounded-none flex gap-3 items-start">
                <AlertTriangle className="h-4 w-4 text-white/60 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-white uppercase">{issue.category}</div>
                  <div className="text-[11px] font-sans text-white/60 mt-1 leading-relaxed">{issue.description}</div>
                  <div className="text-[8px] text-white/85 mt-2 font-mono bg-white/5 inline-block px-2 py-0.5 border border-white/15 uppercase rounded-none">
                    Standard: Clear path per OS-72.
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
