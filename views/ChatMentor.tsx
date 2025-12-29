
import React, { useState, useRef, useEffect } from 'react';
import { getMentorResponse } from '../services/geminiService';
import { ProfileAnalysis } from '../types';

export const ChatMentor: React.FC<{ analysis: ProfileAnalysis }> = ({ analysis }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { 
      role: 'model', 
      content: 'Estou pronto para transformar seu perfil em uma máquina de vendas. 🚀 Qual sua maior dúvida agora para começarmos a escalar? [SUGESTÕES: Como melhorar meu gancho? | Qual produto está em alta? | Como analisar meu CTR?]' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const processModelResponse = (text: string) => {
    let cleanText = text.replace(/\*\*/g, ''); 
    const suggestionMatch = cleanText.match(/\[SUGESTÕES: (.*?)\]/);
    
    let suggestions: string[] = [];
    if (suggestionMatch) {
      suggestions = suggestionMatch[1].split('|').map(s => s.trim());
      cleanText = cleanText.replace(/\[SUGESTÕES: .*?\]/, '').trim();
    }
    
    return { cleanText, suggestions };
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'model') {
      const { suggestions } = processModelResponse(lastMsg.content);
      setCurrentSuggestions(suggestions);
    }
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const messageToSend = customMsg || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg = messageToSend.trim();
    setInput('');
    setCurrentSuggestions([]);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getMentorResponse(userMsg, analysis, messages);
      setMessages(prev => [...prev, { role: 'model', content: response || "Tive um problema na rede. Tente novamente. 🔄" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "Erro na análise estratégica. Vamos tentar de novo. 🛠️" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full max-w-4xl mx-auto overflow-hidden">
      <header className="mb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl md:text-3xl font-black mb-1">Shop Mentor AI 🤖</h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estrategista Online</span>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 md:space-y-6 pr-1 mb-4 scroll-smooth"
      >
        {messages.map((msg, i) => {
          const { cleanText } = processModelResponse(msg.content);
          return (
            <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] sm:max-w-[85%] p-4 md:p-5 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
              }`}>
                <div className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-[0.2em]">
                  {msg.role === 'user' ? 'VOCÊ' : 'MENTOR'}
                </div>
                <div className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{cleanText}</div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-zinc-500 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[11px] md:text-sm font-medium">Mentor analisando...</span>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {!loading && currentSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {currentSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="px-3 py-2 bg-zinc-900 border border-purple-500/30 text-purple-400 text-[11px] md:text-sm font-semibold rounded-full hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-auto pb-2 shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Mande sua dúvida..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 pr-14 md:pr-20 focus:outline-none focus:border-purple-600/50 transition-all text-sm md:text-base placeholder:text-zinc-600"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-2 md:right-3 top-2 md:top-3 bg-purple-600 hover:bg-purple-700 text-white p-2 md:p-3 rounded-xl disabled:opacity-30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};
