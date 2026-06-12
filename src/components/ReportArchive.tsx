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
  ShieldCheck, 
  Filter,
  Layers,
  ArrowUpRight,
  Trash2,
  CheckSquare,
  Square,
  LayoutGrid,
  List
} from "lucide-react";
import { Report } from "../types";

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
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReports.map(r => r.id));
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
      case "HIGH": return "text-red-400 bg-red-950/20 border-red-500/20";
      case "MEDIUM": return "text-amber-400 bg-amber-950/20 border-amber-500/20";
      case "LOW": return "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
      default: return "text-white/60 bg-[#0a0a0a] border-white/10";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-left space-y-8">
      
      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
          <FileText className="h-5.5 w-5.5 text-white" />
          Audit Vault Ledger
        </h1>
        <p className="font-sans text-xs text-white/60 mt-1">
          Historical listing of visual inspections, compliance records, and signed export certificates.
        </p>
      </div>

      {/* Filters & Search Grid */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-none">
        
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="SEARCH RECORDS LEDGER..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#050505] border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors rounded-none font-mono"
          />
        </div>

        {/* Filter Specialty */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-white/40 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white rounded-none"
          >
            <option value="ALL">ALL SPECIALTIES</option>
            <option value="WAREHOUSE">WAREHOUSE</option>
            <option value="CARGO">CARGO DAMAGE</option>
            <option value="TRUCK_LOADING">LOAD SECURITY</option>
          </select>
        </div>

        {/* Filter Risk */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-white/40 shrink-0" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white rounded-none"
          >
            <option value="ALL">ALL RISK LEVELS</option>
            <option value="LOW">LOW RISK</option>
            <option value="MEDIUM">MEDIUM RISK</option>
            <option value="HIGH">HIGH RISK</option>
          </select>
        </div>

      </div>

      {/* Bulk Actions & View Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            {selectedIds.length === filteredReports.length && filteredReports.length > 0 ? (
              <CheckSquare className="h-4.5 w-4.5 text-white" />
            ) : (
              <Square className="h-4.5 w-4.5 text-white/40" />
            )}
            <span>SELECT ALL</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 font-bold border border-red-500/20 transition-colors rounded-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              DELETE ({selectedIds.length})
            </button>
          )}

          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDownload}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold border border-white hover:bg-[#050505] hover:text-white transition-colors rounded-none disabled:opacity-50"
            >
              {isZipping ? (
                <div className="h-3.5 w-3.5 border border-black border-t-transparent animate-spin rounded-none"></div>
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {isZipping ? "PACKAGING..." : `ZIP EXPORT (${selectedIds.length})`}
            </button>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex items-center bg-[#0a0a0a] border border-white/10 p-1 rounded-none self-end sm:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-none text-white/40 hover:text-white transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : ''}`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`p-1.5 rounded-none text-white/40 hover:text-white transition-colors ${viewMode === 'timeline' ? 'bg-white/10 text-white' : ''}`}
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
              className={`bg-[#0a0a0a] border transition-all flex flex-col justify-between h-[360px] relative rounded-none ${
                selectedIds.includes(report.id) ? "border-white" : "border-white/10 hover:border-white/30"
              }`}
              id={`archive-card-${report.id}`}
            >
              {/* Target Area Checkbox Overlay */}
              <div 
                className="absolute top-3 left-3 z-10 cursor-pointer p-1"
                onClick={() => handleToggleSingle(report.id)}
              >
                {selectedIds.includes(report.id) ? (
                  <div className="bg-white text-black border border-white">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="bg-black/60 text-white/40 hover:text-white border border-white/10 backdrop-blur-sm transition-all">
                    <Square className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div>
                
                {/* Card Header image simulation */}
                <div className="h-32 bg-black overflow-hidden relative cursor-pointer border-b border-white/5" onClick={() => handleToggleSingle(report.id)}>
                  {report.imageUrl ? (
                    <img 
                      src={report.imageUrl} 
                      alt={report.title} 
                      className="object-cover w-full h-full opacity-40 grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <FileText className="h-10 w-10" />
                    </div>
                  )}
                  
                  {/* Overlay labels */}
                  <div className="absolute inset-x-3 bottom-2 flex items-center justify-between font-mono">
                    <span className="text-[9px] bg-black px-2 py-0.5 border border-white/10 text-white font-bold">
                      {report.id}
                    </span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 border uppercase tracking-wider rounded-none ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="p-5 text-left space-y-2">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                    {report.title}
                  </h3>

                  <div className="flex items-center gap-3 font-mono text-[9px] text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-white/60" />
                      {report.uploadDate}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-white/60">
                      {report.type.replace("_", " ")}
                    </span>
                  </div>

                  <p className="font-sans text-[11px] text-white/60 line-clamp-3 leading-relaxed">
                    {report.executiveSummary}
                  </p>
                </div>
              </div>

              {/* Bottom metrics and trigger button */}
              <div className="border-t border-white/15 p-4 bg-[#050505] flex items-center justify-between rounded-none">
                
                <div className="flex gap-2 font-mono text-[9px]">
                  <div className="flex items-center gap-1 bg-[#0a0a0a] px-2 py-0.5 border border-white/5 text-white/60">
                    <span className="h-1 w-1 bg-white"></span>
                    S:{report.safetyScore}
                  </div>
                  <div className="flex items-center gap-1 bg-[#0a0a0a] px-2 py-0.5 border border-white/5 text-white/60">
                    <span className="h-1 w-1 bg-white/60"></span>
                    W:{report.warehouseScore}
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="flex items-center gap-2 font-mono">
                  <button
                    onClick={() => onSelectReport(report)}
                    className="text-[10px] font-bold text-white hover:underline uppercase tracking-wider"
                    id={`inspect-archive-btn-${report.id}`}
                  >
                    INSPECT
                  </button>
                  <button
                    onClick={() => onDownloadPDF(report)}
                    className="p-1.5 bg-[#0a0a0a] border border-white/10 hover:border-white text-white transition-colors"
                    title="Export Audit PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
              
            </div>
          ))
        ) : (
          <div className="md:col-span-3 py-20 text-center bg-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center rounded-none font-mono">
            <Calendar className="h-10 w-10 text-white/20 mb-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">No matches found</h3>
            <p className="text-xs text-white/40 mt-1 max-w-xs px-4">
              Clear your query or filters, or execute a new AI Risk analysis snapshot inside the dashboard.
            </p>
          </div>
        )}
        </div>
      ) : (
        <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-8 pb-12 mt-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="relative pl-6 md:pl-10 group text-left">
                {/* Timeline dot */}
                <div className="absolute -left-[4.5px] top-4 h-2.5 w-2.5 bg-black border border-white/40 group-hover:border-white transition-colors z-10 flex items-center justify-center"></div>

                {/* Timeline timestamp (desktop) */}
                <div className="absolute -left-36 md:-left-40 top-3.5 font-mono text-[9px] text-white/40 group-hover:text-white transition-colors w-28 md:w-32 text-right hidden sm:block">
                  {report.uploadDate}
                </div>

                {/* Card */}
                <div 
                  className={`bg-[#0a0a0a] border flex flex-col sm:flex-row rounded-none ${
                    selectedIds.includes(report.id) ? "border-white" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex-1 p-5 font-mono">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleToggleSingle(report.id)} className="shrink-0 text-white/40 hover:text-white transition-colors">
                            {selectedIds.includes(report.id) ? (
                              <CheckSquare className="h-5 w-5 text-white" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            {report.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2.5 ml-8 text-[9px]">
                          <span className="bg-[#050505] border border-white/5 px-2 py-0.5 text-white/50 font-semibold uppercase">
                            REF: {report.id}
                          </span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 border uppercase tracking-wider rounded-none ${getRiskColor(report.riskLevel)}`}>
                            {report.riskLevel}
                          </span>
                        </div>
                        <div className="sm:hidden text-[9px] text-white/40 mt-2 flex items-center gap-1 ml-8">
                          <Calendar className="h-3 w-3" /> {report.uploadDate}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectReport(report)}
                          className="text-[9px] font-bold text-black bg-white hover:bg-white/80 px-3 py-1.5 transition-colors uppercase tracking-widest rounded-none border border-white"
                        >
                          INSPECT
                        </button>
                      </div>
                    </div>
                    
                    <p className="font-sans text-[11px] text-white/60 line-clamp-2 leading-relaxed ml-8">
                      {report.executiveSummary}
                    </p>
                    
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5 ml-8 text-[9px]">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 uppercase">Safety Index</span>
                        <span className="font-bold text-white">{report.safetyScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 uppercase">Warehouse Index</span>
                        <span className="font-bold text-white">{report.warehouseScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center -ml-4 md:-ml-32 rounded-none font-mono">
              <Calendar className="h-10 w-10 text-white/20 mb-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">No matches found</h3>
              <p className="text-xs text-white/40 mt-1 max-w-xs px-4">
                Clear your query or filters, or execute a new AI Risk analysis snapshot inside the dashboard.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
