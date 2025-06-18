package com.augusto.backend.services;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.exception.ResourceNotFoundException;
import com.augusto.backend.repository.ContaRepository;
import com.augusto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public ContaService(ContaRepository contaRepository, UsuarioRepository usuarioRepository) {
        this.contaRepository = contaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Conta> findAll() {
        return contaRepository.findAll();
    }

    public Optional<Conta> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID deve ser um número positivo");
        }
        return contaRepository.findById(id);
    }

    public Conta findByIdOrThrow(Long id) {
        return findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada com ID: " + id));
    }

    public List<Conta> findByUsuarioId(Long usuarioId) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID do usuário deve ser um número positivo");
        }
        return contaRepository.findByUsuarioId(usuarioId);
    }

    public Conta save(Conta conta) {
        if (conta == null) {
            throw new IllegalArgumentException("Conta não pode ser nula");
        }
        
        if (conta.getSaldo() == null) {
            conta.setSaldo(BigDecimal.ZERO);
        }
        
        validarNumeroConta(conta.getNumeroConta(), conta.getId());
        
        return contaRepository.save(conta);
    }

    public void deleteById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID deve ser um número positivo");
        }
        
        if (!contaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Conta não encontrada com ID: " + id);
        }
        
        contaRepository.deleteById(id);
    }

    public Conta update(Long id, Conta contaDetails) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID deve ser um número positivo");
        }
        
        if (contaDetails == null) {
            throw new IllegalArgumentException("Dados da conta não podem ser nulos");
        }

        Conta conta = findByIdOrThrow(id);
        
        if (!conta.getNumeroConta().equals(contaDetails.getNumeroConta())) {
            validarNumeroConta(contaDetails.getNumeroConta(), id);
        }
        
        conta.setNumeroConta(contaDetails.getNumeroConta());
        
        return contaRepository.save(conta);
    }

    public Conta createConta(Long usuarioId, String numeroConta) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID do usuário deve ser um número positivo");
        }
        
        if (numeroConta == null || numeroConta.trim().isEmpty()) {
            throw new IllegalArgumentException("Número da conta é obrigatório");
        }
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + usuarioId));
        
        validarNumeroConta(numeroConta, null);
        
        Conta novaConta = new Conta();
        novaConta.setUsuario(usuario);
        novaConta.setNumeroConta(numeroConta.trim());
        novaConta.setSaldo(BigDecimal.ZERO);
        
        return contaRepository.save(novaConta);
    }

    public Conta atualizarSaldo(Long contaId, BigDecimal valor) {
        if (contaId == null || contaId <= 0) {
            throw new IllegalArgumentException("ID da conta deve ser um número positivo");
        }
        
        if (valor == null) {
            throw new IllegalArgumentException("Valor não pode ser nulo");
        }

        Conta conta = findByIdOrThrow(contaId);
        conta.setSaldo(valor);
        
        return contaRepository.save(conta);
    }
    
    private void validarNumeroConta(String numeroConta, Long contaIdExcluir) {
        if (numeroConta == null || numeroConta.trim().isEmpty()) {
            throw new IllegalArgumentException("Número da conta é obrigatório");
        }
        
        List<Conta> contasExistentes = contaRepository.findAll();
        boolean numeroJaExiste = contasExistentes.stream()
                .anyMatch(conta -> conta.getNumeroConta().equals(numeroConta.trim()) && 
                         (contaIdExcluir == null || !conta.getId().equals(contaIdExcluir)));
        
        if (numeroJaExiste) {
            throw new IllegalArgumentException("Já existe uma conta com o número: " + numeroConta);
        }
    }
}