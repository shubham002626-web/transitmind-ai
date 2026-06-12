import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Activity, 
  Eye, 
  ShieldAlert, 
  Coffee, 
  Clock, 
  Search,
  Video,
  VideoOff,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Sparkles,
  Smile,
  UserCheck,
  Award,
  Info,
  Terminal,
  Download
} from "lucide-react";

interface DriverBiometrics {
  id: string;
  name: string;
  route: string;
  bpm: number;
  pupilDilation: number; // in mm
  blinkRate: number; // blinks/min
  fatigueIndex: number; // percentage
  stressLevel: "NORMAL" | "WARNING" | "CRITICAL" | "RESTING";
  avatarInitials: string;
  vehicleId: string;
  statusLog: string[];
  // Bio-expression metrics
  expressionScanStatus?: "PENDING" | "PASSED" | "WARNING" | "CRITICAL";
  lastScanTime?: string;
  smileReflexTime?: number; // ms
  maxMouthAperture?: number; // %
  gazeStability?: number; // %
}

const INITIAL_DRIVERS: DriverBiometrics[] = [
  {
    id: "DRV-102",
    name: "Aarav Mehta",
    route: "Mumbai Port → Pune South Node",
    bpm: 98,
    pupilDilation: 4.8,
    blinkRate: 8,
    fatigueIndex: 78,
    stressLevel: "CRITICAL",
    avatarInitials: "AM",
    vehicleId: "MH-12-TM-9421",
    statusLog: [
      "08:30 - Started Shift",
      "10:15 - High heart rate warning detected",
      "11:05 - Micro-sleep pattern warning logged by eye-tracker"
    ],
    expressionScanStatus: "PENDING"
  },
  {
    id: "DRV-045",
    name: "Vikram Singh",
    route: "Delhi NCR Hub → Jaipur West Node",
    bpm: 72,
    pupilDilation: 3.2,
    blinkRate: 16,
    fatigueIndex: 18,
    stressLevel: "NORMAL",
    avatarInitials: "VS",
    vehicleId: "DL-01-TM-3829",
    statusLog: [
      "06:00 - Started Shift",
      "09:30 - Standard driver change verification: PASSED",
      "11:15 - Biometrics nominal"
    ],
    expressionScanStatus: "PENDING"
  },
  {
    id: "DRV-289",
    name: "Neha Sharma",
    route: "Bengaluru Corridor → Chennai Hub",
    bpm: 88,
    pupilDilation: 4.1,
    blinkRate: 11,
    fatigueIndex: 52,
    stressLevel: "WARNING",
    avatarInitials: "NS",
    vehicleId: "KA-03-TM-0492",
    statusLog: [
      "09:15 - Started Shift",
      "10:45 - Fatigue telemetry warning: Moderate gaze deviation"
    ],
    expressionScanStatus: "PENDING"
  },
  {
    id: "DRV-512",
    name: "Aditya Patel",
    route: "Frankfurt Hub → Paris Cargo Node",
    bpm: 68,
    pupilDilation: 3.0,
    blinkRate: 15,
    fatigueIndex: 12,
    stressLevel: "NORMAL",
    avatarInitials: "AP",
    vehicleId: "DE-FR-TM-583",
    statusLog: [
      "07:30 - Started Shift",
      "10:00 - Standard cross-border telemetry check: NOMINAL"
    ],
    expressionScanStatus: "PENDING"
  },
  {
    id: "DRV-089",
    name: "Ananya Rao",
    route: "Kolkata Port → Patna Depot",
    bpm: 104,
    pupilDilation: 5.1,
    blinkRate: 6,
    fatigueIndex: 84,
    stressLevel: "CRITICAL",
    avatarInitials: "AR",
    vehicleId: "WB-02-TM-7431",
    statusLog: [
      "05:30 - Started Shift",
      "08:15 - Extended driving stretch alert triggered",
      "10:50 - Critical blink duration threshold breached"
    ],
    expressionScanStatus: "PENDING"
  }
];

// Scan state machine steps
type ScanStep = "IDLE" | "ALIGNING" | "NEUTRAL" | "SMILE" | "SQUINT" | "YAWN" | "ANALYZING" | "COMPLETE";

export default function DriverStressScanner() {
  const [drivers, setDrivers] = useState<DriverBiometrics[]>(INITIAL_DRIVERS);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("DRV-102");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Scanner state machine
  const [scanStep, setScanStep] = useState<ScanStep>("IDLE");
  const [scanProgress, setScanProgress] = useState(0);
  const [promptMessage, setPromptMessage] = useState("PRESS START TO CALIBRATE BIOMETRIC PROFILE");
  
  // Real-time expression metrics
  const [mar, setMar] = useState(0.1); // Mouth Aspect Ratio (0.0 to 1.0) - Openness
  const [ear, setEar] = useState(0.8); // Eye Aspect Ratio (0.0 to 1.0) - Openness
  const [sci, setSci] = useState(0.1); // Smile Curvature Index (0.0 to 1.0) - Curvature
  const [bpm, setBpm] = useState(72);
  const [isManualControl, setIsManualControl] = useState(false);

  // Calibration records
  const [neutralEarBaseline, setNeutralEarBaseline] = useState(0.8);
  const [smileReflexStart, setSmileReflexStart] = useState<number | null>(null);
  const [recordedSmileTime, setRecordedSmileTime] = useState<number>(0);
  const [maxObservedYawn, setMaxObservedYawn] = useState<number>(0);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "SYS: Biometric Neural Net calibration database ready.",
    "SYS: Expression recognition models initialized.",
    "SYS: Ready for operator calibration check."
  ]);

  // Webcam States
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStepRef = useRef<ScanStep>("IDLE");

  // CV Refs
  const smoothedFaceRef = useRef({ x: 320, y: 240, w: 200, h: 250 });
  const faceFoundRef = useRef(false);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const addLogEntry = (msg: string) => {
    setConsoleLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const startWebcam = async () => {
    try {
      addLogEntry("REQUESTING CAMERA ACCESS...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      setWebcamStream(stream);
      setIsWebcamActive(true);
      setIsManualControl(false);
      addLogEntry("LIVE WEBCAM CONNECTED. REAL-TIME EXPRESSION CV SYSTEM ACTIVE.");
    } catch (err) {
      console.error(err);
      addLogEntry("ERROR: WEBCAM UNAVAILABLE. ENGAGING HIGH-FIDELITY SIMULATION MODE.");
      setIsManualControl(true);
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
    }
    setWebcamStream(null);
    setIsWebcamActive(false);
    addLogEntry("WEBCAM STREAM DISCONNECTED.");
  };

  useEffect(() => {
    if (isWebcamActive && videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [isWebcamActive, webcamStream]);

  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // Sync step ref
  useEffect(() => {
    currentStepRef.current = scanStep;
  }, [scanStep]);

  // Expression Scan Progress Engine
  const startCalibration = () => {
    if (scanStep !== "IDLE" && scanStep !== "COMPLETE") return;
    
    setScanStep("ALIGNING");
    setScanProgress(0);
    setMaxObservedYawn(0);
    setRecordedSmileTime(0);
    setSmileReflexStart(null);
    setPromptMessage("STAGE 1: ALIGN YOUR FACE INSIDE THE GLOWING MARGINS");
    addLogEntry(`INITIATING EXPRESSION SCAN PROTOCOL FOR ${selectedDriver.name.toUpperCase()}...`);
    
    if (!isWebcamActive) {
      // In simulation mode, start standard fallback timers
      setIsManualControl(true);
    }
  };

  const cancelCalibration = () => {
    setScanStep("IDLE");
    setScanProgress(0);
    setPromptMessage("CALIBRATION CANCELED. CLICK START TO RE-INITIATE.");
    addLogEntry("CALIBRATION PROCESS TERMINATED BY COMMAND CENTER.");
  };

  // Automated Simulation Mode handler
  useEffect(() => {
    if (scanStep === "IDLE" || scanStep === "COMPLETE" || scanStep === "ANALYZING" || isWebcamActive || !isManualControl) return;

    let timer: NodeJS.Timeout;
    const interval = 100; // tick rate

    const runSimulationTick = () => {
      setScanProgress(prev => {
        const nextProgress = prev + 1.2;
        
        // Handle transitions based on progress bar threshold
        if (nextProgress >= 100) {
          setScanStep("ANALYZING");
          setPromptMessage("COMPILING HYBRID EXPRESSION & TELEMETRY REPORT...");
          return 100;
        }

        // Phase 1: ALIGNING (0% - 20%)
        if (nextProgress < 20) {
          if (scanStep !== "ALIGNING") {
            setScanStep("ALIGNING");
            setPromptMessage("STAGE 1: ALIGN YOUR FACE INSIDE THE GLOWING MARGINS");
          }
          // Simulate searching face position
          setMar(0.12 + Math.sin(Date.now() / 200) * 0.02);
          setSci(0.05);
          setEar(0.75 + Math.random() * 0.05);
        }
        // Phase 2: NEUTRAL (20% - 40%)
        else if (nextProgress >= 20 && nextProgress < 40) {
          if (scanStep !== "NEUTRAL") {
            setScanStep("NEUTRAL");
            setPromptMessage("STAGE 2: HOLD NEUTRAL FACE. LOCKING BASELINE APERTURE...");
            addLogEntry("STAGE 2: Calibrating neutral facial baseline.");
          }
          setMar(0.1);
          setSci(0.05);
          setEar(0.85);
          setNeutralEarBaseline(0.85);
        }
        // Phase 3: SMILE (40% - 60%)
        else if (nextProgress >= 40 && nextProgress < 60) {
          if (scanStep !== "SMILE") {
            setScanStep("SMILE");
            setPromptMessage("STAGE 3: SHOW A SMILE TO MEASURE COGNITIVE MUSCLE RESPONSIVENESS");
            addLogEntry("STAGE 3: Auditing smile reflex.");
            setSmileReflexStart(Date.now());
          }
          // Gradually slide smile up
          const ratio = (nextProgress - 40) / 20; // 0 to 1
          setSci(0.1 + ratio * 0.8);
          setMar(0.15 + ratio * 0.15); // mouth parts slightly
          setEar(0.85 - ratio * 0.2); // eyes squint slightly when smiling
          if (smileReflexStart && !recordedSmileTime) {
            setRecordedSmileTime(Math.round(230 + Math.random() * 80));
          }
        }
        // Phase 4: SQUINT (60% - 80%)
        else if (nextProgress >= 60 && nextProgress < 80) {
          if (scanStep !== "SQUINT") {
            setScanStep("SQUINT");
            setPromptMessage("STAGE 4: SQUINT OR FROWN TO CALCULATE FOCUS COHERENCE");
            addLogEntry("STAGE 4: Checking focus and eyelid contraction rate.");
          }
          const ratio = (nextProgress - 60) / 20; // 0 to 1
          setSci(0.9 - ratio * 0.85); // smile goes down
          setEar(0.65 - ratio * 0.45); // eyes close/squint significantly
          setMar(0.1);
        }
        // Phase 5: YAWN (80% - 98%)
        else if (nextProgress >= 80 && nextProgress < 98) {
          if (scanStep !== "YAWN") {
            setScanStep("YAWN");
            setPromptMessage("STAGE 5: OPEN MOUTH WIDE (YAWN REFLEX DEVIATION)");
            addLogEntry("STAGE 5: Calibrating drowsiness & yawn limits.");
          }
          const ratio = (nextProgress - 80) / 18; // 0 to 1
          setMar(0.1 + ratio * 0.82); // open mouth wide!
          setEar(0.2 + ratio * 0.5); // eyes open back up a bit
          setSci(0.05);
          if (0.1 + ratio * 0.82 > maxObservedYawn) {
            setMaxObservedYawn(Math.round((0.1 + ratio * 0.82) * 100));
          }
        }

        return nextProgress;
      });

      timer = setTimeout(runSimulationTick, interval);
    };

    timer = setTimeout(runSimulationTick, interval);
    return () => clearTimeout(timer);
  }, [scanStep, isManualControl, isWebcamActive, smileReflexStart, recordedSmileTime, maxObservedYawn]);

  // Keep values updated in a ref to avoid clearing the analyzing timeout due to sub-second sensor state updates
  const scanDataRef = useRef({
    selectedDriverId,
    selectedDriverName: selectedDriver.name,
    maxObservedYawn,
    ear,
    recordedSmileTime,
    mar
  });

  useEffect(() => {
    scanDataRef.current = {
      selectedDriverId,
      selectedDriverName: selectedDriver.name,
      maxObservedYawn,
      ear,
      recordedSmileTime,
      mar
    };
  });

  // Analyzing Step compilation
  useEffect(() => {
    if (scanStep !== "ANALYZING") return;

    const timer = setTimeout(() => {
      const { 
        selectedDriverId: currentId, 
        selectedDriverName: currentName, 
        maxObservedYawn: currentYawn, 
        ear: currentEar, 
        recordedSmileTime: currentSmileTime, 
        mar: currentMar 
      } = scanDataRef.current;

      // Complete scan and determine driver metrics
      setScanStep("COMPLETE");
      setPromptMessage("EVALUATION GENERATED. RE-ALIGNMENT SCORE REGISTERED.");
      
      // Calculate final outcomes based on scanning variables
      // Yawning or squinting too long increases fatigue rating
      const yawnFatigueFactor = currentYawn > 70 ? (currentYawn - 40) * 1.2 : 0;
      const eyeFatigueFactor = currentEar < 0.35 ? 35 : 5;
      const computedFatigue = Math.round(Math.min(100, Math.max(5, (yawnFatigueFactor + eyeFatigueFactor + (currentSmileTime > 300 ? 15 : 0)))));
      
      let finalLevel: "NORMAL" | "WARNING" | "CRITICAL" = "NORMAL";
      if (computedFatigue > 70) {
        finalLevel = "CRITICAL";
      } else if (computedFatigue > 40) {
        finalLevel = "WARNING";
      }

      const reflexTime = currentSmileTime || Math.round(200 + Math.random() * 120);
      const finalYawnVal = currentYawn || Math.round(currentMar * 100);

      // Commit to driver roster
      setDrivers(prev => prev.map(d => {
        if (d.id !== currentId) return d;
        return {
          ...d,
          fatigueIndex: computedFatigue,
          stressLevel: finalLevel,
          expressionScanStatus: computedFatigue > 70 ? "CRITICAL" : computedFatigue > 40 ? "WARNING" : "PASSED",
          lastScanTime: new Date().toLocaleTimeString(),
          smileReflexTime: reflexTime,
          maxMouthAperture: finalYawnVal,
          gazeStability: Math.round(85 + Math.random() * 13),
          statusLog: [
            ...d.statusLog,
            `${new Date().toLocaleTimeString()} - Expression scan complete. Fatigue index: ${computedFatigue}%. Smile response: ${reflexTime}ms. Yawn intensity: ${finalYawnVal}%.`
          ]
        };
      }));

      addLogEntry(`VERDICT: ${currentName.toUpperCase()} Calibrated with Fatigue index of ${computedFatigue}% (${finalLevel}).`);
    }, 2500);

    return () => clearTimeout(timer);
  }, [scanStep]);


  // Real-time computer vision frame processing
  useEffect(() => {
    if (!isWebcamActive || !videoRef.current || !canvasRef.current) return;

    let animationId: number;
    let lastPulseTime = Date.now();
    let smileStartTimeCapture: number | null = null;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext("2d");

      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Draw camera image mirror
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = currentFrame.data;
        const width = canvas.width;
        const height = canvas.height;

        // Perform face detection via skin classification
        let skinSumX = 0, skinSumY = 0, skinPixelCount = 0;
        let minX = width, maxX = 0, minY = height, maxY = 0;

        for (let y = 0; y < height; y += 12) { // downsample for performance
          for (let x = 0; x < width; x += 12) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Skin classification
            const isSkin = r > 95 && g > 40 && b > 20 && 
                           r > g && r > b && 
                           (r - Math.min(g, b) > 15) && 
                           (r - g > 15);

            if (isSkin) {
              skinSumX += x;
              skinSumY += y;
              skinPixelCount++;

              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        let faceRect = { 
          x: width * 0.3, 
          y: height * 0.2, 
          w: width * 0.4, 
          h: height * 0.6 
        };

        if (skinPixelCount > 30) {
          faceFoundRef.current = true;
          const meanX = skinSumX / skinPixelCount;
          const meanY = skinSumY / skinPixelCount;
          
          const targetW = Math.max(160, Math.min(width * 0.7, (maxX - minX) * 1.1));
          const targetH = Math.max(200, Math.min(height * 0.85, (maxY - minY) * 1.1));

          // Interpolation for smooth tracking
          smoothedFaceRef.current.x += (meanX - smoothedFaceRef.current.x) * 0.15;
          smoothedFaceRef.current.y += (meanY - smoothedFaceRef.current.y) * 0.15;
          smoothedFaceRef.current.w += (targetW - smoothedFaceRef.current.w) * 0.15;
          smoothedFaceRef.current.h += (targetH - smoothedFaceRef.current.h) * 0.15;

          faceRect = {
            x: Math.max(0, smoothedFaceRef.current.x - smoothedFaceRef.current.w / 2),
            y: Math.max(0, smoothedFaceRef.current.y - smoothedFaceRef.current.h / 2),
            w: Math.min(width, smoothedFaceRef.current.w),
            h: Math.min(height, smoothedFaceRef.current.h)
          };
        } else {
          faceFoundRef.current = false;
        }

        // Draw Bounding Face Area (HUD design)
        ctx.strokeStyle = faceFoundRef.current ? "rgba(34, 211, 238, 0.6)" : "rgba(239, 68, 68, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(faceRect.x, faceRect.y, faceRect.w, faceRect.h);

        // Neon HUD bracket highlights
        const cLen = 22;
        ctx.strokeStyle = faceFoundRef.current ? "#22d3ee" : "#ef4444";
        ctx.lineWidth = 3;
        // Top-Left
        ctx.beginPath(); ctx.moveTo(faceRect.x, faceRect.y + cLen); ctx.lineTo(faceRect.x, faceRect.y); ctx.lineTo(faceRect.x + cLen, faceRect.y); ctx.stroke();
        // Top-Right
        ctx.beginPath(); ctx.moveTo(faceRect.x + faceRect.w, faceRect.y + cLen); ctx.lineTo(faceRect.x + faceRect.w, faceRect.y); ctx.lineTo(faceRect.x + faceRect.w - cLen, faceRect.y); ctx.stroke();
        // Bottom-Left
        ctx.beginPath(); ctx.moveTo(faceRect.x, faceRect.y + faceRect.h - cLen); ctx.lineTo(faceRect.x, faceRect.y + faceRect.h); ctx.lineTo(faceRect.x + cLen, faceRect.y + faceRect.h); ctx.stroke();
        // Bottom-Right
        ctx.beginPath(); ctx.moveTo(faceRect.x + faceRect.w, faceRect.y + faceRect.h - cLen); ctx.lineTo(faceRect.x + faceRect.w, faceRect.y + faceRect.h); ctx.lineTo(faceRect.x + faceRect.w - cLen, faceRect.y + faceRect.h); ctx.stroke();

        // Check stages alignment
        const currentStep = currentStepRef.current;
        if (currentStep === "ALIGNING") {
          if (faceFoundRef.current) {
            setScanProgress(p => {
              if (p >= 20) {
                setScanStep("NEUTRAL");
                setPromptMessage("STAGE 2: HOLD NEUTRAL FACE. LOCKING BASELINE APERTURE...");
                addLogEntry("STAGE 2: Calibrating neutral facial baseline.");
                return 20;
              }
              return p + 1;
            });
          }
        }

        // Zones calculation inside face bounding box
        const leftEyeZone = {
          x: faceRect.x + faceRect.w * 0.18,
          y: faceRect.y + faceRect.h * 0.25,
          w: faceRect.w * 0.28,
          h: faceRect.h * 0.16
        };

        const rightEyeZone = {
          x: faceRect.x + faceRect.w * 0.54,
          y: faceRect.y + faceRect.h * 0.25,
          w: faceRect.w * 0.28,
          h: faceRect.h * 0.16
        };

        const mouthZone = {
          x: faceRect.x + faceRect.w * 0.25,
          y: faceRect.y + faceRect.h * 0.65,
          w: faceRect.w * 0.5,
          h: faceRect.h * 0.22
        };

        // Draw helper boundaries
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.strokeRect(leftEyeZone.x, leftEyeZone.y, leftEyeZone.w, leftEyeZone.h);
        ctx.strokeRect(rightEyeZone.x, rightEyeZone.y, rightEyeZone.w, rightEyeZone.h);
        ctx.strokeRect(mouthZone.x, mouthZone.y, mouthZone.w, mouthZone.h);

        // --- COMPUTER VISION EXPRESSION HEURISTICS ---

        // 1. Mouth Aspect Ratio (MAR) - Dark pixels count in mouth zone
        let mouthDarkPixels = 0;
        let mouthTotalPixels = 0;
        const mouthStartRow = Math.round(mouthZone.y);
        const mouthEndRow = Math.round(mouthZone.y + mouthZone.h);
        const mouthStartCol = Math.round(mouthZone.x);
        const mouthEndCol = Math.round(mouthZone.x + mouthZone.w);

        for (let my = mouthStartRow; my < mouthEndRow; my += 3) {
          for (let mx = mouthStartCol; mx < mouthEndCol; mx += 3) {
            if (mx >= 0 && mx < width && my >= 0 && my < height) {
              const idx = (my * width + mx) * 4;
              const r = data[idx], g = data[idx+1], b = data[idx+2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum < 55) { // Threshold for dark mouth cavity
                mouthDarkPixels++;
              }
              mouthTotalPixels++;
            }
          }
        }

        const calculatedMar = mouthTotalPixels > 0 ? (mouthDarkPixels / mouthTotalPixels) * 5.0 : 0.1;
        const smoothedMar = Math.min(1.0, Math.max(0.05, calculatedMar));
        setMar(prev => prev + (smoothedMar - prev) * 0.3);

        // 2. Smile Curvature Index (SCI) - Horizontal width ratio of skin to dark boundary in mouth
        // Smiling makes mouth wider. We can approximate this by the ratio of horizontal mouth bounding size
        let leftMouthCorner = mouthEndCol;
        let rightMouthCorner = mouthStartCol;
        for (let my = mouthStartRow; my < mouthEndRow; my += 4) {
          for (let mx = mouthStartCol; mx < mouthEndCol; mx += 4) {
            const idx = (my * width + mx) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum < 65) {
              if (mx < leftMouthCorner) leftMouthCorner = mx;
              if (mx > rightMouthCorner) rightMouthCorner = mx;
            }
          }
        }
        
        const mouthWidth = Math.max(0, rightMouthCorner - leftMouthCorner);
        const smileRatio = mouthWidth / (faceRect.w * 0.45); // standard neutral smile scale
        const smoothedSci = Math.min(1.0, Math.max(0.0, (smileRatio - 0.7) * 2.0));
        setSci(prev => prev + (smoothedSci - prev) * 0.2);

        // 3. Eye Aspect Ratio (EAR) - Find eyelids/pupil aperture
        const getEyeOpenness = (zone: { x: number, y: number, w: number, h: number }) => {
          let darkCount = 0;
          let totalCount = 0;
          const sy = Math.round(zone.y);
          const ey = Math.round(zone.y + zone.h);
          const sx = Math.round(zone.x);
          const ex = Math.round(zone.x + zone.w);

          for (let py = sy; py < ey; py += 2) {
            for (let px = sx; px < ex; px += 2) {
              if (px >= 0 && px < width && py >= 0 && py < height) {
                const idx = (py * width + px) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum < 65) {
                  darkCount++;
                }
                totalCount++;
              }
            }
          }
          const baseRatio = totalCount > 0 ? (darkCount / totalCount) : 0.3;
          // As eyes close, the dark pupil gets hidden, but eyelashes and shadows remain.
          // EAR scales inversely with rapid loss of pupil dark contrast.
          return Math.min(1.0, Math.max(0.1, baseRatio * 2.5));
        };

        const leftOpen = getEyeOpenness(leftEyeZone);
        const rightOpen = getEyeOpenness(rightEyeZone);
        const averageEar = Math.min(1.0, Math.max(0.1, (leftOpen + rightOpen) / 2.0));
        setEar(prev => prev + (averageEar - prev) * 0.25);

        // 4. Heart Rate estimation (Pulse PPG)
        // Measure slight green channel variations over forehead/cheeks
        const checkArea = {
          x: faceRect.x + faceRect.w * 0.3,
          y: faceRect.y + faceRect.h * 0.12,
          w: faceRect.w * 0.4,
          h: faceRect.h * 0.1
        };
        let greenVal = 0, greenCount = 0;
        for (let py = Math.round(checkArea.y); py < Math.round(checkArea.y + checkArea.h); py += 4) {
          for (let px = Math.round(checkArea.x); px < Math.round(checkArea.x + checkArea.w); px += 4) {
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const idx = (py * width + px) * 4;
              greenVal += data[idx + 1];
              greenCount++;
            }
          }
        }
        if (greenCount > 0 && Date.now() - lastPulseTime > 1000) {
          const avgGreen = greenVal / greenCount;
          // Simulate heart rate oscillations based on minor blood flow
          const mockBpm = Math.round(70 + (avgGreen % 15) + (selectedDriver.stressLevel === "CRITICAL" ? 20 : 0));
          setBpm(mockBpm);
          lastPulseTime = Date.now();
        }

        // --- CALIBRATION STAGE ADVANCEMENT CRITERIA ---
        if (currentStep === "NEUTRAL") {
          setScanProgress(p => {
            if (p >= 40) {
              setScanStep("SMILE");
              setPromptMessage("STAGE 3: SHOW A CLEAR SMILE TO CALIBRATE ALIGNMENT");
              addLogEntry("STAGE 3: Auditing smile reflex.");
              smileStartTimeCapture = Date.now();
              return 40;
            }
            return p + 0.4;
          });
        } 
        else if (currentStep === "SMILE") {
          // Check if SCI exceeds smiling threshold
          if (sci > 0.55 || (smileStartTimeCapture && Date.now() - smileStartTimeCapture > 4000)) {
            if (smileStartTimeCapture && !recordedSmileTime) {
              const diff = Date.now() - smileStartTimeCapture;
              setRecordedSmileTime(Math.min(3000, Math.round(diff)));
            }
            setScanProgress(p => {
              if (p >= 60) {
                setScanStep("SQUINT");
                setPromptMessage("STAGE 4: SQUINT OR FROWN TO CALCULATE FOCUS COHERENCE");
                addLogEntry("STAGE 4: Checking focus and eyelid contraction rate.");
                return 60;
              }
              return p + 0.8;
            });
          }
        } 
        else if (currentStep === "SQUINT") {
          // Check if user squints (EAR drops)
          if (ear < 0.48 || (smileStartTimeCapture && Date.now() - smileStartTimeCapture > 8000)) {
            setScanProgress(p => {
              if (p >= 80) {
                setScanStep("YAWN");
                setPromptMessage("STAGE 5: OPEN MOUTH WIDE (YAWN REFLEX DEVIATION)");
                addLogEntry("STAGE 5: Calibrating drowsiness & yawn limits.");
                return 80;
              }
              return p + 0.8;
            });
          }
        } 
        else if (currentStep === "YAWN") {
          if (mar > maxObservedYawn) {
            setMaxObservedYawn(Math.round(mar * 100));
          }
          // Check if mouth opens wide
          if (mar > 0.6 || (smileStartTimeCapture && Date.now() - smileStartTimeCapture > 12000)) {
            setScanProgress(p => {
              if (p >= 98) {
                setScanStep("ANALYZING");
                setPromptMessage("COMPILING HYBRID EXPRESSION & TELEMETRY REPORT...");
                return 98;
              }
              return p + 0.8;
            });
          }
        }

        // Draw facial mesh lines dynamically deforming based on MAR, EAR, SCI
        drawMesh(ctx, faceRect, mar, ear, sci);
      }

      animationId = requestAnimationFrame(processFrame);
    };

    animationId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animationId);
  }, [isWebcamActive, scanStep, sci, ear, mar, selectedDriverId]);

  // Mesh drawing helper
  const drawMesh = (
    ctx: CanvasRenderingContext2D, 
    face: { x: number, y: number, w: number, h: number },
    mRatio: number,
    eRatio: number,
    sRatio: number
  ) => {
    ctx.strokeStyle = "rgba(34, 211, 238, 0.4)";
    ctx.lineWidth = 1;

    const midX = face.x + face.w / 2;
    const eyeY = face.y + face.h * 0.33;
    const mouthY = face.y + face.h * 0.72;

    // Eyebrows
    const leftBrow = [
      { x: face.x + face.w * 0.18, y: eyeY - face.h * 0.08 - (sRatio * 6) },
      { x: face.x + face.w * 0.32, y: eyeY - face.h * 0.1 - (sRatio * 8) },
      { x: face.x + face.w * 0.42, y: eyeY - face.h * 0.06 }
    ];

    const rightBrow = [
      { x: face.x + face.w * 0.82, y: eyeY - face.h * 0.08 - (sRatio * 6) },
      { x: face.x + face.w * 0.68, y: eyeY - face.h * 0.1 - (sRatio * 8) },
      { x: face.x + face.w * 0.58, y: eyeY - face.h * 0.06 }
    ];

    const drawCurve = (pts: { x: number, y: number }[]) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    };

    drawCurve(leftBrow);
    drawCurve(rightBrow);

    // Eyes (Eyelids shrink with smaller eRatio)
    const eyeHalfW = face.w * 0.08;
    const eyeMaxH = face.h * 0.04 * eRatio;

    const drawEye = (cx: number, cy: number) => {
      ctx.beginPath();
      // Upper lid
      ctx.moveTo(cx - eyeHalfW, cy);
      ctx.quadraticCurveTo(cx, cy - eyeMaxH, cx + eyeHalfW, cy);
      // Lower lid
      ctx.quadraticCurveTo(cx, cy + eyeMaxH, cx - eyeHalfW, cy);
      ctx.closePath();
      ctx.stroke();

      // Pupil
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * eRatio, 0, 2 * Math.PI);
      ctx.fill();
    };

    drawEye(face.x + face.w * 0.3, eyeY);
    drawEye(face.x + face.w * 0.7, eyeY);

    // Nose
    ctx.beginPath();
    ctx.moveTo(midX, eyeY - face.h * 0.05);
    ctx.lineTo(midX, face.y + face.h * 0.58);
    ctx.lineTo(midX - face.w * 0.05, face.y + face.h * 0.58);
    ctx.lineTo(midX + face.w * 0.05, face.y + face.h * 0.58);
    ctx.stroke();

    // Mouth (reacts to sRatio/smile and mRatio/openness)
    const mouthW = face.w * 0.16 + (sRatio * face.w * 0.06);
    const lipOpen = face.h * 0.05 * mRatio;
    const smileCurve = sRatio * face.h * 0.04;

    ctx.beginPath();
    // Top Lip
    ctx.moveTo(midX - mouthW, mouthY - smileCurve);
    ctx.quadraticCurveTo(midX, mouthY - lipOpen - (face.h * 0.01), midX + mouthW, mouthY - smileCurve);
    // Inner center opening
    ctx.quadraticCurveTo(midX, mouthY + lipOpen, midX - mouthW, mouthY - smileCurve);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    // Bottom lip outer contour
    ctx.moveTo(midX - mouthW, mouthY - smileCurve);
    ctx.quadraticCurveTo(midX, mouthY + lipOpen + (face.h * 0.035), midX + mouthW, mouthY - smileCurve);
    ctx.stroke();

    // Draw connecting facial mesh grids
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    // Connect eyes to nose
    ctx.beginPath();
    ctx.moveTo(face.x + face.w * 0.3, eyeY);
    ctx.lineTo(midX, face.y + face.h * 0.58);
    ctx.lineTo(face.x + face.w * 0.7, eyeY);
    ctx.stroke();

    // Connect nose to mouth corners
    ctx.beginPath();
    ctx.moveTo(midX, face.y + face.h * 0.58);
    ctx.lineTo(midX - mouthW, mouthY - smileCurve);
    ctx.moveTo(midX, face.y + face.h * 0.58);
    ctx.lineTo(midX + mouthW, mouthY - smileCurve);
    ctx.stroke();

    // Face boundary outline points
    const jawPts = [
      { x: face.x + face.w * 0.08, y: face.y + face.h * 0.35 },
      { x: face.x + face.w * 0.12, y: face.y + face.h * 0.6 },
      { x: face.x + face.w * 0.26, y: face.y + face.h * 0.88 },
      { x: midX, y: face.y + face.h * 0.96 },
      { x: face.x + face.w * 0.74, y: face.y + face.h * 0.88 },
      { x: face.x + face.w * 0.88, y: face.y + face.h * 0.6 },
      { x: face.x + face.w * 0.92, y: face.y + face.h * 0.35 },
    ];
    drawCurve(jawPts);
  };

  // Dispatch Mandatory Rest Order
  const handleIssueRest = (id: string) => {
    setDrivers(drs => drs.map(d => {
      if (d.id !== id) return d;
      addLogEntry(`DIRECTIVE SENT: 45-Min Mandatory Rest dispatch ordered for ${d.name.toUpperCase()}.`);
      return {
        ...d,
        stressLevel: "RESTING",
        bpm: 62,
        pupilDilation: 2.8,
        blinkRate: 14,
        fatigueIndex: 4,
        expressionScanStatus: "PASSED",
        statusLog: [...d.statusLog, `${new Date().toLocaleTimeString()} - REST ORDER ENFORCED BY STATION COORDINATOR`]
      };
    }));
  };

  const getStressBadgeColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-red-400 border-red-500/20 bg-red-950/20";
      case "WARNING": return "text-amber-400 border-amber-500/20 bg-amber-950/20";
      case "RESTING": return "text-cyan-400 border-cyan-500/20 bg-cyan-950/20";
      default: return "text-emerald-400 border-emerald-500/20 bg-emerald-950/20";
    }
  };

  const getScanBadgeColor = (status?: string) => {
    switch (status) {
      case "CRITICAL": return "text-red-400 bg-red-950/30 border border-red-500/30";
      case "WARNING": return "text-amber-400 bg-amber-950/30 border border-amber-500/30";
      case "PASSED": return "text-emerald-400 bg-emerald-950/30 border border-emerald-500/30";
      default: return "text-white/40 bg-white/5 border border-white/10";
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesLevel = filterLevel === "ALL" || d.stressLevel === filterLevel;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-left relative space-y-8 font-mono">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Activity className="h-5.5 w-5.5 text-white" />
            Biometric Fatigue & Expression Matrix
          </h1>
          <p className="font-sans text-xs text-white/60 mt-1">
            Driver fatigue audits utilizing facial gesture calibration scans. System registers baseline response, smile reflexes, squint metrics, and yawning aperture constraints.
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] py-2 px-4 border border-white/10 text-[10px] text-white/60">
          <span className={`h-1.5 w-1.5 ${scanStep !== "IDLE" ? 'bg-cyan-400' : 'bg-emerald-400'} ${scanStep !== "IDLE" ? 'animate-ping' : 'animate-pulse'}`}></span>
          <span>SYSTEM STATE: {scanStep === "IDLE" ? "STANDBY" : `CV_SCANNING_${scanStep}`}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Driver roster */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Driver Registry Catalog</h2>
            
            {/* Search and Filters */}
            <div className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="SEARCH OPERATOR..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 px-9 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
                className="bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="ALL">ALL STATUS</option>
                <option value="NORMAL">NORMAL</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="RESTING">RESTING</option>
              </select>
            </div>

            {/* Catalog List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredDrivers.map(drv => (
                <div
                  key={drv.id}
                  onClick={() => {
                    if (scanStep === "IDLE" || scanStep === "COMPLETE") {
                      setSelectedDriverId(drv.id);
                      setScanStep("IDLE");
                    } else {
                      addLogEntry("WARNING: Cannot swap operators during live calibration.");
                    }
                  }}
                  className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                    selectedDriverId === drv.id 
                      ? "bg-[#121212] border-white text-white" 
                      : "bg-[#050505] border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs border ${
                      drv.stressLevel === "CRITICAL" 
                        ? "border-red-500 bg-red-950/10 text-red-400" 
                        : "border-white/20 bg-white/5"
                    }`}>
                      {drv.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase">{drv.name}</h3>
                      <p className="text-[9px] text-white/40 mt-1 font-sans">{drv.id} • {drv.vehicleId}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`text-[8px] font-bold px-2 py-0.5 border ${getStressBadgeColor(drv.stressLevel)}`}>
                      {drv.stressLevel}
                    </span>
                    <span className={`text-[7px] px-1.5 py-0.2 uppercase ${getScanBadgeColor(drv.expressionScanStatus)}`}>
                      {drv.expressionScanStatus === "PENDING" ? "UNSCANNED" : `SCAN_${drv.expressionScanStatus}`}
                    </span>
                  </div>
                </div>
              ))}

              {filteredDrivers.length === 0 && (
                <div className="text-center py-8 text-white/30 text-xs">
                  NO OPERATOR DATA MATCHES QUERY.
                </div>
              )}
            </div>
          </div>

          {/* Console Ledger */}
          <div className="bg-black border border-white/10 p-4 h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-[9px] uppercase tracking-wider text-white/40">SYSTEM LEDGER LOGS</span>
              <span className="text-[8px] text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-1.5">CONNECTED</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2 text-[9px] text-white/45 space-y-1.5 leading-relaxed pr-1 select-none font-mono">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="truncate">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Main scan viewport & result telemetry */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-6">
            
            {/* Active Operator Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 border border-white bg-white text-black flex items-center justify-center font-bold text-lg">
                  {selectedDriver.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase text-white leading-none">{selectedDriver.name}</h2>
                    <span className="text-[8px] text-white/40">ID: {selectedDriver.id}</span>
                  </div>
                  <p className="text-[10px] text-white/60 mt-2">VEHICLE ID: {selectedDriver.vehicleId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleIssueRest(selectedDriver.id)}
                  disabled={selectedDriver.stressLevel === "RESTING"}
                  className="bg-white text-black hover:bg-black hover:text-white border border-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-20"
                >
                  DISPATCH MANDATORY REST
                </button>
              </div>
            </div>

            {/* Video Viewport & Wizard Prompt */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Scan viewport */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <div className="relative aspect-video bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                  
                  {/* Glowing corners */}
                  <div className="absolute top-4 left-4 border-t border-l border-cyan-400/50 w-4 h-4 z-20" />
                  <div className="absolute top-4 right-4 border-t border-r border-cyan-400/50 w-4 h-4 z-20" />
                  <div className="absolute bottom-4 left-4 border-b border-l border-cyan-400/50 w-4 h-4 z-20" />
                  <div className="absolute bottom-4 right-4 border-b border-r border-cyan-400/50 w-4 h-4 z-20" />

                  {/* Scanning beam line */}
                  {(scanStep !== "IDLE" && scanStep !== "COMPLETE" && scanStep !== "ANALYZING") && (
                    <div className="absolute inset-x-0 h-[2.5px] bg-cyan-400/80 shadow-[0_0_12px_#22d3ee] animate-scan z-20" />
                  )}

                  {/* Telemetry labels */}
                  <div className="absolute top-4 right-6 font-mono text-[8px] text-white/40 text-right space-y-1 z-20">
                    <div>MODE: {isWebcamActive ? "LIVE_CAMERA" : "SIMULATION_MATRIX"}</div>
                    <div>TRACKING: {scanStep !== "IDLE" ? "FACIAL_MESH_LOCK" : "IDLE"}</div>
                    <div>FPS: {isWebcamActive ? "30.0" : "0.0"}</div>
                  </div>

                  {isWebcamActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-75"
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                      />
                    </>
                  ) : (
                    <>
                      {/* Sim Face Mesh SVG deforming with state variables */}
                      <svg className="w-2/3 h-2/3 text-cyan-400/20 z-10 transition-all duration-150" viewBox="0 0 100 100">
                        {/* Outer Head circle */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
                        <line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />

                        {/* Eyebrows */}
                        <path d={`M 20 ${32 - (sci * 3)} Q 30 ${28 - (sci * 4)} 42 32`} fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d={`M 80 ${32 - (sci * 3)} Q 70 ${28 - (sci * 4)} 58 32`} fill="none" stroke="currentColor" strokeWidth="1" />

                        {/* Eyes reacting to ear */}
                        <ellipse cx="30" cy="40" rx="6" ry={6 * ear} fill="none" stroke="#22d3ee" strokeWidth="1" />
                        <circle cx="30" cy="40" r={2 * ear} fill="#22d3ee" />

                        {/* Right Eye */}
                        <ellipse cx="70" cy="40" rx="6" ry={6 * ear} fill="none" stroke="#22d3ee" strokeWidth="1" />
                        <circle cx="70" cy="40" r={2 * ear} fill="#22d3ee" />

                        {/* Nose */}
                        <path d="M 50 38 L 50 60 L 46 60 L 54 60" fill="none" stroke="currentColor" strokeWidth="1" />

                        {/* Mouth reacting to mar (openness) and sci (smile) */}
                        {/* Smile makes mouth wider and shifts corners up */}
                        <path 
                          d={`M ${35 - (sci * 3)} ${72 - (sci * 2)} Q 50 ${72 + (mar * 15)} ${65 + (sci * 3)} ${72 - (sci * 2)}`} 
                          fill="none" 
                          stroke="#22d3ee" 
                          strokeWidth="1.5" 
                        />
                        <path 
                          d={`M ${35 - (sci * 3)} ${72 - (sci * 2)} Q 50 ${72 - (mar * 6)} ${65 + (sci * 3)} ${72 - (sci * 2)}`} 
                          fill="none" 
                          stroke="#22d3ee" 
                          strokeWidth="1" 
                        />
                      </svg>

                      {/* Overlays */}
                      {scanStep === "IDLE" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 z-20">
                          <button
                            onClick={startWebcam}
                            className="bg-cyan-500 text-black hover:bg-cyan-400 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                          >
                            <Video className="h-3.5 w-3.5" /> ENGAGE CAMERA FEED
                          </button>
                          <span className="text-[8px] text-white/40 uppercase">Or run interactive simulator scan below</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Floating state details */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 z-20">
                    <span className={`h-2 w-2 ${selectedDriver.stressLevel === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-[9px] uppercase text-white/70">
                      {selectedDriver.stressLevel === "RESTING" ? "CABIN FEED DEACTIVATED" : "EYE-EXPRESSION TRACKER"}
                    </span>
                  </div>

                  {/* Calibration Progress Bar */}
                  {scanStep !== "IDLE" && scanStep !== "COMPLETE" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/15">
                      <div 
                        className="h-full bg-cyan-400 transition-all duration-150" 
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Calibration control buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {scanStep === "IDLE" || scanStep === "COMPLETE" ? (
                    <button
                      onClick={startCalibration}
                      disabled={selectedDriver.stressLevel === "RESTING"}
                      className="w-full bg-cyan-500 text-black hover:bg-cyan-400 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2 disabled:opacity-20"
                    >
                      <Camera className="h-4 w-4" /> INITIATE SCAN CYCLE
                    </button>
                  ) : (
                    <button
                      onClick={cancelCalibration}
                      className="w-full bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2"
                    >
                      CANCEL SCAN
                    </button>
                  )}

                  {isWebcamActive ? (
                    <button
                      onClick={stopWebcam}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2"
                    >
                      <VideoOff className="h-4 w-4" /> DISCONNECT CAMERA
                    </button>
                  ) : (
                    <button
                      onClick={startWebcam}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2"
                    >
                      <Video className="h-4 w-4" /> CONNECT CAMERA
                    </button>
                  )}
                </div>
              </div>

              {/* Ratios telemetry gauges */}
              <div className="md:col-span-5 flex flex-col justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Live Telemetry Regulators
                    </h3>
                    <span className="text-[8px] bg-cyan-950/30 text-cyan-400 border border-cyan-500/20 px-1">CV_STAT</span>
                  </div>

                  {/* Realtime metric sliders/bars */}
                  <div className="space-y-3.5">
                    {/* Heart Rate */}
                    <div>
                      <div className="flex justify-between text-[9px] text-white/60 mb-1">
                        <span>PULSE Telemetry (PPG)</span>
                        <span className="text-white font-bold">{bpm} BPM</span>
                      </div>
                      <div className="h-1.5 bg-white/5 border border-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (bpm / 150) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Eye openness EAR */}
                    <div>
                      <div className="flex justify-between text-[9px] text-white/60 mb-1">
                        <span>Eye Aperture Ratio (EAR)</span>
                        <span className="text-white font-bold">{(ear * 100).toFixed(0)}%</span>
                      </div>
                      {isManualControl ? (
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.0" 
                          step="0.01" 
                          value={ear}
                          onChange={e => setEar(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 accent-cyan-400 cursor-pointer"
                        />
                      ) : (
                        <div className="h-1.5 bg-white/5 border border-white/5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-100 ${ear < 0.45 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                            style={{ width: `${ear * 100}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Mouth Opening MAR */}
                    <div>
                      <div className="flex justify-between text-[9px] text-white/60 mb-1">
                        <span>Mouth Aperture (MAR)</span>
                        <span className="text-white font-bold">{(mar * 100).toFixed(0)}%</span>
                      </div>
                      {isManualControl ? (
                        <input 
                          type="range" 
                          min="0.05" 
                          max="1.0" 
                          step="0.01" 
                          value={mar}
                          onChange={e => setMar(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 accent-cyan-400 cursor-pointer"
                        />
                      ) : (
                        <div className="h-1.5 bg-white/5 border border-white/5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-100 ${mar > 0.65 ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'}`}
                            style={{ width: `${mar * 100}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Smile ratio SCI */}
                    <div>
                      <div className="flex justify-between text-[9px] text-white/60 mb-1">
                        <span>Smile Reflex Index (SCI)</span>
                        <span className="text-white font-bold">{(sci * 100).toFixed(0)}%</span>
                      </div>
                      {isManualControl ? (
                        <input 
                          type="range" 
                          min="0.0" 
                          max="1.0" 
                          step="0.01" 
                          value={sci}
                          onChange={e => setSci(parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 accent-cyan-400 cursor-pointer"
                        />
                      ) : (
                        <div className="h-1.5 bg-white/5 border border-white/5 overflow-hidden">
                          <div 
                            className="h-full bg-cyan-400 transition-all duration-100"
                            style={{ width: `${sci * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulation Notice */}
                {!isWebcamActive && (
                  <div className="p-3 bg-white/5 border border-white/10 text-[9px] leading-relaxed text-white/50">
                    <span className="text-cyan-400 font-bold block mb-1">SIMULATION ENGINE ACTIVE:</span>
                    Adjust the live sliders above to deform the face wireframe model. If you initiate a scan, they will slide automatically to simulate expressions.
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Wizard Prompt Card */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 text-left">
              <Terminal className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[8px] text-cyan-400 font-bold block uppercase tracking-wider">Calibration Prompt HUD</span>
                <p className="text-xs text-white mt-1 uppercase leading-relaxed font-semibold">
                  {promptMessage}
                </p>
              </div>
            </div>

            {/* Scan results & Fatigue breakdown section */}
            <AnimatePresence mode="wait">
              {scanStep === "COMPLETE" && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6"
                >
                  {/* Expression Report Card */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Award className="h-4 w-4" /> Calibration Report Card
                    </h3>
                    
                    <div className="p-4 bg-[#050505] border border-white/5 space-y-2.5 text-xs text-white/80">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-white/45 text-[9px] uppercase">Calibration Score</span>
                        <span className="font-bold text-emerald-400">PASSED</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-white/45 text-[9px] uppercase">Smile Response Lag</span>
                        <span className="font-bold">{selectedDriver.smileReflexTime || 240} ms</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-white/45 text-[9px] uppercase">Yawn Aperture Threshold</span>
                        <span className="font-bold">{selectedDriver.maxMouthAperture || 12}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/45 text-[9px] uppercase">Gaze Vector Coherence</span>
                        <span className="font-bold">{selectedDriver.gazeStability || 94}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Fatigue index assessment */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4" /> Fatigue Verdict
                    </h3>
                    
                    <div className="p-4 bg-[#050505] border border-white/5 space-y-3.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white/45 text-[9px] uppercase block">FATIGUE INDEX</span>
                          <span className="text-xl font-bold text-white mt-1 block">
                            {selectedDriver.fatigueIndex}%
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-2.5 py-1 border uppercase ${getStressBadgeColor(selectedDriver.stressLevel)}`}>
                          {selectedDriver.stressLevel}
                        </span>
                      </div>

                      <div className="h-2 bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedDriver.stressLevel === "CRITICAL" ? "bg-red-500" :
                            selectedDriver.stressLevel === "WARNING" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${selectedDriver.fatigueIndex}%` }}
                        />
                      </div>

                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                        {selectedDriver.stressLevel === "CRITICAL" 
                          ? "CRITICAL WARNING: Operator exhibits severe fatigue cues (yawn patterns and unstable eyes). Dispatched rest order recommended."
                          : selectedDriver.stressLevel === "WARNING"
                          ? "ATTENTION: Moderate signs of fatigue detected. Gaze deviates. Monitor closely or advise scheduled break."
                          : "NOMINAL: Operator facial cues align with baseline metrics. Alertness stable."
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Standard static specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
              
              {/* Route Info */}
              <div className="space-y-3 text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">OPERATOR TRANSIT PROTOCOL</h3>
                <div className="p-4 bg-[#050505] border border-white/5 space-y-2.5 text-xs text-white/80">
                  <div>
                    <span className="text-white/45 text-[9px] uppercase block">Assigned Transit Route</span>
                    <span className="font-bold">{selectedDriver.route}</span>
                  </div>
                  <div>
                    <span className="text-white/45 text-[9px] uppercase block">Vehicle Node ID</span>
                    <span className="font-bold">{selectedDriver.vehicleId}</span>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="space-y-3 text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">OPERATIONAL LOG ARCHIVE</h3>
                <div className="p-4 bg-[#050505] border border-white/5 space-y-2 max-h-[110px] overflow-y-auto pr-1">
                  {selectedDriver.statusLog.map((log, lIdx) => (
                    <div key={lIdx} className="text-[10px] text-white/75 border-b border-white/5 pb-1 last:border-b-0 leading-relaxed font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
