'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Crown, Coins, ShieldCheck, Globe, Trophy, Heart } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="p-8 rounded-3xl glass-card border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
          alt={user?.name || 'User'}
          className="w-28 h-28 rounded-3xl object-cover border-4 border-purple-500/50 shadow-xl"
        />
        <div className="space-y-2 text-center sm:text-left flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            {user?.isPremium && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP Member
              </span>
            )}
          </div>
          <p className="text-xs text-purple-300 font-semibold">@{user?.username || 'nova_user'} • {user?.country || 'United States'}</p>
          <p className="text-xs text-slate-300 italic">{user?.bio || 'Hey there! I am using NovaChat to meet awesome people worldwide.'}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Coin Balance</div>
          <div className="text-xl font-black text-amber-400">{user?.coins || 250}</div>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Player Level</div>
          <div className="text-xl font-black text-purple-400">Lvl {user?.level || 1}</div>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Matches</div>
          <div className="text-xl font-black text-emerald-400">142 Calls</div>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Reputation</div>
          <div className="text-xl font-black text-sky-400">99.8% High</div>
        </div>
      </div>
    </div>
  );
}
