# Sistema de Banco de Questões

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-pink.svg)](https://www.framer.com/motion/)

Um sistema completo de gerenciamento de questões educacionais desenvolvido como projeto integrador do IFB - Campus São Sebastião.

## 📋 Sobre o Projeto

O Sistema de Banco de Questões é uma aplicação web moderna desenvolvida para facilitar a criação, organização e gerenciamento de questões educacionais. O sistema permite que professores criem, editem e organizem questões por disciplina, tags e dificuldade, enquanto coordenadores têm acesso a ferramentas administrativas para gerenciar usuários e disciplinas.

## ✨ Funcionalidades

### 👤 Para Professores

- ✅ **Criação de Questões**: Interface intuitiva para criar questões com múltiplas alternativas
- ✅ **Edição de Questões**: Modificar questões existentes
- ✅ **Organização por Disciplinas**: Categorização automática das questões
- ✅ **Sistema de Tags**: Adição de tags para melhor organização e busca
- ✅ **Formatação Rich Text**: Suporte a negrito, itálico, sublinhado e imagens
- ✅ **Visualização em Tempo Real**: Pré-visualização das questões durante a criação
- ✅ **Busca e Filtros**: Pesquisa avançada por assunto, disciplina, professor e tags

### 👨‍💼 Para Coordenadores

- ✅ **Painel Administrativo**: Gerenciamento completo do sistema
- ✅ **Gerenciamento de Usuários**: Controle de acesso e permissões
- ✅ **Gerenciamento de Disciplinas**: Criação e edição de disciplinas
- ✅ **Relatórios**: Exportação de dados em CSV
- ✅ **Controle de Acesso**: Diferentes níveis de permissão

### 🎨 Interface e Experiência

- ✅ **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Interface Moderna**: Design limpo e intuitivo com Tailwind CSS
- ✅ **Animações Suaves**: Transições fluidas com Framer Motion
- ✅ **Tema Consistente**: Paleta de cores verde e vermelho do IFB
- ✅ **Feedback Visual**: Notificações e indicadores visuais
- ✅ **Acessibilidade**: Componentes acessíveis com Radix UI

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 18.3.1** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server ultrarrápido
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **React Router DOM** - Roteamento para SPA
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast

### Backend API

- **RESTful API** hospedada em `https://bancodequestoes-api.onrender.com/`
- **Endpoints principais**:
  - `GET /questions` - Lista todas as questões
  - `POST /questions` - Cria nova questão
  - `GET /subjects` - Lista disciplinas
  - `POST /subjects` - Cria nova disciplina
  - `GET /tags` - Lista tags disponíveis

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/LuizHMAguiar/Desafio-BancoDeQuestoes.git
   cd Desafio-BancoDeQuestoes
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:3000`
   - A aplicação será recarregada automaticamente com mudanças no código

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI reutilizáveis
│   ├── AdminPanel.tsx   # Painel administrativo
│   ├── LoginScreen.tsx  # Tela de login
│   ├── QuestionBank.tsx # Banco de questões principal
│   ├── QuestionForm.tsx # Formulário de criação/edição
│   ├── QuestionList.tsx # Lista e filtros de questões
│   └── ...
├── types/               # Definições TypeScript
│   └── question.ts      # Interfaces do domínio
├── assets/              # Imagens e recursos estáticos
├── styles/              # Estilos globais
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção localmente

## 🌐 API Endpoints

### Questões

- `GET /questions` - Lista todas as questões
- `POST /questions` - Cria uma nova questão

### Disciplinas

- `GET /subjects` - Lista todas as disciplinas
- `POST /subjects` - Cria uma nova disciplina

### Tags

- `GET /tags` - Lista todas as tags disponíveis

## 👥 Usuários do Sistema

### Professor

- **Email**: professor@ifb.edu.br
- **Senha**: professor123
- **Permissões**: Criar, editar e visualizar questões

### Coordenador

- **Email**: coordenador@ifb.edu.br
- **Senha**: coordenador123
- **Permissões**: Todas as permissões do professor + administração

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é parte do projeto integrador do IFB - Campus São Sebastião e é destinado para fins educacionais.

## 🙏 Agradecimentos

- IFB - Campus São Sebastião pela oportunidade
- Comunidade React e TypeScript
- Contribuidores das bibliotecas utilizadas

## 📞 Contato

**Luiz Henrique Marques Aguiar**

- GitHub: [@LuizHMAguiar](https://github.com/LuizHMAguiar)
- Email: luiz.aguiar@ifb.edu.br

---

⭐ **Dê uma estrela se este projeto te ajudou!**
