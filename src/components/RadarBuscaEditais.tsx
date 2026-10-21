import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Zap,
  ExternalLink,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  FileText,
  TrendingUp,
  Percent,
  AlertTriangle,
  Download,
  X,
  Info,
  Check,
  Copy,
  BarChart3,
  PieChart,
  ChevronDown,
  Plane,
  Hotel,
  FileCheck,
  Compass,
  GraduationCap,
  Ship,
  Scale,
  Award,
  Kanban,
  List,
  Target,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { OpportunityTender, NichoTurismo, ModalidadeLicitacao, FinancialSimulation, EtapaPipeline } from '../types/licitacao';
import { OPPORTUNITY_TENDERS } from '../data/radarEditaisData';
import { TactileAnalyticsDashboard } from './TactileAnalyticsDashboard';

interface RadarBuscaEditaisProps {
  onSelectTenderForProposal: (tender: OpportunityTender) => void;
  onSelectTenderForAudit: (tender: OpportunityTender) => void;
  onSelectTenderForDispensa: (tender: OpportunityTender) => void;
}

export const RadarBuscaEditais: React.FC<RadarBuscaEditaisProps> = ({
  onSelectTenderForProposal,
  onSelectTenderForAudit,
  onSelectTenderForDispensa,
}) => {
  // Lista com estado mutável para permitir mover no Kanban
  const [tendersList, setTendersList] = useState<OpportunityTender[]>(OPPORTUNITY_TENDERS);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicho, setSelectedNicho] = useState<NichoTurismo>('todos');
  const [selectedModalidade, setSelectedModalidade] = useState<ModalidadeLicitacao>('todas');
  const [selectedPrioridade, setSelectedPrioridade] = useState<'todas' | 'P1' | 'P2'>('todas');
  const [selectedFaixaValor, setSelectedFaixaValor] = useState<string>('todas');
  const [selectedUf, setSelectedUf] = useState<string>('todas');
  const [onlyUrgente, setOnlyUrgente] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'aderencia' | 'valor_desc' | 'valor_asc' | 'urgencia'>('aderencia');
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Estado para Visualização do Edital Oficial com Abas (Extrato, 14 Pontos, Prazos)
  const [selectedTenderForView, setSelectedTenderForView] = useState<OpportunityTender | null>(null);
  const [editalViewTab, setEditalViewTab] = useState<'extrato' | '14pontos' | 'prazos'>('extrato');

  // Estado para Calculadora de Lucratividade / Viabilidade Financeira
  const [selectedTenderForFinance, setSelectedTenderForFinance] = useState<OpportunityTender | null>(null);
  const [taxaDUPercentual, setTaxaDUPercentual] = useState<number>(4.5);
  const [aliquotaImposto, setAliquotaImposto] = useState<number>(7.0);
  const [custoObtPorBilhete, setCustoObtPorBilhete] = useState<number>(6.5);
  const [diasRecebimentoOrgao, setDiasRecebimentoOrgao] = useState<number>(30);
  const [copiedEdital, setCopiedEdital] = useState(false);

  // Mover certame entre fases do Pipeline Kanban
  const handleMovePipeline = (tenderId: string, novaEtapa: EtapaPipeline) => {
    setTendersList((prev) =>
      prev.map((t) => (t.id === tenderId ? { ...t, etapaPipeline: novaEtapa } : t))
    );
  };

  // Filtragem inteligente e indexação
  const filteredTenders = useMemo(() => {
    return tendersList.filter((tender) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          tender.numeroEdital.toLowerCase().includes(query) ||
          tender.orgao.toLowerCase().includes(query) ||
          tender.objeto.toLowerCase().includes(query) ||
          tender.cidade.toLowerCase().includes(query) ||
          tender.estadoUf.toLowerCase().includes(query) ||
          (tender.uasg && tender.uasg.includes(query)) ||
          tender.portal.toLowerCase().includes(query);

        if (!matchesQuery) return false;
      }

      if (selectedNicho !== 'todos' && tender.nicho !== selectedNicho) return false;
      if (selectedModalidade !== 'todas' && tender.modalidadeKey !== selectedModalidade) return false;
      if (selectedPrioridade !== 'todas' && tender.prioridade !== selectedPrioridade) return false;
      if (selectedUf !== 'todas' && tender.estadoUf !== selectedUf) return false;
      if (onlyUrgente && !tender.prazoUrgente) return false;

      if (selectedFaixaValor === 'ate_50k' && tender.valorEstimadoNum > 50000) return false;
      if (selectedFaixaValor === '50k_250k' && (tender.valorEstimadoNum <= 50000 || tender.valorEstimadoNum > 250000)) return false;
      if (selectedFaixaValor === '250k_1m' && (tender.valorEstimadoNum <= 250000 || tender.valorEstimadoNum > 1000000)) return false;
      if (selectedFaixaValor === 'mais_1m' && tender.valorEstimadoNum <= 1000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'aderencia') return b.scoreAderenciaLevivre - a.scoreAderenciaLevivre;
      if (sortBy === 'valor_desc') return b.valorEstimadoNum - a.valorEstimadoNum;
      if (sortBy === 'valor_asc') return a.valorEstimadoNum - b.valorEstimadoNum;
      if (sortBy === 'urgencia') return (b.prazoUrgente ? 1 : 0) - (a.prazoUrgente ? 1 : 0);
      return 0;
    });
  }, [tendersList, searchTerm, selectedNicho, selectedModalidade, selectedPrioridade, selectedFaixaValor, selectedUf, onlyUrgente, sortBy]);

  // Estatísticas e Métricas para Gráficos Visuais
  const analyticsData = useMemo(() => {
    const totalVal = tendersList.reduce((acc, curr) => acc + curr.valorEstimadoNum, 0);

    const nichosDistrib = [
      { id: 'passagens', label: 'Passagens Aéreas', icon: Plane, valor: 0, count: 0, pastelBg: 'bg-[#e0f2fe]', pastelText: 'text-sky-900', barColor: 'bg-sky-300' },
      { id: 'hospedagem', label: 'Hospedagem & Hotéis', icon: Hotel, valor: 0, count: 0, pastelBg: 'bg-[#dcfce7]', pastelText: 'text-emerald-900', barColor: 'bg-emerald-300' },
      { id: 'vistos_passaportes', label: 'Passaportes & Vistos', icon: FileCheck, valor: 0, count: 0, pastelBg: 'bg-[#fef3c7]', pastelText: 'text-amber-900', barColor: 'bg-amber-300' },
      { id: 'intercambio', label: 'Intercâmbio & Missões', icon: GraduationCap, valor: 0, count: 0, pastelBg: 'bg-[#f3e8ff]', pastelText: 'text-purple-900', barColor: 'bg-purple-300' },
      { id: 'cruzeiros_eventos', label: 'Cruzeiros & Eventos', icon: Ship, valor: 0, count: 0, pastelBg: 'bg-[#ffe4e6]', pastelText: 'text-rose-900', barColor: 'bg-rose-300' },
    ];

    tendersList.forEach((t) => {
      const found = nichosDistrib.find((n) => n.id === t.nicho);
      if (found) {
        found.valor += t.valorEstimadoNum;
        found.count += 1;
      }
    });

    const portaisDistrib = [
      { portal: 'Compras.gov.br', count: 0, tone: 'bg-sky-100 text-sky-800' },
      { portal: 'PNCP', count: 0, tone: 'bg-emerald-100 text-emerald-800' },
      { portal: 'Licitações-e (BB)', count: 0, tone: 'bg-amber-100 text-amber-800' },
      { portal: 'BLL Compras', count: 0, tone: 'bg-purple-100 text-purple-800' },
    ];

    tendersList.forEach((t) => {
      const p = portaisDistrib.find((item) => item.portal === t.portal);
      if (p) p.count += 1;
    });

    const highMatchCount = tendersList.filter((t) => t.scoreAderenciaLevivre >= 90).length;
    const p1Count = tendersList.filter((t) => t.prioridade === 'P1').length;
    const urgentCount = tendersList.filter((t) => t.prazoUrgente).length;

    return { totalVal, nichosDistrib, portaisDistrib, highMatchCount, p1Count, urgentCount };
  }, [tendersList]);

  // Cálculo da Simulação Financeira
  const simulacaoFinanceira: FinancialSimulation | null = useMemo(() => {
    if (!selectedTenderForFinance) return null;

    const valorContrato = selectedTenderForFinance.valorEstimadoNum;
    const receitaBrutaAgencia = valorContrato * (taxaDUPercentual / 100);
    const totalImpostos = receitaBrutaAgencia * (aliquotaImposto / 100);

    const bilhetesEstimados = Math.max(10, Math.round(valorContrato / 1500));
    const custoEmissaoTotal = bilhetesEstimados * custoObtPorBilhete;

    const taxaCustoCapitalMes = 0.012;
    const custoCapitalGiro = (valorContrato * 0.15) * (taxaCustoCapitalMes * (diasRecebimentoOrgao / 30));

    const lucroLiquido = receitaBrutaAgencia - totalImpostos - custoEmissaoTotal - custoCapitalGiro;
    const margemLiquida = (lucroLiquido / receitaBrutaAgencia) * 100;

    let status: 'alta' | 'moderada' | 'risco' = 'alta';
    let parecer = 'Operação altamente lucrativa com margem líquida robusta para o Simples Nacional.';

    if (margemLiquida < 35 || lucroLiquido < 0) {
      status = 'risco';
      parecer = 'Alerta de margem reduzida. Considere elevar a Taxa DU ofertada no lance inicial.';
    } else if (margemLiquida < 55) {
      status = 'moderada';
      parecer = 'Viabilidade equilibrada. Monitore o prazo de liquidação do órgão contratante.';
    }

    return {
      valorTotalContrato: valorContrato,
      taxaAgenciamentoPercentual: taxaDUPercentual,
      receitaBrutaAgencia,
      aliquotaImpostosPercentual: aliquotaImposto,
      totalImpostos,
      custoEmissaoGdsObt: custoEmissaoTotal,
      prazoPagamentoDias: diasRecebimentoOrgao,
      custoCapitalGiro,
      lucroLiquidoEstimado: lucroLiquido,
      margemLiquidaPercentual: margemLiquida,
      statusViabilidade: status,
      parecerViabilidade: parecer,
    };
  }, [selectedTenderForFinance, taxaDUPercentual, aliquotaImposto, custoObtPorBilhete, diasRecebimentoOrgao]);

  const handleCopyEdital = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiedEdital(true);
    setTimeout(() => setCopiedEdital(false), 2000);
  };

  const handleDownloadEditalText = (tender: OpportunityTender) => {
    const blob = new Blob([tender.textoCompletoEdital], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Edital_${tender.numeroEdital.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const kanbanColumns: { id: EtapaPipeline; label: string; countBadge: string; tone: string; headerBg: string }[] = [
    { id: 'triagem', label: '1. Triagem (P1/P2)', countBadge: 'bg-sky-500/20 text-sky-300 border border-sky-500/30', tone: 'border-white/[0.08]', headerBg: 'bg-[#222834]' },
    { id: 'auditoria', label: '2. Auditoria & Riscos', countBadge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', tone: 'border-white/[0.08]', headerBg: 'bg-[#222834]' },
    { id: 'minuta_proposta', label: '3. Minutas & Proposta', countBadge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30', tone: 'border-white/[0.08]', headerBg: 'bg-[#222834]' },
    { id: 'sessao_disputa', label: '4. Sessão / Disputa', countBadge: 'bg-rose-500/20 text-rose-300 border border-rose-500/30', tone: 'border-white/[0.08]', headerBg: 'bg-[#222834]' },
    { id: 'homologado', label: '5. Homologado / Ganho', countBadge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', tone: 'border-white/[0.08]', headerBg: 'bg-[#222834]' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* SESSÃO 01: PAINEL EXECUTIVO TÁTIL & GRÁFICOS DO MODELO UI.JFIF */}
      <TactileAnalyticsDashboard
        tenders={tendersList}
        selectedPrioridade={selectedPrioridade}
        setSelectedPrioridade={setSelectedPrioridade}
      />

      {/* SESSÃO 02: FILTROS INTELIGENTES & SEGMENTAÇÃO (ESTILO TÁTIL NEUMÓRFICO ESCURO) */}
      <section className="tactile-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 02 · Filtros Inteligentes & Segmentação
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5 tracking-tight">
              Filtro por Prioridade (P1/P2), Nicho e Modalidades Oficiais
            </h2>
          </div>

          {/* Toggle Modo Lista vs Modo Pipeline Kanban em Cavidade Inset */}
          <div className="inline-flex rounded-xl p-1 bg-[#181d25] border border-white/[0.05] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'tactile-tab-active font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista Analítica</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'tactile-tab-active font-bold text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-amber-400" />
              <span>Pipeline Kanban</span>
            </button>
          </div>
        </div>

        {/* Campo de Busca Global em Cavidade Inset Tátil */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por objeto, órgão, número do edital, UASG, cidade ou portal (ex: 'passagens Brasília', 'dispensa intercâmbio', 'hotel')..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm tactile-well text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/40 transition-colors"
          />
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Segmentos de Prioridade e Nichos */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Classificação por Prioridade de Fit:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setSelectedPrioridade('todas')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPrioridade === 'todas'
                    ? 'tactile-tab-active'
                    : 'tactile-btn text-slate-300'
                }`}
              >
                Todas as Oportunidades ({tendersList.length})
              </button>
              <button
                onClick={() => setSelectedPrioridade('P1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedPrioridade === 'P1'
                    ? 'tactile-btn-primary'
                    : 'tactile-btn text-amber-300 hover:text-amber-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>P1 · Alta Prioridade / Ouro ({tendersList.filter(t => t.prioridade === 'P1').length})</span>
              </button>
              <button
                onClick={() => setSelectedPrioridade('P2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedPrioridade === 'P2'
                    ? 'tactile-btn-emerald'
                    : 'tactile-btn text-emerald-300 hover:text-emerald-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>P2 · Média Prioridade / Prata ({tendersList.filter(t => t.prioridade === 'P2').length})</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Nicho de Atuação Levivre Viagens:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos os Nichos', icon: Compass },
                { id: 'passagens', label: 'Passagens Aéreas', icon: Plane },
                { id: 'hospedagem', label: 'Hospedagem & Hotéis', icon: Hotel },
                { id: 'vistos_passaportes', label: 'Passaportes & Vistos', icon: FileCheck },
                { id: 'intercambio', label: 'Intercâmbio & Missões', icon: GraduationCap },
                { id: 'cruzeiros_eventos', label: 'Cruzeiros & Eventos', icon: Ship },
              ].map((nicho) => {
                const Icon = nicho.icon;
                const isSelected = selectedNicho === nicho.id;
                return (
                  <button
                    key={nicho.id}
                    onClick={() => setSelectedNicho(nicho.id as NichoTurismo)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'tactile-tab-active font-bold'
                        : 'tactile-btn text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{nicho.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Linha de Filtros de Dropdown Táteis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Modalidade Legal:</label>
            <select
              value={selectedModalidade}
              onChange={(e) => setSelectedModalidade(e.target.value as ModalidadeLicitacao)}
              className="w-full p-2.5 bg-[#1b2029] border border-white/[0.06] rounded-xl text-slate-200 focus:outline-hidden focus:border-amber-500/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)]"
            >
              <option value="todas">Todas as Modalidades</option>
              <option value="dispensa_eletronica">Dispensas Eletrônicas (Art. 75)</option>
              <option value="pregao_eletronico">Pregões Eletrônicos</option>
              <option value="concorrencia">Concorrências</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Faixa de Valor:</label>
            <select
              value={selectedFaixaValor}
              onChange={(e) => setSelectedFaixaValor(e.target.value)}
              className="w-full p-2.5 bg-[#1b2029] border border-white/[0.06] rounded-xl text-slate-200 focus:outline-hidden focus:border-amber-500/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)]"
            >
              <option value="todas">Qualquer Valor</option>
              <option value="ate_50k">Até R$ 50.000 (Rápida)</option>
              <option value="50k_250k">R$ 50.000 a R$ 250.000</option>
              <option value="250k_1m">R$ 250.000 a R$ 1.000.000</option>
              <option value="mais_1m">Acima de R$ 1.000.000</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Estado (UF):</label>
            <select
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
              className="w-full p-2.5 bg-[#1b2029] border border-white/[0.06] rounded-xl text-slate-200 focus:outline-hidden focus:border-amber-500/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)]"
            >
              <option value="todas">Todo o Brasil</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="BA">Bahia (BA)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 tactile-well rounded-xl hover:border-amber-500/30 transition-colors">
              <input
                type="checkbox"
                checked={onlyUrgente}
                onChange={(e) => setOnlyUrgente(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 border-white/[0.1] bg-[#1a1d22] focus:ring-amber-500"
              />
              <span className="font-semibold text-amber-300 text-xs">Urgentes (&lt; 48h de disputa)</span>
            </label>
          </div>
        </div>
      </section>

      {/* SESSÃO 03: VISUALIZAÇÃO KANBAN OU LISTA ANALÍTICA */}
      {viewMode === 'kanban' ? (
        /* MODO KANBAN / PIPELINE DE OPORTUNIDADES (TÁTIL ESCURO) */
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Sessão 03 · Pipeline de Gestão de Editais (Kanban B2G)
              </span>
              <div className="text-xs text-slate-400">
                Acompanhe e movimente certames entre as 5 etapas da contratação pública
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
            {kanbanColumns.map((col) => {
              const colTenders = filteredTenders.filter((t) => t.etapaPipeline === col.id);

              return (
                <div key={col.id} className="tactile-well p-3 flex flex-col min-h-[490px]">
                  {/* Cabeçalho da Coluna Tátil */}
                  <div className={`p-2.5 rounded-xl border ${col.tone} ${col.headerBg} flex items-center justify-between mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]`}>
                    <h3 className="font-bold text-xs text-slate-200 truncate">{col.label}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${col.countBadge}`}>
                      {colTenders.length}
                    </span>
                  </div>

                  {/* Cartões Táteis na Coluna */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colTenders.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs italic">
                        Nenhum edital nesta fase
                      </div>
                    ) : (
                      colTenders.map((tender) => (
                        <div
                          key={tender.id}
                          className="tactile-card tactile-card-hover p-3.5 space-y-2.5 text-xs border border-white/[0.06]"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              tender.prioridade === 'P1'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {tender.prioridade === 'P1' ? 'P1 · Ouro' : 'P2 · Prata'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">{tender.portal}</span>
                          </div>

                          <div>
                            <div className="font-bold text-white leading-snug line-clamp-1">
                              {tender.numeroEdital}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tender.orgao}</div>
                          </div>

                          <div className="font-mono font-bold text-emerald-400 text-xs">
                            {tender.valorEstimadoFormatado}
                          </div>

                          <div className="text-[10px] text-amber-300/90 tactile-well-sm p-1.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{tender.prazoRestante}</span>
                          </div>

                          {/* Botões de Ação Rápida no Kanban */}
                          <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
                            <button
                              onClick={() => setSelectedTenderForView(tender)}
                              className="text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Ver Detalhes
                            </button>

                            {/* Dropdown de Mudança de Fase */}
                            <select
                              value={tender.etapaPipeline}
                              onChange={(e) => handleMovePipeline(tender.id, e.target.value as EtapaPipeline)}
                              className="text-[10px] bg-[#1b2029] border border-white/[0.08] rounded p-1 text-slate-300 focus:outline-hidden"
                            >
                              <option value="triagem">➔ Triagem</option>
                              <option value="auditoria">➔ Auditoria</option>
                              <option value="minuta_proposta">➔ Minutas</option>
                              <option value="sessao_disputa">➔ Sessão</option>
                              <option value="homologado">➔ Ganho</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* MODO LISTA ANALÍTICA COM CARTÕES TÁTEIS ESCUROS */
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Sessão 03 · Certames & Oportunidades Mapeadas
              </span>
              <div className="text-xs text-slate-400">
                Exibindo <strong className="text-white">{filteredTenders.length}</strong> certames ativos de <strong className="text-white">{tendersList.length}</strong> indexados no PNCP
              </div>
            </div>
          </div>

          {filteredTenders.map((tender) => {
            const isDispensa = tender.modalidadeKey === 'dispensa_eletronica';

            return (
              <div
                key={tender.id}
                className="tactile-card tactile-card-hover p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Coluna Esquerda: Detalhes e Conteúdo */}
                  <div className="space-y-3 flex-1">
                    {/* Metadados com Badges Táteis */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className={`font-bold px-2.5 py-1 rounded-lg text-[10px] border ${
                        tender.prioridade === 'P1'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {tender.prioridade === 'P1' ? 'P1 · Alta Prioridade / Ouro' : 'P2 · Média Prioridade / Prata'}
                      </span>
                      <span className="font-semibold text-slate-200 bg-[#1e2430] px-2.5 py-1 rounded-lg text-[11px] border border-white/[0.06]">
                        {tender.portal}
                      </span>
                      {tender.uasg && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="font-mono text-[11px] text-slate-300">UASG {tender.uasg}</span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-300 font-medium">{tender.modalidade}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[11px] font-semibold text-amber-300">{tender.nichoLabel}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{tender.cidade}/{tender.estadoUf}</span>
                      </span>
                    </div>

                    {/* Título & Órgão Contratante */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {tender.numeroEdital} — {tender.orgao}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {tender.objeto}
                      </p>
                    </div>

                    {/* Diferencial Competitivo em Cavidade Inset Tátil */}
                    <div className="tactile-well p-3.5 text-xs text-slate-200 flex items-start gap-2.5 border-l-2 border-l-amber-500">
                      <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-amber-300">Diferencial Estratégico Levivre:</strong>{' '}
                        {tender.destaqueMotivo}
                      </div>
                    </div>

                    {/* Botões de Ação Secundária Táteis */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <button
                        onClick={() => {
                          setSelectedTenderForView(tender);
                          setEditalViewTab('extrato');
                        }}
                        className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Ver Edital Oficial</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTenderForView(tender);
                          setEditalViewTab('14pontos');
                        }}
                        className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-emerald-300 hover:text-emerald-200 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Matriz 14 Pontos</span>
                      </button>

                      <button
                        onClick={() => setSelectedTenderForFinance(tender)}
                        className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-amber-300 hover:text-amber-200 cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>Simular DRE</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 ml-auto">
                        <span>Fase no Pipeline:</span>
                        <select
                          value={tender.etapaPipeline}
                          onChange={(e) => handleMovePipeline(tender.id, e.target.value as EtapaPipeline)}
                          className="text-[11px] bg-[#1b2029] border border-white/[0.08] rounded p-1 text-slate-200 focus:outline-hidden"
                        >
                          <option value="triagem">Triagem</option>
                          <option value="auditoria">Auditoria</option>
                          <option value="minuta_proposta">Minutas & Proposta</option>
                          <option value="sessao_disputa">Sessão / Disputa</option>
                          <option value="homologado">Homologado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita: Números Comerciais em Cavidade Inset Tátil */}
                  <div className="lg:w-72 shrink-0 tactile-well p-4 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Valor Estimado
                        </span>
                        <div className="text-2xl font-extrabold font-mono text-white mt-0.5 tracking-tight">
                          {tender.valorEstimadoFormatado}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Critério:</span>
                          <span className="font-semibold text-slate-200 text-right truncate max-w-[150px]" title={tender.criterioJulgamento}>
                            {tender.criterioJulgamento}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Prazo Médio Pgto:</span>
                          <span className="font-semibold text-slate-200">{tender.prazoMedioPagamentoDias} dias</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Aderência Levivre:</span>
                          <span className="px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {tender.scoreAderenciaLevivre}%
                          </span>
                        </div>
                      </div>

                      {/* Alerta de Prazo Legal */}
                      <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        tender.prazoUrgente
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                          : 'bg-[#202530] border border-white/[0.05] text-slate-300'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{tender.prazoRestante}</span>
                      </div>
                    </div>

                    {/* Botão Primário Laranja Vibrante */}
                    <div className="space-y-2 pt-1">
                      {isDispensa ? (
                        <button
                          onClick={() => onSelectTenderForDispensa(tender)}
                          className="w-full py-2.5 px-3 text-xs font-bold text-white tactile-btn-primary rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-white" />
                          <span>Enviar Cotação Expressa</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectTenderForProposal(tender)}
                          className="w-full py-2.5 px-3 text-xs font-bold text-white tactile-btn-primary rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Apresentar Proposta Comercial</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => onSelectTenderForAudit(tender)}
                          className="tactile-btn inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl text-slate-300 hover:text-white cursor-pointer"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          <span>Auditar</span>
                        </button>

                        <a
                          href={tender.linkOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tactile-btn inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl text-slate-300 hover:text-white"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* MODAL 1: Visualizador Completo do Edital Oficial com Abas (Tema Tátil Escuro) */}
      {selectedTenderForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="tactile-card-raised border border-white/[0.09] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.06] bg-[#1e2430] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    selectedTenderForView.prioridade === 'P1'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {selectedTenderForView.prioridade === 'P1' ? 'P1 · Alta Prioridade / Ouro' : 'P2 · Média Prioridade / Prata'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {selectedTenderForView.portal} · {selectedTenderForView.modalidade}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {selectedTenderForView.numeroEdital} — {selectedTenderForView.orgao}
                </h2>
              </div>

              <button
                onClick={() => setSelectedTenderForView(null)}
                className="p-1.5 rounded-xl tactile-btn text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Extrato, 14 Pontos e Prazos */}
            <div className="px-5 py-2.5 bg-[#181d25] border-b border-white/[0.05] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditalViewTab('extrato')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    editalViewTab === 'extrato' ? 'tactile-tab-active font-bold' : 'tactile-btn text-slate-400'
                  }`}
                >
                  Extrato do Edital
                </button>
                <button
                  onClick={() => setEditalViewTab('14pontos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    editalViewTab === '14pontos' ? 'tactile-tab-active font-bold text-emerald-400' : 'tactile-btn text-slate-400'
                  }`}
                >
                  Matriz 14 Pontos Críticos
                </button>
                <button
                  onClick={() => setEditalViewTab('prazos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    editalViewTab === 'prazos' ? 'tactile-tab-active font-bold text-amber-400' : 'tactile-btn text-slate-400'
                  }`}
                >
                  Prazos Legais (Regra do Jogo)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyEdital(selectedTenderForView.textoCompletoEdital)}
                  className="tactile-btn px-3 py-1.5 rounded-xl text-xs text-slate-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedEdital ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedEdital ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => {
                    const t = selectedTenderForView;
                    setSelectedTenderForView(null);
                    onSelectTenderForAudit(t);
                  }}
                  className="tactile-btn-primary px-3.5 py-1.5 text-xs text-white rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-white" />
                  <span>Auditar Riscos</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {editalViewTab === 'extrato' && (
                <div className="font-mono text-slate-300 leading-relaxed tactile-well whitespace-pre-wrap select-text p-4 rounded-xl">
                  {selectedTenderForView.textoCompletoEdital}
                </div>
              )}

              {editalViewTab === '14pontos' && selectedTenderForView.criterios14Pontos && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-center justify-between">
                    <span><strong>Classificação de Fit:</strong> {selectedTenderForView.prioridade === 'P1' ? 'P1 · Alta Relevância (Ouro)' : 'P2 · Média Prioridade (Prata)'}</span>
                    <span className="font-bold font-mono text-emerald-400">{selectedTenderForView.scoreAderenciaLevivre}% Aderente</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">1. Exigência ME/EPP:</span>
                      <span className="font-semibold text-white">{String(selectedTenderForView.criterios14Pontos.exigenciaMeEpp)}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">2. Balanço Patrimonial:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.balancoPatrimonialObrigatorio ? 'Obrigatório' : 'Dispensado'}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">3. Índices Financeiros:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.indicesFinanceirosMinimos}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">4. Vistoria Técnica:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.vistoriaTecnica.tipo}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">5. Exigência de Amostra:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.exigenciaAmostra ? 'Sim' : 'Não'}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">6. Atestados Técnicos:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.atestadosCapacidadeTecnica}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">7. Garantia de Proposta:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.garantiaProposta ? 'Sim (até 1%)' : 'Não'}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">8. Capital Social Mínimo:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.capitalSocialMinimo}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">9. Subcontratação:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.subcontratacaoPermitida ? 'Permitida' : 'Vedada'}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">10. Prazo Impugnação:</span>
                      <span className="font-bold text-rose-400">{selectedTenderForView.criterios14Pontos.prazoImpugnacaoDiasUteis} dias úteis</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">11. Prazo Esclarecimento:</span>
                      <span className="font-bold text-amber-400">{selectedTenderForView.criterios14Pontos.prazoEsclarecimentoDiasUteis} dias úteis</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">12. Registro Cadastral:</span>
                      <span className="font-bold text-emerald-400">{selectedTenderForView.criterios14Pontos.registroCadastralEspecifico}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">13. Sanção Impedimento:</span>
                      <span className="font-semibold text-white">{selectedTenderForView.criterios14Pontos.sancaoImpedimentoLocal ? 'Local' : 'Nacional'}</span>
                    </div>
                    <div className="p-3 tactile-well-sm">
                      <span className="text-slate-400 block text-[11px]">14. Valor Estimado Total:</span>
                      <span className="font-bold font-mono text-amber-400">
                        R$ {selectedTenderForView.criterios14Pontos.valorEstimadoTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {editalViewTab === 'prazos' && selectedTenderForView.cronogramaPrazos && (
                <div className="space-y-4">
                  <div className="p-3 tactile-well text-amber-300 flex items-center justify-between">
                    <span><strong>Status dos Prazos:</strong> Contagem em Dias Úteis · Horário Oficial de Brasília</span>
                    <span className="font-bold font-mono text-white">{selectedTenderForView.cronogramaPrazos.diasUteisRestantes} dias úteis restantes</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 tactile-well-sm flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase">1. Limite para Pedido de Esclarecimento</span>
                        <div className="font-semibold text-white">{selectedTenderForView.cronogramaPrazos.limiteEsclarecimento}</div>
                      </div>
                      <span className="text-[11px] text-slate-400">Art. 164 Lei 14.133</span>
                    </div>

                    <div className="p-3 tactile-well-sm flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase">2. Limite para Impugnação do Edital</span>
                        <div className="font-semibold text-white">{selectedTenderForView.cronogramaPrazos.limiteImpugnacao}</div>
                      </div>
                      <span className="text-[11px] text-slate-400">Art. 164 Lei 14.133</span>
                    </div>

                    <div className="p-3 tactile-well-sm border border-amber-500/20 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-amber-300 uppercase">3. Abertura da Sessão / Disputa</span>
                        <div className="font-semibold text-white">{selectedTenderForView.cronogramaPrazos.dataSessao}</div>
                      </div>
                      <span className="text-[11px] text-amber-400 font-semibold">Sessão Pública</span>
                    </div>

                    <div className="p-3 tactile-well-sm flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">4. Intenção Recursal & Razões</span>
                        <div className="font-semibold text-white">{selectedTenderForView.cronogramaPrazos.limiteRecurso}</div>
                      </div>
                      <span className="text-[11px] text-slate-400">Art. 165 Lei 14.133</span>
                    </div>

                    <div className="p-3 tactile-well-sm flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">5. Contrarrazões a Recurso</span>
                        <div className="font-semibold text-white">{selectedTenderForView.cronogramaPrazos.limiteContrarazoes}</div>
                      </div>
                      <span className="text-[11px] text-slate-400">Art. 165 Lei 14.133</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Calculadora de Lucratividade Líquida & Viabilidade Financeira (Tema Tátil Escuro) */}
      {selectedTenderForFinance && simulacaoFinanceira && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="tactile-card-raised border border-white/[0.09] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] bg-[#1e2430] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl tactile-btn flex items-center justify-center text-amber-400 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Calculadora de Lucratividade & Viabilidade Financeira
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedTenderForFinance.numeroEdital} · {selectedTenderForFinance.orgao}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTenderForFinance(null)}
                className="p-1.5 rounded-xl tactile-btn text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              <div className="p-3.5 tactile-well border-l-2 border-l-amber-500 rounded-xl flex items-start gap-2.5 text-slate-200 text-xs">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-amber-300">Regra Tributária do Setor de Turismo:</strong> Passagens e hotelaria são custos neutros de repasse. Os tributos da Levivre Viagens incidem <strong className="text-white">estritamente sobre a Taxa de Agenciamento / Emissão (DU/RAV)</strong>.
                </div>
              </div>

              {/* Sliders / Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 tactile-well-sm space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-slate-300">
                    <span>Taxa DU / Margem Agência:</span>
                    <span className="font-mono text-amber-400 font-bold">{taxaDUPercentual}%</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="12.0"
                    step="0.5"
                    value={taxaDUPercentual}
                    onChange={(e) => setTaxaDUPercentual(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">Comissão da agência faturada</span>
                </div>

                <div className="p-3.5 tactile-well-sm space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-slate-300">
                    <span>Alíquota Efetiva de Impostos:</span>
                    <span className="font-mono text-amber-400 font-bold">{aliquotaImposto}%</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="15.0"
                    step="0.5"
                    value={aliquotaImposto}
                    onChange={(e) => setAliquotaImposto(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">Simples Nacional (Anexo III)</span>
                </div>

                <div className="p-3.5 tactile-well-sm space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-slate-300">
                    <span>Custo OBT/GDS por Bilhete:</span>
                    <span className="font-mono text-amber-400 font-bold">R$ {custoObtPorBilhete.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="15.0"
                    step="0.5"
                    value={custoObtPorBilhete}
                    onChange={(e) => setCustoObtPorBilhete(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">Custo de ferramenta e emissão</span>
                </div>

                <div className="p-3.5 tactile-well-sm space-y-1.5">
                  <div className="flex justify-between items-center font-semibold text-slate-300">
                    <span>Prazo Médio de Liquidação:</span>
                    <span className="font-mono text-amber-400 font-bold">{diasRecebimentoOrgao} dias</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={diasRecebimentoOrgao}
                    onChange={(e) => setDiasRecebimentoOrgao(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">Custo financeiro de antecipação</span>
                </div>
              </div>

              {/* DRE Cards */}
              <div className="tactile-well p-4 space-y-2.5">
                <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                  Demonstrativo de Resultado da Operação (DRE Gerencial B2G):
                </span>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Volume Total do Contrato Estimado:</span>
                    <span className="font-mono font-semibold text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.valorTotalContrato)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-200 font-medium">
                    <span>(+) Faturamento Bruto da Agência (Taxa DU {taxaDUPercentual}%):</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.receitaBrutaAgencia)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>(-) Impostos sobre a DU ({aliquotaImposto}%):</span>
                    <span className="font-mono text-rose-400">
                      - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.totalImpostos)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>(-) Custos Operacionais OBT/GDS:</span>
                    <span className="font-mono text-rose-400">
                      - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.custoEmissaoGdsObt)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>(-) Custo Financeiro / Capital de Giro ({diasRecebimentoOrgao} dias):</span>
                    <span className="font-mono text-rose-400">
                      - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.custoCapitalGiro)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-sm font-bold">
                    <span className="text-white">(=) Lucro Líquido Real da Levivre Viagens:</span>
                    <div className="text-right">
                      <div className="text-emerald-400 font-mono text-base font-extrabold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacaoFinanceira.lucroLiquidoEstimado)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        Margem sobre a receita: <strong className="text-emerald-300">{simulacaoFinanceira.margemLiquidaPercentual.toFixed(1)}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Parecer */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                simulacaoFinanceira.statusViabilidade === 'alta'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : simulacaoFinanceira.statusViabilidade === 'moderada'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                <div>
                  <span className="font-bold block text-xs">Parecer de Viabilidade Econômica:</span>
                  <span className="text-xs text-slate-200">{simulacaoFinanceira.parecerViabilidade}</span>
                </div>
                <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-[#1e2430] border border-current">
                  {simulacaoFinanceira.statusViabilidade.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-[#1e2430] flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedTenderForFinance(null)}
                className="tactile-btn px-4 py-2 rounded-xl font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const t = selectedTenderForFinance;
                  setSelectedTenderForFinance(null);
                  onSelectTenderForProposal(t);
                }}
                className="tactile-btn-primary px-4 py-2 rounded-xl font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Usar estes Parâmetros na Proposta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
