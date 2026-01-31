import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Link } from 'wouter';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

const AUDIO_CONFIG = {
  inputSampleRate: 16000,
  outputSampleRate: 24000,
};

const SYSTEM_INSTRUCTION = `
You are "Mama Dennis," the warm, friendly, and highly capable AI voice assistant for CONEKTA (conekta.co.ke), Kenya's trusted property and services platform - currently serving Nakuru City and its environs.

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
- Important questions to ask: Water availability, parking, security (watchman/gate), proximity to town, electricity stability

**CONEKTA FUNDIS (Verified Service Providers)**
- Categories: Plumbers, Electricians, Painters, Carpenters, Masons, Cleaners, Movers, AC Repair, Appliance Repair, Welders, Gardeners, Interior Designers
- Pricing guide: Small repairs Ksh 500-2,000, Installations Ksh 2,000-10,000, Major work negotiate
- All fundis verified through CONEKTA Trust
- How to book: Browse fundis → Check reviews and ratings → Call/WhatsApp directly → Agree on price before work starts

**CONEKTA STAYS (Short-Term Accommodation)**
- For: Visitors, business travelers, weekend getaways, events
- Options: Furnished apartments, Airbnb-style homes, guest houses, hotel alternatives
- Pricing: Ksh 2,000-10,000 per night
- Popular for: Lake Nakuru National Park visitors, business conferences, weddings, family visits

**CONEKTA TRUST (Verification System)**
- What it means: ID verified, background checked, reviews validated
- For Landlords: Trust Badge = tenants know listing is real
- For Fundis: Trust Badge = customers know they're dealing with professionals
- How to get verified: Go to conekta.co.ke/trust → Upload ID + selfie → AI verification → Badge issued same day
- Cost: FREE basic verification

**HOW TO LIST A PROPERTY (Landlords/Hosts)**
- Visit conekta.co.ke → Create account → Click "List Property" → Add details and photos → Get verified → Publish

**HOW TO REGISTER AS A FUNDI**
- Visit conekta.co.ke → Create account → Select "Register as Fundi" → Add skills and portfolio → Get verified → Start getting jobs

=== NAKURU DEEP KNOWLEDGE ===

**NEIGHBORHOODS & AREAS**
- Milimani: Upmarket, quiet, good security, families, Ksh 15,000-50,000 rent
- Section 58: Middle-class, near town, good for workers, Ksh 8,000-20,000
- Shabaab: Busy, near town, affordable, students & young professionals, Ksh 5,000-12,000
- Lanet: Residential, families, spacious compounds, Ksh 8,000-25,000
- Naka: Growing area, affordable, Ksh 4,000-10,000
- Free Area: Budget-friendly, students, Ksh 3,000-8,000
- Kaptembwo: Densely populated, affordable, Ksh 3,000-7,000
- London: Near industrial area, workers, Ksh 4,000-10,000
- Bondeni: Central, mixed, Ksh 5,000-12,000
- Barnabas: Quiet residential, Ksh 8,000-18,000
- Pipeline: Growing, affordable, Ksh 4,000-10,000
- Blankets: Near town, Ksh 6,000-15,000
- Flamingo: Near lake, scenic, Ksh 10,000-25,000

**LANDMARKS & NAVIGATION**
- Westside Mall: Main shopping center, has Naivas, Java, banks
- Nakuru CBD/Main Stage: Central business district, matatu terminus
- Lake Nakuru National Park: Famous for flamingos, tourist attraction
- Menengai Crater: Hiking spot, scenic views
- Afraha Stadium: Sports events, concerts
- PGH Nakuru: Provincial General Hospital
- War Memorial Hospital: Major private hospital

**TRANSPORT**
- Matatus: Main stage is the hub, routes to all estates
- Boda bodas: Everywhere, negotiate price first (Ksh 50-200 within town)
- To Nairobi: Matatus Ksh 400-600, 2-3 hours
- To Naivasha: Ksh 200-300, 1 hour

=== FEEDBACK COLLECTION ===
You actively collect feedback. When appropriate, ask:
- "Umeshawahi tumia CONEKTA? Ulikuwa experience yako ikoje?"
- "Je, kuna kitu tunaweza kuboresha?"
- "Kuna service ingine ungependa CONEKTA iongeze?"

Handle feedback warmly:
- Complaints: "Pole sana kwa hiyo. Tutaangalia na kuboresha"
- Suggestions: "Idea nzuri sana! Nitaforward kwa team yetu"
- Compliments: "Hongera! Tunafurahi kukusaidia"

=== CONVERSATION RULES ===
1. Keep responses SHORT - 2-3 sentences max for voice
2. Be conversational - use "sawa", "poa", natural fillers
3. Always offer next steps - "Ungependa nikutafutie...?"
4. If you don't know specifics - "Wacha niconnect na team yetu"
5. Be empathetic - "Pole sana, naelewa"
6. End warmly - "Asante kwa kuongea na Mama Dennis!"

=== WHO YOU ARE ===
When asked: "Mimi ni Mama Dennis, msaidizi wako wa CONEKTA. Nimekuwa Nakuru miaka mingi - najua kila kona! Niambie, unahitaji nini leo?"
`;

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Visualizer: React.FC<{ isActive: boolean; isModelSpeaking: boolean }> = ({ isActive, isModelSpeaking }) => {
  return (
    <div className="flex items-center justify-center space-x-1.5 h-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-2 rounded-full transition-all duration-200 ${
            isActive 
              ? isModelSpeaking 
                ? 'bg-green-500 animate-bounce' 
                : 'bg-green-400 animate-pulse' 
              : 'h-2 bg-gray-300'
          }`}
          style={{
            height: isActive ? `${Math.random() * 40 + 15}px` : '8px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: isModelSpeaking ? '0.5s' : '1.2s'
          }}
        />
      ))}
    </div>
  );
};

const VoiceAssistant: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [lastUserText, setLastUserText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const startSession = async () => {
    try {
      setError('');
      setStatus(ConnectionStatus.CONNECTING);
      
      if (!apiKey) {
        setError('Voice assistant not configured. Please contact support.');
        setStatus(ConnectionStatus.ERROR);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: AUDIO_CONFIG.inputSampleRate,
        });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: AUDIO_CONFIG.outputSampleRate,
        });
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      console.log('Starting Gemini Live session with API key:', apiKey ? 'SET' : 'NOT SET');
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(ConnectionStatus.CONNECTED);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (event) => {
              if (isMuted) return;
              
              const inputData = event.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = encode(new Uint8Array(int16.buffer));
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.inputTranscription) {
              setLastUserText(prev => prev + message.serverContent.inputTranscription.text);
            }
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent.outputTranscription.text);
            }
            if (message.serverContent?.turnComplete) {
              setLastUserText('');
              setTranscription('');
            }

            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const buffer = await decodeAudioData(
                decode(audioData),
                outCtx,
                AUDIO_CONFIG.outputSampleRate,
                1
              );
              
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e: any) => {
            console.error('Session error:', e);
            setError('Connection error. Please try again.');
            setStatus(ConnectionStatus.ERROR);
          },
          onclose: () => {
            setStatus(ConnectionStatus.DISCONNECTED);
          },
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error('Failed to start session:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      console.error('Error message:', err?.message);
      console.error('Error name:', err?.name);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (err?.message?.includes('API key')) {
        setError('API key error. Please contact support.');
      } else {
        setError(`Error: ${err?.message || 'Failed to connect. Please try again.'}`);
      }
      setStatus(ConnectionStatus.ERROR);
    }
  };

  const stopSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    setStatus(ConnectionStatus.DISCONNECTED);
    setIsSpeaking(false);
    setTranscription('');
    setLastUserText('');
    setError('');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
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
          <span className={`h-2.5 w-2.5 rounded-full ${
            status === ConnectionStatus.CONNECTED ? 'bg-green-500 animate-pulse' : 
            status === ConnectionStatus.CONNECTING ? 'bg-yellow-500 animate-pulse' : 
            status === ConnectionStatus.ERROR ? 'bg-red-500' :
            'bg-gray-300'
          }`}></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {status === ConnectionStatus.CONNECTED ? 'Live' : 
             status === ConnectionStatus.CONNECTING ? 'Connecting...' :
             status === ConnectionStatus.ERROR ? 'Error' : 'Ready'}
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
              <p className="text-xs text-gray-500 mt-1">
                Ongea na Mama Dennis kwa sauti! Ask about rentals, fundis, stays, or anything about Nakuru.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <div className={`w-52 h-52 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
            status === ConnectionStatus.CONNECTED 
              ? 'bg-white scale-105 border-4 border-green-500' 
              : status === ConnectionStatus.CONNECTING
              ? 'bg-white border-4 border-yellow-400 animate-pulse'
              : status === ConnectionStatus.ERROR
              ? 'bg-white border-4 border-red-400'
              : 'bg-gray-50 border-4 border-gray-200'
          }`}>
            <div className="text-center px-4">
              {status === ConnectionStatus.CONNECTED ? (
                <div className="space-y-2">
                  <Visualizer isActive={true} isModelSpeaking={isSpeaking} />
                  <p className="text-green-600 font-bold text-sm tracking-wide">
                    {isSpeaking ? 'Mama Dennis anasema...' : 'Ninasikiliza...'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isMuted ? '🔇 Muted' : '🎤 Speak now'}
                  </p>
                </div>
              ) : status === ConnectionStatus.CONNECTING ? (
                <div className="space-y-2">
                  <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-yellow-600 font-medium text-sm">Connecting...</p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Tap to call</p>
                  <p className="text-xs text-gray-400 mt-1">Mama Dennis</p>
                </div>
              )}
            </div>
          </div>
          
          {status === ConnectionStatus.CONNECTED && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-green-400 opacity-30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-green-300 opacity-20 animate-pulse"></div>
            </>
          )}
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[140px] mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Conversation
          </p>
          <div className="space-y-3">
            {lastUserText && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">
                  <span className="font-bold text-gray-500 mr-2">You:</span>
                  {lastUserText}
                </p>
              </div>
            )}
            {transcription ? (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-gray-900 text-sm">
                  <span className="font-bold text-green-600 mr-2">Mama Dennis:</span>
                  {transcription}
                </p>
              </div>
            ) : (
              status === ConnectionStatus.CONNECTED && !lastUserText && (
                <p className="text-gray-400 text-sm italic text-center py-4">
                  Uliza chochote kuhusu Nakuru, nyumba, au fundis...
                </p>
              )
            )}
            {status === ConnectionStatus.DISCONNECTED && (
              <p className="text-gray-400 text-sm text-center py-4">
                Bonyeza "Call Mama Dennis" kuanza mazungumzo
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center space-y-3">
          {status === ConnectionStatus.DISCONNECTED || status === ConnectionStatus.ERROR ? (
            <Button
              onClick={startSession}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-10 rounded-full shadow-lg transform active:scale-95 transition-all flex items-center space-x-3 text-lg"
            >
              <Phone className="h-6 w-6" />
              <span>Call Mama Dennis</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleMute}
                variant="outline"
                className={`p-4 rounded-full ${isMuted ? 'bg-red-50 border-red-300' : 'bg-gray-50'}`}
              >
                {isMuted ? <MicOff className="h-6 w-6 text-red-500" /> : <Mic className="h-6 w-6 text-green-600" />}
              </Button>
              <Button
                onClick={stopSession}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-8 rounded-full shadow-lg transform active:scale-95 transition-all flex items-center space-x-3"
              >
                <PhoneOff className="h-6 w-6" />
                <span>End Call</span>
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mt-8 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Nataka bedsitter Shabaab",
              "Nipatie plumber",
              "Rent Milimani ni ngapi?",
              "How do I list my property?",
              "Nataka Airbnb weekend"
            ].map((tip, i) => (
              <span key={i} className="text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 border border-gray-200">
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
