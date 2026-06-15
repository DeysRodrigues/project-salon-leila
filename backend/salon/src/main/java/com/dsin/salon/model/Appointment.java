package com.dsin.salon.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the root entity of a salon appointment session. It encapsulates
 * scheduling parameters, ownership binding to a specific user, the generalized
 * state of the booking, and orchestrates the associated service items.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String status; // Expected states: PENDING, CONFIRMED, CANCELED

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AppointmentItem> items = new ArrayList<>();
}
