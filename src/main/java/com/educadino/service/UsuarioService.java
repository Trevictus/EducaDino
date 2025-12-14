package com.educadino.service;

import com.educadino.dto.UsuarioCreateDTO;
import com.educadino.dto.UsuarioResponseDTO;
import com.educadino.dto.UsuarioUpdateDTO;
import com.educadino.entity.Usuario;
import com.educadino.mapper.UsuarioMapper;
import com.educadino.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de usuarios
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtiene todos los usuarios
     * @return lista de UsuarioResponseDTO
     */
    public List<UsuarioResponseDTO> obtenerTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un usuario por ID
     * @param id el ID del usuario
     * @return UsuarioResponseDTO
     * @throws RuntimeException si el usuario no existe
     */
    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toResponseDTO(usuario);
    }

    /**
     * Obtiene un usuario por email
     * @param email el email del usuario
     * @return UsuarioResponseDTO
     * @throws RuntimeException si el usuario no existe
     */
    public UsuarioResponseDTO obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return usuarioMapper.toResponseDTO(usuario);
    }

    /**
     * Crea un nuevo usuario
     * @param createDTO los datos del usuario a crear
     * @return UsuarioResponseDTO del usuario creado
     * @throws RuntimeException si el email ya existe
     */
    public UsuarioResponseDTO crear(UsuarioCreateDTO createDTO) {
        // Verificar que el email no exista
        if (usuarioRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("El email " + createDTO.getEmail() + " ya está registrado");
        }

        Usuario usuario = usuarioMapper.toEntity(createDTO);
        // Encriptar la contraseña
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(usuarioGuardado);
    }

    /**
     * Actualiza un usuario existente
     * @param id el ID del usuario a actualizar
     * @param updateDTO los datos a actualizar
     * @return UsuarioResponseDTO del usuario actualizado
     * @throws RuntimeException si el usuario no existe
     */
    public UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO updateDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Verificar que el nuevo email no exista en otro usuario
        if (!usuario.getEmail().equals(updateDTO.getEmail()) &&
            usuarioRepository.existsByEmail(updateDTO.getEmail())) {
            throw new RuntimeException("El email " + updateDTO.getEmail() + " ya está registrado");
        }

        usuarioMapper.updateEntityFromDTO(updateDTO, usuario);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(usuarioActualizado);
    }

    /**
     * Elimina un usuario
     * @param id el ID del usuario a eliminar
     * @throws RuntimeException si el usuario no existe
     */
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(usuario);
    }

    /**
     * Obtiene todos los usuarios de un rol específico
     * @param rol el rol a filtrar
     * @return lista de UsuarioResponseDTO
     */
    public List<UsuarioResponseDTO> obtenerPorRol(String rol) {
        Usuario.RolUsuario rolEnum = Usuario.RolUsuario.valueOf(rol.toUpperCase());
        return usuarioRepository.findByRol(rolEnum)
                .stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca usuarios por nombre o apellido
     * @param nombre el nombre a buscar
     * @return lista de UsuarioResponseDTO
     */
    public List<UsuarioResponseDTO> buscarPorNombre(String nombre) {
        return usuarioRepository.buscarPorNombre(nombre)
                .stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el conteo total de usuarios
     * @return número total de usuarios
     */
    public long obtenerTotalUsuarios() {
        return usuarioRepository.countUsuarios();
    }

    /**
     * Verifica si un email existe
     * @param email el email a verificar
     * @return true si el email existe, false en caso contrario
     */
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}

