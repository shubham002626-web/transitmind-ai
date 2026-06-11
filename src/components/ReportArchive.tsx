/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import JSZip from "jszip";
import { createPDFDocument } from "../utils/pdfGenerator";
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Filter,
  Layers,
  ArrowUpRight,
  Trash2,
  CheckSquare,
  Square,
  LayoutGrid,
  List
} from "lucide-react";
import { Report, ReportType, RiskLevel } from "../types";

interface ReportArchiveProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onDownloadPDF: (report: Report) => void;
  onDeleteReports: (ids: string[]) => void;
}

export default function ReportArchive({
  reports,
  onSelectReport,
  onDownloadPDF,
  onDeleteReports
}: ReportArchiveProps) {
  
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [isZipping, setIsZipping] = useState(false);

  const filteredReports = reports.filter((r) => {
    const matchesType = filterType === "ALL" || r.type === filterType;
    const matchesRisk = filterRisk === "ALL" || r.riskLevel === filterRisk;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRisk && matchesSearch;
  });

  const handleToggleSingle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredReports.length && filteredReports.length > 0) {
      setSelectedIds([]); // deselect all
    } else {
      setSelectedIds(filteredReports.map(r => r.id)); // select all
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} report(s)?`)) {
      onDeleteReports(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBatchDownload = async () => {
    if (selectedIds.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      
      const selectedReports = reports.filter(r => selectedIds.includes(r.id));
      
      for (const report of selectedReports) {
        const doc = createPDFDocument(report, false); 
        const pdfBlob = doc.output('blob');
        zip.file(`TransitMind-SafetyAudit-${report.id}.pdf`, pdfBlob);
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TransitMind_Reports_Batch_${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (e) {
      console.error("Failed to generate zip:", e);
      alert("Failed to batch export reports. Try again.");
    } finally {
      setIsZipping(false);
      setSelectedIds([]);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-red-400 bg-red-950/30 border-red-500/25";
      case "MEDIUM": return "text-amber-400 bg-amber-950/30 border-amber-500/25";
      case "LOW": return "text-emerald-400 bg-emerald-950/30 border-emerald-500/25";
      default: return "text-slate-400 bg-slate-900/30 border-white/[0.05]";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="h-5.5 w-5.5 text-cyan-500" />
          Logistics Audit Vault
        </h1>
        <p className="font-sans text-xs text-slate-400 mt-1">
          Historical listing of visual inspections, compliance records, and signed export certificates.
        </p>
      </div>

      {/* Filters & Search Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report ID, title, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Filter Specialty */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Specialties</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="CARGO">Cargo Damage</option>
            <option value="TRUCK_LOADING">Load Security</option>
          </select>
        </div>

        {/* Filter Risk */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High-alert Risk</option>
          </select>
        </div>

      </div>

      {/* Bulk Actions & View Mode Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            {selectedIds.length === filteredReports.length && filteredReports.length > 0 ? (
              <CheckSquare className="h-4.5 w-4.5 text-cyan-500" />
            ) : (
              <Square className="h-4.5 w-4.5 text-slate-500" />
            )}
            <span>Select All</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDownload}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/20 transition-colors disabled:opacity-50"
            >
              {isZipping ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {isZipping ? "Creating Zip..." : `Download Zip (${selectedIds.length})`}
            </button>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex items-center bg-slate-900 border border-white/[0.08] rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded text-slate-400 hover:text-white transition-colors ${viewMode === 'grid' ? 'bg-white/[0.08] text-white shadow-sm' : ''}`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`p-1.5 rounded text-slate-400 hover:text-white transition-colors ${viewMode === 'timeline' ? 'bg-white/[0.08] text-white shadow-sm' : ''}`}
            title="Timeline View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reports List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div 
              key={report.id} 
              className={`glass-panel rounded-2xl overflow-hidden border transition-all flex flex-col justify-between h-[350px] relative ${
                selectedIds.includes(report.id) ? "border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/30" : "border-white/[0.06] hover:border-cyan-500/20"
              }`}
              id={`archive-card-${report.id}`}
            >
              {/* Target Area Checkbox Overlay */}
              <div 
                className="absolute top-3 left-3 z-10 cursor-pointer p-1"
                onClick={() => handleToggleSingle(report.id)}
              >
                {selectedIds.includes(report.id) ? (
                  <div className="bg-cyan-500 rounded text-slate-950 shadow shadow-cyan-500/30 ring-1 ring-cyan-400">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="bg-slate-900/60 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 ring-1 ring-white/10 backdrop-blur-sm transition-all">
                    <Square className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div>
                
                {/* Card Header image simulation */}
                <div className="h-28 bg-slate-900 overflow-hidden relative cursor-pointer" onClick={() => handleToggleSingle(report.id)}>
                  {report.imageUrl ? (
                    <img 
                      src={report.imageUrl} 
                      alt={report.title} 
                      className="object-cover w-full h-full opacity-40"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-950 flex items-center justify-center text-slate-700">
                      <FileText className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                  
                  {/* Overlay labels */}
                  <div className="absolute inset-x-3 bottom-2 flex items-center justify-between">
                    <span className="font-mono text-[9px] bg-black/80 px-2 py-0.5 rounded text-white font-semibold">
                      {report.id}
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="p-4 text-left">
                  {/* Title */}
                  <h3 className="font-display text-sm font-semibold text-white leading-snug line-clamp-1">
                    {report.title}
                  </h3>

                  <div className="flex items-center gap-3 font-mono text-[9px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cyan-500" />
                      {report.uploadDate}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-slate-400">
                      {report.type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Summary text */}
                  <p className="font-sans text-[11px] text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                    {report.executiveSummary}
                  </p>
                </div>
              </div>

              {/* Bottom metrics and trigger button */}
              <div className="border-t border-white/[0.04] p-4 bg-white/[0.01] flex items-center justify-between">
                
                {/* Compact metrics badges */}
                <div className="flex gap-2 font-mono text-[9px] text-slate-400">
                  <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-white/[0.03]" title="Safety score check">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                    S:{report.safetyScore}
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-white/[0.03]" title="Warehouse optimization ratio">
                    <span className="h-1 w-1 bg-indigo-500 rounded-full"></span>
                    W:{report.warehouseScore}
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectReport(report)}
                    className="text-[10px] font-bold text-cyan-400 hover:text-white flex items-center gap-0.5"
                    id={`inspect-archive-btn-${report.id}`}
                  >
                    INSPECT
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDownloadPDF(report)}
                    className="p-1.5 rounded-md bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white"
                    title="Export Audit PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
              
            </div>
          ))
        ) : (
          <div className="md:col-span-3 py-16 text-center glass-panel rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center">
            <Calendar className="h-10 w-10 text-slate-600 mb-3" />
            <h3 className="font-display font-semibold text-white text-sm">No reports match filter criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm px-4">
              Clear your query or filters, or execute a new AI Risk analysis snapshot inside the dashboard.
            </p>
          </div>
        )}
        </div>
      ) : (
        <div className="relative border-l-2 border-white/[0.08] ml-4 md:ml-32 space-y-8 pb-12 mt-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="relative pl-6 md:pl-10 group">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-slate-950 border-2 border-slate-600 group-hover:border-cyan-500 transition-colors z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-500 group-hover:bg-cyan-400 transition-colors"></div>
                </div>

                {/* Timeline timestamp (desktop) */}
                <div className="absolute -left-36 md:-left-40 top-3 font-mono text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors w-28 md:w-32 text-right hidden sm:block">
                  {report.uploadDate}
                </div>

                {/* Card */}
                <div 
                  className={`glass-panel border rounded-xl overflow-hidden transition-all flex flex-col sm:flex-row ${
                    selectedIds.includes(report.id) ? "border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/30" : "border-white/[0.06] hover:border-cyan-500/20"
                  }`}
                >
                  {/* Left Column in Timeline context */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleToggleSingle(report.id)} className="shrink-0 text-slate-500 hover:text-cyan-400 transition-colors">
                            {selectedIds.includes(report.id) ? (
                              <CheckSquare className="h-5 w-5 text-cyan-500" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                          <h3 className="font-display text-sm font-semibold text-white leading-snug">
                            {report.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-8">
                          <span className="font-mono text-[9px] bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-slate-400 font-semibold uppercase">
                            REF: {report.id}
                          </span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getRiskColor(report.riskLevel)}`}>
                            {report.riskLevel}
                          </span>
                        </div>
                        <div className="sm:hidden font-mono text-[9px] text-slate-500 mt-2 flex items-center gap-1 ml-8">
                          <Calendar className="h-3 w-3" /> {report.uploadDate}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectReport(report)}
                          className="text-[10px] font-bold text-slate-800 bg-cyan-400 hover:bg-cyan-300 rounded px-3 py-1.5 flex items-center gap-1 transition-colors"
                        >
                          INSPECT
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed ml-8">
                      {report.executiveSummary}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.05] ml-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Safety</span>
                        <div className="h-1 w-16 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${report.safetyScore >= 90 ? 'bg-emerald-500' : report.safetyScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${report.safetyScore}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">{report.safetyScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Warehouse</span>
                        <div className="h-1 w-16 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${report.warehouseScore >= 90 ? 'bg-indigo-500' : report.warehouseScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${report.warehouseScore}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-indigo-400">{report.warehouseScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center glass-panel rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center -ml-4 md:-ml-32">
              <Calendar className="h-10 w-10 text-slate-600 mb-3" />
              <h3 className="font-display font-semibold text-white text-sm">No reports match filter criteria</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm px-4">
                Clear your query or filters, or execute a new AI Risk analysis snapshot inside the dashboard.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
