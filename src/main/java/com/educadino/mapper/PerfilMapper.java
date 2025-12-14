package com.educadino.mapper;

import com.educadino.dto.PerfilCreateDTO;
import com.educadino.dto.PerfilResponseDTO;
import com.educadino.dto.PerfilUpdateDTO;
import com.educadino.entity.Perfil;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidad Perfil y DTOs
 */
@Component
public class PerfilMapper {

    /**
     * Convierte una entidad Perfil a PerfilResponseDTO
     * @param perfil la entidad Perfil
     * @return DTO de respuesta
     */
    public PerfilResponseDTO toResponseDTO(Perfil perfil) {
        if (perfil == null) {
            return null;
        }

        PerfilResponseDTO dto = new PerfilResponseDTO();
        dto.setIdPerfil(perfil.getIdPerfil());
        dto.setAvatar(perfil.getAvatar());
        dto.setNivel(perfil.getNivel());
        dto.setPuntos(perfil.getPuntos());

        return dto;
    }

    /**
     * Convierte PerfilCreateDTO a entidad Perfil
     * @param createDTO el DTO de creación
     * @return entidad Perfil
     */
    public Perfil toEntity(PerfilCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Perfil perfil = new Perfil();
        perfil.setAvatar(createDTO.getAvatar());
        perfil.setNivel(createDTO.getNivel());
        perfil.setPuntos(createDTO.getPuntos());

        return perfil;
    }

    /**
     * Actualiza una entidad Perfil con datos del DTO de actualización
     * @param updateDTO el DTO de actualización
     * @param perfil la entidad a actualizar
     */
    public void updateEntityFromDTO(PerfilUpdateDTO updateDTO, Perfil perfil) {
        if (updateDTO == null || perfil == null) {
            return;
        }

        perfil.setAvatar(updateDTO.getAvatar());
        perfil.setNivel(updateDTO.getNivel());
        perfil.setPuntos(updateDTO.getPuntos());
    }
}

