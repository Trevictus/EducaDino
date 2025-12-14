package com.educadino.mapper;

import com.educadino.dto.*;
import com.educadino.entity.Usuario;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidad Usuario y DTOs
 */
@Component
public class UsuarioMapper {

    /**
     * Convierte una entidad Usuario a UsuarioResponseDTO
     * @param usuario la entidad Usuario
     * @return DTO de respuesta sin contraseña
     */
    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol().name());
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaActualizacion(usuario.getFechaActualizacion());

        if (usuario.getPerfil() != null) {
            PerfilResponseDTO perfilDTO = new PerfilResponseDTO();
            perfilDTO.setIdPerfil(usuario.getPerfil().getIdPerfil());
            perfilDTO.setAvatar(usuario.getPerfil().getAvatar());
            perfilDTO.setNivel(usuario.getPerfil().getNivel());
            perfilDTO.setPuntos(usuario.getPerfil().getPuntos());
            dto.setPerfil(perfilDTO);
        }

        return dto;
    }

    /**
     * Convierte UsuarioCreateDTO a entidad Usuario
     * @param createDTO el DTO de creación
     * @return entidad Usuario
     */
    public Usuario toEntity(UsuarioCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(createDTO.getNombre());
        usuario.setApellido(createDTO.getApellido());
        usuario.setEmail(createDTO.getEmail());
        usuario.setContrasena(createDTO.getContrasena());
        usuario.setRol(Usuario.RolUsuario.valueOf(createDTO.getRol().toUpperCase()));

        return usuario;
    }

    /**
     * Actualiza una entidad Usuario con datos del DTO de actualización
     * @param updateDTO el DTO de actualización
     * @param usuario la entidad a actualizar
     */
    public void updateEntityFromDTO(UsuarioUpdateDTO updateDTO, Usuario usuario) {
        if (updateDTO == null || usuario == null) {
            return;
        }

        usuario.setNombre(updateDTO.getNombre());
        usuario.setApellido(updateDTO.getApellido());
        usuario.setEmail(updateDTO.getEmail());
        usuario.setRol(Usuario.RolUsuario.valueOf(updateDTO.getRol().toUpperCase()));
    }
}

