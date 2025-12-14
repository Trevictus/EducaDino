package com.educadino.mapper;

import com.educadino.dto.DinosaurioCreateDTO;
import com.educadino.dto.DinosaurioResponseDTO;
import com.educadino.dto.DinosaurioUpdateDTO;
import com.educadino.entity.Dinosaurio;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidad Dinosaurio y DTOs
 */
@Component
public class DinosaurioMapper {

    /**
     * Convierte una entidad Dinosaurio a DinosaurioResponseDTO
     * @param dinosaurio la entidad Dinosaurio
     * @return DTO de respuesta
     */
    public DinosaurioResponseDTO toResponseDTO(Dinosaurio dinosaurio) {
        if (dinosaurio == null) {
            return null;
        }

        DinosaurioResponseDTO dto = new DinosaurioResponseDTO();
        dto.setIdDino(dinosaurio.getIdDino());
        dto.setNombre(dinosaurio.getNombre());
        dto.setEpoca(dinosaurio.getEpoca());
        dto.setAlimentacion(dinosaurio.getAlimentacion().name());
        dto.setDescripcion(dinosaurio.getDescripcion());
        dto.setImagen(dinosaurio.getImagen());

        return dto;
    }

    /**
     * Convierte DinosaurioCreateDTO a entidad Dinosaurio
     * @param createDTO el DTO de creación
     * @return entidad Dinosaurio
     */
    public Dinosaurio toEntity(DinosaurioCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Dinosaurio dinosaurio = new Dinosaurio();
        dinosaurio.setNombre(createDTO.getNombre());
        dinosaurio.setEpoca(createDTO.getEpoca());
        dinosaurio.setAlimentacion(Dinosaurio.TipoAlimentacion.valueOf(createDTO.getAlimentacion().toUpperCase()));
        dinosaurio.setDescripcion(createDTO.getDescripcion());
        dinosaurio.setImagen(createDTO.getImagen());

        return dinosaurio;
    }

    /**
     * Actualiza una entidad Dinosaurio con datos del DTO de actualización
     * @param updateDTO el DTO de actualización
     * @param dinosaurio la entidad a actualizar
     */
    public void updateEntityFromDTO(DinosaurioUpdateDTO updateDTO, Dinosaurio dinosaurio) {
        if (updateDTO == null || dinosaurio == null) {
            return;
        }

        dinosaurio.setNombre(updateDTO.getNombre());
        dinosaurio.setEpoca(updateDTO.getEpoca());
        dinosaurio.setAlimentacion(Dinosaurio.TipoAlimentacion.valueOf(updateDTO.getAlimentacion().toUpperCase()));
        dinosaurio.setDescripcion(updateDTO.getDescripcion());
        dinosaurio.setImagen(updateDTO.getImagen());
    }
}

