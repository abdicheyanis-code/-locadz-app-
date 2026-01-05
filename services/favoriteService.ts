
import { supabase } from '../supabaseClient';
import { Favorite } from '../types';

export const favoriteService = {
  getFavorites: async (travelerId: string): Promise<Favorite[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('traveler_id', travelerId);
    return error ? [] : data as Favorite[];
  },

  toggleFavorite: async (travelerId: string, propertyId: string): Promise<void> => {
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('traveler_id', travelerId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id);
    } else {
      await supabase.from('favorites').insert([{
        traveler_id: travelerId,
        property_id: propertyId
      }]);
    }
  },

  isFavorite: async (travelerId: string, propertyId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('traveler_id', travelerId)
      .eq('property_id', propertyId)
      .single();
    return !!data;
  },

  getUserFavoritePropertyIds: async (travelerId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('traveler_id', travelerId);
    
    return error ? [] : data.map(f => f.property_id);
  }
};
