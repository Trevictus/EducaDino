package com.educadino.service;

import com.educadino.dto.DinosaurDto;
import com.educadino.dto.DinosaurRequest;
import com.educadino.entity.Dinosaur;
import com.educadino.exception.ResourceNotFoundException;
import com.educadino.repository.DinosaurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Dinosaurios
 */
@Service
@RequiredArgsConstructor
public class DinosaurService {

    private final DinosaurRepository dinosaurRepository;

    /**
     * Obtiene todos los dinosaurios.
     */
    @Transactional(readOnly = true)
    public List<DinosaurDto> getAllDinosaurs() {
        return dinosaurRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un dinosaurio por ID.
     */
    @Transactional(readOnly = true)
    public DinosaurDto getDinosaurById(Long id) {
        Dinosaur dinosaur = dinosaurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dinosaurio", id));
        return mapToDto(dinosaur);
    }

    /**
     * Busca dinosaurios por nombre.
     */
    @Transactional(readOnly = true)
    public List<DinosaurDto> searchByName(String name) {
        return dinosaurRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Filtra dinosaurios por dieta.
     */
    @Transactional(readOnly = true)
    public List<DinosaurDto> getByDiet(String diet) {
        return dinosaurRepository.findByDiet(diet).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Filtra dinosaurios por período.
     */
    @Transactional(readOnly = true)
    public List<DinosaurDto> getByPeriod(String period) {
        return dinosaurRepository.findByPeriod(period).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo dinosaurio (solo admin).
     */
    @Transactional
    public DinosaurDto createDinosaur(DinosaurRequest request) {
        Dinosaur dinosaur = Dinosaur.builder()
                .name(request.getName())
                .description(request.getDescription())
                .diet(request.getDiet())
                .period(request.getPeriod())
                .taxonomy(request.getTaxonomy())
                .family(request.getFamily())
                .imageUrl(request.getImageUrl())
                .size(request.getSize())
                .location(request.getLocation())
                .curiosities(request.getCuriosities())
                .build();

        dinosaurRepository.save(dinosaur);
        return mapToDto(dinosaur);
    }

    /**
     * Actualiza un dinosaurio existente (solo admin).
     */
    @Transactional
    public DinosaurDto updateDinosaur(Long id, DinosaurRequest request) {
        Dinosaur dinosaur = dinosaurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dinosaurio", id));

        if (request.getName() != null) dinosaur.setName(request.getName());
        if (request.getDescription() != null) dinosaur.setDescription(request.getDescription());
        if (request.getDiet() != null) dinosaur.setDiet(request.getDiet());
        if (request.getPeriod() != null) dinosaur.setPeriod(request.getPeriod());
        if (request.getTaxonomy() != null) dinosaur.setTaxonomy(request.getTaxonomy());
        if (request.getFamily() != null) dinosaur.setFamily(request.getFamily());
        if (request.getImageUrl() != null) dinosaur.setImageUrl(request.getImageUrl());
        if (request.getSize() != null) dinosaur.setSize(request.getSize());
        if (request.getLocation() != null) dinosaur.setLocation(request.getLocation());
        if (request.getCuriosities() != null) dinosaur.setCuriosities(request.getCuriosities());

        dinosaurRepository.save(dinosaur);
        return mapToDto(dinosaur);
    }

    /**
     * Elimina un dinosaurio (solo admin).
     */
    @Transactional
    public void deleteDinosaur(Long id) {
        if (!dinosaurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dinosaurio", id);
        }
        dinosaurRepository.deleteById(id);
    }

    /**
     * Convierte Dinosaur a DinosaurDto.
     */
    private DinosaurDto mapToDto(Dinosaur dinosaur) {
        return DinosaurDto.builder()
                .id(dinosaur.getId())
                .name(dinosaur.getName())
                .description(dinosaur.getDescription())
                .diet(dinosaur.getDiet())
                .period(dinosaur.getPeriod())
                .taxonomy(dinosaur.getTaxonomy())
                .family(dinosaur.getFamily())
                .imageUrl(dinosaur.getImageUrl())
                .size(dinosaur.getSize())
                .location(dinosaur.getLocation())
                .curiosities(dinosaur.getCuriosities())
                .createdAt(dinosaur.getCreatedAt())
                .build();
    }
}
