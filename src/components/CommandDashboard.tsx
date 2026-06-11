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
  HelpCircle,
  TrendingUp,
  Download,
  Flame,
  Wrench,
  Clock,
  Globe,
  Filter,
  Calendar
} from "lucide-react";
import { Report, PlatformMetrics, RiskLevel, ReportType } from "../types";
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
         // Simple days difference (rough estimate assuming uploadDate is parsable)
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

  // Health Score = Average of safety and warehouse scores
  const logisticsHealthScore = Math.round((averageSafety + averageWarehouse) / 2);

  // Safety Risk Score is inverse of Safety Score
  const safetyRiskScore = Math.round(100 - averageSafety);

  const totalReportsGenerated = validReports.length;
  
  const activeIncidents = validReports.reduce(
    (acc, r) => acc + r.issues.filter(i => i.severity === "high").length, 
    0
  );

  // Latest report results to showcase in real-time "Analysis Summary" layout widget
  const latestReport = validReports[0] || null;

  // Generate 30 days of mock data for the trend chart
  const trendData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      // Base score is randomly varying to look realistic, but anchored to current logisticsHealthScore for end of chart
      const isEnd = i === 29;
      // create a slight upward trend ending near the actual score
      const baseVariation = Math.sin(i / 3) * 5 + (i * 0.5);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: isEnd ? logisticsHealthScore : Math.min(100, Math.max(0, 65 + baseVariation + Math.floor(Math.random() * 8))),
      };
    });
  }, [logisticsHealthScore]);

  // Risk gradient and color configurations
  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-red-400 bg-red-950/30 border-red-500/25";
      case "MEDIUM": return "text-amber-400 bg-amber-950/30 border-amber-500/25";
      case "LOW": return "text-emerald-400 bg-emerald-950/30 border-emerald-500/25";
      default: return "text-slate-400 bg-slate-900/30 border-white/[0.05]";
    }
  };

  const getSeverityBadge = (sev: "high" | "medium" | "low") => {
    switch (sev) {
      case "high": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "low": return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
    }
  };

  // SVG Gauge variables
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (logisticsHealthScore / 100) * circumference;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left relative">
      
      {/* Floating Filter Bar */}
      <div className="sticky top-0 z-30 mb-8 p-3 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto md:border-r border-white/[0.1] md:pr-4 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider pl-2">
            <Filter className="h-4 w-4" /> Global Filter
          </div>
          {(filterRegion !== "ALL" || filterFacility !== "ALL" || filterDate !== "ALL") && (
             <div className="md:hidden px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-mono uppercase tracking-wider">
               Filters Active
             </div>
          )}
        </div>
        
        <div className="flex flex-1 items-center gap-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar scroll-smooth">
          {/* Region Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-slate-950/50 border border-white/[0.05] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            >
              <option value="ALL">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>

          {/* Facility Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="bg-slate-950/50 border border-white/[0.05] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            >
              <option value="ALL">All Facilities</option>
              <option value={ReportType.WAREHOUSE}>Warehouse</option>
              <option value={ReportType.CARGO}>Cargo Deck</option>
              <option value={ReportType.LOADING}>Truck Loading</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-slate-950/50 border border-white/[0.05] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            >
              <option value="ALL">All Time</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Active Filters Tag */}
        {(filterRegion !== "ALL" || filterFacility !== "ALL" || filterDate !== "ALL") && (
           <div className="shrink-0 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-mono uppercase tracking-wider hidden md:block">
             Filters Active
           </div>
        )}
      </div>

      {/* Title & Stats Refresh Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-5.5 w-5.5 text-cyan-500" />
            Operational Command Center
          </h1>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Real-time visual quality metrics across active transit zones, cargo hubs, and storage yards.
          </p>
        </div>
        
        {/* Timestamp */}
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] py-1.5 px-3 border border-white/[0.06] font-mono text-[10px] text-slate-400">
          <Clock className="h-3.5 w-3.5 text-cyan-500" />
          <span>LAST REPORT SNAPSHOT: JUST NOW</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        
        {/* 1. Logistics Health Score Card */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(34,211,238,0.15)" }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-5 border border-white/[0.06] relative overflow-hidden flex flex-col justify-between" id="kpi-health-score">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">HEALTH INDEX</span>
              <div className="text-3xl font-display font-extrabold text-white mt-1">{logisticsHealthScore}%</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span className="font-sans text-[10px] text-slate-300">Average of Safety & Warehouse scores</span>
          </div>
          <div className="absolute right-0 bottom-0 h-16 w-16 bg-cyan-500/5 blur-xl rounded-full"></div>
        </motion.div>

        {/* 2. Safety Risk Score Card */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(239,68,68,0.15)" }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-5 border border-white/[0.06] relative overflow-hidden flex flex-col justify-between" id="kpi-safety-risk">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">ACTIVE RISK PROFILE</span>
              <div className="text-3xl font-display font-extrabold text-white mt-1">{safetyRiskScore}%</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-red-500">{activeIncidents} Critical Issues</span>
            <span className="font-sans text-[10px] text-slate-400">awaiting supervisor action</span>
          </div>
          <div className="absolute right-0 bottom-0 h-16 w-16 bg-red-500/5 blur-xl rounded-full"></div>
        </motion.div>

        {/* 3. Warehouse Efficiency Score */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(99,102,241,0.15)" }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-5 border border-white/[0.06] relative overflow-hidden flex flex-col justify-between" id="kpi-warehouse-efficiency">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">YARD EFFICIENCY</span>
              <div className="text-3xl font-display font-extrabold text-white mt-1">{averageWarehouse}%</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="font-sans text-[10px] text-slate-300">Space density calibration</span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">STABLE</span>
          </div>
          <div className="absolute right-0 bottom-0 h-16 w-16 bg-indigo-500/5 blur-xl rounded-full"></div>
        </motion.div>

        {/* 4. Active Audits Vault */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(16,185,129,0.15)" }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-5 border border-white/[0.06] relative overflow-hidden flex flex-col justify-between" id="kpi-audits-generated">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">AUDIT LOG COUNT</span>
              <div className="text-3xl font-display font-extrabold text-white mt-1">{totalReportsGenerated} Loaded</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="font-sans text-[10px] text-slate-300">All saved persistent logs</span>
            <span className="font-mono text-[9px] text-emerald-500">100% SECURE</span>
          </div>
          <div className="absolute right-0 bottom-0 h-16 w-16 bg-emerald-500/5 blur-xl rounded-full"></div>
        </motion.div>

        {/* 5. Forecast Analysis */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(168,85,247,0.15)" }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-5 border border-white/[0.06] relative overflow-hidden flex flex-col justify-between" id="kpi-forecast">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">7-DAY FORECAST</span>
              <div className="text-[28px] leading-none font-display font-extrabold text-white mt-1">High</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-sans text-[10px] text-slate-300">Predicted incident risk</span>
            <span className="font-mono text-[9px] text-red-400 border border-red-500/20 bg-red-500/10 px-1 py-0.5 rounded flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" /> +12%</span>
          </div>
          <div className="absolute right-0 bottom-0 h-16 w-16 bg-purple-500/5 blur-xl rounded-full"></div>
        </motion.div>
      </div>

      {/* Main Core Section: Gauge Visual + Latest Audit Evaluation widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-8">
        
        {/* Left Column: Visual Circular Gauge Layout (Large Bento block) */}
        <div className="glass-panel rounded-2xl p-6.5 border border-white/[0.06] lg:col-span-5 flex flex-col justify-between min-h-[350px]">
          <div>
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Visual Health Gauge</span>
            <h2 className="font-display font-bold text-white text-base mt-1.5">Global System Health Index</h2>
            <p className="font-sans text-[11px] text-slate-400 leading-normal mt-1">
              Dynamic aggregate score calculating safety, spatial layouts, lashing wear, and stacking integrity indices.
            </p>
          </div>

          {/* Glowing Animated Circular Score Gauge */}
          <div className="flex items-center justify-center my-6 relative">
            <svg className="h-44 w-44 transform -rotate-90">
              {/* Back Circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Progress Circle with neon gradient */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth="11"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 0px 8px rgba(34, 211, 238, 0.5))"
                }}
              />
            </svg>
            
            {/* Center Text Panel */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-extrabold text-white tracking-tighter">
                {logisticsHealthScore}%
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wide text-slate-400 mt-0.5">
                {logisticsHealthScore >= 80 ? "LOW RISK PROFILE" : logisticsHealthScore >= 50 ? "MEDIUM RISK" : "CRITICAL RISK"}
              </span>
            </div>
          </div>

          {/* Quick recommendations breakdown */}
          <div className="flex items-center justify-around border-t border-white/[0.05] pt-4 text-center font-mono">
            <div>
              <div className="text-[11px] text-slate-500 uppercase">SAFETY RATIO</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">{averageSafety}%</div>
            </div>
            <div className="border-l border-white/[0.05] h-8"></div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase">YARD FLOW</div>
              <div className="text-sm font-bold text-indigo-400 mt-1">{averageWarehouse}%</div>
            </div>
            <div className="border-l border-white/[0.05] h-8"></div>
            <div>
              <div className="text-[11px] text-slate-500 uppercase">INCIDENTS</div>
              <div className="text-sm font-bold text-red-400 mt-1">{activeIncidents}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest Analysis Summary Bento block */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6.5 shadow-[0_0_30px_rgba(34,211,238,0.05)] lg:col-span-7 flex flex-col justify-between">
          {latestReport ? (
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                    ACTIVE DIRECTIVE ({latestReport.id})
                  </span>
                  
                  {/* Risk Badge with dynamic formatting */}
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${getRiskColor(latestReport.riskLevel)}`}>
                    {latestReport.riskLevel} RISK EVALUATION
                  </span>
                </div>
                
                <h3 className="font-display font-semibold text-white mt-2.5 text-base hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => onSelectReport(latestReport)}>
                  {latestReport.title}
                </h3>
                
                {/* Executive Summary */}
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed mt-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  {latestReport.executiveSummary}
                </p>
              </div>

              {/* 30-Day Trend Chart */}
              <div className="w-full h-[140px] mt-2 bg-slate-900/40 rounded-xl p-3 border border-white/5 relative z-10">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Logistics Health Score (30-Day Trend)</span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">LIVE DATA</span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                        minTickGap={20}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={[0, 100]} 
                        width={25}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-slate-900)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '8px', 
                          fontSize: '10px',
                          color: '#f8fafc'
                        }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#22d3ee" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4, fill: '#0ea5e9', stroke: 'var(--color-slate-950)', strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grid of issues and recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                
                {/* Issues list */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white pb-2 border-b border-white/[0.04] mb-2.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span>Captured Operational Issues ({latestReport.issues.length})</span>
                  </div>
                  {latestReport.issues.length === 0 ? (
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> No high-risk anomalies detected.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {latestReport.issues.map((issue) => (
                        <div key={issue.id} className="text-[11px] bg-slate-800/40 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white truncate">{issue.category}</span>
                            <span className={`text-[8px] font-mono px-1 rounded ${getSeverityBadge(issue.severity)}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[10px] mt-1 leading-normal">{issue.description}</p>
                          {issue.location && (
                            <span className="text-[9px] font-mono text-slate-500 mt-1 block flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5 text-cyan-500" /> {issue.location}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white pb-2 border-b border-white/[0.04] mb-2.5">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Resolving Recommendations</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {latestReport.recommendations.map((rec, i) => (
                      <div key={i} className="text-[11px] text-slate-300 leading-normal bg-slate-800/40 p-3 rounded-xl border border-white/5 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-mono text-[10px] font-bold">L{i + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
                <button
                  id="view-report-detail-btn"
                  onClick={() => onSelectReport(latestReport)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Inspect Detailed Full Audit
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDownloadPDF(latestReport)}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] py-1.5 px-3 text-[10px] font-mono font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white flex items-center gap-1"
                >
                  <Download className="h-3 w-3 text-cyan-400" /> EXPORT PDF CERTIFICATE
                </button>
              </div>
            </div>
          ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
              <ShieldAlert className="h-10 w-10 text-slate-600 mb-3" />
              <h3 className="font-display text-sm font-semibold text-white">No active reports generated</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Upload layout pictures within the AI Risk Scanner page to execute first visual safety audit.
              </p>
              <button
                onClick={onNavigateToAnalyzer}
                className="mt-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 py-1.5 px-4 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20"
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
      <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.06] flex-wrap gap-4">
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Recent Visual Audited Archives</h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">Active ledger tracking compliance safety records compiled in platform</p>
          </div>
          <button
            onClick={onNavigateToAnalyzer}
            className="rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[10px] font-mono tracking-tight text-cyan-400 border border-cyan-500/20 py-1.5 px-3"
          >
            + EXECUTE NEW RISK ASSESSMENT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01] text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 font-medium">REPORT ID</th>
                <th className="py-3.5 px-6 font-medium">AUDIT SPECIALTY</th>
                <th className="py-3.5 px-6 font-medium">UPLOAD DATE</th>
                <th className="py-3.5 px-6 font-medium text-center">RISK LEVEL</th>
                <th className="py-3.5 px-6 font-medium text-center">METRIC SUMMARY</th>
                <th className="py-3.5 px-6 font-medium text-right">ACTION COMMANDS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {validReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-white/[0.02] transition-colors relative"
                  id={`recent-table-row-${report.id}`}
                >
                  {/* Report ID */}
                  <td className="py-4 px-6 font-mono text-xs text-white font-semibold">
                    {report.id}
                  </td>
                  
                  {/* Audit Specialist */}
                  <td className="py-4 px-6 text-xs text-slate-200">
                    <div>
                      <span className="font-semibold block text-slate-200">{report.title}</span>
                      <span className="font-mono text-[9px] text-slate-500 block mt-0.5">{report.type}</span>
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">
                    {report.uploadDate}
                  </td>
                  
                  {/* Risk Level Badge */}
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </td>
                  
                  {/* Metric summary gauge text */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center gap-3 font-mono text-[10px] text-slate-300">
                      <span className="flex items-center gap-1" title="Safety compliance rating">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        S:{report.safetyScore}
                      </span>
                      <span className="flex items-center gap-1" title="Warehouse spatial score">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                        W:{report.warehouseScore}
                      </span>
                      <span className="flex items-center gap-1" title="Anomalies count">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                        A:{report.issues.length}
                      </span>
                    </div>
                  </td>
                  
                  {/* Action triggers */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => onSelectReport(report)}
                        className="text-[10px] font-mono text-cyan-400 hover:text-white transition-colors"
                      >
                        [INSPECT]
                      </button>
                      <button
                        onClick={() => onDownloadPDF(report)}
                        className="text-[10px] font-mono text-slate-500 hover:text-white transition-colors flex items-center gap-0.5"
                        title="Download official PDF copy"
                      >
                        <Download className="h-3 w-3" />
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
      <div className="mt-8 glass-panel rounded-2xl border border-white/[0.06] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-4 z-10">
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-white/[0.1] flex items-center justify-center text-cyan-400">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-lg">Global Fleet Status</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time system inspection overview across all integrated sites.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          {/* Active Inspections */}
          <div className="flex-1 md:flex-none flex flex-col pt-4 md:pt-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Active Scans</span>
            <span className="font-display text-2xl font-bold text-white">{validReports.length}</span>
          </div>

          {/* Vertical Divider */}
          <div className="h-10 w-[1px] bg-white/[0.1] hidden md:block"></div>

          {/* Clean */}
          <div className="flex-1 md:flex-none flex items-center gap-3 pt-4 md:pt-0">
             <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
               <ShieldCheck className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Clean Status</span>
               <span className="font-display text-xl font-bold text-emerald-400">{validReports.filter(r => r.riskLevel === 'LOW').length}</span>
             </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-10 w-[1px] bg-white/[0.1] hidden md:block"></div>

          {/* Flagged */}
          <div className="flex-1 md:flex-none flex items-center gap-3 pt-4 md:pt-0">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
               <AlertTriangle className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Flagged Risks</span>
               <span className="font-display text-xl font-bold text-amber-400">{validReports.filter(r => r.riskLevel !== 'LOW').length}</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
