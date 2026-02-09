import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mic, MicOff, Loader2 } from 'lucide-react';
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
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
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
    utterance.lang = 'en-KE';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Your browser does not support voice recognition. Please use Chrome, Safari, or Edge.');
      setStatus(ConnectionStatus.ERROR);
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-KE';
      
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
        setError(`Listening error: ${event.error}`);
        setStatus(ConnectionStatus.ERROR);
      };
      
      recognition.onend = () => {
        setStatus(ConnectionStatus.IDLE);
      };
      
      recognition.start();
      
    } catch (err: any) {
      console.error('Speech recognition error:', err);
      setError('Could not start voice recognition. Please try again.');
      setStatus(ConnectionStatus.ERROR);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus(ConnectionStatus.IDLE);
  };

  const handleMicClick = () => {
    if (status === ConnectionStatus.LISTENING) {
      stopListening();
    } else {
      startListening();
    }
  };

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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Welcome Message */}
        {conversationHistory.length === 0 && (
          <div className="text-center space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-gray-900">Ongea na Mama Dennis kwa sauti! 🎤</h2>
            <p className="text-gray-600">Swahili • Sheng • English</p>
          </div>
        )}

        {/* Conversation */}
        {conversationHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-green-500 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Current Transcription */}
        {transcription && (
          <div className="flex justify-end">
            <div className="max-w-xs px-4 py-3 rounded-lg bg-green-500 text-white rounded-br-none">
              <p className="text-sm italic">{transcription}</p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {status === ConnectionStatus.PROCESSING && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Visualizer */}
      {(status === ConnectionStatus.LISTENING || status === ConnectionStatus.SPEAKING) && (
        <div className="px-4 py-4">
          <Visualizer status={status} />
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 px-4 py-6 space-y-4">
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleMicClick}
            size="lg"
            className={`rounded-full w-20 h-20 ${
              status === ConnectionStatus.LISTENING
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {status === ConnectionStatus.LISTENING ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600">
          {status === ConnectionStatus.LISTENING && 'Listening...'}
          {status === ConnectionStatus.PROCESSING && 'Processing...'}
          {status === ConnectionStatus.SPEAKING && 'Speaking...'}
          {status === ConnectionStatus.IDLE && 'Tap to call Mama Dennis'}
          {status === ConnectionStatus.ERROR && 'Error - Tap to retry'}
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
