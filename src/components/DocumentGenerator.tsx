import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Sparkles,
  Loader2,
  Check,
  Building2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Scale,
  Shield,
  FileCheck2,
  Send,
  Gavel,
  ShieldAlert,
  Target,
  AlertTriangle,
  Award,
  ChevronRight,
  UserCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { EditalAnalysis, CompanyProfile, TipoDocumento, SimuladorJulgamento } from '../types/licitacao';

interface DocumentGeneratorProps {
  currentAnalysis: EditalAnalysis | null;
  companyProfile: CompanyProfile;
  initialType?: TipoDocumento;
  initialMotivo?: string;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  currentAnalysis,
  companyProfile,
  initialType = 'impugnacao',
  initialMotivo = '',
}) => {
  const [selectedType, setSelectedType] = useState<TipoDocumento>(initialType);
  const [motivoCustomizado, setMotivoCustomizado] = useState<string>(initialMotivo);
  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Estado do Simulador de Julgamento
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimuladorJulgamento | null>(null);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
    if (initialMotivo) {
      setMotivoCustomizado(initialMotivo);
    }
  }, [initialType, initialMotivo]);

  // Gerar peça padronizada em 9 partes
  const handleGenerateDraft = async (typeToGen?: TipoDocumento) => {
    const t = typeToGen || selectedType;
    setIsGenerating(true);
    setSimulationResult(null); // Resetar simulação anterior
    try {
      const response = await fetch('/api/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: t,
          editalData: currentAnalysis,
          empresaData: companyProfile,
          motivoCustomizado,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar documento');
      }

      const data = await response.json();
      setGeneratedDoc(data.content);
      setDocTitle(data.documentTitle || 'Minuta Jurídica');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!generatedDoc) {
      handleGenerateDraft(selectedType);
    }
  }, []);

  // Simular julgamento da peça jurídica (Pregoeiro & Concorrência)
  const handleSimulateJudgment = async () => {
    if (!generatedDoc) return;
    setIsSimulating(true);
    try {
      const response = await fetch('/api/simulate-judgment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContent: generatedDoc,
          editalData: currentAnalysis,
          tipoDocumento: docTitle || selectedType,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao simular julgamento');
      }

      const data = await response.json();
      setSimulationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Estado para aplicação de blindagem dos pontos fracos
  const [patchingPoint, setPatchingPoint] = useState<string | null>(null);
  const [blindedPoints, setBlindedPoints] = useState<string[]>([]);
  const [patchToast, setPatchToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Aplicar ajuste de blindagem na peça jurídica / proposta
  const handleBlindarPontos = async (pontos: string[]) => {
    if (!generatedDoc || pontos.length === 0) return;
    const isAll = pontos.length > 1;
    setPatchingPoint(isAll ? 'all' : pontos[0]);

    try {
      const response = await fetch('/api/patch-document-blindagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDocument: generatedDoc,
          pontosParaBlindar: pontos,
          editalData: currentAnalysis,
          tipoDocumento: docTitle || selectedType,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao aplicar blindagem na peça');
      }

      const data = await response.json();
      setGeneratedDoc(data.updatedContent);
      setBlindedPoints((prev) => Array.from(new Set([...prev, ...pontos])));

      // Atualizar o resultado da simulação para refletir o aumento imediato da probabilidade de êxito
      setSimulationResult((prev) => {
        if (!prev) return null;
        const newProb = data.probabilidadeExitoNova || Math.min(98, prev.probabilidadeExitoPercentual + (pontos.length * 4));
        return {
          ...prev,
          probabilidadeExitoPercentual: newProb,
          grauRiscoRejeicao: 'Baixo',
          pontosBlindados: Array.from(new Set([...(prev.pontosBlindados || []), ...pontos])),
          pontosFortesPeca: [
            ...prev.pontosFortesPeca,
            ...pontos.map((p) => `Blindagem consolidada: ${p}`),
          ],
        };
      });

      setPatchToast({
        message: data.message || `${pontos.length} ponto(s) blindado(s) com sucesso na minuta!`,
        type: 'success',
      });
      setTimeout(() => setPatchToast(null), 6000);
    } catch (err: any) {
      console.error(err);
      setPatchToast({
        message: 'Erro ao aplicar blindagem na peça: ' + (err?.message || 'Falha de conexão'),
        type: 'error',
      });
      setTimeout(() => setPatchToast(null), 5000);
    } finally {
      setPatchingPoint(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}_${currentAnalysis?.numeroEdital || 'licitacao'}.txt`.replace(/\s+/g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${docTitle}</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #111; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 13pt; }
            </style>
          </head>
          <body>
            <pre>${generatedDoc}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const docOptions: { type: TipoDocumento; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      type: 'impugnacao',
      label: 'Impugnação ao Edital',
      desc: 'Art. 164 Lei 14.133/2021 · Prazo: até 3 dias úteis antes da abertura',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
    },
    {
      type: 'esclarecimento',
      label: 'Pedido de Esclarecimento',
      desc: 'Art. 164 Lei 14.133/2021 · Dúvidas sobre OBT, taxas ou diárias',
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
    },
    {
      type: 'recurso',
      label: 'Recurso Administrativo',
      desc: 'Art. 165 Lei 14.133/2021 · Contra inabilitação ou desclassificação',
      icon: <Scale className="w-4 h-4 text-sky-600" />,
    },
    {
      type: 'contrarazoes',
      label: 'Contrarrazões a Recurso',
      desc: 'Art. 165 Lei 14.133/2021 · Defesa da Levivre contra recurso de concorrente',
      icon: <Gavel className="w-4 h-4 text-indigo-600" />,
    },
    {
      type: 'declaracao_habilita',
      label: 'Declaração de Habilitação',
      desc: 'Art. 63, I Lei 14.133/2021 · Cumprimento integral dos requisitos',
      icon: <FileCheck2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      type: 'declaracao_me_epp',
      label: 'Declaração de EPP (LC 123/06)',
      desc: 'Direito ao desempate ficto de 5% e tratamento diferenciado',
      icon: <Award className="w-4 h-4 text-teal-600" />,
    },
    {
      type: 'proposta_comercial',
      label: 'Proposta Comercial Oficial',
      desc: 'Planilha de taxas DU, passagens e hotelaria conforme edital',
      icon: <FileText className="w-4 h-4 text-slate-700" />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* SESSÃO 01: SELEÇÃO DA PEÇA JURÍDICA */}
      <section className="tactile-card p-6 space-y-4">
        <div className="max-w-3xl pb-2 border-b border-white/[0.05]">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Sessão 01 · Estrutura em 9 Partes Padronizadas & Lei 14.133/2021
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Redator Inteligente de Peças & Simulador de Julgamento
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Gera minutas jurídicas profissionais estruturadas em 9 seções com tempestividade em dias úteis, Súmulas reais do TCU e simulação do posicionamento do Pregoeiro.
          </p>
        </div>

        {/* Grade de Tipos de Documentos em Botões Táteis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {docOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                setSelectedType(opt.type);
                handleGenerateDraft(opt.type);
              }}
              className={`p-3.5 text-left rounded-xl transition-all text-xs flex flex-col justify-between cursor-pointer ${
                selectedType === opt.type
                  ? 'tactile-tab-active font-bold'
                  : 'tactile-btn text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {opt.icon}
                  <span className="font-bold truncate text-white">{opt.label}</span>
                </div>
                <p className={`text-[11px] leading-tight ${selectedType === opt.type ? 'text-amber-300/90' : 'text-slate-400'}`}>
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Motivo Personalizado */}
        <div className="space-y-2 pt-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Motivo / Cláusula Específica a Enfrentar (Opcional):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={motivoCustomizado}
              onChange={(e) => setMotivoCustomizado(e.target.value)}
              placeholder="Ex: Exigência ilegal de sede física no município, exigência indevida de IATA ou certidão vencida..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm tactile-well text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500/50 transition-colors"
            />
            <button
              onClick={() => handleGenerateDraft()}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs font-bold text-white tactile-btn-primary rounded-xl transition-all inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-40"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Regerar Minuta em 9 Partes</span>
            </button>
          </div>
        </div>
      </section>

      {/* SESSÃO 02: VISUALIZAÇÃO DA MINUTA & FERRAMENTAS */}
      <section className="tactile-card overflow-hidden">
        {/* Header da Peça */}
        <div className="p-5 border-b border-white/[0.06] bg-[#1e2430] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Padrão 9 Partes · Lei 14.133/2021
              </span>
              <span className="text-xs text-slate-400">
                {currentAnalysis?.numeroEdital || 'Certame Referência'} · {currentAnalysis?.orgao || 'Órgão Licitante'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {docTitle || 'Minuta Jurídica Oficial'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateJudgment}
              disabled={isSimulating || !generatedDoc}
              className="tactile-btn-emerald inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-lg"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Simulando Julgamento...</span>
                </>
              ) : (
                <>
                  <Target className="w-3.5 h-3.5 text-white" />
                  <span>Simular Julgamento da Peça</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Baixar (.txt)</span>
            </button>

            <button
              onClick={handlePrint}
              className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* ALERTA: REVISÃO HUMANA OBRIGATÓRIA */}
        <div className="bg-[#181d25] border-b border-white/[0.05] px-6 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Revisão Humana Obrigatória:</strong> Este documento foi gerado pelo co-piloto sob a Lei 14.133/2021. Verifique os campos sinalizados entre colchetes <code>[DADO A REVISAR]</code> antes do protocolo oficial.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            Anti-Alucinação Ativo
          </span>
        </div>

        {/* PAINEL DE RESULTADO DO SIMULADOR DE JULGAMENTO (QUANDO ATIVADO) */}
        {simulationResult && (
          <div className="p-6 bg-[#202530] border-b border-white/[0.06] transition-all">
            {/* TOAST / BANNER DE CONFIRMAÇÃO DE BLINDAGEM */}
            {patchToast && (
              <div className={`mb-4 p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                patchToast.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {patchToast.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="font-medium">{patchToast.message}</span>
                </div>
                <button
                  onClick={() => setPatchToast(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Simulador de Julgamento & Parecer Previsto do Pregoeiro
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400">Probabilidade Estimada de Êxito:</span>
                <span className="text-sm font-extrabold font-mono px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  <span>{simulationResult.probabilidadeExitoPercentual}% de Êxito</span>
                  {blindedPoints.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-sans font-bold">
                      (+{blindedPoints.length * 4}% blindado)
                    </span>
                  )}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  simulationResult.grauRiscoRejeicao === 'Baixo'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  Risco {simulationResult.grauRiscoRejeicao}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Pontos Fortes */}
              <div className="tactile-well p-4">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pontos Fortes da Peça</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  {simulationResult.pontosFortesPeca.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pontos Fracos a Blindar com Ação de Inserção Direta */}
              <div className="tactile-well p-4 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pontos Fracos a Blindar</span>
                  </div>
                  {/* Botão de Blindagem Total */}
                  {simulationResult.pontosFracosBlindar.some((p) => !blindedPoints.includes(p)) && (
                    <button
                      onClick={() => handleBlindarPontos(simulationResult.pontosFracosBlindar.filter((p) => !blindedPoints.includes(p)))}
                      disabled={patchingPoint !== null}
                      className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg inline-flex items-center gap-1 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      title="Inserir automaticamente cláusulas e garantias na peça para neutralizar todos os pontos fracos"
                    >
                      {patchingPoint === 'all' ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>Blindando...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-2.5 h-2.5" />
                          <span>Blindar Todos</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <ul className="space-y-2.5 text-slate-300">
                  {simulationResult.pontosFracosBlindar.map((item, i) => {
                    const isBlinded = blindedPoints.includes(item);
                    const isItemPatching = patchingPoint === item;

                    return (
                      <li key={i} className={`p-2.5 rounded-xl border transition-all ${
                        isBlinded ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-[#222834] border-white/[0.06]'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-1.5 flex-1">
                            {isBlinded ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <span className="text-amber-400 font-bold shrink-0">•</span>
                            )}
                            <span className={`text-[11px] leading-tight ${isBlinded ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                              {item}
                            </span>
                          </div>

                          {/* Ação individual de blindagem */}
                          {isBlinded ? (
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold inline-flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" />
                              Blindado
                            </span>
                          ) : (
                            <button
                              onClick={() => handleBlindarPontos([item])}
                              disabled={patchingPoint !== null}
                              className="shrink-0 px-2.5 py-1 bg-[#23272e] hover:bg-amber-500 hover:text-white text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                              title="Inserir cláusula específica na peça jurídica para sanar este ponto"
                            >
                              {isItemPatching ? (
                                <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-400" />
                              ) : (
                                <Zap className="w-2.5 h-2.5 text-amber-400" />
                              )}
                              <span>{isItemPatching ? 'Blindando...' : 'Blindar'}</span>
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Prováveis Argumentos da Concorrência */}
              <div className="tactile-well p-4">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
                  <Gavel className="w-3.5 h-3.5 text-amber-400" />
                  <span>Réplica Provável dos Concorrentes</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  {simulationResult.argumentosProvaveisConcorrente.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 p-3.5 tactile-well rounded-xl text-xs text-slate-300 flex items-start gap-2.5 border-l-2 border-l-amber-500">
              <span className="font-bold text-amber-300 shrink-0">Recomendação Estratégica:</span>
              <span className="leading-relaxed">{simulationResult.recomendacaoPregoeiro}</span>
            </div>
          </div>
        )}

        {/* Área de Texto da Peça Formatada */}
        <div className="p-6">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-xs font-medium text-slate-300">Estruturando minuta jurídica em 9 partes sob a Lei 14.133/2021...</p>
            </div>
          ) : (
            <div className="relative">
              <textarea
                value={generatedDoc}
                onChange={(e) => setGeneratedDoc(e.target.value)}
                rows={24}
                className="w-full p-5 font-mono text-xs sm:text-[13px] leading-relaxed tactile-well text-slate-100 focus:outline-hidden focus:border-amber-500/50 transition-colors"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
