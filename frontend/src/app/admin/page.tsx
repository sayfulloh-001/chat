'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Video, AlertTriangle, Ban, CheckCircle, RefreshCw, DollarSign, Activity, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 14890,
    onlineUsers: 104250,
    activeVideoSessions: 4120,
    pendingReports: 3,
    bannedUsersCount: 142,
    revenueMonthlyUSD: 14850.0,
  });

  const [reports, setReports] = useState([
    {
      id: 'rep_1',
      reporter: 'sophia_vibe',
      reportedUser: 'alex_superstar',
      reportedUserId: 'u1',
      reason: 'Inappropriate language in chat',
      status: 'PENDING',
      time: '10 mins ago',
    },
    {
      id: 'rep_2',
      reporter: 'malika_uzb',
      reportedUser: 'user_spammer',
      reportedUserId: 'u2',
      reason: 'Fake Camera Static Loop Detected by AI',
      status: 'PENDING',
      time: '25 mins ago',
    },
  ]);

  const handleBanUser = (reportId: string, username: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setStats((prev) => ({ ...prev, bannedUsersCount: prev.bannedUsersCount + 1 }));
    alert(`User ${username} has been permanently banned from NovaChat.`);
  };

  const handleDismissReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-rose-500" /> Executive Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Real-time session monitoring, AI moderation logs, user management & revenue analytics
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="text-xs text-slate-400 font-bold uppercase flex items-center justify-between">
            Online Users <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.onlineUsers.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Global WebRTC Mesh Active</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="text-xs text-slate-400 font-bold uppercase flex items-center justify-between">
            Active Calls <Video className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{stats.activeVideoSessions.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Live Video Match Rooms</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="text-xs text-slate-400 font-bold uppercase flex items-center justify-between">
            Pending Reports <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{reports.length}</div>
          <div className="text-[10px] text-slate-400">Requires Moderator Action</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="text-xs text-slate-400 font-bold uppercase flex items-center justify-between">
            Monthly Revenue <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">${stats.revenueMonthlyUSD.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">VIP Subscriptions & Gifts</div>
        </div>
      </div>

      {/* Reports & Moderation Queue */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" /> Moderation & Reports Queue
        </h2>

        {reports.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-8">
            No pending user reports. All live sessions are compliant with safety rules.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-rose-400">Reported: @{rep.reportedUser}</span>
                    <span className="text-slate-400 font-normal">by @{rep.reporter}</span>
                  </div>
                  <div className="text-slate-300">Reason: {rep.reason}</div>
                  <div className="text-[10px] text-slate-500">{rep.time}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBanUser(rep.id, rep.reportedUser)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" /> Ban User
                  </button>
                  <button
                    onClick={() => handleDismissReport(rep.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
