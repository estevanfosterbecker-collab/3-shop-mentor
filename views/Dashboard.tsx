
import React, { useState } from 'react';
import { UserState, Task, SavedPrompt } from '../types';
import { Button } from '../components/Button';
import { ChatMentor } from './ChatMentor';
import { PromptAI } from './PromptAI';

interface DashboardProps {
  user: UserState;
  onCompleteTask: (id: string) => void;
  onUpdatePrompts: (prompts: SavedPrompt[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onCompleteTask, onUpdatePrompts }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'strategy' | 'prompt_ai'>('home');

  const navItems = [
    { id: 'home', label: 'Painel', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'strategy', label: 'Estratégia', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'prompt_ai', label: 'Prompt AI', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { id: 'chat', label: 'Mentor IA', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
  ];

  const XP_THRESHOLDS = [0, 500, 1500, 3500, 7000, 15000];
  const progressInLevel = ((user.points - XP_THRESHOLDS[user.level - 1]) / (XP_THRESHOLDS[user.level] - XP_THRESHOLDS[user.level - 1])) * 100;

  const currentAnalysis = user.analysis;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-zinc-900/30 border-r border-zinc-800/50 flex-col shrink-0">
        <div className="p-8 text-xl font-black text-purple-500 tracking-tighter">
          SHOP<span className="text-white">MENTOR</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${activeTab === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 mx-4 mb-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-400 border border-zinc-800">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.8.2-.82.41-1.45 1.19-1.66 2.08-.24.97-.04 2.03.52 2.87.56.84 1.51 1.38 2.5 1.47 1.12.11 2.29-.27 3.09-1.07.72-.73 1.11-1.74 1.12-2.75V.02z"/></svg>
             </div>
             <div>
               <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">@ACCOUNT</div>
               <div className="text-[10px] font-bold text-white leading-tight">@{user.tiktokHandle}</div>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-500 font-black text-xs border border-purple-500/20">L{user.level}</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider">{user.levelName}</div>
              <div className="text-[9px] text-zinc-500 font-bold">{user.points} XP</div>
            </div>
          </div>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${progressInLevel}%` }}></div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-10 pb-24 md:pb-10 relative">
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="mb-10">
              <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tighter uppercase">Missões Diárias</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Validação automática via API TikTok</p>
            </header>

            <div className="space-y-4">
              {user.dailyTasks.map(task => (
                <div key={task.id} className={`p-6 rounded-3xl border transition-all ${task.completed ? 'bg-zinc-900/20 border-zinc-800 opacity-40 grayscale' : 'bg-zinc-900/60 border-zinc-800 hover:border-purple-600/40 shadow-xl'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${task.needsTikTokValidation ? 'bg-zinc-800 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
                           {task.needsTikTokValidation ? '📡 API TikTok' : '✅ Manual'}
                         </span>
                         {task.validationStatus === 'validated' && <span className="text-[8px] font-black uppercase text-green-500">Verificado</span>}
                         {task.validationStatus === 'failed' && <span className="text-[8px] font-black uppercase text-red-500">Erro: Tentar Novamente</span>}
                      </div>
                      <h4 className="text-base font-black uppercase tracking-tight">{task.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">{task.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-purple-500 font-black text-[10px] mb-2">+{task.points} XP</div>
                      <Button 
                        onClick={() => onCompleteTask(task.id)} 
                        disabled={task.completed || task.isVerifying} 
                        variant={task.validationStatus === 'failed' ? 'outline' : 'primary'}
                        className="px-4 py-2 text-[9px] uppercase tracking-widest rounded-xl font-black"
                      >
                        {task.isVerifying ? 'Verificando...' : task.completed ? 'Concluído' : 'Validar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full animate-in fade-in duration-500">
            <ChatMentor analysis={currentAnalysis!} />
          </div>
        )}

        {activeTab === 'prompt_ai' && (
          <div className="h-full animate-in fade-in duration-500">
            <PromptAI savedPrompts={user.savedPrompts || []} onUpdatePrompts={onUpdatePrompts} />
          </div>
        )}

        {activeTab === 'strategy' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
             <header className="mb-10">
               <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter uppercase">Estratégia Personalizada</h2>
               <div className="flex flex-wrap items-center gap-3">
                 <span className="text-[10px] font-black bg-purple-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                   Health Score: {currentAnalysis?.score || '--'}/100
                 </span>
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                   Potencial: {currentAnalysis?.viralPotential || 'Calculando...'}
                 </span>
               </div>
             </header>

             {currentAnalysis ? (
               <div className="grid gap-3">
                  {currentAnalysis.strategicActionPlan.map((step, i) => (
                    <div key={i} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] flex gap-5 items-center group transition-all hover:bg-zinc-900">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-sm font-black text-purple-600 border border-zinc-800 group-hover:border-purple-600/30">
                        {i + 1}
                      </div>
                      <p className="text-zinc-200 text-sm font-bold leading-relaxed flex-1">{step}</p>
                    </div>
                  ))}
                  
                  <div className="mt-8 p-8 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800">
                     <h4 className="text-xs font-black mb-4 text-purple-500 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Gargalos Identificados
                     </h4>
                     <div className="grid sm:grid-cols-2 gap-4">
                        {currentAnalysis.weaknesses.map((w, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800/50 rounded-2xl text-[11px] font-bold text-zinc-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                             {w}
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
             ) : (
               <div className="py-24 text-center">
                 <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                 <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Recuperando seu plano de guerra...</p>
               </div>
             )}
           </div>
        )}
      </main>

      {/* Navegação Mobile - Visual de App Pro */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 flex justify-around p-4 z-50">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-purple-500 scale-105' : 'text-zinc-600'}`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-purple-600/10' : ''}`}>
               {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
