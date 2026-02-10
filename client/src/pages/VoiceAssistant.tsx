import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, MessageCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoiceAssistant: React.FC = () => {
  useEffect(() => {
    // Auto-scroll to chat widget on mount
    setTimeout(() => {
      const chatWidget = document.querySelector('[data-chat-widget]');
      if (chatWidget) {
        chatWidget.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Mama Dennis</h1>
          <p className="text-sm text-gray-600">Voice Assistant</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {/* Welcome Message */}
        <div className="text-center space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Ongea na Mama Dennis! 💬</h2>
          <p className="text-gray-600">Swahili • Sheng • English</p>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 space-y-3">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">Chat with Mama Dennis</h3>
              <p className="text-sm text-blue-800 mt-1">
                Our AI assistant is ready to help you with questions about CONEKTA Rentals, Fundis, Stays, and Trust verification.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">What Mama Dennis can help with:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Find rental properties in your area</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Search for verified service providers (fundis)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Book short-stay accommodation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Learn about CONEKTA Trust verification</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">Get support and answers to your questions</span>
            </li>
          </ul>
        </div>

        {/* Chat Widget Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 space-y-3">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">How to chat:</h3>
              <p className="text-sm text-green-800 mt-1">
                Scroll down to find the chat widget at the bottom right of your screen. Click it to start a conversation with Mama Dennis. She speaks Swahili, Sheng, and English!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            onClick={() => {
              const chatWidget = document.querySelector('[data-chat-widget]');
              if (chatWidget) {
                chatWidget.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Open Chat Widget
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full py-6">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
