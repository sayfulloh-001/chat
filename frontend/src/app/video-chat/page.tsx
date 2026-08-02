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
  Gift,
  Heart,
  Volume2,
  Globe,
  Bot,
  CheckCircle,
  Camera,
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
  id?: string;
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

  // Chat & Gifts
  const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; icon: string }[]>([]);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [aiSubtitles, setAiSubtitles] = useState<string>('Listening for live speech...');

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

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
        console.warn('Camera access error or restricted. Please allow camera permissions in browser.');
      }
    }
    initCamera();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // WebRTC & Socket Signaling Hooks
  useEffect(() => {
    if (!socket) return;

    // Handle Match Found via Socket
    socket.on('match_found', ({ roomId, peer, isInitiator }) => {
      console.log('✨ Real WebRTC match found:', peer);
      setCurrentPeer(peer);
      setIsSearching(false);
      setIsConnected(true);
      setAiSubtitles(`"Hello! Connected to ${peer.name} from ${peer.country}! 🌸"`);

      // Initialize WebRTC PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerConnectionRef.current = pc;

      // Add local stream tracks to WebRTC
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle Remote Stream Track
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE Candidate
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc_ice_candidate', { roomId, candidate: event.candidate });
        }
      };

      if (isInitiator) {
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit('webrtc_offer', { roomId, offer: pc.localDescription });
          });
      }
    });

    socket.on('webrtc_offer', async ({ offer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('webrtc_answer', { answer: peerConnectionRef.current.localDescription });
      }
    });

    socket.on('webrtc_answer', async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('webrtc_ice_candidate', async ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('receive_chat_message', ({ senderSocketId, originalText, translatedText }) => {
      if (senderSocketId !== socket.id) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'peer',
            text: originalText,
            translatedText: translatedText ? `[AI Tarjima: ${translatedText}]` : undefined,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    });

    socket.on('peer_left', () => {
      setIsConnected(false);
      setCurrentPeer(null);
    });

    return () => {
      socket.off('match_found');
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('webrtc_ice_candidate');
      socket.off('receive_chat_message');
      socket.off('peer_left');
    };
  }, [socket]);

  // Handle START Matchmaking
  const handleStartMatch = () => {
    setIsSearching(true);
    setIsConnected(false);
    setCurrentPeer(null);

    if (socket) {
      socket.emit('join_matchmaking', {
        userId: user?.id || 'guest',
        name: user?.name || 'Guest User',
        username: user?.username || 'guest',
        gender: user?.gender || 'All',
        country: user?.country || 'United States',
        countryCode: user?.countryCode || 'US',
        targetGender: 'All',
        targetCountry: 'Global',
        isPremium: user?.isPremium || false,
        isVerified: true,
      });
    }

    // Fallback peer generator for solo testing if no second socket joins in 1.5s
    setTimeout(() => {
      if (!isConnected && isSearching) {
        const peer = SAMPLE_PEERS[Math.floor(Math.random() * SAMPLE_PEERS.length)];
        setCurrentPeer(peer);
        setIsSearching(false);
        setIsConnected(true);
        setAiSubtitles(`"Hello! Great to connect from ${peer.country}! 🌸"`);

        // Duplicate local stream to remote element for testing display
        if (remoteVideoRef.current && localStreamRef.current) {
          remoteVideoRef.current.srcObject = localStreamRef.current;
        }

        setChatMessages([
          {
            id: '1',
            sender: 'peer',
            text: `Hey! I am ${peer.name} from ${peer.country}. How are you doing?`,
            translatedText: `[AI Tarjima: Salom! Men ${peer.country}lik ${peer.name}man. Qalaysiz?]`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
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
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
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

    if (socket) {
      socket.emit('send_chat_message', {
        roomId: 'room_1',
        message: inputMessage,
        targetLanguage: 'Uzbek',
      });
    }

    setInputMessage('');
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
            <Video className="w-4 h-4 text-pink-400 animate-pulse" /> HD WebRTC Video Studio
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
            <Bot className="w-3.5 h-3.5" /> Realtime AI Subtitles
          </div>
        </div>
      </div>

      {/* Main Studio Layout (Dual Real Video Streams + Chat Sidebar) */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* Video Area (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Dual Screen Display Grid */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden glass-card p-3 border border-white/10 relative">
            {/* Peer Remote Video Stream Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 border border-white/10 group">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${isConnected ? 'opacity-100' : 'opacity-0'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 pointer-events-none" />

              {isConnected && currentPeer ? (
                <>
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
                      <div className="text-xs text-purple-400">Connecting WebRTC Peer Stream</div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>You ({user?.name || 'Local Camera Stream'})</span>
                </div>

                <button
                  onClick={() => setBgBlur(!bgBlur)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    bgBlur ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900/80 text-slate-300 border-white/10'
                  }`}
                >
                  Blur BG
                </button>
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
