import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'READY' | 'RECORDING' | 'PROCESSING' | 'ERROR'>('READY');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  const startRecording = async () => {
    try {
      setErrorMessage('');
      setStatus('RECORDING');
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.onstart = () => {
          setStatus('RECORDING');
        };

        recognitionRef.current.onresult = async (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }

          if (transcript.trim()) {
            await handleUserMessage(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          setErrorMessage(`Error: ${event.error}`);
          setStatus('ERROR');
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current.start();
      } else {
        setErrorMessage('Speech Recognition not supported on this browser');
        setStatus('ERROR');
        setIsRecording(false);
      }
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
      setStatus('ERROR');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleUserMessage = async (userText: string) => {
    setStatus('PROCESSING');
    setIsProcessing(true);

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Call backend chat endpoint
      const response = await fetch('https://conekta-complete-system.onrender.com/api/v1/mama-dennis/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          conversation_history: messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.response || data.message || 'I could not understand that. Please try again.';

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: assistantText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response
      speakText(assistantText);
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
      setStatus('READY');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleUserMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            MD
          </div>
          <div>
            <h1 className="font-bold text-lg">Mama Dennis</h1>
            <p className="text-sm text-gray-600">Voice Assistant</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${status === 'READY' ? 'bg-green-500' : status === 'RECORDING' ? 'bg-red-500 animate-pulse' : status === 'PROCESSING' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Greeting */}
        <div className="bg-green-50 rounded-lg p-4 text-center mb-6">
          <p className="text-gray-700 font-medium">
            Ongea na Mama Dennis kwa sauti! Ask about rentals, fundis, stays, or anything about Nakuru.
          </p>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Start a conversation with Mama Dennis</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Voice Control */}
      <div className="bg-white border-t border-gray-200 p-6 space-y-4">
        {/* Large Call Button */}
        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110'
                : isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white shadow-lg`}
          >
            {isRecording ? (
              <MicOff className="w-12 h-12" />
            ) : isProcessing ? (
              <div className="animate-spin">
                <Phone className="w-12 h-12" />
              </div>
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 font-medium">
          {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to call Mama Dennis'}
        </p>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">Try asking:</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              '"Nataka bedsitter Shabaab"',
              '"Nipatie plumber"',
              '"Rent Milimani ni ngapi?"',
              '"How do I list my property?"',
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(suggestion.replace(/"/g, ''))}
                disabled={isProcessing || isRecording}
                className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        <p>Powered by Mama Dennis AI</p>
        <p className="text-xs text-gray-500 mt-1">Swahili • Sheng • English</p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
