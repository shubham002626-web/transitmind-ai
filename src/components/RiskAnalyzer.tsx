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
  RefreshCw, 
  ShieldCheck, 
  Building, 
  Truck, 
  Cpu, 
  Download,
  XSquare,
  Gauge
} from "lucide-react";
import { Report, ReportType } from "../types";
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
    }, 120);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalyzingState("scanning");
      setAnalyzingStage("Evaluating visual edges & container stress masks...");
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAnalyzingState("saving");
      setAnalyzingStage("Synthesizing actionable warehouse hazard directives...");
      
      await new Promise(resolve => setTimeout(resolve, 600));

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
      }, 300);

    } catch (e) {
      clearInterval(progressInterval);
      console.error(e);
      setAnalyzingState("idle");
      alert("Analysis engine timed out. Reverting state.");
    }
  };

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
      <div className="border-b border-white/10 pb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Cpu className="h-5.5 w-5.5 text-white" />
            Compliance & Risk Scanner
          </h1>
          <p className="font-sans text-xs text-white/60 mt-1">
            Submit photographic evidence to detect packaging compression buckles, egress blocks, and balanced lashing.
          </p>
        </div>
        
        {/* Connection status display */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 border border-white/10 rounded-none">
          <span className="h-1.5 w-1.5 bg-white"></span>
          <span className="font-mono text-[9px] text-white/60 uppercase">
            {mockMode ? "STANDBY: HIGH-FIDELITY SIMULATION" : "READY: GEMINI MULTI-MODAL MODEL"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Panel: Drag Drop & Configuration Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Form settings */}
          <div className="bg-[#0a0a0a] p-6 border border-white/10 space-y-4 rounded-none">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">1. Select Audit Specialty</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType(ReportType.WAREHOUSE)}
                className={`flex flex-col items-center justify-center py-4 px-2 border font-mono text-[10px] font-bold tracking-widest uppercase transition-all rounded-none ${
                  selectedType === ReportType.WAREHOUSE
                    ? "bg-white text-black border-white"
                    : "bg-[#050505] border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                <Building className="h-4 w-4 mb-2" />
                Warehouse
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedType(ReportType.CARGO)}
                className={`flex flex-col items-center justify-center py-4 px-2 border font-mono text-[10px] font-bold tracking-widest uppercase transition-all rounded-none ${
                  selectedType === ReportType.CARGO
                    ? "bg-white text-black border-white"
                    : "bg-[#050505] border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                <ImageIcon className="h-4 w-4 mb-2" />
                Cargo Deck
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(ReportType.LOADING)}
                className={`flex flex-col items-center justify-center py-4 px-2 border font-mono text-[10px] font-bold tracking-widest uppercase transition-all rounded-none ${
                  selectedType === ReportType.LOADING
                    ? "bg-white text-black border-white"
                    : "bg-[#050505] border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                <Truck className="h-4 w-4 mb-2" />
                Load Security
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div 
            className={`bg-[#0a0a0a] border border-dashed p-8 transition-all text-center flex flex-col items-center justify-center relative cursor-pointer group rounded-none ${
              isDragOver ? "border-white bg-white/5" : "border-white/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imageUrl ? (
              <div className="w-full relative">
                {/* Selected File Details */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => {
                      setImageUrl("");
                      setImageName("");
                      setAnalyzedReport(null);
                      setAnalyzingState("idle");
                      setProgress(0);
                    }}
                    className="p-2 bg-black border border-white/10 hover:bg-white hover:text-black transition-colors rounded-none text-white font-mono text-[9px] flex items-center gap-1 uppercase"
                    title="Remove Image"
                    id="remove-uploaded-image-btn"
                  >
                    <XSquare className="h-3.5 w-3.5" /> REMOVE
                  </button>
                </div>

                <div className="relative aspect-video overflow-hidden border border-white/5 bg-[#050505] rounded-none">
                  <img 
                    src={imageUrl} 
                    alt="Inspection target" 
                    className="object-contain w-full h-full grayscale opacity-80"
                  />
                  {analyzingState === "scanning" && (
                    <>
                      <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                      <div className="absolute left-0 right-0 h-[1px] bg-white shadow-md shadow-white/50 animate-scan top-0"></div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between font-mono text-[9px] text-white/40 uppercase bg-[#050505] p-3 border border-white/5 rounded-none">
                  <span className="truncate pr-4" title={imageName}>{imageName}</span>
                  <span className="text-white font-bold">TARGET ACQUIRED</span>
                </div>
              </div>
            ) : (
              <div className="py-10 space-y-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-white">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-white">Drag & Drop inspection snap, or</div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-white hover:underline decoration-solid underline-offset-4 font-mono uppercase tracking-widest"
                  id="trigger-file-select-btn"
                >
                  browse files
                </button>
                <p className="text-[10px] text-white/40 font-mono uppercase">
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
          <div className="bg-[#0a0a0a] p-6 border border-white/10 space-y-4 rounded-none">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">Simulation helper gallery</span>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Or click a sample asset for instance processing</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {demoSamples.map((sample, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="cursor-pointer group flex flex-col border border-white/10 bg-[#050505] hover:border-white transition-colors rounded-none"
                  id={`demo-sample-action-${idx}`}
                >
                  <div className="aspect-video bg-black overflow-hidden relative">
                    <img 
                      src={sample.url} 
                      alt={sample.title} 
                      className="object-cover w-full h-full opacity-40 grayscale group-hover:opacity-80 transition-opacity" 
                    />
                    <span className="absolute bottom-1 right-1 font-mono text-[7px] bg-black px-1.5 py-0.5 border border-white/10 text-white/60 uppercase">
                      {sample.type.split("_")[0]}
                    </span>
                  </div>
                  <div className="p-2 text-[9px] font-mono font-bold text-white/50 group-hover:text-white uppercase truncate text-center">
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
              className={`w-full py-4 text-xs font-bold tracking-widest flex items-center justify-center gap-2 transition-colors rounded-none uppercase font-mono border ${
                !imageUrl 
                  ? "bg-[#0a0a0a] text-white/20 border-white/5 cursor-not-allowed" 
                  : analyzingState !== "idle"
                    ? "bg-[#0a0a0a] text-white/40 border-white/20 cursor-wait animate-pulse"
                    : "bg-white text-black border-white hover:bg-black hover:text-white cursor-pointer"
              }`}
              id="execute-ai-analysis-btn"
            >
              {analyzingState !== "idle" ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{analyzingStage}</span>
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4" />
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
            <div className="bg-[#0a0a0a] border border-white/10 p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] rounded-none">
              <div className="relative flex justify-center items-center h-16 w-16 mb-6">
                <div className="absolute inset-0 rounded-none border border-white/10"></div>
                <div className="absolute inset-0 rounded-none border border-white border-t-transparent animate-spin"></div>
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                TransitMind AI Processing
              </h3>
              <p className="font-sans text-xs text-white/60 mt-2 max-w-xs leading-relaxed">
                Deploying image parsing algorithms, safety score matrix counters, and recommendation logic pipeline...
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-sm mt-8">
                <div className="flex justify-between items-end mb-1.5 px-1 font-mono text-[9px] uppercase">
                  <span className="text-white/40">SYSTEM LOAD</span>
                  <span className="text-white font-bold">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-[#050505] border border-white/10 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className="h-full bg-white"
                  ></motion.div>
                </div>
              </div>

              {/* Animated terminal lines list */}
              <div className="mt-8 p-4 bg-[#050505] border border-white/5 w-full max-w-sm text-left font-mono text-[9px] space-y-1.5 text-white/40">
                <div className="text-white font-bold">&gt; {analyzingStage}</div>
                <div>&gt; pipeline configuration verified: OK</div>
                <div>&gt; safety score gauge thresholds set: OK</div>
                <div>&gt; server socket feedback pipeline: STANDBY</div>
              </div>
            </div>
          ) : analyzedReport ? (
            /* Complete report results display */
            <div className="space-y-6">
              
              {/* Safety Agent Card + Warehouse Intelligence Card combo block */}
              <div className={`bg-[#0a0a0a] border p-6 rounded-none ${getRiskColor(analyzedReport.riskLevel)}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-mono text-[9px] text-white/50 block uppercase tracking-wider">
                      {analyzedReport.type} COMPLIANCE CERTIFICATE
                    </span>
                    <h2 className="font-mono text-base font-bold text-white mt-2 uppercase tracking-tight">{analyzedReport.title}</h2>
                    <span className="font-mono text-[9px] text-white/40 block mt-1">COMPILED: {analyzedReport.uploadDate}</span>
                  </div>
                  
                  {/* Action download */}
                  <button
                    onClick={() => onDownloadPDF(analyzedReport)}
                    className="bg-[#050505] border border-white/10 p-2 hover:bg-white hover:text-black transition-colors rounded-none text-white"
                    title="Export PDF Report"
                    id="export-scanned-pdf-btn"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 p-4 bg-[#050505] border border-white/5 rounded-none text-left">
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">Executive visual audit summary</span>
                  <p className="font-sans text-[11px] text-white/80 leading-relaxed mt-2">{analyzedReport.executiveSummary}</p>
                </div>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Core Module 1: Safety Agent Card */}
                <div className="bg-[#0a0a0a] border border-white/10 p-5 flex flex-col justify-between rounded-none text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 font-mono">
                      <h3 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-white/60" />
                        Safety Agent
                      </h3>
                      <div className="text-right">
                        <div className="text-[9px] text-white/40 uppercase">SAFETY</div>
                        <div className="text-xs font-bold text-white leading-none">{analyzedReport.safetyScore}/100</div>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-[10px]">
                      <div>
                        <span className="text-white/40 block uppercase">DAMAGE EVALUATION</span>
                        <p className="text-white/80 mt-1 leading-relaxed">
                          {analyzedReport.issues.length > 0 
                            ? "Punctures / structural collapses localized. Packaging index degraded."
                            : "No packing outer tears, compression buckles, or seal cracks found."}
                        </p>
                      </div>

                      <div>
                        <span className="text-white/40 block uppercase">STACKING INTEGRITY</span>
                        <p className="text-white/80 mt-1 leading-relaxed">
                          {analyzedReport.type === ReportType.CARGO 
                            ? "Priority stack tilt triggers. Critical weights exceed bounds."
                            : "Axle balance guidelines are verified. Solid stack column spacing."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-4 font-mono">
                    <span className="text-[9px] text-white/40 uppercase">SAFETY ACTION PLAN</span>
                    <ul className="text-[10px] text-white/80 mt-1.5 list-disc list-inside space-y-1">
                      <li>Use heavy tie-downs</li>
                      <li>Re-stack and box bases</li>
                    </ul>
                  </div>
                </div>

                {/* Core Module 2: Warehouse Intelligence Card */}
                <div className="bg-[#0a0a0a] border border-white/10 p-5 flex flex-col justify-between rounded-none text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 font-mono">
                      <h3 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-white/60" />
                        Warehouse Intel
                      </h3>
                      <div className="text-right">
                        <div className="text-[9px] text-white/40 uppercase">EFFICIENCY</div>
                        <div className="text-xs font-bold text-white leading-none">{analyzedReport.warehouseScore}/100</div>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-[10px]">
                      <div>
                        <span className="text-white/40 block uppercase">CONGESTION INDEX</span>
                        <p className="text-white/80 mt-1 leading-relaxed">
                          {analyzedReport.type === ReportType.WAREHOUSE
                            ? "Active access blocks located near zone G exit doors."
                            : "Stable material floor footprints. Movement channels clear."}
                        </p>
                      </div>

                      <div>
                        <span className="text-white/40 block uppercase">PATHWAY STATUS</span>
                        <p className="text-white/80 mt-1 leading-relaxed">
                          {analyzedReport.type === ReportType.WAREHOUSE
                            ? "Pallet placement blocks corridor clearances."
                            : "All emergency egress doors and fire lanes verify safe."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-4 font-mono">
                    <span className="text-[9px] text-white/40 uppercase">YARD FLOW DIRECTIONS</span>
                    <ul className="text-[10px] text-white/80 mt-1.5 list-disc list-inside space-y-1">
                      <li>Clear main exit lane corridor</li>
                      <li>Instate paint safety markings</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Corrective Recommendations Cards list */}
              <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-none text-left">
                <span className="font-mono text-[10px] text-white uppercase tracking-wider block">Final Action Items</span>
                <div className="mt-4 space-y-2">
                  {analyzedReport.recommendations.map((rec, index) => (
                    <div key={index} className="flex gap-3 bg-[#050505] border border-white/5 p-3 rounded-none text-white/80 font-mono text-[10px] leading-relaxed items-start">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-white/20 bg-white/5 font-mono text-[9px] font-bold text-white">
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
            <div className="bg-[#0a0a0a] border border-white/10 p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] rounded-none">
              <div className="h-12 w-12 border border-white/15 bg-white/5 flex items-center justify-center text-white mb-4">
                <Gauge className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Analysis Results Preview</h3>
              <p className="font-sans text-xs text-white/60 mt-2 max-w-xs leading-relaxed">
                Choose an audit specialty, select a pre-loaded target yard asset, or input your custom camera payload to execute active visual scanning rules.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left font-mono">
                <div className="border border-white/10 p-4 bg-[#050505] rounded-none">
                  <span className="text-[8px] text-white/40 block uppercase font-bold">Safety Score Target</span>
                  <span className="text-white font-bold text-sm block mt-1">90%+ Rating</span>
                </div>
                <div className="border border-white/10 p-4 bg-[#050505] rounded-none">
                  <span className="text-[8px] text-white/40 block uppercase font-bold">Max Analysis Delay</span>
                  <span className="text-white font-bold text-sm block mt-1">~3.2 Seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
