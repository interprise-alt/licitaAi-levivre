import React, { useState } from 'react';
import {
  Send,
  Calculator,
  Clock,
  Plane,
  Building,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Zap,
  DollarSign,
  BarChart3,
  Percent,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { CompanyProfile } from '../types/licitacao';

interface DispensaRadarProps {
  companyProfile: CompanyProfile;
}

export const DispensaRadar: React.FC<DispensaRadarProps> = ({ companyProfile }) => {
  const [tipoServico, setTipoServico] = useState('Passagens Aéreas Nacionais & Hospedagem');
  const [trecho, setTrecho] = useState('São Paulo (GRU) - Brasília (BSB) - Retorno');
  const [dataIda, setDataIda] = useState('2026-11-04');
  const [dataVolta, setDataVolta] = useState('2026-11-07');
  const [numPassageiros, setNumPassageiros] = useState('2');
  const [valorTarifa, setValorTarifa] = useState('1850.00');
  const [taxaDU, setTaxaDU] = useState('4.0');
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  const passageirosNum = parseInt(numPassageiros, 10) || 1;
  const tarifaBase = parseFloat(valorTarifa) || 0;
  const percentualTaxa = parseFloat(taxaDU) || 0;

  const subtotalTarifas = tarifaBase * passageirosNum;
  const totalTaxaDU = subtotalTarifas * (percentualTaxa / 100);
  const taxaEmbarqueEstimada = 46.5 * passageirosNum;
  const valorTotalProposta = subtotalTarifas + totalTaxaDU + taxaEmbarqueEstimada;

  const [propostaPronta, setPropostaPronta] = useState<string>('');

  const handleGenerateQuote = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/quick-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoServico,
          trechoOrigemDestino: trecho,
          dataIda,
          dataVolta,
          numPassageiros: passageirosNum,
          valorEstimadoBilhetes: tarifaBase,
          taxaAgenciamentoPercentual: percentualTaxa,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPropostaPronta(data.templateProposta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const generateFallbackProposal = () => {
    return `PROPOSTA COMERCIAL EXPRESSA - DISPENSA ELETRÔNICA (LEI 14.133/2021, ART. 75, II - ATUALIZADO DECRETO Nº 12.807/2025)

À ADMINISTRAÇÃO PÚBLICA CONTRATANTE
EMPRESA: ${companyProfile.razaoSocial}
CNPJ: ${companyProfile.cnpj} · CADASTUR: ${companyProfile.cadastur}
E-MAIL: ${companyProfile.email} · TEL: ${companyProfile.telefone}

1. ESCOPO DO FORNECIMENTO:
Serviço: ${tipoServico}
Trecho / Destino: ${trecho}
Datas Previstas: Ida em ${dataIda} | Retorno em ${dataVolta}
Quantidade de Passageiros: ${passageirosNum}

2. COMPOSIÇÃO DE PREÇOS:
• Valor Estimado das Tarifas Públicas: R$ ${subtotalTarifas.toFixed(2)}
• Taxa de Agenciamento e Emissão DU (${percentualTaxa}%): R$ ${totalTaxaDU.toFixed(2)}
• Taxas de Embarque Oficiais (Repasse ANAC/Infraero): R$ ${taxaEmbarqueEstimada.toFixed(2)}
• VALOR TOTAL DA PROPOSTA: R$ ${valorTotalProposta.toFixed(2)}

3. CONDIÇÕES GERAIS:
• Validade da cotação: 3 (três) dias úteis face à flutuação das companhias aéreas e hotelaria.
• Atendimento 24/7 com suporte para remarcação e emergências.

${companyProfile.cidade || 'Ipatinga'} - ${companyProfile.estado || 'MG'}, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.

___________________________________________________
${companyProfile.razaoSocial}
${companyProfile.representante || 'Rocha Romeiro'}
${companyProfile.cargoRepresentante ? `${companyProfile.cargoRepresentante}\n` : ''}CPF: ${companyProfile.cpfRepresentante || '[CPF DO REPRESENTANTE]'}
CADASTUR Nº ${companyProfile.cadastur}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(propostaPronta || generateFallbackProposal());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = propostaPronta || generateFallbackProposal();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposta_Dispensa_${trecho.slice(0, 15).replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SESSÃO 01: INTRODUÇÃO & REGRAS DO ART. 75 (TÁTIL ESCURO) */}
      <section className="tactile-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 01 · Compras Diretas & Cotação Expressa
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Radar de Dispensas Eletrônicas (Art. 75, II)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Agilidade para emissão de bilhetes urgentes, hotelaria e assessoria consular na Nova Lei de Licitações.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs tactile-well px-3.5 py-2 border-l-2 border-l-amber-500">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              <strong className="text-amber-300">Prazo Médio de Disputa:</strong> 6 horas a 3 dias úteis
            </span>
          </div>
        </div>

        {/* Quick Rules Box em Cavidades Táteis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 tactile-well flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sky-400">Limites de Dispensa (Art. 75):</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-300 font-mono font-bold">2026</span>
              </div>
              <div className="space-y-1.5 text-slate-300 text-[11px] leading-snug mt-1.5">
                <div className="p-1.5 rounded-lg bg-black/20 border border-white/[0.04]">
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Outras compras e serviços (Turismo / Passagens):</div>
                  <div className="font-mono text-xs font-bold text-white mt-0.5">Até R$ 65.492,11</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/20 border border-white/[0.04]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Obras, engenharia e manutenção de veículos:</div>
                  <div className="font-mono text-xs text-slate-300 mt-0.5">Até R$ 130.984,20</div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-white/[0.06]">
              Atualizado pelo Decreto nº 12.807/2025
            </div>
          </div>
          <div className="p-3.5 tactile-well flex flex-col justify-between">
            <div>
              <span className="font-bold text-emerald-400 block mb-1">Habilitação Descomplicada:</span>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                Exige regularidade fiscal, trabalhista (CNDT, FGTS, Receita) e CADASTUR ativo no Ministério do Turismo.
              </div>
            </div>
            <div className="text-[10px] text-emerald-400/90 mt-2 pt-1 border-t border-white/[0.06] font-medium">
              Rito ágil: sessão de lances em 3 a 5 dias úteis
            </div>
          </div>
          <div className="p-3.5 tactile-well flex flex-col justify-between">
            <div>
              <span className="font-bold text-amber-400 block mb-1">Repasse Neutro de Taxas & DU:</span>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                As taxas da ANAC são valores de repasse puro, não integrando a base de cálculo tributária.
              </div>
            </div>
            <div className="text-[10px] text-amber-400/90 mt-2 pt-1 border-t border-white/[0.06] font-medium">
              Faturamento transparente para a agência
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO 02: SIMULADOR & PROPOSTA EXPRESSA (TEMA TÁTIL) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário de Cotação Rápida */}
        <div className="lg:col-span-5 tactile-card p-6 space-y-4">
          <div className="pb-2 border-b border-white/[0.05]">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 02 · Parâmetros da Cotação
            </span>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-slate-400" />
              <span>Simulador de Proposta Expressa</span>
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Tipo do Objeto / Serviço:
              </label>
              <select
                value={tipoServico}
                onChange={(e) => setTipoServico(e.target.value)}
                className="w-full p-2.5 bg-[#1b2029] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-amber-500/50"
              >
                <option value="Passagens Aéreas Nacionais & Hospedagem">
                  Passagens Aéreas Nacionais & Hospedagem
                </option>
                <option value="Passagens Aéreas Internacionais & Seguro Viagem">
                  Passagens Aéreas Internacionais & Seguro Viagem
                </option>
                <option value="Assessoria Consular de Passaporte e Vistos">
                  Assessoria Consular de Passaporte e Vistos
                </option>
                <option value="Hospedagem Corporativa para Delegação">
                  Hospedagem Corporativa para Delegação
                </option>
                <option value="Intercâmbio e Missão Educacional/Científica">
                  Intercâmbio e Missão Educacional/Científica
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Trecho / Destino da Missão:
              </label>
              <input
                type="text"
                value={trecho}
                onChange={(e) => setTrecho(e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Data Prevista Ida:
                </label>
                <input
                  type="date"
                  value={dataIda}
                  onChange={(e) => setDataIda(e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Data Prevista Volta:
                </label>
                <input
                  type="date"
                  value={dataVolta}
                  onChange={(e) => setDataVolta(e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Nº Passageiros:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numPassageiros}
                  onChange={(e) => setNumPassageiros(e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Tarifa / Bilhete (R$):
                </label>
                <input
                  type="number"
                  step="10"
                  value={valorTarifa}
                  onChange={(e) => setValorTarifa(e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Taxa Agenciamento DU:
                </label>
                <span className="font-mono text-amber-400 font-bold">{taxaDU}%</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={taxaDU}
                onChange={(e) => setTaxaDU(e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono text-xs focus:outline-hidden focus:border-amber-500/50"
              />
            </div>

            {/* Visual Segmented Breakdown Bar */}
            <div className="pt-2">
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#181d25] border border-white/[0.05]">
                <div style={{ width: `${(subtotalTarifas / valorTotalProposta) * 100}%` }} className="bg-sky-500" title="Tarifas" />
                <div style={{ width: `${(totalTaxaDU / valorTotalProposta) * 100}%` }} className="bg-emerald-500" title="Taxa Levivre" />
                <div style={{ width: `${(taxaEmbarqueEstimada / valorTotalProposta) * 100}%` }} className="bg-amber-500" title="Taxas Embarque" />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Bilhetes/Diárias:</span>
                <span>R$ {subtotalTarifas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Taxa Levivre ({percentualTaxa}%):</span>
                <span>R$ {totalTaxaDU.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxas Oficiais de Embarque:</span>
                <span>R$ {taxaEmbarqueEstimada.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-white/[0.06] text-sm">
                <span>Total da Proposta:</span>
                <span className="text-emerald-400 font-mono">R$ {valorTotalProposta.toFixed(2)}</span>
              </div>
            </div>

            {/* Verificação em Tempo Real do Limite Legal de Dispensa (Decreto 12.807/2025) */}
            {valorTotalProposta <= 65492.11 ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Enquadrado no limite de R$ 65.492,11 (Art. 75, II · Dec. 12.807/2025)</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold text-[10px] hidden sm:inline">100% REGULAR</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-between text-[11px]">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Atenção: Excede o teto de R$ 65.492,11 para compras e serviços (Dec. 12.807/2025). Exige Pregão Eletrônico.</span>
                </span>
                <span className="font-mono text-amber-400 font-bold text-[10px] hidden sm:inline">ACIMA DO TETO</span>
              </div>
            )}

            <button
              onClick={handleGenerateQuote}
              className="w-full mt-2 py-3 px-4 tactile-btn-primary font-bold text-white rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gerar Minuta da Proposta</span>
            </button>
          </div>
        </div>

        {/* Visualização da Proposta Formatada */}
        <div className="lg:col-span-7 tactile-card overflow-hidden flex flex-col">
          <div className="p-4 bg-[#1e2430] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Sessão 03 · Proposta Comercial Expressa
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Baixar</span>
              </button>
            </div>
          </div>

          <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap tactile-well flex-1 m-4 min-h-[420px] rounded-xl select-text">
            {propostaPronta || generateFallbackProposal()}
          </div>
        </div>
      </section>
    </div>
  );
};
