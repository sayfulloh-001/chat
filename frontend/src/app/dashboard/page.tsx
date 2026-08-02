'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  Play,
  Filter,
  Globe,
  Users,
  Sparkles,
  Crown,
  Coins,
  Flame,
  CheckCircle,
  Zap,
  Heart,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [targetGender, setTargetGender] = useState<string>('All');
  const [targetCountry, setTargetCountry] = useState<string>('Global');
  const [selectedInterest, setSelectedInterest] = useState<string>('All');

  const interestsList = ['All', 'Gaming', 'Music', 'Travel', 'Anime', 'Fitness', 'Coding', 'Art'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner / User Welcome */}
      <div className="p-8 rounded-3xl glass-card border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5" /> Welcome back, {user?.name || 'Explorer'}!
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Ready to find your next match?
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Select your preferences below or jump straight into fast random matching with 100,000+ active users.
          </p>
        </div>

        {/* Quick Launch Button */}
        <div className="z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            href={`/video-chat?gender=${targetGender}&country=${targetCountry}`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold text-white glow-button-purple flex items-center justify-center gap-3 shadow-xl group"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition" />
            START VIDEO CHAT ⚡
          </Link>
        </div>
      </div>

      {/* Grid: Filters Panel & Active Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Filters Box (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" /> Match Preferences & Filters
            </h2>
            {!user?.isPremium && (
              <Link
                href="/premium"
                className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/20 transition"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Unlock VIP Filters
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender Filter */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Target Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Female', 'Male'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setTargetGender(g)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      targetGender === g
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {g === 'Female' ? '👧 Female' : g === 'Male' ? '👦 Male' : '⚡ All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Region / Country
              </label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              >
                <option value="Global">🌐 Global (Worldwide)</option>
                <option value="US">🇺🇸 United States</option>
                <option value="UZ">🇺🇿 Uzbekistan</option>
                <option value="ES">🇪🇸 Spain</option>
                <option value="JP">🇯🇵 Japan</option>
                <option value="DE">🇩🇪 Germany</option>
              </select>
            </div>
          </div>

          {/* Interests Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Match Interest Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedInterest(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedInterest === tag
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-400'
                      : 'bg-slate-900/80 text-slate-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Balance & Streak Widget */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" /> Wallet & Daily Streak
            </h3>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-300 font-bold uppercase">Coin Balance</div>
                <div className="text-2xl font-black text-amber-400">{user?.coins || 250} Coins</div>
              </div>
              <Link
                href="/premium"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg hover:bg-amber-400 transition"
              >
                Buy Coins
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-pink-400">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Daily Streak</div>
                  <div className="text-xs text-purple-300 font-semibold">5 Days Active (+50 coins)</div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/video-chat"
            className="w-full py-3 rounded-2xl glow-button-emerald text-slate-950 font-black text-center text-sm shadow-xl"
          >
            QUICK MATCH NOW 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}
