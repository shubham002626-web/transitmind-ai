import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Map as MapIcon, Navigation, Navigation2 } from 'lucide-react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function RouteDisplay({ origin, destination, onRouteFound }: {
  origin: string;
  destination: string;
  onRouteFound: (distance: string, duration: string) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const route = routes[0];
        const newPolylines = route.createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({ strokeColor: '#22d3ee', strokeWeight: 5 });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (route.viewport) map.fitBounds(route.viewport);
        
        const distance = `${(Math.round((route.distanceMeters || 0) / 100) / 10)} km`;
        const duration = `${Math.round((route.durationMillis || 0) / 60000)} mins`;

        onRouteFound(distance, duration);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination, onRouteFound]);

  return null;
}

interface RouteFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RouteFinderModal({ isOpen, onClose }: RouteFinderModalProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [activeOrigin, setActiveOrigin] = useState('');
  const [activeDestination, setActiveDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  if (!isOpen) return null;

  const handleSearch = () => {
    setActiveOrigin(origin);
    setActiveDestination(destination);
    setDistance('');
    setDuration('');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl h-[80vh] bg-slate-900 border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05] bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <MapIcon className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white font-display">Transportation Route Finder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!hasValidKey ? (
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontFamily:'sans-serif', backgroundColor: '#0f172a', color: '#fff'}}>
            <div style={{textAlign:'center', maxWidth:520}}>
              <h2 className="text-2xl font-bold mb-4 font-display">Google Maps API Key Required</h2>
              <p className="mb-2"><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="text-cyan-400 underline">Get an API Key</a></p>
              <p className="mb-2"><strong>Step 2:</strong> Add your key as a secret in AI Studio:</p>
              <ul className="text-left space-y-2 mb-4 ml-8 list-disc text-slate-300">
                <li>Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
                <li>Select <strong>Secrets</strong></li>
                <li>Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
                <li>Paste your API key as the value, press <strong>Enter</strong></li>
              </ul>
              <p className="text-sm text-slate-400">The app rebuilds automatically after you add the secret.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className="w-full md:w-1/3 bg-slate-950/30 p-6 border-r border-white/[0.05] flex flex-col gap-6 shrink-0 z-10 shadow-2xl overflow-y-auto">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4">Route Definition</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Origin Node</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g. Frankfurt Hub"
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Destination Node</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g. Paris Node"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!origin || !destination}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Navigation className="h-4 w-4" /> Calculate Shortest Route
                  </button>
                </div>
              </div>

              {activeOrigin && activeDestination && distance && (
                 <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 mt-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-4">Route Intelligence</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Total Distance</p>
                        <p className="font-display text-2xl font-bold text-white leading-none">{distance}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Estimated Travel Time</p>
                        <p className="font-display text-2xl font-bold text-emerald-400 leading-none">{duration}</p>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                         <div className="flex items-center gap-2 text-xs text-slate-400">
                           <Navigation2 className="h-4 w-4 text-cyan-400" />
                           Optimized for heavy logistics routing.
                         </div>
                      </div>
                    </div>
                 </div>
              )}
            </div>
            
            <div className="flex-1 relative bg-slate-800 min-h-[300px]">
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={{ lat: 51.5, lng: 0.1 }}
                  defaultZoom={5}
                  mapId="LOGISTICS_ROUTE_MAP"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                  disableDefaultUI={true}
                >
                  {activeOrigin && activeDestination && (
                    <RouteDisplay 
                      origin={activeOrigin} 
                      destination={activeDestination} 
                      onRouteFound={(dist, dur) => {
                        setDistance(dist);
                        setDuration(dur);
                      }} 
                    />
                  )}
                </Map>
              </APIProvider>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
