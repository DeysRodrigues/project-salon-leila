package com.dsin.salon.controller;

import com.dsin.salon.model.Appointment;
import com.dsin.salon.model.AppointmentItem;
import com.dsin.salon.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    // RF07: Administrative reschedule (ignores 48h rule)
    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> adminReschedule(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LocalDateTime newDateTime = LocalDateTime.parse(body.get("newDateTime"));
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, newDateTime, true));
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
