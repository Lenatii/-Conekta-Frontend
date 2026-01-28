import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

// Direct API call to backend instead of tRPC (for static hosting compatibility)
const BACKEND_API_URL = "https://conekta-complete-system.onrender.com";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mama";
  timestamp: Date;
  quickActions?: QuickAction[];
  actionType?: "consumer" | "provider" | "menu";
}

interface QuickAction {
  label: string;
  action: string;
  icon?: string;
  variant?: "default" | "provider" | "consumer" | "back";
}

// Track navigation history for "Go Back" functionality
type MenuState = "main" | "consumer" | "provider" | "flow";

export default function MamaDennisChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [menuHistory, setMenuHistory] = useState<MenuState[]>(["main"]);
  const [, setLocation] = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Habari! 👋 I'm Mama Dennis, your AI guardian for rent, services & trust.\n\nAre you looking for something, or do you have something to offer?",
      sender: "mama",
      timestamp: new Date(),
      actionType: "menu",
      quickActions: [
        { label: "🔍 I'm Looking For...", action: "consumer_menu", variant: "consumer" },
        { label: "📋 I Want to List/Offer...", action: "provider_menu", variant: "provider" },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Persist session ID across all messages
  const [sessionId] = useState(() => `web-${Date.now()}`);
  
  // Direct API call function (no tRPC needed for static hosting)

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

  // Go back to previous menu
  const handleGoBack = () => {
    const newHistory = [...menuHistory];
    newHistory.pop(); // Remove current state
    const previousState = newHistory[newHistory.length - 1] || "main";
    setMenuHistory(newHistory);
    
    let localResponse: Message;
    
    switch (previousState) {
      case "consumer":
        localResponse = {
          id: Date.now().toString(),
          text: "What are you looking for?",
          sender: "mama",
          timestamp: new Date(),
          actionType: "consumer",
          quickActions: [
            { label: "🏠 Find Property", action: "find_property", variant: "consumer" },
            { label: "🔧 Hire Fundi", action: "hire_fundi", variant: "consumer" },
            { label: "🏨 Book Stay", action: "book_stay", variant: "consumer" },
            { label: "⬅️ Go Back", action: "go_back", variant: "back" },
          ],
        };
        break;
      case "provider":
        localResponse = {
          id: Date.now().toString(),
          text: "What would you like to list or offer?\n\n✨ Quick signup - just basic info needed!\n🛡️ Get CONEKTA Trust verified later for the Trust badge",
          sender: "mama",
          timestamp: new Date(),
          actionType: "provider",
          quickActions: [
            { label: "🏠 List My Property", action: "list_property", variant: "provider" },
            { label: "🔧 Offer My Services", action: "register_fundi", variant: "provider" },
            { label: "🏨 List My Space", action: "list_stay", variant: "provider" },
            { label: "⬅️ Go Back", action: "go_back", variant: "back" },
          ],
        };
        break;
      default:
        localResponse = {
          id: Date.now().toString(),
          text: "No problem! Are you looking for something, or do you have something to offer?",
          sender: "mama",
          timestamp: new Date(),
          actionType: "menu",
          quickActions: [
            { label: "🔍 I'm Looking For...", action: "consumer_menu", variant: "consumer" },
            { label: "📋 I Want to List/Offer...", action: "provider_menu", variant: "provider" },
          ],
        };
    }
    
    const userMessage: Message = {
      id: (Date.now() - 1).toString(),
      text: "⬅️ Go back",
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage, localResponse]);
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    let showLocalResponse = false;
    let localResponse: Message | null = null;
    
    switch (action) {
      // Go back action
      case "go_back":
        handleGoBack();
        return;
        
      // Consumer menu
      case "consumer_menu":
        showLocalResponse = true;
        setMenuHistory([...menuHistory, "consumer"]);
        localResponse = {
          id: Date.now().toString(),
          text: "Great! What are you looking for?",
          sender: "mama",
          timestamp: new Date(),
          actionType: "consumer",
          quickActions: [
            { label: "🏠 Find Property", action: "find_property", variant: "consumer" },
            { label: "🔧 Hire Fundi", action: "hire_fundi", variant: "consumer" },
            { label: "🏨 Book Stay", action: "book_stay", variant: "consumer" },
            { label: "⬅️ Go Back", action: "go_back", variant: "back" },
          ],
        };
        break;
        
      // Provider menu - for landlords, fundis, hosts
      case "provider_menu":
        showLocalResponse = true;
        setMenuHistory([...menuHistory, "provider"]);
        localResponse = {
          id: Date.now().toString(),
          text: "Wonderful! What would you like to list or offer?\n\n✨ Quick signup - just basic info needed!\n🛡️ Get CONEKTA Trust verified later for the Trust badge",
          sender: "mama",
          timestamp: new Date(),
          actionType: "provider",
          quickActions: [
            { label: "🏠 List My Property", action: "list_property", variant: "provider" },
            { label: "🔧 Offer My Services", action: "register_fundi", variant: "provider" },
            { label: "🏨 List My Space", action: "list_stay", variant: "provider" },
            { label: "⬅️ Go Back", action: "go_back", variant: "back" },
          ],
        };
        break;
      
      // ===== PROVIDER ACTIONS (Using numbered menu for reliable routing) =====
      
      // Landlord - List Property (1 → 2 flow)
      case "list_property":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "1" to select CONEKTA Rentals, then "2" to select "List Property"
        handleSendMessage("1").then(() => {
          setTimeout(() => {
            handleSendMessage("2"); // Select "List Property" option
          }, 1500);
        });
        return;
        
      // Fundi - Register as Service Provider (2 → 2 flow)
      case "register_fundi":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "2" to select CONEKTA Fundis, then "2" to select "Register as Fundi"
        handleSendMessage("2").then(() => {
          setTimeout(() => {
            handleSendMessage("2"); // Select "Register as Fundi" option
          }, 1500);
        });
        return;
        
      // Host - List Short-Stay Space (4 → 2 flow)
      case "list_stay":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "4" to select CONEKTA Stays, then "2" to select "List Your Space"
        handleSendMessage("4").then(() => {
          setTimeout(() => {
            handleSendMessage("2"); // Select "List Your Space" option
          }, 1500);
        });
        return;
      
      // ===== CONSUMER ACTIONS (Using numbered menu for reliable routing) =====
      
      // Find Property (1 → 1 flow)
      case "find_property":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "1" to select CONEKTA Rentals, then "1" to select "Find a Home"
        handleSendMessage("1").then(() => {
          setTimeout(() => {
            handleSendMessage("1"); // Select "Find a Home" option
          }, 1500);
        });
        return;
        
      // Hire Fundi (2 → 1 flow)
      case "hire_fundi":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "2" to select CONEKTA Fundis, then "1" to select "Hire a Fundi"
        handleSendMessage("2").then(() => {
          setTimeout(() => {
            handleSendMessage("1"); // Select "Hire a Fundi" option
          }, 1500);
        });
        return;
        
      // Book Stay (4 → 1 flow)
      case "book_stay":
        setMenuHistory([...menuHistory, "flow"]);
        // First send "4" to select CONEKTA Stays, then "1" to select "Book a Stay"
        handleSendMessage("4").then(() => {
          setTimeout(() => {
            handleSendMessage("1"); // Select "Book a Stay" option
          }, 1500);
        });
        return;
        
      // Trust verification
      case "trust":
        message = "Tell me about CONEKTA Trust verification";
        break;
        
      // Back to main menu (reset everything)
      case "main_menu":
        showLocalResponse = true;
        setMenuHistory(["main"]);
        localResponse = {
          id: Date.now().toString(),
          text: "No problem! Are you looking for something, or do you have something to offer?",
          sender: "mama",
          timestamp: new Date(),
          actionType: "menu",
          quickActions: [
            { label: "🔍 I'm Looking For...", action: "consumer_menu", variant: "consumer" },
            { label: "📋 I Want to List/Offer...", action: "provider_menu", variant: "provider" },
          ],
        };
        break;
        
      default:
        message = action;
    }
    
    if (showLocalResponse && localResponse) {
      // Add user selection message
      const userMessage: Message = {
        id: (Date.now() - 1).toString(),
        text: action === "consumer_menu" ? "I'm looking for something" : 
              action === "provider_menu" ? "I want to list/offer something" :
              action === "main_menu" ? "Back to menu" : action,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage, localResponse!]);
    } else if (message) {
      setInputMessage(message);
      handleSendMessage(message);
    }
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

    // Call Mama Dennis backend directly
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/webchat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
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
    
    // Check if in a step-by-step flow (property listing, fundi registration, etc.)
    if (lower.includes("step 1") || lower.includes("step 2") || lower.includes("step 3") || 
        lower.includes("reply with") || lower.includes("your title") || lower.includes("your name")) {
      // In a flow - show go back and main menu
      return [
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
        { label: "🏠 Main Menu", action: "main_menu", variant: "back" },
      ];
    }
    
    // Check for property type selection (landlord listing)
    if (lower.includes("property type") || lower.includes("1. apartment") || lower.includes("2. house")) {
      return [
        { label: "🏢 Apartment", action: "1" },
        { label: "🏠 House", action: "2" },
        { label: "🛏️ Bedsitter", action: "3" },
        { label: "🏨 Studio", action: "4" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for fundi service category selection
    if (lower.includes("service category") || lower.includes("1. plumber") || lower.includes("2. electrician")) {
      return [
        { label: "🔧 Plumber", action: "1" },
        { label: "⚡ Electrician", action: "2" },
        { label: "🪚 Carpenter", action: "3" },
        { label: "🧱 Mason", action: "4" },
        { label: "🎨 Painter", action: "5" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for hire/register fundi options
    if (lower.includes("hire a fundi") && lower.includes("register as fundi")) {
      return [
        { label: "💼 Hire a Fundi", action: "1" },
        { label: "🛠️ Register as Fundi", action: "2" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for tenant/landlord options
    if (lower.includes("find a home") && lower.includes("list property")) {
      return [
        { label: "🔍 Find a Home", action: "1" },
        { label: "📋 List Property", action: "2" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for short-stay options
    if (lower.includes("book a stay") && lower.includes("list your space")) {
      return [
        { label: "🏨 Book a Stay", action: "1" },
        { label: "📋 List Your Space", action: "2" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for landlord/property listing prompts
    if (lower.includes("list property") || lower.includes("landlord")) {
      return [
        { label: "📋 Start Listing", action: "Let's start listing my property" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    // Check for fundi registration prompts
    if (lower.includes("register as fundi") || lower.includes("service provider")) {
      return [
        { label: "📋 Register Now", action: "I want to register as a fundi" },
        { label: "⬅️ Go Back", action: "go_back", variant: "back" },
      ];
    }
    
    if (lower.includes("property") || lower.includes("rent") || lower.includes("find a home")) {
      return [
        { label: "View Properties", action: "Show me available properties" },
        { label: "My Budget", action: "What's my budget range?" },
        { label: "🏠 Main Menu", action: "main_menu", variant: "back" },
      ];
    }
    
    if (lower.includes("fundi") || lower.includes("service") || lower.includes("hire")) {
      return [
        { label: "Browse Fundis", action: "Show me available fundis" },
        { label: "Service Needed", action: "What service do you need?" },
        { label: "🏠 Main Menu", action: "main_menu", variant: "back" },
      ];
    }
    
    if (lower.includes("trust") || lower.includes("verify") || lower.includes("ubaru") || lower.includes("certified")) {
      return [
        { label: "Get Verified", action: "How do I get CONEKTA Trust verified?" },
        { label: "Learn More", action: "Tell me more about CONEKTA Trust" },
        { label: "🏠 Main Menu", action: "main_menu", variant: "back" },
      ];
    }
    
    // Default: show main menu option
    return [
      { label: "🏠 Main Menu", action: "main_menu", variant: "back" },
    ];
  };

  return (
    <>
      {/* Chat Button with Pulse Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-chat-toggle="true"
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
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          action.variant === "provider"
                            ? "bg-purple-900/50 hover:bg-purple-800/50 text-purple-300 border-purple-700"
                            : action.variant === "consumer"
                            ? "bg-teal-900/50 hover:bg-teal-800/50 text-teal-300 border-teal-700"
                            : action.variant === "back"
                            ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border-slate-600"
                            : "bg-slate-800 hover:bg-slate-700 text-teal-400 border-slate-700"
                        }`}
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
              Powered by Mama Dennis AI • <span className="text-amber-400">WhatsApp coming soon!</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
