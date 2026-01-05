
# 🚀 Script SQL pour Supabase

Copie tout ce bloc et colle-le dans le **SQL Editor** de ton projet Supabase, puis clique sur **RUN** :

```sql
-- 1. Table des Utilisateurs
CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    full_name text,
    email text UNIQUE,
    phone_number text,
    avatar_url text,
    role text DEFAULT 'TRAVELER',
    id_verification_status text DEFAULT 'NONE',
    is_verified boolean DEFAULT false,
    is_phone_verified boolean DEFAULT false,
    id_document_url text,
    payout_details jsonb DEFAULT '{"method": "NONE", "accountName": "", "accountNumber": ""}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 2. Table des Propriétés
CREATE TABLE public.properties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id uuid REFERENCES public.users(id),
    title text,
    description text,
    location text,
    price numeric,
    category text,
    rating numeric DEFAULT 5.0,
    reviews_count int DEFAULT 0,
    latitude numeric,
    longitude numeric,
    created_at timestamptz DEFAULT now()
);

-- 3. Table des Images
CREATE TABLE public.property_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- 4. Table des Réservations
CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid REFERENCES public.properties(id),
    traveler_id uuid REFERENCES public.users(id),
    start_date date,
    end_date date,
    total_price numeric,
    commission_fee numeric,
    status text DEFAULT 'PENDING_APPROVAL',
    payment_method text,
    payment_id text,
    receipt_url text,
    created_at timestamptz DEFAULT now()
);

-- 5. Table des Avis
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid REFERENCES public.properties(id),
    user_id uuid REFERENCES public.users(id),
    user_name text,
    user_avatar text,
    rating int,
    comment text,
    created_at timestamptz DEFAULT now()
);

-- 6. Table des Favoris
CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    traveler_id uuid REFERENCES public.users(id),
    property_id uuid REFERENCES public.properties(id),
    created_at timestamptz DEFAULT now()
);

-- 7. Désactiver RLS (Indispensable pour que ça marche tout de suite)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;
```
