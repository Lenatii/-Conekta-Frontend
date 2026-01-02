import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// tRPC removed - chat now calls backend directly

interface Message {
  id: string;
  text: string;
  sender: "user" | "mama";
  timestamp: Date;
}

// Force deployment - Chat widget spacing fix
export default function MamaDennisChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Habari! 👋 I'm Mama Dennis, your AI assistant. How can I help you find a home or service today?",
      sender: "mama",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Persist session ID across all messages (CRITICAL FIX)
  const [sessionId] = useState(() => `web-${Date.now()}`);
  
  // Direct backend API calls - no tRPC needed

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Call the real backend API directly
    try {
      const response = await fetch('https://conekta-complete-system.onrender.com/api/webchat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const mamaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I'm having trouble connecting. Please try again!",
        sender: "mama",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mamaResponse]);
    } catch (error) {
      console.error('Mama Dennis API error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact us on WhatsApp at +254 797 446 155!",
        sender: "mama",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getMamaResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("property") || input.includes("rent") || input.includes("apartment")) {
      return "I can help you find the perfect property! 🏠 We have apartments, bedsitters, and houses in Nakuru and Nairobi. What's your budget and preferred location?";
    }
    
    if (input.includes("fundi") || input.includes("plumber") || input.includes("electrician")) {
      return "Looking for a trusted fundi? 🔧 I can connect you with verified electricians, plumbers, carpenters, and more. What service do you need?";
    }
    
    if (input.includes("price") || input.includes("cost") || input.includes("budget")) {
      return "Our properties range from KES 5,000 to KES 50,000 per month. Tell me your budget and I'll show you the best options! 💰";
    }
    
    if (input.includes("ubaru") || input.includes("verify")) {
      return "UBARU verification ensures you're dealing with trusted landlords and tenants. It costs KES 150 to reveal verified contact information. 🛡️";
    }
    
    if (input.includes("whatsapp")) {
      return "You can also reach me on WhatsApp at +254 797 446 155 for instant assistance! 📱";
    }
    
    return "I'm here to help! You can ask me about:\n• Finding rental properties 🏠\n• Connecting with fundis 🔧\n• Short-stay accommodations 🏨\n• UBARU verification 🛡️\n\nWhat would you like to know?";
  };

  return (
    <>
      {/* Chat Button */}
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
        <div className="fixed bottom-32 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-96 h-[500px] max-h-[75vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              👩🏾
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base truncate">Mama Dennis</h3>
              <p className="text-xs text-teal-100">AI Assistant • Online</p>
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
              <div
                key={message.id}
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
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 px-4 py-2"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-teal-500 hover:bg-teal-600 text-white"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Powered by Mama Dennis AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
