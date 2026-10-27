export interface ClausulaRestritiva {
  clausula: string;
  trecho: string;
  grauRisco: 'alto' | 'medio' | 'baixo';
  fundamentacaoLei14133: string;
  acaoRecomendada: string;
}

export interface ExigenciasHabilitacao {
  juridica: string[];
  fiscalTrabalhista: string[];
  qualificacaoTecnica: {
    cadastur: string;
    atestados: string;
    outros: string[];
  };
  economicoFinanceira: string[];
}

export interface Criterios14Pontos {
  exigenciaMeEpp: boolean | string;
  balancoPatrimonialObrigatorio: boolean;
  indicesFinanceirosMinimos: string;
  vistoriaTecnica: {
    exigida: boolean;
    tipo: 'Não Exigida' | 'Facultativa' | 'Obrigatória (Risco)';
  };
  exigenciaAmostra: boolean;
  atestadosCapacidadeTecnica: string;
  garantiaProposta: boolean;
  capitalSocialMinimo: string;
  subcontratacaoPermitida: boolean;
  prazoImpugnacaoDiasUteis: number;
  prazoEsclarecimentoDiasUteis: number;
  registroCadastralEspecifico: string; // ex: CADASTUR Ministério do Turismo, IATA
  sancaoImpedimentoLocal: boolean;
  valorEstimadoTotal: number;
}

export interface CronogramaPrazosLegais {
  dataSessao: string;
  limiteEsclarecimento: string;
  limiteImpugnacao: string;
  limiteRecurso: string;
  limiteContrarazoes: string;
  statusPrazo: 'no_prazo' | 'urgente' | 'expirado';
  diasUteisRestantes: number;
}

export interface ScoreAderencia {
  classificacao: 'P1_ALTA_RELEVANCIA' | 'P2_MEDIA_RELEVANCIA' | 'DESQUALIFICADO';
  classificacaoLabel: 'P1 · Alta Prioridade' | 'P2 · Média Prioridade' | 'Desqualificado';
  scorePercentual: number;
  justificativaFit: string;
}

export interface SimuladorJulgamento {
  probabilidadeExitoPercentual: number; // ex: 88%
  grauRiscoRejeicao: 'Baixo' | 'Moderado' | 'Alto';
  pontosFortesPeca: string[];
  pontosFracosBlindar: string[];
  pontosBlindados?: string[];
  argumentosProvaveisConcorrente: string[];
  recomendacaoPregoeiro: string;
}

export interface EditalAnalysis {
  id: string;
  numeroEdital: string;
  orgao: string;
  modalidade: string;
  criterioJulgamento: string;
  objeto: string;
  valorEstimado: string;
  dataSessao: string;
  exigenciasHabilitacao: ExigenciasHabilitacao;
  clausulasRestritivas: ClausulaRestritiva[];
  oportunidadesLevivre: string[];
  conclusaoGeral: string;
  rawText?: string;
  portal?: string;
  linkOficial?: string;
  criterios14Pontos?: Criterios14Pontos;
  scoreAderencia?: ScoreAderencia;
  cronogramaPrazos?: CronogramaPrazosLegais;
  simuladorJulgamento?: SimuladorJulgamento;
}

export type TipoDocumento =
  | 'impugnacao'
  | 'esclarecimento'
  | 'recurso'
  | 'contrarazoes'
  | 'declaracao_habilita'
  | 'declaracao_me_epp'
  | 'proposta_comercial';

export interface CompanyProfile {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  cadastur: string;
  iata: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  representante: string;
  cargoRepresentante: string;
  cpfRepresentante: string;
  enquadramento: 'ME' | 'EPP' | 'Demais (Lucro Real / Presumido)';
}

export interface CertificateFileAttachment {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl?: string;
}

export interface CertificateItem {
  id: string;
  nome: string;
  esfera: 'Federal' | 'Estadual' | 'Municipal' | 'Trabalhista' | 'Turismo/Técnico' | 'Judiciário' | 'Outros';
  orgaoEmissor: string;
  linkEmissao: string;
  nivelSicaf: number;
  validadeDiasPadrao: number;
  dataEmissao?: string;
  dataValidade?: string;
  status: 'valida' | 'alerta' | 'vencida';
  observacao: string;
  arquivoAnexo?: CertificateFileAttachment;
  codigoAutenticidade?: string;
}

export type NichoTurismo =
  | 'todos'
  | 'passagens'
  | 'hospedagem'
  | 'vistos_passaportes'
  | 'intercambio'
  | 'cruzeiros_eventos';

export type ModalidadeLicitacao =
  | 'todas'
  | 'dispensa_eletronica'
  | 'pregao_eletronico'
  | 'concorrencia';

export interface FinancialSimulation {
  valorTotalContrato: number;
  taxaAgenciamentoPercentual: number;
  receitaBrutaAgencia: number;
  aliquotaImpostosPercentual: number;
  totalImpostos: number;
  custoEmissaoGdsObt: number;
  prazoPagamentoDias: number;
  custoCapitalGiro: number;
  lucroLiquidoEstimado: number;
  margemLiquidaPercentual: number;
  statusViabilidade: 'alta' | 'moderada' | 'risco';
  parecerViabilidade: string;
}

export type EtapaPipeline =
  | 'triagem'
  | 'auditoria'
  | 'minuta_proposta'
  | 'sessao_disputa'
  | 'homologado';

export interface OpportunityTender {
  id: string;
  numeroEdital: string;
  orgao: string;
  esfera: 'Federal' | 'Estadual' | 'Municipal';
  estadoUf: string;
  cidade: string;
  modalidade: string;
  modalidadeKey: 'dispensa_eletronica' | 'pregao_eletronico' | 'concorrencia';
  criterioJulgamento: string;
  objeto: string;
  objetoResumido: string;
  nicho: 'passagens' | 'hospedagem' | 'vistos_passaportes' | 'intercambio' | 'cruzeiros_eventos';
  nichoLabel: string;
  valorEstimadoNum: number;
  valorEstimadoFormatado: string;
  dataAbertura: string;
  prazoRestante: string;
  prazoUrgente: boolean;
  portal: 'Compras.gov.br' | 'PNCP' | 'Licitações-e (BB)' | 'BLL Compras' | 'BEC-SP' | 'Licitanet' | 'Portal de Compras Públicas' | 'BBMNet';
  uasg?: string;
  linkOficial: string;
  scoreAderenciaLevivre: number; // 0 a 100%
  prioridade: 'P1' | 'P2' | 'Desqualificado';
  destaqueMotivo: string;
  exigenciasPrincipais: string[];
  textoCompletoEdital: string;
  prazoMedioPagamentoDias: number;
  etapaPipeline: EtapaPipeline;
  criterios14Pontos?: Criterios14Pontos;
  cronogramaPrazos?: CronogramaPrazosLegais;
}

export type LuminosityMode = 'mais_claro' | 'balanceado' | 'noturno';
