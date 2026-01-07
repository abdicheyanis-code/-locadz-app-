# 🏝️ LOCA DZ – Plateforme de locations haut de gamme en Algérie

LOCADZ est une web‑app moderne de type “Airbnb premium” pour le marché algérien.  
Les voyageurs peuvent explorer des propriétés d’exception (Sahara, bord de mer, cabanes, etc.),  
et les hôtes peuvent gérer leurs annonces, réservations et revenus.

---

## 🌐 Démo en ligne

Production : https://locadz-app.vercel.app

---

## 🧱 Stack technique

- **Frontend** : [Vite](https://vitejs.dev/) + **React** + **TypeScript**
- **Backend as a Service** : [Supabase](https://supabase.com/)
  - Auth (email + mot de passe, email de confirmation obligatoire)
  - Base de données PostgreSQL (tables `users`, `properties`, `bookings`, etc.)
  - Storage (images de propriétés)
- **Hébergement** : [Vercel](https://vercel.com/)
- **IA Concierge** : [Google AI Studio / Gemini](https://ai.google.dev/)
- **Styling** : Tailwind‑like utility classes + design custom

---

## ⚙️ Fonctionnalités principales

### Côté voyageur

- Authentification par email + mot de passe (Supabase Auth)
- Email de confirmation obligatoire avant la première connexion
- Sélection de propriété par catégories (trending, sahara, beachfront, etc.)
- Système de favoris
- Gestion de profil (nom, email, téléphone, rôle)
- Interface optimisée desktop & mobile

### Côté hôte

- Rôle `HOST` / `ADMIN` géré dans la table `users`
- Tableau de bord hôte (HOST_DASH) pour gérer ses propriétés
- Propriétés stockées dans Supabase (`properties` + `property_images`)

### Sécurité

- **Row Level Security (RLS)** activée sur les principales tables :
  - `properties` : tout le monde peut lire, seul `host_id = auth.uid()` peut modifier
  - `favorites` : chaque utilisateur ne voit/gère que ses propres favoris (`traveler_id = auth.uid()`)
  - `bookings` : idem pour les réservations (`traveler_id = auth.uid()`)
  - `reviews` : tout le monde lit, chaque user ne gère que ses avis (`user_id = auth.uid()`)
- Authentification Supabase avec clé `anon` uniquement (jamais `service_role` côté front)

### IA (Concierge LOCADZ)

- Intégration Gemini via `@google/genai`
- Analyse de texte pour la recherche intelligente de catégories
- Assistant contextuel (conseils de voyage, suggestions) activé si `VITE_GEMINI_API_KEY` est fourni

---

## 🚀 Lancer le projet en local

Prérequis :

- Node.js 18+
- Un projet Supabase configuré (URL + anon key)
- (Optionnel) une clé API Gemini

Installation :

```bash
# Cloner le repo
git clone https://github.com/abdicheyanis-code/-locadz-app-.git
cd -locadz-app-

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
