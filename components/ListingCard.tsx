
import React, { useState } from 'react';
import { Property } from '../types';
import { formatCurrency } from '../services/stripeService';

interface ListingCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
  accentColor?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  property, 
  onToggleFavorite,
  accentColor = '#6366f1'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-6 transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-8 hover:bg-white/10 hover:shadow-[0_100px_150px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden border-t-white/20"
    >
      {/* 🔮 Glossy Shine Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[4rem] pointer-events-none`}></div>
      
      {/* 🖼️ Portal Image */}
      <div className="aspect-[1/1.15] relative rounded-[3.5rem] overflow-hidden bg-black mb-10 shadow-2xl">
        <img 
          src={property.images[0]?.image_url} 
          className="w-full h-full object-cover transition-transform duration-[6s] ease-out group-hover:scale-125 group-hover:rotate-1" 
          alt={property.title} 
        />
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90" />

        {/* 🤖 AI & Luxury Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-4">
          {property.rating > 4.9 && (
            <div 
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 shadow-lg animate-in slide-in-from-left duration-1000"
              style={{ background: `linear-gradient(to right, ${accentColor}, #8b5cf6)` }}
            >
              <span className="text-base">🪄</span>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.25em]">Gemini Recommended</span>
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 text-[8px] font-black text-white uppercase tracking-[0.4em] w-fit shadow-xl group-hover:border-white/40 transition-colors">
            {property.category}
          </div>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(property.id); }}
          className={`absolute top-8 right-8 p-5 bg-black/40 backdrop-blur-3xl rounded-full border border-white/10 transition-all hover:bg-rose-500 hover:border-rose-400 active:scale-75 group/fav z-20`}
        >
          <svg className={`w-6 h-6 transition-transform ${property.isFavorite ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-white'}`} viewBox="0 0 24 24">
            <path strokeWidth="3" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* 📍 Location Label Overlay */}
        <div className="absolute bottom-10 left-10 right-10 animate-in fade-in duration-1000">
           <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.6em] mb-2">Algérie • Verified</p>
           <h4 className="text-white text-4xl font-black italic tracking-tighter uppercase leading-[0.9]">{property.location}</h4>
        </div>
      </div>

      {/* 📝 Details Area */}
      <div className="px-6 space-y-8 pb-4">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <h3 className="text-white font-bold uppercase text-[11px] tracking-[0.3em] truncate max-w-[220px] opacity-60 group-hover:opacity-100 transition-opacity">
              {property.title}
            </h3>
            <div className="flex items-center gap-2 bg-white/5 w-fit px-4 py-2 rounded-xl">
               <span className="text-amber-400 text-sm">★</span>
               <span className="text-[11px] font-black text-white/80">{property.rating}</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-white/30 uppercase mb-2 tracking-widest">Dès</p>
             <p className="text-4xl font-black text-white tracking-tighter italic leading-none">{formatCurrency(property.price)}</p>
          </div>
        </div>

        {/* 🪄 Gemini Insight Peek (Smooth reveal) */}
        <div className={`overflow-hidden transition-all duration-[1200ms] ${isHovered ? 'max-h-32 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="pt-8 border-t border-white/10 flex items-start gap-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse transition-colors duration-1000"
              style={{ backgroundColor: `${accentColor}33` }}
            >
               <span className="text-sm">✨</span>
            </div>
            <p className="text-[11px] text-white/50 font-medium leading-relaxed italic">
              "L'IA Gemini recommande ce lieu pour son {property.category === 'sahara' ? 'atmosphère mystique et son calme absolu' : 'design contemporain et son emplacement premium'}."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
