import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Mail, AlertTriangle, ShieldAlert, Check } from "lucide-react";
import { NotificationService, NotificationPreferences } from "../services/notificationService";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export default function NotificationSettingsModal({ isOpen, onClose, onShowToast }: NotificationSettingsModalProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailAlertsHigh: false,
    emailAlertsCritical: true,
    dailyDigest: true,
    inAppNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      NotificationService.getPreferences().then(prefs => {
        setPreferences(prefs);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await NotificationService.updatePreferences(preferences);
    setIsSaving(false);
    onShowToast("Notification preferences updated.");
    onClose();
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
        className="relative w-full max-w-md bg-slate-900 border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05] bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white font-display">Notification Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Email Alerts</h3>
                
                {/* Critical Risk Alert */}
                <div className="flex items-start justify-between bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <div className="flex gap-3">
                    <ShieldAlert className="h-4 w-4 text-red-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-slate-200 leading-none">Critical Risk Detections</div>
                      <div className="text-xs text-slate-400 mt-1.5">Immediate email notification when a critical safety or logistics anomaly is found.</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailAlertsCritical')}
                    className={`shrink-0 w-10 h-5 rounded-full transition-colors relative ${preferences.emailAlertsCritical ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailAlertsCritical ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* High Risk Alert */}
                <div className="flex items-start justify-between bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-slate-200 leading-none">High Risk Detections</div>
                      <div className="text-xs text-slate-400 mt-1.5">Email alerts for systemic issues flagged as high risk.</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailAlertsHigh')}
                    className={`shrink-0 w-10 h-5 rounded-full transition-colors relative ${preferences.emailAlertsHigh ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailAlertsHigh ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">General</h3>
                
                {/* Daily Digest */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Daily Operations Digest</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('dailyDigest')}
                    className={`w-9 h-4.5 rounded-full transition-colors relative ${preferences.dailyDigest ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${preferences.dailyDigest ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* In-App Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">In-App Event Toasts</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('inAppNotifications')}
                    className={`w-9 h-4.5 rounded-full transition-colors relative ${preferences.inAppNotifications ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${preferences.inAppNotifications ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/[0.05] bg-slate-950/40 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-bold flex items-center gap-2 hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}
