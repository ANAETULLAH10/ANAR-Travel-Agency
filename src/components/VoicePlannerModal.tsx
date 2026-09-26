import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Compass, MessageSquare } from 'lucide-react';

interface VoicePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestinationById?: (id: string) => void;
}

export const VoicePlannerModal: React.FC<VoicePlannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'gemini'; text: string }>>([
    {
      sender: 'gemini',
      text: "Salam! I am your AI Voice Travel Concierge at ANAR Travel Agency, powered by Gemini Live. Where would you like to travel in Bangladesh or abroad? You can tap the mic and talk to me directly.",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        sendVoiceQuery(transcript);
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
        setIsListening(true);
      }
    }
  };

  const playBase64Audio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Decode base64 to binary
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert raw PCM 16-bit to Float32Array
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      setIsSpeaking(true);
      source.onended = () => {
        setIsSpeaking(false);
      };
      source.start();
    } catch (e) {
      console.warn('PCM Audio playback error, falling back to speech synthesis:', e);
      fallbackBrowserTTS();
    }
  };

  const fallbackBrowserTTS = (text?: string) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text || conversation[conversation.length - 1]?.text || '');
      msg.rate = 1.0;
      msg.pitch = 1.0;
      msg.onstart = () => setIsSpeaking(true);
      msg.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(msg);
    }
  };

  const sendVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setConversation((prev) => [...prev, { sender: 'user', text: queryText }]);
    setTranscript('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/gemini/voice-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceText: queryText }),
      });

      const data = await res.json();
      const replyText = data.text || "I'd love to help you explore Cox's Bazar, Sajek, or the Sundarbans!";

      setConversation((prev) => [...prev, { sender: 'gemini', text: replyText }]);

      if (data.audioBase64) {
        await playBase64Audio(data.audioBase64);
      } else {
        fallbackBrowserTTS(replyText);
      }
    } catch (err) {
      console.error('Voice conversation error:', err);
      const fallback = "Cox's Bazar and Sajek Valley are currently having the most pleasant weather! You can book our all-inclusive 4-day tour for ৳14,500 with local guide and luxury transport.";
      setConversation((prev) => [...prev, { sender: 'gemini', text: fallback }]);
      fallbackBrowserTTS(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleVoicePrompts = [
    'Plan a 3-day trip to Sajek with budget in Taka',
    "What's the best time to see the sea of clouds?",
    'Recommend a luxury houseboat tour at Tanguar Haor',
    'Best seafood restaurants in Cox’s Bazar',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 px-6 bg-gradient-to-r from-blue-950 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Gemini Live Voice Concierge
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black tracking-wider uppercase border border-amber-400/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Real-time vocal conversation for Bangladesh & World travel planning
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Visualizer Wave Area */}
        <div className="py-6 px-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Animated soundwaves */}
          <div className="flex items-center gap-1.5 h-12 mb-4">
            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 65].map((h, i) => (
              <span
                key={i}
                style={{
                  height: (isListening || isSpeaking) ? `${Math.max(12, Math.round(h * Math.random()))}px` : '10px',
                }}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-amber-400'
                    : isListening
                    ? 'bg-blue-600 animate-pulse'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Big Mic Toggle Button */}
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl cursor-pointer ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-8 ring-red-500/20'
                : isSpeaking
                ? 'bg-amber-400 text-slate-950 ring-8 ring-amber-400/20'
                : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-105 shadow-blue-900/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          <p className="mt-3 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            {isListening ? (
              <span className="text-red-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Listening to you... Tap again when finished
              </span>
            ) : isSpeaking ? (
              <span className="text-amber-500 flex items-center gap-1">
                <Volume2 className="w-4 h-4 animate-bounce" />
                Gemini Live is speaking...
              </span>
            ) : isProcessing ? (
              <span className="text-blue-600 dark:text-blue-400">
                Planning your travel details with Gemini...
              </span>
            ) : (
              <span>Tap microphone to talk or ask anything</span>
            )}
          </p>

          {/* Current Live speech transcript preview */}
          {transcript && (
            <div className="mt-3 max-w-md text-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-900 dark:text-blue-200 italic">
              "{transcript}"
            </div>
          )}
        </div>

        {/* Conversation Dialogue Transcript */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-white dark:bg-slate-900">
          {conversation.map((entry, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${entry.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {entry.sender === 'gemini' && (
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm font-medium leading-relaxed ${
                  entry.sender === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                {entry.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Try asking by voice or tap to prompt:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendVoiceQuery(prompt)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
