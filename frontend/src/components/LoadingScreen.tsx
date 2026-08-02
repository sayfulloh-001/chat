'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-2xl shadow-brand-500/50 animate-bounce">
          <Sparkles className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-wider bg-gradient-to-r from-white via-sky-300 to-indigo-300 bg-clip-text text-transparent">
        NEXUS ENTERPRISE
      </h2>
      <p className="text-xs text-slate-400 mt-2 animate-pulse">Yuklanmoqda...</p>
    </div>
  );
};
