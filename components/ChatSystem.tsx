
import React, { useState, useEffect, useRef } from 'react';
import { messagingService } from '../services/messagingService';
import { UserProfile, Message } from '../types';

interface ChatSystemProps {
  currentUser: UserProfile;
  receiverId: string;
  receiverName: string;
  propertyId?: string;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser, receiverId, receiverName, propertyId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChat = async () => {
      const data = await messagingService.getConversation(currentUser.id, receiverId);
      setMessages(data);
      setLoading(false);
    };
    loadChat();

    // Simulation de réception de message
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id, receiverId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tempMsg = content;
    setContent('');
    
    const sent = await messagingService.sendMessage(currentUser.id, receiverId, tempMsg, propertyId);
    if (sent) {
      setMessages(prev => [...prev, sent]);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-indigo-50">
      <div className="p-6 bg-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl">👤</div>
          <div>
            <h4 className="font-black italic text-sm">{receiverName}</h4>
            <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">En ligne</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-indigo-50/20">
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic text-[10px] uppercase tracking-widest">Démarrez la conversation</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                msg.sender_id === currentUser.id 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-indigo-950 border border-indigo-100 rounded-tl-none'
              }`}>
                {msg.content}
                <p className={`text-[7px] mt-1 opacity-40 ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-indigo-50 flex gap-3">
        <input 
          type="text" 
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Écrivez ici..."
          className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none focus:bg-white focus:border-indigo-600 transition-all"
        />
        <button type="submit" className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    </div>
  );
};
