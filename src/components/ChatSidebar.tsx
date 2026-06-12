import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Send, Paperclip, MessageSquare, AlertCircle } from "lucide-react";
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
      className="fixed top-16 right-0 bottom-0 w-full sm:w-[340px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-40 flex flex-col font-mono rounded-none"
    >
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#050505]">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-white" />
          <span className="font-bold text-xs uppercase tracking-wider text-white">Operations Feed</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 border border-white/10 text-white/50 hover:text-white hover:border-white transition-colors rounded-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Context Alert (If report selected) */}
      {selectedReport && (
        <div className="bg-[#050505] border border-white/10 p-3 mx-4 mt-4 rounded-none flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-white shrink-0 mt-0.5" />
          <div className="text-[10px] text-white/60 uppercase">
            <span className="font-bold text-white block mb-0.5">Context Active:</span>
            Discussing Report <strong>#{selectedReport.id.substring(0, 8)}</strong>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-none shrink-0 flex items-center justify-center text-[10px] font-bold border ${
              msg.isSelf 
                ? 'bg-white text-black border-white' 
                : 'bg-[#050505] text-white border-white/10'
            }`}>
              {msg.avatar}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} max-w-[75%]`}>
              <div className="flex items-center gap-2 mb-1.5 px-1 text-[9px]">
                <span className="font-bold text-white/60">{msg.sender}</span>
                <span className="text-white/30">{msg.timestamp}</span>
              </div>
              <div className={`p-3 border text-[11px] leading-relaxed rounded-none ${
                msg.isSelf 
                  ? 'bg-white/5 border-white/20 text-white' 
                  : 'bg-[#050505] border-white/10 text-white/80'
              }`}>
                <p className="font-sans">{msg.content}</p>
                
                {/* Linked Report Chip */}
                {msg.linkedReportId && (
                  <div className="mt-2 text-[8px] font-mono p-1 bg-black border border-white/10 flex items-center gap-1.5 opacity-80 uppercase tracking-widest text-white/60">
                    <Paperclip className="h-3 w-3" />
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
      <div className="p-4 border-t border-white/10 bg-[#050505]">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedReport ? "SHARE NOTES ON REPORT..." : "MESSAGE OPERATORS..."}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-none pl-4 pr-16 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
          />
          <div className="absolute right-2 top-2.5 flex items-center">
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-3 py-1 bg-white text-black hover:bg-black hover:text-white border border-white text-[10px] font-bold disabled:opacity-30 transition-all rounded-none uppercase"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
