package com.educadino.controller;

import com.educadino.dto.DinosaurioCreateDTO;
import com.educadino.dto.DinosaurioResponseDTO;
import com.educadino.dto.DinosaurioUpdateDTO;
import com.educadino.service.DinosaurioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de dinosaurios
 * Endpoints: /api/dinosaurios
 */
@RestController
@RequestMapping("/api/dinosaurios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DinosaurioController {

    private final DinosaurioService dinosaurioService;

    /**
     * GET /api/dinosaurios
     * Obtiene todos los dinosaurios
     */
    @GetMapping
    public ResponseEntity<List<DinosaurioResponseDTO>> obtenerTodos() {
        List<DinosaurioResponseDTO> dinosaurios = dinosaurioService.obtenerTodos();
        return ResponseEntity.ok(dinosaurios);
    }

    /**
     * GET /api/dinosaurios/{id}
     * Obtiene un dinosaurio por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DinosaurioResponseDTO> obtenerPorId(@PathVariable Long id) {
        DinosaurioResponseDTO dinosaurio = dinosaurioService.obtenerPorId(id);
        return ResponseEntity.ok(dinosaurio);
    }

    /**
     * GET /api/dinosaurios/nombre/{nombre}
     * Obtiene un dinosaurio por nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<DinosaurioResponseDTO> obtenerPorNombre(@PathVariable String nombre) {
        DinosaurioResponseDTO dinosaurio = dinosaurioService.obtenerPorNombre(nombre);
        return ResponseEntity.ok(dinosaurio);
    }

    /**
     * POST /api/dinosaurios
     * Crea un nuevo dinosaurio
     */
    @PostMapping
    public ResponseEntity<DinosaurioResponseDTO> crear(@Valid @RequestBody DinosaurioCreateDTO createDTO) {
        DinosaurioResponseDTO dinosaurioCreado = dinosaurioService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(dinosaurioCreado);
    }

    /**
     * PUT /api/dinosaurios/{id}
     * Actualiza un dinosaurio existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<DinosaurioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DinosaurioUpdateDTO updateDTO) {
        DinosaurioResponseDTO dinosaurioActualizado = dinosaurioService.actualizar(id, updateDTO);
        return ResponseEntity.ok(dinosaurioActualizado);
    }

    /**
     * DELETE /api/dinosaurios/{id}
     * Elimina un dinosaurio
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        dinosaurioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/dinosaurios/epoca/{epoca}
     * Obtiene dinosaurios por época
     */
    @GetMapping("/epoca/{epoca}")
    public ResponseEntity<List<DinosaurioResponseDTO>> obtenerPorEpoca(@PathVariable String epoca) {
        List<DinosaurioResponseDTO> dinosaurios = dinosaurioService.obtenerPorEpoca(epoca);
        return ResponseEntity.ok(dinosaurios);
    }

    /**
     * GET /api/dinosaurios/alimentacion/herbivoros
     * Obtiene dinosaurios herbívoros
     */
    @GetMapping("/alimentacion/herbivoros")
    public ResponseEntity<List<DinosaurioResponseDTO>> obtenerHerbivoros() {
        List<DinosaurioResponseDTO> dinosaurios = dinosaurioService.obtenerHerbivoros();
        return ResponseEntity.ok(dinosaurios);
    }

    /**
     * GET /api/dinosaurios/alimentacion/carnivoros
     * Obtiene dinosaurios carnívoros
     */
    @GetMapping("/alimentacion/carnivoros")
    public ResponseEntity<List<DinosaurioResponseDTO>> obtenerCarnivoros() {
        List<DinosaurioResponseDTO> dinosaurios = dinosaurioService.obtenerCarnivoros();
        return ResponseEntity.ok(dinosaurios);
    }

    /**
     * GET /api/dinosaurios/buscar/{busqueda}
     * Busca dinosaurios por nombre o descripción
     */
    @GetMapping("/buscar/{busqueda}")
    public ResponseEntity<List<DinosaurioResponseDTO>> buscar(@PathVariable String busqueda) {
        List<DinosaurioResponseDTO> dinosaurios = dinosaurioService.buscar(busqueda);
        return ResponseEntity.ok(dinosaurios);
    }

    /**
     * GET /api/dinosaurios/stats/total
     * Obtiene el total de dinosaurios
     */
    @GetMapping("/stats/total")
    public ResponseEntity<Long> obtenerTotal() {
        long total = dinosaurioService.obtenerTotal();
        return ResponseEntity.ok(total);
    }
}

