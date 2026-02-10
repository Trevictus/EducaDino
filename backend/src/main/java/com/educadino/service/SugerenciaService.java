package com.educadino.service;

import com.educadino.dto.SugerenciaCreateRequest;
import com.educadino.entity.Sugerencia;
import com.educadino.entity.User;
import com.educadino.repository.SugerenciaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SugerenciaService {
  private final SugerenciaRepository sugerenciaRepository;
  private final UserService userService;


  public Sugerencia crear(String username, SugerenciaCreateRequest request) {
    User u = userService.getUserByUsername(username);
    Sugerencia sugerencia = Sugerencia.builder()
            .user(u)
            .title(request.getTitle())
            .message(request.getMessage())
            .build();

    return sugerenciaRepository.save(sugerencia);
  }

  @Transactional
  public List<SugerenciaCreateRequest> getAllComments() {
    return sugerenciaRepository.findAll().stream()
            .map(s -> new SugerenciaCreateRequest(s.getTitle(), s.getMessage()))
            .toList();
  }
}
