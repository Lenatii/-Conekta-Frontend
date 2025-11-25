import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mama";
  timestamp: Date;
}

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
    setInputMessage("");
    setIsTyping(true);

    // Simulate Mama Dennis response (replace with actual API call)
    setTimeout(() => {
      const mamaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getMamaResponse(inputMessage),
        sender: "mama",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mamaResponse]);
      setIsTyping(false);
    }, 1500);
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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
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
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👩🏾
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Mama Dennis</h3>
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
          <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-teal-500 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
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
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
