package com.dsin.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dsin.salon.model.ServiceCatalog;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {
    // Basic CRUD operations are inherited from JpaRepository automatically.
}
