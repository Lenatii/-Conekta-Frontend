import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

enum ConnectionStatus {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}

const SYSTEM_INSTRUCTION = `You are "Mama Dennis," the warm, friendly, and highly capable AI voice assistant for CONEKTA (conekta.co.ke), Kenya's trusted property and services platform - currently serving Nakuru City and its environs.

=== YOUR PERSONALITY ===
- You are Mama Dennis - a wise, caring "mama" figure who has lived in Nakuru for 30+ years
- You know every corner of Nakuru like the back of your hand
- You speak like a trusted neighbor (jirani) - professional yet warm and conversational
- You are fluent in English, Swahili, and Sheng. Switch naturally based on how the user speaks
- Local phrases you use: "Sasa!", "Niaje", "Karibu sana", "Pole sana", "Haina wasiwasi", "Tuko pamoja", "Sawa kabisa", "Poa sana!", "Uko sawa?", "Twende!"
- You celebrate wins: "Hongera!", "Umefanya vizuri!", "Wewe ni mzuri sana!"
- You're empathetic: "Pole kwa hiyo", "Naelewa kabisa", "Tuko pamoja"

=== CONEKTA PLATFORM - COMPLETE KNOWLEDGE ===

**CONEKTA RENTALS (Finding a Home)**
- Bedsitters: Ksh 3,000-8,000/month
- 1 Bedroom: Ksh 8,000-15,000/month  
- 2 Bedroom: Ksh 12,000-25,000/month
- 3+ Bedroom: Ksh 20,000-50,000+/month
- Process: Browse conekta.co.ke → Filter by area/price → Contact landlord → View property → Pay deposit (usually 1 month) + first month rent

**CONEKTA FUNDIS (Verified Service Providers)**
- Categories: Plumbers, Electricians, Painters, Carpenters, Masons, Cleaners, Movers, AC Repair, Appliance Repair, Welders, Gardeners
- Pricing guide: Small repairs Ksh 500-2,000, Installations Ksh 2,000-10,000, Major work negotiate
- All fundis verified through CONEKTA Trust

**CONEKTA STAYS (Short-Term Accommodation)**
- For: Visitors, business travelers, weekend getaways
- Pricing: Ksh 2,000-10,000 per night

**CONEKTA TRUST (Verification System)**
- What it means: ID verified, background checked, reviews validated
- How to get verified: Go to conekta.co.ke/trust → Upload ID + selfie → AI verification → Badge issued same day

=== NAKURU NEIGHBORHOODS ===
- Milimani: Upmarket, quiet, Ksh 15,000-50,000
- Section 58: Middle-class, near town, Ksh 8,000-20,000
- Shabaab: Busy, affordable, students, Ksh 5,000-12,000
- Lanet: Families, spacious, Ksh 8,000-25,000
- Naka: Growing, affordable, Ksh 4,000-10,000
- Free Area: Budget, students, Ksh 3,000-8,000
- Kaptembwo: Dense, affordable, Ksh 3,000-7,000

=== CONVERSATION RULES ===
1. Keep responses SHORT - 2-3 sentences max
2. Be conversational - use "sawa", "poa", natural fillers
3. Always offer next steps
4. Be empathetic
5. End warmly

When asked who you are: "Mimi ni Mama Dennis, msaidizi wako wa CONEKTA. Nimekuwa Nakuru miaka mingi - najua kila kona!"`;

const Visualizer: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const isActive = status === ConnectionStatus.LISTENING || status === ConnectionStatus.SPEAKING;
  const isSpeaking = status === ConnectionStatus.SPEAKING;
  
  return (
    <div className="flex items-center justify-center space-x-1.5 h-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-2 rounded-full transition-all duration-200 ${
            isActive 
              ? isSpeaking 
                ? 'bg-green-500 animate-bounce' 
                : 'bg-red-400 animate-pulse' 
              : 'h-2 bg-gray-300'
          }`}
          style={{
            height: isActive ? `${Math.random() * 40 + 15}px` : '8px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: isSpeaking ? '0.5s' : '1.2s'
          }}
        />
      ))}
    </div>
  );
};

const VoiceAssistant: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.IDLE);
  const [transcription, setTranscription] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      stopListening();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-KE'; // Kenyan English
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    
    // Try to find a female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.onstart = () => setStatus(ConnectionStatus.SPEAKING);
    utterance.onend = () => setStatus(ConnectionStatus.IDLE);
    utterance.onerror = () => setStatus(ConnectionStatus.IDLE);
    
    synthRef.current.speak(utterance);
  };

  const callGemini = async (userMessage: string) => {
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    setStatus(ConnectionStatus.PROCESSING);
    
    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
            { role: 'model', parts: [{ text: 'Sawa! Mimi ni Mama Dennis, msaidizi wako. Niambie, unahitaji nini leo?' }] },
            ...newHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            }))
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.8,
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API error');
      }
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pole, sijasikia vizuri. Sema tena?';
      
      setResponse(aiResponse);
      setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
      
      // Speak the response
      speak(aiResponse);
      
    } catch (err: any) {
      console.error('Gemini error:', err);
      setError(`Error: ${err.message}`);
      setStatus(ConnectionStatus.ERROR);
    }
  };

  const startListening = async () => {
    setError('');
    setTranscription('');
    
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Fallback: Use MediaRecorder and send to backend for transcription
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          
          if (audioChunksRef.current.length === 0) return;
          
          // For browsers without Speech Recognition, show a message
          setError('Your browser does not support voice recognition. Please type your message or use Chrome/Safari.');
          setStatus(ConnectionStatus.IDLE);
        };
        
        mediaRecorder.start();
        setStatus(ConnectionStatus.LISTENING);
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }, 10000);
        
      } catch (err: any) {
        console.error('Microphone error:', err);
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else {
          setError('Could not access microphone. Please check your device settings.');
        }
        setStatus(ConnectionStatus.ERROR);
      }
      return;
    }
    
    // Use Web Speech API
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-KE'; // Kenyan English, also picks up Swahili
      
      recognition.onstart = () => {
        setStatus(ConnectionStatus.LISTENING);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscription(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          callGemini(finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setStatus(ConnectionStatus.ERROR);
      };
      
      recognition.onend = () => {
        if (status === ConnectionStatus.LISTENING) {
          setStatus(ConnectionStatus.IDLE);
        }
      };
      
      recognition.start();
      
    } catch (err: any) {
      console.error('Speech recognition setup error:', err);
      setError('Could not start voice recognition. Please try again.');
      setStatus(ConnectionStatus.ERROR);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setStatus(ConnectionStatus.IDLE);
  };

  const getStatusText = () => {
    switch (status) {
      case ConnectionStatus.LISTENING: return 'Listening...';
      case ConnectionStatus.PROCESSING: return 'Thinking...';
      case ConnectionStatus.SPEAKING: return 'Speaking...';
      case ConnectionStatus.ERROR: return 'Error';
      default: return 'Ready';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatus.LISTENING: return 'bg-red-500 animate-pulse';
      case ConnectionStatus.PROCESSING: return 'bg-yellow-500 animate-pulse';
      case ConnectionStatus.SPEAKING: return 'bg-green-500 animate-pulse';
      case ConnectionStatus.ERROR: return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const tips = [
    "Nataka bedsitter Shabaab",
    "Nipatie plumber",
    "Rent Milimani ni ngapi?",
    "How do I list my property?",
    "Nataka Airbnb weekend"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              MD
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Mama Dennis</h1>
              <p className="text-xs text-gray-500 font-medium">Voice Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`}></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {getStatusText()}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col items-center">
        
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Volume2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Voice Chat with Mama Dennis</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ongea na Mama Dennis kwa sauti! Ask about rentals, fundis, stays, or anything about Nakuru.</p>
            </div>
          </div>
        </div>

        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          status === ConnectionStatus.LISTENING ? 'bg-red-50 ring-4 ring-red-200' :
          status === ConnectionStatus.SPEAKING ? 'bg-green-50 ring-4 ring-green-200' :
          status === ConnectionStatus.PROCESSING ? 'bg-yellow-50 ring-4 ring-yellow-200' :
          'bg-gray-50'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Visualizer status={status} />
          </div>
          <div className="z-10 flex flex-col items-center">
            {status === ConnectionStatus.PROCESSING ? (
              <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
            ) : status === ConnectionStatus.LISTENING ? (
              <Mic className="h-10 w-10 text-red-500" />
            ) : status === ConnectionStatus.SPEAKING ? (
              <Volume2 className="h-10 w-10 text-green-500" />
            ) : (
              <Phone className="h-10 w-10 text-gray-400" />
            )}
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {status === ConnectionStatus.LISTENING ? 'Listening...' :
               status === ConnectionStatus.PROCESSING ? 'Processing...' :
               status === ConnectionStatus.SPEAKING ? 'Speaking...' :
               'Tap to call'}
            </span>
            <span className="text-xs text-gray-400">Mama Dennis</span>
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 min-h-[120px]">
          <div className="flex items-center space-x-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live Conversation</span>
          </div>
          
          {transcription && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">You said:</p>
              <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-2">{transcription}</p>
            </div>
          )}
          
          {response && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Mama Dennis:</p>
              <p className="text-gray-900 text-sm bg-green-50 rounded-lg p-2">{response}</p>
            </div>
          )}
          
          {!transcription && !response && status === ConnectionStatus.IDLE && (
            <p className="text-gray-400 text-sm text-center py-4">
              Bonyeza "Call Mama Dennis" kuanza mazungumzo
            </p>
          )}
        </div>

        <div className="w-full flex flex-col items-center space-y-3">
          {status === ConnectionStatus.IDLE || status === ConnectionStatus.ERROR ? (
            <Button
              onClick={startListening}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-10 rounded-full shadow-lg transform active:scale-95 transition-all flex items-center space-x-3 text-lg"
            >
              <Phone className="h-6 w-6" />
              <span>Call Mama Dennis</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                onClick={stopListening}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-8 rounded-full shadow-lg transform active:scale-95 transition-all flex items-center space-x-3"
              >
                <PhoneOff className="h-6 w-6" />
                <span>End</span>
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mt-6">
          <p className="text-xs text-gray-400 mb-2 flex items-center">
            <span className="mr-1">💡</span> Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {tips.map((tip, i) => (
              <span 
                key={i} 
                onClick={() => {
                  setTranscription(tip);
                  callGemini(tip);
                }}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full cursor-pointer hover:bg-green-100 hover:text-green-700 transition-colors"
              >
                "{tip}"
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-400 text-xs border-t border-gray-100 bg-white/50">
        <p>Powered by <span className="text-green-500 font-semibold">Mama Dennis AI</span></p>
        <p className="mt-1">Sheng • Swahili • English</p>
      </footer>
    </div>
  );
};

export default VoiceAssistant;
