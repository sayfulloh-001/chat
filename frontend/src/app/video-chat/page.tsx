'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  SkipForward,
  Square,
  Monitor,
  Sparkles,
  ShieldCheck,
  Send,
  Smile,
  Gift,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Globe,
  Bot,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
  Flag,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

interface MessageItem {
  id: string;
  sender: 'you' | 'peer';
  text: string;
  translatedText?: string;
  time: string;
}

interface PeerInfo {
  name: string;
  country: string;
  countryCode: string;
  age: number;
  gender: string;
  avatarUrl: string;
  interests: string[];
  isVerified: boolean;
}

const SAMPLE_PEERS: PeerInfo[] = [
  {
    name: 'Sophia Chen',
    country: 'Japan',
    countryCode: 'JP',
    age: 21,
    gender: 'Female',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    interests: ['Anime', 'Fashion', 'Music'],
    isVerified: true,
  },
  {
    name: 'Malika Alimova',
    country: 'Uzbekistan',
    countryCode: 'UZ',
    age: 20,
    gender: 'Female',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    interests: ['Coding', 'UI Design', 'Books'],
    isVerified: true,
  },
  {
    name: 'Alex Rivera',
    country: 'Spain',
    countryCode: 'ES',
    age: 23,
    gender: 'Male',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    interests: ['Guitars', 'Travel', 'Sports'],
    isVerified: true,
  },
];

export default function VideoChatStudio() {
  const { user } = useAuth();
  const { socket } = useSocket();

  // State Management
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPeer, setCurrentPeer] = useState<PeerInfo | null>(null);
  
  // Media Toggles
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [bgBlur, setBgBlur] = useState(false);
  const [noiseGate, setNoiseGate] = useState(true);
  const [hdMode, setHdMode] = useState(true);

  // Chat & Gifts
  const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; icon: string }[]>([]);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [aiSubtitles, setAiSubtitles] = useState<string>('Listening for speech...');
  const [moderationAlert, setModerationAlert] = useState<string | null>(null);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize Camera Stream on Mount
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable. Using virtual camera preview.');
      }
    }
    initCamera();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle START Matchmaking
  const handleStartMatch = () => {
    setIsSearching(true);
    setIsConnected(false);
    setCurrentPeer(null);

    // Simulate match lookup or trigger socket room
    setTimeout(() => {
      const peer = SAMPLE_PEERS[Math.floor(Math.random() * SAMPLE_PEERS.length)];
      setCurrentPeer(peer);
      setIsSearching(false);
      setIsConnected(true);
      setAiSubtitles(`"Hello! Great to connect from ${peer.country}! 🌸"`);

      // Add welcome chat message
      setChatMessages([
        {
          id: '1',
          sender: 'peer',
          text: `Hey! I'm ${peer.name} from ${peer.country}. How are you doing today?`,
          translatedText: `[AI Tarjima: Salom! Men ${peer.country}lik ${peer.name}man. Qalaysiz?]`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  // Handle NEXT Peer Skip
  const handleNextMatch = () => {
    triggerReaction('⚡');
    handleStartMatch();
  };

  // Handle STOP Match
  const handleStopMatch = () => {
    setIsSearching(false);
    setIsConnected(false);
    setCurrentPeer(null);
  };

  // Toggle Camera
  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    }
    setCamOn(!camOn);
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    }
    setMicOn(!micOn);
  };

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing error:', err);
      }
    } else {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  // Reaction Trigger
  const triggerReaction = (icon: string) => {
    const id = Date.now();
    setFloatingReactions((prev) => [...prev, { id, icon }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  // Handle Sending Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'you',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate instant response from matched peer
    setTimeout(() => {
      if (isConnected) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'peer',
            text: 'That sounds amazing! Loved talking to you ✨',
            translatedText: '[AI Tarjima: Bu juda zo‘r eshitiladi! Siz bilan gaplashish yoqdi ✨]',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 1200);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Floating Reactions Container */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
        {floatingReactions.map((r) => (
          <div key={r.id} className="text-6xl animate-float-reaction absolute">
            {r.icon}
          </div>
        ))}
      </div>

      {/* Top Status Bar */}
      <div className="glass-card px-6 py-3 rounded-2xl flex items-center justify-between border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-black text-purple-400 uppercase tracking-widest">
            <Video className="w-4 h-4 text-pink-400 animate-pulse" /> HD WebRTC Studio
          </div>
          {isConnected && currentPeer && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-200">
              <span>{currentPeer.countryCode === 'UZ' ? '🇺🇿' : currentPeer.countryCode === 'JP' ? '🇯🇵' : '🇪🇸'}</span>
              <span>{currentPeer.name}, {currentPeer.age}</span>
              <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
            </div>
          )}
        </div>

        {/* AI Safety Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-extrabold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> AI Safety Verified
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-extrabold text-purple-300">
            <Bot className="w-3.5 h-3.5" /> Voice Translator Active
          </div>
        </div>
      </div>

      {/* Main Studio Layout (Dual Videos + Chat Sidebar) */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* Video Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Dual Screen Display Grid */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden glass-card p-3 border border-white/10 relative">
            {/* Peer Remote Video Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 border border-white/10 group">
              {isConnected && currentPeer ? (
                <>
                  <img
                    src={currentPeer.avatarUrl}
                    alt={currentPeer.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                      <span>{currentPeer.name}</span>
                      <span className="text-purple-400">({currentPeer.country})</span>
                    </div>

                    <button
                      onClick={() => setShowGiftModal(true)}
                      className="px-3 py-1.5 rounded-xl glow-button-purple text-xs font-extrabold text-white flex items-center gap-1.5 shadow-lg"
                    >
                      <Gift className="w-3.5 h-3.5" /> Send Gift
                    </button>
                  </div>

                  {/* AI Subtitle Overlay */}
                  <div className="relative z-10 space-y-2">
                    <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs text-slate-200 shadow-2xl flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400 flex-shrink-0 animate-pulse" />
                      <span>{aiSubtitles}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  {isSearching ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
                      <div className="text-lg font-black text-white">Searching for online match...</div>
                      <div className="text-xs text-purple-400">Filtering by Region & Interests</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                        <Play className="w-8 h-8 fill-purple-400" />
                      </div>
                      <div className="text-lg font-black text-white">Click START to match instantly</div>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Connect with 100,000+ active video chatters worldwide.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Local Video Stream Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 border border-white/10">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                  bgBlur ? 'blur-md scale-110' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>You ({user?.name || 'Local Stream'})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBgBlur(!bgBlur)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                      bgBlur ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900/80 text-slate-300 border-white/10'
                    }`}
                  >
                    Blur BG
                  </button>
                </div>
              </div>

              {/* Reaction Bar */}
              <div className="relative z-10 flex items-center justify-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 w-fit mx-auto">
                {['❤️', '🔥', '😂', '🎉', '⭐', '👏'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="p-2 hover:scale-125 transition text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Controls Toolbar (START, NEXT, STOP, Mic, Cam, Screen) */}
          <div className="glass-card p-3 rounded-2xl flex items-center justify-between border border-white/10 shadow-2xl">
            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartMatch}
                disabled={isSearching}
                className="px-6 py-3 rounded-xl glow-button-emerald text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" /> START
              </button>

              <button
                onClick={handleNextMatch}
                className="px-6 py-3 rounded-xl glow-button-purple text-white font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition"
              >
                <SkipForward className="w-4 h-4" /> NEXT ⚡
              </button>

              <button
                onClick={handleStopMatch}
                className="px-5 py-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-sm flex items-center gap-2 transition"
              >
                <Square className="w-4 h-4 fill-white" /> STOP
              </button>
            </div>

            {/* Media Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl border transition ${
                  micOn ? 'bg-slate-900 text-slate-200 border-white/10' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCam}
                className={`p-3 rounded-xl border transition ${
                  camOn ? 'bg-slate-900 text-slate-200 border-white/10' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl border transition ${
                  isScreenSharing ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-slate-200 border-white/10'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Text & Voice Chat Sidebar (1 Col) */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-4 flex flex-col border border-white/10 h-full overflow-hidden">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" /> Live Chat & AI Translation
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Realtime
            </span>
          </div>

          {/* Chat Messages Scrollable Box */}
          <div className="flex-grow py-3 overflow-y-auto space-y-3 pr-1">
            {chatMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-10">
                Messages sent during the video call will appear here with instant AI translation.
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs font-medium space-y-1 shadow-md ${
                      msg.sender === 'you'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 text-slate-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.translatedText && (
                      <div className="text-[10px] text-purple-300 italic pt-1 border-t border-white/10">
                        {msg.translatedText}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 pt-0.5">{msg.time}</span>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-grow px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl glow-button-purple text-white shadow-lg flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Gift Store Modal Popup */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-purple-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" /> Send Virtual Gift
                </h3>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Rose 🌹', cost: 50, icon: '🌹' },
                  { name: 'Diamond 💎', cost: 200, icon: '💎' },
                  { name: 'Rocket 🚀', cost: 500, icon: '🚀' },
                  { name: 'Crown 👑', cost: 1000, icon: '👑' },
                ].map((g) => (
                  <button
                    key={g.name}
                    onClick={() => {
                      triggerReaction(g.icon);
                      setShowGiftModal(false);
                    }}
                    className="p-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-purple-500 text-center space-y-1 transition"
                  >
                    <div className="text-3xl">{g.icon}</div>
                    <div className="text-xs font-bold text-white">{g.name}</div>
                    <div className="text-[10px] text-amber-400 font-extrabold">{g.cost} Coins</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
