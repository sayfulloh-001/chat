'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Camera, Mic, Volume2, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [blurDefault, setBlurDefault] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-black text-white">Platform Settings & Devices</h1>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Camera className="w-4 h-4 text-purple-400" /> Audio & Video Controls
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Default Video Background Blur</div>
              <div className="text-slate-400">Automatically blur camera background upon joining calls</div>
            </div>
            <input
              type="checkbox"
              checked={blurDefault}
              onChange={(e) => setBlurDefault(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">AI Noise Suppression</div>
              <div className="text-slate-400">Filter out background noise using Web Audio API</div>
            </div>
            <input
              type="checkbox"
              checked={noiseSuppression}
              onChange={(e) => setNoiseSuppression(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Real-Time AI Voice Subtitles</div>
              <div className="text-slate-400">Automatically generate live translated captions</div>
            </div>
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
