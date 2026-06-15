package com.dsin.salon.controller;

import com.dsin.salon.dto.response.PerformanceMetricsDTO;
import com.dsin.salon.model.Appointment;
import com.dsin.salon.model.AppointmentItem;
import com.dsin.salon.repository.AppointmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    private final AppointmentRepository appointmentRepository;

    public DashboardController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // RF11: Management dashboard for performance tracking
    @GetMapping("/metrics")
    public ResponseEntity<PerformanceMetricsDTO> getPerformanceMetrics() {
        LocalDateTime startOfWeek = LocalDateTime.now().with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime endOfWeek = LocalDateTime.now().with(java.time.temporal.TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

        List<Appointment> weeklyAppointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getDateTime().isAfter(startOfWeek) && a.getDateTime().isBefore(endOfWeek))
                .collect(Collectors.toList());

        long totalAppointments = weeklyAppointments.size();

        BigDecimal totalRevenue = weeklyAppointments.stream()
                .filter(a -> !"CANCELED".equals(a.getStatus()))
                .flatMap(a -> a.getItems().stream())
                .map(item -> item.getServiceCatalog().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> byStatus = weeklyAppointments.stream()
                .collect(Collectors.groupingBy(Appointment::getStatus, Collectors.counting()));

        Map<String, Long> popularServices = weeklyAppointments.stream()
                .flatMap(a -> a.getItems().stream())
                .collect(Collectors.groupingBy(item -> item.getServiceCatalog().getName(), Collectors.counting()));

        return ResponseEntity.ok(new PerformanceMetricsDTO(totalAppointments, totalRevenue, byStatus, popularServices));
    }
}
