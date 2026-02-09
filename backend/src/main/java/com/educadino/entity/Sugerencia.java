package com.educadino.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "sugerencias")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sugerencia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;


  @NotBlank(message = "NO TITULO")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String title;

  @NotBlank(message = "NO DESCRIPCION")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String message;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

}
