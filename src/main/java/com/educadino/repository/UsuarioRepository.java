package com.educadino.repository;

import com.educadino.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su email
     * @param email el email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si un email ya existe en la base de datos
     * @param email el email a verificar
     * @return true si el email existe, false en caso contrario
     */
    boolean existsByEmail(String email);

    /**
     * Busca todos los usuarios por rol
     * @param rol el rol del usuario
     * @return lista de usuarios con ese rol
     */
    List<Usuario> findByRol(Usuario.RolUsuario rol);

    /**
     * Busca usuarios cuyo nombre o apellido contengan el texto proporcionado
     * @param nombre el texto a buscar en nombre o apellido
     * @return lista de usuarios que coinciden
     */
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) " +
           "OR LOWER(u.apellido) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Usuario> buscarPorNombre(@Param("nombre") String nombre);

    /**
     * Busca todos los alumnos (estudiantes)
     * @return lista de usuarios con rol ALUMNO
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol = 'ALUMNO'")
    List<Usuario> findAllAlumnos();

    /**
     * Busca todos los profesores
     * @return lista de usuarios con rol PROFESOR
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol = 'PROFESOR'")
    List<Usuario> findAllProfesores();

    /**
     * Busca todos los administradores
     * @return lista de usuarios con rol ADMIN
     */
    @Query("SELECT u FROM Usuario u WHERE u.rol = 'ADMIN'")
    List<Usuario> findAllAdmins();

    /**
     * Cuenta el total de usuarios
     * @return número total de usuarios
     */
    long countUsuarios();
}

