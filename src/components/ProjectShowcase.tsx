/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Terminal as TerminalIcon, 
  Globe, 
  ShieldAlert, 
  CheckSquare, 
  ArrowRight, 
  Sliders, 
  Maximize2, 
  RefreshCw, 
  Play, 
  Cpu, 
  Eye, 
  Database, 
  Search, 
  Flame, 
  Zap, 
  Compass
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  status: "ACTIVE" | "MONITORING" | "ALERT";
  efficiency: number;
  safetyScore: number;
  hazardsDetected: number;
  lastScan: string;
  details: string;
  size: string; // Tailwind grid classes
}

const mockProjects: Project[] = [
  {
    id: "PRJ-HYPERION",
    name: "PROJECT HYPERION YARD",
    location: "DELHI NCR HUB",
    type: "Automated Container Scan",
    status: "ACTIVE",
    efficiency: 98.4,
    safetyScore: 97.2,
    hazardsDetected: 0,
    lastScan: "Just now",
    details: "Automated high-throughput cargo visual inspection using 8K dual-axis scanning rigs. Real-time box deformity verification and pallet stack stability audits running continuously.",
    size: "col-span-1 md:col-span-2 row-span-2"
  },
  {
    id: "PRJ-APEX",
    name: "PROJECT APEX DOCK",
    location: "MUMBAI PORT",
    type: "Flatbed Strapping Tension",
    status: "MONITORING",
    efficiency: 91.2,
    safetyScore: 89.5,
    hazardsDetected: 2,
    lastScan: "3m ago",
    details: "Visual strain-gauge analysis on primary flatbed strap mounts. Analyzes belt wear profiles and lashing angle compliance dynamically during container crane transfers.",
    size: "col-span-1 md:col-span-1 row-span-2"
  },
  {
    id: "PRJ-STRATUM",
    name: "PROJECT STRATUM RACK",
    location: "BENGALURU CORRIDOR",
    type: "3D Warehouse LiDAR",
    status: "ALERT",
    efficiency: 84.8,
    safetyScore: 72.1,
    hazardsDetected: 5,
    lastScan: "12s ago",
    details: "3D point-cloud comparison monitoring of structural steel shelving units. Detects rack deflection, floor level shifts, and vertical load stacking offset anomalies.",
    size: "col-span-1 md:col-span-2 row-span-1"
  },
  {
    id: "PRJ-AISLESAFE",
    name: "AISLESAFE EGRESS CORE",
    location: "CHENNAI BULK HUB",
    type: "Thermal Egress Tracking",
    status: "ACTIVE",
    efficiency: 99.1,
    safetyScore: 99.8,
    hazardsDetected: 0,
    lastScan: "1m ago",
    details: "Continuous visual path-tracing on loading bay floor zones to enforce emergency fire evacuation route boundaries and forklift-pedestrian clearance envelopes.",
    size: "col-span-1 md:col-span-1 row-span-1"
  },
  {
    id: "PRJ-TITAN",
    name: "TITAN AXLE BALANCER",
    location: "KOLKATA JUNCTION",
    type: "Chassis Weight Visualizer",
    status: "ACTIVE",
    efficiency: 95.3,
    safetyScore: 94.0,
    hazardsDetected: 1,
    lastScan: "5m ago",
    details: "AI tire-bulge and compression analyzer calculating axle payload distribution purely from multi-angle visual camera feeds. Triggers alerts for uneven center-of-gravity profiles.",
    size: "col-span-1 md:col-span-1 row-span-2"
  },
  {
    id: "PRJ-AEROSTRAP",
    name: "AEROSTRAP CARGO LAB",
    location: "HYDERABAD AIRBASE",
    type: "Aviation Pallet Integrity",
    status: "ACTIVE",
    efficiency: 99.6,
    safetyScore: 100.0,
    hazardsDetected: 0,
    lastScan: "Just now",
    details: "High-spec airfreight pallet lock evaluation. Measures netting elasticity and visual anchor clip alignment under high-frequency simulated turbulences.",
    size: "col-span-1 md:col-span-2 row-span-1"
  }
];

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS_INIT: Project Matrix Canvas Online",
    "GEO_LOC: Mapping global logistics nodes",
    "INTEG_CHECK: Framer Motion + GSAP modules loaded",
    "STATUS: Awaiting operator telemetry queries..."
  ]);
  const [activeGeoNode, setActiveGeoNode] = useState<string>("DEL");

  // Custom simulation terminal command executor
  const executeLog = (command: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      `[${time}] > EXEC: ${command}`,
      `[${time}] SYS_RESP: Tracking node query successful.`,
      ...prev.slice(0, 10)
    ]);
  };

  useEffect(() => {
    // 1. GSAP Scroll Progress Scrubbing
    if (scrollProgressRef.current) {
      gsap.to(scrollProgressRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }

    // 2. Scroll-based fade-in skew on projects title
    if (titleSectionRef.current) {
      gsap.fromTo(titleSectionRef.current,
        { opacity: 0.1, y: 50, skewY: 1 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: titleSectionRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 1,
          }
        }
      );
    }

    // 3. Bento cells reveal transition on scroll
    if (bentoGridRef.current) {
      const cards = bentoGridRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 80, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Add window styling for no border radius / no standard scrollbars globally for this view
    const originalScrollbarStyle = document.documentElement.style.scrollbarWidth;
    document.documentElement.classList.add("no-scrollbar");
    
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#FAFAFA] selection:text-[#050505] relative overflow-x-hidden pb-32"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* GSAP Scroll Progress Bar (Top sticky, scrubs width) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50 rounded-none overflow-hidden">
        <div 
          ref={scrollProgressRef} 
          className="h-full bg-white w-0 rounded-none transition-all duration-75"
        />
      </div>

      {/* Grid Pattern Background - Perfect sharp lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      {/* Floating Info Overlay (Minimalist tech data) */}
      <div className="fixed bottom-6 left-6 font-mono text-[9px] text-white/30 tracking-widest hidden md:block z-40">
        SYS_STATUS: ACTIVE | GRID_MODE: STRICT | BORDER_RADIUS: 0px
      </div>

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10">
        <div ref={titleSectionRef} className="space-y-4">
          <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase block">
            CORE DISPATCH TELEMETRY
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white uppercase select-none leading-none">
            Bento Projects <br />
            <span className="text-white/40">Visual Matrix</span>
          </h2>
        </div>
        <div className="mt-6 md:mt-0 font-mono text-right text-xs text-white/60 space-y-1">
          <p>ENGINE: TRANSITMIND CORE V3.9</p>
          <p>CANVAS: #050505 | TEXT: #FAFAFA</p>
          <p className="text-cyan-400">SCROLL DOWN TO SCRUB MATRIX</p>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div 
          ref={bentoGridRef} 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Hero Bento grid items */}
          {mockProjects.map((project) => {
            const isHovered = hoveredCard === project.id;
            const isAlert = project.status === "ALERT";
            const isMonitoring = project.status === "MONITORING";

            return (
              <div
                key={project.id}
                className={`${project.size} bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer overflow-hidden rounded-none`}
                onMouseEnter={() => {
                  setHoveredCard(project.id);
                  executeLog(`TELEMETRY HOVER: ${project.id}`);
                }}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  setSelectedProject(project);
                  executeLog(`TELEMETRY DRILLDOWN: ${project.id}`);
                }}
                style={{ borderRadius: "0px" }}
              >
                {/* Accent Top Border Draw on Hover (Micro-interaction) */}
                <div 
                  className={`absolute top-0 left-0 h-[2px] bg-white transition-all duration-500 ease-out ${
                    isHovered ? "w-full" : "w-0"
                  }`} 
                />

                {/* Left vertical border scan line */}
                <div 
                  className={`absolute left-0 bottom-0 w-[1px] bg-white/40 transition-all duration-700 ${
                    isHovered ? "h-full" : "h-0"
                  }`} 
                />

                {/* Subtle Grid overlay within card */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header detail of bento cell */}
                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-white/40">
                    <span>{project.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-none ${
                        isAlert ? "bg-red-500 animate-pulse" : isMonitoring ? "bg-amber-500 animate-pulse" : "bg-green-500"
                      }`} />
                      <span className={isAlert ? "text-red-400" : isMonitoring ? "text-amber-400" : "text-green-400"}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-white transition-colors uppercase leading-none">
                      {project.name}
                    </h3>
                    <p className="font-mono text-[10px] text-white/50 tracking-widest mt-1 uppercase">
                      {project.location} • {project.type}
                    </p>
                  </div>
                </div>

                {/* Project Telemetry Metrics */}
                <div className="my-8 relative z-10 flex gap-8 items-end text-left">
                  <div>
                    <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase block">
                      YARD SAFETY INDEX
                    </span>
                    <span className="text-3xl font-extrabold tracking-tighter text-white leading-none">
                      {project.safetyScore}%
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase block">
                      EFFICIENCY INDEX
                    </span>
                    <span className="text-3xl font-extrabold tracking-tighter text-white/70 leading-none">
                      {project.efficiency}%
                    </span>
                  </div>
                </div>

                {/* Footer action detail */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                  <div className="font-mono text-[9px] text-white/40">
                    LAST SNAPSHOT: <span className="text-white">{project.lastScan.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    <span>ANALYZE CAPTURE</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Interactive Bento Terminal Card (1x1) */}
          <div 
            className="bg-[#080808] border border-white/10 p-6 flex flex-col justify-between rounded-none text-left col-span-1 md:col-span-1 row-span-1 min-h-[200px] group relative cursor-default"
            style={{ borderRadius: "0px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500 transition-all duration-500 w-0 group-hover:w-full" />
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400">
              <TerminalIcon className="h-3.5 w-3.5" />
              <span>TERMINAL TELEMETRY LOGGER</span>
            </div>
            <div className="flex-1 my-3 bg-[#030303] border border-white/5 p-3 font-mono text-[9px] text-white/60 space-y-1.5 overflow-y-auto no-scrollbar max-h-[140px] leading-tight select-none">
              {terminalLogs.map((log, index) => (
                <div key={index} className="truncate">
                  {log}
                </div>
              ))}
            </div>
            <div className="flex gap-2 font-mono text-[9px] text-white/30 justify-between items-center">
              <span>ACTIVE SYS LOGS</span>
              <button 
                onClick={() => {
                  setTerminalLogs([`[${new Date().toLocaleTimeString()}] > LOG CLEAR`, "SYS_RESP: Active logs flushed."]);
                  executeLog("CLEAR LOGS");
                }}
                className="hover:text-white transition-colors bg-white/5 px-2 py-0.5 rounded-none border border-white/10 active:bg-white/10"
              >
                FLUSH
              </button>
            </div>
          </div>

          {/* Interactive Geographic Node Matrix Grid Card (1x2) */}
          <div 
            className="bg-[#080808] border border-white/10 p-6 flex flex-col justify-between rounded-none text-left col-span-1 md:col-span-2 row-span-1 min-h-[200px] group relative cursor-default"
            style={{ borderRadius: "0px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 transition-all duration-500 w-0 group-hover:w-full" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                <Globe className="h-3.5 w-3.5" />
                <span>GEOGRAPHIC ROUTING NODES</span>
              </div>
              <span className="font-mono text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5">
                GEO STABLE
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
              {[
                { code: "DEL", city: "DELHI", status: "STABLE", load: "High" },
                { code: "BOM", city: "MUMBAI", status: "MONITORING", load: "Critical" },
                { code: "BLR", city: "BENGALURU", status: "STABLE", load: "Medium" },
                { code: "MAA", city: "CHENNAI", status: "STABLE", load: "Low" }
              ].map(node => (
                <button
                  key={node.code}
                  onClick={() => {
                    setActiveGeoNode(node.code);
                    executeLog(`QUERY GEO NODE: ${node.code}`);
                  }}
                  className={`p-3 text-left transition-all duration-300 rounded-none border ${
                    activeGeoNode === node.code
                      ? "bg-white/10 border-white text-white"
                      : "bg-[#0b0b0b] border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <p className="font-mono text-xs font-bold">{node.code}</p>
                  <p className="text-[9px] uppercase tracking-wide">{node.city}</p>
                  <div className="flex items-center justify-between mt-2 font-mono text-[8px] text-white/40">
                    <span>{node.load.toUpperCase()} LOAD</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="font-mono text-[9px] text-white/40 flex justify-between border-t border-white/5 pt-3">
              <span>NODE ROUTE COMPLIANCE AUDITING ACTIVE</span>
              <span className="text-white">NODE_{activeGeoNode}_OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Drawer for inspected Project */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-center justify-end"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="w-full max-w-xl bg-[#0a0a0a] border-l border-white/10 h-full p-8 flex flex-col justify-between overflow-y-auto no-scrollbar text-left rounded-none"
              onClick={(e) => e.stopPropagation()}
              style={{ borderRadius: "0px" }}
            >
              <div className="space-y-8">
                {/* Header of Drawer */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <span className="font-mono text-xs text-white/40 tracking-wider">
                      PROJECT REPORT MATRIX
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                      {selectedProject.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 border border-white/10 hover:border-white text-white/60 hover:text-white transition-colors duration-200 rounded-none bg-white/5"
                  >
                    CLOSE
                  </button>
                </div>

                {/* Key Status Indicators */}
                <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-6">
                  <div className="p-3 bg-[#0e0e0e] border border-white/5">
                    <span className="font-mono text-[8px] text-white/40 uppercase block">NODE STATUS</span>
                    <span className="font-mono text-xs font-bold text-emerald-400 block mt-1 uppercase">
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className="p-3 bg-[#0e0e0e] border border-white/5">
                    <span className="font-mono text-[8px] text-white/40 uppercase block">ANOMALIES</span>
                    <span className="font-mono text-xs font-bold text-red-400 block mt-1">
                      {selectedProject.hazardsDetected} DETECTED
                    </span>
                  </div>
                  <div className="p-3 bg-[#0e0e0e] border border-white/5">
                    <span className="font-mono text-[8px] text-white/40 uppercase block">REFRESH SPEED</span>
                    <span className="font-mono text-xs font-bold text-cyan-400 block mt-1">
                      REALTIME / 12S
                    </span>
                  </div>
                </div>

                {/* Core description */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs text-white/40 tracking-widest uppercase">
                    EXECUTIVE SUMMARY DIRECTIVE
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed font-sans font-normal">
                    {selectedProject.details}
                  </p>
                </div>

                {/* Visual simulator HUD */}
                <div className="p-4 bg-black border border-white/5 space-y-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-red-500 animate-pulse" />
                      <span>HUD VIDEO TELEMETRY SOURCE #88-C</span>
                    </div>
                    <span>LIVE CALIBRATED</span>
                  </div>
                  <div className="aspect-video bg-[#0d0d0d] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 border border-cyan-500/20 m-6 flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start font-mono text-[8px] text-cyan-400">
                        <span>LENS RESOLUTION: 8K DUAL</span>
                        <span>LATENCY: 42MS</span>
                      </div>
                      <div className="w-full flex items-center justify-between font-mono text-[8px] text-red-500 bg-black/60 p-2">
                        <span>[!] ANALYSIS STREAM INTEGRITY CHECK</span>
                        <span>OK_1</span>
                      </div>
                    </div>
                    {/* Simulated scanning laser line */}
                    <div className="absolute left-0 right-0 h-[1px] bg-red-500/80 animate-scan top-0 shadow-lg shadow-red-500" />
                    <Eye className="h-8 w-8 text-white/20" />
                    <span className="font-mono text-[9px] text-white/30 mt-2 uppercase tracking-widest">
                      Visual Matrix Scan Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Action trigger bottom */}
              <div className="border-t border-white/10 pt-6 mt-8 flex gap-3">
                <button
                  onClick={() => {
                    executeLog(`FORCE OVERRIDE: ${selectedProject.id}`);
                    alert(`Initiated full telemetry override sequence for node ${selectedProject.id}`);
                  }}
                  className="flex-1 bg-white hover:bg-white/90 text-black font-mono text-xs font-bold py-3 text-center transition-all duration-300 hover:tracking-widest uppercase rounded-none border border-white"
                >
                  FORCE SYSTEM OVERRIDE
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 bg-[#0f0f0f] border border-white/10 hover:border-white text-white text-xs font-mono py-3 text-center transition-colors rounded-none"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
