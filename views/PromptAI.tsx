
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { SavedPrompt } from '../types';

interface PromptAIProps {
  savedPrompts: SavedPrompt[];
  onUpdatePrompts: (prompts: SavedPrompt[]) => void;
}

export const PromptAI: React.FC<PromptAIProps> = ({ savedPrompts, onUpdatePrompts }) => {
  const [view, setView] = useState<'list' | 'create' | 'result'>('list');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  
  // Form State
  const [objective, setObjective] = useState('');
  const [format, setFormat] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [finalPrompt, setFinalPrompt] = useState('');

  const objectiveOptions = ["Vender produto", "Gerar autoridade", "Conteúdo viral", "Review", "Conteúdo educativo"];
  const formatOptions = ["Selfie", "POV", "Narração", "Demonstração de produto", "Lifestyle"];
  const styleOptions = ["Natural", "Viral TikTok", "Cinematográfico", "UGC", "Estilo anúncio"];
  const durationOptions = ["Até 15 segundos", "15 a 30 segundos", "30 a 60 segundos"];
  const languageOptions = ["Português", "Inglês", "Espanhol"];
  
  const suggestionOptions = [
    "Adicionar gancho forte nos primeiros 3 segundos",
    "Adicionar CTA no final",
    "Adicionar emoção e urgência",
    "Adicionar descrição detalhada do ambiente",
    "Adicionar tom persuasivo"
  ];

  const handleToggleSuggestion = (s: string) => {
    setSuggestions(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const handleGenerate = () => {
    const generated = `[PROMPT ESTRUTURADO PARA VÍDEO IA]
OBJETIVO: ${objective}
FORMATO: ${format}
ESTILO: ${style}
DURAÇÃO: ${duration}
IDIOMA: ${language}

DESCRIÇÃO DO VÍDEO:
${description}

OBSERVAÇÕES ADICIONAIS:
${suggestions.length > 0 ? suggestions.map(s => `- ${s}`).join('\n') : "Nenhuma observação extra."}

---
GERADO POR SHOP MENTOR PROMPT AI`;

    setFinalPrompt(generated);
    
    // Save locally
    const newPrompt: SavedPrompt = {
      id: editingPromptId || Math.random().toString(36).substr(2, 9),
      name: `Prompt: ${objective || 'Sem Título'}`,
      objective,
      format,
      style,
      duration,
      language,
      description,
      suggestions,
      finalPrompt: generated,
      createdAt: new Date().toISOString()
    };

    if (editingPromptId) {
      onUpdatePrompts(savedPrompts.map(p => p.id === editingPromptId ? newPrompt : p));
    } else {
      onUpdatePrompts([newPrompt, ...savedPrompts]);
    }

    setView('result');
  };

  const startCreate = () => {
    setEditingPromptId(null);
    setObjective('');
    setFormat('');
    setStyle('');
    setDuration('');
    setLanguage('');
    setDescription('');
    setSuggestions([]);
    setView('create');
  };

  const startEdit = (p: SavedPrompt) => {
    setEditingPromptId(p.id);
    setObjective(p.objective);
    setFormat(p.format);
    setStyle(p.style);
    setDuration(p.duration);
    setLanguage(p.language);
    setDescription(p.description);
    setSuggestions(p.suggestions);
    setView('create');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copiado para a área de transferência!');
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {view === 'list' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <header className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tighter uppercase">Prompt AI</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Crie prompts detalhados para gerar vídeos virais com IA, do jeito que você quiser.</p>
          </header>

          <Button onClick={startCreate} className="w-full py-6 rounded-3xl text-lg mb-10 shadow-xl shadow-purple-600/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Criar novo prompt
          </Button>

          <div className="space-y-4">
            {savedPrompts.length > 0 ? (
              savedPrompts.map(p => (
                <div key={p.id} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight text-white mb-1">{p.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Objetivo: {p.objective}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(p)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => copyToClipboard(p.finalPrompt)}
                      className="px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Copiar prompt
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Nenhum prompt salvo ainda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="animate-in fade-in duration-500">
          <header className="mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase">Configurar Prompt</h2>
            <button onClick={() => setView('list')} className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest">Cancelar</button>
          </header>

          <div className="space-y-8 bg-zinc-900/30 p-6 md:p-8 rounded-[2.5rem] border border-zinc-800/50">
            {/* Selections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Objetivo do vídeo</label>
                <select 
                  value={objective} 
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 focus:outline-none focus:border-purple-600"
                >
                  <option value="">Selecione...</option>
                  {objectiveOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Formato do vídeo</label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 focus:outline-none focus:border-purple-600"
                >
                  <option value="">Selecione...</option>
                  {formatOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Estilo do vídeo</label>
                <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 focus:outline-none focus:border-purple-600"
                >
                  <option value="">Selecione...</option>
                  {styleOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Duração desejada</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 focus:outline-none focus:border-purple-600"
                >
                  <option value="">Selecione...</option>
                  {durationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Idioma</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 focus:outline-none focus:border-purple-600"
                >
                  <option value="">Selecione...</option>
                  {languageOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Descreva exatamente o vídeo que você quer gerar</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Um criador sentado no sofá reagindo a um produto de skincare, luz natural, tom empolgado..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 text-sm font-medium text-zinc-300 focus:outline-none focus:border-purple-600 min-h-[150px] resize-none"
              />
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Complementos rápidos (opcional)</label>
              <div className="flex flex-wrap gap-2">
                {suggestionOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => handleToggleSuggestion(s)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      suggestions.includes(s) 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!objective || !description}
              className="w-full py-5 rounded-3xl mt-6 font-black uppercase tracking-widest"
            >
              Gerar prompt final
            </Button>
          </div>
        </div>
      )}

      {view === 'result' && (
        <div className="animate-in zoom-in duration-500 text-center max-w-2xl mx-auto py-10">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-4 text-white">Prompt Gerado!</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">Agora copie e cole na sua ferramenta de IA favorita (Veo, Kling, Luma, Runway, etc).</p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 text-left mb-8 relative">
            <pre className="text-zinc-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {finalPrompt}
            </pre>
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={() => copyToClipboard(finalPrompt)} className="w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest">
              Copiar prompt
            </Button>
            <button 
              onClick={() => setView('list')}
              className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors py-4"
            >
              Voltar para meus prompts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
