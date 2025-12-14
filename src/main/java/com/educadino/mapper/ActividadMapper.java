package com.educadino.mapper;

import com.educadino.dto.ActividadCreateDTO;
import com.educadino.dto.ActividadResponseDTO;
import com.educadino.dto.ActividadUpdateDTO;
import com.educadino.entity.Actividad;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidad Actividad y DTOs
 */
@Component
public class ActividadMapper {

    /**
     * Convierte una entidad Actividad a ActividadResponseDTO
     * @param actividad la entidad Actividad
     * @return DTO de respuesta
     */
    public ActividadResponseDTO toResponseDTO(Actividad actividad) {
        if (actividad == null) {
            return null;
        }

        ActividadResponseDTO dto = new ActividadResponseDTO();
        dto.setIdActividad(actividad.getIdActividad());
        dto.setTitulo(actividad.getTitulo());
        dto.setDescripcion(actividad.getDescripcion());
        dto.setTipo(actividad.getTipo().name());
        dto.setNivelDificultad(actividad.getNivelDificultad().name());

        return dto;
    }

    /**
     * Convierte ActividadCreateDTO a entidad Actividad
     * @param createDTO el DTO de creación
     * @return entidad Actividad
     */
    public Actividad toEntity(ActividadCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Actividad actividad = new Actividad();
        actividad.setTitulo(createDTO.getTitulo());
        actividad.setDescripcion(createDTO.getDescripcion());
        actividad.setTipo(Actividad.TipoActividad.valueOf(createDTO.getTipo().toUpperCase()));
        actividad.setNivelDificultad(Actividad.NivelDificultad.valueOf(createDTO.getNivelDificultad().toUpperCase()));

        return actividad;
    }

    /**
     * Actualiza una entidad Actividad con datos del DTO de actualización
     * @param updateDTO el DTO de actualización
     * @param actividad la entidad a actualizar
     */
    public void updateEntityFromDTO(ActividadUpdateDTO updateDTO, Actividad actividad) {
        if (updateDTO == null || actividad == null) {
            return;
        }

        actividad.setTitulo(updateDTO.getTitulo());
        actividad.setDescripcion(updateDTO.getDescripcion());
        actividad.setTipo(Actividad.TipoActividad.valueOf(updateDTO.getTipo().toUpperCase()));
        actividad.setNivelDificultad(Actividad.NivelDificultad.valueOf(updateDTO.getNivelDificultad().toUpperCase()));
    }
}

