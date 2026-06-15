package com.dsin.salon.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsin.salon.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Used in RF05: Retrieves the appointment history for a specific client
     * within a date range.
     *
     * @param userId The ID of the client.
     * @param startDate The beginning of the filtering period.
     * @param endDate The end of the filtering period.
     * @return A list of appointments matching the criteria.
     */
    List<Appointment> findByUserIdAndDateTimeBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Used in RF04: Checks if the client already has an appointment in the same
     * week (ignoring canceled ones).
     *
     * @param userId The ID of the client.
     * @param startOfWeek The start date and time of the week.
     * @param endOfWeek The end date and time of the week.
     * @param status The status to exclude (usually "CANCELED").
     * @return A list of active appointments for that user within the specified
     * week.
     */
    List<Appointment> findByUserIdAndDateTimeBetweenAndStatusNot(
            Long userId,
            LocalDateTime startOfWeek,
            LocalDateTime endOfWeek,
            String status
    );

    List<Appointment> findByUserId(Long userId);
}
