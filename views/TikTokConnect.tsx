
import React, { useState } from 'react';
import { Button } from '../components/Button';

interface TikTokConnectProps {
  onSuccess: (token: string, handle: string) => void;
}

export const TikTokConnect: React.FC<TikTokConnectProps> = ({ onSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTikTokLogin = () => {
    setIsConnecting(true);
    setError(null);

    // Mocking TikTok OAuth 2.0 Redirect
    // In a real environment, this would be:
    // window.location.href = `https://www.tiktok.com/v2/auth/authorize/?client_key=${CLIENT_KEY}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
    
    setTimeout(() => {
      // Simulating a successful response from TikTok Display API
      const mockToken = "act_123456789_official_oauth_token";
      const mockHandle = "criador_elite_pro";
      
      // Randomly simulate error for testing "blocking" requirement
      if (Math.random() < 0.1) {
        setIsConnecting(false);
        setError("A conexão com o TikTok foi recusada ou cancelada. Sem essa autorização, o aplicativo não pode funcionar.");
        return;
      }

      onSuccess(mockToken, mockHandle);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.8.2-.82.41-1.45 1.19-1.66 2.08-.24.97-.04 2.03.52 2.87.56.84 1.51 1.38 2.5 1.47 1.12.11 2.29-.27 3.09-1.07.72-.73 1.11-1.74 1.12-2.75V.02z"/>
        </svg>
      </div>

      <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Conectar TikTok Obrigatório</h1>
      
      <p className="text-zinc-400 text-lg mb-10 max-w-lg leading-relaxed">
        Para que o aplicativo acompanhe sua consistência, progresso e conclusão de tarefas, é necessário conectar sua conta do TikTok.
        <br/><br/>
        <span className="text-zinc-200 font-bold">Sem essa conexão, não é possível validar suas postagens nem liberar o acesso ao app.</span>
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Button 
          onClick={handleTikTokLogin} 
          disabled={isConnecting}
          className="w-full py-5 text-lg flex items-center justify-center gap-3"
        >
          {isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Conectando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.8.2-.82.41-1.45 1.19-1.66 2.08-.24.97-.04 2.03.52 2.87.56.84 1.51 1.38 2.5 1.47 1.12.11 2.29-.27 3.09-1.07.72-.73 1.11-1.74 1.12-2.75V.02z"/></svg>
              Conectar com TikTok
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
            <p className="text-red-400 text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Login Kit Oficial v2.0</span>
        </div>
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Conexão segura via TikTok Display API</p>
      </div>
    </div>
  );
};
