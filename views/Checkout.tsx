
import React from 'react';
import { Button } from '../components/Button';
import { ProfileAnalysis } from '../types';

interface CheckoutProps {
  analysis?: ProfileAnalysis;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ analysis, onSuccess }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Análise Concluída com Sucesso</h2>
        <p className="text-zinc-400 text-xl">Identificamos 3 gargalos críticos que estão impedindo seu faturamento.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Preview results blurred */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-md bg-zinc-950/40 z-10 flex items-center justify-center flex-col p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-600/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Relatório Completo Bloqueado</h3>
            <p className="text-zinc-300 text-sm mb-6">Seu Health Score é de {analysis?.score ?? '??'}/100. Libere seu plano de ação para escalar.</p>
            <Button onClick={onSuccess} className="w-full">Desbloquear Agora</Button>
          </div>
          
          <div className="opacity-20 select-none">
            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-zinc-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 bg-zinc-800 rounded-full shrink-0"></div>
                  <div className="h-4 w-full bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-purple-600 rounded-3xl p-10 text-white shadow-2xl shadow-purple-600/20">
          <div className="mb-8">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Acesso Vitalício + IA</span>
            <div className="flex items-end gap-2 mt-4">
              <span className="text-5xl font-black">R$ 97</span>
              <span className="text-xl opacity-70 mb-1">,00</span>
            </div>
            <p className="mt-4 opacity-80 text-lg">Pague uma vez, lucre para sempre.</p>
          </div>

          <ul className="space-y-4 mb-10">
            {[
              "Mentor de IA 24/7 (TikTok Shop Expert)",
              "Plano de Ação Diário de 90 dias",
              "Análise de Viralização Instantânea",
              "Hack de Ganchos e Roteiros",
              "Acesso ao Dashboard de Métricas Pro"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Button variant="secondary" onClick={onSuccess} className="w-full py-5 text-xl">
            Garantir Meu Acesso
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-60">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
