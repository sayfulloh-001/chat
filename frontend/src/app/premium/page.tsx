'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Zap, Sparkles, Shield, Star } from 'lucide-react';

export default function PremiumPage() {
  const plans = [
    {
      name: 'VIP Standard',
      price: '$9.99',
      period: '/month',
      color: 'from-blue-600 to-indigo-600',
      features: ['Gender Filter Unlocked', 'Priority Match Queue', '500 Free Coins / Month', 'Ad-Free Experience'],
    },
    {
      name: 'Diamond VIP',
      price: '$19.99',
      period: '/month',
      popular: true,
      color: 'from-purple-600 to-pink-600',
      features: ['All VIP Features', 'Country & Regional Filters', 'Unlimited AI Translator', 'HD+ 1080p Ultra Stream', '1,500 Coins / Month', 'Verified Diamond Badge'],
    },
    {
      name: 'Ultra Lifetime',
      price: '$49.99',
      period: 'one-time',
      color: 'from-amber-500 to-yellow-600',
      features: ['Lifetime Access to All Filters', 'Instant Top Queue Priority', '5,000 Coins Bonus', 'Exclusive Virtual Gifts', 'Dedicated VIP Moderator Support'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
          <Crown className="w-4 h-4" /> Upgrade to NovaChat VIP
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Unlock Unlimited Matching Power
        </h1>
        <p className="text-slate-400 text-base">
          Get absolute control over your video chat experience with target gender filters, regional matching, AI voice subtitles, and priority queuing.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.03 }}
            className={`p-8 rounded-3xl glass-card border relative flex flex-col justify-between space-y-6 shadow-2xl ${
              plan.popular ? 'border-pink-500/50 shadow-pink-500/10' : 'border-white/10'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-white/10">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => alert('Subscribed to ' + plan.name + '! Welcome to NovaChat VIP.')}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-xl bg-gradient-to-r ${plan.color} hover:opacity-95 transition`}
            >
              Get Started Now ⚡
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
