
import React from 'react';
import { LocadzLogo } from './Navbar';
import { AppLanguage } from '../types';

interface AuthLandingProps {
  onOpenAuth: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  translations: any;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ 
  onOpenAuth, 
  language, 
  onLanguageChange, 
  translations: t 
}) => {
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Horizon Background - Luxury Aube */}
      <div className="absolute inset-0 z-[-1] overflow-hidden bg-[#050505]">
        {/* Soft Golden Mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] opacity-[0.15] animate-drift"
             style={{ background: 'radial-gradient(circle at 30% 30%, #4f46e5 0%, transparent 60%), radial-gradient(circle at 70% 70%, #f59e0b 0%, transparent 60%)' }} />
        <div className="absolute inset-0 bg-grain opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-[100] bg-white/5 backdrop-blur-3xl p-2 rounded-full border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
        <button 
          onClick={() => onLanguageChange('fr')} 
          className={`px-5 py-2 rounded-full text-[10px] font-black transition-all duration-500 ${language === 'fr' ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white'}`}
        >FR</button>
        <button 
          onClick={() => onLanguageChange('en')} 
          className={`px-5 py-2 rounded-full text-[10px] font-black transition-all duration-500 ${language === 'en' ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white'}`}
        >EN</button>
        <button 
          onClick={() => onLanguageChange('ar')} 
          className={`px-6 py-2 rounded-full text-[11px] font-black transition-all duration-500 ${language === 'ar' ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white'}`}
        >AR</button>
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-[2000ms] w-full max-w-4xl relative">
        <div className="flex justify-center mb-6">
          <span className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-white/60 uppercase tracking-[0.4em] shadow-xl">
            {t.privateAccess}
          </span>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-white/5 p-4 rounded-[4rem] backdrop-blur-3xl border border-white/10 shadow-2xl animate-slow-zoom">
            <LocadzLogo className="w-24 h-24 md:w-32 md:h-32" />
          </div>
        </div>

        <h1 className="text-7xl md:text-[10rem] font-black text-white mb-6 tracking-tighter drop-shadow-2xl uppercase">
          LOCA<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 italic">DZ</span>
        </h1>
        
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-2xl space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white italic tracking-tight leading-tight opacity-90">
              {t.authSlogan}
            </h2>
            <p className="text-white/40 font-medium text-sm md:text-base leading-relaxed">
              {t.authSub}
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={onOpenAuth}
              className="px-14 py-6 bg-white text-indigo-950 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-xs hover:scale-105 hover:bg-indigo-50 active:scale-95 transition-all shadow-2xl flex items-center gap-5 group"
            >
              <span>{t.authBtn}</span>
              <div className={`bg-indigo-950 p-2 rounded-full text-white transition-transform ${isRTL ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 opacity-20 pb-24 md:pb-0">
           <div className="h-16 w-[1px] bg-gradient-to-b from-white to-transparent"></div>
           <p className="text-white text-[9px] font-black uppercase tracking-[0.5em]">{t.securityVerify}</p>
        </div>
      </div>
    </div>
  );
};
