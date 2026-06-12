/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  Maximize2,
  Minimize2,
  Radio,
  Zap,
  Shield,
  Cpu,
  Activity,
  Camera,
  RefreshCw,
  X,
} from "lucide-react";

// --- Type Definitions ---
interface BoundingBox {
  id: string;
  label: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "OK";
  x: number; // percent
  y: number; // percent
  w: number; // percent
  h: number; // percent
  confidence: number;
}

interface Alert {
  id: string;
  camId: string;
  camName: string;
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  time: string;
}

interface Feed {
  id: string;
  name: string;
  location: string;
  videoUrl: string;
  status: "LIVE" | "RECONNECTING" | "OFFLINE";
  fps: number;
  resolution: string;
}

// --- Static Feed Data (Pexels free videos) ---
const FEEDS: Feed[] = [
  {
    id: "CAM-01",
    name: "WAREHOUSE ZONE G",
    location: "DELHI NCR HUB — FLOOR 1",
    videoUrl:
      "https://videos.pexels.com/video-files/3773487/3773487-uhd_2560_1440_25fps.mp4",
    status: "LIVE",
    fps: 25,
    resolution: "2560×1440",
  },
  {
    id: "CAM-02",
    name: "LOADING DOCK ALPHA",
    location: "MUMBAI PORT — SECTOR D",
    videoUrl:
      "https://videos.pexels.com/video-files/5895864/5895864-uhd_2560_1440_30fps.mp4",
    status: "LIVE",
    fps: 30,
    resolution: "2560×1440",
  },
  {
    id: "CAM-03",
    name: "CARGO STACKING FLOOR",
    location: "BENGALURU CORRIDOR — BAY 7",
    videoUrl:
      "https://videos.pexels.com/video-files/8294563/8294563-uhd_3840_2160_24fps.mp4",
    status: "LIVE",
    fps: 24,
    resolution: "3840×2160",
  },
  {
    id: "CAM-04",
    name: "TRUCK BAYS — AXLE CHECK",
    location: "CHENNAI BULK HUB — GATE 3",
    videoUrl:
      "https://videos.pexels.com/video-files/4507996/4507996-uhd_2560_1440_30fps.mp4",
    status: "LIVE",
    fps: 30,
    resolution: "2560×1440",
  },
  {
    id: "CAM-05",
    name: "EGRESS CORRIDOR B",
    location: "KOLKATA JUNCTION — LEVEL 2",
    videoUrl:
      "https://videos.pexels.com/video-files/3252199/3252199-uhd_2560_1440_25fps.mp4",
    status: "LIVE",
    fps: 25,
    resolution: "2560×1440",
  },
  {
    id: "CAM-06",
    name: "AERIAL OVERVIEW YARD",
    location: "HYDERABAD AIRBASE — PAD A",
    videoUrl:
      "https://videos.pexels.com/video-files/5310849/5310849-uhd_3840_2160_25fps.mp4",
    status: "LIVE",
    fps: 25,
    resolution: "3840×2160",
  },
];

// --- Simulated threat detection events per camera ---
const DETECTION_POOL: Record<string, BoundingBox[]> = {
  "CAM-01": [
    { id: "b1", label: "FORKLIFT OVERSPEED", severity: "HIGH", x: 15, y: 30, w: 28, h: 35, confidence: 94 },
    { id: "b2", label: "PALLET STABLE", severity: "OK", x: 60, y: 50, w: 22, h: 28, confidence: 99 },
  ],
  "CAM-02": [
    { id: "b3", label: "UNSECURED CARGO", severity: "HIGH", x: 10, y: 20, w: 35, h: 40, confidence: 88 },
    { id: "b4", label: "WORKER DETECTED", severity: "MEDIUM", x: 65, y: 40, w: 15, h: 40, confidence: 97 },
  ],
  "CAM-03": [
    { id: "b5", label: "STACK TILT > 5°", severity: "HIGH", x: 20, y: 10, w: 25, h: 55, confidence: 91 },
    { id: "b6", label: "RACK LOAD: NORMAL", severity: "OK", x: 60, y: 30, w: 30, h: 50, confidence: 96 },
  ],
  "CAM-04": [
    { id: "b7", label: "TRUCK: AXLE CLEAR", severity: "OK", x: 5, y: 25, w: 55, h: 55, confidence: 98 },
    { id: "b8", label: "STRAP FATIGUE", severity: "MEDIUM", x: 65, y: 40, w: 20, h: 30, confidence: 82 },
  ],
  "CAM-05": [
    { id: "b9", label: "EGRESS BLOCKED", severity: "HIGH", x: 30, y: 40, w: 35, h: 45, confidence: 96 },
  ],
  "CAM-06": [
    { id: "b10", label: "YARD: ALL CLEAR", severity: "OK", x: 10, y: 10, w: 80, h: 75, confidence: 99 },
    { id: "b11", label: "VEHICLE IN ZONE", severity: "LOW", x: 55, y: 55, w: 20, h: 25, confidence: 90 },
  ],
};

function getSeverityColor(s: string) {
  switch (s) {
    case "HIGH": return "border-red-500 text-red-400 bg-red-900/20";
    case "MEDIUM": return "border-amber-500 text-amber-400 bg-amber-900/20";
    case "LOW": return "border-blue-500 text-blue-400 bg-blue-900/20";
    default: return "border-emerald-500 text-emerald-400 bg-emerald-900/20";
  }
}

function getSeverityBorderOnly(s: string) {
  switch (s) {
    case "HIGH": return "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
    case "MEDIUM": return "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
    case "LOW": return "border-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.3)]";
    default: return "border-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.3)]";
  }
}

// --- Single Camera Feed Cell ---
function FeedCell({
  feed,
  isExpanded,
  onExpand,
  onCollapse,
  onAlert,
}: {
  feed: Feed;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onAlert: (alert: Alert) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeBoxes, setActiveBoxes] = useState<BoundingBox[]>([]);
  const [scanLine, setScanLine] = useState(0);
  const [inferenceMs, setInferenceMs] = useState(42);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate scan line top→bottom continuously
  useEffect(() => {
    scanRef.current = setInterval(() => {
      setScanLine((p) => (p >= 100 ? 0 : p + 0.8));
    }, 16);
    return () => { if (scanRef.current) clearInterval(scanRef.current); };
  }, []);

  // Randomise active detections every 3–5s
  const rotate = useCallback(() => {
    const pool = DETECTION_POOL[feed.id] || [];
    // Show 1–2 random boxes
    const count = Math.floor(Math.random() * 2) + 1;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setActiveBoxes(shuffled);
    setInferenceMs(Math.floor(38 + Math.random() * 30));

    // Fire alert for HIGH severity detections
    shuffled.forEach((box) => {
      if (box.severity === "HIGH") {
        onAlert({
          id: `${feed.id}-${box.id}-${Date.now()}`,
          camId: feed.id,
          camName: feed.name,
          message: box.label,
          severity: box.severity,
          time: new Date().toLocaleTimeString(),
        });
      }
    });
  }, [feed.id, feed.name, onAlert]);

  useEffect(() => {
    rotate();
    tickRef.current = setInterval(rotate, 3000 + Math.random() * 2000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [rotate]);

  const hasHighAlert = activeBoxes.some((b) => b.severity === "HIGH");

  return (
    <div className={`relative bg-black overflow-hidden border transition-all duration-300 ${hasHighAlert ? "border-red-500/60" : "border-white/10"}`}>
      {/* Video */}
      <video
        ref={videoRef}
        src={feed.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50 grayscale"
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-[1.5px] bg-cyan-400/70 shadow-[0_0_8px_#22d3ee] pointer-events-none z-10"
        style={{ top: `${scanLine}%`, transition: "top 16ms linear" }}
      />

      {/* Bounding Boxes */}
      {activeBoxes.map((box) => (
        <motion.div
          key={box.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`absolute border-2 ${getSeverityBorderOnly(box.severity)} pointer-events-none z-20`}
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`,
          }}
        >
          {/* Corner accent marks */}
          <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-inherit" />
          <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-inherit" />
          <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-inherit" />
          <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-inherit" />
          {/* Label */}
          <div className={`absolute -top-5 left-0 px-1 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider ${getSeverityColor(box.severity)} border border-current`}>
            {box.label} {box.confidence}%
          </div>
        </motion.div>
      ))}

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/70 z-30">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-none ${hasHighAlert ? "bg-red-500 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
          <span className="font-mono text-[8px] text-white/70 uppercase tracking-wider">{feed.id}</span>
          <span className="font-mono text-[8px] text-white/40 uppercase">•</span>
          <span className="font-mono text-[8px] text-white/40 uppercase">{feed.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[7px] text-cyan-400 uppercase">{feed.fps}FPS</span>
          <button
            onClick={isExpanded ? onCollapse : onExpand}
            className="ml-1 text-white/40 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Bottom HUD bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/70 z-30">
        <span className="font-mono text-[7px] text-white/30 uppercase">{feed.location}</span>
        <div className="flex items-center gap-2 font-mono text-[7px] text-white/40">
          <span>INF: {inferenceMs}ms</span>
          <span>{feed.resolution}</span>
        </div>
      </div>

      {/* High alert red flash overlay */}
      {hasHighAlert && (
        <div className="absolute inset-0 border-2 border-red-500/50 pointer-events-none z-30 animate-pulse" />
      )}
    </div>
  );
}

// --- Main Component ---
export default function GodsEyeMatrix() {
  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemOnline, setSystemOnline] = useState(true);
  const [inferenceTotal, setInferenceTotal] = useState(0);
  const [detectionCount, setDetectionCount] = useState(0);
  const alertsRef = useRef<Alert[]>([]);

  const handleAlert = useCallback((alert: Alert) => {
    // Deduplicate - don't add same cam/message within 5s
    const now = Date.now();
    const isDupe = alertsRef.current.some(
      (a) => a.camId === alert.camId && a.message === alert.message &&
        now - parseInt(a.id.split("-").pop() || "0") < 5000
    );
    if (isDupe) return;

    setAlerts((prev) => [alert, ...prev].slice(0, 30));
    alertsRef.current = [alert, ...alertsRef.current].slice(0, 30);
    setDetectionCount((c) => c + 1);
  }, []);

  // Tick up inference counter for realism
  useEffect(() => {
    const t = setInterval(() => {
      setInferenceTotal((p) => p + Math.floor(Math.random() * 4 + 1));
    }, 800);
    return () => clearInterval(t);
  }, []);

  const highAlerts = alerts.filter((a) => a.severity === "HIGH").length;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 text-left space-y-6 font-mono">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            God's Eye Matrix
          </h1>
          <p className="font-sans text-xs text-white/60 mt-1">
            Multi-feed real-time surveillance with simulated AI bounding-box threat detection across all active logistics zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* System Status */}
          <div className={`flex items-center gap-2 px-3 py-2 border text-[9px] uppercase tracking-wider ${systemOnline ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/20" : "border-red-500/30 text-red-400 bg-red-950/20"}`}>
            <Radio className={`h-3 w-3 ${systemOnline ? "animate-pulse" : ""}`} />
            {systemOnline ? "ALL SYSTEMS ONLINE" : "CONNECTION DEGRADED"}
          </div>
          <button
            onClick={() => { setSystemOnline((p) => !p); setAlerts([]); }}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 bg-[#0a0a0a] hover:border-white text-white/60 hover:text-white text-[9px] uppercase transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> CYCLE
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Feeds", value: FEEDS.filter((f) => f.status === "LIVE").length, icon: <Camera className="h-4 w-4" />, color: "text-white" },
          { label: "Detections Today", value: detectionCount, icon: <Cpu className="h-4 w-4" />, color: "text-cyan-400" },
          { label: "High Severity", value: highAlerts, icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-400" },
          { label: "Inference Cycles", value: inferenceTotal, icon: <Activity className="h-4 w-4" />, color: "text-emerald-400" },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 p-4 flex items-center justify-between rounded-none">
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">{kpi.label}</div>
              <div className={`text-2xl font-extrabold ${kpi.color} mt-1`}>{kpi.value}</div>
            </div>
            <div className={`${kpi.color} opacity-40`}>{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* ── Main Feed Grid + Alert Sidebar ── */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Camera Grid */}
        <div className="flex-1 min-w-0">
          {expandedFeed ? (
            // Single expanded feed
            <AnimatePresence>
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-video w-full"
              >
                {FEEDS.filter((f) => f.id === expandedFeed).map((feed) => (
                  <div key={feed.id} className="w-full h-full">
                    <FeedCell
                      feed={feed}
                      isExpanded={true}
                      onExpand={() => {}}
                      onCollapse={() => setExpandedFeed(null)}
                      onAlert={handleAlert}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[220px] md:auto-rows-[200px]">
              {FEEDS.map((feed) => (
                <div key={feed.id} className="h-full">
                  <FeedCell
                    feed={feed}
                    isExpanded={false}
                    onExpand={() => setExpandedFeed(feed.id)}
                    onCollapse={() => setExpandedFeed(null)}
                    onAlert={handleAlert}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alert Log Sidebar */}
        <div className="w-full lg:w-72 shrink-0 bg-[#0a0a0a] border border-white/10 flex flex-col rounded-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              LIVE THREAT LOG
            </div>
            <button
              onClick={() => { setAlerts([]); alertsRef.current = []; }}
              className="text-white/30 hover:text-white text-[9px] uppercase transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" /> CLEAR
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[500px] p-2 space-y-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/20 text-[10px] uppercase text-center gap-2">
                <Shield className="h-6 w-6" />
                No active threats detected.
                <br />All zones nominal.
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-2.5 border text-left rounded-none ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-bold uppercase">{alert.camId}</span>
                      <span className="text-[7px] opacity-60">{alert.time}</span>
                    </div>
                    <div className="text-[9px] font-bold uppercase leading-tight">{alert.message}</div>
                    <div className="text-[8px] opacity-60 mt-0.5">{alert.camName}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-[8px] text-white/30 uppercase">
            <span>AI INFERENCE: ACTIVE</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-400" /> CV_CORE OK
            </span>
          </div>
        </div>
      </div>

      {/* ── Feed Index Table ── */}
      <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden rounded-none">
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
          <Camera className="h-3.5 w-3.5" />
          REGISTERED CAMERA NODES
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] font-mono">
            <thead>
              <tr className="border-b border-white/5 text-white/30 uppercase text-[8px]">
                <th className="px-5 py-3">Node ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3 hidden sm:table-cell">Location</th>
                <th className="px-5 py-3 hidden md:table-cell">Resolution</th>
                <th className="px-5 py-3 text-center">FPS</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {FEEDS.map((feed) => (
                <tr key={feed.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-bold text-white">{feed.id}</td>
                  <td className="px-5 py-3 text-white/70 uppercase">{feed.name}</td>
                  <td className="px-5 py-3 text-white/40 hidden sm:table-cell">{feed.location}</td>
                  <td className="px-5 py-3 text-white/40 hidden md:table-cell">{feed.resolution}</td>
                  <td className="px-5 py-3 text-center text-cyan-400">{feed.fps}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-950/20 text-[8px] uppercase">
                      {feed.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setExpandedFeed(feed.id === expandedFeed ? null : feed.id)}
                      className="text-white/40 hover:text-white uppercase text-[9px] transition-colors"
                    >
                      {feed.id === expandedFeed ? "[COLLAPSE]" : "[EXPAND]"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
