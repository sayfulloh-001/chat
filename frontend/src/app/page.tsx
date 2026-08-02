'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  MessageSquare,
  Lock,
  ArrowRight,
  Play,
  Heart,
  Crown,
  Bot,
  UserCheck,
  Camera,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'video' | 'ai' | 'safety'>('video');

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 blur-[140px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Live Online Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/30 text-xs font-bold text-slate-200 mb-8 shadow-xl"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-extrabold">104,250+</span> People Online Right Now
          <span className="w-px h-3 bg-white/20 mx-1" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-purple-300">NovaChat 2.0 Released</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
        >
          Connect With The World In{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
            Real-Time HD Video
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Experience next-generation random video matching with AI auto-translation, background blur filters, face safety verification, and zero delay WebRTC streams.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/video-chat"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-extrabold text-white glow-button-purple flex items-center justify-center gap-3 shadow-2xl group"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition" />
            Start Video Chat Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-slate-200 glass-card hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            Explore Dashboard & Filters
          </Link>
        </motion.div>

        {/* Hero Interactive Mock Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto rounded-3xl p-3 glass-card border border-purple-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {/* Peer Video Card */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 group">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
                alt="Matched Peer"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

              {/* Top Peer Info */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                  <span>🇯🇵 Sophia, 21</span>
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white">
                  Matched
                </div>
              </div>

              {/* Bottom Captions Subtitles */}
              <div className="relative z-10 space-y-2">
                <div className="bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs text-slate-200 font-medium text-left shadow-lg">
                  <span className="text-purple-400 font-bold">AI Subtitle: </span>
                  "Hello! So excited to connect from Tokyo! 🌸"
                </div>
              </div>
            </div>

            {/* Local Video Card */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="You"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                  🇺🇸 You (HD 1080p)
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Face Verified
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-center gap-3 py-2">
                <div className="px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-lg animate-bounce">
                  NEXT ⚡
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Built For Unmatched Speed & Safety
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need for an unforgettable live video social experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl glass-card glass-card-hover border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white">1-Click Fast Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Match instantly with online users worldwide in under 0.2 seconds. Skip effortlessly with the NEXT button.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl glass-card glass-card-hover border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Real-Time AI Voice Subtitles</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Speak in your native language! AI translates your voice and text into Uzbek, English, Spanish, Japanese, and 50+ languages on the fly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl glass-card glass-card-hover border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white">AI Fake Camera & Auto-Ban</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our AI safety engine detects fake loop videos, inappropriate behavior, and face absence to keep the community safe 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto mb-20">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900/60 border border-purple-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Meet Extraordinary People?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            No registration friction required! Join 100,000+ active users enjoying HD video chat right now.
          </p>
          <div>
            <Link
              href="/video-chat"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-extrabold text-white glow-button-purple shadow-xl"
            >
              Launch NovaChat Studio 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
