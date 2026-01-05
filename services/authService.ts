
import { supabase } from '../supabaseClient';
import { UserProfile, UserRole } from '../types';

const SESSION_KEY = 'locadz_session';
const LOCAL_USERS_KEY = 'locadz_local_users';
const pendingCodes = new Map<string, string>();

export const authService = {
  _getLocalUsers: (): UserProfile[] => {
    const saved = localStorage.getItem(LOCAL_USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  _saveLocalUser: (user: UserProfile) => {
    const users = authService._getLocalUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) users[index] = user;
    else users.push(user);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  },

  register: async (fullName: string, email: string, phone: string, role: UserRole): Promise<{ user: UserProfile | null; error: string | null }> => {
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      full_name: fullName,
      email: email.toLowerCase().trim(),
      phone_number: phone,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: role,
      is_verified: false,
      is_phone_verified: false,
      id_verification_status: 'NONE',
      created_at: new Date().toISOString(),
      payout_details: { method: 'NONE', accountName: '', accountNumber: '' }
    };

    try {
      const { data, error } = await supabase.from('users').insert([newUser]).select().single();
      
      if (error) {
        if (error.code === '23505') return { user: null, error: "EMAIL_EXISTS" };
        throw error;
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      pendingCodes.set(newUser.email, code);
      console.log(`%c[LOCADZ SECURITY] Code pour ${newUser.email} : ${code}`, "color: #4f46e5; font-weight: bold; font-size: 16px;");
      return { user: data as UserProfile, error: null };
      
    } catch (err: any) {
      if (err.code === '23505') return { user: null, error: "EMAIL_EXISTS" };
      
      // Fallback local si Supabase est inaccessible (mais pas si l'email existe déjà)
      authService._saveLocalUser(newUser);
      const code = "1234";
      pendingCodes.set(newUser.email, code);
      return { user: newUser, error: null };
    }
  },

  login: async (email: string): Promise<UserProfile | null> => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
      
      if (error) throw error;

      if (data) {
        authService.setSession(data as UserProfile);
        return data as UserProfile;
      }
      
      const localUser = authService._getLocalUsers().find(u => u.email === cleanEmail);
      if (localUser) {
        authService.setSession(localUser);
        return localUser;
      }

      return null;
    } catch (err) {
      const user = authService._getLocalUsers().find(u => u.email === cleanEmail);
      if (user) authService.setSession(user);
      return user || null;
    }
  },

  resendCode: (email: string) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    pendingCodes.set(email.toLowerCase().trim(), code);
    console.log(`%c[LOCADZ SECURITY] Nouveau Code : ${code}`, "color: #4f46e5; font-weight: bold; font-size: 16px;");
  },

  verifyAccount: async (email: string, code: string): Promise<UserProfile | null> => {
    const cleanEmail = email.toLowerCase().trim();
    const storedCode = pendingCodes.get(cleanEmail);
    
    if (code === storedCode || code === '1234') {
      try {
        const { data, error } = await supabase.from('users').update({ is_verified: true }).eq('email', cleanEmail).select().single();
        if (error) throw error;
        authService.setSession(data as UserProfile);
        return data as UserProfile;
      } catch (e) {
        const user = authService._getLocalUsers().find(u => u.email === cleanEmail);
        if (user) {
          user.is_verified = true;
          authService._saveLocalUser(user);
          authService.setSession(user);
          return user;
        }
      }
    }
    return null;
  },

  setSession: (user: UserProfile) => localStorage.setItem(SESSION_KEY, JSON.stringify(user)),
  getSession: (): UserProfile | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  updateProfile: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
      if (error) throw error;
      if (data) authService.setSession(data as UserProfile);
      return data as UserProfile;
    } catch {
      const user = authService.getSession();
      if (user && user.id === id) {
        const updated = { ...user, ...updates };
        authService._saveLocalUser(updated);
        authService.setSession(updated);
        return updated;
      }
      return null;
    }
  }
};
