'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Plus, Heart, Eye, Sparkles, X } from 'lucide-react';

interface StoryItem {
  id: string;
  user: string;
  avatar: string;
  country: string;
  media: string;
  caption: string;
  likes: number;
}

const STORIES: StoryItem[] = [
  {
    id: 's1',
    user: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    country: '🇯🇵 Japan',
    media: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    caption: 'Tokyo night street lights ✨ #NovaVibe',
    likes: 389,
  },
  {
    id: 's2',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    country: '🇪🇸 Spain',
    media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'Barcelona sunset music setup 🌅 #Guitars',
    likes: 245,
  },
  {
    id: 's3',
    user: 'Malika Alimova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    country: '🇺🇿 Uzbekistan',
    media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    caption: 'Coding session in Tashkent 💻 #FullStack',
    likes: 512,
  },
];

export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Compass className="w-8 h-8 text-pink-400" /> Nova Stories & Highlights
          </h1>
          <p className="text-sm text-slate-400">
            Share 24-hour visual moments with video chat friends worldwide
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl glow-button-purple text-white font-extrabold text-xs flex items-center gap-2 shadow-xl">
          <Plus className="w-4 h-4" /> Post Your Story
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {STORIES.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStory(story)}
            className="relative h-96 rounded-3xl overflow-hidden glass-card border border-white/10 cursor-pointer group shadow-2xl"
          >
            <img src={story.media} alt={story.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
              <img src={story.avatar} alt={story.user} className="w-6 h-6 rounded-full object-cover" />
              <span>{story.user}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="text-xs font-bold text-purple-300">{story.country}</div>
              <p className="text-sm font-semibold text-white leading-snug">{story.caption}</p>
              <div className="flex items-center gap-4 text-xs text-rose-400 font-bold">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-rose-500" /> {story.likes} Likes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Full Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-card border border-purple-500/30 p-2 shadow-2xl">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={activeStory.media} alt={activeStory.caption} className="w-full aspect-[9/16] object-cover rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
