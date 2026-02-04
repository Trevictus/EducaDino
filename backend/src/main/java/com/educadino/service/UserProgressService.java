package com.educadino.service;

import com.educadino.dto.SaveProgressRequest;
import com.educadino.dto.UserProgressDto;
import com.educadino.entity.User;
import com.educadino.entity.UserProgress;
import com.educadino.repository.UserProgressRepository;
import com.educadino.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio de Progreso de Usuario
 *
 * Maneja el registro y consulta del progreso en minijuegos.
 */
@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    /**
     * Guarda el progreso de un minijuego.
     */
    @Transactional
    public UserProgressDto saveProgress(SaveProgressRequest request) {
        User user = userService.getCurrentUser();

        UserProgress progress = UserProgress.builder()
                .user(user)
                .minigameType(request.getMinigameType())
                .score(request.getScore())
                .timePlayed(request.getTimePlayed())
                .completed(request.getCompleted())
                .build();

        progressRepository.save(progress);

        // Actualizar estadísticas del usuario
        updateUserStats(user);

        return mapToDto(progress);
    }

    /**
     * Obtiene todo el progreso del usuario actual.
     */
    @Transactional(readOnly = true)
    public List<UserProgressDto> getMyProgress() {
        User user = userService.getCurrentUser();
        return progressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el progreso por tipo de minijuego.
     */
    @Transactional(readOnly = true)
    public List<UserProgressDto> getProgressByMinigame(String minigameType) {
        User user = userService.getCurrentUser();
        return progressRepository.findByUserIdAndMinigameType(user.getId(), minigameType).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene las estadísticas resumidas del usuario.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        User user = userService.getCurrentUser();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalScore", progressRepository.getTotalScoreByUserId(user.getId()));
        stats.put("totalTimePlayed", progressRepository.getTotalTimePlayedByUserId(user.getId()));
        stats.put("completedMinigames", progressRepository.getCompletedMinigamesCount(user.getId()));
        stats.put("level", user.getLevel());
        stats.put("learningTime", user.getLearningTime());

        // Mejores puntuaciones por minijuego
        Map<String, Integer> bestScores = new HashMap<>();
        List<Object[]> scores = progressRepository.getBestScoresByMinigame(user.getId());
        for (Object[] row : scores) {
            bestScores.put((String) row[0], ((Number) row[1]).intValue());
        }
        stats.put("bestScores", bestScores);

        return stats;
    }

    /**
     * Actualiza las estadísticas del usuario después de guardar progreso.
     */
    private void updateUserStats(User user) {
        Integer totalScore = progressRepository.getTotalScoreByUserId(user.getId());
        Integer completedCount = progressRepository.getCompletedMinigamesCount(user.getId());
        Integer totalTime = progressRepository.getTotalTimePlayedByUserId(user.getId());

        user.setTotalScore(totalScore != null ? totalScore : 0);
        user.setCompletedMinigames(completedCount != null ? completedCount : 0);

        // Añadir tiempo de juego al tiempo de aprendizaje (convertir segundos a minutos)
        if (totalTime != null) {
            user.setLearningTime(totalTime / 60);
        }

        // Calcular nivel
        int progress = user.getLearningTime() + (user.getCompletedMinigames() * 10) + (user.getTotalScore() / 100);
        user.setLevel(Math.min(1 + (progress / 50), 100));

        userRepository.save(user);
    }

    /**
     * Convierte UserProgress a UserProgressDto.
     */
    private UserProgressDto mapToDto(UserProgress progress) {
        return UserProgressDto.builder()
                .id(progress.getId())
                .userId(progress.getUser().getId())
                .minigameType(progress.getMinigameType())
                .score(progress.getScore())
                .timePlayed(progress.getTimePlayed())
                .completed(progress.getCompleted())
                .playedAt(progress.getPlayedAt())
                .build();
    }
}
