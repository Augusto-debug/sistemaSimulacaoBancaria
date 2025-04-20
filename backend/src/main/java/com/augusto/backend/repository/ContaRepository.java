package com.augusto.backend.repository;

import com.augusto.backend.domain.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    List<Conta> findByUsuarioId(Long usuarioId);
}