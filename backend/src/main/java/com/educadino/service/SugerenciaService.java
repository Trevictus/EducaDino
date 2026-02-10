package com.educadino.service;

import com.educadino.dto.SugerenciaCreateRequest;
import com.educadino.entity.Sugerencia;
import com.educadino.entity.User;
import com.educadino.repository.SugerenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

  public Sugerencia getAllcomments(){
    return sugerenciaRepository.findAll().get(0);
  }
}
