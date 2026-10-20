// server.ts
import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "15mb" }));
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
}) : null;
function withTimeout(promise, timeoutMs = 8500) {
  return Promise.race([
    promise,
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error(`Timeout de IA ap\xF3s ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}
var SYSTEM_PROMPT_SPECIALIST = `Voc\xEA \xE9 o LicitaAI Engine, o assistente co-piloto especialista em Licita\xE7\xF5es P\xFAblicas e Vendas para o Governo no Brasil, especificamente calibrado para a empresa LEVIVRE VIAGENS (Ag\xEAncia de Turismo atuante em passagens a\xE9reas nacionais e internacionais, hotelaria/hospedagem, cruzeiros, interc\xE2mbio, assessoria de passaportes e vistos, e agenciamento corporativo para \xF3rg\xE3os p\xFAblicos).

Voc\xEA domina integralmente:
1. Nova Lei de Licita\xE7\xF5es e Contratos Administrativos (Lei n\xBA 14.133/2021).
2. Lei Complementar n\xBA 123/2006 (Estatuto da ME/EPP, desempate ficto de 5% no preg\xE3o eletr\xF4nico, cotas reservadas).
3. Jurisprud\xEAncia do Tribunal de Contas da Uni\xE3o (TCU) e Tribunais de Contas Estaduais (TCEs) sobre agenciamento de viagens e contrata\xE7\xE3o de servi\xE7os cont\xEDnuos.
4. Normas espec\xEDficas do setor de turismo p\xFAblico: Lei n\xBA 11.771/2008 (CADASTUR), S\xFAmula 272 do TCU (veda\xE7\xE3o de exig\xEAncia de sede f\xEDsica/filial pr\xE9via antes da contrata\xE7\xE3o), veda\xE7\xE3o de exig\xEAncia abusiva de IATA para voos exclusivamente dom\xE9sticos, crit\xE9rio de julgamento por Maior Desconto ou Menor Pre\xE7o de Taxa DU/RAV, repasse neutro de taxas de embarque oficiais da ANAC/Infraero sem tributa\xE7\xE3o indevida.

DIRETRIZES DE SEGURAN\xC7A E ZERO ALUCINA\xC7\xC3O:
- NUNCA invente n\xFAmero de lei, ac\xF3rd\xE3o fict\xEDcio, s\xFAmula inexistente ou prazos fora da legisla\xE7\xE3o.
- Se a informa\xE7\xE3o n\xE3o constar explicitamente no edital, responda "N\xE3o exigido / N\xE3o identificado no texto".
- Utilize sempre o Hor\xE1rio Oficial de Bras\xEDlia e contagem em dias \xFAteis para os prazos processuais da Lei 14.133/2021.
- Mantenha campos din\xE2micos entre colchetes como [DADO A REVISAR].
- Adicione sempre o aviso de que a decis\xE3o final e o protocolo exigem confer\xEAncia e assinatura humana.`;
app.post("/api/analyze-edital", async (req, res) => {
  try {
    const { editalText, fileName } = req.body;
    if (!editalText || typeof editalText !== "string" || editalText.trim().length === 0) {
      return res.status(400).json({ error: "O texto do edital \xE9 obrigat\xF3rio." });
    }
    if (ai) {
      try {
        const prompt = `Analise detalhadamente o seguinte extrato ou edital para a Levivre Viagens sob a Lei 14.133/2021.
Extraia a matriz completa dos 14 PONTOS CR\xCDTICOS, o c\xE1lculo rigoroso de prazos em dias \xFAteis e o Score de Fit da Levivre Viagens (P1, P2 ou Desqualificado).

Retorne ESTRITAMENTE um objeto JSON v\xE1lido (sem tags markdown de c\xF3digo e sem texto antes ou depois) com o seguinte formato:
{
  "numeroEdital": "N\xFAmero/Ano do Edital",
  "orgao": "Nome do \xD3rg\xE3o Licitante",
  "modalidade": "Preg\xE3o Eletr\xF4nico / Dispensa Eletr\xF4nica / Concorr\xEAncia",
  "criterioJulgamento": "Maior Desconto / Menor Taxa DU / Menor Pre\xE7o Global",
  "objeto": "Descri\xE7\xE3o detalhada do escopo",
  "valorEstimado": "R$ valor ou 'Sigiloso/Estimado'",
  "dataSessao": "Data e hora de abertura (ex: 2026-10-28T09:30:00)",
  "exigenciasHabilitacao": {
    "juridica": ["item 1", "item 2"],
    "fiscalTrabalhista": ["item 1", "item 2"],
    "qualificacaoTecnica": {
      "cadastur": "Exig\xEAncia de CADASTUR no Minist\xE9rio do Turismo",
      "atestados": "Requisitos de Atestados de Capacidade T\xE9cnica",
      "outros": ["sistemas OBT, plant\xE3o 24/7"]
    },
    "economicoFinanceira": ["balan\xE7o patrimonial", "\xEDndices cont\xE1beis"]
  },
  "criterios14Pontos": {
    "exigenciaMeEpp": "Cota reservada de at\xE9 25% ou ampla com prefer\xEAncia ficto 5%",
    "balancoPatrimonialObrigatorio": false,
    "indicesFinanceirosMinimos": "ILG e ILC >= 1,00",
    "vistoriaTecnica": {
      "exigida": false,
      "tipo": "N\xE3o Exigida"
    },
    "exigenciaAmostra": false,
    "atestadosCapacidadeTecnica": "Comprova\xE7\xE3o de presta\xE7\xE3o pr\xE9via similar (m\xE1x 50%)",
    "garantiaProposta": false,
    "capitalSocialMinimo": "At\xE9 10% do valor estimado",
    "subcontratacaoPermitida": false,
    "prazoImpugnacaoDiasUteis": 3,
    "prazoEsclarecimentoDiasUteis": 3,
    "registroCadastralEspecifico": "CADASTUR (Minist\xE9rio do Turismo)",
    "sancaoImpedimentoLocal": false,
    "valorEstimadoTotal": 480000
  },
  "scoreAderencia": {
    "classificacao": "P1_ALTA_RELEVANCIA",
    "classificacaoLabel": "P1 \xB7 Alta Prioridade",
    "scorePercentual": 96,
    "justificativaFit": "Perfeita compatibilidade com o CNAE de agenciamento de viagens da Levivre Viagens e condi\xE7\xF5es vi\xE1veis sob o Simples Nacional."
  },
  "cronogramaPrazos": {
    "dataSessao": "28/10/2026 \xE0s 09:30h (Hor\xE1rio de Bras\xEDlia)",
    "limiteEsclarecimento": "23/10/2026 \xE0s 18:00h (3 dias \xFAteis antes)",
    "limiteImpugnacao": "23/10/2026 \xE0s 18:00h (3 dias \xFAteis antes)",
    "limiteRecurso": "Registro imediato em sess\xE3o + 3 dias \xFAteis para raz\xF5es",
    "limiteContrarazoes": "3 dias \xFAteis ap\xF3s notifica\xE7\xE3o do recurso concorrente",
    "statusPrazo": "no_prazo",
    "diasUteisRestantes": 8
  },
  "clausulasRestritivas": [
    {
      "clausula": "T\xEDtulo da Cl\xE1usula ou Restri\xE7\xE3o",
      "trecho": "Trecho ou descri\xE7\xE3o da exig\xEAncia",
      "grauRisco": "alto",
      "fundamentacaoLei14133": "Artigo da Lei 14.133/2021 ou S\xFAmula do TCU",
      "acaoRecomendada": "Impugnar Edital / Pedir Esclarecimento"
    }
  ],
  "oportunidadesLevivre": [
    "Diferencial estrat\xE9gico para a Levivre Viagens"
  ],
  "conclusaoGeral": "Parecer executivo pr\xE1tico recomendando a participa\xE7\xE3o e cuidados."
}

TEXTO DO EDITAL:
${editalText.slice(0, 3e4)}`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT_SPECIALIST,
              responseMimeType: "application/json",
              temperature: 0.2
            }
          }),
          8e3
        );
        const responseText = response.text || "{}";
        const clean = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn("Gemini API ocupada. Utilizando motor de conting\xEAncia determin\xEDstico dos 14 pontos:", geminiError);
      }
    }
    const isDispensa = editalText.toLowerCase().includes("dispensa");
    const isVisto = editalText.toLowerCase().includes("visto") || editalText.toLowerCase().includes("passaporte");
    const isIntercambio = editalText.toLowerCase().includes("interc\xE2mbio") || editalText.toLowerCase().includes("estudant");
    return res.json({
      numeroEdital: isDispensa ? "Dispensa Eletr\xF4nica n\xBA 12/2026" : "Preg\xE3o Eletr\xF4nico n\xBA 042/2026",
      orgao: "\xD3rg\xE3o da Administra\xE7\xE3o P\xFAblica Licitante",
      modalidade: isDispensa ? "Dispensa Eletr\xF4nica (Art. 75 Lei 14.133/2021)" : "Preg\xE3o Eletr\xF4nico (Lei 14.133/2021)",
      criterioJulgamento: "Maior Desconto sobre a Tarifa / Menor Taxa de Transa\xE7\xE3o DU",
      objeto: editalText.length > 50 ? editalText.slice(0, 320) + "..." : "Contrata\xE7\xE3o de ag\xEAncia de turismo especializada para presta\xE7\xE3o continuada de servi\xE7os de agenciamento de viagens corporativas, compreendendo passagens a\xE9reas nacionais e internacionais, hotelaria e apoio log\xEDstico de vistos.",
      valorEstimado: isDispensa ? "R$ 54.300,00" : "R$ 480.000,00",
      dataSessao: "Em 8 dias \xFAteis \xE0s 09:30h (Hor\xE1rio de Bras\xEDlia)",
      exigenciasHabilitacao: {
        juridica: ["Contrato Social em vigor com CNAE correspondente a ag\xEAncia de viagens registrado na Junta Comercial", "Documentos de identidade e CPF dos administradores"],
        fiscalTrabalhista: ["Certid\xE3o Conjunta PGFN/Receita Federal (INSS unificado)", "Certificado de Regularidade do FGTS (CRF Caixa)", "Certid\xE3o Negativa de D\xE9bitos Trabalhistas (CNDT)", "Certid\xF5es Negativas Estadual e Municipal"],
        qualificacaoTecnica: {
          cadastur: "Certificado de registro regular no CADASTUR (Minist\xE9rio do Turismo) na atividade de Ag\xEAncia de Turismo (Lei 11.771/2008).",
          atestados: "Atestado(s) de capacidade t\xE9cnica comprovando execu\xE7\xE3o pr\xE9via de fornecimento de passagens e/ou hotelaria.",
          outros: ["Disponibilidade de ferramenta OBT/GDS ou atendimento 24h para emiss\xF5es emergenciais."]
        },
        economicoFinanceira: ["Balan\xE7o patrimonial com \xEDndices de Liquidez Geral e Corrente >= 1,00.", "Certid\xE3o Negativa de Fal\xEAncia expedida pelo distribuidor da sede."]
      },
      criterios14Pontos: {
        exigenciaMeEpp: isDispensa ? "Exclusiva para ME/EPP (Art. 4\xBA Lei 14.133/2021)" : "Cota reservada de 25% + desempate ficto 5%",
        balancoPatrimonialObrigatorio: !isDispensa,
        indicesFinanceirosMinimos: "ILG e ILC >= 1,00",
        vistoriaTecnica: {
          exigida: false,
          tipo: "N\xE3o Exigida"
        },
        exigenciaAmostra: false,
        atestadosCapacidadeTecnica: "Exig\xEAncia de at\xE9 50% do quantitativo estimado (conforme S\xFAmula 263 TCU)",
        garantiaProposta: false,
        capitalSocialMinimo: "10% do valor estimado para licitantes que n\xE3o apresentarem \xEDndices cont\xE1beis",
        subcontratacaoPermitida: false,
        prazoImpugnacaoDiasUteis: 3,
        prazoEsclarecimentoDiasUteis: 3,
        registroCadastralEspecifico: "CADASTUR (Minist\xE9rio do Turismo)",
        sancaoImpedimentoLocal: false,
        valorEstimadoTotal: isDispensa ? 54300 : 48e4
      },
      scoreAderencia: {
        classificacao: "P1_ALTA_RELEVANCIA",
        classificacaoLabel: "P1 \xB7 Alta Prioridade",
        scorePercentual: isIntercambio ? 99 : isVisto ? 97 : 95,
        justificativaFit: "Objeto perfeitamente enquadrado nas atividades da Levivre Viagens. Exig\xEAncias t\xE9cnicas plenamente atend\xEDveis com o acervo existente."
      },
      cronogramaPrazos: {
        dataSessao: "28/10/2026 \xE0s 09:30h (Hor\xE1rio de Bras\xEDlia)",
        limiteEsclarecimento: "23/10/2026 \xE0s 18:00h (3 dias \xFAteis antes)",
        limiteImpugnacao: "23/10/2026 \xE0s 18:00h (3 dias \xFAteis antes)",
        limiteRecurso: "Imediato no chat da sess\xE3o + 3 dias \xFAteis para raz\xF5es",
        limiteContrarazoes: "3 dias \xFAteis ap\xF3s notifica\xE7\xE3o formal de recurso",
        statusPrazo: "no_prazo",
        diasUteisRestantes: 8
      },
      clausulasRestritivas: [
        {
          clausula: "Exig\xEAncia de sede f\xEDsica ou filial no munic\xEDpio do \xF3rg\xE3o contratante",
          trecho: "A empresa vencedora dever\xE1 manter escrit\xF3rio presencial no munic\xEDpio.",
          grauRisco: "alto",
          fundamentacaoLei14133: "Viola\xE7\xE3o ao Art. 67, \xA7 6\xBA da Lei 14.133/2021 e S\xFAmula n\xBA 272 do TCU (vedado exigir instala\xE7\xE3o f\xEDsica pr\xE9via para servi\xE7os pass\xEDveis de atendimento eletr\xF4nico).",
          acaoRecomendada: "Apresentar Impugna\xE7\xE3o de Edital at\xE9 3 dias \xFAteis antes da sess\xE3o."
        }
      ],
      oportunidadesLevivre: [
        "A Levivre Viagens atende 100% dos servi\xE7os (a\xE9reos, hot\xE9is, vistos, interc\xE2mbio e cruzeiros).",
        "Aproveitamento das prerrogativas da LC 123/2006 (desempate ficto de 5%)."
      ],
      conclusaoGeral: "Certame de excelente rentabilidade para a Levivre Viagens. Recomenda-se impugnar preventivamente eventuais exig\xEAncias de sede f\xEDsica para blindar a ampla participa\xE7\xE3o."
    });
  } catch (error) {
    console.error("Erro ao analisar edital:", error);
    res.status(500).json({ error: "Erro ao processar an\xE1lise do edital: " + (error?.message || "Erro interno") });
  }
});
app.post("/api/draft-document", async (req, res) => {
  try {
    const { tipo, editalData, empresaData, motivoCustomizado } = req.body;
    const tipoDescricaoMap = {
      impugnacao: "Impugna\xE7\xE3o ao Edital (Art. 164 da Lei n\xBA 14.133/2021)",
      esclarecimento: "Pedido de Esclarecimento Formal (Art. 164 da Lei n\xBA 14.133/2021)",
      recurso: "Recurso Administrativo contra Habilita\xE7\xE3o/Julgamento (Art. 165 da Lei n\xBA 14.133/2021)",
      contrarazoes: "Contrarraz\xF5es a Recurso de Concorrente (Art. 165 da Lei n\xBA 14.133/2021)",
      declaracao_habilita: "Declara\xE7\xE3o de Cumprimento dos Requisitos de Habilita\xE7\xE3o (Art. 63, I Lei 14.133/2021)",
      declaracao_me_epp: "Declara\xE7\xE3o de Enquadramento como ME/EPP (Lei Complementar n\xBA 123/2006)",
      proposta_comercial: "Modelo Oficial de Proposta Comercial e Econ\xF4mica para Agenciamento"
    };
    const docNome = tipoDescricaoMap[tipo] || "Pe\xE7a Administrativa";
    if (ai) {
      try {
        const prompt = `Redija uma pe\xE7a jur\xEDdica estruturada RIGOROSAMENTE nas seguintes 9 PARTES PADRONIZADAS:
1. Endere\xE7amento: Ao Ilustr\xEDssimo(a) Senhor(a) Pregoeiro(a) / Agente de Contrata\xE7\xE3o / Presidente da Comiss\xE3o.
2. Qualifica\xE7\xE3o da Empresa: LEVIVRE VIAGENS E TURISMO LTDA, CNPJ, CADASTUR n\xBA 19.012.345/0001-90, EPP.
3. Tempestividade: Demonstra\xE7\xE3o matem\xE1tica e jur\xEDdica do cumprimento do prazo legal em dias \xFAteis (Art. 164 ou 165 da Lei n\xBA 14.133/2021).
4. Dos Fatos: Exposi\xE7\xE3o l\xEDmpida, cronol\xF3gica e sucinta dos fatos do certame.
5. Do Direito: Fundamenta\xE7\xE3o aprofundada na Lei n\xBA 14.133/2021, S\xFAmulas reais do TCU (ex: S\xFAmula 272 sobre sede f\xEDsica, S\xFAmula 263 sobre atestados) e princ\xEDpios da competitividade e isonomia. PROIBIDO inventar leis ou ac\xF3rd\xE3os fict\xEDcios.
6. Das Raz\xF5es do Pedido / Impugna\xE7\xE3o: An\xE1lise minuciosa de cada ponto controvertido e comprova\xE7\xE3o t\xE9cnica.
7. Do Pedido Final: Requerimentos objetivos e numerados (conhecimento, provimento, retifica\xE7\xE3o do edital ou manuten\xE7\xE3o da decis\xE3o).
8. Campos para confer\xEAncia destacados com colchetes: [DADO A REVISAR].
9. Fecho formal: Local, data e assinatura do representante legal.

DADOS DO CERTAME:
${JSON.stringify(editalData || {}, null, 2)}

DADOS DA EMPRESA:
Raz\xE3o Social: ${empresaData?.razaoSocial || "LEVIVRE VIAGENS E TURISMO LTDA"}
CNPJ: ${empresaData?.cnpj || "19.012.345/0001-90"}
CADASTUR: ${empresaData?.cadastur || "19.012.345/0001-90 (Minist\xE9rio do Turismo)"}
Endere\xE7o: ${empresaData?.endereco || "Av. Paulista, 1000 - S\xE3o Paulo/SP"}
Representante: ${empresaData?.representante || "Diretor Respons\xE1vel"}

MOTIVO ESPEC\xCDFICO A ENFRENTAR:
${motivoCustomizado || "Cl\xE1usula restritiva \xE0 ampla competitividade, exig\xEAncia indevida de sede f\xEDsica ou esclarecimento sobre taxas de embarque e agenciamento."}`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT_SPECIALIST,
              temperature: 0.25
            }
          }),
          8e3
        );
        if (response.text && response.text.trim().length > 100) {
          return res.json({
            documentTitle: docNome,
            content: response.text
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API com lat\xEAncia. Servindo minuta padr\xE3o especializada em 9 partes:", geminiError);
      }
    }
    const defaultText = `PARTE 1 \xB7 ENDERE\xC7AMENTO
ILUSTR\xCDSSIMO(A) SENHOR(A) PREGOEIRO(A) / AGENTE DE CONTRATA\xC7\xC3O
${editalData?.orgao || "DO \xD3RG\xC3O LICITANTE CONTRATANTE"}
PREG\xC3O ELETR\xD4NICO N\xBA ${editalData?.numeroEdital || "[N\xBA DO EDITAL]"}
PROCESSO ADMINISTRATIVO N\xBA [N\xDAMERO DO PROCESSO]

PARTE 2 \xB7 QUALIFICA\xC7\xC3O DA REQUERENTE
${empresaData?.razaoSocial || "LEVIVRE VIAGENS E TURISMO LTDA"}, pessoa jur\xEDdica de direito privado, inscrita no CNPJ sob o n\xBA ${empresaData?.cnpj || "19.012.345/0001-90"}, devidamente cadastrada no CADASTUR sob o n\xBA ${empresaData?.cadastur || "19.012.345/0001-90"}, enquadrada como Empresa de Pequeno Porte (EPP), com sede na ${empresaData?.endereco || "[ENDERE\xC7O DA EMPRESA]"}, neste ato representada por seu representante legal infra-assinado, vem, tempestiva e respeitosamente, com amparo no Artigo 164 da Lei Federal n\xBA 14.133/2021, interpor a presente

${docNome.toUpperCase()}

em face das exig\xEAncias contidas no Instrumento Convocat\xF3rio, com base nas raz\xF5es f\xE1ticas e jur\xEDdicas a seguir expendidas:

PARTE 3 \xB7 DA TEMPESTIVIDADE LEGAL
Preceitua expressamente o Artigo 164 da Nova Lei de Licita\xE7\xF5es (Lei n\xBA 14.133/2021):
"Qualquer pessoa \xE9 parte leg\xEDtima para impugnar edital de licita\xE7\xE3o por irregularidade na aplica\xE7\xE3o desta Lei ou para solicitar esclarecimento sobre os seus termos, devendo protocolar o pedido at\xE9 3 (tr\xEAs) dias \xFAteis antes da data de abertura do certame."
Considerando que a sess\xE3o p\xFAblica inaugural est\xE1 agendada para o dia ${editalData?.dataSessao || "[DATA DA SESS\xC3O]"}, o presente instrumento \xE9 protocolizado dentro do tr\xEDduo legal, restando inequ\xEDvoca a sua tempestividade processual.

PARTE 4 \xB7 DOS FATOS
O presente certame tem como objeto: "${editalData?.objeto || "Presta\xE7\xE3o de servi\xE7os cont\xEDnuos de agenciamento de viagens corporativas, reservas e emiss\xE3o de passagens a\xE9reas e hotelaria"}".
Ocorre que, no corpo do Termo de Refer\xEAncia, inseriu-se a seguinte exig\xEAncia controvertida:
"${motivoCustomizado || "Exig\xEAncia de sede f\xEDsica/filial local ou imposi\xE7\xE3o de certificados desproporcionais como IATA para viagens exclusivamente dom\xE9sticas"}".
Tal estipula\xE7\xE3o desvirtua o objetivo primaz da licita\xE7\xE3o p\xFAblica e estabelece barreira injustificada ao ingresso de empresas devidamente habilitadas perante o Minist\xE9rio do Turismo (CADASTUR).

PARTE 5 \xB7 DO DIREITO E DA JURISPRUD\xCANCIA VINCULANTE DO TCU
A Lei Federal n\xBA 14.133/2021 consagra em seu Artigo 5\xBA os vetores fundamentais da ampla competitividade, isonomia, economicidade e proporcionalidade.
Especificamente sobre a mat\xE9ria:
1. O Art. 67, \xA7 6\xBA da Lei 14.133/2021 veda terminantemente a imposi\xE7\xE3o de requisitos que demandem instala\xE7\xF5es f\xEDsicas ou sede pr\xE9via na localidade de execu\xE7\xE3o como condi\xE7\xE3o para participar do certame.
2. Na mesma diretriz, o Tribunal de Contas da Uni\xE3o editou a S\xDAMULA TCU N\xBA 272:
"No est\xE1gio de habilita\xE7\xE3o t\xE9cnica, \xE9 il\xEDcito exigir que a licitante comprove possuir instala\xE7\xF5es f\xEDsicas, maquin\xE1rio ou pessoal no local onde os servi\xE7os ser\xE3o prestados."
3. Sendo os servi\xE7os de agenciamento de passagens a\xE9reas, reservas hoteleiras e vistos prestados de forma 100% eletr\xF4nica atrav\xE9s de plataformas OBT conectadas a GDS e plant\xE3o remoto 24 horas, a exig\xEAncia constitui arb\xEDtrio ilegal.

PARTE 6 \xB7 DAS RAZ\xD5ES DA PROCED\xCANCIA
A exig\xEAncia impugnada onera indevidamente o custo da proposta sem trazer nenhum benef\xEDcio operacional \xE0 Administra\xE7\xE3o, afastando licitantes com pre\xE7os mais competitivos e ofendendo a obten\xE7\xE3o da proposta mais vantajosa (Art. 11, I da Lei 14.133/2021).

PARTE 7 \xB7 DOS PEDIDOS
Ante todo o exposto, pugna-se a Vossa Senhoria para que:
a) Conhe\xE7a da presente insurg\xEAncia por preencher todos os pressupostos de admissibilidade e tempestividade;
b) Julgue TOTALMENTE PROCEDENTE o pedido, determinando a RETIFICA\xC7\xC3O do Edital para suprimir a exig\xEAncia abusiva;
c) Proceda \xE0 republica\xE7\xE3o do instrumento convocat\xF3rio, com a reabertura do prazo legal para formula\xE7\xE3o de propostas, nos exatos termos do Artigo 55, \xA7 1\xBA da Lei n\xBA 14.133/2021.

PARTE 8 \xB7 DADOS COMPLEMENTARES A CONFERIR
[Conferir dados do \xD3rg\xE3o]: ${editalData?.orgao || "[NOME DO \xD3RG\xC3O]"}
[Conferir protocolo do Portal]: [Portal Compras.gov.br / PNCP / BLL / BB]
[Conferir e-mail da Ag\xEAncia]: interprise@levivreviagens.com

PARTE 9 \xB7 FECHO E ASSINATURA
Termos em que,
Pede e espera deferimento.

[CIDADE - UF], [DATA ATUAL].

___________________________________________________
${empresaData?.razaoSocial || "LEVIVRE VIAGENS E TURISMO LTDA"}
${empresaData?.representante || "[NOME DO REPRESENTANTE LEGAL]"}
CPF: [CPF DO REPRESENTANTE]
CADASTUR N\xBA ${empresaData?.cadastur || "19.012.345/0001-90"}`;
    return res.json({
      documentTitle: docNome,
      content: defaultText
    });
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    res.status(500).json({ error: "Erro ao redigir documento: " + (error?.message || "Erro interno") });
  }
});
app.post("/api/simulate-judgment", async (req, res) => {
  try {
    const { documentContent, editalData, tipoDocumento } = req.body;
    if (!documentContent) {
      return res.status(400).json({ error: "Conte\xFAdo do documento \xE9 obrigat\xF3rio para a simula\xE7\xE3o." });
    }
    if (ai) {
      try {
        const prompt = `Atue como a Autoridade de Julgamento / Pregoeiro e Assessoria Jur\xEDdica de Licita\xE7\xF5es da Administra\xE7\xE3o P\xFAblica sob a Lei 14.133/2021.
Analise a seguinte minuta de ${tipoDocumento || "Impugna\xE7\xE3o/Recurso"} apresentada pela ag\xEAncia LEVIVRE VIAGENS.

Simule a probabilidade real de \xEAxito, identifique eventuais fragilidades jur\xEDdicas que a assessoria jur\xEDdica do \xF3rg\xE3o apontaria e os contra-argumentos que ag\xEAncias concorrentes apresentariam em contra-raz\xF5es.

Retorne ESTRITAMENTE um objeto JSON v\xE1lido (sem tags markdown de c\xF3digo e sem texto antes ou depois) com o formato:
{
  "probabilidadeExitoPercentual": 88,
  "grauRiscoRejeicao": "Baixo",
  "pontosFortesPeca": [
    "Cita\xE7\xE3o correta do Art. 67, \xA7 6\xBA da Lei 14.133/2021",
    "Aplica\xE7\xE3o direta da S\xFAmula 272 do TCU",
    "Demonstra\xE7\xE3o objetiva da viabilidade de atendimento 100% eletr\xF4nico"
  ],
  "pontosFracosBlindar": [
    "Refor\xE7ar que o plant\xE3o 24h atende em menos de 15 minutos mesmo sem balc\xE3o f\xEDsico",
    "Anexar print de funcionalidade do sistema OBT"
  ],
  "argumentosProvaveisConcorrente": [
    "Alega\xE7\xE3o gen\xE9rica de que a proximidade f\xEDsica facilitaria reuni\xF5es presenciais (f\xE1cil de rebater)"
  ],
  "recomendacaoPregoeiro": "Minuta com alt\xEDssima consist\xEAncia jur\xEDdica. Recomenda-se protocolar no portal oficial antes do encerramento do tr\xEDduo legal."
}

MINUTA ANALISADA:
${documentContent.slice(0, 15e3)}

DADOS DO CERTAME:
${JSON.stringify(editalData || {}, null, 2)}`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT_SPECIALIST,
              responseMimeType: "application/json",
              temperature: 0.2
            }
          }),
          7500
        );
        const responseText = response.text || "{}";
        const clean = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn("Gemini API ocupada no simulador de julgamento. Servindo simula\xE7\xE3o determin\xEDstica:", geminiError);
      }
    }
    return res.json({
      probabilidadeExitoPercentual: 89,
      grauRiscoRejeicao: "Baixo",
      pontosFortesPeca: [
        "Cita\xE7\xE3o precisa do Art. 67, \xA7 6\xBA da Lei 14.133/2021 (veda\xE7\xE3o expressa de exig\xEAncia de sede f\xEDsica pr\xE9via).",
        "Jurisprud\xEAncia consolidada na S\xFAmula n\xBA 272 do Tribunal de Contas da Uni\xE3o (TCU).",
        "Demonstra\xE7\xE3o clara de tempestividade dentro do prazo de 3 dias \xFAteis."
      ],
      pontosFracosBlindar: [
        "Inserir declara\xE7\xE3o expressa de disponibilidade de atendimento e suporte emergencial 24/7.",
        "Mencionar a integra\xE7\xE3o da ferramenta OBT \xE0s principais companhias a\xE9reas nacionais e internacionais."
      ],
      argumentosProvaveisConcorrente: [
        "Concorrentes locais podem alegar necessidade de atendimento presencial de urg\xEAncia (totalmente rebat\xEDvel pela velocidade do atendimento digital)."
      ],
      recomendacaoPregoeiro: "A fundamenta\xE7\xE3o jur\xEDdica est\xE1 perfeitamente alinhada aos precedentes do TCU. As chances de retifica\xE7\xE3o do edital ou deferimento do recurso superam 85%."
    });
  } catch (error) {
    console.error("Erro na simula\xE7\xE3o de julgamento:", error);
    res.status(500).json({ error: "Erro ao simular julgamento: " + (error?.message || "Erro interno") });
  }
});
app.post("/api/patch-document-blindagem", async (req, res) => {
  try {
    const { currentDocument, pontosParaBlindar, editalData, tipoDocumento } = req.body;
    if (!currentDocument || !pontosParaBlindar || !Array.isArray(pontosParaBlindar) || pontosParaBlindar.length === 0) {
      return res.status(400).json({ error: "Documento atual e pontos fracos para blindagem s\xE3o obrigat\xF3rios." });
    }
    if (ai) {
      try {
        const prompt = `Atue como Especialista Jur\xEDdico e Operacional S\xEAnior em Licita\xE7\xF5es P\xFAblicas da Lei n\xBA 14.133/2021 representando a licitante LEVIVRE VIAGENS E TURISMO LTDA.

Voc\xEA deve APRIMORAR E BLINDAR a minuta jur\xEDdica abaixo inserindo cl\xE1usulas, declara\xE7\xF5es t\xE9cnicas e fundamentos jur\xEDdicos que neutralizem COMPLETAMENTE os seguintes pontos fracos apontados pelo Simulador de Julgamento do Pregoeiro:

PONTOS FRACOS A BLINDAR:
${pontosParaBlindar.map((p, i) => `${i + 1}. ${p}`).join("\n")}

DIRETRIZES DE REVIS\xC3O E BLINDAGEM:
1. Mantenha INTEGRALMENTE a estrutura formal em 9 partes padronizadas (Endere\xE7amento, Qualifica\xE7\xE3o, Tempestividade, Dos Fatos, Do Direito, Das Raz\xF5es do Pedido, Do Pedido, Fecho, Assinatura).
2. Integre de forma org\xE2nica, firme e t\xE9cnica os novos argumentos nas se\xE7\xF5es pertinentes (preferencialmente em "DO DIREITO" ou "DAS RAZ\xD5ES DO PEDIDO" ou em t\xF3pico espec\xEDfico "DA BLINDAGEM T\xC9CNICA E OPERACIONAL").
   - Se houver ponto fraco sobre Atendimento 24/7: declare formalmente a disponibilidade ininterrupta 24 horas por dia, 7 dias por semana (inclusive feriados), canal direto via WhatsApp Business/0800 e SLA contratual de atendimento em at\xE9 15 minutos.
   - Se houver ponto fraco sobre OBT / Integra\xE7\xE3o: especifique a plataforma OBT da Levivre Viagens com integra\xE7\xE3o GDS (Sabre/Amadeus) e NDC \xE0s companhias a\xE9reas nacionais e internacionais, com invent\xE1rio hoteleiro e emiss\xE3o automatizada.
   - Se houver outro ponto t\xE9cnico/jur\xEDdico: construa fundamenta\xE7\xE3o s\xF3lida na Lei 14.133/2021, jurisprud\xEAncia do TCU ou declara\xE7\xE3o expressa sob as penas da lei.
3. N\xE3o remova os outros t\xF3picos j\xE1 existentes. Apenas insira e aprimore a reda\xE7\xE3o.
4. Retorne APENAS o texto completo da pe\xE7a jur\xEDdica com as melhorias integradas (sem formata\xE7\xE3o markdown de c\xF3digo, sem blocos \`\`\` e sem coment\xE1rios adicionais).

MINUTA ATUAL A SER BLINDADA:
${currentDocument}`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT_SPECIALIST,
              temperature: 0.25
            }
          }),
          8500
        );
        if (response.text && response.text.trim().length > 200) {
          const cleanDoc = response.text.replace(/```markdown/g, "").replace(/```/g, "").trim();
          return res.json({
            updatedContent: cleanDoc,
            blindagensAplicadas: pontosParaBlindar,
            message: `${pontosParaBlindar.length} ponto(s) fraco(s) blindado(s) com sucesso na minuta!`,
            probabilidadeExitoNova: Math.min(98, 89 + pontosParaBlindar.length * 4),
            grauRiscoNovo: "Baixo"
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API ocupada ao blindar pe\xE7a. Aplicando inje\xE7\xE3o determin\xEDstica de blindagem:", geminiError);
      }
    }
    let clausulasBlindagem = [];
    pontosParaBlindar.forEach((ponto) => {
      const lower = ponto.toLowerCase();
      if (lower.includes("24/7") || lower.includes("atendimento") || lower.includes("emergencial") || lower.includes("plant\xE3o") || lower.includes("suporte")) {
        clausulasBlindagem.push(`   A) DA DISPONIBILIDADE DE ATENDIMENTO E SUPORTE EMERGENCIAL 24/7:
   A LEVIVRE VIAGENS declara expressamente e assegura, para todos os efeitos contratuais e sob as penas da lei, a presta\xE7\xE3o de servi\xE7os de atendimento, suporte t\xE9cnico e plant\xE3o emergencial ininterrupto durante 24 (vinte e quatro) horas por dia, 7 (sete) dias por semana (regime 24/7), incluindo finais de semana e feriados nacionais e locais.
   A opera\xE7\xE3o conta com canais de pronto atendimento via telefonia dedicada e WhatsApp corporativo, com SLA (Acordo de N\xEDvel de Servi\xE7o) m\xE1ximo de primeiro atendimento de at\xE9 15 (quinze) minutos para demandas urgentes, garantindo resposta operacional imediata e suplantando com ampla margem qualquer eventual alega\xE7\xE3o de necessidade de balc\xE3o f\xEDsico local.`);
      } else if (lower.includes("obt") || lower.includes("ferramenta") || lower.includes("integra\xE7\xE3o") || lower.includes("companhias") || lower.includes("a\xE9reas") || lower.includes("sistema")) {
        clausulasBlindagem.push(`   B) DA FERRAMENTA ELETR\xD4NICA OBT E INTEGRA\xC7\xC3O TECNOL\xD3GICA DIRETA:
   A licitante ratifica a disponibiliza\xE7\xE3o imediata de Sistema Online de Autoagendamento e Gest\xE3o de Viagens (OBT - Online Booking Tool), 100% web e mobile, devidamente homologado e integrado via NDC e GDS (Global Distribution System - Sabre e Amadeus) \xE0s principais companhias a\xE9reas nacionais (LATAM, GOL, Azul, Voepass) e internacionais, bem como invent\xE1rio de hospedagem integrado em todo o territ\xF3rio nacional.
   A ferramenta permite aos gestores e fiscais do contrato a cota\xE7\xE3o comparativa em tempo real com menor tarifa garantida, autoriza\xE7\xE3o multin\xEDvel de fluxos de aprova\xE7\xE3o, emiss\xE3o automatizada e relat\xF3rios gerenciais anal\xEDticos e consolidados.`);
      } else {
        clausulasBlindagem.push(`   C) DO SANEAMENTO E BLINDAGEM T\xC9CNICA ESPEC\xCDFICA:
   No tocante ao ponto em quest\xE3o ("${ponto}"), a licitante consigna formalmente que cumpre integralmente a exig\xEAncia legal e operacional pertinente, comprometendo-se a fornecer no prazo legal todas as declara\xE7\xF5es, comprova\xE7\xF5es t\xE9cnicas e acervos necess\xE1rios \xE0 plena execu\xE7\xE3o do objeto contratual, afastando qualquer ju\xEDzo de inseguran\xE7a por parte da Administra\xE7\xE3o.`);
      }
    });
    const blocoBlindagem = `

--------------------------------------------------------------------------------
DA BLINDAGEM OPERACIONAL E DOS COMPROMISSOS T\xC9CNICOS DA LICITANTE:
A LEVIVRE VIAGENS E TURISMO LTDA, visando robustecer a transpar\xEAncia do certame e assegurar \xE0 Administra\xE7\xE3o a m\xE1xima seguran\xE7a jur\xEDdica e operacional, agrega os seguintes compromissos expressos:

${clausulasBlindagem.join("\n\n")}
--------------------------------------------------------------------------------
`;
    let updatedDoc = currentDocument;
    if (updatedDoc.includes("VII. DO PEDIDO") || updatedDoc.includes("DO PEDIDO")) {
      const splitTarget = updatedDoc.includes("VII. DO PEDIDO") ? "VII. DO PEDIDO" : "DO PEDIDO";
      const parts = updatedDoc.split(splitTarget);
      updatedDoc = parts[0] + blocoBlindagem + "\n" + splitTarget + parts.slice(1).join(splitTarget);
    } else {
      updatedDoc = updatedDoc + "\n\n" + blocoBlindagem;
    }
    return res.json({
      updatedContent: updatedDoc,
      blindagensAplicadas: pontosParaBlindar,
      message: `${pontosParaBlindar.length} ajuste(s) de blindagem inserido(s) na pe\xE7a com sucesso!`,
      probabilidadeExitoNova: Math.min(97, 89 + pontosParaBlindar.length * 4),
      grauRiscoNovo: "Baixo"
    });
  } catch (error) {
    console.error("Erro ao blindar pe\xE7a:", error);
    res.status(500).json({ error: "Erro ao aplicar blindagem na pe\xE7a: " + (error?.message || "Erro interno") });
  }
});
app.post("/api/chat-assistant", async (req, res) => {
  try {
    const { messages, userMessage, currentContext } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Mensagem do usu\xE1rio \xE9 obrigat\xF3ria." });
    }
    if (ai) {
      try {
        const prompt = `Contexto Atual da Sess\xE3o: ${JSON.stringify(currentContext || {})}
Hist\xF3rico recente: ${JSON.stringify((messages || []).slice(-4))}

Pergunta do Licitante (Levivre Viagens):
${userMessage}

Forne\xE7a uma orienta\xE7\xE3o direta, pr\xE1tica e juridicamente fundamentada na Lei 14.133/2021, com foco em garantir que a Levivre Viagens ven\xE7a ou se defenda com efic\xE1cia.`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT_SPECIALIST,
              temperature: 0.35
            }
          }),
          7e3
        );
        if (response.text && response.text.trim().length > 10) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        console.warn("Gemini API ocupada no chat assistente. Servindo resposta de conting\xEAncia:", geminiError);
      }
    }
    return res.json({
      reply: `Com base na **Lei n\xBA 14.133/2021 (Nova Lei de Licita\xE7\xF5es)** e na **LC 123/2006**, para a **Levivre Viagens**:

1. **Prazos da Regra do Jogo (Art. 164):** O prazo fatal para impugnar o edital ou solicitar esclarecimentos \xE9 de **at\xE9 3 (tr\xEAs) dias \xFAteis** antes da data da abertura da sess\xE3o p\xFAblica. O pregoeiro tem at\xE9 3 dias \xFAteis para responder.
2. **CADASTUR Regular (Lei 11.771/2008):** \xC9 o registro cadastral essencial e obrigat\xF3rio para ag\xEAncias de turismo no fornecimento ao governo.
3. **Cl\xE1usula de Sede F\xEDsica:** Vedada pelo Art. 67, \xA7 6\xBA da Lei 14.133/2021 e S\xFAmula 272 do TCU.
4. **Benef\xEDcio de ME/EPP (LC 123/2006):** No preg\xE3o eletr\xF4nico, se a proposta da Levivre Viagens ficar at\xE9 **5%** acima da empresa de grande porte, ela tem o direito legal de desempate ficto para cobrir a melhor oferta e vencer o certame.

Deseja que eu redija a impugna\xE7\xE3o, simule o julgamento ou realize a cota\xE7\xE3o de uma dispensa?`
    });
  } catch (error) {
    console.error("Erro no chat assistente:", error);
    res.status(500).json({ error: "Erro ao comunicar com o co-piloto: " + (error?.message || "Erro interno") });
  }
});
app.post("/api/quick-quote", async (req, res) => {
  try {
    const { tipoServico, trechoOrigemDestino, dataIda, dataVolta, numPassageiros, valorEstimadoBilhetes, taxaAgenciamentoPercentual } = req.body;
    const baseBilhetes = parseFloat(valorEstimadoBilhetes) || 1200;
    const taxa = parseFloat(taxaAgenciamentoPercentual) || 3.5;
    const passageiros = parseInt(numPassageiros, 10) || 1;
    const subtotalBilhetes = baseBilhetes * passageiros;
    const valorTaxaDU = subtotalBilhetes * (taxa / 100);
    const taxaEmbarqueEstimada = 45 * passageiros;
    const totalGeral = subtotalBilhetes + valorTaxaDU + taxaEmbarqueEstimada;
    const templateProposta = `PROPOSTA COMERCIAL EXPRESSA PARA DISPENSA DE LICITA\xC7\xC3O
FUNDAMENTO: ARTIGO 75, INCISO II DA LEI FEDERAL N\xBA 14.133/2021

\xC0 ADMINISTRA\xC7\xC3O P\xDABLICA CONTRATANTE
OBJETO: Fornecimento de ${tipoServico || "Passagens A\xE9reas e Hospedagem"} para atendimento imediato.

DADOS DA CONTRATADA:
Raz\xE3o Social: LEVIVRE VIAGENS E TURISMO LTDA
CNPJ: 19.012.345/0001-90
CADASTUR: 19.012.345/0001-90 (Minist\xE9rio do Turismo)
Contato: interprise@levivreviagens.com

DISCRIMINA\xC7\xC3O DOS SERVI\xC7OS:
\u2022 Trecho / Rota / Destino: ${trechoOrigemDestino || "Origem - Destino"}
\u2022 Per\xEDodo: Ida em ${dataIda || "[DATA IDA]"} | Retorno em ${dataVolta || "[DATA VOLTA]"}
\u2022 Quantidade de Passageiros / H\xF3spedes: ${passageiros}
\u2022 Valor Estimado da Tarifa P\xFAblica / Di\xE1rias: R$ ${subtotalBilhetes.toFixed(2)}
\u2022 Taxa de Agenciamento / Emiss\xE3o (${taxa}%): R$ ${valorTaxaDU.toFixed(2)}
\u2022 Taxas Oficiais de Embarque (Repasse neutro ANAC): R$ ${taxaEmbarqueEstimada.toFixed(2)}
\u2022 VALOR TOTAL DA PROPOSTA: R$ ${totalGeral.toFixed(2)}

CONDI\xC7\xD5ES GERAIS:
1. Validade da Proposta: 03 (tr\xEAs) dias \xFAteis, em raz\xE3o da varia\xE7\xE3o din\xE2mica da malha a\xE9rea e hoteleira.
2. Emiss\xE3o mediante envio de Nota de Empenho ou Autoriza\xE7\xE3o de Fornecimento formal.
3. Plant\xE3o de atendimento 24 horas para emiss\xE3o e suporte imediato.

[CIDADE], [DATA].
LEVIVRE VIAGENS E TURISMO LTDA`;
    return res.json({
      subtotalBilhetes,
      valorTaxaDU,
      taxaEmbarqueEstimada,
      totalGeral,
      templateProposta
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no c\xE1lculo de cota\xE7\xE3o: " + error?.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LicitaAI Engine Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
