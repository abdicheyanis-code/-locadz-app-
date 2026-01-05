
import React, { useState, useRef, useEffect } from 'react';
import { getTravelAdvice } from '../services/geminiService';
import { Property } from '../types';

interface GeminiAssistantProps {
  currentProperty?: Property | null;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ currentProperty }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, sources?: any[]}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // On passe le contexte de la propriété si elle est ouverte
    const locationContext = currentProperty ? { lat: currentProperty.latitude, lng: currentProperty.longitude } : undefined;
    
    const result = await getTravelAdvice(userMsg, locationContext);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: result.text || '', 
      sources: result.sources 
    }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:scale-110 transition-all z-[150] flex items-center gap-3 border border-white/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 to-violet-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-2xl relative z-10">✨</span>
        <span className="font-black text-[10px] uppercase tracking-widest relative z-10">Assistant DZ</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:justify-end md:p-8 bg-indigo-950/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-2xl w-full md:w-[450px] md:h-[700px] h-[90vh] rounded-t-[3rem] md:rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.4)] flex flex-col border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-indigo-50 flex justify-between items-center bg-indigo-950 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg">
                  <span className="text-2xl">🪄</span>
                </div>
                <div>
                  <h3 className="font-black text-xs tracking-widest uppercase italic">Concierge {currentProperty ? 'Local' : 'Global'}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <p className="text-[7px] uppercase font-black tracking-widest opacity-60">Maps + Search Live</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gradient-to-b from-indigo-50/20 to-white">
              {messages.length === 0 && (
                <div className="bg-indigo-600 text-white p-6 rounded-[2rem] rounded-tl-none text-xs font-black uppercase leading-relaxed shadow-xl border border-indigo-400 animate-in slide-in-from-left duration-500">
                  {currentProperty 
                    ? `Je suis prêt à vous guider autour de "${currentProperty.title}". Voulez-vous connaître les meilleurs restaurants à proximité ? 🍽️`
                    : "Bienvenue. Posez-moi vos questions sur le voyage en Algérie, la sécurité ou les activités. 🌍"}
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-bold leading-relaxed shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-950 rounded-tr-none' 
                      : 'bg-white border-gray-100 text-gray-800 rounded-tl-none shadow-md'
                  }`}>
                    {msg.content}
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-[7px] font-black uppercase tracking-widest text-indigo-400 mb-2">Points d'intérêt vérifiés</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.slice(0, 4).map((s, idx) => (
                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl font-black hover:bg-indigo-100 transition-all truncate max-w-[180px] border border-indigo-100">
                              📍 {s.title || 'Lieu'}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 p-4 bg-gray-50 w-20 rounded-full justify-center animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            <form onSubmit={handleAsk} className="p-8 border-t border-indigo-50 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={currentProperty ? "Suggère un café proche..." : "Où aller ce week-end ?"}
                  className="w-full pl-6 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-black text-indigo-950 text-xs shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="absolute right-2 top-2 bottom-2 px-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
