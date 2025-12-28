
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Tipos e Interfaces ---
type View = 'landing' | 'auth' | 'path-selection' | 'quiz' | 'upload-profile' | 'checkout' | 'dashboard';
type DashboardSubView = 'painel' | 'estrategias' | 'mentor';
type AuthMode = 'login' | 'signup';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface User {
  id: string;
  email: string;
  passwordHash: string;
  isSubscriber?: boolean;
  createdAt: string;
  xp: number;
  points: number;
  streak: number;
  completedTasks: string[]; 
  activityHistory: { id: string, text: string, xp: number, date: string }[];
}

interface Project {
  id: string;
  userId: string;
  status: 'active' | 'finished';
  profileData?: {
    username: string;
    followers: string;
    likes: string;
    imageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface QuizAnswers {
  projectId: string;
  answers: Record<string, string>;
}

// --- Banco de Dados Persistente ---
const DB = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem('sm_users') || '[]'),
  saveUser: (user: User) => {
    const users = DB.getUsers();
    const filtered = users.filter(u => u.id !== user.id);
    localStorage.setItem('sm_users', JSON.stringify([...filtered, user]));
  },
  getProjects: (): Project[] => JSON.parse(localStorage.getItem('sm_projects') || '[]'),
  saveProject: (project: Project) => {
    const projects = DB.getProjects();
    const filtered = projects.filter(p => p.id !== project.id);
    localStorage.setItem('sm_projects', JSON.stringify([...filtered, project]));
  },
  updateProjectStatus: (projectId: string, status: 'active' | 'finished') => {
    const projects = DB.getProjects().map(p => 
      p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p
    );
    localStorage.setItem('sm_projects', JSON.stringify(projects));
  },
  getQuizAnswers: (): QuizAnswers[] => JSON.parse(localStorage.getItem('sm_quiz_answers') || '[]'),
  saveQuizAnswers: (answer: QuizAnswers) => {
    const answers = DB.getQuizAnswers();
    const filtered = answers.filter(a => a.projectId !== answer.projectId);
    localStorage.setItem('sm_quiz_answers', JSON.stringify([...filtered, answer]));
  },
  getActiveProject: (userId: string): Project | undefined => {
    return DB.getProjects().find(p => p.userId === userId && p.status === 'active');
  }
};

// --- Constantes e Utilitários ---
const TASK_LIST = [
  { id: 't1', text: 'Analisar Tendências', description: 'Encontre 3 sons virais que combinam com seu nicho.', xp: 50, icon: 'search' },
  { id: 't2', text: 'Gravar Hook', description: 'Grave os primeiros 3 segundos de um vídeo focado em curiosidade.', xp: 100, icon: 'video' },
  { id: 't3', text: 'Otimizar Bio', description: 'Siga as recomendações do mentor para sua biografia.', xp: 30, icon: 'user' },
  { id: 't4', text: 'Responder Comentários', description: 'Interaja com pelo menos 5 comentários em seus vídeos.', xp: 40, icon: 'message-square' }
];

const getLevel = (xp: number) => Math.floor(xp / 500) + 1;

// --- Componentes de UI Básicos ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
  const base = "w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider";
  const variants: any = {
    primary: "bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-lg shadow-purple-600/20 text-white",
    secondary: "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300",
    outline: "border border-purple-600/30 hover:bg-purple-600/10 text-purple-400",
    ghost: "text-zinc-500 hover:text-white"
  };
  return (
    <button disabled={disabled || loading} onClick={onClick} className={`${base} ${variants[variant]} ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }: any) => (
  <div onClick={onClick} className={`glass rounded-3xl p-6 ${className} ${onClick ? 'cursor-pointer hover:border-purple-600/50 transition-all' : ''}`}>
    {children}
  </div>
);

// --- Componente da Tela Inicial ---
const LandingView = ({ onSignup, onLogin, onDirectCheckout }: any) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    { text: "Finalmente consegui seguir uma estratégia de verdade.", name: "Juliana Santos", handle: "@ju_sales", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" },
    { text: "O app me mostrou exatamente o que fazer todo dia.", name: "Roberto Silva", handle: "@beto_creator", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
    { text: "Pare de postar no escuro, aqui tudo faz sentido.", name: "Marina Lopes", handle: "@marina_shop", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" },
    { text: "Vender no TikTok ficou mais claro do que nunca.", name: "Diego Ramos", handle: "@diego_ttshop", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center selection:bg-purple-500/30 pb-20">
      <header className="w-full max-w-4xl px-6 pt-12 pb-16 flex flex-col items-center text-center gap-6 step-enter">
        <div className="w-20 h-20 rounded-3xl purple-gradient flex items-center justify-center shadow-2xl shadow-purple-600/40 mb-2 animate-bounce-slow">
          <i data-lucide="shopping-bag" className="text-white w-10 h-10"></i>
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Shop Mentor</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em]">Domine o TikTok Shop</p>
        </div>
        
        <div className="flex flex-col items-center gap-3 mt-4 bg-zinc-900/40 px-6 py-4 rounded-3xl border border-zinc-800/50 backdrop-blur-md step-enter delay-100">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <i key={s} data-lucide="star" className="w-4 h-4 fill-yellow-500 text-yellow-500"></i>)}
            <span className="text-sm font-black ml-2 text-white">4.9/5</span>
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Avaliado por +2.000 criadores ativos</p>
          <div className="flex -space-x-2 mt-1">
            {testimonials.map((t, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 overflow-hidden shadow-xl">
                <img src={t.img} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-purple-600 flex items-center justify-center text-[10px] font-bold shadow-xl">+</div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl px-6 flex flex-col gap-20">
        <section className="text-center space-y-6 step-enter delay-200">
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter">
            Pare de postar e comece a <span className="purple-text-gradient">vender.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
            Transformamos criadores comuns em máquinas de vendas no TikTok Shop através de inteligência aplicada e gamificação.
          </p>
        </section>

        <section className="space-y-8 step-enter delay-300">
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Prova Social Real</h3>
            <p className="text-sm font-bold text-zinc-400">Resultados de quem já vive a estratégia</p>
          </div>
          <div className="relative h-56 md:h-48 flex items-center justify-center">
            {testimonials.map((c, i) => (
              <div 
                key={i} 
                className={`absolute inset-x-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform ${
                  i === activeTestimonial 
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
                }`}
              >
                <Card className="max-w-md mx-auto p-6 space-y-4 border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="quote" className="w-20 h-20 text-white"></i>
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 bg-zinc-800 overflow-hidden shrink-0 shadow-lg shadow-purple-500/10">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black text-white">{c.name}</p>
                          <p className="text-[11px] text-zinc-500 font-bold tracking-tight">{c.handle}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <i key={s} data-lucide="star" className="w-3 h-3 fill-yellow-500 text-yellow-500"></i>)}
                        </div>
                      </div>
                      <p className="text-sm font-bold leading-relaxed text-zinc-200 italic">"{c.text}"</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === activeTestimonial ? 'w-8 bg-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'w-2 bg-zinc-800'}`}></div>
            ))}
          </div>
        </section>

        <section className="space-y-10 py-10 step-enter delay-500">
          <h3 className="text-center text-2xl font-black uppercase italic tracking-tighter">O que você recebe hoje:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "target", title: "Estratégia Diária", desc: "Ações práticas baseadas em dados do seu perfil." },
              { icon: "award", title: "Gamificação Real", desc: "Ganhe XP e evolua seu nível enquanto vende." },
              { icon: "brain", title: "Mentor AI 24/7", desc: "Seu consultor de vendas disponível a qualquer hora." },
              { icon: "check-circle", title: "Validação Tática", desc: "Suas tarefas são validadas para garantir progresso." },
            ].map((b, i) => (
              <div key={i} className="flex gap-5 items-start p-4 rounded-3xl bg-zinc-900/20 border border-zinc-800/30 transition-all hover:bg-zinc-900/40 hover:border-purple-600/20 hover:scale-[1.02] group duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center shrink-0 group-hover:bg-purple-600/20 transition-colors">
                  <i data-lucide={b.icon} className="w-6 h-6 text-purple-500"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm uppercase italic text-zinc-100 group-hover:text-purple-400 transition-colors">{b.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 sticky bottom-8 z-50 px-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          <div className="absolute inset-0 bg-black/80 blur-3xl -z-10 h-40 -top-16"></div>
          <Button onClick={onSignup} className="shadow-2xl shadow-purple-600/40 text-lg py-5 relative overflow-hidden group">
            <span className="relative z-10">Criar minha conta grátis</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
          <Button variant="secondary" onClick={onLogin} className="py-5 bg-zinc-950/80 backdrop-blur-xl hover:bg-zinc-900">Entrar no painel</Button>
        </section>

        <footer className="text-center pt-10 pb-20">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12"></div>
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
               <i data-lucide="shopping-bag" className="w-6 h-6"></i>
            </div>
            <p className="text-zinc-500 text-xs font-bold leading-relaxed max-w-xs uppercase tracking-widest">
              Acompanhe sua evolução e domine o algoritmo de vendas mais forte da atualidade.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// --- Novo Componente de Quiz Refatorado ---
const QuizView = ({ onComplete }: { onComplete: (answers: Record<string, string>) => void }) => {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const pages = [
    {
      title: "SITUAÇÃO ATUAL",
      questions: [
        { id: 'q1', text: '1️⃣ Qual descreve melhor seu momento no TikTok hoje? 📉📈', options: ['Estou começando do zero', 'Posto, mas quase ninguém vê', 'Tenho views, mas não vendo', 'Já vendo, mas de forma inconsistente'] },
        { id: 'q2', text: '2️⃣ Quantas vezes você posta por semana? ⏱️', options: ['Menos de 2 vezes', '3 a 4 vezes', '5 a 7 vezes', 'Todos os dias'] },
        { id: 'q3', text: '3️⃣ Hoje, o que mais te frustra no TikTok? 😤', options: ['Falta de visualizações', 'Falta de vendas', 'Falta de constância', 'Não saber o que postar'] },
        { id: 'q4', text: '4️⃣ Você já tentou vender no TikTok Shop? 🛒', options: ['Nunca tentei', 'Já tentei e não funcionou', 'Vendo pouco', 'Já tenho resultados'] },
      ]
    },
    {
      title: "DOR E BLOQUEIOS",
      questions: [
        { id: 'q5', text: '5️⃣ O que mais te trava na hora de postar? 🧠', options: ['Medo de não dar certo', 'Falta de ideias', 'Falta de tempo', 'Falta de estratégia'] },
        { id: 'q6', text: '6️⃣ Você sente que está perdendo tempo postando? ⌛', options: ['Sim, total', 'Às vezes', 'Não, mas poderia melhorar', 'Ainda não sei'] },
        { id: 'q7', text: '7️⃣ Hoje você segue alguma estratégia clara? 🗺️', options: ['Não sigo nada', 'Copio outros criadores', 'Tento criar sozinho', 'Tenho uma estratégia definida'] },
        { id: 'q8', text: '8️⃣ O que mais te incomoda ao ver outros crescendo? 😓', options: ['Não entender o motivo', 'Falta de consistência', 'Sentir que estou atrasado', 'Ver gente pior crescendo'] },
      ]
    },
    {
      title: "OBJETIVOS",
      questions: [
        { id: 'q9', text: '9️⃣ Qual seu principal objetivo com o TikTok Shop? 🎯', options: ['Primeira venda', 'Renda extra', 'Viver disso', 'Escalar faturamento'] },
        { id: 'q10', text: '🔟 Quanto você gostaria de faturar por mês? 💰', options: ['Até R$1.000', 'R$1.000 a R$5.000', 'R$5.000 a R$10.000', 'Acima de R$10.000'] },
        { id: 'q11', text: '1️⃣1️⃣ Em quanto tempo você quer resultados? ⏳', options: ['O mais rápido possível', 'Em 30 dias', 'Em 90 dias', 'No longo prazo'] },
        { id: 'q12', text: '1️⃣2️⃣ O que significaria dar certo no TikTok pra você? 🚀', options: ['Liberdade financeira', 'Parar de depender de outros', 'Provar que consigo', 'Ajudar minha família'] },
      ]
    },
    {
      title: "EXECUÇÃO",
      questions: [
        { id: 'q13', text: '1️⃣3️⃣ Você consegue seguir tarefas diárias? ✅', options: ['Sim, facilmente', 'Sim, se for simples', 'Tenho dificuldade', 'Depende do dia'] },
        { id: 'q14', text: '1️⃣4️⃣ Você prefere instruções como? 🧩', options: ['Passo a passo', 'Exemplos práticos', 'Checklists', 'Tudo junto'] },
        { id: 'q15', text: '1️⃣5️⃣ Você gosta de acompanhar progresso? 📊', options: ['Sim, motiva muito', 'Um pouco', 'Tanto faz', 'Não gosto'] },
        { id: 'q16', text: '1️⃣6️⃣ O que mais te faria continuar usando um app? 🔁', options: ['Resultados claros', 'Organização', 'Cobrança diária', 'Evolução visível'] },
      ]
    },
    {
      title: "PERFIL E COMPROMISSO",
      questions: [
        { id: 'q17', text: '1️⃣7️⃣ Você se considera disciplinado? 🔥', options: ['Muito', 'Médio', 'Pouco', 'Estou tentando melhorar'] },
        { id: 'q18', text: '1️⃣8️⃣ Se tivesse um plano claro, você executaria? 🧠➡️📱', options: ['Sim, sem desculpas', 'Sim, se for simples', 'Talvez', 'Não sei'] },
        { id: 'q19', text: '1️⃣9️⃣ Você está disposto a seguir um método? 🧱', options: ['Sim', 'Sim, se funcionar', 'Ainda tenho dúvidas', 'Depende'] },
        { id: 'q20', text: '2️⃣0️⃣ Agora, envie um PRINT do seu perfil do TikTok 📸', options: [], type: 'file' },
      ]
    }
  ];

  const handleOptionSelect = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleOtherTextChange = (qId: string, text: string) => {
    setOtherText(prev => ({ ...prev, [qId]: text }));
    setAnswers(prev => ({ ...prev, [qId]: 'Outros' }));
  };

  const validatePage = () => {
    const currentPageQuestions = pages[page].questions;
    for (const q of currentPageQuestions) {
      if (q.type === 'file') {
        if (!file) return false;
      } else {
        if (!answers[q.id]) return false;
        if (answers[q.id] === 'Outros' && !otherText[q.id]) return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const blobToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeProfile = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const base64 = await blobToBase64(file);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: file.type } },
            { text: 'Analise esta imagem. Ela é um print de um perfil do TikTok? Responda em JSON: { "isTikTokProfile": boolean, "username": "string or null" }. Apenas o JSON.' }
          ]
        },
        config: { responseMimeType: 'application/json' }
      });
      const result = JSON.parse(response.text || '{}');
      if (result.isTikTokProfile) {
        // Finaliza Quiz
        const finalAnswers = { ...answers };
        Object.keys(otherText).forEach(k => {
          if (finalAnswers[k] === 'Outros') finalAnswers[k] = otherText[k];
        });
        onComplete(finalAnswers);
      } else {
        setError('A imagem enviada não parece ser um perfil do TikTok válido. Por favor, tente novamente.');
      }
    } catch (e) {
      setError('Erro ao analisar imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      analyzeProfile();
    }
  };

  const progress = ((page + 1) / pages.length) * 100;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 pb-24 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-2xl space-y-10 animate-in fade-in duration-500">
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-black italic uppercase text-purple-400">{pages[page].title}</h2>
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{Math.round(progress)}% Concluído</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
            <div className="h-full bg-purple-600 transition-all duration-700 shadow-[0_0_15px_rgba(124,58,237,0.4)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {pages[page].questions.map((q) => (
            <div key={q.id} className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-100 leading-tight">{q.text}</h3>
              
              {q.type === 'file' ? (
                <div className="space-y-4">
                  <div 
                    className={`relative w-full h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden ${
                      file ? 'border-purple-600 bg-purple-600/5' : 'border-zinc-800 hover:border-purple-600/30 bg-zinc-900/40'
                    }`}
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <i data-lucide="image" className="w-8 h-8 text-purple-400"></i>
                        <span className="text-xs font-bold text-zinc-400">{file.name}</span>
                        <Button variant="ghost" className="text-[10px] py-1">Trocar Imagem</Button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-purple-400 transition-colors">
                           <i data-lucide="upload" className="w-6 h-6"></i>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Clique para enviar o print</p>
                      </>
                    )}
                    <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  {error && <p className="text-red-500 text-[11px] font-bold uppercase text-center">{error}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => handleOptionSelect(q.id, opt)}
                      className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                        answers[q.id] === opt ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                     <button 
                       onClick={() => handleOptionSelect(q.id, 'Outros')}
                       className={`w-full p-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                         answers[q.id] === 'Outros' ? 'bg-zinc-800 border-purple-500 text-white' : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                       }`}
                     >
                       Outros (escrever)
                     </button>
                     {answers[q.id] === 'Outros' && (
                       <input 
                         type="text"
                         autoFocus
                         value={otherText[q.id] || ''}
                         onChange={(e) => handleOtherTextChange(q.id, e.target.value)}
                         placeholder="Escreva sua resposta..."
                         className="w-full bg-zinc-900 border-2 border-purple-600/40 rounded-2xl p-4 text-sm outline-none focus:border-purple-600 animate-in slide-in-from-top-2"
                       />
                     )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Nav */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={nextStep} 
            disabled={!validatePage() || loading} 
            loading={loading}
            className="shadow-xl"
          >
            {page === pages.length - 1 ? 'FINALIZAR DIAGNÓSTICO' : 'PRÓXIMA ETAPA'}
          </Button>
          {page > 0 && (
            <button 
              onClick={() => setPage(page - 1)}
              className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400 transition-colors"
            >
              Voltar etapa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Componente de Checkout ---
const CheckoutView = ({ onSubscribe }: { onSubscribe: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(82800 + Math.floor(Math.random() * 3600)); // ~23 horas
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { text: "Recuperei o investimento na primeira semana de shop.", name: "Carla Viegas", handle: "@carla_shop", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop" },
    { text: "O mentor AI me deu o roteiro exato que viralizou.", name: "Henrique M.", handle: "@henri_tt", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&auto=format&fit=crop" },
    { text: "Finalmente um sistema que funciona no Brasil.", name: "Sônia R.", handle: "@sonia_creators", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0ad2f01?q=80&w=200&h=200&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    const carousel = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => { clearInterval(timer); clearInterval(carousel); };
  }, [testimonials.length]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePayment = (plan: string) => {
    setIsProcessing(true);
    setTimeout(() => { 
      setIsProcessing(false); 
      setShowSuccess(true); 
      setTimeout(onSubscribe, 2000); 
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 lg:p-12 overflow-y-auto no-scrollbar">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in backdrop-blur-xl">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 glow-green animate-success shadow-[0_0_50px_rgba(34,197,94,0.4)]">
            <i data-lucide="check" className="w-12 h-12 text-white"></i>
          </div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Acesso Liberado!</h3>
          <p className="text-zinc-400 font-bold">Redirecionando para seu painel...</p>
        </div>
      )}

      {/* Header Escassez */}
      <div className="w-full max-w-4xl text-center space-y-4 mb-12 step-enter">
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-600/30 mb-2">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Seja um dos 100 escolhidos</span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black italic uppercase leading-tight tracking-tight max-w-3xl mx-auto">
          Se você está vendo isso, é porque foi selecionado entre as 100 pessoas para acessar recursos do app ainda não disponíveis no Brasil
        </h1>
        <p className="text-zinc-500 font-bold text-sm md:text-base">
          Use o mesmo sistema que criadores estão usando para crescer e vender no TikTok Shop
        </p>
      </div>

      {/* Relógio de Escassez */}
      <div className="mb-12 flex flex-col items-center gap-2 step-enter delay-100">
         <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-3 rounded-2xl border border-zinc-800 animate-timer">
            <i data-lucide="clock" className="w-5 h-5 text-red-500"></i>
            <span className="text-2xl font-black tabular-nums tracking-widest text-white">{formatTime(timeLeft)}</span>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Oferta disponível por tempo limitado</p>
      </div>

      {/* Planos Section */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 step-enter delay-200">
        <Card className="flex flex-col items-center text-center p-8 space-y-6 relative border-zinc-800/50 bg-zinc-950/40">
           <div className="space-y-1">
             <p className="text-[11px] font-black uppercase tracking-widest text-zinc-600">Plano Mensal</p>
             <h4 className="text-lg font-black italic uppercase">Acesso Flexível</h4>
           </div>
           
           <div className="space-y-0">
             <p className="text-sm font-bold text-zinc-600 line-through decoration-red-500/50">R$ 197</p>
             <div className="flex items-baseline justify-center gap-1">
               <span className="text-xl font-bold">R$</span>
               <span className="text-5xl font-black italic">47</span>
               <span className="text-sm font-bold text-zinc-500">/mês</span>
             </div>
             <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">Total anual: R$ 564</p>
           </div>

           <Button variant="secondary" onClick={() => handlePayment('mensal')} loading={isProcessing} className="border-zinc-800 hover:border-purple-600/50">Assinar Mensal</Button>
        </Card>

        <Card className="flex flex-col items-center text-center p-8 space-y-6 relative bg-zinc-900/40 border-purple-600/50 shadow-[0_0_40px_rgba(124,58,237,0.1)] overflow-hidden">
           <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">Melhor custo-benefício</div>
           <div className="space-y-1 pt-4">
             <p className="text-[11px] font-black uppercase tracking-widest text-purple-400">Plano Anual</p>
             <h4 className="text-lg font-black italic uppercase text-white">Dominação Total</h4>
           </div>
           
           <div className="space-y-0">
             <p className="text-sm font-bold text-zinc-600 line-through decoration-red-500/50">R$ 197</p>
             <div className="flex items-baseline justify-center gap-1">
               <span className="text-xl font-bold text-purple-400">R$</span>
               <span className="text-6xl font-black italic text-white">35</span>
               <span className="text-sm font-bold text-zinc-500">/mês</span>
             </div>
             <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Total anual: R$ 419</p>
           </div>

           <Button onClick={() => handlePayment('anual')} loading={isProcessing} className="bg-purple-600 hover:bg-purple-700 glow-purple">Assinar Anual (Recomendado)</Button>
        </Card>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-6 mb-20 step-enter delay-300">
        {[
          { icon: "calendar", label: "Acompanhamento diário" },
          { icon: "target", label: "Plano personalizado" },
          { icon: "award", label: "Gamificação ativa" },
          { icon: "brain", label: "Mentor AI Expert" },
          { icon: "eye", label: "Monitoramento real" },
          { icon: "refresh-cw", label: "Atualizações VIP" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
               <i data-lucide={item.icon} className="w-4 h-4 text-purple-500"></i>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase leading-tight">{item.label}</span>
          </div>
        ))}
      </div>

      <footer className="w-full max-w-4xl pt-10 border-t border-zinc-900 flex flex-col items-center gap-4 text-center">
         <div className="flex gap-6 grayscale opacity-20">
            <i data-lucide="shield-check" className="w-6 h-6"></i>
            <i data-lucide="lock" className="w-6 h-6"></i>
            <i data-lucide="zap" className="w-6 h-6"></i>
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Pagamento 100% Seguro & Acesso Imediato</p>
      </footer>
    </div>
  );
};

// --- Componentes do Dashboard ---
const XpToast = ({ xp, visible }: { xp: number, visible: boolean }) => (
  <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${visible ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 -translate-y-10 scale-90'}`}>
    <div className="bg-purple-600 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center gap-3 border border-purple-400/50">
       <i data-lucide="zap" className="w-5 h-5 fill-white"></i>
       <span className="text-sm font-black italic uppercase tracking-widest text-white">+{xp} XP</span>
    </div>
  </div>
);

const DashboardHeader = ({ user, project }: any) => {
  const level = getLevel(user?.xp || 0);
  const nextLevelXp = level * 500;
  const currentLevelXp = (level - 1) * 500;
  const progress = Math.min(100, Math.max(0, ((user?.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <header className="p-6 border-b border-zinc-900 bg-black/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden">
            {project?.profileData?.imageUrl ? (
              <img src={project.profileData.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <i data-lucide="user" className="w-6 h-6"></i>
            )}
         </div>
         <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Criador Nível {level}</p>
           <h3 className="text-sm font-black italic uppercase tracking-tight">{user?.email.split('@')[0]}</h3>
         </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
         <div className="flex justify-between w-full text-[9px] font-black uppercase tracking-widest text-zinc-500">
           <span>Progresso</span>
           <span>{Math.floor(progress)}%</span>
         </div>
         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
         </div>
      </div>
    </header>
  );
};

const DashboardView = ({ currentUser, project, onLogout, onCompleteTask }: any) => {
  const [taskFeedback, setTaskFeedback] = useState<{ xp: number, visible: boolean }>({ xp: 0, visible: false });
  const [validatingTasks, setValidatingTasks] = useState<string[]>([]);
  const [subView, setSubView] = useState<DashboardSubView>('painel');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'E aí, campeão! Sou seu Mentor AI. Vamos dominar o TikTok Shop hoje? 🚀' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleTaskAction = (task: typeof TASK_LIST[0]) => {
    if (currentUser?.completedTasks.includes(task.id) || validatingTasks.includes(task.id)) return;
    setValidatingTasks(prev => [...prev, task.id]);
    setTimeout(() => {
      onCompleteTask(task);
      setValidatingTasks(prev => prev.filter(id => id !== task.id));
      setTaskFeedback({ xp: task.xp, visible: true });
      setTimeout(() => setTaskFeedback({ xp: 0, visible: false }), 2000);
    }, 2000);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: newMessages.map(m => ({ text: m.text })) },
        config: {
          systemInstruction: 'Você é um Mentor AI do TikTok Shop. Responda com frases curtas, rápidas, motivadoras e muitos emojis. Linguagem direta ao ponto. Sempre sugira o próximo passo e encerre com uma pergunta curta.',
          temperature: 0.8,
        }
      });
      setMessages([...newMessages, { role: 'model', text: response.text || 'Opa, algo deu errado. Tenta de novo! 😅' }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'model', text: 'Ih, perdi o sinal por um segundo. Vamos tentar de novo? 🔥' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const QuickAction = ({ text, onClick }: { text: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-purple-600 hover:bg-purple-600/10 transition-all whitespace-nowrap"
    >
      {text}
    </button>
  );

  const NavItem = ({ id, icon, label }: { id: DashboardSubView, icon: string, label: string }) => {
    const active = subView === id;
    return (
      <button 
        onClick={() => setSubView(id)}
        className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-2 ${active ? 'text-purple-500' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <i data-lucide={icon} className={`w-6 h-6 ${active ? 'fill-purple-500/10' : ''}`}></i>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  const SidebarNavItem = ({ id, icon, label }: { id: DashboardSubView, icon: string, label: string }) => {
    const active = subView === id;
    return (
      <button 
        onClick={() => setSubView(id)}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${active ? 'bg-purple-600/10 text-purple-400' : 'text-zinc-500 hover:text-white'}`}
      >
        <i data-lucide={icon} className="w-5 h-5"></i> {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row pb-16 lg:pb-0">
      <XpToast {...taskFeedback} />
      
      <aside className="hidden lg:flex w-72 bg-zinc-950 border-r border-zinc-900 flex-col p-8 space-y-10">
        <div className="text-xl font-black uppercase italic flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg purple-gradient flex items-center justify-center"><i data-lucide="shopping-bag" className="w-4 h-4"></i></div>
          Shop Mentor
        </div>
        <nav className="space-y-2 flex-grow">
          <SidebarNavItem id="painel" icon="layout-grid" label="Painel" />
          <SidebarNavItem id="estrategias" icon="target" label="Estratégias" />
          <SidebarNavItem id="mentor" icon="brain" label="Mentor AI" />
        </nav>
        <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-900/50 hover:text-red-500 transition-colors mt-auto"><i data-lucide="log-out" className="w-5 h-5"></i> Sair</button>
      </aside>

      <main className="flex-grow flex flex-col min-h-screen overflow-y-auto relative">
        <DashboardHeader user={currentUser} project={project} />
        
        <div className="p-6 lg:p-10 space-y-12 pb-24">
          
          {subView === 'painel' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
                    <i data-lucide="target" className="w-6 h-6 text-purple-500"></i> Missões do Dia
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TASK_LIST.map(task => {
                    const isDone = currentUser?.completedTasks.includes(task.id);
                    const isValidating = validatingTasks.includes(task.id);
                    return (
                      <Card 
                        key={task.id} 
                        className={`relative overflow-hidden transition-all border-l-4 ${
                          isDone ? 'border-l-green-500 bg-green-500/5' : 
                          isValidating ? 'border-l-yellow-500 bg-yellow-500/5' : 
                          'border-l-purple-600 hover:border-l-purple-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-2xl shrink-0 ${isDone ? 'bg-green-500/10 text-green-500' : 'bg-purple-600/10 text-purple-400'}`}>
                              <i data-lucide={task.icon} className="w-6 h-6"></i>
                            </div>
                            <div className="space-y-1">
                              <h4 className={`font-black text-sm uppercase italic ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>{task.text}</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px]">{task.description}</p>
                              <div className="flex items-center gap-2 pt-2">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1">
                                   <i data-lucide="zap" className="w-3 h-3 fill-purple-400"></i> +{task.xp} XP
                                 </span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                   isDone ? 'bg-green-500/20 border-green-500/30 text-green-500' :
                                   isValidating ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500 animate-pulse' :
                                   'bg-zinc-800 border-zinc-700 text-zinc-500'
                                 }`}>
                                   {isDone ? 'Concluída' : isValidating ? 'Validando...' : 'Pendente'}
                                 </span>
                              </div>
                            </div>
                          </div>
                          {!isDone && (
                            <button 
                              disabled={isValidating}
                              onClick={() => handleTaskAction(task)}
                              className={`shrink-0 p-3 rounded-xl transition-all ${
                                isValidating ? 'bg-zinc-800 text-zinc-600 cursor-wait' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-purple-600 hover:text-white hover:border-purple-600'
                              }`}
                            >
                              {isValidating ? (
                                <div className="w-5 h-5 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                              ) : (
                                <i data-lucide="check" className="w-5 h-5"></i>
                              )}
                            </button>
                          )}
                          {isDone && <div className="shrink-0 p-3 text-green-500"><i data-lucide="check-circle-2" className="w-6 h-6"></i></div>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <Card className="border-none bg-zinc-900/40 p-6"><p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">XP Total</p><h4 className="text-2xl font-black italic">{currentUser?.xp || 0}</h4></Card>
                 <Card className="border-none bg-zinc-900/40 p-6"><p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Pontos</p><h4 className="text-2xl font-black italic text-yellow-500">{currentUser?.points || 0}</h4></Card>
                 <Card className="border-none bg-zinc-900/40 p-6"><p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Nível</p><h4 className="text-2xl font-black italic text-purple-500">{getLevel(currentUser?.xp || 0)}</h4></Card>
                 <Card className="border-none bg-zinc-900/40 p-6"><p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Streak</p><h4 className="text-2xl font-black italic text-orange-500">{currentUser?.streak || 0} 🔥</h4></Card>
              </div>

              <section className="space-y-4">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-2"><i data-lucide="activity" className="w-5 h-5 text-purple-500"></i> Evolução Recente</h3>
                <div className="space-y-2">
                  {currentUser?.activityHistory && currentUser.activityHistory.length > 0 ? (
                     currentUser.activityHistory.slice(0, 5).map(activity => (
                      <div key={activity.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 flex items-center justify-between animate-in fade-in slide-in-from-right-2">
                         <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                           <span className="text-[11px] text-zinc-300 font-medium">{activity.text}</span>
                         </div>
                         <span className="text-[10px] font-black text-purple-400">+{activity.xp} XP</span>
                      </div>
                     ))
                  ) : (
                    <div className="p-8 text-center text-zinc-600 text-xs uppercase font-bold tracking-widest border border-dashed border-zinc-800 rounded-3xl">Nenhuma atividade ainda</div>
                  )}
                </div>
              </section>
            </div>
          )}

          {subView === 'estrategias' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
                    <i data-lucide="map" className="w-6 h-6 text-purple-500"></i> Roadmap de Sucesso
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium">Seu plano tático para dominar o TikTok Shop em etapas claras.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Engajamento', value: 75, color: 'bg-blue-500', icon: 'users' },
                    { label: 'Conversão', value: 42, color: 'bg-green-500', icon: 'shopping-cart' },
                    { label: 'Consistência', value: 90, color: 'bg-purple-500', icon: 'calendar' }
                  ].map((pilar, idx) => (
                    <Card key={idx} className="bg-zinc-900/40 border-none p-5 space-y-3">
                       <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-zinc-950 text-zinc-400">
                            <i data-lucide={pilar.icon} className="w-4 h-4"></i>
                          </div>
                          <span className="text-xl font-black italic">{pilar.value}%</span>
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{pilar.label}</p>
                       <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                          <div className={`h-full ${pilar.color} transition-all duration-1000`} style={{ width: `${pilar.value}%` }}></div>
                       </div>
                    </Card>
                  ))}
               </div>

               <div className="space-y-6 relative">
                  <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-600/50 to-transparent"></div>
                  
                  {[
                    { step: 1, title: 'Identificação de Nicho', action: 'Defina 3 produtos vencedores com alta demanda no TikTok.', icon: 'search', status: 'completed' },
                    { step: 2, title: 'Estruturação do Gancho', action: 'Crie 5 variações de roteiros com foco nos 3 segundos iniciais.', icon: 'anchor', status: 'current' },
                    { step: 3, title: 'Escala de Conteúdo', action: 'Publique 2 vídeos por dia mantendo a qualidade visual.', icon: 'trending-up', status: 'locked' },
                    { step: 4, title: 'Otimização de Checkout', action: 'Ajuste preços e ofertas com base no feedback da AI.', icon: 'dollar-sign', status: 'locked' }
                  ].map((etapa, idx) => (
                    <div key={idx} className="flex gap-6 relative z-10">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                         etapa.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                         etapa.status === 'current' ? 'bg-purple-600 border-purple-500 text-white glow-purple' :
                         'bg-zinc-900 border-zinc-800 text-zinc-700'
                       }`}>
                          {etapa.status === 'completed' ? <i data-lucide="check" className="w-6 h-6"></i> : <span className="text-xl font-black italic">{etapa.step}</span>}
                       </div>
                       
                       <Card className={`flex-grow p-6 flex flex-col justify-center space-y-1 ${etapa.status === 'locked' ? 'opacity-40 grayscale' : ''}`}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase italic tracking-tight">{etapa.title}</h4>
                            {etapa.status === 'current' && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-purple-600/20 text-purple-400 border border-purple-600/30">Foco Atual</span>}
                          </div>
                          <p className="text-xs text-zinc-400 font-medium">{etapa.action}</p>
                       </Card>
                    </div>
                  ))}
               </div>

               <Button variant="secondary" className="border-dashed border-zinc-800">
                  <i data-lucide="download" className="w-4 h-4"></i> Exportar Plano para PDF
               </Button>
            </div>
          )}

          {subView === 'mentor' && (
            <div className="flex flex-col h-[calc(100vh-220px)] animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
                   <i data-lucide="brain" className="w-6 h-6 text-purple-500"></i> Mentor AI
                </h2>
                <div className="flex items-center gap-2 bg-purple-600/10 px-3 py-1 rounded-full border border-purple-600/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <Card className="flex-grow flex flex-col p-0 overflow-hidden border-purple-600/20 relative bg-zinc-900/40">
                <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} bubble-enter`}>
                       <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                         msg.role === 'user' 
                         ? 'bg-purple-600 text-white rounded-tr-none' 
                         : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start bubble-enter">
                       <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-700/50 flex gap-1 items-center">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 space-y-4">
                   <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      <QuickAction text="Melhorar conversão" onClick={() => handleSendMessage("Como melhorar minha conversão no Shop?")} />
                      <QuickAction text="Dica de engajamento" onClick={() => handleSendMessage("Me dá uma dica pra engajar mais?")} />
                      <QuickAction text="Análise de Bio" onClick={() => handleSendMessage("O que deve ter numa Bio matadora?")} />
                      <QuickAction text="Ideia de Vídeo" onClick={() => handleSendMessage("Sugira um roteiro de vídeo viral")} />
                   </div>

                   <div className="relative">
                      <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                        placeholder="Pergunte qualquer coisa..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-600 transition-all pr-14"
                      />
                      <button 
                        onClick={() => handleSendMessage(inputMessage)}
                        disabled={isTyping || !inputMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50"
                      >
                         <i data-lucide="send" className="w-5 h-5"></i>
                      </button>
                   </div>
                </div>
              </Card>
            </div>
          )}
        </div>
        
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center z-50 lg:hidden px-4">
           <NavItem id="painel" icon="layout-grid" label="Painel" />
           <NavItem id="estrategias" icon="target" label="Estratégias" />
           <NavItem id="mentor" icon="brain" label="Mentor AI" />
        </nav>
      </main>
    </div>
  );
};

// --- Componentes Adicionais de Autenticação ---
const AuthView = ({ authMode, setAuthMode, authError, onAuth, setView }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <Card className="w-full max-w-md p-8 space-y-8 bg-zinc-950/50 border-zinc-800">
        <div className="text-center space-y-2">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter">{authMode === 'signup' ? 'Criar Conta' : 'Entrar'}</h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Domine o TikTok Shop agora</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-600 transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-600 transition-all"
              placeholder="••••••••"
            />
          </div>
          {authError && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{authError}</p>}
        </div>

        <Button onClick={() => onAuth(email, password)}>
          {authMode === 'signup' ? 'Cadastrar' : 'Entrar'}
        </Button>

        <button 
          onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
          className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          {authMode === 'signup' ? 'Já tenho uma conta' : 'Ainda não tenho conta'}
        </button>
        
        <button 
          onClick={() => setView('landing')}
          className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          Voltar para o início
        </button>
      </Card>
    </div>
  );
};

// --- App Principal ---
const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) window.lucide.createIcons();
  }, [view, currentUser]);

  const handleAuthAction = (email: string, pass: string) => {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email);
    if (authMode === 'signup') {
      if (user) { setAuthError('E-mail já existe'); return; }
      const newUser: User = { id: Math.random().toString(36).substring(2, 11), email, passwordHash: pass, isSubscriber: false, createdAt: new Date().toISOString(), xp: 0, points: 0, streak: 1, completedTasks: [], activityHistory: [] };
      DB.saveUser(newUser); setCurrentUser(newUser); setView('quiz');
    } else {
      if (!user || user.passwordHash !== pass) { setAuthError('E-mail ou senha inválidos'); return; }
      setCurrentUser(user);
      if (!user.isSubscriber) setView('checkout');
      else setView('dashboard');
    }
  };

  const onCompleteTask = (task: any) => {
    if (!currentUser) return;
    const updatedUser: User = { 
      ...currentUser, 
      xp: currentUser.xp + task.xp, 
      points: currentUser.points + (task.xp / 2),
      completedTasks: [...currentUser.completedTasks, task.id],
      activityHistory: [{ id: Math.random().toString(36).substring(2, 11), text: `Missão: ${task.text}`, xp: task.xp, date: new Date().toISOString() }, ...currentUser.activityHistory]
    };
    DB.saveUser(updatedUser); setCurrentUser(updatedUser);
  };

  const handleQuizComplete = (ans: Record<string, string>) => {
    if (currentUser) {
      // Salva respostas se necessário
      DB.saveQuizAnswers({ projectId: currentUser.id, answers: ans });
    }
    setView('checkout');
  };

  return (
    <div className="min-h-screen text-zinc-100">
      {view === 'landing' && <LandingView onSignup={() => { setAuthMode('signup'); setView('auth'); }} onLogin={() => { setAuthMode('login'); setView('auth'); }} onDirectCheckout={() => setView('checkout')} />}
      {view === 'auth' && <AuthView authMode={authMode} setAuthMode={setAuthMode} authError={authError} onAuth={handleAuthAction} setView={setView} />}
      {view === 'quiz' && <QuizView onComplete={handleQuizComplete} />}
      {view === 'checkout' && <CheckoutView onSubscribe={() => { if(currentUser) { const u = { ...currentUser, isSubscriber: true }; DB.saveUser(u); setCurrentUser(u); setView('dashboard'); } }} />}
      {view === 'dashboard' && <DashboardView currentUser={currentUser} project={currentProject} onLogout={() => setView('landing')} onCompleteTask={onCompleteTask} />}
    </div>
  );
};

export default App;
