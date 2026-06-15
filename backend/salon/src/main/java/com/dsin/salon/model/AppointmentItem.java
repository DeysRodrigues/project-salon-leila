package com.dsin.salon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

/**
 * Represents an individual service entry contained within a broader appointment
 * scope. This granular structure enables independent lifecycle and status
 * tracking for each distinct service requested by the client during a single
 * visit.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tb_appointment_items")
public class AppointmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceCatalog serviceCatalog;

    @Column(nullable = false)
    private String status; // Expected states: PENDING, COMPLETED, CANCELED
}
