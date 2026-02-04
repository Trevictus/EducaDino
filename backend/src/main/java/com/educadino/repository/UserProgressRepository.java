package com.educadino.repository;

import com.educadino.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad UserProgress.
 */
@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);

    List<UserProgress> findByUserIdAndMinigameType(Long userId, String minigameType);

    @Query("SELECT SUM(up.score) FROM UserProgress up WHERE up.user.id = :userId")
    Integer getTotalScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(up.timePlayed) FROM UserProgress up WHERE up.user.id = :userId")
    Integer getTotalTimePlayedByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.completed = true")
    Integer getCompletedMinigamesCount(@Param("userId") Long userId);

    @Query("SELECT up.minigameType, MAX(up.score) FROM UserProgress up WHERE up.user.id = :userId GROUP BY up.minigameType")
    List<Object[]> getBestScoresByMinigame(@Param("userId") Long userId);
}
