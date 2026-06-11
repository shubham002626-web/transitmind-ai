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
      className="fixed top-16 left-0 bottom-0 w-full sm:w-[380px] bg-slate-900 border-r border-white/[0.05] shadow-2xl z-[60] flex flex-col font-sans"
    >
      <div className="h-14 border-b border-white/[0.05] flex items-center justify-between px-4 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-indigo-400" />
          <span className="font-semibold text-sm text-slate-100">Baseline Comparison</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <h3 className="text-sm font-semibold text-indigo-100 mb-1 flex items-center gap-1.5">
            <FileSearch className="h-4 w-4 text-indigo-400" /> Standard Baseline Model
          </h3>
          <p className="text-[11px] text-indigo-200/70">
            Comparing selected report #{targetReport.id.substring(0, 6)} against the operational safety standard model for this sector.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1 border-b border-white/5 pb-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase">Metric</span>
            <span className="flex-1 text-center font-mono text-[10px] text-slate-400 uppercase">Baseline</span>
            <span className="flex-1 text-right font-mono text-[10px] text-slate-400 uppercase">Current</span>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 w-1/3">Safety Index</span>
            <span className="w-1/3 text-center text-sm font-bold text-white">100%</span>
            <span className={`w-1/3 text-right text-sm font-bold ${
              targetReport.safetyScore >= 90 ? 'text-emerald-400' : 
              targetReport.safetyScore >= 70 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {targetReport.safetyScore}%
            </span>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 w-1/3">Yard Efficiency</span>
            <span className="w-1/3 text-center text-sm font-bold text-white">95%</span>
            <span className={`w-1/3 text-right text-sm font-bold ${
              targetReport.warehouseScore >= 90 ? 'text-emerald-400' : 
              targetReport.warehouseScore >= 70 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {targetReport.warehouseScore}%
            </span>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 w-1/3">Anomalies</span>
            <span className="w-1/3 text-center text-sm font-bold text-white">0</span>
            <span className="w-1/3 text-right text-sm font-bold text-red-400">
              {targetReport.issues.length}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wider">COMPLIANCE DEVIATIONS</h4>
          {targetReport.issues.length === 0 ? (
             <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
               <ShieldCheck className="h-4 w-4" />
               Matches operational baseline perfectly.
             </div>
          ) : (
            targetReport.issues.map(issue => (
              <div key={issue.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex gap-3 items-start">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-slate-200 uppercase">{issue.category}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-normal">{issue.description}</div>
                  <div className="text-[10px] text-amber-400/80 mt-1 font-mono bg-amber-500/10 inline-block px-1.5 py-0.5 rounded border border-amber-500/20">
                    EX: Clear path per OS-72.
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
