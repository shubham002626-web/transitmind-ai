import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Send, Paperclip, MoreHorizontal, MessageSquare, AlertCircle } from "lucide-react";
import { Report } from "../types";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: Report | null;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
  linkedReportId?: string;
}

export default function ChatSidebar({ isOpen, onClose, selectedReport }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "S. Martinez",
      avatar: "SM",
      content: "All yard teams note: we're seeing an increase in unattended pallets in Zone B. Please ensure to clear loading docks immediately after transfer.",
      timestamp: "08:14",
      isSelf: false
    },
    {
      id: "2",
      sender: "System Bot",
      avatar: "AI",
      content: "Automated scan completed on South Terminal. Health score dropped by 4%.",
      timestamp: "08:20",
      isSelf: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      avatar: "ME",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      linkedReportId: selectedReport?.id
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-16 right-0 bottom-0 w-full sm:w-[340px] bg-slate-900 border-l border-white/[0.05] shadow-2xl z-40 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="h-14 border-b border-white/[0.05] flex items-center justify-between px-4 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-100">Operations Feed</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Context Alert (If report selected) */}
      {selectedReport && (
        <div className="bg-cyan-950/30 border-b border-cyan-500/20 p-3 mx-4 mt-4 rounded-lg flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-cyan-400 block mb-0.5">Context Active:</span>
            Discussing Report <strong>#{selectedReport.id.substring(0, 6)}</strong>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
              msg.isSelf 
                ? 'bg-cyan-600 text-white' 
                : msg.avatar === 'AI' 
                  ? 'bg-slate-800 text-cyan-400 ring-1 ring-cyan-500/30' 
                  : 'bg-slate-800 text-slate-300'
            }`}>
              {msg.avatar}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} max-w-[75%]`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-medium text-slate-400">{msg.sender}</span>
                <span className="text-[9px] text-slate-600">{msg.timestamp}</span>
              </div>
              <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.isSelf 
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-50 rounded-tr-sm' 
                  : 'bg-slate-800 border border-white/[0.02] text-slate-200 rounded-tl-sm'
              }`}>
                {msg.content}
                
                {/* Linked Report Chip */}
                {msg.linkedReportId && (
                  <div className="mt-2 text-[9px] font-mono p-1.5 rounded bg-black/30 border border-white/5 flex items-center gap-1.5 opacity-80">
                    <Paperclip className="h-3 w-3 text-cyan-400" />
                    <span>REF: {msg.linkedReportId.substring(0, 8)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/[0.05] bg-slate-950/50">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedReport ? "Share notes on this report..." : "Message operators..."}
            className="w-full bg-slate-900 border border-white/[0.1] rounded-xl pl-4 pr-20 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
          />
          <div className="absolute right-2 top-1.5 flex items-center">
            <button
              type="button"
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-1.5 ml-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg disabled:opacity-50 disabled:hover:bg-cyan-500 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
