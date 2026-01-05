
import { supabase } from '../supabaseClient';
import { Review } from '../types';

export const reviewService = {
  getReviewsForProperty: async (propertyId: string): Promise<Review[]> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        // On ne loggue plus d'erreur, on retourne juste un tableau vide si la table n'est pas prête
        return [];
      }
      return (data as Review[]) || [];
    } catch (err) {
      return [];
    }
  },

  addReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) {
        console.warn('LOCADZ: Impossible d\'ajouter l\'avis (Schéma en cours de mise à jour).');
        return null;
      }
      return data as Review;
    } catch (err) {
      return null;
    }
  }
};
