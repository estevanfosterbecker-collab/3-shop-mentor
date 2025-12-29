
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { validateTikTokProfileImage } from '../services/geminiService';

interface ProfileUploadProps {
  onComplete: (imageUrl: string) => void;
  loading: boolean;
}

export const ProfileUpload: React.FC<ProfileUploadProps> = ({ onComplete, loading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = async () => {
    if (!preview) return;
    
    setIsValidating(true);
    setError(null);
    
    try {
      const isValid = await validateTikTokProfileImage(preview);
      if (isValid) {
        onComplete(preview);
      } else {
        setError("A imagem enviada não corresponde a um print de um perfil do TikTok. Por favor, envie uma captura de tela válida da sua conta (mostrando bio e estatísticas).");
        setPreview(null);
      }
    } catch (err) {
      setError("Erro ao validar imagem. Tente novamente.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      {(loading || isValidating) ? (
        <div className="py-20 animate-in fade-in zoom-in duration-500">
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 border-4 border-purple-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <h2 className="text-3xl font-black mb-4">{isValidating ? "Validando imagem..." : "Analisando seu perfil e respostas…"}</h2>
          <p className="text-zinc-500 text-lg">{isValidating ? "Verificando autenticidade do print..." : "Montando seu plano estratégico personalizado…"}</p>
          <div className="mt-8 space-y-2 max-w-xs mx-auto">
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 animate-[progress_3s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-4">Agora envie um print do seu perfil do TikTok 📸</h2>
            <p className="text-zinc-400 text-lg">Isso nos ajuda a refinar sua análise estratégica e visual.</p>
          </div>

          <div className={`bg-zinc-900 border-2 rounded-[2.5rem] p-12 mb-6 transition-colors relative ${error ? 'border-red-500/50 bg-red-500/5' : 'border-dashed border-zinc-800 hover:border-purple-600/30'}`}>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Profile preview" className="max-w-[240px] mx-auto rounded-3xl shadow-2xl border border-zinc-700" />
                <button 
                  onClick={() => { setPreview(null); setError(null); }}
                  className="absolute -top-4 -right-4 bg-zinc-100 text-zinc-950 p-2 rounded-full hover:bg-white shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${error ? 'bg-red-500/10 text-red-500' : 'bg-purple-600/10 text-purple-500'}`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="text-xl font-bold mb-2">{error ? "Imagem Inválida" : "Toque para selecionar o print"}</p>
                  <p className="text-zinc-500 text-sm font-medium">Sua bio e estatísticas devem estar visíveis.</p>
                </div>
              </label>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
              <p className="text-red-400 text-sm font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <Button 
            disabled={!preview || isValidating} 
            onClick={handleProceed} 
            className="w-full text-lg py-5 rounded-2xl"
          >
            {isValidating ? 'Validando...' : 'Gerar Meu Plano Estratégico'}
          </Button>
          
          <p className="mt-8 text-zinc-600 text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Conexão Segura e Criptografada
          </p>
        </>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
