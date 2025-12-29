
import React, { useState, useEffect } from 'react';
import { UserState, ProfileAnalysis, Task, Badge, Challenge, AppNotification, SavedPrompt } from './types';
import { Landing } from './views/Landing';
import { Auth } from './views/Auth';
import { DashboardChoice } from './views/DashboardChoice';
import { Quiz } from './views/Quiz';
import { ProfileUpload } from './views/ProfileUpload';
import { Checkout } from './views/Checkout';
import { TikTokConnect } from './views/TikTokConnect';
import { Dashboard } from './views/Dashboard';
import { analyzeProfileAndQuiz, verifyTikTokActivity } from './services/geminiService';

const DEFAULT_ANALYSIS: ProfileAnalysis = {
  score: 85,
  strengths: ["Consistência de postagem", "Uso de ganchos visuais", "Engajamento nos comentários"],
  weaknesses: ["Conversão direta no Shop", "Storytelling de produto", "Call to Action fraco"],
  strategicActionPlan: [
    "Implementar o método de Ganchos de 3 segundos em todos os vídeos.",
    "Criar uma sequência de 5 vídeos focados em dor vs solução.",
    "Otimizar a vitrine do TikTok Shop com descrições persuasivas.",
    "Realizar lives diárias de 30 minutos para aumentar a confiança.",
    "Responder os top 5 comentários com vídeos de resposta (Video Reply)."
  ],
  viralPotential: "Alto (Escala em 15-30 dias)"
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Postar Vídeo de Gancho', description: 'Publique um vídeo de até 15s focando no gancho principal.', completed: false, points: 100, needsTikTokValidation: true },
  { id: '2', title: 'Otimizar Bio com Link Shop', description: 'Atualize sua bio e verifique se o link do Shop está ativo.', completed: false, points: 50, needsTikTokValidation: true },
  { id: '3', title: 'Check-in Diário', description: 'Analise suas métricas de ontem no TikTok Center.', completed: false, points: 20, needsTikTokValidation: false },
];

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Consistência Inicial', progress: 0, target: 5, xpReward: 200, completed: false },
  { id: 'c2', title: 'Dominando o Gancho', progress: 0, target: 3, xpReward: 150, completed: false },
];

const BADGES: Badge[] = [
  { id: 'b1', name: 'Primeiro Passo', description: 'Completou sua primeira tarefa.', icon: '🎯', unlocked: false },
  { id: 'b2', name: 'Consistente', description: 'Manteve um streak de 3 dias.', icon: '🔥', unlocked: false },
  { id: 'b3', name: 'Estrategista', description: 'Chegou ao nível 3.', icon: '🧠', unlocked: false },
  { id: 'b4', name: 'Executor de Elite', description: 'Completou 10 tarefas no total.', icon: '⚔️', unlocked: false },
];

const LEVEL_NAMES = ['Iniciante', 'Executor', 'Estrategista', 'Escalador', 'Dominante'];

const App: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    hasPaid: false,
    isTikTokConnected: false,
    onboardingStep: 'landing',
    quizAnswers: {},
    points: 0,
    level: 1,
    levelName: 'Iniciante',
    streak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    totalTasksCompleted: 0,
    badges: BADGES,
    challenges: INITIAL_CHALLENGES,
    dailyTasks: INITIAL_TASKS,
    notifications: [],
    savedPrompts: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.email) {
      localStorage.setItem(`shopmentor_user_${user.email}`, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (user.onboardingStep === 'dashboard') {
      if (!user.hasPaid) {
        updateOnboarding('checkout');
      } else if (!user.isTikTokConnected) {
        updateOnboarding('tiktok_connect');
      } else {
        if (!user.analysis) {
          setUser(prev => ({ ...prev, analysis: DEFAULT_ANALYSIS }));
        }
        checkStreak();
      }
    }
  }, [user.hasPaid, user.isTikTokConnected, user.onboardingStep]);

  const addNotification = (type: AppNotification['type'], message: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setUser(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 5)
    }));
  };

  const checkLevelAndBadges = (newXP: number, newTotalTasks: number, currentBadges: Badge[]) => {
    let newLevel = 1;
    if (newXP >= 7000) newLevel = 5;
    else if (newXP >= 3500) newLevel = 4;
    else if (newXP >= 1500) newLevel = 3;
    else if (newXP >= 500) newLevel = 2;

    const newLevelName = LEVEL_NAMES[newLevel - 1];
    const updatedBadges = currentBadges.map(badge => {
      if (!badge.unlocked) {
        if (badge.id === 'b1' && newTotalTasks >= 1) return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        if (badge.id === 'b2' && user.streak >= 3) return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        if (badge.id === 'b3' && newLevel >= 3) return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        if (badge.id === 'b4' && newTotalTasks >= 10) return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return badge;
    });

    if (newLevel > user.level) addNotification('progress', `Nível alcançado: ${newLevelName}!`);
    return { newLevel, newLevelName, updatedBadges };
  };

  const checkStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate;
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (lastLogin === yesterdayStr) {
        setUser(prev => ({ ...prev, streak: prev.streak + 1, lastLoginDate: today }));
      } else {
        setUser(prev => ({ ...prev, streak: 1, lastLoginDate: today }));
      }
    }
  };

  const completeTask = async (id: string) => {
    const task = user.dailyTasks.find(t => t.id === id);
    if (!task || task.completed || task.isVerifying) return;

    setUser(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(t => t.id === id ? { ...t, isVerifying: true, validationStatus: 'pending' as const } : t)
    }));

    let isValid = true;
    if (task.needsTikTokValidation && user.tiktokAccessToken) {
      addNotification('strategic', `Validando "${task.title}" via TikTok API...`);
      isValid = await verifyTikTokActivity(user.tiktokAccessToken);
    }

    if (isValid) {
      setUser(prev => {
        const updatedTasks: Task[] = prev.dailyTasks.map(t => 
          t.id === id ? { ...t, completed: true, isVerifying: false, validationStatus: 'validated' as const } : t
        );
        const newXP = prev.points + task.points;
        const newTotalTasks = prev.totalTasksCompleted + 1;
        const { newLevel, newLevelName, updatedBadges } = checkLevelAndBadges(newXP, newTotalTasks, prev.badges);

        addNotification('execution', `XP Concedido! +${task.points} pontos.`);

        return {
          ...prev,
          points: newXP,
          level: newLevel,
          levelName: newLevelName,
          totalTasksCompleted: newTotalTasks,
          badges: updatedBadges,
          dailyTasks: updatedTasks
        };
      });
    } else {
      setUser(prev => ({
        ...prev,
        dailyTasks: prev.dailyTasks.map(t => t.id === id ? { ...t, isVerifying: false, validationStatus: 'failed' as const } : t)
      }));
      addNotification('error', `Falha na Validação: Ação não detectada no TikTok para "${task.title}".`);
    }
  };

  const updateOnboarding = (step: UserState['onboardingStep']) => {
    setUser(prev => ({ ...prev, onboardingStep: step }));
  };

  const handleAuth = (email: string, isNew: boolean) => {
    const savedData = localStorage.getItem(`shopmentor_user_${email}`);
    if (savedData && !isNew) {
      const parsedData = JSON.parse(savedData);
      setUser({ ...parsedData, onboardingStep: 'choice' });
    } else {
      setUser({
        hasPaid: false,
        isTikTokConnected: false,
        onboardingStep: 'quiz',
        quizAnswers: {},
        points: 0,
        level: 1,
        levelName: 'Iniciante',
        streak: 1,
        lastLoginDate: new Date().toISOString().split('T')[0],
        totalTasksCompleted: 0,
        badges: BADGES,
        challenges: INITIAL_CHALLENGES,
        dailyTasks: INITIAL_TASKS,
        notifications: [],
        savedPrompts: [],
        email: email
      });
    }
  };

  const handleTikTokSuccess = (token: string, handle: string) => {
    setUser(prev => ({
      ...prev,
      isTikTokConnected: true,
      tiktokAccessToken: token,
      tiktokHandle: handle,
      onboardingStep: 'dashboard'
    }));
    addNotification('strategic', `TikTok @${handle} conectado e monitorado.`);
  };

  const handleSkipToDashboard = () => {
    setUser(prev => ({ 
      ...prev, 
      onboardingStep: 'dashboard', 
      analysis: prev.analysis || DEFAULT_ANALYSIS 
    }));
  };

  const handleUpdatePrompts = (prompts: SavedPrompt[]) => {
    setUser(prev => ({ ...prev, savedPrompts: prompts }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-purple-500/30">
      {user.onboardingStep === 'landing' && <Landing onStart={() => updateOnboarding('auth')} />}
      {user.onboardingStep === 'auth' && <Auth onAuth={handleAuth} />}
      {user.onboardingStep === 'choice' && (
        <DashboardChoice 
          onRetake={() => updateOnboarding('quiz')} 
          onSkip={handleSkipToDashboard} 
        />
      )}
      {user.onboardingStep === 'quiz' && <Quiz onComplete={(ans) => setUser(p => ({ ...p, quizAnswers: ans, onboardingStep: 'upload' }))} />}
      {user.onboardingStep === 'upload' && (
        <ProfileUpload 
          onComplete={async (img) => {
            setLoading(true);
            const analysis = await analyzeProfileAndQuiz(user.quizAnswers, img);
            setUser(p => ({ ...p, profileImageUrl: img, analysis: analysis || DEFAULT_ANALYSIS, onboardingStep: 'checkout' }));
            setLoading(false);
          }} 
          loading={loading}
        />
      )}
      {user.onboardingStep === 'checkout' && (
        <Checkout 
          analysis={user.analysis || DEFAULT_ANALYSIS} 
          onSuccess={() => setUser(p => ({ ...p, hasPaid: true, onboardingStep: 'tiktok_connect' }))} 
        />
      )}
      {user.onboardingStep === 'tiktok_connect' && <TikTokConnect onSuccess={handleTikTokSuccess} />}
      
      {user.onboardingStep === 'dashboard' && user.hasPaid && user.isTikTokConnected && (
        <Dashboard user={user} onCompleteTask={completeTask} onUpdatePrompts={handleUpdatePrompts} />
      )}
      
      {user.onboardingStep === 'dashboard' && !user.hasPaid && (
        <Checkout analysis={user.analysis || DEFAULT_ANALYSIS} onSuccess={() => setUser(p => ({ ...p, hasPaid: true, onboardingStep: 'tiktok_connect' }))} />
      )}
      {user.onboardingStep === 'dashboard' && user.hasPaid && !user.isTikTokConnected && (
        <TikTokConnect onSuccess={handleTikTokSuccess} />
      )}
    </div>
  );
};

export default App;
