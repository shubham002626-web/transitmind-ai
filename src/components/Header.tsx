/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Brain, Terminal, Server, HelpCircle, LayoutGrid, FileType2, UploadCloud, Home, Sun, Moon, MessageSquare, Lightbulb, Bell, Route } from "lucide-react";

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
    <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 w-full">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          id="tm-logo-container"
          onClick={() => onViewChange("landing")}
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TransitMind <span className="text-cyan-400">AI</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex gap-8">
          <button
            id="nav-btn-landing"
            onClick={() => onViewChange("landing")}
            className={`text-sm font-medium transition-colors py-5 ${
              currentView === "landing"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Landing
          </button>
          
          <button
            id="nav-btn-dashboard"
            onClick={() => onViewChange("dashboard")}
            className={`text-sm font-medium transition-colors py-5 ${
              currentView === "dashboard"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Command Center
          </button>

          <button
            id="nav-btn-analyzer"
            onClick={() => onViewChange("analyzer")}
            className={`text-sm font-medium transition-colors py-5 ${
              currentView === "analyzer"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AI Risk Scanner
          </button>

          <button
            id="nav-btn-reports"
            onClick={() => onViewChange("reports")}
            className={`text-sm font-medium transition-colors py-5 ${
              currentView === "reports"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Audit Vault
          </button>
        </nav>

        {/* Demo Mode Toggle & User Details */}
        <div className="flex items-center gap-4">
          
          {/* Route Finder Toggle */}
          {onToggleRouteFinder && (
            <button
              onClick={onToggleRouteFinder}
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
                isRouteFinderOpen 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-slate-900/90 border-white/[0.05] text-slate-400 hover:text-white'
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
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
                isNotificationSettingsOpen 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-slate-900/90 border-white/[0.05] text-slate-400 hover:text-white'
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
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
                isRecommendationsOpen 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                  : 'bg-slate-900/90 border-white/[0.05] text-amber-500/80 hover:text-amber-400 hover:border-amber-500/30'
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
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
                isChatOpen 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-slate-900/90 border-white/[0.05] text-slate-400 hover:text-white'
              }`}
              title="Toggle Discussion Chat"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-900/90 border border-white/[0.05] text-slate-400 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Simulation Toggle */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 py-1.5 px-3 border border-white/[0.05]">
            <span className="font-mono text-[10px] text-slate-500">ENGINE:</span>
            <button
              id="mock-mode-toggle"
              onClick={onToggleMockMode}
              className={`relative flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-mono tracking-tight transition-all uppercase ${
                mockMode
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              }`}
              title={mockMode ? "Running local high-fidelity mock calculations" : "Connected to Gemini Vision API"}
            >
              <Terminal className="h-3 w-3" />
              <span>{mockMode ? "SIMULATED ACTIVE" : "GEMINI 3.5 AI"}</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="hidden lg:flex items-center gap-4 pl-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Enterprise Node</p>
              <p className="text-sm font-semibold text-slate-200">{userEmail.split("@")[0]}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 p-0.5">
              <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-xs text-white">TM</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile nav indicator bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-white/[0.05] py-2">
        <button
          onClick={() => onViewChange("landing")}
          className={`flex flex-col items-center gap-0.5 text-slate-400 hover:text-white ${currentView === "landing" ? "text-cyan-400" : ""}`}
        >
          <Home className="h-4 w-4" />
          <span className="text-[9px]">Landing</span>
        </button>
        <button
          onClick={() => onViewChange("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-slate-400 hover:text-white ${currentView === "dashboard" ? "text-cyan-400" : ""}`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="text-[9px]">Dashboard</span>
        </button>
        <button
          onClick={() => onViewChange("analyzer")}
          className={`flex flex-col items-center gap-0.5 text-slate-400 hover:text-white ${currentView === "analyzer" ? "text-cyan-400" : ""}`}
        >
          <UploadCloud className="h-4 w-4" />
          <span className="text-[9px]">Scanner</span>
        </button>
        <button
          onClick={() => onViewChange("reports")}
          className={`flex flex-col items-center gap-0.5 text-slate-400 hover:text-white ${currentView === "reports" ? "text-cyan-400" : ""}`}
        >
          <FileType2 className="h-4 w-4" />
          <span className="text-[9px]">Vault</span>
        </button>
      </div>
    </header>
  );
}
