import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Bell, Mail, AlertTriangle, ShieldAlert, Check, CheckSquare, Square } from "lucide-react";
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
    onShowToast("NOTIFICATION PREFERENCES UPDATED.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-mono">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-none bg-white/5 border border-white/10 text-white">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Notification Ledger Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 text-white/50 hover:text-white hover:border-white transition-colors rounded-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-left">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-none"></div>
            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Email Alerts</h3>
                
                {/* Critical Risk Alert */}
                <div className="flex items-start justify-between bg-[#050505] border border-white/5 p-4 rounded-none">
                  <div className="flex gap-3">
                    <ShieldAlert className="h-4 w-4 text-white/60 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider leading-none">Critical Risk Detections</div>
                      <p className="text-[10px] text-white/40 mt-2 font-sans leading-relaxed">Immediate email notification when a critical safety or logistics anomaly is found.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailAlertsCritical')}
                    className="shrink-0 text-white/40 hover:text-white transition-colors ml-2"
                  >
                    {preferences.emailAlertsCritical ? (
                      <CheckSquare className="h-5 w-5 text-white" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* High Risk Alert */}
                <div className="flex items-start justify-between bg-[#050505] border border-white/5 p-4 rounded-none">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-white/60 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider leading-none">High Risk Detections</div>
                      <p className="text-[10px] text-white/40 mt-2 font-sans leading-relaxed">Email alerts for systemic issues flagged as high risk.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailAlertsHigh')}
                    className="shrink-0 text-white/40 hover:text-white transition-colors ml-2"
                  >
                    {preferences.emailAlertsHigh ? (
                      <CheckSquare className="h-5 w-5 text-white" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">General</h3>
                
                {/* Daily Digest */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/80 uppercase">Daily Operations Digest</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('dailyDigest')}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {preferences.dailyDigest ? (
                      <CheckSquare className="h-5 w-5 text-white" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* In-App Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/80 uppercase">In-App Event Toasts</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('inAppNotifications')}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {preferences.inAppNotifications ? (
                      <CheckSquare className="h-5 w-5 text-white" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#050505] flex justify-end gap-3 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 text-xs font-bold text-white hover:border-white transition-colors rounded-none uppercase"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-5 py-2 bg-white text-black border border-white text-xs font-bold flex items-center gap-2 hover:bg-black hover:text-white transition-colors rounded-none uppercase"
          >
            {isSaving ? (
              <div className="h-3.5 w-3.5 border-2 border-black border-t-transparent animate-spin rounded-none"></div>
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
