**Projeto:** Sistema de Agendamento - Cabeleleila Leila (Avaliação Técnica DSIN)

**Data:** 12 de junho de 2026

**Status:** Aceito

**1. Contexto**
O projeto exige a entrega de um sistema web com regras de negócio claras (como o bloqueio de alterações de agendamento em menos de 2 dias e a sugestão inteligente de datas na mesma semana) dentro de um prazo curto. A solução será desenvolvida utilizando o ecossistema Java com Spring Boot no servidor e React na interface do cliente. O código precisa demonstrar conhecimento em arquiteturas e frameworks, além de manter alta manutenibilidade e organização, conforme solicitado nas instruções.

**2. Decisão Arquitetural**

Adoção do padrão arquitetural MVC estruturado em camadas (Controller, Service, Repository, Model/Entity) utilizando o framework Spring Boot.

**3. Justificativa**

- **Agilidade e Redução de Complexidade:** O padrão MVC minimiza a sobrecarga estrutural. Isso otimiza o tempo restrito de desenvolvimento.
- **Isolamento Prático:** A camada de *Service* garante o isolamento suficiente das lógicas estipuladas, mantendo o código testável e organizado sem sacrificar a velocidade de entrega.
- **Integração Nativa:** O ecossistema Spring Boot foi desenhado para operar fluentemente com este padrão, facilitando o uso de ferramentas embutidas como o Spring Data JPA.

**4. Consequências**

- **Positivas:** Rapidez na implementação da infraestrutura inicial; curva de entrega acelerada; facilidade para aplicar validações de dados diretamente nas classes utilizando anotações.
- **Negativas:** Leve acoplamento das regras de domínio às bibliotecas e especificidades do framework (Spring/JPA), reduzindo a portabilidade do código para outras linguagens ou frameworks no futuro.