package com.dsin.salon.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dsin.salon.model.Appointment;
import com.dsin.salon.repository.AppointmentRepository;

/**
 * Unit tests for Appointment business rules. 
 * Tools: JUnit 5 + Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private Appointment sampleAppointment;

    @BeforeEach
    void setUp() {
        sampleAppointment = new Appointment();
        sampleAppointment.setId(1L);
        // Appointment scheduled for 1 hour from now (critical for 48h rule)
        sampleAppointment.setDateTime(LocalDateTime.now().plusHours(1));
    }

    @Test
    @DisplayName("RF03: Should throw exception when client reschedules with less than 48h notice")
    void shouldBlockReschedulingLessThan48HoursForClient() {
        // Setup
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(sampleAppointment));
        LocalDateTime newDate = LocalDateTime.now().plusDays(5);

        // Execution & Validation
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            appointmentService.rescheduleAppointment(1L, newDate, false); // isAdmin = false
        });

        assertTrue(exception.getMessage().contains("RF03"));
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("RF07: Should allow Admin to reschedule anytime (bypass 48h rule)")
    void shouldAllowAdminToRescheduleAnytime() {
        // Setup
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(sampleAppointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(sampleAppointment);
        LocalDateTime newDate = LocalDateTime.now().plusDays(2);

        // Execution
        Appointment updated = appointmentService.rescheduleAppointment(1L, newDate, true);

        // Validation
        assertNotNull(updated);
        assertEquals(newDate, updated.getDateTime());
        verify(appointmentRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("RF04: Should throw exception if user already has an appointment in the same week")
    void shouldBlockMultipleAppointmentsInSameWeek() {
        // Setup
        Long userId = 10L;
        LocalDateTime appointmentDate = LocalDateTime.now().plusDays(2);

        // Mock existing appointment in the same week
        when(appointmentRepository.findByUserIdAndDateTimeBetweenAndStatusNot(
                eq(userId), any(), any(), eq("CANCELED")))
                .thenReturn(Collections.singletonList(new Appointment()));

        // Execution & Validation
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            appointmentService.validateWeeklyAppointmentLimit(userId, appointmentDate);
        });

        assertTrue(exception.getMessage().contains("RF04"));
    }
}
