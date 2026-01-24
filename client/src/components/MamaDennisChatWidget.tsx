import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Home, Wrench, Shield, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mama";
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: string;
}

export default function MamaDennisChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [, setLocation] = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Habari! 👋 I'm Mama Dennis, your AI guardian for rent, services & trust.\n\nI can help you:",
      sender: "mama",
      timestamp: new Date(),
      quickActions: [
        { label: "Find Property 🏠", action: "property", icon: "home" },
        { label: "Hire Fundi 🔧", action: "fundi", icon: "wrench" },
        { label: "Get Verified 🛡️", action: "trust", icon: "shield" },
        { label: "Book Stay 🏨", action: "short-stay", icon: "hotel" },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Persist session ID across all messages
  const [sessionId] = useState(() => `web-${Date.now()}`);
  
  // Setup mutation hook
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Auto-open chat after 10 seconds on homepage
  useEffect(() => {
    if (!hasAutoOpened && window.location.pathname === "/") {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "property":
        message = "I'm looking for a property to rent";
        break;
      case "fundi":
        message = "I need to hire a fundi";
        break;
      case "trust":
        message = "Tell me about CONEKTA Trust verification";
        break;
      case "short-stay":
        message = "I want to book a short-stay";
        break;
      default:
        message = action;
    }
    setInputMessage(message);
    handleSendMessage(message);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Call Mama Dennis via tRPC
    try {
      const data = await sendMessageMutation.mutateAsync({
        message: messageToSend,
        session_id: sessionId,
      });
      
      const mamaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I'm having trouble connecting. Please try again!",
        sender: "mama",
        timestamp: new Date(),
        quickActions: getSuggestedActions(data.response || ""),
      };
      setMessages((prev) => [...prev, mamaResponse]);
    } catch (error) {
      console.error('Mama Dennis API error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try WhatsApp at +254 797 446 155!",
        sender: "mama",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Smart suggestions based on conversation context
  const getSuggestedActions = (response: string): QuickAction[] | undefined => {
    const lower = response.toLowerCase();
    
    if (lower.includes("property") || lower.includes("rent")) {
      return [
        { label: "View Properties", action: "Show me available properties" },
        { label: "My Budget", action: "What's my budget range?" },
      ];
    }
    
    if (lower.includes("fundi") || lower.includes("service")) {
      return [
        { label: "Browse Fundis", action: "Show me available fundis" },
        { label: "Service Needed", action: "What service do you need?" },
      ];
    }
    
    if (lower.includes("trust") || lower.includes("verify") || lower.includes("ubaru")) {
      return [
        { label: "Get Verified", action: "How do I get CONEKTA Trust verified?" },
        { label: "Learn More", action: "Tell me more about CONEKTA Trust" },
      ];
    }
    
    return undefined;
  };

  return (
    <>
      {/* Chat Button with Pulse Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Chat with Mama Dennis"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-96 h-[500px] max-h-[75vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              👩🏾
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base truncate">Mama Dennis AI</h3>
              <p className="text-xs text-teal-100">Your Digital Guardian • Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 ${
                      message.sender === "user"
                        ? "bg-teal-500 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 rounded-bl-none"
                    }`}
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                {message.quickActions && message.sender === "mama" && (
                  <div className="flex flex-wrap gap-2 justify-start pl-2">
                    {message.quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action.action)}
                        className="bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Mama Dennis is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 px-4 py-2"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-teal-500 hover:bg-teal-600 text-white"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Powered by Mama Dennis AI • <a href="https://wa.me/254797446155" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">WhatsApp</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
