import { OpportunityTender } from '../types/licitacao';

export const OPPORTUNITY_TENDERS: OpportunityTender[] = [
  {
    id: 'opp-dispensa-ufct-09',
    numeroEdital: 'Dispensa Eletrônica nº 09/2026',
    orgao: 'Universidade Federal de Ciências e Tecnologia - UFCT',
    esfera: 'Federal',
    estadoUf: 'SP',
    cidade: 'São Paulo',
    modalidade: 'Dispensa Eletrônica (Art. 75, II Lei 14.133/2021)',
    modalidadeKey: 'dispensa_eletronica',
    criterioJulgamento: 'Menor Preço Global',
    objeto: 'Aquisição emergencial de passagens aéreas internacionais de ida e volta, hospedagem e seguro viagem para delegação de 4 pesquisadores em missão acadêmica e intercâmbio científico em Portugal e Espanha.',
    objetoResumido: 'Passagens Internacionais (Europa), Hotelaria e Seguro Viagem para 4 pesquisadores',
    nicho: 'intercambio',
    nichoLabel: 'Intercâmbio & Missões',
    valorEstimadoNum: 48950,
    valorEstimadoFormatado: 'R$ 48.950,00',
    dataAbertura: '2026-10-20T10:00:00',
    prazoRestante: 'Disputa em 2 dias (Lances abertos às 10h)',
    prazoUrgente: true,
    portal: 'Compras.gov.br',
    uasg: '154040',
    linkOficial: 'https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras',
    scoreAderenciaLevivre: 99,
    prioridade: 'P1',
    destaqueMotivo: 'Intercâmbio e voos internacionais constituem especialidade prioritária da Levivre Viagens. Dispensa rápida com baixa burocracia.',
    exigenciasPrincipais: ['CADASTUR ativo', 'CND Federal e Trabalhista', 'Emissão em 48h'],
    prazoMedioPagamentoDias: 20,
    etapaPipeline: 'triagem',
    criterios14Pontos: {
      exigenciaMeEpp: 'Exclusiva para ME/EPP (Art. 4º Lei 14.133/2021)',
      balancoPatrimonialObrigatorio: false,
      indicesFinanceirosMinimos: 'Não exigido (Dispensa Art. 75)',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Atestado simples de agenciamento',
      garantiaProposta: false,
      capitalSocialMinimo: 'Isento',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR (Ministério do Turismo)',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 48950,
    },
    cronogramaPrazos: {
      dataSessao: '20/10/2026 às 10:00h (Horário de Brasília)',
      limiteEsclarecimento: '15/10/2026 às 18:00h',
      limiteImpugnacao: '15/10/2026 às 18:00h',
      limiteRecurso: 'Imediato na sessão + 3 dias úteis',
      limiteContrarazoes: '3 dias úteis após notificação',
      statusPrazo: 'urgente',
      diasUteisRestantes: 2,
    },
    textoCompletoEdital: `MINISTÉRIO DA EDUCAÇÃO
UNIVERSIDADE FEDERAL DE CIÊNCIAS E TECNOLOGIA - UFCT
PRÓ-REITORIA DE ADMINISTRAÇÃO E FINANÇAS
AVISO DE DISPENSA ELETRÔNICA DE LICITAÇÃO Nº 09/2026
PROCESSO ADMINISTRATIVO Nº 23078.001942/2026-88

1. PREÂMBULO
A Universidade Federal de Ciências e Tecnologia torna público que realizará Dispensa Eletrônica de Licitação, com critério de julgamento pelo MENOR PREÇO GLOBAL, com fundamento no Artigo 75, inciso II da Lei Federal nº 14.133/2021, Instrução Normativa SEGES/ME nº 67/2021 e demais legislações aplicáveis.

2. DO OBJETO
Contratação emergencial de agência de turismo especializada para fornecimento de passagens aéreas internacionais de ida e volta (trecho Guarulhos/GRU - Lisboa/LIS - Madri/MAD - Guarulhos/GRU), com franquia de bagagem despachada de até 23kg, seguro viagem internacional com cobertura médico-hospitalar mínima de 30.000 Euros (Tratado de Schengen) e hospedagem para comitiva de 4 (quatro) pesquisadores e docentes em missão de intercâmbio científico.

3. DO VALOR ESTIMADO E DOTAÇÃO ORÇAMENTÁRIA
3.1. O valor global estimado para a presente contratação é de R$ 48.950,00 (quarenta e oito mil, novecentos e cinquenta reais).
3.2. As despesas correrão por conta do Programa de Cooperação Internacional e Mobilidade Acadêmica (Ação 20RK / Fonte 100).

4. DA HABILITAÇÃO
4.1. Inscrição regular no Cadastro Nacional de Pessoas Jurídicas (CNPJ);
4.2. Regularidade com a Fazenda Nacional (Certidão Conjunta PGFN/Receita Federal com INSS);
4.3. Certificado de Regularidade do FGTS (CRF) emitido pela Caixa Econômica Federal;
4.4. Certidão Negativa de Débitos Trabalhistas (CNDT) emitida pela Justiça do Trabalho;
4.5. Certificado de Cadastro de Prestadores de Serviços Turísticos (CADASTUR) no Ministério do Turismo, em vigor, nos termos da Lei nº 11.771/2008.

5. DAS CONDIÇÕES DE FATURAMENTO E PAGAMENTO
5.1. A emissão dos bilhetes e apólices deverá ocorrer no prazo improrrogável de até 48 (quarenta e oito) horas após o recebimento da Nota de Empenho formal.
5.2. O pagamento será efetuado mediante crédito em conta corrente no prazo máximo de 15 a 20 dias úteis após a apresentação da Nota Fiscal Eletrônica e comprovação de emissão dos bilhetes.`,
  },
  {
    id: 'opp-pregao-camara-14',
    numeroEdital: 'Pregão Eletrônico nº 14/2026',
    orgao: 'Câmara Municipal de Grandes Vales',
    esfera: 'Municipal',
    estadoUf: 'SP',
    cidade: 'Grandes Vales',
    modalidade: 'Pregão Eletrônico (Lei nº 14.133/2021)',
    modalidadeKey: 'pregao_eletronico',
    criterioJulgamento: 'Menor Taxa de Transação DU / Maior Desconto',
    objeto: 'Registro de Preços para contratação de agência de turismo para prestação contínua de serviços de agenciamento de viagens, compreendendo reservas, emissão, remarcação e reembolso de passagens aéreas e hotelaria com sistema OBT.',
    objetoResumido: 'Agenciamento Contínuo de Passagens Aéreas Nacionais e Hospedagens com OBT 24/7',
    nicho: 'passagens',
    nichoLabel: 'Passagens Aéreas',
    valorEstimadoNum: 480000,
    valorEstimadoFormatado: 'R$ 480.000,00',
    dataAbertura: '2026-10-28T09:30:00',
    prazoRestante: 'Sessão em 8 dias úteis',
    prazoUrgente: false,
    portal: 'BLL Compras',
    uasg: '925102',
    linkOficial: 'https://bllcompras.com/',
    scoreAderenciaLevivre: 95,
    prioridade: 'P1',
    destaqueMotivo: 'Excelente volume anual. Recomendável impugnar cláusula de exigência de sede física para garantir vitória líquida.',
    exigenciasPrincipais: ['CADASTUR', 'OBT integrado a GDS', 'Atestado de 30%'],
    prazoMedioPagamentoDias: 30,
    etapaPipeline: 'auditoria',
    criterios14Pontos: {
      exigenciaMeEpp: 'Cota de 25% + Desempate ficto 5%',
      balancoPatrimonialObrigatorio: true,
      indicesFinanceirosMinimos: 'ILG, ILC e ISG >= 1,00',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Comprovação de 30% do volume anual (Súmula 263 TCU)',
      garantiaProposta: false,
      capitalSocialMinimo: '10% do valor estimado',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR (Ministério do Turismo)',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 480000,
    },
    cronogramaPrazos: {
      dataSessao: '28/10/2026 às 09:30h (Horário de Brasília)',
      limiteEsclarecimento: '23/10/2026 às 18:00h (3 dias úteis antes)',
      limiteImpugnacao: '23/10/2026 às 18:00h (3 dias úteis antes)',
      limiteRecurso: 'Na própria sessão + 3 dias úteis para razões',
      limiteContrarazoes: '3 dias úteis após intimação de recurso',
      statusPrazo: 'no_prazo',
      diasUteisRestantes: 8,
    },
    textoCompletoEdital: `ESTADO DE SÃO PAULO
CÂMARA MUNICIPAL DE GRANDES VALES
EDITAL DE PREGÃO ELETRÔNICO Nº 14/2026
PROCESSO ADMINISTRATIVO Nº 082/2026

1. DO OBJETO
Constitui objeto da presente licitação o Registro de Preços para eventual contratação de empresa especializada em serviços de agenciamento de viagens corporativas, compreendendo cotação, reserva, emissão, remarcação, cancelamento e reembolso de passagens aéreas nacionais e hospedagem em território nacional, com disponibilização de ferramenta informatizada via web (OBT - Online Booking Tool) e suporte 24 horas por dia, 7 dias por semana.

2. DO VALOR ESTIMADO E REMUNERAÇÃO
2.1. O valor total estimado anual é de R$ 480.000,00 (quatrocentos e oitenta mil reais).
2.2. A remuneração da Contratada se dará pelo pagamento da Taxa de Agenciamento / Transação (DU/RAV) ofertada no certame sobre cada bilhete ou diária emitida.
2.3. As tarifas públicas das companhias aéreas e as taxas de embarque da ANAC serão faturadas pelo seu valor real de aquisição, sem margem ou acréscimo indevido.

3. DA HABILITAÇÃO
3.1. Habilitação Jurídica: Contrato Social registrado com objeto social de agenciamento de viagens;
3.2. Qualificação Técnica: Certificado CADASTUR (Ministério do Turismo) ativo; Atestado de capacidade técnica fornecido por pessoa jurídica comprovando agenciamento de bilhetes e hospedagem;
3.3. Regularidade Fiscal: CND Federal/INSS, CNDT, CRF do FGTS, CND Estadual e CND Municipal;
3.4. Qualificação Econômico-Financeira: Balanço patrimonial com índices contábeis >= 1,00 e Certidão de Falência.

4. DAS CLÁUSULAS ESPECIAIS
Item 9.4.2: A licitante vencedora deverá comprovar no ato de homologação a existência de escritório físico montado com no mínimo 2 atendentes no município de Grandes Vales/SP [CLÁUSULA PASSÍVEL DE IMPUGNAÇÃO PELO LICITAAI].

5. DO PAGAMENTO
Os pagamentos serão efetuados mensalmente, até o 30º (trigésimo) dia corrido subsequente à apresentação da fatura consolidada e relatório analítico de bilhetes emitidos.`,
  },
  {
    id: 'opp-trj-vistos-33',
    numeroEdital: 'Pregão Eletrônico nº 33/2026',
    orgao: 'Tribunal Regional de Justiça - TRJ',
    esfera: 'Estadual',
    estadoUf: 'RJ',
    cidade: 'Rio de Janeiro',
    modalidade: 'Pregão Eletrônico (Lei nº 14.133/2021)',
    modalidadeKey: 'pregao_eletronico',
    criterioJulgamento: 'Maior Desconto Percentual',
    objeto: 'Prestação de serviços contínuos de assessoria consular especializada para obtenção e renovação de passaportes oficiais e vistos consulares, e agenciamento de bilhetes aéreos internacionais para comitivas de magistrados.',
    objetoResumido: 'Assessoria Consular de Vistos e Passaportes + Bilhetes Aéreos Internacionais',
    nicho: 'vistos_passaportes',
    nichoLabel: 'Passaportes & Vistos',
    valorEstimadoNum: 1250000,
    valorEstimadoFormatado: 'R$ 1.250.000,00',
    dataAbertura: '2026-11-12T10:00:00',
    prazoRestante: 'Propostas abertas até 12/11',
    prazoUrgente: false,
    portal: 'Compras.gov.br',
    uasg: '080012',
    linkOficial: 'https://www.gov.br/compras/pt-br',
    scoreAderenciaLevivre: 97,
    prioridade: 'P1',
    destaqueMotivo: 'Serviço de visto/passaporte é diferencial raríssimo no mercado licitatório que a Levivre Viagens domina com excelência.',
    exigenciasPrincipais: ['CADASTUR', 'Experiência comprovada em vistos consulares', 'Patrimônio Líquido 10%'],
    prazoMedioPagamentoDias: 30,
    etapaPipeline: 'minuta_proposta',
    criterios14Pontos: {
      exigenciaMeEpp: 'Ampla concorrência com preferência ficto 5% (Art. 44 LC 123/2006)',
      balancoPatrimonialObrigatorio: true,
      indicesFinanceirosMinimos: 'ILG e ILC >= 1,00',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Atestados de assessoria consular ou agenciamento internacional',
      garantiaProposta: false,
      capitalSocialMinimo: '10% do valor estimado',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR (Ministério do Turismo)',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 1250000,
    },
    cronogramaPrazos: {
      dataSessao: '12/11/2026 às 10:00h (Horário de Brasília)',
      limiteEsclarecimento: '09/11/2026 às 18:00h (3 dias úteis antes)',
      limiteImpugnacao: '09/11/2026 às 18:00h (3 dias úteis antes)',
      limiteRecurso: 'Registro em sessão + 3 dias úteis para razões',
      limiteContrarazoes: '3 dias úteis após notificação',
      statusPrazo: 'no_prazo',
      diasUteisRestantes: 18,
    },
    textoCompletoEdital: `PODER JUDICIÁRIO - TRIBUNAL REGIONAL DE JUSTIÇA
COORDENADORIA DE LOGÍSTICA E CONTRATOS
EDITAL DE PREGÃO ELETRÔNICO Nº 33/2026
PROCESSO Nº TRJ-LIC-2026/0441

1. DO OBJETO
Contratação de pessoa jurídica especializada na prestação de serviços integrados de assessoria consular especializada para obtenção, legalização, apostilamento e renovação de passaportes oficiais e diplomáticos, bem como intermediação de vistos consulares perante consulados estrangeiros, com fornecimento conexo de passagens aéreas internacionais e reservas hoteleiras para membros da magistratura e servidores em eventos oficiais.

2. ESPECIFICAÇÃO DOS SERVIÇOS CONSULARES
2.1. Orientação, preenchimento de formulários oficiais consulares (DS-160 e congêneres);
2.2. Agendamento e gestão de vagas prioritárias no CASV e Consulados;
2.3. Coleta e entrega segura de passaportes e documentos com protocolo rastreável;
2.4. Apoio documental e consultoria para vistos oficiais nos Estados Unidos, União Europeia, Reino Unido, China e demais países.

3. DA HABILITAÇÃO TÉCNICA E CADASTUR
A empresa licitante deverá apresentar Certificado de Regularidade no CADASTUR e atestados comprovando aptidão para prestação de serviços de apoio consular/vistos e agenciamento internacional.

4. DAS CONDIÇÕES DE PAGAMENTO
Faturamento quinzenal com pagamento em até 30 dias após atesto da conformidade documental.`,
  },
  {
    id: 'opp-dispensa-conselho-hospedagem',
    numeroEdital: 'Dispensa Eletrônica nº 18/2026',
    orgao: 'Conselho Regional de Engenharia e Agronomia - CREA',
    esfera: 'Federal',
    estadoUf: 'MG',
    cidade: 'Belo Horizonte',
    modalidade: 'Dispensa Eletrônica (Art. 75, II Lei 14.133/2021)',
    modalidadeKey: 'dispensa_eletronica',
    criterioJulgamento: 'Menor Preço por Diária / Cotação Global',
    objeto: 'Reserva e emissão de diárias de hospedagem em padrão 3 e 4 estrelas na capital e interior para conselheiros e inspetores em semanas de fiscalização institucional.',
    objetoResumido: 'Reservas Hoteleiras e Hospedagem em padrão 3 e 4 estrelas (Belo Horizonte e Interior)',
    nicho: 'hospedagem',
    nichoLabel: 'Hospedagem & Hotéis',
    valorEstimadoNum: 56400,
    valorEstimadoFormatado: 'R$ 56.400,00',
    dataAbertura: '2026-10-22T14:00:00',
    prazoRestante: 'Disputa em 4 dias (Lances às 14h)',
    prazoUrgente: true,
    portal: 'PNCP',
    uasg: '389104',
    linkOficial: 'https://pncp.gov.br/',
    scoreAderenciaLevivre: 98,
    prioridade: 'P1',
    destaqueMotivo: 'Tarifário hoteleiro corporativo da Levivre Viagens permite cotação imbatível e envio imediato.',
    exigenciasPrincipais: ['CADASTUR', 'CNDs regulares no SICAF', 'Rede credenciada ampla'],
    prazoMedioPagamentoDias: 15,
    etapaPipeline: 'sessao_disputa',
    criterios14Pontos: {
      exigenciaMeEpp: 'Exclusiva para ME/EPP',
      balancoPatrimonialObrigatorio: false,
      indicesFinanceirosMinimos: 'Não exigido',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Declaração de rede hoteleira credenciada',
      garantiaProposta: false,
      capitalSocialMinimo: 'Isento',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR (Ministério do Turismo)',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 56400,
    },
    cronogramaPrazos: {
      dataSessao: '22/10/2026 às 14:00h (Horário de Brasília)',
      limiteEsclarecimento: '19/10/2026 às 18:00h',
      limiteImpugnacao: '19/10/2026 às 18:00h',
      limiteRecurso: 'Imediato no encerramento da disputa',
      limiteContrarazoes: '3 dias úteis',
      statusPrazo: 'urgente',
      diasUteisRestantes: 4,
    },
    textoCompletoEdital: `CONSELHO REGIONAL DE ENGENHARIA E AGRONOMIA - CREA/MG
AVISO DE DISPENSA ELETRÔNICA Nº 18/2026 - ART. 75, II DA LEI 14.133/2021

OBJETO: Prestação de serviços de reservas de hotelaria (diárias completas com café da manhã) em padrão 3 e 4 estrelas nas cidades de Belo Horizonte, Juiz de Fora, Uberlândia, Montes Claros e Governador Valadares, para atender conselheiros em missões de fiscalização.

VALOR ESTIMADO: R$ 56.400,00
PAGAMENTO: Em até 15 dias corridos após o checkout e envio de relatório de hospedagem.
HABILITAÇÃO: CADASTUR, CNDT e CND Federal.`,
  },
  {
    id: 'opp-pregao-cruzeiro-congresso',
    numeroEdital: 'Pregão Eletrônico nº 05/2026',
    orgao: 'Fundação de Amparo ao Desenvolvimento Turístico e Científico',
    esfera: 'Estadual',
    estadoUf: 'BA',
    cidade: 'Salvador',
    modalidade: 'Pregão Eletrônico (Lei nº 14.133/2021)',
    modalidadeKey: 'pregao_eletronico',
    criterioJulgamento: 'Menor Preço Global',
    objeto: 'Organização logística, fretamento marítimo/cabines para congresso científico itinerante costeiro com hospedagem a bordo, traslados e passagens aéreas conexas.',
    objetoResumido: 'Congresso Itinerante com Cabines / Cruzeiro Corporativo e Conexões Aéreas',
    nicho: 'cruzeiros_eventos',
    nichoLabel: 'Cruzeiros & Eventos',
    valorEstimadoNum: 890000,
    valorEstimadoFormatado: 'R$ 890.000,00',
    dataAbertura: '2026-11-05T10:30:00',
    prazoRestante: 'Abertura em 15 dias',
    prazoUrgente: false,
    portal: 'Licitações-e (BB)',
    uasg: '982001',
    linkOficial: 'https://www.licitacoes-e.com.br/',
    scoreAderenciaLevivre: 94,
    prioridade: 'P2',
    destaqueMotivo: 'A expertise da Levivre Viagens com cruzeiros e viagens de incentivo confere vantagem competitiva total.',
    exigenciasPrincipais: ['CADASTUR', 'Atestado de eventos/viagens fluviais/marítimas', 'Balanço regular'],
    prazoMedioPagamentoDias: 30,
    etapaPipeline: 'triagem',
    criterios14Pontos: {
      exigenciaMeEpp: 'Ampla disputa com desempate ficto 5%',
      balancoPatrimonialObrigatorio: true,
      indicesFinanceirosMinimos: 'ILG e ILC >= 1,00',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Comprovação prévia de fretamento ou logística de eventos',
      garantiaProposta: false,
      capitalSocialMinimo: '10% do valor estimado',
      subcontratacaoPermitida: true,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR (Ministério do Turismo)',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 890000,
    },
    cronogramaPrazos: {
      dataSessao: '05/11/2026 às 10:30h (Horário de Brasília)',
      limiteEsclarecimento: '02/11/2026 às 18:00h',
      limiteImpugnacao: '02/11/2026 às 18:00h',
      limiteRecurso: '3 dias úteis',
      limiteContrarazoes: '3 dias úteis',
      statusPrazo: 'no_prazo',
      diasUteisRestantes: 14,
    },
    textoCompletoEdital: `GOVERNO DO ESTADO DA BAHIA
FUNDAÇÃO DE AMPARO AO DESENVOLVIMENTO TURÍSTICO E CIENTÍFICO
EDITAL DE PREGÃO ELETRÔNICO Nº 05/2026

OBJETO: Prestação de serviços especializados em logística de viagens, compreendendo fretamento de cabines em navio de cruzeiro de passageiros para realização de Simpósio Internacional de Biologia Marinha na costa brasileira, seguro viagem marítimo, traslados terrestres e conexões aéreas para os palestrantes oficiais.

VALOR TOTAL ESTIMADO: R$ 890.000,00
CONDIÇÕES DE PAGAMENTO: 50% após emissão do voucher de reserva do fretamento e 50% até 30 dias após o término do evento.`,
  },
  {
    id: 'opp-dispensa-aereos-emergencia',
    numeroEdital: 'Dispensa Eletrônica nº 04/2026 (Art. 75, VIII)',
    orgao: 'Secretaria de Estado de Saúde Pública',
    esfera: 'Estadual',
    estadoUf: 'PR',
    cidade: 'Curitiba',
    modalidade: 'Dispensa Eletrônica (Art. 75 Lei 14.133/2021)',
    modalidadeKey: 'dispensa_eletronica',
    criterioJulgamento: 'Menor Taxa de Emissão com Bilhetes a Preço de Custo ANAC',
    objeto: 'Emissão emergencial de 14 trechos aéreos para transporte de equipes médicas especialistas e técnicos de vigilância sanitária em operação regional urgente.',
    objetoResumido: 'Passagens Aéreas Imediatas para Equipes Especialistas (14 trechos)',
    nicho: 'passagens',
    nichoLabel: 'Passagens Aéreas',
    valorEstimadoNum: 28700,
    valorEstimadoFormatado: 'R$ 28.700,00',
    dataAbertura: '2026-10-18T16:00:00',
    prazoRestante: 'URGENTE: Encerra lances em menos de 24 horas',
    prazoUrgente: true,
    portal: 'Compras.gov.br',
    uasg: '761002',
    linkOficial: 'https://www.gov.br/compras/pt-br',
    scoreAderenciaLevivre: 100,
    prioridade: 'P1',
    destaqueMotivo: 'Emissão imediata via plantão 24h. Envio de proposta em 1-clique pelo módulo de Dispensas.',
    exigenciasPrincipais: ['Emissão em até 6h após envio de empenho', 'CADASTUR', 'SICAF nível 3'],
    prazoMedioPagamentoDias: 20,
    etapaPipeline: 'sessao_disputa',
    criterios14Pontos: {
      exigenciaMeEpp: 'Exclusiva ME/EPP',
      balancoPatrimonialObrigatorio: false,
      indicesFinanceirosMinimos: 'Não exigido',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Dispensa de atestado pela pronta entrega',
      garantiaProposta: false,
      capitalSocialMinimo: 'Isento',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 28700,
    },
    cronogramaPrazos: {
      dataSessao: '18/10/2026 às 16:00h (Horário de Brasília)',
      limiteEsclarecimento: 'Encerrado',
      limiteImpugnacao: 'Encerrado',
      limiteRecurso: 'Imediato',
      limiteContrarazoes: '3 dias úteis',
      statusPrazo: 'urgente',
      diasUteisRestantes: 1,
    },
    textoCompletoEdital: `ESTADO DO PARANÁ
SECRETARIA DE ESTADO DE SAÚDE PÚBLICA
DISPENSA ELETRÔNICA Nº 04/2026 - ARTIGO 75 DA LEI 14.133/2021

OBJETO: Aquisição expressa e urgente de 14 (quatorze) trechos aéreos com franquia de bagagem inclusa para mobilização imediata de médicos cirurgiões e epidemiologistas.
PAGAMENTO: Pagamento faturado em 20 dias mediante apresentação da fatura das companhias aéreas e da taxa de serviço.`,
  },
  {
    id: 'opp-pregao-ministerio-gestao',
    numeroEdital: 'Pregão Eletrônico nº 88/2026',
    orgao: 'Ministério do Planejamento e Gestão Governamental',
    esfera: 'Federal',
    estadoUf: 'DF',
    cidade: 'Brasília',
    modalidade: 'Pregão Eletrônico (Lei nº 14.133/2021)',
    modalidadeKey: 'pregao_eletronico',
    criterioJulgamento: 'Maior Percentual de Desconto sobre a Tarifa Pública Registrada',
    objeto: 'Contratação de agência de turismo para prestação de serviços corporativos integrados de gestão de viagens: emissão e cancelamento de passagens nacionais e internacionais, hotelaria, seguro viagem e integração com o SCDP (Sistema de Concessão de Diárias e Passagens).',
    objetoResumido: 'Contrato Integrado Nacional: Passagens, Hotéis e SCDP para Governo Federal',
    nicho: 'passagens',
    nichoLabel: 'Passagens Aéreas',
    valorEstimadoNum: 3400000,
    valorEstimadoFormatado: 'R$ 3.400.000,00',
    dataAbertura: '2026-11-20T09:00:00',
    prazoRestante: 'Propostas até 20 de Novembro',
    prazoUrgente: false,
    portal: 'Compras.gov.br',
    uasg: '200001',
    linkOficial: 'https://www.gov.br/compras/pt-br',
    scoreAderenciaLevivre: 92,
    prioridade: 'P2',
    destaqueMotivo: 'Contrato de porte expressivo. A Levivre Viagens pode disputar isoladamente ou com consórcio.',
    exigenciasPrincipais: ['CADASTUR', 'Atestado de R$ 1.5M emitido nos últimos 3 anos', 'Integração Web Service'],
    prazoMedioPagamentoDias: 30,
    etapaPipeline: 'triagem',
    criterios14Pontos: {
      exigenciaMeEpp: 'Ampla participação com preferência 5%',
      balancoPatrimonialObrigatorio: true,
      indicesFinanceirosMinimos: 'ILG, ILC >= 1,00',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Atestado de R$ 1.5M em serviços contínuos',
      garantiaProposta: true,
      capitalSocialMinimo: '10% do valor estimado',
      subcontratacaoPermitida: true,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 3400000,
    },
    cronogramaPrazos: {
      dataSessao: '20/11/2026 às 09:00h (Horário de Brasília)',
      limiteEsclarecimento: '17/11/2026 às 18:00h',
      limiteImpugnacao: '17/11/2026 às 18:00h',
      limiteRecurso: '3 dias úteis',
      limiteContrarazoes: '3 dias úteis',
      statusPrazo: 'no_prazo',
      diasUteisRestantes: 24,
    },
    textoCompletoEdital: `MINISTÉRIO DA GESTÃO E DA INOVAÇÃO EM SERVIÇOS PÚBLICOS
CENTRAL DE COMPRAS GOVERNAMENTAIS
EDITAL DE PREGÃO ELETRÔNICO Nº 88/2026

OBJETO: Prestação de serviços contínuos de agenciamento de viagens e hotelaria corporativa com integração ao SCDP, englobando reserva, emissão, remarcação, cancelamento e reembolso para órgãos da Administração Pública Federal direta, autárquica e fundacional.

VALOR GLOBAL ESTIMADO: R$ 3.400.000,00 anuais.
CRITÉRIO: Maior percentual de desconto sobre a tabela referencial de tarifas de agenciamento.
PRAZO DE LIQUIDAÇÃO E PAGAMENTO: 30 dias após protocolo do faturamento consolidado.`,
  },
  {
    id: 'opp-dispensa-intercambio-ifsp',
    numeroEdital: 'Dispensa Eletrônica nº 27/2026',
    orgao: 'Instituto Federal de Educação, Ciência e Tecnologia - IFSP',
    esfera: 'Federal',
    estadoUf: 'SP',
    cidade: 'Campinas',
    modalidade: 'Dispensa Eletrônica (Art. 75, II Lei 14.133/2021)',
    modalidadeKey: 'dispensa_eletronica',
    criterioJulgamento: 'Menor Preço Global',
    objeto: 'Contratação de serviços de apoio para viagem de intercâmbio de 6 estudantes medalhistas em olimpíada internacional de robótica para os Estados Unidos (passagens aéreas internacionais, hospedagem estudantil e assessoria para emissão de visto B1/B2 e agendamento consular).',
    objetoResumido: 'Intercâmbio EUA: Passagens Internacionais, Vistos B1/B2 e Hospedagem para 6 estudantes',
    nicho: 'intercambio',
    nichoLabel: 'Intercâmbio & Missões',
    valorEstimadoNum: 54300,
    valorEstimadoFormatado: 'R$ 54.300,00',
    dataAbertura: '2026-10-21T11:00:00',
    prazoRestante: 'Lances em 3 dias úteis',
    prazoUrgente: true,
    portal: 'PNCP',
    uasg: '158154',
    linkOficial: 'https://pncp.gov.br/',
    scoreAderenciaLevivre: 100,
    prioridade: 'P1',
    destaqueMotivo: 'Match perfeito com os serviços de intercâmbio, aéreos e assessoria de visto da Levivre Viagens.',
    exigenciasPrincipais: ['CADASTUR', 'Assessoria para entrevista no Consulado Americano', 'SICAF ativo'],
    prazoMedioPagamentoDias: 20,
    etapaPipeline: 'homologado',
    criterios14Pontos: {
      exigenciaMeEpp: 'Exclusiva ME/EPP',
      balancoPatrimonialObrigatorio: false,
      indicesFinanceirosMinimos: 'Não exigido',
      vistoriaTecnica: { exigida: false, tipo: 'Não Exigida' },
      exigenciaAmostra: false,
      atestadosCapacidadeTecnica: 'Comprovação simples de assessoria/agenciamento',
      garantiaProposta: false,
      capitalSocialMinimo: 'Isento',
      subcontratacaoPermitida: false,
      prazoImpugnacaoDiasUteis: 3,
      prazoEsclarecimentoDiasUteis: 3,
      registroCadastralEspecifico: 'CADASTUR',
      sancaoImpedimentoLocal: false,
      valorEstimadoTotal: 54300,
    },
    cronogramaPrazos: {
      dataSessao: '21/10/2026 às 11:00h (Horário de Brasília)',
      limiteEsclarecimento: '16/10/2026 às 18:00h',
      limiteImpugnacao: '16/10/2026 às 18:00h',
      limiteRecurso: '3 dias úteis',
      limiteContrarazoes: '3 dias úteis',
      statusPrazo: 'urgente',
      diasUteisRestantes: 3,
    },
    textoCompletoEdital: `MINISTÉRIO DA EDUCAÇÃO
INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA - IFSP
DISPENSA ELETRÔNICA Nº 27/2026 (LEI 14.133/2021)

OBJETO: Prestação de serviços de apoio integral a viagens internacionais de intercâmbio e representação acadêmica, compreendendo assessoria completa para emissão de vistos consulares B1/B2 perante o Consulado dos Estados Unidos, 6 bilhetes aéreos de ida e volta (GRU - JFK - GRU), seguro viagem e hospedagem com alimentação para 6 alunos e 1 professor tutor.

VALOR TOTAL ESTIMADO: R$ 54.300,00
PAGAMENTO: Em até 20 dias após emissão dos vouchers e confirmação dos vistos aprovados.`,
  },
];
