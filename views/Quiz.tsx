
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { Button } from '../components/Button';

export const Quiz: React.FC<{ onComplete: (answers: Record<number, string[]>) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [otherTexts, setOtherTexts] = useState<Record<number, string>>({});

  const QUESTIONS_PER_PAGE = 4;
  const totalPages = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE);
  const currentQuestions = QUESTIONS.slice(currentStep * QUESTIONS_PER_PAGE, (currentStep + 1) * QUESTIONS_PER_PAGE);
  const progress = ((currentStep + 1) / totalPages) * 100;

  const handleToggle = (questionId: number, option: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter(o => o !== option) };
      } else {
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleOtherTextChange = (questionId: number, text: string) => {
    setOtherTexts(prev => ({ ...prev, [questionId]: text }));
  };

  const isStepComplete = currentQuestions.every(q => {
    const selected = answers[q.id] || [];
    if (selected.length === 0) return false;
    if (selected.includes("Outro")) {
      return (otherTexts[q.id] || "").trim().length > 0;
    }
    return true;
  });

  const nextStep = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final processing: merge "Outro" with the text input if applicable
      const finalAnswers: Record<number, string[]> = {};
      Object.keys(answers).forEach(key => {
        const id = Number(key);
        let list = answers[id] || [];
        if (list.includes("Outro")) {
          list = list.map(item => item === "Outro" ? `Outro: ${otherTexts[id]}` : item);
        }
        finalAnswers[id] = list;
      });
      onComplete(finalAnswers);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen flex flex-col">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <span className="text-purple-500 font-black uppercase tracking-widest text-xs">PASSO {currentStep + 1} DE {totalPages}</span>
            <h3 className="text-xl font-bold">Perfil Estratégico</h3>
          </div>
          <span className="text-zinc-500 text-sm font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <header className="mb-10 text-center">
        <p className="text-zinc-400 font-medium">
          Você pode marcar mais de uma alternativa. <br/>
          <span className="text-white">Selecione todas que correspondem ao seu cenário.</span>
        </p>
      </header>

      <div className="space-y-12 flex-1">
        {currentQuestions.map((question) => {
          const selectedOptions = answers[question.id] || [];
          const showOtherInput = selectedOptions.includes("Outro");

          return (
            <div key={question.id} className="space-y-6">
              <h2 className="text-xl font-bold flex gap-4">
                <span className="text-purple-600">Q{question.id}.</span>
                {question.text}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Regular Options */}
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleToggle(question.id, option)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all group flex items-center gap-3 ${
                      selectedOptions.includes(option) 
                        ? 'bg-purple-600/10 border-purple-600 text-white shadow-lg shadow-purple-600/10' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
                      selectedOptions.includes(option) ? 'bg-purple-600 border-purple-600' : 'border-zinc-700'
                    }`}>
                      {selectedOptions.includes(option) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm font-semibold">{option}</span>
                  </button>
                ))}
                
                {/* Always include "Outro" if not already in options */}
                {!question.options.includes("Outro") && (
                   <button
                    onClick={() => handleToggle(question.id, "Outro")}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all group flex items-center gap-3 ${
                      selectedOptions.includes("Outro") 
                        ? 'bg-purple-600/10 border-purple-600 text-white shadow-lg shadow-purple-600/10' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
                      selectedOptions.includes("Outro") ? 'bg-purple-600 border-purple-600' : 'border-zinc-700'
                    }`}>
                      {selectedOptions.includes("Outro") && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm font-semibold">Outro</span>
                  </button>
                )}
              </div>

              {/* Text Input for "Other" */}
              {showOtherInput && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <textarea
                    value={otherTexts[question.id] || ""}
                    onChange={(e) => handleOtherTextChange(question.id, e.target.value)}
                    placeholder="Descreva seu KPI ou situação específica aqui..."
                    className="w-full bg-zinc-950 border border-purple-600/40 rounded-2xl p-4 text-zinc-200 focus:outline-none focus:border-purple-600 transition-all text-sm min-h-[100px]"
                  />
                  <p className="text-[10px] text-purple-400 mt-2 font-black uppercase tracking-widest">Informação essencial para o plano personalizado</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 pt-8 border-t border-zinc-900 flex justify-between items-center">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className={`text-zinc-500 font-bold flex items-center gap-2 hover:text-white transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>

        <Button 
          onClick={nextStep} 
          disabled={!isStepComplete}
          className="px-12 py-5"
        >
          {currentStep === totalPages - 1 ? 'Finalizar Perfil' : 'Próxima Etapa'}
        </Button>
      </div>
    </div>
  );
};
