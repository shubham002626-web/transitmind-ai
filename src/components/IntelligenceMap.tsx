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
      case 'healthy': return 'bg-white border-white';
      case 'warning': return 'bg-[#0a0a0a] border-white/40';
      case 'critical': return 'bg-white border-white animate-pulse';
      default: return 'bg-white/20 border-white/10';
    }
  };

  const getStatusBorder = (status: Location['status']) => {
    switch (status) {
      case 'healthy': return 'border-white/20 text-white';
      case 'warning': return 'border-white/20 text-white/60';
      case 'critical': return 'border-white text-white font-bold';
      default: return 'border-white/10 text-white/40';
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden min-h-[450px] mb-8 rounded-none font-mono">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
        backgroundSize: '20px 20px'
      }} />

      <div className="mb-6 relative z-10 text-left">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Operations Intelligence Map</h2>
        <p className="text-[10px] text-white/50 max-w-lg mt-1 font-sans leading-relaxed">
          Real-time vision monitoring active across global warehouse zones. AI agents analyzing cargo density and structural safety at the node level.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row h-[350px] gap-6 relative z-10">
        
        {/* Map Area */}
        <div className="flex-1 relative bg-[#050505] border border-white/10 rounded-none overflow-hidden group">
          {MOCK_LOCATIONS.map((loc) => (
            <motion.div
              key={loc.id}
              className="absolute"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.3, duration: 0.4 }}
            >
              <button
                onClick={() => setSelectedLocation(loc)}
                className="group/btn relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              >
                {/* Core dot (square) */}
                <div className={`relative w-2.5 h-2.5 rounded-none border transition-transform group-hover/btn:scale-125 ${getStatusColor(loc.status)} z-10 ${
                  selectedLocation?.id === loc.id ? 'border-white ring-2 ring-white/20 scale-110' : ''
                }`}></div>

                {/* Tooltip / Label */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black border border-white/10 px-2.5 py-1 rounded-none text-[8px] font-mono whitespace-nowrap z-20 pointer-events-none text-white shadow-xl">
                  {loc.name.toUpperCase()}
                </div>
              </button>
            </motion.div>
          ))}

          {/* Dotted Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 transition-opacity group-hover:opacity-25">
            <path d="M 68% 48% L 78% 64%" stroke="white" strokeDasharray="3 3" strokeWidth="1" />
            <path d="M 68% 48% L 48% 32%" stroke="white" strokeDasharray="3 3" strokeWidth="1" />
            <path d="M 68% 48% L 25% 35%" stroke="white" strokeDasharray="3 3" strokeWidth="1" />
            <path d="M 68% 48% L 62% 44%" stroke="white" strokeDasharray="3 3" strokeWidth="1" />
          </svg>
        </div>

        {/* Analytics Drill-down Panel */}
        <div className={`w-full lg:w-80 shrink-0 transition-opacity duration-300 h-full ${
          selectedLocation ? 'opacity-100' : 'opacity-40 pointer-events-none'
        }`}>
          {selectedLocation ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full flex flex-col bg-[#050505] border border-white/10 p-5 relative rounded-none text-left"
              >
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 p-1 text-white/50 hover:text-white border border-white/10 hover:border-white rounded-none transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="mb-4 pr-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">{selectedLocation.region}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 border uppercase rounded-none ${getStatusBorder(selectedLocation.status)}`}>
                      {selectedLocation.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-white/60" />
                    {selectedLocation.name}
                  </h3>
                  <span className="text-[8px] text-white/30 mt-1 block truncate">LAST SYNC: {selectedLocation.lastUpdate.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                  <div className="bg-[#0a0a0a] p-3 border border-white/5 text-center rounded-none">
                    <p className="text-[8px] text-white/40 uppercase mb-1 truncate">Health</p>
                    <p className="text-base font-bold text-white leading-none">
                      {selectedLocation.healthScore}%
                    </p>
                  </div>
                  <div className="bg-[#0a0a0a] p-3 border border-white/5 text-center rounded-none">
                    <p className="text-[8px] text-white/40 uppercase mb-1 truncate">Efficiency</p>
                    <p className="text-base font-bold text-white leading-none">
                      {selectedLocation.warehouseEfficiency}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white border-b border-white/5 pb-2 shrink-0">
                    <ShieldAlert className="w-4 h-4 text-white/40" />
                    <span>ALERTS ({selectedLocation.activeIncidents})</span>
                  </div>
                  
                  {selectedLocation.activeIncidents === 0 ? (
                    <div className="text-[10px] text-emerald-400 bg-[#0a0a0a] border border-emerald-500/20 p-3 rounded-none flex items-start gap-2 h-full">
                       <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5"/> 
                       <span className="leading-relaxed font-sans">No critical incidents actively affecting node operations.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-[50px] relative">
                      {Array.from({length: selectedLocation.activeIncidents}).map((_, i) => (
                         <div key={i} className="text-[9px] bg-[#0a0a0a] p-3 border border-white/5 flex flex-col gap-1.5 shrink-0 rounded-none">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate">{i === 0 ? "Corridor Obstruction" : "Stacking Violation"}</span>
                              <span className={`text-[7px] px-1 rounded-none border shrink-0 ${selectedLocation.status === 'critical' ? 'border-red-500/30 text-red-400' : 'border-amber-500/30 text-amber-400'}`}>
                                {selectedLocation.status === 'critical' ? 'HIGH' : 'MEDIUM'}
                              </span>
                            </div>
                            <span className="text-white/50 font-sans line-clamp-2 leading-relaxed">Identified structural load imbalance or path blockage in sector B.</span>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="w-full mt-3 bg-white text-black border border-white hover:bg-black hover:text-white text-[10px] font-bold py-2.5 rounded-none transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                  View Cameras
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-[#050505] border border-white/10 rounded-none p-6 text-center">
              <Activity className="w-8 h-8 text-white/20 mb-4 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Logistics Node Explorer</h3>
              <p className="text-[10px] text-white/40 mt-2 max-w-[200px] font-sans leading-relaxed">
                Select a warehouse pinpoint on the intelligence map to drill down into active safety metrics.
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
