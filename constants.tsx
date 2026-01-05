import { Category, Property } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'trending', 
    label: 'Tendances', 
    icon: '🔥',
    background_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    background_video: 'https://cdn.pixabay.com/video/2021/04/12/70796-537442111_tiny.mp4'
  },
  { 
    id: 'beachfront', 
    label: 'Bord de mer', 
    icon: '🏖️',
    background_image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    background_video: 'https://cdn.pixabay.com/video/2023/05/29/164923-831416801_tiny.mp4'
  },
  { 
    id: 'cabins', 
    label: 'Montagne', 
    icon: '🏔️',
    background_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    background_video: 'https://cdn.pixabay.com/video/2021/09/01/87102-595306351_tiny.mp4'
  },
  { 
    id: 'sahara', 
    label: 'Sahara', 
    icon: '🏜️',
    background_image: 'https://images.unsplash.com/photo-1506371301032-db63542267ad?auto=format&fit=crop&q=80&w=1200',
    background_video: 'https://cdn.pixabay.com/video/2020/07/04/44122-438905202_tiny.mp4'
  },
];

export const ALGERIAN_BANKS = [
  { id: 'BEA', name: 'Banque Extérieure d\'Algérie (BEA)' },
  { id: 'BNA', name: 'Banque Nationale d\'Algérie (BNA)' },
  { id: 'CPA', name: 'Crédit Populaire d\'Algérie (CPA)' },
  { id: 'BADR', name: 'Banque de l\'Agriculture et du Dév. Rural (BADR)' },
  { id: 'BDL', name: 'Banque du Développement Local (BDL)' },
  { id: 'CNEP', name: 'CNEP-Banque' },
  { id: 'AGB', name: 'Gulf Bank Algeria (AGB)' },
  { id: 'BNP', name: 'BNP Paribas El Djazaïr' },
  { id: 'SGA', name: 'Société Générale Algérie' },
  { id: 'NATIXIS', name: 'Natixis Algérie' },
  { id: 'AL_BARAKA', name: 'Al Baraka Bank Algeria' },
  { id: 'ABC', name: 'Arab Banking Corporation (ABC)' },
];

export const TEST_HOST_ID = '00000000-0000-0000-0000-000000000001';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: '00000000-0000-0000-0000-00000000000a',
    title: 'Villa Blanche Horizon',
    description: 'Une villa de luxe nichée sur la presqu\'île de Sidi Fredj, offrant un accès privé à la plage et un design néo-mauresque épuré.',
    location: 'Sidi Fredj, Alger',
    price: 35000,
    category: 'beachfront',
    host_id: TEST_HOST_ID,
    rating: 4.95,
    reviews_count: 12,
    latitude: 36.7618,
    longitude: 2.8485,
    images: [
      { id: '1a', property_id: '00000000-0000-0000-0000-00000000000a', image_url: 'https://images.unsplash.com/photo-1580587767376-1212041e8f23?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() },
      { id: '1b', property_id: '00000000-0000-0000-0000-00000000000a', image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() }
    ],
    created_at: new Date().toISOString(),
    isHostVerified: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000b',
    title: 'Le Chalet des Cèdres',
    description: 'Vivez l\'hiver algérien dans un chalet luxueux au pied du Djurdjura. Parfait pour les randonneurs et amateurs de calme.',
    location: 'Tikjda, Bouira',
    price: 18500,
    category: 'cabins',
    host_id: TEST_HOST_ID,
    rating: 4.88,
    reviews_count: 8,
    latitude: 36.4533,
    longitude: 4.1287,
    images: [
      { id: '2a', property_id: '00000000-0000-0000-0000-00000000000b', image_url: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() },
      { id: '2b', property_id: '00000000-0000-0000-0000-00000000000b', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() }
    ],
    created_at: new Date().toISOString(),
    isHostVerified: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000c',
    title: 'Penthouse Front de Mer',
    description: 'Surplombant la baie d\'Oran, ce penthouse offre une vue imprenable sur Santa Cruz et le port. Équipements dernier cri.',
    location: 'Oran, Algérie',
    price: 28000,
    category: 'trending',
    host_id: TEST_HOST_ID,
    rating: 4.92,
    reviews_count: 24,
    latitude: 35.7051,
    longitude: -0.6358,
    images: [
      { id: '3a', property_id: '00000000-0000-0000-0000-00000000000c', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() },
      { id: '3b', property_id: '00000000-0000-0000-0000-00000000000c', image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() }
    ],
    created_at: new Date().toISOString(),
    isHostVerified: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000d',
    title: 'Le Palais des Dunes',
    description: 'Contemplez le coucher de soleil sur Taghit depuis votre terrasse privée. Une fusion parfaite entre architecture traditionnelle et confort moderne.',
    location: 'Taghit, Sahara',
    price: 22000,
    category: 'sahara',
    host_id: TEST_HOST_ID,
    rating: 4.99,
    reviews_count: 67,
    latitude: 30.9234,
    longitude: -2.0298,
    images: [
      { id: '4a', property_id: '00000000-0000-0000-0000-00000000000d', image_url: 'https://images.unsplash.com/photo-1506371301032-db63542267ad?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() },
      { id: '4b', property_id: '00000000-0000-0000-0000-00000000000d', image_url: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&q=80&w=1200', created_at: new Date().toISOString() }
    ],
    created_at: new Date().toISOString(),
    isHostVerified: true
  }
];