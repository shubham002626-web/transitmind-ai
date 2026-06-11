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
  MapPin, 
  PackageCheck, 
  Power, 
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
      icon: <Eye className="h-6 w-6 text-cyan-400" />,
      title: "Vision-AI Auditing",
      description: "Instantly scan cargo images, warehouse layouts, and flatbed strap strapping using advanced visual segmentation parameters."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-amber-500" />,
      title: "Real-time Risk Prediction",
      description: "Detect buckled packaging base-layers, tilted racks, and fire egress corridor blockages before incidents disrupt the delivery chain."
    },
    {
      icon: <Cpu className="h-6 w-6 text-indigo-400" />,
      title: "Gemini 3.5 Engine",
      description: "Equipped with state-of-the-art server-side vision AI, generating expert corrective actions and immediate, secure compliance audits."
    },
    {
      icon: <PackageCheck className="h-6 w-6 text-emerald-400" />,
      title: "Interactive KPI Center",
      description: "Unified command center monitoring active warehouse efficiency, safety margins, lashing tension, and compliance score metrics."
    },
    {
      icon: <Workflow className="h-6 w-6 text-teal-400" />,
      title: "One-Click PDF Vault",
      description: "Instantly generate enterprise-grade physical safety and warehouse layout compliance certifications to keep crews aligned."
    },
    {
      icon: <Truck className="h-6 w-6 text-blue-400" />,
      title: "Pre-load Quality Controls",
      description: "Verify vehicle axle weights and balanced cargo strapping orientations to comply fully with interstate transport safety."
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
      desc: "Upload yard photographs of pallets, packing containers, or dock aisle views via web browser or portable cameras."
    },
    {
      num: "02",
      title: "AI Visual Inspect",
      desc: "TransitMind visual intelligence extracts structural features, counting irregularities, and measuring spatial distances."
    },
    {
      num: "03",
      title: "Actionable Dashboard",
      desc: "Instantly view risk levels, safety compliance metrics, anomalies detected, and targeted corrective recommendations."
    },
    {
      num: "04",
      title: "Certificate Download",
      desc: "Download signed, highly styled executive PDF reports for supply chain dispatch officers and warehouse handlers."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-200 font-sans">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-900/15 blur-[120px]"></div>
      <div className="absolute top-[400px] right-10 h-[600px] w-[600px] rounded-full bg-indigo-950/20 blur-[150px]"></div>
      <div className="absolute bottom-0 left-5 h-[400px] w-[400px] rounded-full bg-emerald-950/10 blur-[130px]"></div>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ANNUAL HACKATHON DEMO STAGE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.12]"
          >
            AI-Powered Logistics Intelligence for <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">Safer and Smarter</span> Operations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-3xl text-sm sm:text-base text-slate-400 leading-relaxed"
          >
            TransitMind AI helps enterprise logistics teams identify physical transportation hazard profiles, cargo packaging defects, and warehouse spatial blockages before they derail operations. Engineered for DHL, Amazon Logistics, and Delhivery level cargo standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/30"
              id="hero-cta-btn-get-started"
            >
              Enter Command Center
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onExploreAnalyzer}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-300 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white"
              id="hero-cta-btn-try-scanner"
            >
              Analyze Live Image
            </button>
          </motion.div>

          {/* Logistics logos simulation for enterprise feel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.0, delay: 0.6 }}
            className="mt-16 border-t border-white/[0.05] pt-8"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">ENGINEERED FOR MULTI-MODAL GLOBALLY ACTIVE SYSTEMS</p>
            <div className="mt-4 flex flex-wrap justify-center items-center gap-x-12 gap-y-4 font-display font-bold text-slate-600 text-sm tracking-tight">
              <span className="hover:text-slate-500 transition-colors">DE-LIV-ERY</span>
              <span className="hover:text-slate-500 transition-colors">BLUE DART</span>
              <span className="hover:text-slate-500 transition-colors">F E D E X</span>
              <span className="hover:text-slate-500 transition-colors">D H L ENTERPRISE</span>
              <span className="hover:text-slate-500 transition-colors">AMZN LOGISTICS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Statistics */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              className="glass-panel rounded-2xl p-6.5 border border-white/[0.06] text-left"
              id={`benefit-stat-card-${idx}`}
            >
              <div className="font-display text-4xl font-extrabold tracking-tight text-white bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {b.metric}
              </div>
              <div className="mt-2 font-sans text-xs font-semibold text-slate-200">
                {b.label}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-5 text-left">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Next-Generation Visual Safety Audits
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Logistics companies incur massive operational losses every year due to structural container crush, falling flatbed inventory, and disorganized cargo spaces. Manual, human logs are slow and prone to oversight.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              TransitMind AI introduces instant automated safety auditing. Deploying computer vision parameters directly onto incoming container pictures, the engine detects fractures, measures structural tilts, evaluates strap tie-down fatigue, and calculates unified Logistics Health Scores instantly.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-sans text-xs text-slate-200 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">✓</div>
                <span>Automated pallet collapse verification</span>
              </div>
              <div className="flex items-center gap-3 font-sans text-xs text-slate-200 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">✓</div>
                <span>Web-to-Express REST API Architecture ready</span>
              </div>
              <div className="flex items-center gap-3 font-sans text-xs text-slate-200 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">✓</div>
                <span>Server-side API keys completely isolated from client</span>
              </div>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0 lg:col-span-7">
            {/* Visual Glass Box Mock representing Cargo inspection */}
            <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] bg-slate-900/40 relative group overflow-hidden">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-indigo-500/10 opacity-70 blur-md group-hover:opacity-100 transition-opacity"></div>
              <div className="relative rounded-lg bg-slate-950 p-2 overflow-hidden border border-white/[0.05]">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 mb-2 font-mono text-[9px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span>LOGISTICS INTELLIGENCE CAPTURE MODULE #031</span>
                  </div>
                  <span>CALIBRATION: ACTIVE</span>
                </div>
                <div className="relative aspect-video rounded bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                    alt="Inspection UI" 
                    className="object-cover w-full h-full opacity-60"
                  />
                  {/* Neon HUD Box Overlay */}
                  <div className="absolute inset-0 border-2 border-red-500/40 m-6 flex flex-col justify-between p-3">
                    <div className="flex justify-between items-start">
                      <span className="bg-red-500 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        CRUSHMASK #1: BUCKLING DETECTED
                      </span>
                      <span className="font-mono text-[8px] text-red-400 bg-black/60 px-1 py-0.5 rounded">
                        LOCATION: SEC B-4
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[8px] text-white/80 bg-slate-950/80 px-1.5 py-0.5 rounded">
                        STABILITY CAPTURE: 48%
                      </span>
                      <span className="font-mono text-[8px] text-amber-400 bg-black/60 px-1 py-0.5 rounded">
                        SEVERITY: HIGH
                      </span>
                    </div>
                  </div>
                  {/* Scanner line scanning */}
                  <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-md shadow-red-500/50 animate-scan top-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/[0.05]">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Comprehensive Risk Diagnostic Capabilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-400">
            Engineered to process physical images and convert visual features into actionable compliance directives.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="glass-panel rounded-2xl p-6 border border-white/[0.06] hover:border-cyan-500/20 transition-all text-left group"
              id={`feature-grid-item-${i}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] transition-colors group-hover:bg-cyan-950/20 group-hover:border-cyan-500/30">
                {f.icon}
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works layout (Timeline/Process stepper) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/[0.05]">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Smarter Operations in 4 Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-400">
            How our AI system processes logistics risk telemetry from yard upload to dispatch clearance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-4">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className="glass-panel rounded-2xl p-5 border border-white/[0.06] text-left relative"
              id={`step-[${s.num}]`}
            >
              <span className="absolute right-4 top-4 font-display text-3xl font-extrabold text-white/[0.03]">
                {s.num}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-mono text-xs font-bold">
                {s.num}
              </div>
              <h3 className="mt-4 font-display text-xs font-bold text-white tracking-wide uppercase">
                {s.title}
              </h3>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action section */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 px-6 py-12 text-center border border-cyan-500/20 shadow-2xl">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-xl"></div>
          
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to secure your Logistics Chain?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-slate-400">
            Differentiate your operations tonight. Enter our glassmorphic Command Center console to run a real-time risk diagnostic or submit sample images.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="rounded-lg bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-shadow"
              id="cta-active-command-button"
            >
              Launch Command Center
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-slate-950 py-10 text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-500" />
            <span className="text-slate-400 font-semibold font-display">TransitMind AI</span>
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
