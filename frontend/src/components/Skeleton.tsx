'use client';

import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-6 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full" />
      ))}
    </div>
  );
};
