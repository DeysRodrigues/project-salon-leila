# Sistema de Agendamento - Salão da Leila

Este projeto consiste em um sistema completo de gestão de agendamentos para o Salão da Leila, permitindo que clientes realizem agendamentos online e a administradora gerencie a agenda do salão de forma eficiente.

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 4.1.0
- Spring Data JPA
- Spring Security com JWT
- Hibernate
- MySQL
- Maven
- Docker Compose

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Date-fns (manipulação de datas)
- Axios

## Requisitos Funcionais

- RF00 - Autenticação e Controle de Acesso: O sistema permite o cadastro de usuários e realiza o login (autenticação via token), diferenciando o nível de acesso entre Clientes (acesso restrito aos próprios dados) e a Administradora (acesso total).
- RF01 - Agendamento de Serviços: O sistema permite que o cliente logado realize o agendamento de um ou mais serviços do catálogo.
- RF02 - Alteração de Agendamento: O sistema permite que o cliente realize a alteração de um agendamento existente (desde que pertença a ele).
- RF03 - Bloqueio de Alteração (Regra de Negócio): O sistema bloqueia a alteração de um agendamento pelo cliente caso a data agendada seja menor que 2 dias (48 horas) de antecedência, informando que a alteração só poderá ser feita por telefone.
- RF04 - Sugestão de Agrupamento: O sistema identifica se existe um agendamento do mesmo cliente para a mesma semana e sugere que os novos serviços sejam agendados na mesma data do primeiro agendamento.
- RF05 - Histórico de Agendamentos: O sistema possui uma opção de histórico, permitindo ao cliente listar apenas os seus próprios agendamentos realizados em um determinado período.
- RF06 - Detalhes do Histórico: O sistema possibilita a visualização detalhada dos serviços e status dos agendamentos listados no histórico do cliente.
- RF07 - Alteração Administrativa: O sistema permite que a administradora (Leila) tenha privilégios para alterar os agendamentos de qualquer cliente a qualquer momento, ignorando o bloqueio de 48 horas.
- RF08 - Listagem de Agendamentos: O sistema disponibiliza à administradora uma opção para listar todos os agendamentos recebidos pelo salão de forma global.
- RF09 - Confirmação de Agendamento: O sistema permite que a administradora realize a alteração de status para confirmar o agendamento para o cliente.
- RF10 - Gerenciamento de Status: O sistema permite o gerenciamento do status (ex: Pendente, Concluído, Cancelado) de cada um dos serviços solicitados dentro de um agendamento de forma individual.
- RF11 - Acompanhamento de Desempenho: O sistema apresenta ferramentas gerenciais para a administradora que demonstrem o desempenho financeiro e de atendimentos semanal do salão.

## Documentação de Arquitetura (ADR)

As decisões arquiteturais do projeto estão documentadas na pasta `docs/adr`. Estes documentos explicam o "porquê" de certas escolhas técnicas e de design.

## Como Rodar o Projeto

### Pré-requisitos
- JDK 17
- Node.js (v18 ou superior)
- Docker e Docker Compose

### Configuração do Ambiente
1. No diretório `backend/salon`, localize o arquivo `.env.example`.
2. Crie um arquivo `.env` na mesma pasta baseando-se no exemplo para configurar as variáveis de ambiente necessárias (como credenciais do banco de dados e segredo do JWT).

### Rodando com Docker (Recomendado)
Para subir o banco de dados MySQL e configurar as tabelas automaticamente, navegue até `backend/salon` e execute:

```bash
docker-compose up -d
```
O Docker Compose irá criar o container do banco de dados e garantir que o esquema esteja pronto para uso pelo Spring Boot.

### Rodando o Backend manualmente
1. Navegue até a pasta do backend:
   ```bash
   cd backend/salon
   ```
2. Execute o projeto usando o Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
O backend estará disponível em `http://localhost:8080`.

### Rodando o Frontend manualmente
1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
O frontend estará disponível em `http://localhost:5173`.

## Testes Unitários

O projeto conta com uma suíte de testes unitários no backend para garantir a integridade das regras de negócio críticas. Os testes utilizam **JUnit 5** e **Mockito** para isolar o comportamento do serviço.

### Principais Casos de Teste (AppointmentServiceTest)

- **Validação da Regra de 48 Horas (RF03)**: Garante que um cliente não consiga reagendar ou alterar um agendamento se faltarem menos de 48 horas para o início do serviço. Isso é fundamental para proteger a previsibilidade da agenda do salão.
- **Privilégio Administrativo (RF07)**: Verifica se a administradora consegue ignorar a trava de 48 horas. Esse teste assegura que o sistema permite flexibilidade total para a Leila gerenciar casos de exceção.
- **Limite de Agendamento Semanal (RF04)**: Valida se o sistema bloqueia corretamente a criação de mais de um agendamento por semana para o mesmo cliente, forçando o uso da funcionalidade de agrupamento de serviços e otimizando a logística do salão.

### Por que estes testes?
1. **Integridade de Dados**: Garante que as regras de negócio complexas sejam aplicadas de forma consistente, independente de mudanças futuras no código.
2. **Segurança**: Valida que as restrições de acesso e operação estão sendo respeitadas entre os diferentes níveis de usuário (Cliente vs Admin).
3. **Prevenção de Regressões**: Permite que novas funcionalidades sejam adicionadas ou refatorações sejam feitas com a confiança de que o comportamento essencial do sistema não foi quebrado.

## Dicas e Observações

- **Docker Compose**: O uso do Docker Compose no backend facilita a criação das tabelas e a persistência dos dados sem necessidade de instalação manual do MySQL.
- **Variáveis de Ambiente**: Utilize o arquivo `.env.example` como guia obrigatório para que a aplicação suba corretamente com todas as configurações de segurança.
- **Validação de Datas**: O sistema utiliza o fuso horário local para validações. Certifique-se de que a data/hora do seu sistema está correta ao testar a regra de 48 horas.
- **Tokens JWT**: A autenticação é baseada em tokens. Se o token expirar, será necessário realizar o login novamente.

## Mídia do Projeto

### Prints do Sistema

- Dashboard do Cliente: ![alt text](frontend/public/client-painel.png)
- Painel Administrativo: ![alt text](frontend/public/adm-painel.png)
- Formulário de Agendamento: ![alt text](frontend/public/form-agendamento.png)

### Vídeo de Demonstração

<video controls src="frontend/public/video.mp4" title="Title"></video>

[Assista ao vídeo de demonstração aqui](frontend/public/video.mp4)


---
Desenvolvido como parte do desafio técnico para a DSIN.
