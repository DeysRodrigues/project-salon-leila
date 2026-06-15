package com.dsin.salon.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dsin.salon.dto.request.LoginRequestDTO;
import com.dsin.salon.dto.response.LoginResponseDTO;
import com.dsin.salon.service.AuthService;

import jakarta.validation.Valid;

/**
 * REST Controller responsible for handling authentication endpoints. Maps
 * incoming HTTP requests from the Swagger UI to the underlying AuthService.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user login. Uses @Valid to ensure the incoming JSON respects
     * the rules defined in LoginRequestDTO (like @Email and @NotBlank).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response); // Returns HTTP Status 200 OK with the token
    }
}
