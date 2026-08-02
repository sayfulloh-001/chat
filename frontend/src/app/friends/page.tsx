'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Video, CheckCircle, Search, ShieldCheck } from 'lucide-react';

interface FriendItem {
  id: string;
  name: string;
  username: string;
  country: string;
  avatarUrl: string;
  isOnline: boolean;
  statusText: string;
}

const FRIENDS_LIST: FriendItem[] = [
  {
    id: 'f1',
    name: 'Sophia Chen',
    username: 'sophia_vibe',
    country: 'Japan 🇯🇵',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    statusText: 'Exploring Tokyo Tokyo 🌸',
  },
  {
    id: 'f2',
    name: 'Malika Alimova',
    username: 'malika_uzb',
    country: 'Uzbekistan 🇺🇿',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    isOnline: true,
    statusText: 'Coding Next.js Apps 💻',
  },
  {
    id: 'f3',
    name: 'Alex Rivera',
    username: 'alex_superstar',
    country: 'Spain 🇪🇸',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    isOnline: false,
    statusText: 'Playing Guitar 🎸',
  },
];

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChat, setActiveChat] = useState<FriendItem | null>(FRIENDS_LIST[0]);
  const [messages, setMessages] = useState<Record<string, string[]>>({
    f1: ['Hey there! Loved matching with you on NovaChat! ✨', 'Are you online for a quick video call?'],
    f2: ['Salom Malika! Qalaysiz?', 'NovaChat platformasi juda ajoyib ishlarkan!'],
  });
  const [newMsg, setNewMsg] = useState('');

  const filteredFriends = FRIENDS_LIST.filter(
    (f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat) return;

    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));
    setNewMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 h-[calc(100vh-6rem)]">
      <div className="glass-card rounded-3xl border border-white/10 h-full grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-2xl">
        {/* Friends Sidebar (1 Col) */}
        <div className="md:col-span-1 border-r border-white/10 flex flex-col p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Connections ({FRIENDS_LIST.length})
            </h2>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex-grow overflow-y-auto space-y-2">
            {filteredFriends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setActiveChat(friend)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 transition border text-left ${
                  activeChat?.id === friend.id
                    ? 'bg-purple-600/30 border-purple-500/50'
                    : 'bg-slate-900/60 border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <img src={friend.avatarUrl} alt={friend.name} className="w-10 h-10 rounded-xl object-cover" />
                  {friend.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {friend.name}
                    <CheckCircle className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{friend.statusText}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Private Chat Interface (2 Cols) */}
        <div className="md:col-span-2 flex flex-col h-full bg-slate-950/40">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <img src={activeChat.avatarUrl} alt={activeChat.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {activeChat.name} <span className="text-xs font-normal text-purple-300">({activeChat.country})</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold">Online • Encrypted Private Stream</div>
                  </div>
                </div>

                <Link
                  href="/video-chat"
                  className="px-4 py-2 rounded-xl glow-button-purple text-xs font-extrabold text-white flex items-center gap-1.5 shadow-md"
                >
                  <Video className="w-4 h-4" /> Start Direct Call
                </Link>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3">
                {(messages[activeChat.id] || []).map((msg, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-purple-600/40 border border-purple-500/30 text-xs text-white max-w-md">
                    {msg}
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={`Send private message to ${activeChat.name}...`}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl glow-button-purple text-white font-extrabold text-xs shadow-lg">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Select a friend to open direct chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
