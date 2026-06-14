**Projeto:** Sistema de Agendamento - Cabeleleila Leila (Avaliação Técnica DSIN)

**Data:** 12 de junho de 2026

**Status:** Aceito

**1. Contexto**
O desenvolvimento ocorre de forma Full-Stack, o que exige uma comunicação rigorosa entre o front-end e o back-end. Adicionalmente, a entrega de documentações é avaliada como um diferencial no projeto. O cronograma restrito demanda que o trabalho de interface e a implementação lógica não se tornem dependências bloqueantes um do outro.

**2. Decisão Arquitetural**

Utilização da abordagem "API-First Pragmática" (Design First, Code Next), definindo e gerando contratos REST (endpoints) com dados simulados via OpenAPI/Swagger antes da codificação profunda da lógica de persistência e integração com banco de dados.

**3. Justificativa**

- **Trabalho em Paralelo:** Permite que a interface em React inicie o consumo de dados imediatos (mocks) baseados no contrato, sem depender do banco de dados MySQL estar completamente modelado.
- **Garantia de Diferenciais:** Atende plenamente à exigência de documentações extras, gerando um material interativo e padronizado para os avaliadores.
- **Foco no Contrato:** Assegura que o fluxo de entrada e saída atenda primeiramente às necessidades operacionais e gerenciais da Leila antes da construção técnica interna.

**4. Consequências**

- **Positivas:** Documentação viva e gerada automaticamente; independência técnica entre o cliente (React) e o servidor (Java); total clareza sobre os pacotes JSON de comunicação.
- **Negativas:** Exige disciplina contínua do desenvolvedor para garantir a atualização dos contratos no código caso os requisitos do front-end exijam mudanças de rota durante o desenvolvimento.