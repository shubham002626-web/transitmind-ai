/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Download, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Building,
  Terminal,
  HelpCircle,
  FileText,
  ArrowRightLeft
} from "lucide-react";
import { jsPDF } from "jspdf";

// Import custom layouts
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import CommandDashboard from "./components/CommandDashboard";
import RiskAnalyzer from "./components/RiskAnalyzer";
import ReportArchive from "./components/ReportArchive";
import ChatSidebar from "./components/ChatSidebar";
import CompareSidebar from "./components/CompareSidebar";
import SmartRecommendationsDrawer from "./components/SmartRecommendationsDrawer";
import NotificationSettingsModal from "./components/NotificationSettingsModal";
import RouteFinderModal from "./components/RouteFinderModal";
import ProjectShowcase from "./components/ProjectShowcase";
import DriverStressScanner from "./components/DriverStressScanner";

// Import types
import { Report, ReportType, RiskLevel } from "./types";
import { AIService } from "./services/aiService";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [reports, setReports] = useState<Report[]>([]);
  const [mockMode, setMockMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCompareSidebarOpen, setIsCompareSidebarOpen] = useState<boolean>(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState<boolean>(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState<boolean>(false);
  const [isRouteFinderOpen, setIsRouteFinderOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Load registered reports on mount
  useEffect(() => {
    async function loadData() {
      const data = await AIService.fetchReports();
      setReports(data);
    }
    loadData();
  }, []);

  const handleToggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  // Synchronize theme state to DOM classlist
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [theme]);

  const handleToggleMockMode = () => {
    setMockMode(!mockMode);
    showToast(mockMode ? "Toggled to: REAL GEMINI API PROCESSOR" : "Toggled to: LOCAL DEMO SIMULATOR");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4500);
  };

  // Add a newly compiled report to persistent lists and select it for immediate review
  const handleAnalysisSuccess = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
    showToast(`SUCCESS: Security Audit ${newReport.id} successfully compiled in command bank.`);
  };

  // Immersive Client-side PDF Report Generator
  const generatePDFExport = (report: Report) => {
    try {
      const doc = new jsPDF();
      
      // Page size properties
      const pageWidth = doc.internal.pageSize.width;
      
      // Outer border frame
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, 277);

      // Header Banner Section
      doc.setFillColor(15, 23, 42);
      doc.rect(11, 11, pageWidth - 22, 38, "F");

      // Header Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(34, 211, 238); // Cyan
      doc.text("TRANSITMIND AI", 20, 26);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text("LOGISTICS COMPUTER VISION COMPLIANCE CORE", 20, 31);
      doc.text("GLOBAL RISK AUDITING INTEGRITY MATRIX", 20, 35);

      // Certificate No & Stamp
      doc.setFillColor(34, 211, 238);
      doc.rect(pageWidth - 65, 18, 50, 24, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // Navy Dark
      doc.text("AUDIT SNAPSHOT", pageWidth - 60, 25);
      doc.setFontSize(9);
      doc.text(`ID: ${report.id}`, pageWidth - 60, 32);
      doc.text(`RISK: ${report.riskLevel}`, pageWidth - 60, 37);

      // Section: Basic metadata
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      
      // Draw grid line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, 58, pageWidth - 20, 58);

      doc.setFont("helvetica", "bold");
      doc.text("AUDIT REPORT METADATA & PROFILE", 20, 66);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(`Date of Audit: ${report.uploadDate}`, 20, 75);
      doc.text(`Security Specialty: ${report.type.replace("_", " ")} Assessment`, 20, 81);
      doc.text(`Asset Target Catalog: ${report.title}`, 20, 87);
      doc.text(`Evaluation Engine: ${mockMode ? "TransitMind Local Core Simulator V3" : "Server Google Gemini 3.5 Flash Visual"}`, 20, 93);

      // Score Board Panel (Radial representation blocks)
      doc.setFillColor(248, 250, 252);
      doc.rect(pageWidth - 90, 68, 70, 28, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(pageWidth - 90, 68, 70, 28, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text("INTELLIGENCE RATINGS", pageWidth - 85, 74);
      
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`Safety Index: ${report.safetyScore}%`, pageWidth - 85, 82);
      doc.text(`Yard Efficiency: ${report.warehouseScore}%`, pageWidth - 85, 89);

      // Divider
      doc.line(20, 102, pageWidth - 20, 102);

      // Core Executive Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("EXECUTIVE VISUAL ANALYSIS COMPLIANCE DIRECTIVE", 20, 111);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      // Text Wrapping for description
      const summaryLines = doc.splitTextToSize(report.executiveSummary, pageWidth - 40);
      doc.text(summaryLines, 20, 120);

      // Lower segment: Issues List
      const summaryHeightOffset = 120 + (summaryLines.length * 5) + 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, summaryHeightOffset, pageWidth - 20, summaryHeightOffset);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 1: DETECTED HAZARDS & SPATIAL INEFFICIDENCES", 20, summaryHeightOffset + 9);

      let verticalOffset = summaryHeightOffset + 18;

      if (report.issues.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9.5);
        doc.setTextColor(22, 163, 74); // success Green
        doc.text("✓ Complete compliance checked. No immediate physical space or stacking hazards identified.", 20, verticalOffset);
        verticalOffset += 10;
      } else {
        report.issues.forEach((issue, index) => {
          if (verticalOffset > 240) {
            doc.addPage();
            // Draw border on next page
            doc.setDrawColor(30, 41, 59);
            doc.setLineWidth(1);
            doc.rect(10, 10, pageWidth - 20, 277);
            verticalOffset = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`Anomaly ${index + 1}: [${issue.category.toUpperCase()}] - Severity: ${issue.severity.toUpperCase()}`, 20, verticalOffset);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(`Location: ${issue.location || "Audited Area"}`, 25, verticalOffset + 5);
          
          doc.setTextColor(51, 65, 85);
          const descLines = doc.splitTextToSize(issue.description, pageWidth - 45);
          doc.text(descLines, 25, verticalOffset + 9.5);

          verticalOffset += 12 + (descLines.length * 4.5);
        });
      }

      // Recommendations list section
      if (verticalOffset > 240) {
        doc.addPage();
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(1);
        doc.rect(10, 10, pageWidth - 20, 277);
        verticalOffset = 25;
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(20, verticalOffset, pageWidth - 20, verticalOffset);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 2: CORRECTIVE OPERATIONS INSTRUCTIONS MANUAL", 20, verticalOffset + 9);

      verticalOffset += 17;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      report.recommendations.forEach((rec, idx) => {
        const recLines = doc.splitTextToSize(`${idx + 1}. ${rec}`, pageWidth - 40);
        doc.text(recLines, 20, verticalOffset);
        verticalOffset += (recLines.length * 4.8) + 2;
      });

      // Digital Signature section at page bottom
      doc.setFont("courier", "bolditalic");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text("TRANSITMIND AI SAFE-STOW SECURE SIGNATURE SEAL", 21, 273);
      doc.text("COMPLIANCE VERIFIED & LOGGED PERSISTENTLY", pageWidth - 105, 273);

      doc.save(`TransitMind-SafetyAudit-${report.id}.pdf`);
      showToast(`EXPORT SUCCESS: Downloaded PDF Certificate for ${report.id}`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Error generating PDF with local jsPDF compilation layer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/10 selection:text-white relative font-sans">
      
      {/* Header Panel */}
      <Header 
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setSelectedReport(null); // close selection if navigating
        }}
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isRecommendationsOpen={isRecommendationsOpen}
        onToggleRecommendations={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
        isNotificationSettingsOpen={isNotificationSettingsOpen}
        onToggleNotificationSettings={() => setIsNotificationSettingsOpen(true)}
        isRouteFinderOpen={isRouteFinderOpen}
        onToggleRouteFinder={() => setIsRouteFinderOpen(true)}
        mockMode={mockMode}
        onToggleMockMode={handleToggleMockMode}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className={`pb-16 transition-all duration-300 ${isChatOpen ? 'mr-0 lg:mr-[340px]' : ''}`}>
        
        {/* Global Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 rounded-none bg-black border border-white/20 py-3 px-5 font-mono text-[9px] uppercase tracking-wider text-white shadow-2xl flex items-center gap-2.5"
            >
              <span className="h-1.5 w-1.5 bg-white shrink-0"></span>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Router with motion effects */}
        <AnimatePresence mode="wait">
          
          {/* View Tab 1: Landing Page */}
          {currentView === "landing" && (
            <motion.div 
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage 
                onGetStarted={() => setCurrentView("dashboard")}
                onExploreAnalyzer={() => setCurrentView("analyzer")}
              />
            </motion.div>
          )}

          {/* View Tab 2: Dashboard Command Center */}
          {currentView === "dashboard" && (
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CommandDashboard 
                reports={reports}
                onSelectReport={(rep) => setSelectedReport(rep)}
                onNavigateToAnalyzer={() => setCurrentView("analyzer")}
                onDownloadPDF={generatePDFExport}
              />
            </motion.div>
          )}

          {/* View Tab 3: Interactive Visual Analyzer */}
          {currentView === "analyzer" && (
            <motion.div 
              key="analyzer-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RiskAnalyzer 
                mockMode={mockMode}
                onAnalysisSuccess={handleAnalysisSuccess}
                onDownloadPDF={generatePDFExport}
              />
            </motion.div>
          )}

          {/* View Tab 4: Reports Vault */}
          {currentView === "reports" && (
            <motion.div 
              key="reports-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReportArchive 
                reports={reports}
                onSelectReport={(rep) => {
                  setSelectedReport(rep);
                }}
                onDownloadPDF={generatePDFExport}
                onDeleteReports={(ids) => {
                  setReports((prev) => prev.filter((r) => !ids.includes(r.id)));
                  showToast(`Successfully deleted ${ids.length} report(s).`);
                }}
              />
            </motion.div>
          )}

          {/* View Tab 5: Bento Projects Showcase */}
          {currentView === "projects" && (
            <motion.div 
              key="projects-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectShowcase />
            </motion.div>
          )}

          {/* View Tab 6: Driver Biometrics Stress Scanner */}
          {currentView === "stress" && (
            <motion.div 
              key="stress-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DriverStressScanner />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Immersive Glass-overlay Report inspection modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            id="report-inspect-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl rounded-none bg-[#0a0a0a] border border-white/10 shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
              id="report-inspect-modal-body"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-5 right-5 p-2 bg-[#050505] border border-white/10 hover:border-white rounded-none transition-colors text-white"
                id="close-modal-btn"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title Header */}
              <div className="border-b border-white/10 pb-4 mb-5 text-left font-mono">
                <span className="text-[9px] text-white/40 block uppercase tracking-widest">REPORT CERTIFICATE DETAIL</span>
                <h2 className="text-lg font-bold text-white mt-2 uppercase tracking-tight">{selectedReport.title}</h2>
                <div className="flex items-center gap-3 text-[10px] text-white/40 mt-2">
                  <span>AUDIT CODES: {selectedReport.id}</span>
                  <span>•</span>
                  <span>DATE: {selectedReport.uploadDate}</span>
                  <span>•</span>
                  <span className="text-white font-bold">{selectedReport.type}</span>
                </div>
              </div>

              {/* Layout Content row split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Left Side: Picture preview and executive wrap-up */}
                <div className="space-y-4">
                  <div className="aspect-video rounded-none bg-[#050505] border border-white/5 overflow-hidden relative">
                    {selectedReport.imageUrl ? (
                      <img 
                        src={selectedReport.imageUrl} 
                        alt={selectedReport.title} 
                        className="object-contain w-full h-full grayscale opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <FileText className="h-10 w-10" />
                        <span className="text-[10px] font-mono mt-1 uppercase">Snapshot archive only</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[#050505] rounded-none border border-white/5 text-xs font-mono text-white/70 leading-relaxed">
                    <span className="text-[9px] text-white/40 block uppercase tracking-widest">Visual analysis transcript</span>
                    <p className="mt-2 font-sans">
                      {selectedReport.executiveSummary}
                    </p>
                  </div>

                  {/* Combined Score Cards in modal */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="border border-white/10 rounded-none p-4 bg-[#050505] text-center">
                      <span className="text-[8px] text-white/40 uppercase tracking-wider block">Safety Rating</span>
                      <span className="text-white font-bold text-lg block mt-1">{selectedReport.safetyScore}%</span>
                    </div>
                    <div className="border border-white/10 rounded-none p-4 bg-[#050505] text-center">
                      <span className="text-[8px] text-white/40 uppercase tracking-wider block">Yard Efficiency</span>
                      <span className="text-white font-bold text-lg block mt-1">{selectedReport.warehouseScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Captured anomalies & optimizations */}
                <div className="space-y-4 flex flex-col justify-between font-mono">
                  
                  {/* Issues block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white border-b border-white/5 pb-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-white/40" />
                      <span>SECTION 1: Detected Physical Hazards ({selectedReport.issues.length})</span>
                    </div>

                    {selectedReport.issues.length === 0 ? (
                      <div className="p-3 text-[10px] text-emerald-400 bg-[#050505] border border-emerald-500/20 rounded-none flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> 
                        <span>No physical blockages or stacking faults detected. Compliance approved.</span>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {selectedReport.issues.map((i) => (
                          <div key={i.id} className="p-3 rounded-none bg-[#050505] border border-white/5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold text-white uppercase">{i.category}</span>
                              <span className={`text-[8px] px-1.5 py-0.2 rounded-none border ${
                                i.severity === "high" 
                                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                  : i.severity === "medium"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-white/10 text-white/80 border-white/15"
                              }`}>
                                {i.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="font-sans text-[11px] text-white/60 mt-1.5 leading-relaxed">{i.description}</p>
                            {i.location && (
                              <span className="text-[9px] text-white/40 block mt-1.5">Location: {i.location}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommendations block */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white border-b border-white/5 pb-2">
                      <Activity className="h-4.5 w-4.5 text-white/40" />
                      <span>SECTION 2: Operational Directives</span>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {selectedReport.recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="text-[10px] text-white/80 leading-relaxed bg-[#050505] p-3 rounded-none border border-white/5 flex items-start gap-2">
                          <span className="text-white font-bold">#{rIdx + 1}</span>
                          <p className="flex-1 font-sans">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Trigger export action footer */}
              <div className="border-t border-white/10 pt-5 mt-6 flex items-center justify-between font-mono">
                <button
                  onClick={() => setIsCompareSidebarOpen(true)}
                  className="rounded-none bg-[#050505] border border-white/10 py-3 px-5 text-xs font-bold text-white hover:border-white transition-all flex items-center gap-1.5 uppercase"
                >
                  <ArrowRightLeft className="h-4 w-4" /> Compare Baseline
                </button>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      setIsCompareSidebarOpen(false);
                    }}
                    className="rounded-none bg-[#050505] border border-white/10 py-3 px-5 text-xs font-bold text-white hover:border-white transition-all uppercase"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => generatePDFExport(selectedReport)}
                    className="rounded-none bg-white text-black border border-white py-3 px-5 text-xs font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 uppercase"
                    id="inspect-modal-pdf-download-btn"
                  >
                    <Download className="h-4 w-4" /> Export PDF Certificate
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatSidebar 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
            selectedReport={selectedReport}
          />
        )}
      </AnimatePresence>

      {/* Compare Sidebar */}
      <AnimatePresence>
        {isCompareSidebarOpen && (
          <CompareSidebar
            isOpen={isCompareSidebarOpen}
            onClose={() => setIsCompareSidebarOpen(false)}
            targetReport={selectedReport}
          />
        )}
      </AnimatePresence>

      {/* Smart Recommendations Drawer */}
      <AnimatePresence>
        {isRecommendationsOpen && (
          <SmartRecommendationsDrawer
            isOpen={isRecommendationsOpen}
            onClose={() => setIsRecommendationsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {isNotificationSettingsOpen && (
          <NotificationSettingsModal
            isOpen={isNotificationSettingsOpen}
            onClose={() => setIsNotificationSettingsOpen(false)}
            onShowToast={setToastMessage}
          />
        )}
      </AnimatePresence>

      {/* Route Finder Modal */}
      <AnimatePresence>
        {isRouteFinderOpen && (
          <RouteFinderModal
            isOpen={isRouteFinderOpen}
            onClose={() => setIsRouteFinderOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
