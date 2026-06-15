package com.dsin.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsin.salon.model.AppointmentItem;

@Repository
public interface AppointmentItemRepository extends JpaRepository<AppointmentItem, Long> {
    // Basic CRUD operations inherited. Useful for RF10 (Individual status management).
}
