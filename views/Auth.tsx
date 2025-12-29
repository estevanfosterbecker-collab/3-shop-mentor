
import React, { useState } from 'react';
import { Button } from '../components/Button';

interface AuthProps {
  onAuth: (email: string, isNew: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onAuth(email, !isLogin);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="text-2xl font-black tracking-tighter text-white mb-2">
            SHOP<span className="text-purple-500">MENTOR</span>
          </div>
          <h2 className="text-xl font-bold">
            {isLogin ? 'Bem-vindo de volta 👋' : 'Comece sua jornada 🚀'}
          </h2>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Seu melhor e-mail
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-purple-600/50 transition-all text-sm"
                placeholder="nome@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Sua senha
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-purple-600/50 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full py-4 mt-4 rounded-2xl">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 hover:text-purple-400 text-xs font-bold transition-colors uppercase tracking-widest"
            >
              {isLogin ? 'Não tem conta? Cadastrar' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
