'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Sparkles,
  Users,
  Compass,
  Trophy,
  Crown,
  Shield,
  User,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Video Chat', href: '/video-chat', icon: Video, highlight: true },
    { name: 'Dashboard', href: '/dashboard', icon: Sparkles },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Stories', href: '/stories', icon: Compass },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Premium', href: '/premium', icon: Crown, badge: 'VIP' },
    { name: 'Admin', href: '/admin', icon: Shield, adminOnly: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl glow-button-purple flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              NovaChat
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              104,250+ Online
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            if (link.adminOnly && user?.role !== 'ADMIN') return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-purple-600/80 to-indigo-600/80 shadow-md border border-purple-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.highlight ? 'text-pink-400' : ''}`} />
                {link.name}
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-md">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Stats & Profile Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Coin Counter */}
              <Link
                href="/premium"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm hover:bg-amber-500/20 transition"
              >
                <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{user.coins}</span>
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 transition group"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover border-2 border-purple-500/50 group-hover:border-purple-400 transition"
                  />
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      {user.name}
                      {user.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="text-[10px] text-purple-400 font-semibold">Lvl {user.level} Star</div>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-bold text-white glow-button-purple rounded-xl shadow-lg"
              >
                Start Chatting
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              if (link.adminOnly && user?.role !== 'ADMIN') return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 font-semibold bg-slate-900/80 hover:bg-purple-600/30 border border-white/5"
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
