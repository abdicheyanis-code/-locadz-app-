
import { supabase } from '../supabaseClient';
import { Booking, BookingStatus } from '../types';
import { PLATFORM_COMMISSION_RATE } from './stripeService';

const LOCAL_BOOKINGS_KEY = 'locadz_local_bookings';

export const bookingService = {
  _getLocal: (): Booking[] => {
    const saved = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  _saveLocal: (bookings: Booking[]) => {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  },

  isRangeAvailable: async (propertyId: string, start: Date, end: Date): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_date, end_date, status')
        .eq('property_id', propertyId)
        .in('status', ['PENDING_APPROVAL', 'APPROVED', 'PAID']);

      let bookings = (data as any[]) || [];
      if (error) {
        bookings = bookingService._getLocal().filter(b => b.property_id === propertyId);
      }

      return !bookings.some(booking => {
        const bStart = new Date(booking.start_date);
        const bEnd = new Date(booking.end_date);
        return start <= bEnd && end >= bStart;
      });
    } catch (e) {
      return true;
    }
  },

  // Added getBookingsForProperty to fix error in HostDashboard.tsx
  getBookingsForProperty: async (propertyId: string): Promise<Booking[]> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .in('status', ['APPROVED', 'PAID']);
      
      if (error) throw error;
      return (data as Booking[]) || [];
    } catch (e) {
      // Fallback for local simulation
      return bookingService._getLocal().filter(
        b => b.property_id === propertyId && ['APPROVED', 'PAID'].includes(b.status)
      );
    }
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'commission_fee'>): Promise<Booking | null> => {
    const commission = Number(bookingData.total_price) * PLATFORM_COMMISSION_RATE;
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      ...bookingData,
      commission_fee: commission,
      status: 'PENDING_APPROVAL',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
      if (error) throw error;
      return data as Booking;
    } catch (e) {
      const local = bookingService._getLocal();
      local.push(newBooking);
      bookingService._saveLocal(local);
      return newBooking;
    }
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus): Promise<boolean> => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
      if (error) throw error;
      return true;
    } catch (e) {
      const local = bookingService._getLocal();
      const index = local.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        local[index].status = status;
        bookingService._saveLocal(local);
        return true;
      }
      return false;
    }
  },

  getHostBookings: async (hostId: string): Promise<Booking[]> => {
    try {
      // Logique simplifiée pour le mode sans-base
      const localBookings = bookingService._getLocal();
      // En mode réel, on ferait une jointure, ici on simule
      return localBookings; 
    } catch (e) {
      return bookingService._getLocal();
    }
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').eq('traveler_id', userId);
      if (error) throw error;
      return data as Booking[];
    } catch (e) {
      return bookingService._getLocal().filter(b => b.traveler_id === userId);
    }
  },

  getHostRevenue: async (properties: string[]): Promise<number> => {
    const bookings = bookingService._getLocal().filter(b => properties.includes(b.property_id) && ['APPROVED', 'PAID'].includes(b.status));
    return bookings.reduce((sum, b) => sum + (Number(b.total_price) - Number(b.commission_fee)), 0);
  }
};
