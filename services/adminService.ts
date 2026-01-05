
import { supabase } from '../supabaseClient';
import { Booking, UserProfile } from '../types';
import { authService } from './authService';

export const adminService = {
  _checkAdminPermission: () => {
    const user = authService.getSession();
    return user && user.role === 'ADMIN';
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    if (!adminService._checkAdminPermission()) return [];
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserProfile[];
    } catch (e) {
      return [];
    }
  },

  updateUserRole: async (userId: string, role: string): Promise<boolean> => {
    if (!adminService._checkAdminPermission()) return false;
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  getPlatformStats: async () => {
    if (!adminService._checkAdminPermission()) {
      throw new Error("Accès non autorisé.");
    }

    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .in('status', ['PAID', 'APPROVED']);

      if (error) throw error;

      const totalVolume = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      const totalCommission = bookings?.reduce((sum, b) => sum + Number(b.commission_fee), 0) || 0;

      return {
        totalVolume,
        totalCommission,
        count: bookings?.length || 0,
        bookings: (bookings as Booking[]) || []
      };
    } catch (e: any) {
      return { totalVolume: 0, totalCommission: 0, count: 0, bookings: [], error: e.message };
    }
  },

  getPendingVerifications: async () => {
    if (!adminService._checkAdminPermission()) return [];
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id_verification_status', 'PENDING');
      if (error) throw error;
      return data as UserProfile[];
    } catch (e) {
      return [];
    }
  },

  approveHost: async (userId: string) => {
    if (!adminService._checkAdminPermission()) return false;
    try {
      const { error } = await supabase
        .from('users')
        .update({ id_verification_status: 'VERIFIED', is_verified: true })
        .eq('id', userId);
      return !error;
    } catch (e) {
      return false;
    }
  }
};
