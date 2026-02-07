import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  language?: 'en' | 'sw' | 'sheng';
}

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'READY' | 'RECORDING' | 'PROCESSING' | 'ERROR'>('READY');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'sw' | 'sheng'>('en');
  const recognitionRef = useRef<any>(null);
  const conversationHistoryRef = useRef<Array<{role: string; content: string}>>([]);

  // Initialize Web Speech API with multi-language support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // Support multiple languages
      recognitionRef.current.lang = 'en-US'; // Default, will auto-detect
    }
  }, []);

  // Detect language from text
  const detectLanguage = (text: string): 'en' | 'sw' | 'sheng' => {
    const lowerText = text.toLowerCase();
    
    // Sheng indicators (Kenyan street language)
    const shengPatterns = /\b(poa|sawa|uko|ati|wacha|eeh|buda|niko|rada|mchezo|pole|hakuna|haraka|ngoja|nyumba|fundi|matatu|kupika|kufa|pesa|bob|shilling|kes|jina|namba|karibu|asante|jameni|seme|wapi|nini|leo|sisi|wao|huyu|yule)\b/gi;
    
    // Swahili indicators
    const swahiliPatterns = /\b(jambo|habari|asante|karibu|pole|haraka|hakuna|rafiki|mwenyezi|mungu|kila|kama|lakini|kwa|na|au|ama|ndiyo|hapana|tafadhali|wakati|saa|juma|mwezi|mwaka)\b/gi;
    
    const shengMatches = (text.match(shengPatterns) || []).length;
    const swahiliMatches = (text.match(swahiliPatterns) || []).length;
    
    if (shengMatches > swahiliMatches && shengMatches > 2) {
      return 'sheng';
    } else if (swahiliMatches > 2) {
      return 'sw';
    }
    return 'en';
  };

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
            const detectedLang = detectLanguage(transcript);
            setDetectedLanguage(detectedLang);
            await handleUserMessage(transcript, detectedLang);
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

  const handleUserMessage = async (userText: string, language?: 'en' | 'sw' | 'sheng') => {
    setStatus('PROCESSING');
    setIsProcessing(true);

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: userText,
      timestamp: new Date(),
      language: language || detectedLanguage,
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation history
    conversationHistoryRef.current.push({
      role: 'user',
      content: userText
    });

    try {
      // Call backend chat endpoint
      // Backend manages conversation history internally using session_id
      const response = await fetch('https://conekta-complete-system.onrender.com/api/webchat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          session_id: 'voice-assistant',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle response from webchat endpoint
      let assistantText = data.response || data.message || 'Sawa! Karibu. Unataka nini leo?';

      if (!assistantText || assistantText.trim() === '') {
        assistantText = 'Sawa! Karibu. Unataka nini leo? 🏠 Nyumba, 🔧 Fundi, ama 🏨 Stays?';
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: assistantText,
        timestamp: new Date(),
        language: language || detectedLanguage,
      };
      setMessages(prev => [...prev, assistantMessage]);
      


      // Speak the response
      speakText(assistantText, language || detectedLanguage);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMsg = `Pole sana! Kulikuwa na hitilafu. Jaribu tena: ${error.message}`;
      setErrorMessage(errorMsg);
      setStatus('ERROR');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        text: errorMsg,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setStatus('READY');
    }
  };

  const speakText = (text: string, language: 'en' | 'sw' | 'sheng' = 'en') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language for speech synthesis
      if (language === 'sw') {
        utterance.lang = 'sw-KE'; // Swahili - Kenya
      } else if (language === 'sheng') {
        utterance.lang = 'en-KE'; // Sheng uses English with Kenyan accent
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for female voice
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      // Try to find a female voice
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    const lang = detectLanguage(suggestion);
    handleUserMessage(suggestion, lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
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
            Ongea na Mama Dennis kwa sauti! 🎤
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Swahili • Sheng • English
          </p>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Start a conversation with Mama Dennis</p>
            <p className="text-xs text-gray-400 mt-2">Ask about rentals, fundis, stays, or anything about Nakuru</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
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
        <div className="flex justify-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isSpeaking}
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
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all"
            >
              <Volume2 className="w-12 h-12 animate-pulse" />
            </button>
          )}
        </div>

        <p className="text-center text-gray-600 font-medium">
          {isRecording ? '🎙️ Listening...' : isProcessing ? '⏳ Processing...' : isSpeaking ? '🔊 Speaking...' : '👂 Tap to call Mama Dennis'}
        </p>

        {/* Language Indicator */}
        <p className="text-center text-xs text-gray-500">
          Language: {detectedLanguage === 'sheng' ? 'Sheng' : detectedLanguage === 'sw' ? 'Swahili' : 'English'}
        </p>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">Try asking:</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              '"Nataka bedsitter Shabaab"',
              '"Nipatie plumber"',
              '"Rent Milimani ni ngapi?"',
              '"Unataka kulist property?"',
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(suggestion.replace(/"/g, ''))}
                disabled={isProcessing || isRecording || isSpeaking}
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
        <p className="text-xs text-gray-500 mt-1">Multi-language support • Conversational AI</p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
