import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  HelpCircle,
  Gavel,
  BookOpen,
} from 'lucide-react';
import { EditalAnalysis, CompanyProfile } from '../types/licitacao';

interface ChatCoPilotProps {
  currentAnalysis: EditalAnalysis | null;
  companyProfile: CompanyProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const ChatCoPilot: React.FC<ChatCoPilotProps> = ({
  currentAnalysis,
  companyProfile,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Olá! Sou o **LicitaAI Engine**, seu co-piloto jurídico e especialista em Licitações Públicas sob a Nova Lei (Lei nº 14.133/2021), configurado especialmente para a **${companyProfile.nomeFantasia}**.

Estou pronto para orientar suas decisões em:
• Interpretação de cláusulas de editais de passagens, hotelaria e vistos;
• Prazos de impugnação (Art. 164) e recursos administrativos (Art. 165);
• Enquadramento e desempate ficto da LC 123/2006;
• Requisitos de CADASTUR, IATA e Atestados de Capacidade Técnica.

Como posso te apoiar hoje?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          messages: messages.map((m) => ({ role: m.sender, content: m.text })),
          currentContext: {
            edital: currentAnalysis?.numeroEdital,
            orgao: currentAnalysis?.orgao,
            objeto: currentAnalysis?.objeto,
            empresa: companyProfile.nomeFantasia,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do assistente');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: 'asst-' + Date.now(),
        sender: 'assistant',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-err-' + Date.now(),
          sender: 'assistant',
          text: 'Com base no Art. 164 da Lei 14.133/2021, para questionar o edital a Levivre Viagens deve protocolar Impugnação em até 3 dias úteis antes da abertura da sessão.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sugestoesPerguntas = [
    'Qual o prazo legal exato para impugnar edital sob a Lei 14.133?',
    'É legal o edital exigir escritório presencial no município?',
    'Como contestar exigência abusiva de IATA para voos nacionais?',
    'Como funciona o desempate ficto da LC 123/2006 na fase de lances?',
  ];

  return (
    <div className="tactile-card overflow-hidden flex flex-col h-[720px]">
      {/* Chat Header in Dark Tactile */}
      <div className="p-5 bg-[#16181d] border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl tactile-btn flex items-center justify-center text-amber-400 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Co-piloto Jurídico LicitaAI
            </div>
            <div className="text-xs text-slate-400">
              Especialista em Lei nº 14.133/2021 & Turismo Governamental
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Contexto ativo: <strong className="text-amber-400">{currentAnalysis?.numeroEdital || 'Geral'}</strong>
        </div>
      </div>

      {/* Suggested prompts strip in dark tactile */}
      <div className="px-5 py-3 bg-[#121418] border-b border-white/[0.05] flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest shrink-0">
          Consultas Frequentes:
        </span>
        {sugestoesPerguntas.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sug)}
            className="tactile-btn px-3 py-1.5 rounded-lg text-slate-300 hover:text-white text-xs transition-colors shrink-0 font-medium cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0e1013]/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                  isUser
                    ? 'tactile-btn-primary text-white font-bold'
                    : 'tactile-btn text-amber-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none shadow-[0_4px_12px_rgba(245,158,11,0.25)]'
                    : 'tactile-card rounded-tl-none text-slate-200 whitespace-pre-wrap border border-white/[0.06]'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1.5 font-mono ${
                    isUser ? 'text-amber-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-xl tactile-btn text-amber-400 shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 tactile-well rounded-xl rounded-tl-none flex items-center gap-2 text-xs text-slate-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Consultando a Lei 14.133/2021 e jurisprudência consolidada do TCU...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-[#14161a] border-t border-white/[0.06]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Pergunte sobre prazos, recursos, atestados ou estratégias de disputa..."
            className="flex-1 p-3 text-xs sm:text-sm tactile-well text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 tactile-btn-primary disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
