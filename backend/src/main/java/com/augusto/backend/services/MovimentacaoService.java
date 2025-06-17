package com.augusto.backend.services;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Movimentacao;
import com.augusto.backend.domain.Movimentacao.TipoMovimentacao;
import com.augusto.backend.repository.ContaRepository;
import com.augusto.backend.repository.MovimentacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ContaRepository contaRepository;

    MovimentacaoService (MovimentacaoRepository movimentacaoRepository, ContaRepository contaRepository, ContaService contaService) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.contaRepository = contaRepository;
    }
    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAll();
    }
    public Optional<Movimentacao> findById(Long id) {
        return movimentacaoRepository.findById(id);
    }
    public List<Movimentacao> findByContaId(Long contaId) {
        return movimentacaoRepository.findByContaId(contaId);
    }

    @Transactional
    public Movimentacao save(Movimentacao movimentacao) {
        Optional<Conta> optionalConta = contaRepository.findById(movimentacao.getConta().getId());
        if (optionalConta.isPresent()) {
            Conta conta = optionalConta.get();
            BigDecimal saldoAtual = conta.getSaldo();
            if (movimentacao.getTipo() == TipoMovimentacao.DEPOSITO) {
                saldoAtual = saldoAtual.add(movimentacao.getValor());
            } else if (movimentacao.getTipo() == TipoMovimentacao.SAQUE) {
                if (saldoAtual.compareTo(movimentacao.getValor()) < 0) {
                    throw new RuntimeException("Saldo insuficiente");
                }
                saldoAtual = saldoAtual.subtract(movimentacao.getValor());
            }
            conta.setSaldo(saldoAtual);
            contaRepository.save(conta);
            return movimentacaoRepository.save(movimentacao);
        }
        return null;
    }

    @Transactional
    public void deleteById(Long id) {
        Optional<Movimentacao> optionalMovimentacao = movimentacaoRepository.findById(id);
        if (optionalMovimentacao.isPresent()) {
            Movimentacao movimentacao = optionalMovimentacao.get();
            Conta conta = movimentacao.getConta();
            BigDecimal saldoAtual = conta.getSaldo();
            if (movimentacao.getTipo() == TipoMovimentacao.DEPOSITO) {
                saldoAtual = saldoAtual.subtract(movimentacao.getValor());
            } else if (movimentacao.getTipo() == TipoMovimentacao.SAQUE) {
                saldoAtual = saldoAtual.add(movimentacao.getValor());
            }
            conta.setSaldo(saldoAtual);
            contaRepository.save(conta);
            movimentacaoRepository.deleteById(id);
        }
    }

    @Transactional
    public Movimentacao update(Long id, Movimentacao movimentacaoDetails) {
        Optional<Movimentacao> optionalMovimentacao = movimentacaoRepository.findById(id);
        if (optionalMovimentacao.isPresent()) {
            Movimentacao movimentacao = optionalMovimentacao.get();
            movimentacao.setData(movimentacaoDetails.getData());
            return movimentacaoRepository.save(movimentacao);
        }
        return null;
    }
}