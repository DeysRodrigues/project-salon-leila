package com.dsin.salon;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dsin.salon.model.User;
import com.dsin.salon.repository.ServiceCatalogRepository;
import com.dsin.salon.repository.UserRepository;

/**
 * Main application class for Salon Management System.
 * Handles database seeding and core Spring Boot initialization.
 */
@SpringBootApplication
public class SalonApplication implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SalonApplication(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(SalonApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n----------------------------");
        System.out.println("Testing Database connection...");

        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("SUCCESS: Connected to MySQL!");
        } catch (Exception e) {
            System.out.println("ERROR: Could not connect to database.");
            System.out.println("Reason: " + e.getMessage());
        }
        System.out.println("---------------------------\n");
    }

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, 
                                    ServiceCatalogRepository serviceRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin (Leila)
            if (userRepository.findByEmail("leila@salao.com").isEmpty()) {
                User admin = new User();
                admin.setName("Leila Administradora");
                admin.setEmail("leila@salao.com");
                admin.setPhone("11888888888");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Admin Leila seeded successfully!");
            }

            // Seed Client (Maria)
            if (userRepository.findByEmail("maria@email.com").isEmpty()) {
                User cliente = new User();
                cliente.setName("Maria Silva");
                cliente.setEmail("maria@email.com");
                cliente.setPhone("11999999999");
                cliente.setPassword(passwordEncoder.encode("senha123"));
                cliente.setRole("CLIENT");
                userRepository.save(cliente);
                System.out.println("Client Maria Silva seeded successfully!");
            }

            // Seed Services
            if (serviceRepository.count() == 0) {
                java.util.List.of(
                    new com.dsin.salon.model.ServiceCatalog(null, "Haircut", new java.math.BigDecimal("50.00"), 30),
                    new com.dsin.salon.model.ServiceCatalog(null, "Manicure", new java.math.BigDecimal("30.00"), 45),
                    new com.dsin.salon.model.ServiceCatalog(null, "Pedicure", new java.math.BigDecimal("35.00"), 45),
                    new com.dsin.salon.model.ServiceCatalog(null, "Blowout", new java.math.BigDecimal("40.00"), 40)
                ).forEach(serviceRepository::save);
                System.out.println("Service catalog seeded successfully!");
            }
        };
    }
}
