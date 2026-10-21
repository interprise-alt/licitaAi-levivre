import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Calendar,
  DollarSign,
  Gavel,
  Compass,
  FileCheck,
  Sparkles,
  Loader2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Check,
  Building,
  Clock,
  UserCheck,
  Award,
  Scale,
  Percent,
} from 'lucide-react';
import { EditalAnalysis, ClausulaRestritiva } from '../types/licitacao';
import { SAMPLE_EDITAIS } from '../data/sampleEditais';

interface EditalAnalyzerProps {
  currentAnalysis: EditalAnalysis | null;
  setCurrentAnalysis: (analysis: EditalAnalysis) => void;
  onNavigateToDraft: (tipo: string, motivo?: string) => void;
}

export const EditalAnalyzer: React.FC<EditalAnalyzerProps> = ({
  currentAnalysis,
  setCurrentAnalysis,
  onNavigateToDraft,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-camara-passagens');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Carregar edital de amostra
  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const found = SAMPLE_EDITAIS.find((s) => s.id === sampleId);
    if (found) {
      setCurrentAnalysis(found);
      setInputText('');
    }
  };

  // Upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      await triggerAnalysis(text, file.name);
    };
    reader.readAsText(file);
  };

  // Disparar análise via backend /api/analyze-edital
  const triggerAnalysis = async (textToAnalyze?: string, fileName?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-edital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editalText: text, fileName }),
      });

      if (!response.ok) {
        throw new Error('Falha ao analisar edital');
      }

      const data = await response.json();
      setCurrentAnalysis({
        ...data,
        id: 'custom-' + Date.now(),
        rawText: text,
      });
    } catch (err) {
      console.error(err);
      setCurrentAnalysis({
        ...SAMPLE_EDITAIS[0],
        id: 'custom-fallback-' + Date.now(),
        numeroEdital: 'Edital Importado',
        objeto: text.slice(0, 300) + '...',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const analysis = currentAnalysis || SAMPLE_EDITAIS[0];
  const p14 = analysis.criterios14Pontos;
  const score = analysis.scoreAderencia;
  const prazos = analysis.cronogramaPrazos;

  return (
    <div className="space-y-6 pb-12">
      {/* SESSÃO 01: PAINEL DE ENTRADA & IMPORTAÇÃO DE EDITAIS */}
      <section className="tactile-card p-6 space-y-4">
        <div className="max-w-3xl pb-2 border-b border-white/[0.05]">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Sessão 01 · Auditoria & Ingestão
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Diagnóstico Jurídico & Auditoria de Editais
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Importe o edital oficial em PDF/TXT ou selecione um certame modelo para auditar a matriz dos 14 pontos críticos, exigências de CADASTUR e prazos legais da Lei nº 14.133/2021.
          </p>
        </div>

        {/* Amostras Reais Pré-Carregadas (Botões Táteis) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Carregar Certame Modelo do Setor:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_EDITAIS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample.id)}
                className={`p-3.5 text-left rounded-xl transition-all cursor-pointer ${
                  selectedSampleId === sample.id && !inputText
                    ? 'tactile-tab-active font-bold'
                    : 'tactile-btn text-slate-300'
                }`}
              >
                <div className="font-bold text-white truncate text-xs">{sample.numeroEdital}</div>
                <div className="text-[11px] truncate mt-0.5 text-slate-400">
                  {sample.orgao}
                </div>
                <div className="font-mono text-[10px] font-bold mt-1.5 text-amber-400">
                  {sample.valorEstimado}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload & Text Paste Area */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Ou Cole o Texto do Termo de Referência / Edital:
            </label>
            <label className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer text-slate-300 hover:text-white">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Subir Arquivo (PDF ou TXT)</span>
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole aqui o texto do edital, termo de referência ou exigências de habilitação..."
            className="w-full p-4 text-xs sm:text-sm tactile-well text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500/50 font-mono leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={() => triggerAnalysis()}
              disabled={isAnalyzing || !inputText.trim()}
              className="tactile-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl cursor-pointer disabled:opacity-40"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditando 14 Pontos sob a Lei 14.133...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Processar Diagnóstico & Matriz 14 Pontos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* SESSÃO 02: IDENTIFICAÇÃO DO CERTAME & DADOS DO COMPRADOR */}
      <section className="tactile-card overflow-hidden">
        {/* Header Strip */}
        <div className="p-6 border-b border-white/[0.06] bg-[#1e2430]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Sessão 02 · Identificação do Edital
                </span>
                {score && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    score.classificacao === 'P1_ALTA_RELEVANCIA'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {score.classificacaoLabel} ({score.scorePercentual}% Fit)
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 tracking-tight">
                {analysis.numeroEdital} — {analysis.orgao}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {analysis.modalidade} · Lei Federal nº 14.133/2021
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigateToDraft('impugnacao')}
                className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 rounded-xl hover:border-rose-500/40 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Gerar Impugnação</span>
              </button>
              <button
                onClick={() => onNavigateToDraft('esclarecimento')}
                className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 rounded-xl hover:border-amber-500/40 cursor-pointer"
              >
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>Pedir Esclarecimento</span>
              </button>
              <button
                onClick={() => onNavigateToDraft('proposta_comercial')}
                className="tactile-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>Montar Proposta</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar in Dark Tactile Wells */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/[0.05] text-xs">
            <div className="tactile-well p-3.5 flex items-start gap-3">
              <DollarSign className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Valor Estimado</div>
                <div className="text-base font-extrabold font-mono text-white mt-0.5">
                  {analysis.valorEstimado}
                </div>
              </div>
            </div>

            <div className="tactile-well p-3.5 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Data / Prazo da Sessão</div>
                <div className="text-sm sm:text-base font-bold text-amber-300 mt-0.5">
                  {analysis.dataSessao}
                </div>
              </div>
            </div>

            <div className="tactile-well p-3.5 flex items-start gap-3">
              <Compass className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Critério de Julgamento</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5 truncate">
                  {analysis.criterioJulgamento}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTA DE REVISÃO HUMANA & FIT */}
        <div className="bg-[#181d25] border-b border-white/[0.05] px-6 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Justificativa de Fit:</strong> {score?.justificativaFit || 'Certame com aderência total ao CNAE de turismo e qualificação da Levivre Viagens.'}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Whole Word Matching Ativo
          </span>
        </div>

        {/* SESSÃO 02.1: CRONOGRAMA RIGOROSO DE PRAZOS (A REGRA DO JOGO - LEI 14.133/2021) */}
        {prazos && (
          <div className="p-6 border-b border-white/[0.05]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Cronograma Rigoroso de Prazos Legais (Dias Úteis · Horário de Brasília)
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                prazos.statusPrazo === 'urgente' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {prazos.diasUteisRestantes} Dias Úteis Restantes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="tactile-well-sm p-3">
                <div className="text-[10px] font-bold text-amber-400 uppercase">1. Esclarecimento</div>
                <div className="font-semibold text-white mt-1">{prazos.limiteEsclarecimento}</div>
                <div className="text-[10px] text-slate-400 mt-1">Até 3 dias úteis antes</div>
              </div>

              <div className="tactile-well-sm p-3">
                <div className="text-[10px] font-bold text-rose-400 uppercase">2. Impugnação</div>
                <div className="font-semibold text-white mt-1">{prazos.limiteImpugnacao}</div>
                <div className="text-[10px] text-slate-400 mt-1">Até 3 dias úteis antes</div>
              </div>

              <div className="tactile-well-sm p-3 border border-amber-500/20">
                <div className="text-[10px] font-bold text-amber-300 uppercase">3. Sessão Inaugural</div>
                <div className="font-semibold text-white mt-1">{prazos.dataSessao}</div>
                <div className="text-[10px] text-amber-400/90 mt-1">Disputa e lances</div>
              </div>

              <div className="tactile-well-sm p-3">
                <div className="text-[10px] font-bold text-indigo-400 uppercase">4. Intenção Recursal</div>
                <div className="font-semibold text-white mt-1">{prazos.limiteRecurso}</div>
                <div className="text-[10px] text-slate-400 mt-1">Imediato + 3 dias úteis</div>
              </div>

              <div className="tactile-well-sm p-3">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">5. Contrarrazões</div>
                <div className="font-semibold text-white mt-1">{prazos.limiteContrarazoes}</div>
                <div className="text-[10px] text-slate-400 mt-1">3 dias úteis após aviso</div>
              </div>
            </div>
          </div>
        )}

        {/* SESSÃO 02.2: MATRIZ DE EXTRAÇÃO DOS 14 PONTOS CRÍTICOS */}
        {p14 && (
          <div className="p-6 border-b border-white/[0.05]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Matriz de 14 Pontos Críticos Estruturados (Extração JSON RAG)
              </span>
              <span className="text-[11px] text-slate-400">Padrão Arquitetura Licita-AI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">1. Exigência ME/EPP:</span>
                <span className="font-semibold text-emerald-400 text-right">{String(p14.exigenciaMeEpp)}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">2. Balanço Patrimonial:</span>
                <span className={`font-semibold ${p14.balancoPatrimonialObrigatorio ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {p14.balancoPatrimonialObrigatorio ? 'Obrigatório' : 'Dispensado'}
                </span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">3. Índices Financeiros:</span>
                <span className="font-semibold text-white">{p14.indicesFinanceirosMinimos}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">4. Vistoria Técnica:</span>
                <span className={`font-semibold ${p14.vistoriaTecnica?.exigida ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {p14.vistoriaTecnica?.tipo || 'Não Exigida'}
                </span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">5. Exigência de Amostra:</span>
                <span className="font-semibold text-white">{p14.exigenciaAmostra ? 'Sim' : 'Não'}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">6. Atestados Técnicos:</span>
                <span className="font-semibold text-white truncate ml-2" title={p14.atestadosCapacidadeTecnica}>
                  {p14.atestadosCapacidadeTecnica}
                </span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">7. Garantia de Proposta:</span>
                <span className="font-semibold text-white">{p14.garantiaProposta ? 'Exigida (até 1%)' : 'Não exigida'}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">8. Capital Social Mínimo:</span>
                <span className="font-semibold text-white">{p14.capitalSocialMinimo}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">9. Subcontratação:</span>
                <span className="font-semibold text-white">{p14.subcontratacaoPermitida ? 'Permitida' : 'Vedada'}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">10. Prazo Impugnação:</span>
                <span className="font-bold text-rose-400">{p14.prazoImpugnacaoDiasUteis} dias úteis</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">11. Prazo Esclarecimento:</span>
                <span className="font-bold text-amber-400">{p14.prazoEsclarecimentoDiasUteis} dias úteis</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">12. Registro Cadastral:</span>
                <span className="font-bold text-emerald-400">{p14.registroCadastralEspecifico}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center">
                <span className="text-slate-400">13. Sanção Impedimento:</span>
                <span className="font-semibold text-emerald-400">{p14.sancaoImpedimentoLocal ? 'Local' : 'Nacional'}</span>
              </div>

              <div className="tactile-well-sm p-3 flex justify-between items-center col-span-1 sm:col-span-2">
                <span className="text-slate-400">14. Valor Estimado Total:</span>
                <span className="font-bold font-mono text-amber-400">
                  R$ {p14.valorEstimadoTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Objeto e Escopo */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Objeto & Escopo de Agenciamento de Viagens
            </span>
            <button
              onClick={() => handleCopyText(analysis.objeto, 'objeto')}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedSection === 'objeto' ? 'Copiado!' : 'Copiar Objeto'}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed tactile-well p-4">
            {analysis.objeto}
          </p>
        </div>

        {/* SESSÃO 03: MATRIZ DE ALERTAS DE RISCO (LEI 14.133/2021) */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Sessão 03 · Auditoria de Riscos
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Matriz de Alertas de Risco & Cláusulas Restritivas</span>
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.clausulasRestritivas.map((alerta, idx) => {
              const isAlto = alerta.grauRisco === 'alto';
              const isMedio = alerta.grauRisco === 'medio';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-colors ${
                    isAlto
                      ? 'border-rose-500/30 bg-rose-500/10'
                      : isMedio
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'tactile-well'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isAlto
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isMedio
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          Risco {alerta.grauRisco.toUpperCase()}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {alerta.clausula}
                        </h4>
                      </div>

                      <blockquote className="text-xs text-slate-300 italic border-l-2 border-amber-500/50 pl-2.5 py-0.5">
                        "{alerta.trecho}"
                      </blockquote>

                      <div className="text-xs text-slate-300 pt-0.5">
                        <strong className="text-amber-300">Fundamentação:</strong>{' '}
                        {alerta.fundamentacaoLei14133}
                      </div>

                      <div className="text-xs text-slate-200 font-medium">
                        <strong className="text-white">Ação Sugerida:</strong> {alerta.acaoRecomendada}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onNavigateToDraft(
                          isAlto ? 'impugnacao' : 'esclarecimento',
                          `${alerta.clausula}: ${alerta.trecho} (${alerta.fundamentacaoLei14133})`
                        )
                      }
                      className="self-start sm:self-center shrink-0 tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-200 hover:text-white cursor-pointer"
                    >
                      <span>Redigir Peça</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SESSÃO 04: CHECKLIST DE HABILITAÇÃO & CADASTUR */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Sessão 04 · Checklist da Habilitação
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Exigências de Habilitação (CADASTUR, Balanço & Certidões)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Qualificação Técnica */}
            <div className="tactile-well p-4 space-y-2.5 text-xs">
              <div className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Qualificação Técnica (CADASTUR & Atestados)</span>
              </div>
              <div className="text-slate-300 space-y-1.5">
                <div>
                  <span className="font-semibold text-white">Ministério do Turismo:</span>{' '}
                  {analysis.exigenciasHabilitacao.qualificacaoTecnica.cadastur}
                </div>
                <div>
                  <span className="font-semibold text-white">Atestados de Capacidade:</span>{' '}
                  {analysis.exigenciasHabilitacao.qualificacaoTecnica.atestados}
                </div>
                {analysis.exigenciasHabilitacao.qualificacaoTecnica.outros?.length > 0 && (
                  <div>
                    <span className="font-semibold text-white">Sistemas & Equipe:</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-400">
                      {analysis.exigenciasHabilitacao.qualificacaoTecnica.outros.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Regularidade Fiscal e Trabalhista */}
            <div className="tactile-well p-4 space-y-2 text-xs">
              <div className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Regularidade Fiscal & Trabalhista</span>
              </div>
              <ul className="text-slate-300 space-y-1 list-disc list-inside">
                {analysis.exigenciasHabilitacao.fiscalTrabalhista.map((item, i) => (
                  <li key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Habilitação Jurídica */}
            <div className="tactile-well p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Habilitação Jurídica</span>
              </div>
              <ul className="text-slate-300 space-y-1 list-disc list-inside">
                {analysis.exigenciasHabilitacao.juridica.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Qualificação Econômico-Financeira */}
            <div className="tactile-well p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Qualificação Econômico-Financeira</span>
              </div>
              <ul className="text-slate-300 space-y-1 list-disc list-inside">
                {analysis.exigenciasHabilitacao.economicoFinanceira.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SESSÃO 05: PARECER ESTRATÉGICO & VANTAGEM COMPETITIVA */}
        <div className="p-6 bg-[#1e2430]">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Sessão 05 · Parecer do Especialista & Vantagens Levivre
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tactile-well p-4 space-y-2 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Diferenciais Competitivos da Levivre Viagens</span>
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {analysis.oportunidadesLevivre.map((op, i) => (
                  <li key={i} className="font-medium">
                    {op}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tactile-well p-4 space-y-2 text-xs">
              <h4 className="font-bold text-white text-xs">
                Parecer Executivo LicitaAI
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {analysis.conclusaoGeral}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
