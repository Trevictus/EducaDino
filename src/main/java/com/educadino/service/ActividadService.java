package com.educadino.service;

import com.educadino.dto.ActividadCreateDTO;
import com.educadino.dto.ActividadResponseDTO;
import com.educadino.dto.ActividadUpdateDTO;
import com.educadino.entity.Actividad;
import com.educadino.mapper.ActividadMapper;
import com.educadino.repository.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de actividades
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final ActividadMapper actividadMapper;

    /**
     * Obtiene todas las actividades
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerTodas() {
        return actividadRepository.findAll()
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una actividad por ID
     * @param id el ID de la actividad
     * @return ActividadResponseDTO
     * @throws RuntimeException si la actividad no existe
     */
    public ActividadResponseDTO obtenerPorId(Long id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + id));
        return actividadMapper.toResponseDTO(actividad);
    }

    /**
     * Crea una nueva actividad
     * @param createDTO los datos de la actividad a crear
     * @return ActividadResponseDTO de la actividad creada
     */
    public ActividadResponseDTO crear(ActividadCreateDTO createDTO) {
        Actividad actividad = actividadMapper.toEntity(createDTO);
        Actividad actividadGuardada = actividadRepository.save(actividad);
        return actividadMapper.toResponseDTO(actividadGuardada);
    }

    /**
     * Actualiza una actividad existente
     * @param id el ID de la actividad a actualizar
     * @param updateDTO los datos a actualizar
     * @return ActividadResponseDTO de la actividad actualizada
     * @throws RuntimeException si la actividad no existe
     */
    public ActividadResponseDTO actualizar(Long id, ActividadUpdateDTO updateDTO) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + id));

        actividadMapper.updateEntityFromDTO(updateDTO, actividad);
        Actividad actividadActualizada = actividadRepository.save(actividad);
        return actividadMapper.toResponseDTO(actividadActualizada);
    }

    /**
     * Elimina una actividad
     * @param id el ID de la actividad a eliminar
     * @throws RuntimeException si la actividad no existe
     */
    public void eliminar(Long id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + id));
        actividadRepository.delete(actividad);
    }

    /**
     * Obtiene actividades por tipo
     * @param tipo el tipo de actividad
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerPorTipo(String tipo) {
        Actividad.TipoActividad tipoEnum = Actividad.TipoActividad.valueOf(tipo.toUpperCase());
        return actividadRepository.findByTipo(tipoEnum)
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene actividades por nivel de dificultad
     * @param nivel el nivel de dificultad
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerPorNivel(String nivel) {
        Actividad.NivelDificultad nivelEnum = Actividad.NivelDificultad.valueOf(nivel.toUpperCase());
        return actividadRepository.findByNivelDificultad(nivelEnum)
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las actividades de tipo quiz
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerQuiz() {
        return actividadRepository.findAllQuiz()
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las actividades de tipo memoria
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerMemoria() {
        return actividadRepository.findAllMemoria()
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las actividades fáciles
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerFaciles() {
        return actividadRepository.findAllFacil()
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene actividades de un tipo y nivel específicos
     * @param tipo el tipo de actividad
     * @param nivel el nivel de dificultad
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> obtenerPorTipoYNivel(String tipo, String nivel) {
        Actividad.TipoActividad tipoEnum = Actividad.TipoActividad.valueOf(tipo.toUpperCase());
        Actividad.NivelDificultad nivelEnum = Actividad.NivelDificultad.valueOf(nivel.toUpperCase());
        return actividadRepository.findByTipoAndNivel(tipoEnum, nivelEnum)
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca actividades por título o descripción
     * @param busqueda el texto a buscar
     * @return lista de ActividadResponseDTO
     */
    public List<ActividadResponseDTO> buscar(String busqueda) {
        return actividadRepository.buscarPorTituloODescripcion(busqueda)
                .stream()
                .map(actividadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el conteo total de actividades
     * @return número total de actividades
     */
    public long obtenerTotal() {
        return actividadRepository.countActividades();
    }
}

