import jsPDF from 'jspdf';
import { CertificateItem, CompanyProfile } from '../types/licitacao';

export interface DossieOptions {
  companyProfile: CompanyProfile;
  certidoes: CertificateItem[];
  orgaoDestinatario?: string;
  numeroProcesso?: string;
  numeroEditalOuDispensa?: string;
  incluirObservacoes?: boolean;
}

export const generateCertidoesDossiePDF = (options: DossieOptions): jsPDF => {
  const {
    companyProfile,
    certidoes,
    orgaoDestinatario = 'ÓRGÃO PÚBLICO / ENTE COMPRADOR',
    numeroProcesso = 'Dispensa Eletrônica / Pregão Eletrônico',
    numeroEditalOuDispensa = '2026',
    incluirObservacoes = true,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      drawMiniHeader();
    }
  };

  const drawMiniHeader = () => {
    doc.setFillColor(38, 58, 86); // Azul Marinho Desbotado (Faded Navy)
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(245, 158, 11); // amber-500
    doc.text('LEVIVRE VIAGENS', margin + 3, currentY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(215, 228, 242);
    doc.text(`CNPJ: ${companyProfile.cnpj || '55.109.727/0001-01'} | Dossiê de Habilitação & Regularidade Fiscal`, margin + 38, currentY + 5.5);
    currentY += 12;
  };

  // HEADER PRINCIPAL
  doc.setFillColor(38, 58, 86); // Azul Marinho Desbotado (Faded Navy)
  doc.roundedRect(margin, currentY, contentWidth, 28, 2, 2, 'F');

  // Faixa dourada decorativa
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(margin, currentY, 3, 28, 'F');

  // Título e dados da empresa no cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(companyProfile.razaoSocial || 'LEVIVRE VIAGENS E TURISMO LTDA', margin + 7, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    `CNPJ: ${companyProfile.cnpj || '55.109.727/0001-01'}   ·   CADASTUR: ${companyProfile.cadastur || '19.012.345/0001-90'}   ·   IATA: ${companyProfile.iata || 'BR-960241'}`,
    margin + 7,
    currentY + 13
  );

  doc.text(
    `${companyProfile.endereco || 'Avenida Paulista, nº 1842'} - ${companyProfile.cidade || 'São Paulo'}/${companyProfile.estado || 'SP'}   ·   E-mail: ${companyProfile.email || 'interprise@levivreviagens.com'}`,
    margin + 7,
    currentY + 18
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(245, 158, 11);
  doc.text(
    `ENQUADRAMENTO: ${companyProfile.enquadramento || 'ME / EPP'} (BENEFÍCIO DA LEI COMPLEMENTAR 123/2006 & ART. 4º DA LEI 14.133/2021)`,
    margin + 7,
    currentY + 23.5
  );

  currentY += 33;

  // TÍTULO DO DOSSIÊ
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DOSSIÊ UNIFICADO DE REGULARIDADE FISCAL, TRABALHISTA E QUALIFICAÇÃO TÉCNICA', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Apresentação oficial de certidões e comprovantes para habilitação imediata de fornecedor público.', margin + 4, currentY + 10.5);

  currentY += 18;

  // QUADRO DE DESTINAÇÃO DO PROCESSO
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, contentWidth, 16, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DESTINATÁRIO / PROCESSO LICITATÓRIO:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Ente Comprador / Órgão: ${orgaoDestinatario}`, margin + 4, currentY + 9.5);
  doc.text(`Identificação do Certame: ${numeroProcesso} - Ref: ${numeroEditalOuDispensa}`, margin + 4, currentY + 13.5);

  const dataAtualFormatada = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Emissão deste Dossiê: ${dataAtualFormatada}`, margin + contentWidth - 62, currentY + 5);

  currentY += 21;

  // TABELA DE CERTIDÕES
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. RELAÇÃO DE CERTIDÕES E DOCUMENTOS DE HABILITAÇÃO', margin, currentY);
  currentY += 4;

  certidoes.forEach((cert, index) => {
    checkPageBreak(30);

    const isValida = cert.status === 'valida';
    const isAlerta = cert.status === 'alerta';
    const hasAttachment = Boolean(cert.arquivoAnexo);

    // Box da Certidão
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.roundedRect(margin, currentY, contentWidth, 23, 1, 1, 'FD');

    // Indicador lateral de status (verde / amarelo / vermelho)
    if (isValida) {
      doc.setFillColor(16, 185, 129); // emerald-500
    } else if (isAlerta) {
      doc.setFillColor(245, 158, 11); // amber-500
    } else {
      doc.setFillColor(239, 68, 68); // rose-500
    }
    doc.rect(margin, currentY, 2.5, 23, 'F');

    // Nome da Certidão
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const tituloCortado = doc.splitTextToSize(`${index + 1}. ${cert.nome}`, contentWidth - 45);
    doc.text(tituloCortado[0] || `${index + 1}. ${cert.nome}`, margin + 5, currentY + 5);

    // Badge de Status
    const statusText = isValida ? 'REGULAR / EM DIA' : isAlerta ? 'ATENÇÃO / RENOVAR' : 'VENCIDA';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (isValida) {
      doc.setTextColor(5, 150, 105);
    } else if (isAlerta) {
      doc.setTextColor(217, 119, 6);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(`[ ${statusText} ]`, margin + contentWidth - 40, currentY + 5);

    // Detalhes: Órgão e Esfera
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Órgão Emissor: ${cert.orgaoEmissor}  |  Esfera: ${cert.esfera}  |  Nível SICAF: ${cert.nivelSicaf}`, margin + 5, currentY + 9.5);

    // Validade e Emissão
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(
      `Data de Emissão: ${cert.dataEmissao || 'Oficial'}   |   Validade: ${cert.dataValidade || 'Permanente'}   |   Prazo: ${cert.validadeDiasPadrao} dias`,
      margin + 5,
      currentY + 14
    );

    // Link oficial e indicação de anexo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const linkText = `Verificação Oficial: ${cert.linkEmissao.substring(0, 70)}...`;
    doc.text(linkText, margin + 5, currentY + 18.5);

    if (hasAttachment) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text(`[Anexo Vinculado: ${cert.arquivoAnexo?.name}]`, margin + contentWidth - 62, currentY + 18.5);
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('[Disponível no link oficial]', margin + contentWidth - 45, currentY + 18.5);
    }

    currentY += 25;
  });

  // DECLARAÇÃO LEGAL & FECHAMENTO
  checkPageBreak(45);
  currentY += 3;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 38, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DECLARAÇÃO DE VERACIDADE E CUMPRIMENTO DAS EXIGÊNCIAS HABILITATÓRIAS', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const textoDeclaracao =
    `A empresa ${companyProfile.razaoSocial || 'LEVIVRE VIAGENS E TURISMO LTDA'}, inscrita no CNPJ sob o nº ${companyProfile.cnpj || '55.109.727/0001-01'}, ` +
    `declara sob as penas da Lei nº 14.133/2021 (Nova Lei de Licitações) e do Art. 299 do Código Penal Brasileiro que todos os dados e certidões ` +
    `apresentados neste instrumento correspondem à exata verdade, inexistindo qualquer fato superveniente impeditivo de sua habilitação legal, ` +
    `fiscal, trabalhista e técnica perante o Poder Público.`;
  
  const linhasDeclaracao = doc.splitTextToSize(textoDeclaracao, contentWidth - 8);
  doc.text(linhasDeclaracao, margin + 4, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${companyProfile.cidade || 'Ipatinga'} - ${companyProfile.estado || 'MG'}, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    margin + 4,
    currentY + 28
  );

  doc.text(
    `Representante Legal: ${companyProfile.representante || 'Rocha Romeiro'} (CPF: ${companyProfile.cpfRepresentante || '[CPF DO REPRESENTANTE]'})`,
    margin + 4,
    currentY + 33
  );

  // Rodapé com numeração de páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `LicitaAI Engine · Levivre Viagens · Dossiê Gerado Automaticamente · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc;
};

export interface MinutaPDFOptions {
  docTitle: string;
  documentContent: string;
  companyProfile: CompanyProfile;
  editalData?: any;
}

export const generateMinutaJuridicaPDF = (options: MinutaPDFOptions): jsPDF => {
  const { docTitle, documentContent, companyProfile } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 16;

  const drawHeader = () => {
    // Cabeçalho Timbrado Oficial em Azul Marinho Desbotado
    doc.setFillColor(38, 58, 86); // Azul Marinho Desbotado / Faded Navy
    doc.roundedRect(margin, currentY, contentWidth, 23, 2, 2, 'F');
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(margin, currentY, 3, 23, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(255, 255, 255);
    doc.text(companyProfile.razaoSocial || 'ROCHA ROMEIRO TURISMO LTDA', margin + 6, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(215, 228, 242); // Texto suave azul-gelo
    doc.text(
      `Nome Fantasia: ${companyProfile.nomeFantasia || 'LEVIVRE VIAGENS'}   ·   CNPJ: ${companyProfile.cnpj || '55.109.727/0001-01'}   ·   CADASTUR: ${companyProfile.cadastur || '55.109.727/0001-01'}`,
      margin + 6,
      currentY + 12
    );
    doc.text(
      `${companyProfile.endereco || 'Avenida Carlos Chagas, nº 157, Loja 1'} - ${companyProfile.cidade || 'Ipatinga'}/${companyProfile.estado || 'MG'}   ·   Tel: ${companyProfile.telefone || '31985442403'}`,
      margin + 6,
      currentY + 17.5
    );

    currentY += 28;
  };

  const drawMiniHeader = () => {
    doc.setFillColor(236, 242, 250); // Soft Ice-blue tint
    doc.rect(margin, currentY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(38, 58, 86); // Azul Marinho Desbotado
    doc.text(`${companyProfile.razaoSocial || 'ROCHA ROMEIRO TURISMO LTDA'} · ${docTitle}`, margin + 3, currentY + 4.8);
    currentY += 11;
  };

  drawHeader();

  // Escrever o texto da peça linha a linha
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  const lines = doc.splitTextToSize(documentContent, contentWidth);
  const lineHeight = 5.2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (currentY + lineHeight > pageHeight - 16) {
      doc.addPage();
      currentY = 16;
      drawMiniHeader();
    }

    // Se for cabeçalho de PARTE ou TÍTULO
    if (line.startsWith('PARTE ') || line.startsWith('ILUSTRÍSSIMO') || line.includes('IMPUGNAÇÃO') || line.includes('RECURSO') || line.includes('PEDIDO DE ESCLARECIMENTO')) {
      doc.setFont('helvetica', 'bold');
      if (line.startsWith('PARTE ')) {
        doc.setTextColor(180, 83, 9); // amber-700
        currentY += 1.5;
      } else {
        doc.setTextColor(15, 23, 42);
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
    }

    doc.text(line, margin, currentY);
    currentY += lineHeight;
  }

  // Numeração de páginas no rodapé limpo sem URL do navegador
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Peça Oficial · ${companyProfile.razaoSocial || 'ROCHA ROMEIRO TURISMO LTDA'} · Lei Federal nº 14.133/2021 · Página ${p} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
};
