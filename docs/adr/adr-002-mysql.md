**Projeto:** Sistema de Agendamento - Cabeleleila Leila (Avaliação Técnica DSIN)

**Data:** 12 de junho de 2026

**Status:** Aceito

**1. Contexto**
O sistema precisa armazenar informações de clientes, histórico de serviços e as agendas de forma consistente. O domínio do problema (reservas e agendamentos de salão) é inerentemente relacional, exigindo cruzamento de dados para validações de regras de negócio complexas, como a identificação de agendamentos na mesma semana. A avaliação técnica permite a utilização de qualquer banco de dados.

**2. Decisão Arquitetural**

Adoção do MySQL, um banco de dados relacional (RDBMS), para a persistência das informações, em conjunto com o Spring Data JPA (Hibernate) no back-end.

**3. Justificativa**

- **Natureza Relacional dos Dados:** Entidades como `Cliente`, `Agendamento` e `Servico` possuem relacionamentos estritos. O uso de chaves estrangeiras (Foreign Keys) garante a integridade referencial nativa, impedindo, por exemplo, que um agendamento aponte para um serviço que não existe.
- **Consultas Temporais Complexas:** O sistema exige que seja sugerida a mesma data caso existam agendamentos para a mesma semana. Bancos relacionais com a linguagem SQL possuem funções nativas de data e tempo altamente otimizadas para este tipo de filtro.
- **Integridade Transacional (ACID):** Em sistemas de agenda, consistência é fundamental para evitar choques de horários. Bancos relacionais oferecem transações robustas para garantir que as alterações de status dos serviços ocorram de forma segura.

**4. Consequências**

- **Positivas:** Demonstra conhecimento sólido em modelagem de dados tradicional; garante 100% de consistência estrutural; simplifica consultas matemáticas e filtros de data (ex: histórico de agendamentos por período).
- **Negativas:** Exige a criação de esquemas rígidos (tabelas e colunas definidas previamente); requer o uso de tabelas associativas (como `Agendamento_Servico`) para lidar com relações de muitos-para-muitos, o que aumenta levemente a verbosidade do código Java (entidades JPA).