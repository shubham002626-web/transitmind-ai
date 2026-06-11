/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Activity, ShieldAlert, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  status: 'healthy' | 'warning' | 'critical';
  healthScore: number;
  warehouseEfficiency: number;
  activeIncidents: number;
  lastUpdate: string;
  region: string;
}

const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Mumbai-Sector-4', region: 'South Asia', x: 68, y: 48, status: 'warning', healthScore: 78, warehouseEfficiency: 70, activeIncidents: 2, lastUpdate: '2 mins ago' },
  { id: 'loc-2', name: 'Delhi NCR Hub', region: 'South Asia', x: 69, y: 38, status: 'healthy', healthScore: 92, warehouseEfficiency: 95, activeIncidents: 0, lastUpdate: 'Just now' },
  { id: 'loc-3', name: 'Pune South', region: 'South Asia', x: 67, y: 52, status: 'healthy', healthScore: 94, warehouseEfficiency: 96, activeIncidents: 0, lastUpdate: '5 mins ago' },
  { id: 'loc-4', name: 'Bangalore Core', region: 'South Asia', x: 70, y: 58, status: 'critical', healthScore: 54, warehouseEfficiency: 45, activeIncidents: 4, lastUpdate: '1 min ago' },
  { id: 'loc-5', name: 'Chennai Port', region: 'South Asia', x: 72, y: 62, status: 'healthy', healthScore: 88, warehouseEfficiency: 85, activeIncidents: 1, lastUpdate: '10 mins ago' },
  { id: 'loc-6', name: 'Frankfurt Hub', region: 'Europe', x: 48, y: 32, status: 'warning', healthScore: 81, warehouseEfficiency: 80, activeIncidents: 1, lastUpdate: '15 mins ago' },
  { id: 'loc-7', name: 'Singapore Node', region: 'Southeast Asia', x: 78, y: 64, status: 'healthy', healthScore: 95, warehouseEfficiency: 98, activeIncidents: 0, lastUpdate: 'Just now' },
  { id: 'loc-8', name: 'New York Transit', region: 'North America', x: 25, y: 35, status: 'healthy', healthScore: 90, warehouseEfficiency: 92, activeIncidents: 0, lastUpdate: '4 mins ago' },
  { id: 'loc-9', name: 'Dubai Central', region: 'Middle East', x: 62, y: 44, status: 'warning', healthScore: 75, warehouseEfficiency: 72, activeIncidents: 3, lastUpdate: '1 min ago' },
  { id: 'loc-10', name: 'Tokyo Base', region: 'East Asia', x: 85, y: 35, status: 'healthy', healthScore: 98, warehouseEfficiency: 99, activeIncidents: 0, lastUpdate: '12 mins ago' },
];

export default function IntelligenceMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getStatusColor = (status: Location['status']) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'warning': return 'bg-amber-500 shadow-amber-500/50';
      case 'critical': return 'bg-rose-500 shadow-rose-500/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
    }
  };

  const getStatusBorder = (status: Location['status']) => {
    switch (status) {
      case 'healthy': return 'border-emerald-500/30 text-emerald-400';
      case 'warning': return 'border-amber-500/30 text-amber-400';
      case 'critical': return 'border-rose-500/30 text-rose-400';
      default: return 'border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[450px] mb-8 bg-gradient-to-b from-slate-950 to-slate-900/40">
      
      {/* Background Grid & Stylings */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50 pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-bold font-display text-white">Operations Intelligence Map</h2>
        <p className="text-sm text-slate-400 max-w-lg mt-1">Real-time vision monitoring active across global warehouse zones. AI agents analyzing cargo density and structural safety at the node level.</p>
      </div>

      <div className="flex flex-col lg:flex-row h-[350px] gap-6 relative z-10">
        
        {/* Map Area */}
        <div className="flex-1 relative bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl group">
          {MOCK_LOCATIONS.map((loc) => (
            <motion.div
              key={loc.id}
              className="absolute"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.5, duration: 0.5 }}
            >
              <button
                onClick={() => setSelectedLocation(loc)}
                className="group/btn relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              >
                {/* Ping animation for issues */}
                {loc.status !== 'healthy' && (
                   <span className={`absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping ${
                     loc.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                   }`}></span>
                )}
                
                {/* Core dot */}
                <div className={`relative w-3 h-3 rounded-full border border-white/20 shadow-lg transition-transform group-hover/btn:scale-150 ${getStatusColor(loc.status)} z-10 ${
                  selectedLocation?.id === loc.id ? 'ring-4 ring-white/20 scale-125' : ''
                }`}></div>

                {/* Tooltip / Label */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-slate-900 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap z-20 pointer-events-none text-slate-300 shadow-xl">
                  {loc.name}
                </div>
              </button>
            </motion.div>
          ))}

          {/* Dotted Connection Lines (Decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 transition-opacity group-hover:opacity-40">
            <path d="M 68% 48% L 78% 64%" stroke="cyan" strokeDasharray="4 4" strokeWidth="1" />
            <path d="M 68% 48% L 48% 32%" stroke="cyan" strokeDasharray="4 4" strokeWidth="1" />
            <path d="M 68% 48% L 25% 35%" stroke="cyan" strokeDasharray="4 4" strokeWidth="1" />
            <path d="M 68% 48% L 62% 44%" stroke="cyan" strokeDasharray="4 4" strokeWidth="1" />
          </svg>
        </div>

        {/* Analytics Drill-down Panel */}
        <div className={`w-full lg:w-80 shrink-0 transition-opacity duration-300 h-full ${
          selectedLocation ? 'opacity-100' : 'opacity-50 pointer-events-none'
        }`}>
          {selectedLocation ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col bg-slate-900/60 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative"
              >
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white bg-white/5 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mb-4 pr-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{selectedLocation.region}</span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${getStatusBorder(selectedLocation.status)} bg-white/5`}>
                      {selectedLocation.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 line-clamp-1">
                    <MapPin className="w-4 h-4 shrink-0 text-cyan-400" />
                    {selectedLocation.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block truncate">LAST SYNC: {selectedLocation.lastUpdate.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                  <div className="bg-slate-800/40 p-2.5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-medium mb-1 truncate">Health</p>
                    <p className={`text-lg font-bold font-display leading-none ${selectedLocation.healthScore >= 90 ? 'text-emerald-400' : selectedLocation.healthScore >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {selectedLocation.healthScore}%
                    </p>
                  </div>
                  <div className="bg-slate-800/40 p-2.5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-medium mb-1 truncate">Efficiency</p>
                    <p className={`text-lg font-bold font-display leading-none ${selectedLocation.warehouseEfficiency >= 90 ? 'text-emerald-400' : selectedLocation.warehouseEfficiency >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {selectedLocation.warehouseEfficiency}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-white border-b border-white/5 pb-2 shrink-0">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    Alerts ({selectedLocation.activeIncidents})
                  </div>
                  
                  {selectedLocation.activeIncidents === 0 ? (
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-start gap-2 h-full">
                       <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5"/> 
                       <span className="leading-relaxed">No critical incidents actively affecting node operations.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-[50px] relative">
                      {Array.from({length: selectedLocation.activeIncidents}).map((_, i) => (
                         <div key={i} className="text-[10px] bg-slate-800/60 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1.5 shrink-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate">{i === 0 ? "Corridor Obstruction" : "Stacking Violation"}</span>
                              <span className={`text-[8px] font-mono px-1 rounded shrink-0 ${selectedLocation.status === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {selectedLocation.status === 'critical' ? 'HIGH' : 'MEDIUM'}
                              </span>
                            </div>
                            <span className="text-slate-400 line-clamp-2">Identified structural load imbalance or path blockage in sector B.</span>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="w-full mt-3 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  View Security Cameras
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-900/60 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-xl">
              <Activity className="w-10 h-10 text-slate-600 mb-4 animate-[pulse_3s_ease-in-out_infinite]" />
              <h3 className="text-sm font-bold text-white font-display">Logistics Node Explorer</h3>
              <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">
                Select a warehouse pinpoint on the intelligence map to drill down into active safety metrics.
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
