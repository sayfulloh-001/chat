'use client';

import React from 'react';
import Link from 'next/link';
import { Video, ShieldCheck, Heart, Globe, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-10 px-4 sm:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg glow-button-purple flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              NovaChat
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The world's leading real-time WebRTC video chat platform with AI moderation, auto-translation, and Apple-grade UI.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> 100% End-to-End Encrypted WebRTC Stream
          </div>
        </div>

        {/* Features Column */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/video-chat" className="hover:text-purple-400 transition">Instant Random Video Chat</Link></li>
            <li><Link href="/dashboard" className="hover:text-purple-400 transition">Gender & Country Filters</Link></li>
            <li><Link href="/premium" className="hover:text-purple-400 transition">AI Voice Subtitles</Link></li>
            <li><Link href="/stories" className="hover:text-purple-400 transition">24h Visual Stories</Link></li>
          </ul>
        </div>

        {/* Safety & Moderation */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">AI Safety</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Real-time Face Verification</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Fake Camera Detector</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Automated Toxicity Ban</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> 18+ ID Verification</li>
          </ul>
        </div>

        {/* Global Network */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Global Platform</h4>
          <p className="text-xs text-slate-400 mb-3">
            Connecting over 190 countries with ultra-low latency WebRTC TURN/STUN relay nodes.
          </p>
          <div className="flex items-center gap-2 text-xs text-purple-300 font-bold bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
            <Globe className="w-4 h-4 text-purple-400" /> NovaChat Live CDN Active
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2026 NovaChat Inc. All rights reserved. Built for Global Connections.</div>
        <div className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> for Full-Stack Excellence
        </div>
      </div>
    </footer>
  );
};
