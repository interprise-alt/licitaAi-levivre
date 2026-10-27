import React from 'react';
import {
  Building2,
  Sparkles,
  Radar,
  FileSearch,
  FileText,
  Zap,
  ShieldCheck,
  PlusCircle,
  Sun,
  Moon,
  Sliders,
} from 'lucide-react';
import { CompanyProfile, LuminosityMode } from '../types/licitacao';

interface HeaderProps {
  activeTab: 'radar' | 'analisador' | 'documentos' | 'dispensas' | 'certidoes' | 'chat';
  setActiveTab: (tab: 'radar' | 'analisador' | 'documentos' | 'dispensas' | 'certidoes' | 'chat') => void;
  onOpenProfile: () => void;
  onNewAnalysis: () => void;
  companyProfile: CompanyProfile;
  luminosity: LuminosityMode;
  setLuminosity: (mode: LuminosityMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onNewAnalysis,
  companyProfile,
  luminosity,
  setLuminosity,
}) => {
  const navItems = [
    {
      id: 'radar' as const,
      label: 'Radar de Editais',
      badge: 'PNCP',
      icon: Radar,
      glowColor: 'text-amber-400',
      activeBorder: 'border-amber-500/40',
      dotColor: 'bg-amber-400',
    },
    {
      id: 'analisador' as const,
      label: 'Auditoria 14.133',
      badge: '14 Pontos',
      icon: FileSearch,
      glowColor: 'text-emerald-400',
      activeBorder: 'border-emerald-500/40',
      dotColor: 'bg-emerald-400',
    },
    {
      id: 'documentos' as const,
      label: 'Peças & Propostas',
      badge: 'Minutas',
      icon: FileText,
      glowColor: 'text-orange-400',
      activeBorder: 'border-orange-500/40',
      dotColor: 'bg-orange-400',
    },
    {
      id: 'dispensas' as const,
      label: 'Dispensas Art. 75',
      badge: 'Cotação',
      icon: Zap,
      glowColor: 'text-yellow-400',
      activeBorder: 'border-yellow-500/40',
      dotColor: 'bg-yellow-400',
    },
    {
      id: 'certidoes' as const,
      label: 'SICAF & Certidões',
      badge: 'Níveis 1-6',
      icon: ShieldCheck,
      glowColor: 'text-teal-400',
      activeBorder: 'border-teal-500/40',
      dotColor: 'bg-teal-400',
    },
    {
      id: 'chat' as const,
      label: 'Co-Piloto Jurídico',
      badge: 'IA',
      icon: Sparkles,
      glowColor: 'text-rose-400',
      activeBorder: 'border-rose-500/40',
      dotColor: 'bg-rose-400',
    },
  ];

  return (
    <header className="sticky top-0 z-50 app-header-bg backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div className="w-full max-w-[1540px] mx-auto px-3 sm:px-5 lg:px-6">
        {/* Linha Superior: Logo Oficial da Levivre em Destaque, Título & Ações Principais */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 py-3 sm:py-4 min-h-[120px] sm:min-h-[150px]">
          {/* Brand Wordmark com a Logo Levivre sem espaço excessivo na moldura */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            <button
              onClick={() => setActiveTab('radar')}
              className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl bg-black/25 flex items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.75)] hover:scale-105 active:scale-95 transition-all group overflow-hidden p-1 sm:p-1.5 shrink-0 cursor-pointer border border-white/[0.08]"
              title="LICITAÇÃO INTELIGENTE — Levivre Viagens (Ir para o Radar)"
            >
              <img
                src="/levivre-logo.png"
                alt="Levivre Viagens"
                className="w-full h-full object-contain rounded-xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="sr-only">Levivre Viagens</span>
            </button>

            <div className="flex flex-col text-left justify-center">
              <div>
                <span className="font-michael lowercase text-3xl sm:text-4xl lg:text-[50px] font-normal text-white tracking-[0.025em] whitespace-nowrap drop-shadow-md leading-none inline-block">
                  licitaçã<span className="-ml-[0.09em]">o</span> inteligente
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-400 whitespace-nowrap flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-slate-200 font-semibold hidden xs:inline">Nova Lei 14.133/2021</span>
                <span className="text-slate-600 hidden xs:inline">·</span>
                <span className="text-slate-300">Turismo & Passagens Corporativas</span>
              </div>

              <div className="mt-1.5 flex items-center">
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 rounded-lg shadow-sm inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Levivre Viagens
                </span>
              </div>
            </div>
          </div>

          {/* Barra de Ações Rápidas (Direita): Seletor de Luminosidade + Perfil + Nova Análise */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-end">
            {/* Seletor Tátil de Luminosidade (Mais Claro / Balanceado / Noturno) */}
            <div
              className="flex items-center p-1 rounded-xl bg-black/25 border border-white/10 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)] text-xs"
              title="Ajuste de Luminosidade da Interface: Mais Claro, Balanceado ou Noturno"
            >
              <button
                type="button"
                onClick={() => setLuminosity('mais_claro')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  luminosity === 'mais_claro'
                    ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modo Mais Claro: Ardósia luminosa, arejada e de alto contraste visual"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Mais Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setLuminosity('balanceado')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  luminosity === 'balanceado'
                    ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modo Balanceado: Grafite suave e elegante (Luminosidade moderada)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Balanceado</span>
              </button>

              <button
                type="button"
                onClick={() => setLuminosity('noturno')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  luminosity === 'noturno'
                    ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modo Noturno: Escuro profundo clássico"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Noturno</span>
              </button>
            </div>

            <button
              onClick={onOpenProfile}
              title={`Perfil Cadastral: ${companyProfile.razaoSocial}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white tactile-btn rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Perfil</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('analisador');
                onNewAnalysis();
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white tactile-btn-primary rounded-xl cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Nova Análise</span>
            </button>
          </div>
        </div>

        {/* Linha Dedicada de Navegação dos Módulos (Dock Tátil Neumórfico sem corte horizontal) */}
        <div className="pb-2.5 pt-1">
          <nav className="w-full app-dock-bg p-1 sm:p-1.5 rounded-2xl border border-white/[0.06] shadow-[inset_2px_2px_8px_rgba(0,0,0,0.5),inset_-1px_-1px_3px_rgba(255,255,255,0.03)]">
            <div className="flex items-center justify-start xl:justify-between gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none px-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-1 min-w-[130px] sm:min-w-[145px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                      isActive
                        ? 'tactile-tab-active font-semibold text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? item.glowColor : 'text-slate-500'}`} />
                    <span className="tracking-tight">{item.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono hidden md:inline-block ${
                        isActive
                          ? 'bg-white/10 text-slate-200'
                          : 'bg-black/40 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
