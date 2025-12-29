
import { Question, CaseStudy } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, text: "Qual é seu principal objetivo no TikTok Shop?", options: ["Viver exclusivamente disso", "Criar uma renda extra", "Escalar vendas rapidamente", "Ainda estou testando"] },
  { id: 2, text: "Quanto você fatura hoje por mês com TikTok ou vendas online?", options: ["Nada ainda", "Até R$1.000", "Entre R$1.000 e R$5.000", "Acima de R$5.000"] },
  { id: 3, text: "Qual sua maior dificuldade hoje?", options: ["Falta de views", "Falta de vendas", "Falta de consistência", "Não sei o que postar"] },
  { id: 4, text: "Com que frequência você posta?", options: ["Todos os dias", "3 a 5 vezes por semana", "Menos de 3 vezes", "Quase nunca"] },
  { id: 5, text: "Você segue algum método ou estratégia?", options: ["Sim, tenho um método claro", "Sigo dicas soltas", "Copio outros criadores", "Não sigo nada"] },
  { id: 6, text: "Você analisa métricas dos seus vídeos?", options: ["Sempre", "Às vezes", "Raramente", "Nunca"] },
  { id: 7, text: "Seus vídeos seguem algum padrão?", options: ["Sim, bem definido", "Mais ou menos", "Cada vídeo é diferente", "Não tenho padrão"] },
  { id: 8, text: "Qual erro você mais comete hoje?", options: ["Postar sem estratégia", "Desistir rápido", "Copiar errado", "Falta de constância"] },
  { id: 9, text: "Você entende o algoritmo do TikTok?", options: ["Muito bem", "Mais ou menos", "Pouco", "Nada"] },
  { id: 10, text: "Você usa storytelling nos vídeos?", options: ["Sempre", "Às vezes", "Raramente", "Nunca"] },
  { id: 11, text: "Seu foco hoje é mais:", options: ["Viralizar", "Converter em vendas", "Crescer perfil", "Testar formatos"] },
  { id: 12, text: "Você tem dificuldade em criar ideias?", options: ["Sim, sempre", "Às vezes", "Raramente", "Não"] },
  { id: 13, text: "Quanto tempo por dia você dedica ao TikTok?", options: ["Menos de 30 min", "30 a 60 min", "1 a 2 horas", "Mais de 2 horas"] },
  { id: 14, text: "Você acredita que seu perfil poderia faturar mais?", options: ["Com certeza", "Talvez", "Não sei", "Nunca pensei nisso"] },
  { id: 15, text: "Você já tentou vender no TikTok Shop?", options: ["Sim, já vendo", "Já tentei", "Nunca tentei", "Não entendo como funciona"] },
  { id: 16, text: "Você acompanha criadores grandes?", options: ["Sim e tento copiar", "Só acompanho", "Poucos", "Nenhum"] },
  { id: 17, text: "Seu maior medo hoje é:", options: ["Perder tempo", "Não vender", "Não crescer", "Desistir"] },
  { id: 18, text: "Você prefere:", options: ["Plano claro", "Liberdade criativa", "Testes constantes", "Segurança"] },
  { id: 19, text: "Quanto você estaria disposto a investir para crescer?", options: ["O mínimo possível", "Um valor acessível", "Um valor estratégico", "O que for necessário"] },
  { id: 20, text: "Você está realmente comprometido?", options: ["Sim, totalmente", "Sim, mas com dúvidas", "Talvez", "Ainda não"] },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Marcos Silva",
    revenue: "R$ 142.000,00",
    growth: "+450% em 30 dias",
    image: "https://picsum.photos/seed/marcos/200/200",
    quote: "O Shop Mentor mudou meu jogo. Saí de vídeos de 500 views para um faturamento de 6 dígitos em um mês."
  },
  {
    name: "Ana Luiza",
    revenue: "R$ 58.000,00",
    growth: "Viralizou em 1 semana",
    image: "https://picsum.photos/seed/ana/200/200",
    quote: "As análises de IA são assustadoramente precisas. Segui o plano e meu primeiro vídeo de review bateu 1M."
  }
];
