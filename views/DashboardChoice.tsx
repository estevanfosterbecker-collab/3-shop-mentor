
import React from 'react';
import { Button } from '../components/Button';

interface DashboardChoiceProps {
  onRetake: () => void;
  onSkip: () => void;
}

export const DashboardChoice: React.FC<DashboardChoiceProps> = ({ onRetake, onSkip }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Como deseja prosseguir hoje?</h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Você já possui um perfil registrado. Deseja atualizar sua estratégia com uma nova análise ou ir direto para o campo de batalha?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={onRetake}
          className="group flex flex-col items-center p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-purple-600 transition-all text-center"
        >
          <div className="w-16 h-16 bg-purple-600/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">Nova Estratégia</h3>
          <p className="text-zinc-500 text-xs font-medium">Responder quiz novamente para recalcular seu plano de ação.</p>
        </button>

        <button 
          onClick={onSkip}
          className="group flex flex-col items-center p-8 bg-purple-600 border border-purple-500 rounded-[2.5rem] hover:bg-purple-700 transition-all text-center shadow-xl shadow-purple-900/20"
        >
          <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2 text-white">Acessar Painel</h3>
          <p className="text-purple-100 text-xs font-medium">Ir direto para o Dashboard e continuar a execução atual.</p>
        </button>
      </div>

      <div className="mt-16 text-zinc-700 text-[10px] font-black tracking-[0.3em] uppercase">
        Foco total no faturamento
      </div>
    </div>
  );
};
