package com.educadino.service;

import com.educadino.dto.DinosaurioCreateDTO;
import com.educadino.dto.DinosaurioResponseDTO;
import com.educadino.dto.DinosaurioUpdateDTO;
import com.educadino.entity.Dinosaurio;
import com.educadino.mapper.DinosaurioMapper;
import com.educadino.repository.DinosaurioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de dinosaurios
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DinosaurioService {

    private final DinosaurioRepository dinosaurioRepository;
    private final DinosaurioMapper dinosaurioMapper;

    /**
     * Obtiene todos los dinosaurios
     * @return lista de DinosaurioResponseDTO
     */
    public List<DinosaurioResponseDTO> obtenerTodos() {
        return dinosaurioRepository.findAll()
                .stream()
                .map(dinosaurioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un dinosaurio por ID
     * @param id el ID del dinosaurio
     * @return DinosaurioResponseDTO
     * @throws RuntimeException si el dinosaurio no existe
     */
    public DinosaurioResponseDTO obtenerPorId(Long id) {
        Dinosaurio dinosaurio = dinosaurioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dinosaurio no encontrado con ID: " + id));
        return dinosaurioMapper.toResponseDTO(dinosaurio);
    }

    /**
     * Obtiene un dinosaurio por nombre
     * @param nombre el nombre del dinosaurio
     * @return DinosaurioResponseDTO
     * @throws RuntimeException si el dinosaurio no existe
     */
    public DinosaurioResponseDTO obtenerPorNombre(String nombre) {
        Dinosaurio dinosaurio = dinosaurioRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Dinosaurio no encontrado con nombre: " + nombre));
        return dinosaurioMapper.toResponseDTO(dinosaurio);
    }

    /**
     * Crea un nuevo dinosaurio
     * @param createDTO los datos del dinosaurio a crear
     * @return DinosaurioResponseDTO del dinosaurio creado
     * @throws RuntimeException si el nombre ya existe
     */
    public DinosaurioResponseDTO crear(DinosaurioCreateDTO createDTO) {
        if (dinosaurioRepository.existsByNombre(createDTO.getNombre())) {
            throw new RuntimeException("El dinosaurio " + createDTO.getNombre() + " ya existe");
        }

        Dinosaurio dinosaurio = dinosaurioMapper.toEntity(createDTO);
        Dinosaurio dinosaurioGuardado = dinosaurioRepository.save(dinosaurio);
        return dinosaurioMapper.toResponseDTO(dinosaurioGuardado);
    }

    /**
     * Actualiza un dinosaurio existente
     * @param id el ID del dinosaurio a actualizar
     * @param updateDTO los datos a actualizar
     * @return DinosaurioResponseDTO del dinosaurio actualizado
     * @throws RuntimeException si el dinosaurio no existe
     */
    public DinosaurioResponseDTO actualizar(Long id, DinosaurioUpdateDTO updateDTO) {
        Dinosaurio dinosaurio = dinosaurioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dinosaurio no encontrado con ID: " + id));

        // Verificar que el nuevo nombre no exista en otro dinosaurio
        if (!dinosaurio.getNombre().equals(updateDTO.getNombre()) &&
            dinosaurioRepository.existsByNombre(updateDTO.getNombre())) {
            throw new RuntimeException("El dinosaurio " + updateDTO.getNombre() + " ya existe");
        }

        dinosaurioMapper.updateEntityFromDTO(updateDTO, dinosaurio);
        Dinosaurio dinosaurioActualizado = dinosaurioRepository.save(dinosaurio);
        return dinosaurioMapper.toResponseDTO(dinosaurioActualizado);
    }

    /**
     * Elimina un dinosaurio
     * @param id el ID del dinosaurio a eliminar
     * @throws RuntimeException si el dinosaurio no existe
     */
    public void eliminar(Long id) {
        Dinosaurio dinosaurio = dinosaurioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dinosaurio no encontrado con ID: " + id));
        dinosaurioRepository.delete(dinosaurio);
    }

    /**
     * Obtiene dinosaurios por época
     * @param epoca la época geológica
     * @return lista de DinosaurioResponseDTO
     */
    public List<DinosaurioResponseDTO> obtenerPorEpoca(String epoca) {
        return dinosaurioRepository.findByEpoca(epoca)
                .stream()
                .map(dinosaurioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene dinosaurios herbívoros
     * @return lista de DinosaurioResponseDTO herbívoros
     */
    public List<DinosaurioResponseDTO> obtenerHerbivoros() {
        return dinosaurioRepository.findAllHerbivoros()
                .stream()
                .map(dinosaurioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene dinosaurios carnívoros
     * @return lista de DinosaurioResponseDTO carnívoros
     */
    public List<DinosaurioResponseDTO> obtenerCarnivoros() {
        return dinosaurioRepository.findAllCarnivoros()
                .stream()
                .map(dinosaurioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca dinosaurios por nombre o descripción
     * @param busqueda el texto a buscar
     * @return lista de DinosaurioResponseDTO
     */
    public List<DinosaurioResponseDTO> buscar(String busqueda) {
        return dinosaurioRepository.buscarPorNombreODescripcion(busqueda)
                .stream()
                .map(dinosaurioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el conteo total de dinosaurios
     * @return número total de dinosaurios
     */
    public long obtenerTotal() {
        return dinosaurioRepository.countDinosaurios();
    }
}

