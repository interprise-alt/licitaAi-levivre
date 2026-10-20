import React from 'react';
import { OpportunityTender } from '../types/licitacao';

interface TactileAnalyticsDashboardProps {
  tenders: OpportunityTender[];
  selectedPrioridade: 'todas' | 'P1' | 'P2';
  setSelectedPrioridade: (p: 'todas' | 'P1' | 'P2') => void;
  onFilterUrgent?: () => void;
}

export const TactileAnalyticsDashboard: React.FC<TactileAnalyticsDashboardProps> = ({
  tenders,
  selectedPrioridade,
  setSelectedPrioridade,
}) => {
  const totalValor = tenders.reduce((acc, t) => acc + t.valorEstimadoNum, 0);
  const p1Count = tenders.filter((t) => t.prioridade === 'P1').length;
  const p2Count = tenders.filter((t) => t.prioridade === 'P2').length;
  const urgentCount = tenders.filter((t) => t.prazoUrgente).length;

  return (
    <div className="space-y-4 mb-6">
      {/* ══════════════════════════════════════════════════════════════════════
          PAINEL DE CONTROLE TÁTIL NEUMÓRFICO (REPLICAÇÃO FIEL DO MODELO UI.JFIF)
          Acabamento matte escuro, chanfros 3D, relevo duplo e cores vibrantes
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="tactile-card p-4 sm:p-6 space-y-4">
        {/* Cabeçalho do Painel Tátil */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse"></span>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest">
                Painel Tátil Executivo · LicitaAI Engine
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#14161a] border border-white/[0.06] text-slate-300">
                Modelo 3D Tátil
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-1">
              Indicadores Estratégicos & Matriz de Oportunidades
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Pipeline Total:</span>
            <div className="px-3 py-1.5 rounded-xl bg-[#131518] border border-white/[0.05] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] font-mono font-bold text-amber-400 text-xs">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValor)}
            </div>
          </div>
        </div>

        {/* ─── GRID PRINCIPAL EM 3 NÍVEIS (LAYOUT DA IMAGEM UI.JFIF) ─── */}

        {/* LINHA 1: 4 MÓDULOS SUPERIORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* MÓDULO 1.1: GRÁFICO DE ONDA / SENSOR PNCP */}
          <div className="tactile-card p-4 flex flex-col justify-between min-h-[170px] relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>SCANNER PNCP</span>
              <span className="text-amber-400 font-mono">1.4s</span>
            </div>
            
            {/* Cavidade Inset com Curva de Onda */}
            <div className="tactile-well p-2.5 my-2 flex-1 flex flex-col justify-center">
              <svg viewBox="0 0 160 55" className="w-full h-11 overflow-visible">
                <defs>
                  <linearGradient id="curveGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7828" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ff7828" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Linhas de Grade Sutis */}
                <line x1="0" y1="15" x2="160" y2="15" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 3" />
                <line x1="0" y1="35" x2="160" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 3" />
                {/* Área preenchida */}
                <path
                  d="M 0 45 Q 25 40 45 48 T 85 20 T 110 38 T 135 12 T 160 30 L 160 55 L 0 55 Z"
                  fill="url(#curveGrad1)"
                />
                {/* Linha de Sinal Vibrante Laranja/Âmbar */}
                <path
                  d="M 0 45 Q 25 40 45 48 T 85 20 T 110 38 T 135 12 T 160 30"
                  fill="none"
                  stroke="#ff7828"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Segundo sinal em amarelo */}
                <path
                  d="M 0 50 Q 30 52 60 45 T 100 48 T 140 28 T 160 36"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Capturas Hoje</span>
              <span className="font-mono font-bold text-white">8 certames</span>
            </div>
          </div>

          {/* MÓDULO 1.2: DIAL CIRCULAR DONUT 62% + 254 / 39% (EXATAMENTE COMO NO UI.JFIF) */}
          <div className="tactile-card p-4 flex items-center justify-between min-h-[170px]">
            {/* Anel Donut 3D com Gradiente Esmeralda -> Âmbar -> Laranja */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              {/* Aro Circular com Gradiente Multi-stop */}
              <div
                className="w-24 h-24 rounded-full tactile-dial-ring p-3 flex items-center justify-center"
                style={{
                  background: 'conic-gradient(from 190deg, #22c55e 0deg, #84cc16 65deg, #eab308 130deg, #f97316 210deg, #ef4444 310deg, #22c55e 360deg)',
                }}
              >
                {/* Botão Central Relevado (Knob) */}
                <div className="w-15 h-15 rounded-full tactile-dial-knob flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-white tracking-tight leading-none">
                    62%
                  </span>
                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-0.5">
                    FIT
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas Laterais Direitas: 254 e 39% */}
            <div className="flex flex-col justify-center text-right space-y-2.5 pl-2">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  EDITAIS PNCP
                </span>
                <span className="text-2xl font-extrabold font-mono text-white tracking-tight leading-none">
                  254
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  TRIAGEM DETERMINÍSTICA
                </span>
                <span className="text-xl font-bold font-mono text-amber-400 leading-none">
                  39%
                </span>
              </div>
            </div>
          </div>

          {/* MÓDULO 1.3: ONDA DOURADA COM PREENCHIMENTO DE HORIZONTE */}
          <div className="tactile-card p-4 flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>FLUXO DE PRAZOS LEGAIS</span>
              <span className="text-emerald-400">TEMPESTIVO</span>
            </div>

            {/* Cavidade Inset com Onda Dourada */}
            <div className="tactile-well p-2 my-2 flex-1 flex flex-col justify-center">
              <svg viewBox="0 0 160 55" className="w-full h-11 overflow-visible">
                <defs>
                  <linearGradient id="goldHorizon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 35 C 30 35, 50 15, 80 15 C 110 15, 130 38, 160 38 L 160 55 L 0 55 Z"
                  fill="url(#goldHorizon)"
                />
                <path
                  d="M 0 35 C 30 35, 50 15, 80 15 C 110 15, 130 38, 160 38"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <line x1="0" y1="46" x2="160" y2="46" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Impugnação / Esclarecimento</span>
              <span className="font-mono font-bold text-amber-300">D-3 dias úteis</span>
            </div>
          </div>

          {/* MÓDULO 1.4: BARRAS VERTICAIS ESMERALDA / LIME */}
          <div className="tactile-card p-4 flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>PORTAIS GOV</span>
              <span className="text-emerald-400 font-mono">100% SICAF</span>
            </div>

            {/* Cavidade Inset com Colunas de Barras Verdes */}
            <div className="tactile-well p-3 my-2 flex-1 flex items-end justify-around gap-2">
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '45%' }} title="Compras.gov: 45%" />
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '90%' }} title="PNCP Federal: 90%" />
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '65%' }} title="BEC-SP: 65%" />
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '35%' }} title="Licitações-e: 35%" />
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '80%' }} title="Compras-MG: 80%" />
              <div className="w-3 rounded-full bar-gradient-emerald" style={{ height: '55%' }} title="Sistemas Municipais: 55%" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Portais Conectados</span>
              <span className="font-mono font-bold text-emerald-400">8 plataformas</span>
            </div>
          </div>

        </div>

        {/* ─── LINHA 2: ELEMENTO FOCAL CENTRAL (INSPIRADO NO BANNER DO UI.JFIF) ─── */}
        <div className="tactile-card-raised p-5 lg:p-6 relative overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Lado Esquerdo: Métricas Destaque 24.7k e Informações */}
            <div className="lg:col-span-3 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  COTAÇÕES TURISMO B2G
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  24<span className="text-amber-400 text-xl font-normal">.7k</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Bilhetes aéreos, diárias de hotéis e traslados monitorados no sistema
                </div>
              </div>

              {/* Botões Rápidos de Prioridade Tátil */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedPrioridade(selectedPrioridade === 'P1' ? 'todas' : 'P1')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    selectedPrioridade === 'P1'
                      ? 'tactile-btn-primary'
                      : 'tactile-btn hover:border-amber-500/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"></span>
                    <span>Prioridade P1 · Ouro</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold">{p1Count}</span>
                </button>

                <button
                  onClick={() => setSelectedPrioridade(selectedPrioridade === 'P2' ? 'todas' : 'P2')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    selectedPrioridade === 'P2'
                      ? 'tactile-btn-emerald'
                      : 'tactile-btn hover:border-emerald-500/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
                    <span>Prioridade P2 · Prata</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold">{p2Count}</span>
                </button>
              </div>
            </div>

            {/* Centro: O Visual Centerpiece de Turismo & Negócios Públicos (Fiel à composição da imagem) */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="w-full h-72 sm:h-80 md:h-[340px] rounded-2xl overflow-hidden tactile-well relative border border-white/[0.12] shadow-[0_15px_35px_rgba(0,0,0,0.85)] group">
                <img
                  src="/travel_centerpiece.png"
                  alt="Centro de Excelência em Turismo & Licitações Públicas Levivre Viagens"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Degradê Escuro Suave nas Bordas para Integração Perfeita */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15181c]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#15181c]/40 via-transparent to-[#15181c]/40 pointer-events-none" />

                {/* Badge Flutuante Tátil no Centro */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between bg-[#121417]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.1] shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,1)] animate-ping" />
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      Levivre Viagens & Turismo · Agência Oficial
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-semibold">
                    CADASTUR 19.012.345
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Barras Horizontais Coloridas (Verde, Laranja, Amarelo) e 227 Propostas */}
            <div className="lg:col-span-3 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  PROPOSTAS & PEÇAS GERADAS
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  227
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Peças jurídicas e cotações blindadas prontas para submissão
                </div>
              </div>

              {/* Barras de Status Coloridas em Formato Cilíndrico Horizontal (como no UI.jfif) */}
              <div className="space-y-2 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                    <span>Aderência Legal (Lei 14.133)</span>
                    <span className="text-emerald-400 font-mono">98%</span>
                  </div>
                  <div className="h-2 w-full tactile-well-sm overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                    <span>Regularidade Fiscal SICAF</span>
                    <span className="text-amber-400 font-mono">100%</span>
                  </div>
                  <div className="h-2 w-full tactile-well-sm overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                    <span>Competitividade Taxa DU</span>
                    <span className="text-orange-400 font-mono">87%</span>
                  </div>
                  <div className="h-2 w-full tactile-well-sm overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" style={{ width: '87%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── LINHA 3: 4 MÓDULOS INFERIORES (COM DIAL 90, BARRAS LARANJA E ONDAS MULTI-CORES) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* MÓDULO 3.1: DIAL 90 COM INDICADORES (IGUAL AO CANTO INFERIOR ESQUERDO DO UI.JFIF) */}
          <div className="lg:col-span-3 tactile-card p-4 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>SCORE DE ADERÊNCIA</span>
              <span className="text-amber-400 font-mono">P1 OURO</span>
            </div>

            <div className="flex items-center gap-3 my-2">
              {/* Dial 3D Laranja com Botão Central 90 */}
              <div
                className="w-18 h-18 rounded-full tactile-dial-ring p-2 shrink-0 flex items-center justify-center"
                style={{
                  background: 'conic-gradient(from 220deg, #ff4500 0deg, #ff7828 120deg, #fbbf24 240deg, #ff4500 360deg)',
                }}
              >
                <div className="w-12 h-12 rounded-full tactile-dial-knob flex items-center justify-center">
                  <span className="text-lg font-extrabold text-white font-mono">
                    90
                  </span>
                </div>
              </div>

              {/* Métricas Compactas */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono font-bold text-white">212</span>
                  <span className="text-[10px] text-slate-400">Atestados</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono font-bold text-amber-400">3d</span>
                  <span className="text-[10px] text-slate-400">Prazo Impugnação</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono font-bold text-emerald-400">2%</span>
                  <span className="text-[10px] text-slate-400">Desconto Ficto</span>
                </div>
              </div>
            </div>

            {/* Número Grande no Rodapé: 5 173 */}
            <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] text-slate-400">Passagens Cotadas</span>
              <span className="text-xl font-extrabold font-mono text-white tracking-tight">
                5 173
              </span>
            </div>
          </div>

          {/* MÓDULO 3.2: BARRAS VERTICAIS GRADIENTE LARANJA / VERMELHO / AMARELO */}
          <div className="lg:col-span-3 tactile-card p-4 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>MODALIDADES LEGAIS</span>
              <span className="text-amber-400">VOLUMES</span>
            </div>

            {/* Cavidade Inset com 4 Barras Verticais Cilíndricas Laranja */}
            <div className="tactile-well p-3 my-2 flex-1 flex items-end justify-around gap-2.5">
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 rounded-full bar-gradient-orange" style={{ height: '85px' }} title="Pregão Eletrônico: R$ 3.8M" />
                <span className="text-[9px] font-bold text-slate-400 font-mono">PE</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 rounded-full bar-gradient-orange" style={{ height: '48px' }} title="Dispensa Art. 75: R$ 140k" />
                <span className="text-[9px] font-bold text-slate-400 font-mono">DISP</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 rounded-full bar-gradient-orange" style={{ height: '72px' }} title="Concorrência: R$ 880k" />
                <span className="text-[9px] font-bold text-slate-400 font-mono">CONC</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 rounded-full bar-gradient-orange" style={{ height: '32px' }} title="Inexigibilidade Art. 74" />
                <span className="text-[9px] font-bold text-slate-400 font-mono">INEX</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Maior Volume</span>
              <span className="font-mono font-bold text-amber-400">Pregões (79%)</span>
            </div>
          </div>

          {/* MÓDULO 3.3: ONDAS MULTI-LINHAS NEON (CORAL, VERDE E AMARELO) */}
          <div className="lg:col-span-3 tactile-card p-4 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>EVOLUÇÃO TEMPORAL</span>
              <span className="text-emerald-400 font-mono">AO VIVO</span>
            </div>

            {/* Cavidade Inset com 3 Ondas Neon Curvadas (Coral, Verde e Amarelo) */}
            <div className="tactile-well p-2.5 my-2 flex-1 flex flex-col justify-center">
              <svg viewBox="0 0 160 55" className="w-full h-14 overflow-visible">
                {/* Linhas de Grade Verticais e Horizontais */}
                <line x1="0" y1="18" x2="160" y2="18" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                <line x1="0" y1="36" x2="160" y2="36" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />

                {/* Onda 1: Coral Neon */}
                <path
                  d="M 0 38 Q 30 50 60 25 T 110 35 T 160 15"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Onda 2: Esmeralda Neon */}
                <path
                  d="M 0 44 Q 40 18 80 42 T 130 18 T 160 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Onda 3: Âmbar Ouro */}
                <path
                  d="M 0 25 Q 35 12 75 30 T 120 48 T 160 38"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Métricas Cruzadas</span>
              </span>
              <span className="font-mono font-bold text-white">3 canais</span>
            </div>
          </div>

          {/* MÓDULO 3.4: MOSTRADORES DUPLOS CIRCULARES (SEMICÍRCULOS DIAL 76% E 94%) */}
          <div className="lg:col-span-3 tactile-card p-4 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>AUDITORIA JURÍDICA</span>
              <span className="text-emerald-400 font-mono">CONFORME</span>
            </div>

            {/* Dois Mini-Dials Semicirculares em Cavidade Inset */}
            <div className="tactile-well p-3 my-2 flex-1 flex items-center justify-around">
              {/* Dial 1: Técnico (76%) */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray="138"
                      strokeDashoffset="33"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-white">76%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Técnica</span>
              </div>

              {/* Dial 2: Jurídico (94%) */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeDasharray="138"
                      strokeDashoffset="8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-amber-300">94%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Jurídica</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Risco Global</span>
              <span className="font-mono font-bold text-emerald-400">BAIXO RISCO</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
