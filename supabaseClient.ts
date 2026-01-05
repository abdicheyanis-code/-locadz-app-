
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ CONFIGURATION SUPABASE
 * 
 * Les valeurs ci-dessous sont maintenant correctement formatées avec des guillemets.
 */
const SUPABASE_URL = 'https://idhtxrzihhedodqqvyxy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaHR4cnppaGhlZG9kcXF2eXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDU0MjEsImV4cCI6MjA4MjI4MTQyMX0.UVGkyNijVvje7wUGJk0W_wctJdmDGti1dUkCwvfjb58';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
