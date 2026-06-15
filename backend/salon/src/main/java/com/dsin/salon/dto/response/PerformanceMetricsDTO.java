package com.dsin.salon.dto.response;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PerformanceMetricsDTO {

    private long totalAppointments;
    private BigDecimal totalRevenue;
    private Map<String, Long> appointmentsByStatus;
    private Map<String, Long> popularServices;
}
