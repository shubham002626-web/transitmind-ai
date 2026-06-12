/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Building2, 
  ChevronRight, 
  Cpu, 
  Eye, 
  PackageCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  Workflow 
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreAnalyzer: () => void;
}

export default function LandingPage({ onGetStarted, onExploreAnalyzer }: LandingPageProps) {
  
  const features = [
    {
      icon: <Eye className="h-5 w-5 text-white" />,
      title: "Vision-AI Auditing",
      description: "Instantly scan cargo images, warehouse layouts, and flatbed strap strapping using advanced visual segmentation parameters.",
      size: "col-span-1 md:col-span-2"
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-white/80" />,
      title: "Real-time Risk Prediction",
      description: "Detect buckled packaging base-layers, tilted racks, and fire egress corridor blockages.",
      size: "col-span-1"
    },
    {
      icon: <Cpu className="h-5 w-5 text-white" />,
      title: "Gemini 3.5 Engine",
      description: "Equipped with state-of-the-art server-side vision AI, generating expert corrective actions and immediate, secure compliance audits.",
      size: "col-span-1"
    },
    {
      icon: <PackageCheck className="h-5 w-5 text-white" />,
      title: "Interactive KPI Center",
      description: "Unified command center monitoring active warehouse efficiency, safety margins, lashing tension, and compliance score metrics.",
      size: "col-span-1 md:col-span-2"
    },
    {
      icon: <Workflow className="h-5 w-5 text-white/80" />,
      title: "One-Click PDF Vault",
      description: "Instantly generate enterprise-grade physical safety and warehouse layout compliance certifications to keep crews aligned.",
      size: "col-span-1 md:col-span-2"
    },
    {
      icon: <Truck className="h-5 w-5 text-white" />,
      title: "Pre-load Quality Controls",
      description: "Verify vehicle axle weights and balanced cargo strapping orientations to comply fully with interstate transport safety.",
      size: "col-span-1"
    }
  ];

  const benefits = [
    {
      metric: "94%",
      label: "Reduction in Incident Claims",
      detail: "Avoid damages through automated visual checks before trailers roll out."
    },
    {
      metric: "3.8x",
      label: "Faster Quality Control Cycles",
      detail: "Cut manual yard checking time down to a 3-second visual scanner trigger."
    },
    {
      metric: "100%",
      label: "Digital Compliance Trace",
      detail: "All inspection snapshots compile down into persistent, audit-ready PDF archives."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Snapshot Upload",
      desc: "Upload yard photographs of pallets, packing containers, or dock aisle views via web browser."
    },
    {
      num: "02",
      title: "AI Visual Inspect",
      desc: "TransitMind visual intelligence extracts structural features, counting irregularities."
    },
    {
      num: "03",
      title: "Actionable Dashboard",
      desc: "Instantly view risk levels, safety compliance metrics, anomalies detected, and recommendations."
    },
    {
      num: "04",
      title: "Certificate Download",
      desc: "Download signed, highly styled executive PDF reports for supply chain dispatch officers."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-[#050505] text-[#FAFAFA] font-sans">
      
      {/* Structural Wireframe Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-20" />

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 max-w-7xl mx-auto border-b border-white/10">
        <div className="text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 text-xs font-mono tracking-widest text-white uppercase rounded-none"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ANNUAL HACKATHON CORE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Logistics <br />
            Intelligence Matrix
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-7 text-sm sm:text-base text-white/60 leading-relaxed font-normal"
            >
              TransitMind AI helps enterprise logistics teams identify physical transportation hazard profiles, cargo packaging defects, and warehouse spatial blockages before they derail operations. Engineered to match global container safety standards.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-5 flex flex-col sm:flex-row gap-3 items-start md:justify-end"
            >
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-mono text-xs font-bold py-4 px-8 hover:bg-white/90 active:bg-white/80 transition-all rounded-none border border-white uppercase tracking-widest"
                id="hero-cta-btn-get-started"
              >
                Launch Console
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onExploreAnalyzer}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0c0c0c] text-white font-mono text-xs font-semibold py-4 px-8 border border-white/10 hover:border-white transition-all rounded-none uppercase tracking-widest"
                id="hero-cta-btn-try-scanner"
              >
                Scan Telemetry
              </button>
            </motion.div>
          </div>

          {/* Logistics logos simulation for enterprise feel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-12 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">ENGINEERED FOR MULTI-MODAL FREIGHT NETWORKS</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[10px] text-white/50">
              <span>DE-LIV-ERY</span>
              <span>BLUE DART</span>
              <span>F E D E X</span>
              <span>D H L ENTERPRISE</span>
              <span>AMZN LOGISTICS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Statistics */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              className="bg-[#0a0a0a] border border-white/10 p-8 text-left rounded-none relative group"
              id={`benefit-stat-card-${idx}`}
            >
              <div className="absolute top-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300" />
              <div className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
                {b.metric}
              </div>
              <div className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-white">
                {b.label}
              </div>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase leading-none">
              Visual Safety Audits
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
              Logistics companies incur massive operational losses every year due to structural container crush, falling flatbed inventory, and disorganized cargo spaces. Manual checking is slow and prone to oversight.
            </p>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
              TransitMind AI introduces instant automated safety auditing. Deploying computer vision parameters directly onto incoming container pictures, the engine detects fractures, measures structural tilts, evaluates strap tie-down fatigue, and calculates compliance scores instantly.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 font-mono text-xs text-white/80">
                <div className="flex h-5 w-5 items-center justify-center border border-white/20 bg-white/5 font-mono text-[9px]">✓</div>
                <span>AUTOMATED PALLET COLLAPSE DETECTION</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-white/80">
                <div className="flex h-5 w-5 items-center justify-center border border-white/20 bg-white/5 font-mono text-[9px]">✓</div>
                <span>EXPRESS REST API INTEGRITY LAYER</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-white/80">
                <div className="flex h-5 w-5 items-center justify-center border border-white/20 bg-white/5 font-mono text-[9px]">✓</div>
                <span>SERVER-SIDE ISOLATED ENVIRONMENT</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            {/* Visual HUD Container (Strict border, zero rounded) */}
            <div className="bg-[#0a0a0a] p-4 border border-white/10 relative group overflow-hidden">
              <div className="relative bg-black p-2 border border-white/5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 font-mono text-[9px] text-white/40">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-red-500 animate-pulse"></span>
                    <span>LOGISTICS INTELLIGENCE CAPTURE MODULE #031</span>
                  </div>
                  <span>CALIBRATION: ACTIVE</span>
                </div>
                <div className="relative aspect-video flex items-center justify-center overflow-hidden bg-zinc-950">
                  <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                    alt="Inspection UI" 
                    className="object-cover w-full h-full opacity-40 grayscale"
                  />
                  {/* Neon HUD Box Overlay */}
                  <div className="absolute inset-0 border border-white/30 m-6 flex flex-col justify-between p-3">
                    <div className="flex justify-between items-start">
                      <span className="bg-white text-black font-mono text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        CRUSHMASK #1: BUCKLING DETECTED
                      </span>
                      <span className="font-mono text-[8px] text-white bg-black/60 px-1 py-0.5 border border-white/10">
                        LOCATION: SEC B-4
                      </span>
                    </div>
                    <div className="flex justify-between items-end font-mono text-[8px]">
                      <span className="text-white/80 bg-[#0a0a0a] px-1.5 py-0.5 border border-white/5">
                        STABILITY CAPTURE: 48%
                      </span>
                      <span className="text-white bg-red-950/80 border border-red-500/30 px-1 py-0.5">
                        SEVERITY: HIGH
                      </span>
                    </div>
                  </div>
                  {/* Scanner line scanning */}
                  <div className="absolute left-0 right-0 h-[1px] bg-white shadow-md shadow-white/50 animate-scan top-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/10">
        <div className="text-left space-y-4">
          <span className="font-mono text-xs text-white/40 tracking-widest uppercase block">
            TECHNICAL DIRECTIVES
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase leading-none">
            Risk Diagnostic Capabilities
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div 
              key={i} 
              className={`${f.size} bg-[#0a0a0a] border border-white/10 p-8 transition-all hover:bg-[#121212] hover:border-white/20 text-left relative group`}
              id={`feature-grid-item-${i}`}
            >
              <div className="absolute top-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300" />
              <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5">
                {f.icon}
              </div>
              <h3 className="mt-6 font-mono text-xs font-bold text-white uppercase tracking-wider">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed font-normal">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works layout (Timeline/Process stepper) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/10">
        <div className="text-left space-y-4">
          <span className="font-mono text-xs text-white/40 tracking-widest uppercase block">
            INTEGRITY SYSTEM MANUAL
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase leading-none">
            Pipeline Steps
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-[#0a0a0a] border border-white/10 p-6 text-left relative group"
              id={`step-[${s.num}]`}
            >
              <div className="absolute top-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300" />
              <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 font-mono text-xs font-bold text-white">
                {s.num}
              </div>
              <h3 className="mt-6 font-mono text-xs font-bold text-white tracking-wider uppercase">
                {s.title}
              </h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-[#0a0a0a] p-12 text-left border border-white/10 relative group overflow-hidden">
          <div className="absolute top-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300" />
          <h2 className="text-3xl font-black text-white uppercase leading-none">
            Secure Logistics Operations
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/60 max-w-xl leading-relaxed">
            Differentiate your operations tonight. Enter our Command Center console to run a real-time risk diagnostic or submit sample images.
          </p>
          <div className="mt-8">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-white text-black font-mono text-xs font-bold py-4 px-8 hover:bg-white/90 transition-all rounded-none uppercase tracking-widest border border-white"
              id="cta-active-command-button"
            >
              Launch Command Center
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-white" />
            <span className="text-white font-semibold">TransitMind AI</span>
            <span>© 2026. Global Logistics Compliance Framework.</span>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Security Rules</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Interstate Freights</a>
            <span>•</span>
            <a href="#about" className="hover:text-white transition-colors">Enterprise API Reference</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
