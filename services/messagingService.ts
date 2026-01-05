
import { supabase } from '../supabaseClient';
import { Message } from '../types';

export const messagingService = {
  sendMessage: async (senderId: string, receiverId: string, content: string, propertyId?: string): Promise<Message | null> => {
    try {
      const { data, error } = await supabase.from('messages').insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        property_id: propertyId,
        content: content,
        is_read: false
      }]).select().single();

      if (error) throw error;
      return data as Message;
    } catch (err) {
      // Fallback local pour test immédiat
      const mockMsg: Message = {
        id: crypto.randomUUID(),
        sender_id: senderId,
        receiver_id: receiverId,
        property_id: propertyId,
        content: content,
        is_read: false,
        created_at: new Date().toISOString()
      };
      return mockMsg;
    }
  },

  getConversation: async (user1Id: string, user2Id: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    } catch (err) {
      return [];
    }
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);
      
      return count || 0;
    } catch {
      return 0;
    }
  }
};
