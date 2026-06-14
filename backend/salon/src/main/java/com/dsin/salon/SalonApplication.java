package com.dsin.salon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class SalonApplication implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        SpringApplication.run(SalonApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n----------------------------");
        System.out.println("Testando conexão com o Banco de Dados...");
        
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("SUCESSO: O Java está conectado ao MySQL do Docker!");
        } catch (Exception e) {
            System.out.println("ERRO: Não foi possível conectar ao banco de dados.");
            System.out.println("Motivo: " + e.getMessage());
        }
        System.out.println("---------------------------\n");
    }
}