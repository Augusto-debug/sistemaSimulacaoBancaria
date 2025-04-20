package com.augusto.backend.services;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.repository.ContaRepository;
import com.augusto.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    private ContaRepository contaRepository;
    private UsuarioRepository usuarioRepository;

    public ContaService(ContaRepository contaRepository, UsuarioRepository usuarioRepository) {
        this.contaRepository = contaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Conta> findAll() {
        return contaRepository.findAll();
    }

    public Optional<Conta> findById(Long id) {
        return contaRepository.findById(id);
    }

    public List<Conta> findByUsuarioId(Long usuarioId) {
        return contaRepository.findByUsuarioId(usuarioId);
    }

    public Conta save(Conta conta) {
        if (conta.getSaldo() == null) {
            conta.setSaldo(BigDecimal.ZERO);
        }
        return contaRepository.save(conta);
    }

    public void deleteById(Long id) {
        contaRepository.deleteById(id);
    }

    public Conta update(Long id, Conta contaDetails) {
        Optional<Conta> optionalConta = contaRepository.findById(id);
        if (optionalConta.isPresent()) {
            Conta conta = optionalConta.get();
            conta.setNumeroConta(contaDetails.getNumeroConta());
            return contaRepository.save(conta);
        }
        return null;
    }

    public Conta createConta(Long usuarioId, String numeroConta) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(usuarioId);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            Conta novaConta = new Conta();
            novaConta.setUsuario(usuario);
            novaConta.setNumeroConta(numeroConta);
            novaConta.setSaldo(BigDecimal.ZERO);
            return contaRepository.save(novaConta);
        }
        return null;
    }

    public Conta atualizarSaldo(Long contaId, BigDecimal valor) {
        Optional<Conta> optionalConta = contaRepository.findById(contaId);
        if (optionalConta.isPresent()) {
            Conta conta = optionalConta.get();
            conta.setSaldo(valor);
            return contaRepository.save(conta);
        }
        return null;
    }
}