import { supabase } from '../supabaseClient';
import { PayoutRecord } from '../types';

const mapRowToPayoutRecord = (row: any): PayoutRecord => ({
  id: row.id,
  amount: Number(row.amount),
  date: row.payout_date || row.created_at,
  method: row.method === 'CCP' ? 'CCP' : 'RIB',
  status: row.status === 'COMPLETED' ? 'COMPLETED' : 'PROCESSING',
});

export const payoutsService = {
  /**
   * Récupère l'historique des virements pour un hôte donné
   * (table public.payouts, filtrée par host_id)
   */
  getHostPayouts: async (hostId: string): Promise<PayoutRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('host_id', hostId)
        .order('payout_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('getHostPayouts error:', error);
        return [];
      }

      return (data || []).map(mapRowToPayoutRecord);
    } catch (e) {
      console.error('getHostPayouts unexpected error:', e);
      return [];
    }
  },
};
