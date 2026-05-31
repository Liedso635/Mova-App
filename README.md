🚗 Mova-App – Plataforma de Mobilidade Urbana

📌 Sobre o Projeto

O **Mova-App** é uma aplicação web desenvolvida em **React** com **Vite** e **TanStack Router**, concebida para simular uma plataforma de mobilidade urbana que conecta **motoristas** e **passageiros**. O projeto foi realizado no âmbito da cadeira de **Algoritmos e Estruturas de Dados II**, com o objetivo de aplicar conceitos de estruturas de dados, algoritmos de roteamento e visualização interactiva.

A aplicação permite que os utilizadores alternem entre diferentes modos (passageiro/motorista), visualizem um mapa de fundo animado, façam login (simulado) e acedam a dashboards personalizados.

✨ Funcionalidades Principais

- **Selector de Perfil**: Escolha entre entrar como **Passageiro** ou **Motorista**.
- **Autenticação Simulada**: Tela de login com campos de email e palavra-passe (frontend).
- **Dashboards Diferenciados**:
  - Passageiro: visualização de rotas, solicitação de viagens.
  - Motorista: gestão de viagens, aceitação de corridas.
- **Mapa Interactivo**: Fundo com animação de transição 2D/3D (vídeo ou mapa estático).
- **Design Responsivo**: Interface adaptada a diferentes tamanhos de ecrã.
- **Componentes UI Reutilizáveis**: Baseados em shadcn/ui (botões, cards, modais, etc.).
- **Roteamento Eficiente**: Com TanStack Router (type-safe).

🛠️ Tecnologias Utilizadas

- **React 18** – Biblioteca para interfaces de utilizador.
- **Vite** – Build tool e servidor de desenvolvimento rápido.
- **TanStack Router** – Roteamento declarativo e type-safe.
- **TypeScript** – Tipagem estática para maior robustez.
- **Tailwind CSS** – Estilização utilitária.
- **shadcn/ui** – Componentes acessíveis e personalizáveis.
- **ESLint + Prettier** – Linting e formatação de código.
- **Bun / npm** – Gestão de pacotes (compatível com ambos).

 📁 Estrutura do Projecto
Mova-App/
├── public/
│ ├── videos/
│ │ └── mapa-transicao-2d-3d.mp4 # Fundo animado
│ └── images/
│ └── export.svg
├── src/
│ ├── components/
│ │ ├── mova/ # Componentes específicos da app
│ │ │ ├── AuthView.tsx
│ │ │ ├── Dashboard.tsx
│ │ │ ├── Landing.tsx
│ │ │ ├── MapBackground.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── Panel.tsx
│ │ │ ├── Selector.tsx
│ │ │ └── ...
│ │ └── ui/ # Componentes shadcn/ui (botões, cards, etc.)
│ ├── hooks/ # Hooks personalizados
│ ├── lib/ # Utilitários e configurações
│ │ ├── api/ # Funções mock/fake API
│ │ ├── error-capture.ts
│ │ ├── error-page.ts
│ │ └── utils.ts
│ ├── routes/ # Páginas/rotas da aplicação
│ │ ├── __root.tsx # Root layout
│ │ ├── index.tsx # Página inicial (selector)
│ │ ├── passageiro.auth.tsx # Login passageiro
│ │ ├── passageiro.dashboard.tsx # Dashboard passageiro
│ │ ├── motorista.auth.tsx
│ │ ├── motorista.dashboard.tsx
│ │ └── selector.tsx
│ ├── router.tsx # Configuração do router
│ ├── routeTree.gen.ts # Árvore de rotas gerada
│ ├── server.ts # Mock de servidor (opcional)
│ └── styles.css
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md


🚀 Como Executar Localmente

Pré‑requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou [Bun](https://bun.sh/)

### Passos

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Liedso635/Mova-App.git
   cd Mova-App
Instalar dependências

bash
npm install
# ou
bun install
Iniciar o servidor de desenvolvimento

bash
npm run dev
A aplicação estará disponível em http://localhost:8080 (a porta pode variar).

Compilar para produção

bash
npm run build
Os ficheiros optimizados serão gerados na pasta dist.

📜 Scripts Disponíveis
Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento (Vite)
npm run build	Gera a build de produção (modo padrão)
npm run build:dev	Build em modo desenvolvimento
npm run preview	Pré-visualiza a build localmente
npm run lint	Executa o ESLint para verificar problemas no código
npm run format	Formata o código utilizando Prettier
🧪 Contexto Académico
Instituição: [Nome da tua Faculdade/Universidade]

Disciplina: Algoritmos e Estruturas de Dados II

Ano Lectivo: 2025/2026

Trabalho Prático nº2 – Desenvolvimento de uma aplicação que demonstre a aplicação de estruturas de dados (filas, grafos, árvores) e algoritmos de optimização (caminhos mínimos, ordenação, etc.) num contexto real de mobilidade.

🤝 Contribuição
Este repositório é parte de um trabalho académico. Contribuições externas não são aceites sem autorização prévia do docente responsável.

✍️ Autor
Liedso635 – GitHub
