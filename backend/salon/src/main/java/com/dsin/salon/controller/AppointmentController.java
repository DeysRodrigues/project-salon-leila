package com.dsin.salon.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dsin.salon.dto.request.AppointmentRequestDTO;
import com.dsin.salon.model.Appointment;
import com.dsin.salon.model.User;
import com.dsin.salon.repository.UserRepository;
import com.dsin.salon.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AppointmentController(AppointmentService appointmentService, UserRepository userRepository) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    // RF01 & RF04: Create a new appointment
    @PostMapping
    public ResponseEntity<Appointment> create(@Valid @RequestBody AppointmentRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).get();

        appointmentService.validateWeeklyAppointmentLimit(user.getId(), request.getDateTime());

        Appointment created = appointmentService.createAppointment(user.getId(), request);
        return ResponseEntity.status(201).body(created);
    }

    // RF05: Get appointment history (own history)
    @GetMapping("/history")
    public ResponseEntity<List<Appointment>> getMyHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).get();
        return ResponseEntity.ok(appointmentService.getUserHistory(user.getId()));
    }

    // RF02 & RF03: Reschedule (own appointment)
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> reschedule(@PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        LocalDateTime newDateTime = LocalDateTime.parse(body.get("newDateTime"));
        User user = userRepository.findByEmail(userDetails.getUsername()).get();

        // Verify ownership (RF02)
        Appointment appointment = appointmentService.getUserHistory(user.getId()).stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found or does not belong to you."));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, newDateTime, isAdmin));
    }
}
