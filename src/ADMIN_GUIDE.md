# Guia do Painel Administrativo

## Credenciais de Teste

O sistema agora possui dois tipos de usuários com diferentes níveis de acesso:

### 👨‍🏫 Professor
- **Email:** professor@escola.com
- **Senha:** qualquer senha
- **Permissões:**
  - Visualizar todas as questões do banco
  - Criar novas questões
  - Editar suas próprias questões
  - Excluir suas próprias questões
  - Exportar questões para CSV

### 👨‍💼 Coordenador
- **Email:** coordenador@escola.com
- **Senha:** qualquer senha
- **Permissões:**
  - Todas as permissões do professor
  - Acessar o Painel Administrativo
  - Gerenciar professores (CRUD completo)
  - Gerenciar disciplinas (CRUD completo)

## Funcionalidades do Coordenador

### Painel Administrativo

O coordenador tem acesso a um botão **"Admin"** no cabeçalho do sistema que leva ao painel administrativo.

#### Gestão de Professores

1. **Visualizar Professores**
   - Lista completa de todos os professores cadastrados
   - Informações: Nome, Email, Data de cadastro

2. **Adicionar Professor**
   - Clique no botão "Adicionar" na aba de Professores
   - Preencha: Nome e Email
   - Confirme para salvar

3. **Editar Professor**
   - Clique no ícone de lápis ao lado do professor
   - Modifique os dados desejados
   - Salve as alterações

4. **Excluir Professor**
   - Clique no ícone de lixeira ao lado do professor
   - Confirme a exclusão no diálogo

#### Gestão de Disciplinas

1. **Visualizar Disciplinas**
   - Cards visuais de todas as disciplinas cadastradas
   - Informações: Nome e Data de cadastro

2. **Adicionar Disciplina**
   - Clique no botão "Adicionar" na aba de Disciplinas
   - Preencha o nome da disciplina
   - Confirme para salvar

3. **Editar Disciplina**
   - Clique no ícone de lápis no card da disciplina
   - Modifique o nome
   - Salve as alterações

4. **Excluir Disciplina**
   - Clique no ícone de lixeira no card da disciplina
   - Confirme a exclusão no diálogo

## Integração com o Sistema

- **Disciplinas sincronizadas:** As disciplinas criadas no painel administrativo são automaticamente sincronizadas com:
  - Formulário de criação de questões
  - Formulário de edição de questões
  - Filtros do banco de questões

- **Dados iniciais:** O sistema vem com:
  - 3 professores pré-cadastrados
  - 4 disciplinas pré-cadastradas (Matemática, Português, História, Geografia)

## Notificações

Todas as ações administrativas exibem notificações toast informando o sucesso da operação:
- ✅ Professor adicionado/atualizado/removido com sucesso
- ✅ Disciplina adicionada/atualizada/removida com sucesso

## Observações Importantes

1. **Persistência:** Todos os dados são salvos no localStorage do navegador
2. **Segurança:** Em produção, seria necessário implementar autenticação real via backend
3. **Sincronização:** Mudanças nas disciplinas são refletidas imediatamente em todo o sistema
4. **Validação:** O sistema valida se todos os campos obrigatórios estão preenchidos antes de salvar
