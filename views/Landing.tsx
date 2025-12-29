
import React from 'react';
import { Button } from '../components/Button';

export const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-zinc-950 overflow-hidden relative py-12 px-6">
      {/* Background Glows - Ambiência do App */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[60%] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Section - Logo */}
      <div className="z-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] flex items-center justify-center mb-4 mx-auto shadow-2xl">
          <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.8.2-.82.41-1.45 1.19-1.66 2.08-.24.97-.04 2.03.52 2.87.56.84 1.51 1.38 2.5 1.47 1.12.11 2.29-.27 3.09-1.07.72-.73 1.11-1.74 1.12-2.75V.02z"/>
          </svg>
        </div>
        <div className="text-2xl font-black tracking-tighter text-white">
          SHOP<span className="text-purple-500">MENTOR</span>
        </div>
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1">Intelligence System</div>
      </div>

      {/* Middle Section - Value Prop */}
      <div className="z-10 text-center max-w-xs animate-in fade-in zoom-in duration-700 delay-200">
        <h1 className="text-3xl font-black mb-4 tracking-tight leading-tight">
          Escalar no TikTok <br/> 
          <span className="text-purple-500">não é sorte</span>, <br/>
          é estratégia.
        </h1>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
          O primeiro mentor de IA que analisa seu perfil, valida suas ações e cobra resultados diários.
        </p>
      </div>

      {/* Bottom Section - Actions */}
      <div className="z-10 w-full max-w-sm flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <Button onClick={onStart} className="w-full py-5 rounded-2xl text-lg font-black shadow-2xl shadow-purple-600/20">
          Iniciar Análise Pro
        </Button>
        <button 
          onClick={onStart} 
          className="w-full py-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          Já sou um executor • Entrar
        </button>
        
        <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-center items-center gap-6 opacity-30">
           <div className="text-center">
             <div className="text-white text-xs font-black tracking-tight">V.2.4</div>
             <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">IA Model</div>
           </div>
           <div className="h-4 w-[1px] bg-zinc-800"></div>
           <div className="text-center">
             <div className="text-white text-xs font-black tracking-tight">ACTIVE</div>
             <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Monitoring</div>
           </div>
        </div>
      </div>
    </div>
  );
};
