import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Info,
  Globe,
  Building,
  Check,
} from 'lucide-react';
import { OFFICIAL_CERTIFICATES, SICAF_LEVELS } from '../data/certidoesData';
import { CertificateItem } from '../types/licitacao';

export const SicafCertidoes: React.FC = () => {
  const [certidoes, setCertidoes] = useState<CertificateItem[]>(OFFICIAL_CERTIFICATES);
  const [activeTab, setActiveTab] = useState<'certidoes' | 'sicaf' | 'portais'>('certidoes');

  const portaisOficiais = [
    {
      nome: 'Compras.gov.br (Antigo Comprasnet)',
      esfera: 'Governo Federal, Autarquias, Universidades e Prefeituras Integradas',
      link: 'https://www.gov.br/compras/pt-br',
      descricao: 'Principal portal de compras públicas do Brasil. Hospeda a maioria das dispensas eletrônicas e pregões federais.',
    },
    {
      nome: 'Portal Nacional de Contratações Públicas (PNCP)',
      esfera: 'Obrigatório por Lei para Todos os Entes da Federação (Lei 14.133/2021)',
      link: 'https://www.gov.br/pncp/pt-br',
      descricao: 'Repositório central oficial de todos os editais, atas de registro de preços e termos de contrato da Nova Lei.',
    },
    {
      nome: 'Licitações-e (Banco do Brasil)',
      esfera: 'Estadual, Municipal e Sociedades de Economia Mista (ex: Petrobras, BB)',
      link: 'https://www.licitacoes-e.com.br/',
      descricao: 'Portal tradicional de compras com alta demanda de agenciamento de viagens corporativas e passagens.',
    },
    {
      nome: 'BLL Compras (Bolsa de Licitações do Brasil)',
      esfera: 'Prefeituras, Câmaras Municipais e Consórcios Públicos',
      link: 'https://bllcompras.com/',
      descricao: 'Portal privado homologado com centenas de pregões de turismo e transporte diários.',
    },
    {
      nome: 'CADASTUR (Ministério do Turismo)',
      esfera: 'Obrigatório para Agências de Viagens (Lei nº 11.771/2008)',
      link: 'https://cadastur.turismo.gov.br/',
      descricao: 'Cadastro de Prestadores de Serviços Turísticos. Documento de habilitação privativo indispensável.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* SESSÃO 01: INTRODUÇÃO & SELETOR DE MÓDULOS (TÁTIL ESCURO) */}
      <section className="tactile-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 01 · Regularidade & Habilitação
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Gestão de Certidões Negativas & Credenciamento SICAF</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Links oficiais de emissão instantânea, controle de validades e esteira dos 6 níveis do SICAF para a <strong className="text-white">Levivre Viagens</strong>.
            </p>
          </div>

          {/* Segmented controls in tactile styling */}
          <div className="flex items-center gap-1.5 p-1 tactile-well rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('certidoes')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'certidoes'
                  ? 'tactile-tab-active font-bold text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Certidões Negativas
            </button>
            <button
              onClick={() => setActiveTab('sicaf')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sicaf'
                  ? 'tactile-tab-active font-bold text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Níveis SICAF (1 a 6)
            </button>
            <button
              onClick={() => setActiveTab('portais')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'portais'
                  ? 'tactile-tab-active font-bold text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Portais Governamentais
            </button>
          </div>
        </div>
      </section>

      {/* SESSÃO 02: ABA 1 - LISTA DE CERTIDÕES NEGATIVAS */}
      {activeTab === 'certidoes' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 02 · Monitoramento das Certidões da Levivre Viagens
            </span>
            <span className="text-xs text-slate-400">
              Todas com emissão gratuita e automatizada
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certidoes.map((cert) => {
              const isValida = cert.status === 'valida';
              const isAlerta = cert.status === 'alerta';

              return (
                <div
                  key={cert.id}
                  className="tactile-card tactile-card-hover p-5 space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isValida
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : isAlerta
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isValida ? 'Regular · Em Dia' : isAlerta ? 'Atenção · Renovar' : 'Vencida'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {cert.esfera}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {cert.nome}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {cert.orgaoEmissor} · {cert.observacao}
                      </p>
                    </div>

                    <a
                      href={cert.linkEmissao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tactile-btn p-2 rounded-xl text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      title="Abrir site oficial do órgão emissor"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                    </a>
                  </div>

                  {/* Informações de Validade */}
                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Validade: <strong className="text-white">{cert.dataValidade || 'Permanente'}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Prazo Padrão: {cert.validadeDiasPadrao} dias
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SESSÃO 03: ABA 2 - ESTEIRA DOS 6 NÍVEIS DO SICAF */}
      {activeTab === 'sicaf' && (
        <section className="space-y-4">
          <div className="px-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 03 · Estrutura Normativa do SICAF (Instrução Normativa SEGES/ME nº 43/2020)
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              O Sistema de Cadastramento Unificado de Fornecedores é dividido em 6 níveis progressivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SICAF_LEVELS.map((nivel) => {
              const isObrigatorio = nivel.obrigatorio;

              return (
                <div
                  key={nivel.nivel}
                  className="tactile-card p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold font-mono text-amber-400">
                        Nível {nivel.nivel}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                          isObrigatorio
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isObrigatorio ? 'Obrigatório Geral' : 'Habilitação Técnica/Econômica'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {nivel.nome}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {nivel.descricao}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
                    <span>Requisito no Compras.gov:</span>
                    <span className="font-semibold text-emerald-400">Ativo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SESSÃO 04: ABA 3 - PORTAIS GOVERNAMENTAIS */}
      {activeTab === 'portais' && (
        <section className="space-y-4">
          <div className="px-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 04 · Principais Portais Eletrônicos de Compras Governamentais
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Portais oficiais onde a Levivre Viagens disputa editais e dispensas eletrônicas diariamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portaisOficiais.map((portal, i) => (
              <div
                key={i}
                className="tactile-card p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      {portal.esfera}
                    </span>
                    <a
                      href={portal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tactile-btn p-1.5 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {portal.nome}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {portal.descricao}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.05] flex justify-end">
                  <a
                    href={portal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactile-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white rounded-xl transition-colors"
                  >
                    <span>Acessar Portal Oficial</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
