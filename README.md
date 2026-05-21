# TikTok Race Overlay 🏎️🏇

Este projeto contém overlays interativos para transmissões ao vivo (lives) no TikTok. Nele, os espectadores participam enviando presentes (gifts) ou likes para impulsionar seus corredores favoritos até a linha de chegada.

Atualmente, o projeto suporta dois temas de corrida integrados e com lógicas centralizadas:
1. **Corrida de Fórmula 1** (`f1.html`)
2. **Corrida de Cavalos** (`horses.html`)

## 🛠 Funcionalidades

- **12 Participantes (Baias):** Participantes avançam enviando presentes (cada presente tem custo de 1 coin).
- **Modos de Operação:**
  - `MODO DEMO`: Roda simulações locais contínuas automaticamente, perfeito para testar telas e configurações sem estar em Live.
  - `MODO LIVE`: Conecta-se diretamente ao chat do TikTok para capturar os eventos ao vivo e processá-los na corrida em tempo real.
- **Temas e Personalização:**
  - Alternância entre Dia, Entardecer (Sunset), Noite e Neon.
  - Efeitos de clima e iluminação, como sol, lua e céu estrelado.
  - Opções para desativar áudio.
- **Interatividade:**
  - Cavalos reagem a *Likes*, mostrando uma plateia que torce e solta corações.
  - Carros aceleram quando recebem *Gifts*, emitindo fogo no escapamento.

## 🚀 Como Executar

O overlay pode funcionar conectando-se diretamente ao TikTok via frontend ou se conectando a um pequeno servidor Node.js que transmite os eventos via Socket.io.

### 1. Pré-requisitos
Certifique-se de que possui o [Node.js](https://nodejs.org/) instalado em seu computador para rodar o backend local.

### 2. Iniciando o Servidor Local (Opcional, mas recomendado)
O servidor atua como uma ponte para capturar com mais estabilidade os eventos do TikTok.
No terminal, execute:
```bash
npm install
node server.js
```

### 3. Abrindo os Overlays
Abra os seguintes arquivos diretamente em seu navegador (como Google Chrome ou OBS Studio via Browser Source):
- Para a corrida de carros: abra `f1.html`
- Para a corrida de cavalos: abra `horses.html`

### 4. Configurando a Live
1. No menu flutuante inferior do overlay (Barra Admin), insira seu `@usuario` do TikTok.
2. Clique em **Conectar**.
3. Defina a **Meta** (número de gifts necessários para o carro ou cavalo cruzar a linha de chegada e vencer). O padrão é `1000`.
4. Assim que a live começar a receber interações, os avatares avançarão na pista rumo à linha de chegada!

## ⚙️ Estrutura do Projeto

Para facilitar a manutenção, o projeto foi refatorado e centralizou as engrenagens visuais e lógicas.
- `style/race.css`: O arquivo mestre que dita o CSS geral (cenário, pistas, overlays) com seletores específicos `.f1-race` e `.horse-race` para distinções necessárias.
- `script/race.js`: Motor das corridas em JavaScript, gerenciando os SVGs, cálculos de avanço, efeitos sonoros e chamadas à API.
- `audio/`: Músicas de fundo (`background.mp3`) e efeitos sonoros de vitória (`winner.mp3`).
