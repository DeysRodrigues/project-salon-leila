# Back-end API - Salão da Leila

Este é o back-end do sistema de agendamentos do Salão da Leila, construído em **Java com Spring Boot**. A API é responsável por gerenciar usuários, serviços e os agendamentos do salão.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* **Java 17+** (JDK)
* **Docker** (para rodar o banco de dados)
* Uma IDE (VS Code, IntelliJ, etc.)

---

## Subindo o Banco de Dados (MySQL)

O projeto utiliza um banco de dados MySQL que roda isolado em um container Docker. 

1. Abra o terminal nesta pasta (`backend`).
2. Execute o comando abaixo para criar e rodar o banco em segundo plano:
```bash
   docker compose up -d