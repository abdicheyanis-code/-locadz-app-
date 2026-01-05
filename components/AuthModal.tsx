
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, UserProfile, AppLanguage } from '../types';
import { authService } from '../services/authService';
import { LocadzLogo } from './Navbar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  language: AppLanguage;
}

const AUTH_TRANSLATIONS: Record<AppLanguage, any> = {
  fr: {
    portal: "Portail Membre",
    req: "Identification Requise",
    member: "Déjà Membre",
    join: "Devenir Membre",
    name: "Nom & Prénom",
    email: "Email Professionnel",
    phone: "Numéro Mobile (Algérie)",
    phoneHint: "Ex: 0550 12 34 56",
    role: "Rôle Réseau",
    traveler: "Voyageur",
    host: "Hôte",
    access: "ACCÉDER AU RÉSEAU",
    joinBtn: "DEMANDER L'ADHÉSION",
    codeTitle: "Vérification de l'Email",
    verifyEmail: "Un code de sécurité a été envoyé à",
    verifyBtn: "ACTIVER MON COMPTE",
    defaultCode: "Vérifiez la console (F12) pour le code de test",
    resend: "Renvoyer le code",
    resendSuccess: "Code renvoyé !",
    invalidPhone: "Numéro invalide. Format : 05, 06 ou 07 + 8 chiffres.",
    invalidEmail: "Format d'email incorrect.",
    noAccount: "Compte introuvable. Veuillez d'abord vous inscrire.",
    emailExists: "Cet email est déjà enregistré.",
    loginInstead: "Se connecter maintenant"
  },
  en: {
    portal: "Member Portal",
    req: "Identification Required",
    member: "Already a Member",
    join: "Become a Member",
    name: "Full Name",
    email: "Professional Email",
    phone: "Mobile Number (Algeria)",
    phoneHint: "Ex: 0550 12 34 56",
    role: "Network Role",
    traveler: "Traveler",
    host: "Host",
    access: "ACCESS NETWORK",
    joinBtn: "REQUEST MEMBERSHIP",
    codeTitle: "Email Verification",
    verifyEmail: "A security code was sent to",
    verifyBtn: "ACTIVATE MY ACCOUNT",
    defaultCode: "Check F12 console for test code",
    resend: "Resend code",
    resendSuccess: "Code sent!",
    invalidPhone: "Invalid phone. Format: 05, 06 or 07 + 8 digits.",
    invalidEmail: "Incorrect email format.",
    noAccount: "Account not found. Please register first.",
    emailExists: "This email is already registered.",
    loginInstead: "Login instead"
  },
  ar: {
    portal: "بوابة الأعضاء",
    req: "الهوية مطلوبة",
    member: "لديك حساب",
    join: "عضوية جديدة",
    name: "الاسم واللقب",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف (الجزائر)",
    phoneHint: "مثال: 0550 12 34 56",
    role: "الدور في الشبكة",
    traveler: "مسافر",
    host: "مضيف",
    access: "دخول الشبكة",
    joinBtn: "تفعيل العضوية",
    codeTitle: "تأكيد البريد الإلكتروني",
    verifyEmail: "تم إرسال رمز الأمان إلى",
    verifyBtn: "تفعيل حسابي",
    defaultCode: "تحقق من F12 للحصول على الرمز",
    resend: "إعادة إرسال الرمز",
    resendSuccess: "تم الإرسال !",
    invalidPhone: "رقم غير صحيح. يبدأ بـ 05، 06 أو 07 متبوعًا بـ 8 أرقام.",
    invalidEmail: "صيغة البريد الإلكتروني غير صحيحة.",
    noAccount: "الحساب غير موجود. يرجى التسجيل أولاً.",
    emailExists: "هذا البريد الإلكتروني مسجل بالفعل.",
    loginInstead: "سجل دخولك الآن"
  }
};

type AuthStage = 'FORM' | 'VERIFY';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const [stage, setStage] = useState<AuthStage>('FORM');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('TRAVELER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState(false);
  
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const t = AUTH_TRANSLATIONS[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!isOpen) {
      setStage('FORM');
      setError('');
      setIsLoading(false);
      setCode(['', '', '', '']);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Format Algérie : 05, 06, 07 suivi de 8 chiffres
    return /^(0)(5|6|7)[0-9]{8}$/.test(phone.replace(/\s/g, ''));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation Email
    if (!validateEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    // Validation Téléphone (uniquement en inscription)
    if (!isLogin && !validatePhone(phone)) {
      setError(t.invalidPhone);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(email);
        if (user) {
          if (!user.is_verified) {
            authService.resendCode(email);
            setStage('VERIFY');
          } else {
            onSuccess(user);
          }
        } else {
          setError(t.noAccount);
        }
      } else {
        const { user, error: regError } = await authService.register(fullName, email, phone, role);
        if (regError === "EMAIL_EXISTS") {
          setError(t.emailExists);
        } else if (regError) {
          setError(regError);
        } else if (user) {
          setStage('VERIFY');
        }
      }
    } catch (err: any) {
      setError("Erreur de connexion Cloud Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== '' && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some(d => d === '')) return;
    
    setIsLoading(true);
    const user = await authService.verifyAccount(email, code.join(''));
    if (user) onSuccess(user);
    else {
      setError("Code invalide ou expiré.");
      setIsLoading(false);
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-2xl animate-in fade-in duration-500" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.6)] border border-white/50 overflow-hidden relative">
        <button onClick={onClose} className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'} text-gray-400 hover:text-indigo-600 transition-all active:scale-90 z-20`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-10 pt-12">
          <div className="text-center mb-10">
            <div className="inline-block p-1 bg-white/10 rounded-[2rem] mb-4 shadow-xl">
              <LocadzLogo className="w-14 h-14" />
            </div>
            <h2 className="text-3xl font-black text-indigo-950 italic tracking-tight uppercase">{stage === 'FORM' ? t.portal : t.codeTitle}</h2>
            <p className="text-indigo-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">{t.req}</p>
          </div>

          {stage === 'FORM' ? (
            <>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                <button onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}>{t.member}</button>
                <button onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}>{t.join}</button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">{t.name}</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      required 
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300" 
                      placeholder="Nom complet" 
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">{t.email}</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300 ${error === t.invalidEmail ? 'border-rose-500' : 'border-gray-100'}`} 
                    placeholder="votre@email.com" 
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">{t.phone}</label>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        required 
                        className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300 ${error === t.invalidPhone ? 'border-rose-500' : 'border-gray-100'}`} 
                        placeholder={t.phoneHint} 
                        maxLength={10}
                      />
                    </div>
                    <div className="pt-2">
                      <label className="text-[9px] font-black uppercase text-indigo-300 mb-2 block ml-4">{t.role}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setRole('TRAVELER')} className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${role === 'TRAVELER' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-gray-50 text-gray-300 bg-gray-50/50'}`}>
                          <span className="text-xl">🎒</span><span className="text-[8px] font-black uppercase tracking-widest">{t.traveler}</span>
                        </button>
                        <button type="button" onClick={() => setRole('HOST')} className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${role === 'HOST' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-gray-50 text-gray-300 bg-gray-50/50'}`}>
                          <span className="text-xl">🗝️</span><span className="text-[8px] font-black uppercase tracking-widest">{t.host}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-4 rounded-2xl border bg-rose-50 border-rose-100 text-center animate-in fade-in zoom-in-95">
                    <p className="text-rose-500 text-[9px] font-black uppercase leading-relaxed">{error}</p>
                    {error === t.emailExists && (
                      <button 
                        type="button" 
                        onClick={() => { setIsLogin(true); setError(''); }} 
                        className="mt-2 text-[10px] font-black text-indigo-600 underline uppercase tracking-widest"
                      >
                        {t.loginInstead}
                      </button>
                    )}
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>{isLogin ? t.access : t.joinBtn}</span>}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in slide-in-from-right duration-500">
              <div className="text-center mb-8">
                <p className="text-gray-400 text-xs font-bold mt-2">{t.verifyEmail}<br/><span className="text-indigo-600 font-black">{email}</span></p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-8">
                <div className="flex justify-center gap-3" dir="ltr">
                  {code.map((digit, idx) => (
                    <input key={idx} ref={inputRefs[idx]} type="text" inputMode="numeric" value={digit} onChange={e => handleCodeChange(idx, e.target.value)} onKeyDown={e => e.key === 'Backspace' && !code[idx] && idx > 0 && inputRefs[idx-1].current?.focus()} className="w-14 h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-2xl font-black text-indigo-600 focus:border-indigo-600 outline-none" placeholder="•" />
                  ))}
                </div>

                {error && <p className="text-rose-500 text-[9px] font-black uppercase text-center bg-rose-50 p-3 rounded-xl">{error}</p>}

                <button type="submit" disabled={isLoading || code.some(d => d === '')} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all disabled:opacity-30">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : t.verifyBtn}
                </button>
                
                <div className="text-center space-y-3">
                   <button type="button" onClick={() => { authService.resendCode(email); setResendStatus(true); setTimeout(()=>setResendStatus(false), 2000); }} className={`text-[9px] font-black uppercase ${resendStatus ? 'text-emerald-500' : 'text-indigo-400'}`}>
                    {resendStatus ? t.resendSuccess : t.resend}
                  </button>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-[9px] text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">
                    💡 {t.defaultCode}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
