import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  Send,
  FileCheck,
  RefreshCw,
  FileDown,
  X,
  Copy,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { OFFICIAL_CERTIFICATES, SICAF_LEVELS, INITIAL_COMPANY_PROFILE } from '../data/certidoesData';
import { CertificateItem, CertificateFileAttachment, CompanyProfile } from '../types/licitacao';
import { generateCertidoesDossiePDF } from '../utils/pdfGenerator';

interface SicafCertidoesProps {
  companyProfile?: CompanyProfile;
}

const STORAGE_KEY = 'licitaai_certidoes_v2';

export const SicafCertidoes: React.FC<SicafCertidoesProps> = ({ companyProfile = INITIAL_COMPANY_PROFILE }) => {
  const [certidoes, setCertidoes] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CertificateItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar certidões salvas:', e);
    }
    return OFFICIAL_CERTIFICATES;
  });

  const [activeTab, setActiveTab] = useState<'certidoes' | 'sicaf' | 'portais'>('certidoes');
  const [filterMode, setFilterMode] = useState<'todas' | 'alertas' | 'com_anexo' | 'sem_anexo'>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modais de suporte
  const [viewingFile, setViewingFile] = useState<{ cert: CertificateItem; attachment: CertificateFileAttachment } | null>(null);
  const [isDossieModalOpen, setIsDossieModalOpen] = useState(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCertDateId, setEditingCertDateId] = useState<string | null>(null);
  const [editingValidadeDate, setEditingValidadeDate] = useState<string>('');
  const [editingEmissaoDate, setEditingEmissaoDate] = useState<string>('');

  // Dados para geração do Dossiê para o Comprador
  const [orgaoDestinatario, setOrgaoDestinatario] = useState('Prefeitura Municipal / Ministério Comprador');
  const [numeroProcesso, setNumeroProcesso] = useState('Dispensa Eletrônica nº 14/2026');
  const [numeroEditalOuDispensa, setNumeroEditalOuDispensa] = useState('Processo Adm. 084/2026');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Formulário para Nova Certidão / Documento
  const [newDocNome, setNewDocNome] = useState('');
  const [newDocOrgao, setNewDocOrgao] = useState('');
  const [newDocEsfera, setNewDocEsfera] = useState<CertificateItem['esfera']>('Federal');
  const [newDocValidade, setNewDocValidade] = useState('');
  const [newDocEmissao, setNewDocEmissao] = useState('');
  const [newDocLink, setNewDocLink] = useState('');
  const [newDocObs, setNewDocObs] = useState('');

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Persistir certidões no LocalStorage sempre que houver alteração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certidoes));
    } catch (e) {
      console.warn('LocalStorage cheio ou inacessível:', e);
    }
  }, [certidoes]);

  // Função para calcular dias restantes e atualizar status dinamicamente
  const calculateDaysRemaining = (validadeDateStr?: string): { days: number | null; status: 'valida' | 'alerta' | 'vencida'; label: string } => {
    if (!validadeDateStr) {
      return { days: null, status: 'valida', label: 'Validade Permanente' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ajustar fuso da data YYYY-MM-DD
    const parts = validadeDateStr.split('-');
    if (parts.length !== 3) {
      return { days: null, status: 'valida', label: validadeDateStr };
    }

    const targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        days: diffDays,
        status: 'vencida',
        label: `Vencida há ${Math.abs(diffDays)} dia${Math.abs(diffDays) === 1 ? '' : 's'}`,
      };
    } else if (diffDays <= 15) {
      return {
        days: diffDays,
        status: 'alerta',
        label: `Vence em ${diffDays} dia${diffDays === 1 ? '' : 's'} (Atenção)`,
      };
    } else {
      return {
        days: diffDays,
        status: 'valida',
        label: `Válida por mais ${diffDays} dias`,
      };
    }
  };

  // Upload de arquivo
  const handleFileUpload = (certId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      setCertidoes((prev) =>
        prev.map((c) => {
          if (c.id === certId) {
            return {
              ...c,
              arquivoAnexo: {
                name: file.name,
                size: file.size,
                type: file.type || 'application/pdf',
                uploadedAt: new Date().toISOString(),
                dataUrl: dataUrl,
              },
            };
          }
          return c;
        })
      );
    };

    reader.readAsDataURL(file);
    // Limpar o input para permitir re-upload do mesmo arquivo se desejado
    event.target.value = '';
  };

  const handleRemoveAttachment = (certId: string) => {
    if (confirm('Deseja realmente remover o arquivo anexado desta certidão?')) {
      setCertidoes((prev) =>
        prev.map((c) => {
          if (c.id === certId) {
            const { arquivoAnexo, ...rest } = c;
            return rest;
          }
          return c;
        })
      );
    }
  };

  // Salvar nova data de validade/emissão
  const handleSaveDate = (certId: string) => {
    const { status } = calculateDaysRemaining(editingValidadeDate);

    setCertidoes((prev) =>
      prev.map((c) => {
        if (c.id === certId) {
          return {
            ...c,
            dataValidade: editingValidadeDate || c.dataValidade,
            dataEmissao: editingEmissaoDate || c.dataEmissao,
            status: status,
          };
        }
        return c;
      })
    );

    setEditingCertDateId(null);
  };

  const startEditDate = (cert: CertificateItem) => {
    setEditingCertDateId(cert.id);
    setEditingValidadeDate(cert.dataValidade || '');
    setEditingEmissaoDate(cert.dataEmissao || '');
  };

  // Adicionar Nova Certidão Personalizada
  const handleAddNewDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNome.trim()) return;

    const { status } = calculateDaysRemaining(newDocValidade);
    const newCert: CertificateItem = {
      id: `custom-${Date.now()}`,
      nome: newDocNome.trim(),
      esfera: newDocEsfera,
      orgaoEmissor: newDocOrgao.trim() || 'Órgão Competente',
      linkEmissao: newDocLink.trim() || 'https://www.gov.br/compras/pt-br',
      nivelSicaf: 4,
      validadeDiasPadrao: 180,
      dataEmissao: newDocEmissao || new Date().toISOString().split('T')[0],
      dataValidade: newDocValidade,
      status: status,
      observacao: newDocObs.trim() || 'Documento complementar de habilitação cadastrado pela Levivre Viagens.',
    };

    setCertidoes((prev) => [newCert, ...prev]);
    setIsAddModalOpen(false);
    // Limpar campos
    setNewDocNome('');
    setNewDocOrgao('');
    setNewDocValidade('');
    setNewDocEmissao('');
    setNewDocLink('');
    setNewDocObs('');
  };

  // Resetar para as certidões oficiais padrão
  const handleResetToDefault = () => {
    if (confirm('Deseja restaurar as certidões oficiais padrão da Levivre Viagens?')) {
      setCertidoes(OFFICIAL_CERTIFICATES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Gerar e Baixar Dossiê em PDF
  const handleDownloadDossie = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = generateCertidoesDossiePDF({
        companyProfile,
        certidoes,
        orgaoDestinatario,
        numeroProcesso,
        numeroEditalOuDispensa,
      });

      const fileName = `Dossie_Certidoes_LevivreViagens_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      setIsDossieModalOpen(false);
    } catch (err) {
      console.error('Erro ao gerar PDF do Dossiê:', err);
      alert('Houve um erro ao compilar o PDF do Dossiê.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Copiar Mensagem de Encaminhamento ao Ente Comprador
  const handleCopyForwardText = () => {
    const text = generateForwardMessageText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const generateForwardMessageText = () => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    let msg = `À COMISSÃO DE CONTRATAÇÃO / PREGOEIRO(A)\n`;
    msg += `REF: ${numeroProcesso} - ${numeroEditalOuDispensa}\n`;
    msg += `INTERESSADO: ${companyProfile.razaoSocial} (CNPJ: ${companyProfile.cnpj})\n\n`;
    msg += `Prezados Senhores,\n\n`;
    msg += `Em cumprimento às exigências de habilitação jurídica, fiscal, trabalhista e qualificação técnica do certame em epígrafe, encaminhamos em anexo a comprovação de regularidade integral da empresa LEVIVRE VIAGENS E TURISMO LTDA:\n\n`;

    certidoes.forEach((c, idx) => {
      const daysInfo = calculateDaysRemaining(c.dataValidade);
      msg += `${idx + 1}. ${c.nome}\n`;
      msg += `   - Órgão Emissor: ${c.orgaoEmissor}\n`;
      msg += `   - Validade: ${c.dataValidade || 'Permanente'} (${daysInfo.label})\n`;
      msg += `   - Situação: ${c.status === 'valida' ? 'REGULAR / EM DIA' : 'REGULAR'}\n`;
      msg += `   - Link de Autenticidade: ${c.linkEmissao}\n\n`;
    });

    msg += `Declaramos, sob as penas da Lei nº 14.133/2021, que inexistem fatos supervenientes impeditivos da nossa habilitação.\n\n`;
    msg += `Atenciosamente,\n`;
    msg += `${companyProfile.representante}\n`;
    msg += `${companyProfile.razaoSocial} · CADASTUR: ${companyProfile.cadastur}\n`;
    msg += `E-mail: ${companyProfile.email} | Tel: ${companyProfile.telefone}\n`;
    msg += `Data: ${dataHoje}\n`;

    return msg;
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent(`Envio de Certidões de Habilitação - ${companyProfile.nomeFantasia} - ${numeroProcesso}`);
    const body = encodeURIComponent(generateForwardMessageText());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Métricas de Monitoramento
  const certidoesCalculadas = certidoes.map((c) => {
    const daysInfo = calculateDaysRemaining(c.dataValidade);
    return {
      ...c,
      daysRemaining: daysInfo.days,
      calculatedStatus: daysInfo.status,
      statusLabel: daysInfo.label,
    };
  });

  const totalCertidoes = certidoesCalculadas.length;
  const totalValidas = certidoesCalculadas.filter((c) => c.calculatedStatus === 'valida').length;
  const totalAlertas = certidoesCalculadas.filter((c) => c.calculatedStatus === 'alerta').length;
  const totalVencidas = certidoesCalculadas.filter((c) => c.calculatedStatus === 'vencida').length;
  const totalComAnexo = certidoesCalculadas.filter((c) => Boolean(c.arquivoAnexo)).length;

  // Filtragem
  const certidoesFiltradas = certidoesCalculadas.filter((c) => {
    const matchesSearch =
      c.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.orgaoEmissor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.esfera.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'alertas') {
      return c.calculatedStatus === 'alerta' || c.calculatedStatus === 'vencida';
    }
    if (filterMode === 'com_anexo') {
      return Boolean(c.arquivoAnexo);
    }
    if (filterMode === 'sem_anexo') {
      return !c.arquivoAnexo;
    }
    return true;
  });

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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* SESSÃO 01: INTRODUÇÃO & SELETOR DE MÓDULOS */}
      <section className="tactile-card p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sessão 01 · Regularidade & Habilitação Oficial
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Gestão de Certidões Negativas & Credenciamento SICAF</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-3xl">
              Upload de certidões em PDF, controle rigoroso de datas de validade com alerta preventivo de vencimento e geração automática do{' '}
              <strong className="text-white">Dossiê Unificado de Habilitação</strong> para envio instantâneo a órgãos compradores.
            </p>
          </div>

          {/* Segmented controls in tactile styling */}
          <div className="flex items-center gap-1.5 p-1 tactile-well rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('certidoes')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'certidoes'
                  ? 'tactile-tab-active font-bold text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Certidões & Documentos
            </button>
            <button
              onClick={() => setActiveTab('sicaf')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'sicaf'
                  ? 'tactile-tab-active font-bold text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Níveis SICAF (1 a 6)
            </button>
            <button
              onClick={() => setActiveTab('portais')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'portais'
                  ? 'tactile-tab-active font-bold text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Portais Governamentais
            </button>
          </div>
        </div>

        {/* BARRA DE AÇÕES ESTATÉGICAS: GERAR DOSSIÊ, ENCAMINHAR E NOVO DOCUMENTO */}
        {activeTab === 'certidoes' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsDossieModalOpen(true)}
                className="tactile-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-lg cursor-pointer transition-all"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>Gerar Dossiê em PDF para o Ente Público</span>
              </button>

              <button
                onClick={() => setIsForwardModalOpen(true)}
                className="tactile-btn flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white rounded-xl cursor-pointer transition-all"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Encaminhar Certidões ao Comprador</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="tactile-btn flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adicionar Documento / Certidão</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleResetToDefault}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Restaura a lista inicial de certidões da Levivre Viagens"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Restaurar Padrão</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SESSÃO 02: PAINEL DE MONITORAMENTO, ALERTAS PREVENTIVOS & CERTIDÕES */}
      {activeTab === 'certidoes' && (
        <section className="space-y-5">
          {/* PAINEL TÁTIL DE CONTROLE DE VALIDADES & ALERTAS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="tactile-card p-3.5 rounded-xl border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total de Documentos
                </span>
                <span className="text-lg font-extrabold text-white">{totalCertidoes}</span>
              </div>
            </div>

            <div className="tactile-card p-3.5 rounded-xl border border-emerald-500/20 flex items-center gap-3 bg-emerald-950/10">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Regulares · Em Dia
                </span>
                <span className="text-lg font-extrabold text-emerald-300">{totalValidas}</span>
              </div>
            </div>

            <div
              className={`tactile-card p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                totalAlertas > 0
                  ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'border-white/[0.06]'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className={`w-4 h-4 ${totalAlertas > 0 ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Vencendo em Breve
                </span>
                <span className="text-lg font-extrabold text-amber-300">
                  {totalAlertas}{' '}
                  <span className="text-[10px] font-normal text-amber-400/80">(&lt; 15 dias)</span>
                </span>
              </div>
            </div>

            <div
              className={`tactile-card p-3.5 rounded-xl border flex items-center gap-3 ${
                totalVencidas > 0
                  ? 'border-rose-500/40 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'border-white/[0.06]'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                  Vencidas
                </span>
                <span className="text-lg font-extrabold text-rose-300">{totalVencidas}</span>
              </div>
            </div>

            <div className="tactile-card p-3.5 rounded-xl border border-white/[0.06] flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  PDFs Anexados
                </span>
                <span className="text-lg font-extrabold text-sky-300">
                  {totalComAnexo} <span className="text-xs text-slate-500">/ {totalCertidoes}</span>
                </span>
              </div>
            </div>
          </div>

          {/* BANNER DINÂMICO DE AVISO PREVENTIVO SE HOUVER CERTIDÕES EXPIRANDO */}
          {totalAlertas > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                  Alerta Preventivo de Regularidade no SICAF & Editais
                </h4>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  Você possui <strong className="text-white underline">{totalAlertas} certidão(ões)</strong> com vencimento nos próximos 15 dias (ex: CRF do FGTS). 
                  Recomendamos clicar no link oficial do órgão emissor para renovação antes da data limite para garantir que propostas e homologações não sejam suspensas pelo Pregoeiro.
                </p>
              </div>
            </div>
          )}

          {/* BARRA DE FILTROS E PESQUISA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por nome da certidão, órgão emissor ou esfera..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tactile-input w-full pl-9 pr-3 py-2 text-xs rounded-xl text-white placeholder-slate-500 bg-[#0c0d10] border border-white/[0.08]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 tactile-well rounded-xl text-xs overflow-x-auto">
              <button
                onClick={() => setFilterMode('todas')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  filterMode === 'todas'
                    ? 'tactile-tab-active font-bold text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({totalCertidoes})
              </button>
              <button
                onClick={() => setFilterMode('alertas')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  filterMode === 'alertas'
                    ? 'tactile-tab-active font-bold text-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vencendo / Vencidas ({totalAlertas + totalVencidas})
              </button>
              <button
                onClick={() => setFilterMode('com_anexo')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  filterMode === 'com_anexo'
                    ? 'tactile-tab-active font-bold text-sky-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Com PDF ({totalComAnexo})
              </button>
              <button
                onClick={() => setFilterMode('sem_anexo')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  filterMode === 'sem_anexo'
                    ? 'tactile-tab-active font-bold text-slate-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sem PDF ({totalCertidoes - totalComAnexo})
              </button>
            </div>
          </div>

          {/* LISTA DE CERTIDÕES EM CARDS TÁTEIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certidoesFiltradas.map((cert) => {
              const isValida = cert.calculatedStatus === 'valida';
              const isAlerta = cert.calculatedStatus === 'alerta';
              const isEditingDate = editingCertDateId === cert.id;
              const hasAttachment = Boolean(cert.arquivoAnexo);

              return (
                <div
                  key={cert.id}
                  className={`tactile-card tactile-card-hover p-5 space-y-4 rounded-2xl border transition-all ${
                    isAlerta
                      ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                      : !isValida
                      ? 'border-rose-500/30'
                      : 'border-white/[0.06]'
                  }`}
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                            isValida
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : isAlerta
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isValida ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Regular · Em Dia
                            </>
                          ) : isAlerta ? (
                            <>
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                              Atenção · Renovar
                            </>
                          ) : (
                            <>
                              <Clock className="w-2.5 h-2.5" />
                              Vencida
                            </>
                          )}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {cert.esfera} · SICAF Nível {cert.nivelSicaf}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {cert.nome}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">{cert.orgaoEmissor}</strong> · {cert.observacao}
                      </p>
                    </div>

                    <a
                      href={cert.linkEmissao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tactile-btn p-2 rounded-xl text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      title="Abrir página oficial de emissão imediata deste órgão"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                    </a>
                  </div>

                  {/* MONITORAMENTO & EDIÇÃO DE VALIDADE */}
                  <div className="p-3 rounded-xl bg-[#0e1014] border border-white/[0.05] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className={`w-3.5 h-3.5 ${isAlerta ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                        <span className="font-medium">
                          Validade:{' '}
                          <strong className={isAlerta ? 'text-amber-300' : isValida ? 'text-white' : 'text-rose-300'}>
                            {cert.dataValidade || 'Permanente'}
                          </strong>
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isValida
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : isAlerta
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-rose-500/15 text-rose-300'
                        }`}
                      >
                        {cert.statusLabel}
                      </span>
                    </div>

                    {isEditingDate ? (
                      <div className="pt-2 border-t border-white/[0.05] space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Data de Emissão:</label>
                            <input
                              type="date"
                              value={editingEmissaoDate}
                              onChange={(e) => setEditingEmissaoDate(e.target.value)}
                              className="tactile-input w-full p-1.5 rounded-lg text-xs text-white bg-[#15181e] border border-white/[0.1]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Data de Validade:</label>
                            <input
                              type="date"
                              value={editingValidadeDate}
                              onChange={(e) => setEditingValidadeDate(e.target.value)}
                              className="tactile-input w-full p-1.5 rounded-lg text-xs text-white bg-[#15181e] border border-white/[0.1]"
                            />
                          </div>
                        </div>

                        {/* Atalhos Rápidos de Validade */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>Atalhos:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 30);
                              setEditingValidadeDate(d.toISOString().split('T')[0]);
                            }}
                            className="px-1.5 py-0.5 bg-white/[0.05] hover:bg-white/[0.1] rounded text-slate-300 cursor-pointer"
                          >
                            +30d
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 90);
                              setEditingValidadeDate(d.toISOString().split('T')[0]);
                            }}
                            className="px-1.5 py-0.5 bg-white/[0.05] hover:bg-white/[0.1] rounded text-slate-300 cursor-pointer"
                          >
                            +90d
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 180);
                              setEditingValidadeDate(d.toISOString().split('T')[0]);
                            }}
                            className="px-1.5 py-0.5 bg-white/[0.05] hover:bg-white/[0.1] rounded text-slate-300 cursor-pointer"
                          >
                            +180d
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setFullYear(d.getFullYear() + 2);
                              setEditingValidadeDate(d.toISOString().split('T')[0]);
                            }}
                            className="px-1.5 py-0.5 bg-white/[0.05] hover:bg-white/[0.1] rounded text-slate-300 cursor-pointer"
                          >
                            +2 anos
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingCertDateId(null)}
                            className="px-2.5 py-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDate(cert.id)}
                            className="tactile-btn-primary px-3 py-1 text-white font-bold rounded-lg cursor-pointer text-xs"
                          >
                            Salvar Validade
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Prazo Padrão: {cert.validadeDiasPadrao} dias</span>
                        <button
                          type="button"
                          onClick={() => startEditDate(cert)}
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer font-medium"
                        >
                          Ajustar Data de Validade
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ÁREA DE UPLOAD E GESTÃO DO ARQUIVO ANEXO (PDF/IMAGEM) */}
                  <div className="pt-1">
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[cert.id] = el)}
                      accept=".pdf,image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(cert.id, e)}
                    />

                    {hasAttachment && cert.arquivoAnexo ? (
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-sky-200 block truncate" title={cert.arquivoAnexo.name}>
                              {cert.arquivoAnexo.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {(cert.arquivoAnexo.size / 1024).toFixed(1)} KB · Anexado em{' '}
                              {new Date(cert.arquivoAnexo.uploadedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingFile({ cert, attachment: cert.arquivoAnexo! })}
                            className="tactile-btn p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                            title="Visualizar documento"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-400" />
                          </button>

                          <a
                            href={cert.arquivoAnexo.dataUrl}
                            download={cert.arquivoAnexo.name}
                            className="tactile-btn p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                            title="Baixar arquivo original"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                          </a>

                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[cert.id]?.click()}
                            className="tactile-btn p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                            title="Substituir por nova via"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(cert.id)}
                            className="tactile-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Remover anexo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[cert.id]?.click()}
                        className="w-full border-2 border-dashed border-white/[0.1] hover:border-amber-400/50 rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-all cursor-pointer bg-[#0c0d10]/40 group"
                      >
                        <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>
                          Fazer upload da <strong className="text-slate-200">Certidão em PDF</strong> ou Imagem
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {certidoesFiltradas.length === 0 && (
            <div className="p-8 text-center text-slate-400 tactile-card rounded-2xl space-y-2">
              <Info className="w-6 h-6 mx-auto text-amber-400" />
              <p className="text-sm font-semibold text-white">Nenhum documento encontrado com os filtros atuais.</p>
              <button
                onClick={() => {
                  setFilterMode('todas');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Limpar filtros e mostrar todas as certidões
              </button>
            </div>
          )}
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
              O Sistema de Cadastramento Unificado de Fornecedores é dividido em 6 níveis progressivos exigidos em pregões e dispensas eletrônicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SICAF_LEVELS.map((nivel) => {
              const isObrigatorio = nivel.obrigatorio;

              return (
                <div
                  key={nivel.nivel}
                  className="tactile-card p-5 space-y-3 flex flex-col justify-between rounded-2xl"
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
                    <span>Requisito Compras.gov:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ativo na Levivre
                    </span>
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
                className="tactile-card p-5 space-y-3 flex flex-col justify-between rounded-2xl"
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

      {/* ========================================================= */}
      {/* MODAL 1: GERAR DOSSIÊ EM PDF PARA O ENTE PÚBLICO COMPRADOR */}
      {/* ========================================================= */}
      {isDossieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="tactile-card w-full max-w-xl p-6 rounded-2xl space-y-5 border border-white/[0.1] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Exportação Oficial · Lei 14.133/2021
                </span>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-emerald-400" />
                  <span>Gerar Dossiê de Regularidade Fiscal em PDF</span>
                </h2>
              </div>
              <button
                onClick={() => setIsDossieModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Este recurso compila todas as {totalCertidoes} certidões com datas de validade, links de autenticação oficial dos órgãos emissores,
              declaração formal de inexistência de fatos impeditivos e cabeçalho timbrado oficial da <strong className="text-white">Levivre Viagens</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Ente Público / Órgão Comprador:
                </label>
                <input
                  type="text"
                  value={orgaoDestinatario}
                  onChange={(e) => setOrgaoDestinatario(e.target.value)}
                  placeholder="Ex: Tribunal Regional Federal da 3ª Região ou Prefeitura de Santos"
                  className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Modalidade / Número do Certame:
                  </label>
                  <input
                    type="text"
                    value={numeroProcesso}
                    onChange={(e) => setNumeroProcesso(e.target.value)}
                    placeholder="Ex: Dispensa Eletrônica nº 28/2026"
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Referência / Processo Administrativo:
                  </label>
                  <input
                    type="text"
                    value={numeroEditalOuDispensa}
                    onChange={(e) => setNumeroEditalOuDispensa(e.target.value)}
                    placeholder="Ex: Proc. SEI 0019284/2026"
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Razão Social:</span>
                  <strong className="text-white">{companyProfile.razaoSocial}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>CNPJ / Enquadramento:</span>
                  <strong className="text-amber-400">{companyProfile.cnpj} ({companyProfile.enquadramento})</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>CADASTUR Ministério do Turismo:</span>
                  <strong className="text-emerald-400">{companyProfile.cadastur}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsDossieModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDownloadDossie}
                disabled={isGeneratingPdf}
                className="tactile-btn-primary px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Compilando Dossiê...' : 'Baixar PDF Imediatamente'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ENCAMINHAMENTO DIRETO AO ENTE PÚBLICO COMPRADOR */}
      {/* ========================================================= */}
      {isForwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="tactile-card w-full max-w-2xl p-6 rounded-2xl space-y-5 border border-white/[0.1] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Comunicação Oficial com Pregoeiro / Comprador
                </span>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-400" />
                  <span>Encaminhar Certidões ao Ente Público</span>
                </h2>
              </div>
              <button
                onClick={() => setIsForwardModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copie a mensagem oficial pré-formatada para colar no chat de negociação do portal (Compras.gov, PNCP, Licitações-e) ou abra diretamente no seu cliente de e-mail.
            </p>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-[#0a0b0d] border border-white/[0.08] text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed select-all">
                {generateForwardMessageText()}
              </pre>

              <button
                onClick={handleCopyForwardText}
                className="absolute top-3 right-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              <button
                onClick={handleDownloadDossie}
                className="tactile-btn flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white rounded-xl cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-emerald-400" />
                <span>Baixar Dossiê em PDF para Anexar</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsForwardModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleOpenMailClient}
                  className="tactile-btn-primary px-4 py-2 text-xs font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir no E-mail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADICIONAR NOVO DOCUMENTO / CERTIDÃO */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddNewDocument}
            className="tactile-card w-full max-w-lg p-6 rounded-2xl space-y-4 border border-white/[0.1] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Cadastro de Documento
                </span>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Adicionar Nova Certidão ou Documento</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Nome do Documento / Certidão: *
                </label>
                <input
                  type="text"
                  required
                  value={newDocNome}
                  onChange={(e) => setNewDocNome(e.target.value)}
                  placeholder="Ex: Atestado de Capacidade Técnica - Viagens Corporativas"
                  className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Órgão / Entidade Emissora:
                  </label>
                  <input
                    type="text"
                    value={newDocOrgao}
                    onChange={(e) => setNewDocOrgao(e.target.value)}
                    placeholder="Ex: Ministério da Defesa ou TJSP"
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Esfera:
                  </label>
                  <select
                    value={newDocEsfera}
                    onChange={(e) => setNewDocEsfera(e.target.value as any)}
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  >
                    <option value="Federal">Federal</option>
                    <option value="Estadual">Estadual</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Trabalhista">Trabalhista</option>
                    <option value="Turismo/Técnico">Turismo/Técnico</option>
                    <option value="Judiciário">Judiciário</option>
                    <option value="Outros">Outros / Atos Societários</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Data de Emissão:
                  </label>
                  <input
                    type="date"
                    value={newDocEmissao}
                    onChange={(e) => setNewDocEmissao(e.target.value)}
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Data de Validade (para monitoramento):
                  </label>
                  <input
                    type="date"
                    value={newDocValidade}
                    onChange={(e) => setNewDocValidade(e.target.value)}
                    className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Link Oficial ou Observações:
                </label>
                <input
                  type="text"
                  value={newDocLink}
                  onChange={(e) => setNewDocLink(e.target.value)}
                  placeholder="https://..."
                  className="tactile-input w-full p-2.5 rounded-xl text-white bg-[#0e1014] border border-white/[0.1]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="tactile-btn-primary px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg cursor-pointer"
              >
                Cadastrar Documento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: VISUALIZADOR DE ARQUIVO (PDF OU IMAGEM) */}
      {/* ========================================================= */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="tactile-card w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col border border-white/[0.1] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#111317]">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {viewingFile.attachment.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Certidão: {viewingFile.cert.nome} · Validade: {viewingFile.cert.dataValidade || 'Permanente'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={viewingFile.attachment.dataUrl}
                  download={viewingFile.attachment.name}
                  className="tactile-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </a>

                <button
                  onClick={() => setViewingFile(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#0b0c0e] p-2 overflow-auto flex items-center justify-center">
              {viewingFile.attachment.type.startsWith('image/') ? (
                <img
                  src={viewingFile.attachment.dataUrl}
                  alt={viewingFile.attachment.name}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : viewingFile.attachment.dataUrl ? (
                <iframe
                  src={viewingFile.attachment.dataUrl}
                  title={viewingFile.attachment.name}
                  className="w-full h-full rounded-lg border border-white/[0.05]"
                />
              ) : (
                <div className="text-slate-400 text-xs">Pré-visualização indisponível.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
