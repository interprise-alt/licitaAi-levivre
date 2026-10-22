import React, { useState } from 'react';
import { Header } from './components/Header';
import { RadarBuscaEditais } from './components/RadarBuscaEditais';
import { EditalAnalyzer } from './components/EditalAnalyzer';
import { DocumentGenerator } from './components/DocumentGenerator';
import { DispensaRadar } from './components/DispensaRadar';
import { SicafCertidoes } from './components/SicafCertidoes';
import { ChatCoPilot } from './components/ChatCoPilot';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { SAMPLE_EDITAIS } from './data/sampleEditais';
import { INITIAL_COMPANY_PROFILE } from './data/certidoesData';
import { EditalAnalysis, CompanyProfile, TipoDocumento, OpportunityTender } from './types/licitacao';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'analisador' | 'documentos' | 'dispensas' | 'certidoes' | 'chat'>('radar');
  const [currentAnalysis, setCurrentAnalysis] = useState<EditalAnalysis>(SAMPLE_EDITAIS[0]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('licitaai_levivre_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_COMPANY_PROFILE,
          ...parsed,
        };
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_COMPANY_PROFILE;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [initialDraftType, setInitialDraftType] = useState<TipoDocumento>('impugnacao');
  const [initialDraftMotivo, setInitialDraftMotivo] = useState<string>('');

  const handleSaveProfile = (newProfile: CompanyProfile) => {
    setCompanyProfile(newProfile);
    localStorage.setItem('licitaai_levivre_profile', JSON.stringify(newProfile));
  };

  const handleNavigateToDraft = (tipo: string, motivo?: string) => {
    setInitialDraftType((tipo as TipoDocumento) || 'impugnacao');
    setInitialDraftMotivo(motivo || '');
    setActiveTab('documentos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAnalysis = () => {
    setActiveTab('analisador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Conversão de OpportunityTender para EditalAnalysis para transição transparente
  const convertTenderToAnalysis = (tender: OpportunityTender): EditalAnalysis => {
    return {
      id: tender.id,
      numeroEdital: tender.numeroEdital,
      orgao: tender.orgao,
      modalidade: tender.modalidade,
      criterioJulgamento: tender.criterioJulgamento,
      objeto: tender.objeto,
      valorEstimado: tender.valorEstimadoFormatado,
      dataSessao: tender.prazoRestante,
      portal: tender.portal,
      linkOficial: tender.linkOficial,
      exigenciasHabilitacao: {
        juridica: ['Contrato Social em vigor com CNAE de agência de viagens registrado na Junta Comercial.'],
        fiscalTrabalhista: [
          'Prova de Regularidade Fiscal perante a Fazenda Nacional (CND Conjunta com INSS);',
          'Certidão Negativa de Débitos Trabalhistas (CNDT);',
          'Certificado de Regularidade do FGTS (CRF Caixa);',
          'Certidões Negativas das Fazendas Estadual e Municipal.',
        ],
        qualificacaoTecnica: {
          cadastur: 'Certificado de registro regular e válido perante o Ministério do Turismo (CADASTUR).',
          atestados: 'Atestados de capacidade técnica fornecidos por pessoa jurídica comprovando serviços afins.',
          outros: tender.exigenciasPrincipais,
        },
        economicoFinanceira: [
          'Balanço Patrimonial do último exercício social com índices de liquidez adequados.',
          'Certidão Negativa de Falência e Recuperação Judicial.',
        ],
      },
      clausulasRestritivas: [
        {
          clausula: 'Prazo estipulado para envio e homologação de propostas no portal',
          trecho: `Sessão de lances e apresentação: ${tender.prazoRestante}`,
          grauRisco: 'baixo',
          fundamentacaoLei14133: 'Prazo legal conforme os ritos da Lei 14.133/2021.',
          acaoRecomendada: 'Submeter proposta e anexos com antecedência mínima de 1 hora antes da abertura.',
        },
      ],
      oportunidadesLevivre: [
        tender.destaqueMotivo,
        'Enquadramento ME/EPP da Levivre Viagens confere direito de preferência e regularidade postergada.',
      ],
      conclusaoGeral: `Oportunidade classificada com ${tender.scoreAderenciaLevivre}% de aderência para a Levivre Viagens. Edital em andamento no ${tender.portal}.`,
      rawText: tender.textoCompletoEdital,
    };
  };

  // Handler: Usuário clica em "Apresentar Proposta Comercial" no Radar
  const handleSelectTenderForProposal = (tender: OpportunityTender) => {
    const analysis = convertTenderToAnalysis(tender);
    setCurrentAnalysis(analysis);
    setInitialDraftType('proposta_comercial');
    setInitialDraftMotivo(`Proposta Comercial para ${tender.numeroEdital} (${tender.orgao}) no valor estimado de ${tender.valorEstimadoFormatado}.`);
    setActiveTab('documentos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Usuário clica em "Auditar Riscos" no Radar
  const handleSelectTenderForAudit = (tender: OpportunityTender) => {
    const analysis = convertTenderToAnalysis(tender);
    setCurrentAnalysis(analysis);
    setActiveTab('analisador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Usuário clica em "Cotar Dispensa" no Radar
  const handleSelectTenderForDispensa = (tender: OpportunityTender) => {
    const analysis = convertTenderToAnalysis(tender);
    setCurrentAnalysis(analysis);
    setActiveTab('dispensas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#16191f] text-slate-100 flex flex-col font-sans p-2 sm:p-4 lg:p-6 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Chassis Principal com acabamento tátil neumórfico externo (inspirado no UI.jfif) */}
      <div className="tactile-shell max-w-[1540px] w-full mx-auto flex flex-col min-h-[96vh] overflow-hidden border border-white/[0.08]">
        {/* Top Header estritamente remodelado com tema tátil */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setIsProfileOpen(true)}
          onNewAnalysis={handleNewAnalysis}
          companyProfile={companyProfile}
        />

        {/* Barra de Status & Confiança (Cavidade Tátil com Destaques Luminosos) */}
        <div className="bg-[#181d25] border-b border-white/[0.05] text-[11px] text-slate-400 py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1540px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                {companyProfile.nomeFantasia}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>CADASTUR: <strong className="text-slate-300 font-mono">{companyProfile.cadastur}</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-2 py-0.5 rounded-md bg-[#191d24] border border-white/[0.05] text-amber-300 font-medium">
                Enquadramento: {companyProfile.enquadramento}
              </span>
              <span aria-hidden="true" className="text-slate-600 hidden md:inline">·</span>
              <span className="hidden md:inline text-slate-400">Passagens · Hotéis · Cruzeiros · Intercâmbio · Vistos</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-semibold font-mono text-[11px]">SICAF 100% Regular</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">8 certames monitorados</span>
            </div>
          </div>
        </div>

      {/* Main Viewport */}
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {activeTab === 'radar' && (
          <RadarBuscaEditais
            onSelectTenderForProposal={handleSelectTenderForProposal}
            onSelectTenderForAudit={handleSelectTenderForAudit}
            onSelectTenderForDispensa={handleSelectTenderForDispensa}
          />
        )}

        {activeTab === 'analisador' && (
          <EditalAnalyzer
            currentAnalysis={currentAnalysis}
            setCurrentAnalysis={setCurrentAnalysis}
            onNavigateToDraft={handleNavigateToDraft}
          />
        )}

        {activeTab === 'documentos' && (
          <DocumentGenerator
            currentAnalysis={currentAnalysis}
            companyProfile={companyProfile}
            initialType={initialDraftType}
            initialMotivo={initialDraftMotivo}
          />
        )}

        {activeTab === 'dispensas' && (
          <DispensaRadar companyProfile={companyProfile} />
        )}

        {activeTab === 'certidoes' && (
          <SicafCertidoes companyProfile={companyProfile} />
        )}

        {activeTab === 'chat' && (
          <ChatCoPilot
            currentAnalysis={currentAnalysis}
            companyProfile={companyProfile}
          />
        )}
      </main>

        {/* Rodapé Tátil Escuro Refinado */}
        <footer className="bg-[#181d25] border-t border-white/[0.06] mt-auto">
          <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              <strong className="text-slate-200">LICITAÇÃO INTELIGENTE</strong> · Plataforma de Licitações & Contratos Administrativos
            </div>
            <div className="flex items-center gap-3">
              <span>Conformidade com a Lei nº 14.133/2021 & LC 123/2006</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400/90 font-medium">Levivre Viagens e Turismo</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal de Configuração do Perfil */}
      <CompanyProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={companyProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
