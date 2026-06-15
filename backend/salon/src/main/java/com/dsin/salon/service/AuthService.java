package com.dsin.salon.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.dsin.salon.dto.request.LoginRequestDTO;
import com.dsin.salon.dto.response.LoginResponseDTO;
import com.dsin.salon.model.User;
import com.dsin.salon.repository.UserRepository;
import com.dsin.salon.security.JwtUtil;

/**
 * Service responsible for handling user authentication and authorization. It
 * validates login credentials and issues access tokens for secure API
 * communication.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Authenticates a user based on the provided email and password.
     */
    public LoginResponseDTO authenticate(LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail()).get();

        return new LoginResponseDTO(jwt, "Bearer", user.getRole());
    }
}
