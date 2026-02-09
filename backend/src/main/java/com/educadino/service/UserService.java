package com.educadino.service;

import com.educadino.dto.UpdateProfileRequest;
import com.educadino.dto.UserDto;
import com.educadino.entity.User;
import com.educadino.exception.ResourceNotFoundException;
import com.educadino.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Usuarios
 */
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  /**
   * Obtiene el usuario autenticado actual.
   */
  public User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByUsername(username)
      .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
  }

  /**
   * Obtiene el perfil del usuario actual.
   */
  @Transactional(readOnly = true)
  public UserDto getProfile() {
    User user = getCurrentUser();
    return mapToDto(user);
  }

  /**
   * Actualiza el perfil del usuario actual.
   */
  @Transactional
  public UserDto updateProfile(UpdateProfileRequest request) {
    User user = getCurrentUser();

    if (request.getUsername() != null) {
      user.setUsername(request.getUsername());
    }
    if (request.getEmail() != null) {
      user.setEmail(request.getEmail());
    }
    if (request.getAgeRange() != null) {
      user.setAgeRange(request.getAgeRange());
    }
    if (request.getProfileImage() != null) {
      user.setProfileImage(request.getProfileImage());
    }

    userRepository.save(user);
    return mapToDto(user);
  }

  /**
   * Actualiza el tiempo de aprendizaje del usuario.
   */
  @Transactional
  public void addLearningTime(int minutes) {
    User user = getCurrentUser();
    user.setLearningTime(user.getLearningTime() + minutes);
    updateLevel(user);
    userRepository.save(user);
  }

  /**
   * Calcula y actualiza el nivel del usuario según su progreso.
   */
  private void updateLevel(User user) {
    int totalProgress = user.getLearningTime() + (user.getCompletedMinigames() * 10) + (user.getTotalScore() / 100);
    int newLevel = 1 + (totalProgress / 50);
    user.setLevel(Math.min(newLevel, 100)); // Máximo nivel 100
  }

  /**
   * Obtiene todos los usuarios (solo para admin).
   */
  @Transactional(readOnly = true)
  public List<UserDto> getAllUsers() {
    return userRepository.findAll().stream()
      .map(this::mapToDto)
      .collect(Collectors.toList());
  }

  /**
   * Obtiene un usuario por ID (solo para admin).
   */
  @Transactional(readOnly = true)
  public UserDto getUserById(Long id) {
    User user = userRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
    return mapToDto(user);
  }

  @Transactional(readOnly = true)
  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email)
      .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
  }

  @Transactional(readOnly = true)
  public User getUserByUsername(String username) {
    return userRepository.findByUsername(username)
      .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con username: " + username));
  }

  /**
   * Convierte User a UserDto.
   */
  private UserDto mapToDto(User user) {
    return UserDto.builder()
      .id(user.getId())
      .username(user.getUsername())
      .email(user.getEmail())
      .role(user.getRole().name())
      .ageRange(user.getAgeRange())
      .profileImage(user.getProfileImage())
      .level(user.getLevel())
      .learningTime(user.getLearningTime())
      .completedMinigames(user.getCompletedMinigames())
      .totalScore(user.getTotalScore())
      .build();
  }
}
