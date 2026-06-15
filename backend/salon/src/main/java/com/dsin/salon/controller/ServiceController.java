package com.dsin.salon.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dsin.salon.model.ServiceCatalog;
import com.dsin.salon.repository.ServiceCatalogRepository;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final ServiceCatalogRepository serviceCatalogRepository;

    public ServiceController(ServiceCatalogRepository serviceCatalogRepository) {
        this.serviceCatalogRepository = serviceCatalogRepository;
    }

    @GetMapping
    public ResponseEntity<List<ServiceCatalog>> listAll() {
        return ResponseEntity.ok(serviceCatalogRepository.findAll());
    }
}
