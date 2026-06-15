package com.dsin.salon.controller;

import com.dsin.salon.dto.request.AppointmentRequestDTO;
import com.dsin.salon.model.Appointment;
import com.dsin.salon.model.AppointmentItem;
import com.dsin.salon.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/appointments")
public class AdminController {

    private final AppointmentService appointmentService;

    public AdminController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // RF08: List all appointments
    @GetMapping
    public ResponseEntity<List<Appointment>> listAll() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // RF07: Administrative update (ignores 48h rule)
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> adminUpdate(@PathVariable Long id, @RequestBody AppointmentRequestDTO request) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, request, true));
    }

    // RF07: Administrative cancel (ignores 48h rule)
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Appointment> adminCancel(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, true));
    }

    // RF09: Confirm appointment
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    // RF10: Manage individual item status
    @PatchMapping("/items/{itemId}/status")
    public ResponseEntity<AppointmentItem> updateItemStatus(@PathVariable Long itemId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(appointmentService.updateItemStatus(itemId, status));
    }
}
