package com.educadino.controller;

import com.educadino.dto.UsuarioCreateDTO;
import com.educadino.dto.UsuarioResponseDTO;
import com.educadino.dto.UsuarioUpdateDTO;
import com.educadino.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de usuarios
 * Endpoints: /api/usuarios
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * GET /api/usuarios
     * Obtiene todos los usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        List<UsuarioResponseDTO> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/usuarios/{id}
     * Obtiene un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/usuarios/email/{email}
     * Obtiene un usuario por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorEmail(@PathVariable String email) {
        UsuarioResponseDTO usuario = usuarioService.obtenerPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    /**
     * POST /api/usuarios
     * Crea un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crear(@Valid @RequestBody UsuarioCreateDTO createDTO) {
        UsuarioResponseDTO usuarioCreado = usuarioService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
    }

    /**
     * PUT /api/usuarios/{id}
     * Actualiza un usuario existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO updateDTO) {
        UsuarioResponseDTO usuarioActualizado = usuarioService.actualizar(id, updateDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }

    /**
     * DELETE /api/usuarios/{id}
     * Elimina un usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/usuarios/rol/{rol}
     * Obtiene usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerPorRol(@PathVariable String rol) {
        List<UsuarioResponseDTO> usuarios = usuarioService.obtenerPorRol(rol);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/usuarios/buscar/{nombre}
     * Busca usuarios por nombre o apellido
     */
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarPorNombre(@PathVariable String nombre) {
        List<UsuarioResponseDTO> usuarios = usuarioService.buscarPorNombre(nombre);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/usuarios/stats/total
     * Obtiene el total de usuarios
     */
    @GetMapping("/stats/total")
    public ResponseEntity<Long> obtenerTotal() {
        long total = usuarioService.obtenerTotalUsuarios();
        return ResponseEntity.ok(total);
    }

    /**
     * GET /api/usuarios/check/email/{email}
     * Verifica si un email existe
     */
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Boolean> existeEmail(@PathVariable String email) {
        boolean existe = usuarioService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }
}

