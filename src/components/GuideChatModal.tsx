import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, MapPin, Sparkles, User, MessageCircle, Bot } from 'lucide-react';
import { LocalGuide, GuideMessage } from '../types';
import { sendGuideChatMessage, subscribeGuideChat } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface GuideChatModalProps {
  guide: LocalGuide | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  onBookGuide: (guide: LocalGuide) => void;
}

export const GuideChatModal: React.FC<GuideChatModalProps> = ({
  guide,
  isOpen,
  onClose,
  currentUser,
  onBookGuide,
}) => {
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message if no messages yet
  useEffect(() => {
    if (!guide || !isOpen) return;

    // Listen to real-time messages from Firestore
    const unsubscribe = subscribeGuideChat(guide.id, (firestoreMessages) => {
      if (firestoreMessages.length > 0) {
        setMessages(firestoreMessages);
      } else {
        // Seed initial friendly message from guide
        const initialMsg: GuideMessage = {
          id: 'init-msg',
          guideId: guide.id,
          guideName: guide.name,
          sender: 'guide',
          senderName: guide.name,
          text: `Salam! I am ${guide.name}, your verified local guide for ${guide.district}. How can I help you plan your journey? Feel free to ask about transport, cottages, or custom itineraries!`,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMsg]);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [guide, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !guide) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend) return;

    const userMsg: GuideMessage = {
      id: 'usr-' + Date.now(),
      guideId: guide.id,
      guideName: guide.name,
      sender: 'user',
      senderName: currentUser?.displayName || 'Traveler',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Save user message to Firestore
    try {
      await sendGuideChatMessage({
        guideId: guide.id,
        guideName: guide.name,
        sender: 'user',
        senderName: userMsg.senderName,
        text: textToSend,
        timestamp: userMsg.timestamp,
      });
    } catch (e) {
      console.warn('Could not save user message to firestore:', e);
    }

    // Trigger realistic AI-powered guide reply via server endpoint
    setIsTyping(true);
    try {
      const response = await fetch('/api/gemini/guide-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideName: guide.name,
          district: guide.district,
          userMessage: textToSend,
        }),
      });
      const data = await response.json();
      const replyText = data.reply || `Salam! I got your message regarding ${guide.district}. I will organize everything for you.`;

      const guideReply: GuideMessage = {
        id: 'gd-' + Date.now(),
        guideId: guide.id,
        guideName: guide.name,
        sender: 'guide',
        senderName: guide.name,
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, guideReply]);

      // Save guide reply to Firestore
      await sendGuideChatMessage({
        guideId: guide.id,
        guideName: guide.name,
        sender: 'guide',
        senderName: guide.name,
        text: replyText,
        timestamp: guideReply.timestamp,
      });
    } catch (err) {
      console.error('Error fetching guide auto reply:', err);
      // Fallback response
      const fallbackReply: GuideMessage = {
        id: 'gd-' + Date.now(),
        guideId: guide.id,
        guideName: guide.name,
        sender: 'guide',
        senderName: guide.name,
        text: `Salam! I am right here in ${guide.district}. I can arrange your local transport, authentic meals, and secure cottages. Would you like to book for specific dates?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    `Can you plan a 3-day itinerary in ${guide.district}?`,
    `What is the best transport and road condition?`,
    `Can you arrange private 4x4 Jeep / Boat?`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
              <img src={guide.photo} alt={guide.name} className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {guide.name}
                </h3>
                <span title="Verified Local Guide">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>{guide.district} • Rate: ৳{guide.dailyRateBDT}/day</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBookGuide(guide);
              }}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Book Guide
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={guide.photo}
                    alt={guide.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                  />
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-blue-900 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <p className="font-semibold">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 font-medium ${
                      isMe ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <img src={guide.photo} alt={guide.name} className="w-6 h-6 rounded-full object-cover" />
              <span>{guide.name} is typing a recommendation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Message ${guide.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white transition-all shadow cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
