/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  ShieldAlert, 
  Activity, 
  Percent, 
  FileText, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck,
  MapPin, 
  Layers, 
  Clock, 
  Globe, 
  Filter, 
  Calendar,
  Download,
  TrendingUp
} from "lucide-react";
import { Report, ReportType } from "../types";
import IntelligenceMap from "./IntelligenceMap";

interface CommandDashboardProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onNavigateToAnalyzer: () => void;
  onDownloadPDF: (report: Report) => void;
}

export default function CommandDashboard({
  reports,
  onSelectReport,
  onNavigateToAnalyzer,
  onDownloadPDF
}: CommandDashboardProps) {

  // Filtration State
  const [filterRegion, setFilterRegion] = useState("ALL");
  const [filterFacility, setFilterFacility] = useState("ALL");
  const [filterDate, setFilterDate] = useState("ALL");

  // Calculate aggregated health scores dynamically from registered dataset
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // Mock region by ID hash
      const regionHash = r.id.charCodeAt(0) % 3; // 0, 1, 2
      const regions = ["North America", "Europe", "Asia Pacific"];
      const reportRegion = regions[regionHash];
      const matchRegion = filterRegion === "ALL" || filterRegion === reportRegion;

      const matchFacility = filterFacility === "ALL" || r.type === filterFacility;
      
      let matchDate = true;
      if (filterDate !== "ALL") {
         const d = new Date(r.uploadDate);
         const now = new Date();
         const diffTime = Math.abs(now.getTime() - d.getTime());
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
         if (filterDate === "7D" && diffDays > 7) matchDate = false;
         if (filterDate === "30D" && diffDays > 30) matchDate = false;
         if (filterDate === "90D" && diffDays > 90) matchDate = false;
      }

      return matchRegion && matchFacility && matchDate;
    });
  }, [reports, filterRegion, filterFacility, filterDate]);

  const validReports = filteredReports.length > 0 ? filteredReports : [];
  
  const averageSafety = validReports.length > 0
    ? Math.round(validReports.reduce((sum, r) => sum + r.safetyScore, 0) / validReports.length)
    : 85;

  const averageWarehouse = validReports.length > 0
    ? Math.round(validReports.reduce((sum, r) => sum + r.warehouseScore, 0) / validReports.length)
    : 82;

  const logisticsHealthScore = Math.round((averageSafety + averageWarehouse) / 2);
  const safetyRiskScore = Math.round(100 - averageSafety);
  const totalReportsGenerated = validReports.length;
  
  const activeIncidents = validReports.reduce(
    (acc, r) => acc + r.issues.filter(i => i.severity === "high").length, 
    0
  );

  const latestReport = validReports[0] || null;

  // Generate 30 days of mock data for the trend chart
  const trendData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const isEnd = i === 29;
      const baseVariation = Math.sin(i / 3) * 5 + (i * 0.5);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: isEnd ? logisticsHealthScore : Math.min(100, Math.max(0, 65 + baseVariation + Math.floor(Math.random() * 8))),
      };
    });
  }, [logisticsHealthScore]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-red-400 bg-red-950/20 border-red-500/20";
      case "MEDIUM": return "text-amber-400 bg-amber-950/20 border-amber-500/20";
      case "LOW": return "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
      default: return "text-white/60 bg-[#0a0a0a] border-white/10";
    }
  };

  const getSeverityBadge = (sev: "high" | "medium" | "low") => {
    switch (sev) {
      case "high": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "low": return "bg-white/10 text-white/80 border border-white/10";
    }
  };

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (logisticsHealthScore / 100) * circumference;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-left relative space-y-8">
      
      {/* Floating Filter Bar */}
      <div className="sticky top-16 z-30 p-4 bg-[#0a0a0a] border border-white/10 flex flex-col md:flex-row md:items-center gap-4 rounded-none">
        <div className="flex items-center justify-between w-full md:w-auto md:border-r border-white/10 md:pr-4 shrink-0">
          <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
            <Filter className="h-4 w-4" /> FILTERS
          </div>
          {(filterRegion !== "ALL" || filterFacility !== "ALL" || filterDate !== "ALL") && (
             <div className="md:hidden px-2 py-0.5 border border-white/30 text-white text-[9px] font-mono uppercase tracking-wider rounded-none">
               Active
             </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-wrap items-center gap-4">
          {/* Region Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="h-3.5 w-3.5 text-white/40" />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-none px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="ALL">ALL REGIONS</option>
              <option value="North America">NORTH AMERICA</option>
              <option value="Europe">EUROPE</option>
              <option value="Asia Pacific">ASIA PACIFIC</option>
            </select>
          </div>

          {/* Facility Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="h-3.5 w-3.5 text-white/40" />
            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-none px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="ALL">ALL FACILITIES</option>
              <option value={ReportType.WAREHOUSE}>WAREHOUSE</option>
              <option value={ReportType.CARGO}>CARGO DECK</option>
              <option value={ReportType.LOADING}>TRUCK LOADING</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-white/40" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-none px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="ALL">ALL TIME</option>
              <option value="7D">LAST 7 DAYS</option>
              <option value="30D">LAST 30 DAYS</option>
              <option value="90D">LAST 90 DAYS</option>
            </select>
          </div>
        </div>

        {(filterRegion !== "ALL" || filterFacility !== "ALL" || filterDate !== "ALL") && (
           <div className="shrink-0 px-2 py-0.5 border border-white/30 text-white text-[9px] font-mono uppercase tracking-wider hidden md:block rounded-none">
             FILTERS ACTIVE
           </div>
        )}
      </div>

      {/* Title & Stats Refresh Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Activity className="h-5.5 w-5.5 text-white" />
            Command Center
          </h1>
          <p className="font-sans text-xs text-white/60 mt-1">
            Real-time visual quality metrics across active transit zones, cargo hubs, and storage yards.
          </p>
        </div>
        
        {/* Timestamp */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] py-2 px-4 border border-white/10 font-mono text-[10px] text-white/60 rounded-none">
          <Clock className="h-3.5 w-3.5" />
          <span>LEDGER STATUS: CALIBRATED</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* 1. Logistics Health Score Card */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "#ffffff" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] p-6 border border-white/10 flex flex-col justify-between rounded-none relative group" 
          id="kpi-health-score"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">HEALTH INDEX</span>
              <div className="text-4xl font-extrabold text-white mt-2 leading-none">{logisticsHealthScore}%</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-6 font-mono text-[9px] text-white/50 leading-relaxed uppercase">
            Aggregate safety & stack flow metrics
          </p>
        </motion.div>

        {/* 2. Safety Risk Score Card */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "#ffffff" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] p-6 border border-white/10 flex flex-col justify-between rounded-none relative group" 
          id="kpi-safety-risk"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">RISK PROFILE</span>
              <div className="text-4xl font-extrabold text-white mt-2 leading-none">{safetyRiskScore}%</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-6 font-mono text-[9px] text-red-400 leading-relaxed uppercase">
            {activeIncidents} High Severity Anomalies
          </p>
        </motion.div>

        {/* 3. Warehouse Efficiency Score */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "#ffffff" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] p-6 border border-white/10 flex flex-col justify-between rounded-none relative group" 
          id="kpi-warehouse-efficiency"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">YARD DENSITY</span>
              <div className="text-4xl font-extrabold text-white mt-2 leading-none">{averageWarehouse}%</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-6 font-mono text-[9px] text-white/50 leading-relaxed uppercase">
            Flow layout efficiency calibration
          </p>
        </motion.div>

        {/* 4. Active Audits Vault */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "#ffffff" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] p-6 border border-white/10 flex flex-col justify-between rounded-none relative group" 
          id="kpi-audits-generated"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">TOTAL AUDITS</span>
              <div className="text-4xl font-extrabold text-white mt-2 leading-none">{totalReportsGenerated}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-6 font-mono text-[9px] text-white/50 leading-relaxed uppercase">
            Inspected secure visual logs
          </p>
        </motion.div>

        {/* 5. Forecast Analysis */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "#ffffff" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] p-6 border border-white/10 flex flex-col justify-between rounded-none relative group" 
          id="kpi-forecast"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">7D RISK OUTLOOK</span>
              <div className="text-4xl font-extrabold text-white mt-2 leading-none">HIGH</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 text-white">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between font-mono text-[9px] uppercase">
            <span className="text-white/40">TREND FORECAST</span>
            <span className="text-red-400 font-bold">+12% ACCELERATION</span>
          </div>
        </motion.div>
      </div>

      {/* Main Core Section: Gauge Visual + Latest Audit Evaluation widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Visual Circular Gauge Layout (Large Bento block) */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between min-h-[350px] rounded-none lg:col-span-4">
          <div>
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Visual Health Gauge</span>
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider mt-2">Global System Health Index</h2>
            <p className="font-sans text-[11px] text-white/60 leading-relaxed mt-2">
              Dynamic aggregate score calculating safety, spatial layouts, lashing wear, and stacking integrity indices.
            </p>
          </div>

          {/* Simple Circular Score Gauge */}
          <div className="flex items-center justify-center my-6 relative">
            <svg className="h-40 w-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-white/10"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-white transition-all duration-1000 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
              />
            </svg>
            
            {/* Center Text Panel */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-4xl font-extrabold text-white tracking-tighter">
                {logisticsHealthScore}%
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-white/40 mt-1">
                {logisticsHealthScore >= 80 ? "LOW RISK PROFILE" : logisticsHealthScore >= 50 ? "MEDIUM RISK" : "CRITICAL RISK"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-white/10 pt-4 text-center font-mono text-[10px]">
            <div>
              <div className="text-white/40 uppercase">SAFETY INDEX</div>
              <div className="text-xs font-bold text-white mt-1">{averageSafety}%</div>
            </div>
            <div className="border-l border-white/10 h-6"></div>
            <div>
              <div className="text-white/40 uppercase">YARD FLOW</div>
              <div className="text-xs font-bold text-white mt-1">{averageWarehouse}%</div>
            </div>
            <div className="border-l border-white/10 h-6"></div>
            <div>
              <div className="text-white/40 uppercase">HAZARDS</div>
              <div className="text-xs font-bold text-white mt-1">{activeIncidents}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest Analysis Summary Bento block */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between rounded-none lg:col-span-8">
          {latestReport ? (
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    ACTIVE DIRECTIVE ({latestReport.id})
                  </span>
                  
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider rounded-none ${getRiskColor(latestReport.riskLevel)}`}>
                    {latestReport.riskLevel} RISK EVALUATION
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white uppercase tracking-tight hover:text-white/70 transition-colors cursor-pointer" onClick={() => onSelectReport(latestReport)}>
                  {latestReport.title}
                </h3>
                
                <p className="font-sans text-[11px] text-white/75 leading-relaxed p-4 bg-[#050505] border border-white/5 rounded-none">
                  {latestReport.executiveSummary}
                </p>
              </div>

              {/* 30-Day Trend Chart */}
              <div className="w-full h-[140px] bg-[#050505] p-3 border border-white/5 rounded-none relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white">
                    <TrendingUp className="h-3.5 w-3.5 text-white/60" />
                    <span>Logistics Health Score (30-Day Trend)</span>
                  </div>
                  <span className="text-[8px] font-mono text-white bg-white/10 px-1.5 py-0.5 border border-white/20">TELEMETRY_LOG</span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#444444" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        minTickGap={20}
                        fontFamily="JetBrains Mono"
                      />
                      <YAxis 
                        stroke="#444444" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={[0, 100]} 
                        width={20}
                        fontFamily="JetBrains Mono"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0a', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '0px', 
                          fontSize: '9px',
                          fontFamily: 'JetBrains Mono',
                          color: '#FAFAFA'
                        }}
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#ffffff" 
                        strokeWidth={1.5} 
                        dot={false}
                        activeDot={{ r: 3, fill: '#ffffff', stroke: '#050505', strokeWidth: 1.5 }}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grid of issues and recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 text-left">
                
                {/* Issues list */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/50 pb-2 border-b border-white/5">
                    <AlertTriangle className="h-3.5 w-3.5 text-white/40" />
                    <span>DETECTED HAZARDS ({latestReport.issues.length})</span>
                  </div>
                  {latestReport.issues.length === 0 ? (
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> No high-risk anomalies detected.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {latestReport.issues.map((issue) => (
                        <div key={issue.id} className="text-[11px] bg-[#050505] p-3 border border-white/5 rounded-none">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white truncate uppercase">{issue.category}</span>
                            <span className={`text-[8px] font-mono px-1 rounded-none ${getSeverityBadge(issue.severity)}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white/60 text-[10px] mt-1.5 leading-relaxed">{issue.description}</p>
                          {issue.location && (
                            <span className="text-[9px] font-mono text-white/40 mt-1 block flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" /> {issue.location}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/50 pb-2 border-b border-white/5">
                    <TrendingUp className="h-3.5 w-3.5 text-white/40" />
                    <span>RESOLVING MANUAL INSTRUCTIONS</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {latestReport.recommendations.map((rec, i) => (
                      <div key={i} className="text-[11px] text-white/80 leading-relaxed bg-[#050505] p-3 border border-white/5 flex items-start gap-2 rounded-none">
                        <span className="text-white font-mono text-[10px] font-bold">L{i + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-white/15 pt-4">
                <button
                  id="view-report-detail-btn"
                  onClick={() => onSelectReport(latestReport)}
                  className="text-[11px] font-mono font-bold text-white hover:underline hover:underline-offset-4 transition-all flex items-center gap-1 uppercase tracking-wider"
                >
                  INSPECT DRILLDOWN
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDownloadPDF(latestReport)}
                  className="border border-white/10 bg-[#050505] py-2 px-4 text-[10px] font-mono font-bold text-white hover:bg-white hover:text-black transition-colors flex items-center gap-1.5 uppercase tracking-widest rounded-none"
                >
                  <Download className="h-3.5 w-3.5" /> EXPORT PDF
                </button>
              </div>
            </div>
          ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
              <ShieldAlert className="h-10 w-10 text-white/40 mb-3" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">No active reports generated</h3>
              <p className="text-xs text-white/60 mt-1 max-w-sm">
                Upload layout pictures within the AI Risk Scanner page to execute first visual safety audit.
              </p>
              <button
                onClick={onNavigateToAnalyzer}
                className="mt-6 bg-white text-black font-mono text-xs font-bold py-3 px-6 hover:bg-white/90 transition-colors uppercase tracking-widest rounded-none border border-white"
              >
                Scan Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-system Operations Intelligence Map */}
      <IntelligenceMap />

      {/* Reports Table / Recent Activity Section */}
      <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden rounded-none">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Visual Audited Archives Ledger</h3>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">Active ledger tracking compliance safety records compiled in platform</p>
          </div>
          <button
            onClick={onNavigateToAnalyzer}
            className="bg-[#050505] border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest py-2 px-4 hover:bg-white hover:text-black transition-colors rounded-none"
          >
            + EXECUTE NEW RISK ASSESSMENT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black text-[9px] font-mono text-white/40 uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">REPORT ID</th>
                <th className="py-4 px-6 font-medium">AUDIT PROFILE</th>
                <th className="py-4 px-6 font-medium">UPLOAD DATE</th>
                <th className="py-4 px-6 font-medium text-center">RISK LEVEL</th>
                <th className="py-4 px-6 font-medium text-center">METRIC SUMMARY</th>
                <th className="py-4 px-6 font-medium text-right">ACTION COMMANDS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {validReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-white/5 transition-colors relative text-xs"
                  id={`recent-table-row-${report.id}`}
                >
                  <td className="py-4 px-6 font-bold text-white">
                    {report.id}
                  </td>
                  
                  <td className="py-4 px-6 text-white/80">
                    <div>
                      <span className="font-bold block text-white uppercase">{report.title}</span>
                      <span className="text-[9px] text-white/40 block mt-0.5">{report.type}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-white/60">
                    {report.uploadDate}
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 border uppercase tracking-wider rounded-none ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center gap-3 text-[10px] text-white/70">
                      <span className="flex items-center gap-1" title="Safety compliance rating">
                        <span className="h-1 w-1 bg-white"></span>
                        S:{report.safetyScore}
                      </span>
                      <span className="flex items-center gap-1" title="Warehouse spatial score">
                        <span className="h-1 w-1 bg-white/60"></span>
                        W:{report.warehouseScore}
                      </span>
                      <span className="flex items-center gap-1" title="Anomalies count">
                        <span className="h-1 w-1 bg-red-400"></span>
                        A:{report.issues.length}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onSelectReport(report)}
                        className="text-[10px] font-bold text-white hover:underline tracking-wider"
                      >
                        [INSPECT]
                      </button>
                      <button
                        onClick={() => onDownloadPDF(report)}
                        className="text-[10px] text-white/40 hover:text-white transition-colors"
                        title="Download official PDF copy"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Global Fleet Status Widget (Footer) */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden rounded-none">
        <div className="flex items-center gap-4 z-10 text-left">
          <div className="h-10 w-10 border border-white/10 bg-white/5 flex items-center justify-center text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Global Fleet Status Matrix</h3>
            <p className="text-xs text-white/40 mt-1">Real-time system inspection overview across all integrated sites.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10 w-full md:w-auto font-mono text-xs">
          {/* Active Inspections */}
          <div className="flex-1 md:flex-none flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Active Scans</span>
            <span className="text-2xl font-bold text-white">{validReports.length}</span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

          {/* Clean */}
          <div className="flex-1 md:flex-none flex items-center gap-3">
             <div className="h-8 w-8 border border-white/10 bg-white/5 text-white flex items-center justify-center shrink-0">
               <ShieldCheck className="h-4 w-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Clean Status</span>
               <span className="text-lg font-bold text-white">{validReports.filter(r => r.riskLevel === 'LOW').length}</span>
             </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

          {/* Flagged */}
          <div className="flex-1 md:flex-none flex items-center gap-3">
            <div className="h-8 w-8 border border-white/10 bg-white/5 text-white flex items-center justify-center shrink-0">
               <AlertTriangle className="h-4 w-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Flagged Risks</span>
               <span className="text-lg font-bold text-white">{validReports.filter(r => r.riskLevel !== 'LOW').length}</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
