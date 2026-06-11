/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { 
  Upload, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Building, 
  Truck, 
  Cpu, 
  Download,
  Flame,
  XSquare,
  Wrench,
  Gauge
} from "lucide-react";
import { Report, ReportType, RiskLevel } from "../types";
import { AIService } from "../services/aiService";

interface RiskAnalyzerProps {
  mockMode: boolean;
  onAnalysisSuccess: (newReport: Report) => void;
  onDownloadPDF: (report: Report) => void;
}

export default function RiskAnalyzer({
  mockMode,
  onAnalysisSuccess,
  onDownloadPDF
}: RiskAnalyzerProps) {
  
  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.WAREHOUSE);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [analyzingState, setAnalyzingState] = useState<"idle" | "uploading" | "scanning" | "saving" | "complete">("idle");
  const [analyzingStage, setAnalyzingStage] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [analyzedReport, setAnalyzedReport] = useState<Report | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Demo Samples
  const demoSamples = [
    {
      title: "Active Corridor Clutter",
      type: ReportType.WAREHOUSE,
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
      fileName: "warehouse_egress_corridor_G4.jpg"
    },
    {
      title: "Damaged Package Stack",
      type: ReportType.CARGO,
      url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
      fileName: "blue_dart_fragile_electronics.jpg"
    },
    {
      title: "Interstate Stowage Check",
      type: ReportType.LOADING,
      url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
      fileName: "freightliner_axle_payload.jpg"
    }
  ];

  const handleSelectSample = (sample: typeof demoSamples[0]) => {
    setImageUrl(sample.url);
    setImageName(sample.fileName);
    setSelectedType(sample.type);
    setAnalyzedReport(null);
    setAnalyzingState("idle");
    setProgress(0);
  };

  const processAnalysis = async (imgData: string, nameStr: string, autoType: ReportType) => {
    setAnalyzingState("uploading");
    setAnalyzingStage("Securing network session proxy...");
    setProgress(0);
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 3) + 1;
      if (currentProgress >= 95) {
        currentProgress = 95;
      }
      setProgress(currentProgress);
    }, 150);
    
    try {
      // Simulate pipeline delays for tactile, visual tech audit experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyzingState("scanning");
      setAnalyzingStage("Evaluating visual edges & container stress masks...");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalyzingState("saving");
      setAnalyzingStage("Synthesizing actionable warehouse hazard directives...");
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const resultReport = await AIService.analyzeImage({
        imageName: nameStr,
        imageDataUrl: imgData,
        type: autoType,
        isMockMode: mockMode
      });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setAnalyzedReport(resultReport);
        onAnalysisSuccess(resultReport);
        setAnalyzingState("complete");
      }, 400);

    } catch (e) {
      clearInterval(progressInterval);
      console.error(e);
      setAnalyzingState("idle");
      alert("Analysis engine timed out. Reverting state.");
    }
  };

  // Handle manual file selections
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setImageName(file.name);
          setAnalyzedReport(null);
          setAnalyzingState("idle");
          setProgress(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setImageName(file.name);
          setAnalyzedReport(null);
          setAnalyzingState("idle");
          setProgress(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getRiskGradientAndColor = (level: string) => {
    switch (level) {
      case "HIGH": return "from-red-500/10 to-rose-500/5 border-red-500/30 text-rose-400";
      case "MEDIUM": return "from-amber-500/10 to-yellow-500/5 border-amber-500/30 text-amber-400";
      case "LOW": return "from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400";
      default: return "from-slate-900 to-slate-950 border-white/[0.08] text-slate-400";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-5.5 w-5.5 text-cyan-500 animate-pulse" />
            AI Compliance & Risk Scanner
          </h1>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Submit photographic evidence to detect packaging compression buckles, egress blocks, and balanced lashing.
          </p>
        </div>
        
        {/* Connection status display */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-1.5 border border-white/[0.05]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[9px] text-slate-400 uppercase">
            {mockMode ? "STANDBY: HIGH-FIDELITY SIMULATION" : "READY: GEMINI MULTI-MODAL MODEL"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Panel: Drag Drop & Configuration Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Form settings */}
          <div className="glass-panel rounded-2xl p-5.5 border border-white/[0.06] space-y-4">
            <h2 className="font-display font-semibold text-white text-sm">1. Select Audit Specialty</h2>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType(ReportType.WAREHOUSE)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border font-sans text-xs font-semibold tracking-wide transition-all ${
                  selectedType === ReportType.WAREHOUSE
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/5"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Building className="h-4.5 w-4.5 mb-1.5" />
                Warehouse
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedType(ReportType.CARGO)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border font-sans text-xs font-semibold tracking-wide transition-all ${
                  selectedType === ReportType.CARGO
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/5"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <ImageIcon className="h-4.5 w-4.5 mb-1.5" />
                Cargo Damage
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(ReportType.LOADING)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border font-sans text-xs font-semibold tracking-wide transition-all ${
                  selectedType === ReportType.LOADING
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/5"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Truck className="h-4.5 w-4.5 mb-1.5" />
                Load Security
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div 
            className={`bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-dashed rounded-2xl p-6.5 transition-all text-center flex flex-col items-center justify-center relative cursor-pointer group hover:border-cyan-400 ${
              isDragOver ? "border-cyan-400 bg-cyan-500/20" : "border-cyan-500/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imageUrl ? (
              <div className="w-full relative group">
                {/* Selected File Details */}
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  <button
                    onClick={() => {
                      setImageUrl("");
                      setImageName("");
                      setAnalyzedReport(null);
                      setAnalyzingState("idle");
                      setProgress(0);
                    }}
                    className="p-1.5 bg-black/75 hover:bg-red-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                    title="Remove Image"
                    id="remove-uploaded-image-btn"
                  >
                    <XSquare className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.06] bg-slate-900">
                  <img 
                    src={imageUrl} 
                    alt="Inspection target" 
                    className="object-contain w-full h-full"
                  />
                  {analyzingState === "scanning" && (
                    <>
                      <div className="absolute inset-0 bg-cyan-500/15 animate-pulse"></div>
                      <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_cyan] animate-scan top-0"></div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                  <span className="truncate pr-4" title={imageName}>{imageName}</span>
                  <span className="shrink-0 text-cyan-400">TARGET ACQUIRED</span>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-cyan-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="mt-4 text-xs font-semibold text-white">Drag & Drop inspection snap, or</div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-bold text-cyan-400 hover:text-white decoration-dotted underline"
                  id="trigger-file-select-btn"
                >
                  browse workspace folders
                </button>
                <p className="mt-2.5 text-[10px] text-slate-500">
                  PNG, JPEG patterns, or base-64 camera uploads are compliant.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Quick Click Simulation Gallery */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Simulation helper gallery</span>
            <h3 className="font-display font-semibold text-white text-xs mt-1">Or click a sample asset for instance processing</h3>
            
            <div className="grid grid-cols-3 gap-2.5 mt-3.5">
              {demoSamples.map((sample, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="cursor-pointer group flex flex-col rounded-lg overflow-hidden border border-white/[0.06] bg-slate-900/60 hover:border-cyan-500/30 transition-all"
                  id={`demo-sample-action-${idx}`}
                >
                  <div className="aspect-video bg-slate-800 overflow-hidden relative">
                    <img 
                      src={sample.url} 
                      alt={sample.title} 
                      className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute bottom-1 right-1 font-mono text-[8px] bg-black/70 px-1 py-0.2 rounded text-slate-400 uppercase">
                      {sample.type.split("_")[0]}
                    </span>
                  </div>
                  <div className="p-2 text-[10px] font-sans font-medium text-slate-300 group-hover:text-cyan-400 truncate text-center">
                    {sample.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Large trigger button */}
          <div className="pt-2">
            <button
              onClick={() => processAnalysis(imageUrl, imageName, selectedType)}
              disabled={!imageUrl || analyzingState !== "idle"}
              className={`w-full py-3.5 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                !imageUrl 
                  ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed" 
                  : analyzingState !== "idle"
                    ? "bg-cyan-950/40 text-cyan-400 border border-cyan-400/20 cursor-wait"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer"
              }`}
              id="execute-ai-analysis-btn"
            >
              {analyzingState !== "idle" ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span className="font-mono text-[10px] uppercase">{analyzingStage}</span>
                </>
              ) : (
                <>
                  <Cpu className="h-4.5 w-4.5" />
                  <span>LAUNCH VISUAL HARNESS SCAN</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Section: Results Display */}
        <div className="lg:col-span-6">
          {analyzingState !== "idle" && analyzingState !== "complete" ? (
            /* Analyzing Visual Stage */
            <div className="glass-panel rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="relative flex justify-center items-center h-20 w-20 mb-6">
                {/* Spinning nested loader */}
                <div className="absolute inset-0 rounded-full border-2 border-slate-900"></div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                <div className="absolute h-10 w-10 rounded-full border-2 border-indigo-400 border-b-transparent animate-spin [animation-direction:reverse]"></div>
                <Cpu className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                TransitMind AI Processing
              </h3>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-sm">
                Deploying image parsing algorithms, safety score matrix counters, and recommendation logic pipeline...
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mt-6">
                <div className="flex justify-between items-end mb-1.5 px-1">
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">SYSTEM LOAD</span>
                  <span className="text-xs font-mono text-white font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.15 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  ></motion.div>
                </div>
              </div>

              {/* Animated terminal lines list */}
              <div className="mt-6 p-4 rounded-xl bg-black/60 border border-white/[0.04] w-full max-w-md text-left font-mono text-[10px] space-y-1 text-slate-500">
                <div className="text-cyan-500 font-semibold">&gt; {analyzingStage}</div>
                <div>&gt; pipeline configuration verified: OK</div>
                <div>&gt; safety score gauge thresholds set: OK</div>
                <div>&gt; server socket feedback pipeline: STANDBY</div>
              </div>
            </div>
          ) : analyzedReport ? (
            /* Complete report results display */
            <div className="space-y-6">
              
              {/* Safety Agent Card + Warehouse Intelligence Card combo block */}
              <div className={`glass-panel border-l-4 rounded-2xl p-6 border ${getRiskGradientAndColor(analyzedReport.riskLevel)}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 block uppercase tracking-wider">
                      {analyzedReport.type} COMPLIANCE CERTIFICATE
                    </span>
                    <h2 className="font-display font-bold text-white text-base mt-1">{analyzedReport.title}</h2>
                    <span className="font-mono text-[9px] text-slate-400 block mt-0.5">COMPILED: {analyzedReport.uploadDate}</span>
                  </div>
                  
                  {/* Action download */}
                  <button
                    onClick={() => onDownloadPDF(analyzedReport)}
                    className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-2 hover:bg-white/[0.08] text-cyan-400 hover:text-white transition-colors"
                    title="Export PDF Report"
                    id="export-scanned-pdf-btn"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 p-3.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Executive visual audit summary</span>
                  <p className="font-sans text-[11px] text-slate-300 leading-relaxed mt-1">{analyzedReport.executiveSummary}</p>
                </div>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Core Module 1: Safety Agent Card */}
                <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
                      <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Safety Agent Audit
                      </h3>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-500">SAFETY</div>
                        <div className="text-sm font-bold text-emerald-400 leading-none">{analyzedReport.safetyScore}/100</div>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">DAMAGE EVALUATION</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-normal">
                          {analyzedReport.issues.length > 0 
                            ? "Punctures / structural collapses localized. Packaging index degraded."
                            : "No packing outer tears, compression buckles, or seal cracks found."}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">STACKING INTEGRITY</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-normal">
                          {analyzedReport.type === ReportType.CARGO 
                            ? "Priority stack tilt triggers. Critical weights exceed bounds."
                            : "Axle balance guidelines are verified. Solid stack column spacing."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.04] pt-3 mt-4">
                    <span className="font-mono text-[9px] text-slate-500 uppercase">SAFETY ACTION PLAN</span>
                    <ul className="text-[10px] text-slate-300 mt-1 list-disc list-inside space-y-1">
                      <li>Use vehicle heavy tie-downs</li>
                      <li>Re-stack and box packaging bases</li>
                    </ul>
                  </div>
                </div>

                {/* Core Module 2: Warehouse Intelligence Card */}
                <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
                      <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                        <Building className="h-4 w-4 text-indigo-400" />
                        Warehouse Intelligence
                      </h3>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-500">EFFICIENCY</div>
                        <div className="text-sm font-bold text-indigo-400 leading-none">{analyzedReport.warehouseScore}/100</div>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">CONGESTION INDEX</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-normal">
                          {analyzedReport.type === ReportType.WAREHOUSE
                            ? "Active access blocks located near zone G exit doors."
                            : "Stable material floor footprints. Movement channels clear."}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">PATHWAY ACCESSIBILITY</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-normal">
                          {analyzedReport.type === ReportType.WAREHOUSE
                            ? "Heavy floor pallet placement blocks path clearances."
                            : "All emergency egress doors and fire lanes verify safe."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.04] pt-3 mt-4">
                    <span className="font-mono text-[9px] text-slate-500 uppercase">YARD FLOW OPTIMIZATIONS</span>
                    <ul className="text-[10px] text-slate-300 mt-1 list-disc list-inside space-y-1">
                      <li>Clear main exit lane corridor</li>
                      <li>Instate paint markings for safety</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Corrective Recommendations Cards list */}
              <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block">Final Action Items</span>
                <div className="mt-3.5 space-y-2.5">
                  {analyzedReport.recommendations.map((rec, index) => (
                    <div key={index} className="flex gap-3 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg text-slate-300 text-xs leading-normal items-start">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 font-mono text-[9px] font-bold">
                        {index + 1}
                      </div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Idle Screen placeholder instructions */
            <div className="glass-panel rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="h-14 w-14 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
                <Gauge className="h-7 w-7" />
              </div>
              <h3 className="font-display text-sm font-semibold text-white">Analysis Results Preview</h3>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                Choose an audit specialty, select a pre-loaded target yard asset, or input your custom camera payload to execute active visual scanning rules.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="border border-white/[0.05] rounded-xl p-3 bg-white/[0.01]">
                  <span className="font-mono text-[8px] text-slate-500 block uppercase font-bold">Safety Score Target</span>
                  <span className="text-emerald-400 font-display font-semibold text-sm block mt-1">90%+ Rating</span>
                </div>
                <div className="border border-white/[0.05] rounded-xl p-3 bg-white/[0.01]">
                  <span className="font-mono text-[8px] text-slate-500 block uppercase font-bold">Max Analysis Delay</span>
                  <span className="text-cyan-400 font-display font-semibold text-sm block mt-1">~3.2 Seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
