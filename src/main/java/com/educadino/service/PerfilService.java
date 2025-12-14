package com.educadino.service;

import com.educadino.dto.PerfilCreateDTO;
import com.educadino.dto.PerfilResponseDTO;
import com.educadino.dto.PerfilUpdateDTO;
import com.educadino.entity.Perfil;
import com.educadino.entity.Usuario;
import com.educadino.mapper.PerfilMapper;
import com.educadino.repository.PerfilRepository;
import com.educadino.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de perfiles
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PerfilService {

    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilMapper perfilMapper;

    /**
     * Obtiene todos los perfiles
     * @return lista de PerfilResponseDTO
     */
    public List<PerfilResponseDTO> obtenerTodos() {
        return perfilRepository.findAll()
                .stream()
                .map(perfilMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un perfil por ID
     * @param id el ID del perfil
     * @return PerfilResponseDTO
     * @throws RuntimeException si el perfil no existe
     */
    public PerfilResponseDTO obtenerPorId(Long id) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado con ID: " + id));
        return perfilMapper.toResponseDTO(perfil);
    }

    /**
     * Obtiene el perfil de un usuario específico
     * @param idUsuario el ID del usuario
     * @return PerfilResponseDTO
     * @throws RuntimeException si el usuario o su perfil no existen
     */
    public PerfilResponseDTO obtenerPorIdUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));
        Perfil perfil = perfilRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado para el usuario: " + idUsuario));
        return perfilMapper.toResponseDTO(perfil);
    }

    /**
     * Crea un nuevo perfil para un usuario
     * @param idUsuario el ID del usuario
     * @param createDTO los datos del perfil a crear
     * @return PerfilResponseDTO del perfil creado
     * @throws RuntimeException si el usuario no existe
     */
    public PerfilResponseDTO crear(Long idUsuario, PerfilCreateDTO createDTO) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        Perfil perfil = perfilMapper.toEntity(createDTO);
        perfil.setUsuario(usuario);

        Perfil perfilGuardado = perfilRepository.save(perfil);
        return perfilMapper.toResponseDTO(perfilGuardado);
    }

    /**
     * Actualiza un perfil existente
     * @param id el ID del perfil a actualizar
     * @param updateDTO los datos a actualizar
     * @return PerfilResponseDTO del perfil actualizado
     * @throws RuntimeException si el perfil no existe
     */
    public PerfilResponseDTO actualizar(Long id, PerfilUpdateDTO updateDTO) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado con ID: " + id));

        perfilMapper.updateEntityFromDTO(updateDTO, perfil);
        Perfil perfilActualizado = perfilRepository.save(perfil);
        return perfilMapper.toResponseDTO(perfilActualizado);
    }

    /**
     * Elimina un perfil
     * @param id el ID del perfil a eliminar
     * @throws RuntimeException si el perfil no existe
     */
    public void eliminar(Long id) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado con ID: " + id));
        perfilRepository.delete(perfil);
    }

    /**
     * Obtiene perfiles por nivel educativo
     * @param nivel el nivel a filtrar
     * @return lista de PerfilResponseDTO
     */
    public List<PerfilResponseDTO> obtenerPorNivel(String nivel) {
        return perfilRepository.findByNivel(nivel)
                .stream()
                .map(perfilMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el top 10 de perfiles por puntos
     * @return lista de los 10 mejores PerfilResponseDTO
     */
    public List<PerfilResponseDTO> obtenerTop10() {
        return perfilRepository.findTop10ByPuntos()
                .stream()
                .map(perfilMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene perfiles de un nivel ordenados por puntos
     * @param nivel el nivel a filtrar
     * @return lista de PerfilResponseDTO ordenada por puntos
     */
    public List<PerfilResponseDTO> obtenerPorNivelOrdenado(String nivel) {
        return perfilRepository.findByNivelOrderByPuntos(nivel)
                .stream()
                .map(perfilMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Incrementa los puntos de un perfil
     * @param id el ID del perfil
     * @param puntos los puntos a sumar
     * @return PerfilResponseDTO actualizado
     */
    public PerfilResponseDTO incrementarPuntos(Long id, Integer puntos) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado con ID: " + id));
        perfil.setPuntos(perfil.getPuntos() + puntos);
        Perfil perfilActualizado = perfilRepository.save(perfil);
        return perfilMapper.toResponseDTO(perfilActualizado);
    }
}

