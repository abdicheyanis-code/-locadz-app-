
import React from 'react';
import { formatCurrency } from '../services/stripeService';

interface FilterBarProps {
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  minReviews: number;
  setMinReviews: (val: number) => void;
  onReset: () => void;
  accentColor?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  onReset,
  accentColor = '#6366f1'
}) => {
  return (
    <div className="flex flex-wrap items-center gap-10 p-10 mb-8 bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-[1200ms]">
      
      {/* Price Range */}
      <div className="flex flex-col gap-5 min-w-[320px] flex-1 group">
        <div className="flex justify-between items-center">
          <label 
            className="text-[10px] font-black uppercase tracking-[0.5em] transition-colors duration-1000"
            style={{ color: isFinite(maxPrice) ? `${accentColor}99` : 'rgba(255,255,255,0.4)' }}
          >
            Budget Max (DZD)
          </label>
          <span className="text-2xl font-black text-white italic tracking-tighter">{formatCurrency(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="5000"
          max="200000"
          step="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer transition-all"
          style={{ accentColor: accentColor }}
        />
      </div>

      <div className="h-16 w-[1px] bg-white/5 hidden lg:block"></div>

      {/* Ratings Filter */}
      <div className="flex flex-col gap-5 min-w-[220px]">
        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Excellence</label>
        <div className="flex gap-4">
          {[4.5, 4.8, 4.9].map((val) => {
            const isActive = minRating === val;
            return (
              <button
                key={val}
                onClick={() => setMinRating(minRating === val ? 0 : val)}
                className={`px-6 py-3 rounded-full text-[10px] font-black tracking-widest transition-all border ${
                  isActive 
                  ? 'bg-white text-indigo-950 border-white shadow-[0_15px_30px_rgba(255,255,255,0.2)] scale-110' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
                style={isActive ? { border: `2px solid ${accentColor}` } : {}}
              >
                {val}+ ★
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="ml-auto px-12 py-5 bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-rose-500/20 transition-all active:scale-95 shadow-2xl"
      >
        Réinitialiser
      </button>
    </div>
  );
};
