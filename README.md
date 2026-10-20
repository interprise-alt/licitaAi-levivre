# LicitaAI Engine — Levivre Viagens

Co-piloto inteligente especialista em Licitações Públicas e Vendas para o Governo sob a **Nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021)**, calibrado para o segmento de turismo corporativo e governamental da **Levivre Viagens**.

---

## 🚀 Funcionalidades Principais

1. **Radar de Editais & Inteligência de Mercado**:
   - Mapeamento e filtragem indexada por nichos de turismo (*Passagens Aéreas, Hotelaria, Passaportes & Vistos, Intercâmbio/Missões, Cruzeiros*).
   - Visualizador do texto oficial do certame com download e cópia imediata.
   - Calculadora de DRE e Lucratividade Líquida em tempo real (dedução de taxas DU, impostos Simples Nacional e custos de emissão OBT/GDS).
2. **Auditoria & Diagnóstico de Editais**:
   - Matriz de Alertas de Risco para cláusulas restritivas ou direcionadas com fundamentação na Lei 14.133/2021.
   - Checklist de habilitação com CADASTUR, CNDT, CRF FGTS, CND Federal e Balanço Patrimonial.
3. **Elaboração de Peças Administrativas**:
   - Minutas jurídicas prontas para Impugnação de Edital (Art. 164), Pedidos de Esclarecimento, Recursos (Art. 165), Contrarrazões e Declarações ME/EPP.
4. **Radar de Dispensas Eletrônicas (Art. 75, II)**:
   - Formulário express de cotação para missões oficiais com cálculo de repasse neutro de taxas de embarque ANAC/Infraero.
5. **Esteira SICAF & Certidões**:
   - Guias e links oficiais para emissão das certidões e conformidade nos 6 níveis do SICAF.
6. **Co-piloto Chat Especialista**:
   - Assistente com inteligência jurídica treinado nos regulamentos e jurisprudência do TCU.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express
- **Inteligência Artificial**: Google GenAI SDK (`@google/genai` - Gemini 2.5)
- **Build & Dev**: Vite, TSX

---

## 📦 Como Rodar Localmente

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/licitaai-levivre.git
   cd licitaai-levivre
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   GEMINI_API_KEY="sua_chave_gemini_aqui"
   PORT=3000
   ```

4. **Iniciar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:3000`

---

## 🌐 Implantação no Render.com

- **Tipo de Serviço**: Web Service
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm run start`
- **Variáveis de Ambiente Necessárias no Render**:
  - `NODE_ENV`: `production`
  - `GEMINI_API_KEY`: *(sua chave do Google AI Studio)*
