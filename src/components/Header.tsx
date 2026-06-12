/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal, LayoutGrid, FileType2, UploadCloud, Home, MessageSquare, Lightbulb, Bell, Route, Sun, Moon, Activity } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  mockMode: boolean;
  onToggleMockMode: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isChatOpen?: boolean;
  onToggleChat?: () => void;
  isRecommendationsOpen?: boolean;
  onToggleRecommendations?: () => void;
  isNotificationSettingsOpen?: boolean;
  onToggleNotificationSettings?: () => void;
  isRouteFinderOpen?: boolean;
  onToggleRouteFinder?: () => void;
  userEmail?: string;
}

export default function Header({
  currentView,
  onViewChange,
  mockMode,
  onToggleMockMode,
  theme,
  onToggleTheme,
  isChatOpen,
  onToggleChat,
  isRecommendationsOpen,
  onToggleRecommendations,
  isNotificationSettingsOpen,
  onToggleNotificationSettings,
  isRouteFinderOpen,
  onToggleRouteFinder,
  userEmail = "demo.logistics@transitmind.ai"
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 w-full rounded-none">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center gap-3 transition-colors hover:text-white/80"
          id="tm-logo-container"
          onClick={() => onViewChange("landing")}
        >
          <div className="flex h-7 w-7 items-center justify-center border border-white bg-white text-black font-mono font-bold text-sm rounded-none">
            T
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase font-mono text-white">
              TransitMind
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-1 overflow-x-auto whitespace-nowrap mx-2 md:mx-6 px-2 gap-4 md:gap-6 font-mono text-[11px] uppercase tracking-widest [&>button]:shrink-0">
          <button
            id="nav-btn-landing"
            onClick={() => onViewChange("landing")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "landing"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            LANDING
          </button>
          
          <button
            id="nav-btn-dashboard"
            onClick={() => onViewChange("dashboard")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "dashboard"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            COMMAND CENTER
          </button>

          <button
            id="nav-btn-analyzer"
            onClick={() => onViewChange("analyzer")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "analyzer"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            AI RISK SCANNER
          </button>

          <button
            id="nav-btn-reports"
            onClick={() => onViewChange("reports")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "reports"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            AUDIT VAULT
          </button>

          <button
            id="nav-btn-projects"
            onClick={() => onViewChange("projects")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "projects"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            BENTO PROJECTS
          </button>

          <button
            id="nav-btn-stress"
            onClick={() => onViewChange("stress")}
            className={`transition-all py-5 border-b-2 hover:text-white ${
              currentView === "stress"
                ? "text-white border-white font-bold"
                : "text-white/40 border-transparent hover:border-white/20"
            }`}
          >
            BIOMETRICS
          </button>
        </nav>

        {/* Action Toggles & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Route Finder Toggle */}
          {onToggleRouteFinder && (
            <button
              onClick={onToggleRouteFinder}
              className={`flex items-center justify-center h-8 w-8 border transition-all rounded-none ${
                isRouteFinderOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
              title="Route Finder"
            >
              <Route className="h-4 w-4" />
            </button>
          )}

          {/* Notification Settings Toggle */}
          {onToggleNotificationSettings && (
            <button
              onClick={onToggleNotificationSettings}
              className={`flex items-center justify-center h-8 w-8 border transition-all rounded-none ${
                isNotificationSettingsOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
              title="Notification Settings"
            >
              <Bell className="h-4 w-4" />
            </button>
          )}

          {/* Smart Recommendations Toggle */}
          {onToggleRecommendations && (
            <button
              onClick={onToggleRecommendations}
              className={`flex items-center justify-center h-8 w-8 border transition-all rounded-none ${
                isRecommendationsOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
              title="Smart Recommendations"
            >
              <Lightbulb className="h-4 w-4" />
            </button>
          )}

          {/* Chat Toggle */}
          {onToggleChat && (
            <button
              onClick={onToggleChat}
              className={`flex items-center justify-center h-8 w-8 border transition-all rounded-none ${
                isChatOpen 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#050505] border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
              title="Toggle Discussion Chat"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center h-8 w-8 border border-white/10 bg-[#050505] text-white/50 hover:text-white hover:border-white/30 rounded-none transition-all"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Simulation Toggle */}
          <div className="flex items-center gap-2 bg-[#050505] py-1 px-3 border border-white/10 rounded-none">
            <span className="font-mono text-[9px] text-white/45">SYS:</span>
            <button
              id="mock-mode-toggle"
              onClick={onToggleMockMode}
              className={`flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono tracking-tight transition-all uppercase rounded-none border ${
                mockMode
                  ? "bg-white/5 text-white/60 border-white/15"
                  : "bg-white text-black border-white"
              }`}
              title={mockMode ? "Running local high-fidelity mock calculations" : "Connected to Gemini Vision API"}
            >
              <Terminal className="h-3 w-3" />
              <span>{mockMode ? "MOCK" : "GEMINI"}</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="text-right font-mono">
              <p className="text-[8px] text-white/40 uppercase">ENTERPRISE NODE</p>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{userEmail.split("@")[0]}</p>
            </div>
            <div className="w-8 h-8 border border-white/20 bg-white/5 text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-none">
              TM
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile nav indicator bar */}
      <div className="md:hidden flex items-center justify-around bg-black border-t border-white/10 py-2 fixed bottom-0 left-0 right-0 z-50">
        <button
          onClick={() => onViewChange("landing")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "landing" ? "text-white" : ""}`}
        >
          <Home className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Landing</span>
        </button>
        <button
          onClick={() => onViewChange("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "dashboard" ? "text-white" : ""}`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Console</span>
        </button>
        <button
          onClick={() => onViewChange("analyzer")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "analyzer" ? "text-white" : ""}`}
        >
          <UploadCloud className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Scanner</span>
        </button>
        <button
          onClick={() => onViewChange("reports")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "reports" ? "text-white" : ""}`}
        >
          <FileType2 className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Vault</span>
        </button>
        <button
          onClick={() => onViewChange("projects")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "projects" ? "text-white" : ""}`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Projects</span>
        </button>
        <button
          onClick={() => onViewChange("stress")}
          className={`flex flex-col items-center gap-0.5 text-white/40 hover:text-white ${currentView === "stress" ? "text-white" : ""}`}
        >
          <Activity className="h-4 w-4" />
          <span className="text-[8px] font-mono uppercase">Biometrics</span>
        </button>
      </div>
    </header>
  );
}
