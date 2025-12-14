package com.educadino.controller;

import com.educadino.dto.ActividadCreateDTO;
import com.educadino.dto.ActividadResponseDTO;
import com.educadino.dto.ActividadUpdateDTO;
import com.educadino.service.ActividadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de actividades
 * Endpoints: /api/actividades
 */
@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActividadController {

    private final ActividadService actividadService;

    /**
     * GET /api/actividades
     * Obtiene todas las actividades
     */
    @GetMapping
    public ResponseEntity<List<ActividadResponseDTO>> obtenerTodas() {
        List<ActividadResponseDTO> actividades = actividadService.obtenerTodas();
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/{id}
     * Obtiene una actividad por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponseDTO> obtenerPorId(@PathVariable Long id) {
        ActividadResponseDTO actividad = actividadService.obtenerPorId(id);
        return ResponseEntity.ok(actividad);
    }

    /**
     * POST /api/actividades
     * Crea una nueva actividad
     */
    @PostMapping
    public ResponseEntity<ActividadResponseDTO> crear(@Valid @RequestBody ActividadCreateDTO createDTO) {
        ActividadResponseDTO actividadCreada = actividadService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(actividadCreada);
    }

    /**
     * PUT /api/actividades/{id}
     * Actualiza una actividad existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActividadUpdateDTO updateDTO) {
        ActividadResponseDTO actividadActualizada = actividadService.actualizar(id, updateDTO);
        return ResponseEntity.ok(actividadActualizada);
    }

    /**
     * DELETE /api/actividades/{id}
     * Elimina una actividad
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/actividades/tipo/{tipo}
     * Obtiene actividades por tipo
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerPorTipo(@PathVariable String tipo) {
        List<ActividadResponseDTO> actividades = actividadService.obtenerPorTipo(tipo);
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/nivel/{nivel}
     * Obtiene actividades por nivel de dificultad
     */
    @GetMapping("/nivel/{nivel}")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerPorNivel(@PathVariable String nivel) {
        List<ActividadResponseDTO> actividades = actividadService.obtenerPorNivel(nivel);
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/tipo/quiz
     * Obtiene todas las actividades de tipo quiz
     */
    @GetMapping("/tipo/quiz")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerQuiz() {
        List<ActividadResponseDTO> actividades = actividadService.obtenerQuiz();
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/tipo/memoria
     * Obtiene todas las actividades de tipo memoria
     */
    @GetMapping("/tipo/memoria")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerMemoria() {
        List<ActividadResponseDTO> actividades = actividadService.obtenerMemoria();
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/nivel/facil
     * Obtiene todas las actividades fáciles
     */
    @GetMapping("/nivel/facil")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerFaciles() {
        List<ActividadResponseDTO> actividades = actividadService.obtenerFaciles();
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/tipo/{tipo}/nivel/{nivel}
     * Obtiene actividades de un tipo y nivel específicos
     */
    @GetMapping("/tipo/{tipo}/nivel/{nivel}")
    public ResponseEntity<List<ActividadResponseDTO>> obtenerPorTipoYNivel(
            @PathVariable String tipo,
            @PathVariable String nivel) {
        List<ActividadResponseDTO> actividades = actividadService.obtenerPorTipoYNivel(tipo, nivel);
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/buscar/{busqueda}
     * Busca actividades por título o descripción
     */
    @GetMapping("/buscar/{busqueda}")
    public ResponseEntity<List<ActividadResponseDTO>> buscar(@PathVariable String busqueda) {
        List<ActividadResponseDTO> actividades = actividadService.buscar(busqueda);
        return ResponseEntity.ok(actividades);
    }

    /**
     * GET /api/actividades/stats/total
     * Obtiene el total de actividades
     */
    @GetMapping("/stats/total")
    public ResponseEntity<Long> obtenerTotal() {
        long total = actividadService.obtenerTotal();
        return ResponseEntity.ok(total);
    }
}

