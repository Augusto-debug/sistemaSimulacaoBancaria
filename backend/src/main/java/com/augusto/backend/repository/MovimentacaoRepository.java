// MovimentacaoRepository.java
package com.augusto.backend.repository;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByConta(Conta conta);
    List<Movimentacao> findByContaId(Long contaId);
}