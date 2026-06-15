package com.dsin.salon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsin.salon.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Essential method for Spring Security to find the user during login
     * authentication.
     *
     * @param email The user's registered email.
     * @return An Optional containing the User if found, or empty if not.
     */
    Optional<User> findByEmail(String email);
}
