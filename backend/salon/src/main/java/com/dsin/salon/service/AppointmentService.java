package com.dsin.salon.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dsin.salon.dto.request.AppointmentRequestDTO;
import com.dsin.salon.model.Appointment;
import com.dsin.salon.model.AppointmentItem;
import com.dsin.salon.model.ServiceCatalog;
import com.dsin.salon.model.User;
import com.dsin.salon.repository.AppointmentItemRepository;
import com.dsin.salon.repository.AppointmentRepository;
import com.dsin.salon.repository.ServiceCatalogRepository;
import com.dsin.salon.repository.UserRepository;

/**
 * Service responsible for orchestrating appointment-related business rules. It
 * enforces core constraints such as the 48-hour rescheduling policy and
 * availability checks.
 */
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceCatalogRepository serviceCatalogRepository;
    private final AppointmentItemRepository appointmentItemRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            ServiceCatalogRepository serviceCatalogRepository,
            AppointmentItemRepository appointmentItemRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceCatalogRepository = serviceCatalogRepository;
        this.appointmentItemRepository = appointmentItemRepository;
    }

    /**
     * RF01 & RF04: Creates a new appointment for a user.
     */
    @Transactional
    public Appointment createAppointment(Long userId, AppointmentRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDateTime(request.getDateTime());
        appointment.setStatus("PENDING");

        List<AppointmentItem> items = request.getServiceIds().stream().map(serviceId -> {
            ServiceCatalog service = serviceCatalogRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Service not found: " + serviceId));

            AppointmentItem item = new AppointmentItem();
            item.setAppointment(appointment);
            item.setServiceCatalog(service);
            item.setStatus("PENDING");
            return item;
        }).collect(Collectors.toList());

        appointment.setItems(items);
        return appointmentRepository.save(appointment);
    }

    /**
     * RF05: Retrieves the appointment history for a specific client.
     */
    public List<Appointment> getUserHistory(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    /**
     * RF08: Retrieves all appointments (Admin only).
     */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Reschedules an existing appointment. RF03: Enforces 48-hour advance
     * notice for clients. RF07: Admins can bypass the 48-hour rule.
     */
    @Transactional
    public Appointment rescheduleAppointment(Long appointmentId, LocalDateTime newDateTime, boolean isAdmin) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));

        if (!isAdmin) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime deadlineToChange = appointment.getDateTime().minusHours(48);

            if (now.isAfter(deadlineToChange)) {
                throw new RuntimeException("Business Rule (RF03): Rescheduling is only allowed at least 48 hours in advance. Please contact the salon by phone.");
            }
        }

        appointment.setDateTime(newDateTime);
        return appointmentRepository.save(appointment);
    }

    /**
     * RF09: Confirms an appointment (Admin only).
     */
    @Transactional
    public Appointment confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));

        appointment.setStatus("CONFIRMED");
        return appointmentRepository.save(appointment);
    }

    /**
     * RF10: Manages the status of an individual service item.
     */
    @Transactional
    public AppointmentItem updateItemStatus(Long itemId, String status) {
        AppointmentItem item = appointmentItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Appointment item not found."));

        item.setStatus(status);
        return appointmentItemRepository.save(item);
    }

    /**
     * RF04: Checks if the user already has an appointment in the current week.
     * Business rule: Only one appointment per week is allowed.
     */
    public void validateWeeklyAppointmentLimit(Long userId, LocalDateTime dateTime) {
        LocalDateTime startOfWeek = dateTime.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime endOfWeek = dateTime.with(java.time.temporal.TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

        var existingAppointments = appointmentRepository.findByUserIdAndDateTimeBetweenAndStatusNot(
                userId, startOfWeek, endOfWeek, "CANCELED");

        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Business Rule (RF04): You already have an appointment this week. Suggestion: schedule new services for the same day as your existing appointment.");
        }
    }
}
