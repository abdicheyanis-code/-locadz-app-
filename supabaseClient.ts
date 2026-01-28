import { createClient } from '@supabase/supabase-js';

// On récupère les clés depuis les variables d'environnement sécurisées
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('⚠️ Variables d\'environnement Supabase manquantes ! Vérifiez votre fichier .env ou la config Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
