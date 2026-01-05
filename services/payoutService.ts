import { Payout } from '../types';

const PAYOUTS_KEY = 'locadz_payouts';

export const payoutService = {
  getAll: (): Payout[] => {
    const data = localStorage.getItem(PAYOUTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getByHost: (hostId: string): Payout | null => {
    const payouts = payoutService.getAll();
    return payouts.find(p => p.host_id === hostId) || null;
  },

  upsert: (hostId: string, payoutData: Omit<Payout, 'id' | 'host_id' | 'created_at'>): Payout => {
    const payouts = payoutService.getAll();
    const existingIndex = payouts.findIndex(p => p.host_id === hostId);
    
    let result: Payout;
    if (existingIndex !== -1) {
      result = {
        ...payouts[existingIndex],
        ...payoutData
      };
      payouts[existingIndex] = result;
    } else {
      result = {
        id: crypto.randomUUID(),
        host_id: hostId,
        ...payoutData,
        created_at: new Date().toISOString()
      };
      payouts.push(result);
    }
    
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(payouts));
    return result;
  }
};