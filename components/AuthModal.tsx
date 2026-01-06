import React, { useState, useEffect } from 'react';
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
    password: "Mot de passe",
    passwordPlaceholder: "Au moins 6 caractères",
    passwordRequired: "Mot de passe requis (au moins 6 caractères).",
    access: "ACCÉDER AU RÉSEAU",
    joinBtn: "DEMANDER L'ADHÉSION",
    invalidPhone: "Numéro invalide. Format : 05, 06 ou 07 + 8 chiffres.",
    invalidEmail: "Format d'email incorrect.",
    noAccount: "Compte introuvable. Veuillez d'abord vous inscrire.",
    emailExists: "Cet email est déjà enregistré.",
    loginInstead: "Se connecter maintenant",
    invalidCredentials: "Email ou mot de passe incorrect.",
    emailNotConfirmed: "Email non confirmé. Vérifiez votre boîte mail et cliquez sur le lien.",
    registerInfo: "Nous avons envoyé un email de confirmation. Cliquez sur le lien pour activer votre compte, puis connectez-vous.",
    cloudError: "Erreur de connexion au Cloud Supabase."
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
    password: "Password",
    passwordPlaceholder: "At least 6 characters",
    passwordRequired: "Password required (minimum 6 characters).",
    access: "ACCESS NETWORK",
    joinBtn: "REQUEST MEMBERSHIP",
    invalidPhone: "Invalid phone. Format: 05, 06 or 07 + 8 digits.",
    invalidEmail: "Incorrect email format.",
    noAccount: "Account not found. Please register first.",
    emailExists: "This email is already registered.",
    loginInstead: "Login instead",
    invalidCredentials: "Incorrect email or password.",
    emailNotConfirmed: "Email not confirmed. Check your inbox and click the link.",
    registerInfo: "We sent you a confirmation email. Click the link to activate your account, then log in.",
    cloudError: "Cloud Supabase connection error."
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
    password: "كلمة المرور",
    passwordPlaceholder: "6 أحرف على الأقل",
    passwordRequired: "كلمة المرور مطلوبة (6 أحرف على الأقل).",
    access: "دخول الشبكة",
    joinBtn: "تفعيل العضوية",
    invalidPhone: "رقم غير صحيح. يبدأ بـ 05، 06 أو 07 متبوعًا بـ 8 أرقام.",
    invalidEmail: "صيغة البريد الإلكتروني غير صحيحة.",
    noAccount: "الحساب غير موجود. يرجى التسجيل أولاً.",
    emailExists: "هذا البريد الإلكتروني مسجل بالفعل.",
    loginInstead: "سجل دخولك الآن",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    emailNotConfirmed: "البريد غير مؤكد. تحقق من بريدك واضغط على الرابط.",
    registerInfo: "تم إرسال بريد تأكيد. اضغط على الرابط لتفعيل الحساب ثم قم بتسجيل الدخول.",
    cloudError: "خطأ في الاتصال بسحابة Supabase."
  }
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('TRAVELER');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const t = AUTH_TRANSLATIONS[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!isOpen) {
      setIsLogin(true);
      setEmail('');
      setFullName('');
      setPhone('');
      setRole('TRAVELER');
      setPassword('');
      setError('');
      setInfo('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Format Algérie : 05, 06, 07 + 8 chiffres
    return /^(0)(5|6|7)[0-9]{8}$/.test(phone.replace(/\s/g, ''));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!validateEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    if (!password || password.length < 6) {
      setError(t.passwordRequired);
      return;
    }

    if (!isLogin && !validatePhone(phone)) {
      setError(t.invalidPhone);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        try {
          const user = await authService.login(email, password);
          if (user) {
            onSuccess(user);
            onClose();
          } else {
            setError(t.noAccount);
          }
        } catch (err: any) {
          if (err.message === 'EMAIL_NOT_CONFIRMED') {
            setError(t.emailNotConfirmed);
          } else if (err.message === 'INVALID_CREDENTIALS') {
            setError(t.invalidCredentials);
          } else {
            setError(t.cloudError);
          }
        }
      } else {
        const { error: regError } = await authService.register(
          fullName,
          email,
          phone,
          role,
          password
        );
        if (regError === 'EMAIL_EXISTS') {
          setError(t.emailExists);
        } else if (regError) {
          setError(regError);
        } else {
          // Succès inscription : on informe l'utilisateur et on le bascule sur "Connexion"
          setInfo(t.registerInfo);
          setIsLogin(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-2xl animate-in fade-in duration-500"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-[0_50px_120px_rgba(0,0,0,0.6)] border border-white/50 overflow-hidden relative">
        <button
          onClick={onClose}
          className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'} text-gray-400 hover:text-indigo-600 transition-all active:scale-90 z-20`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-10 pt-12">
          <div className="text-center mb-10">
            <div className="inline-block p-1 bg-white/10 rounded-[2rem] mb-4 shadow-xl">
              <LocadzLogo className="w-14 h-14" />
            </div>
            <h2 className="text-3xl font-black text-indigo-950 italic tracking-tight uppercase">
              {t.portal}
            </h2>
            <p className="text-indigo-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">
              {t.req}
            </p>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setInfo('');
              }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'
              }`}
            >
              {t.member}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setInfo('');
              }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                !isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'
              }`}
            >
              {t.join}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">
                  {t.name}
                </label>
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
              <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300 ${
                  error === t.invalidEmail ? 'border-rose-500' : 'border-gray-100'
                }`}
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300"
                placeholder={t.passwordPlaceholder}
                minLength={6}
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-indigo-300 ml-4">
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none text-indigo-600 placeholder:text-gray-300 ${
                      error === t.invalidPhone ? 'border-rose-500' : 'border-gray-100'
                    }`}
                    placeholder={t.phoneHint}
                    maxLength={10}
                  />
                </div>
                <div className="pt-2">
                  <label className="text-[9px] font-black uppercase text-indigo-300 mb-2 block ml-4">
                    {t.role}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('TRAVELER')}
                      className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        role === 'TRAVELER'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100'
                          : 'border-gray-50 text-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <span className="text-xl">🎒</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        {t.traveler}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('HOST')}
                      className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        role === 'HOST'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100'
                          : 'border-gray-50 text-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <span className="text-xl">🗝️</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        {t.host}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-4 rounded-2xl border bg-rose-50 border-rose-100 text-center animate-in fade-in zoom-in-95">
                <p className="text-rose-500 text-[9px] font-black uppercase leading-relaxed">
                  {error}
                </p>
                {error === t.emailExists && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setInfo('');
                    }}
                    className="mt-2 text-[10px] font-black text-indigo-600 underline uppercase tracking-widest"
                  >
                    {t.loginInstead}
                  </button>
                )}
              </div>
            )}

            {info && (
              <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-100 text-center animate-in fade-in zoom-in-95">
                <p className="text-emerald-600 text-[9px] font-black uppercase leading-relaxed">
                  {info}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? t.access : t.joinBtn}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
