
import React from 'react';
import { UserProfile, AppLanguage } from '../types';
import { authService } from '../services/authService';
import { formatCurrency } from '../services/stripeService';

interface ProfileSettingsProps {
  currentUser: UserProfile;
  language: AppLanguage;
  translations: any;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  currentUser, 
  language, 
  translations: t,
  onLogout,
  onSwitchRole
}) => {
  const isRTL = language === 'ar';

  const stats = [
    { label: language === 'ar' ? 'رحلات' : 'VOYAGES', value: '12', icon: '🎒' },
    { label: language === 'ar' ? 'مفضلة' : 'FAVORIS', value: '08', icon: '❤️' },
    { label: language === 'ar' ? 'نقاط' : 'POINTS', value: '450', icon: '✨' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Privacy Shield Banner */}
      <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-8 py-4 rounded-[2rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.25 9.447 3.462 13.463a11.954 11.954 0 0014.312 0c2.212-4.16 3.462-8.63 3.462-13.463z"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protection des Données Activée</p>
            <p className="text-[9px] font-bold text-emerald-800/60 uppercase">Seuls vous et l'administration LOCADZ pouvez voir vos coordonnées.</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="text-[8px] font-black bg-emerald-500 text-white px-3 py-1 rounded-lg uppercase">SSL SECURED</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] p-10 md:p-16 border border-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic select-none">PROFILE</div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-indigo-100 shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <img src={currentUser.avatar_url} className="w-full h-full object-cover" alt={currentUser.full_name} />
            </div>
            {currentUser.is_verified && (
              <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white p-4 rounded-3xl shadow-xl border-4 border-white animate-bounce-slow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em] mb-4">Membre Privé LOCADZ</p>
            <h1 className="text-5xl md:text-6xl font-black text-indigo-950 italic tracking-tighter uppercase mb-6">{currentUser.full_name}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${currentUser.id_verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                <span>{currentUser.id_verification_status === 'VERIFIED' ? '✓ IDENTITÉ VÉRIFIÉE' : '○ IDENTITÉ NON VÉRIFIÉE'}</span>
              </div>
              <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${currentUser.is_phone_verified ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                <span>{currentUser.is_phone_verified ? '✓ MOBILE VÉRIFIÉ' : '○ MOBILE NON VÉRIFIÉ'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center shadow-2xl transition-all hover:-translate-y-2">
            <span className="text-3xl block mb-4">{s.icon}</span>
            <p className="text-4xl font-black text-white italic tracking-tighter mb-2">{s.value}</p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-xl space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.4em]">Coordonnées Privées</h3>
            <span className="text-[8px] bg-indigo-50 text-indigo-400 px-2 py-1 rounded font-black">CONFIDENTIEL</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl">📧</div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                <p className="font-bold text-indigo-950">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl">📱</div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mobile</p>
                <p className="font-bold text-indigo-950">{currentUser.phone_number || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950/20 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.4em] mb-6">Actions Réseau</h3>
            <button 
              onClick={onSwitchRole}
              className="w-full py-5 bg-white text-indigo-950 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all mb-4 flex items-center justify-center gap-3"
            >
              <span>SWITCH TO HOST MODE</span>
              <span className="text-lg">🗝️</span>
            </button>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-5 border-2 border-rose-500/30 text-rose-500 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <span>DÉCONNEXION SÉCURISÉE</span>
            <span className="text-lg">🚪</span>
          </button>
        </div>
      </div>

      {/* Security Info Panel */}
      <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] text-center space-y-4">
        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Système de Protection LOCADZ</p>
        <p className="text-xs text-white/60 leading-relaxed max-w-2xl mx-auto italic">
          "Vos données sont protégées par notre infrastructure Cloud. Seules les informations nécessaires à la vérification légale sont traitées par nos modérateurs accrédités."
        </p>
      </div>

      <div className="text-center opacity-30 pt-10">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">LOCADZ Digital Identity System v3.0</p>
      </div>
    </div>
  );
};
