package com.dsin.salon.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequestDTO {

    @NotNull(message = "Date and time are required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime dateTime;

    @NotEmpty(message = "You must select at least one service")
    private List<Long> serviceIds;
}
