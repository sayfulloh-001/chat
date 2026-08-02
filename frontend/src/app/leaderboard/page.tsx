'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Flame, Coins, CheckCircle, Sparkles } from 'lucide-react';

const TOP_LEADERBOARD = [
  { rank: 1, name: 'Sophia Chen', country: '🇯🇵 Japan', coins: 4500, level: 24, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { rank: 2, name: 'Alex Rivera', country: '🇪🇸 Spain', coins: 3200, level: 19, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
  { rank: 3, name: 'Malika Alimova', country: '🇺🇿 Uzbekistan', coins: 2890, level: 16, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' },
  { rank: 4, name: 'Lucas Meyer', country: '🇩🇪 Germany', coins: 1950, level: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl glow-button-purple mx-auto flex items-center justify-center text-white text-2xl shadow-xl">
          <Trophy className="w-7 h-7 text-amber-300" />
        </div>
        <h1 className="text-3xl font-black text-white">NovaChat Global Rankings</h1>
        <p className="text-sm text-slate-400">Top gifters, most popular video stars, and level champions</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
        {/* Rank 2 */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 text-center space-y-3 flex flex-col items-center justify-end">
          <img src={TOP_LEADERBOARD[1].avatar} alt={TOP_LEADERBOARD[1].name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300" />
          <div className="text-xs font-black text-slate-300">#2 {TOP_LEADERBOARD[1].name}</div>
          <div className="text-[10px] text-amber-400 font-extrabold">{TOP_LEADERBOARD[1].coins} Coins</div>
        </div>

        {/* Rank 1 (Crown) */}
        <div className="p-6 rounded-3xl glass-card border border-amber-500/40 text-center space-y-3 flex flex-col items-center justify-end shadow-2xl relative">
          <Crown className="w-8 h-8 text-amber-400 fill-amber-400 absolute -top-4" />
          <img src={TOP_LEADERBOARD[0].avatar} alt={TOP_LEADERBOARD[0].name} className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-400" />
          <div className="text-sm font-black text-white">#1 {TOP_LEADERBOARD[0].name}</div>
          <div className="text-xs text-amber-400 font-extrabold">{TOP_LEADERBOARD[0].coins} Coins</div>
        </div>

        {/* Rank 3 */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 text-center space-y-3 flex flex-col items-center justify-end">
          <img src={TOP_LEADERBOARD[2].avatar} alt={TOP_LEADERBOARD[2].name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-600" />
          <div className="text-xs font-black text-slate-300">#3 {TOP_LEADERBOARD[2].name}</div>
          <div className="text-[10px] text-amber-400 font-extrabold">{TOP_LEADERBOARD[2].coins} Coins</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
        {TOP_LEADERBOARD.map((user) => (
          <div key={user.rank} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="w-8 text-center text-sm font-black text-slate-400">#{user.rank}</span>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {user.name} <span className="text-xs font-normal text-purple-300">({user.country})</span>
                </div>
                <div className="text-[10px] text-purple-400 font-semibold">Level {user.level} Champion</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" /> {user.coins}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
