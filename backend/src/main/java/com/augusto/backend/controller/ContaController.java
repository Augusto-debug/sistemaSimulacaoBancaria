package com.augusto.backend.controller;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.dto.ContaRequestDTO;
import com.augusto.backend.dto.ContaUpdateDTO;
import com.augusto.backend.mapper.ContaMapper;
import com.augusto.backend.services.ContaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = "http://localhost:5173")
public class ContaController {
    private static final Logger logger = LoggerFactory.getLogger(ContaController.class);
    private final ContaService contaService;
    private final ContaMapper contaMapper;

    @Autowired
    public ContaController(ContaService contaService, ContaMapper contaMapper) {
        this.contaService = contaService;
        this.contaMapper = contaMapper;
    }

    @GetMapping
    public ResponseEntity<List<Conta>> getAllContas() {
        logger.info("Buscando todas as contas");
        List<Conta> contas = contaService.findAll();
        logger.info("Encontradas {} contas", contas.size());
        return ResponseEntity.ok(contas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> getContaById(@PathVariable Long id) {
        logger.info("Buscando conta com ID: {}", id);
        Optional<Conta> conta = contaService.findById(id);
        if (conta.isPresent()) {
            logger.info("Conta encontrada: {}", conta.get().getId());
            return ResponseEntity.ok(conta.get());
        } else {
            logger.warn("Conta não encontrada com ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Conta>> getContasByUsuarioId(@PathVariable Long usuarioId) {
        logger.info("Buscando contas do usuário ID: {}", usuarioId);
        List<Conta> contas = contaService.findByUsuarioId(usuarioId);
        logger.info("Encontradas {} contas para o usuário ID: {}", contas.size(), usuarioId);
        return ResponseEntity.ok(contas);
    }

    @PostMapping
    public ResponseEntity<Conta> createConta(@Valid @RequestBody ContaRequestDTO contaRequest) {
        logger.info("Criando nova conta para usuário ID: {} com número: {}", 
                   contaRequest.getUsuarioId(), contaRequest.getNumeroConta());
        
        Conta novaConta = contaService.createConta(
            contaRequest.getUsuarioId(), 
            contaRequest.getNumeroConta()
        );
        
        logger.info("Conta criada com sucesso. ID: {}", novaConta.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(novaConta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> updateConta(@PathVariable Long id, @RequestBody ContaUpdateDTO contaUpdate) {
        logger.info("Atualizando conta ID: {} com novo número: {}", id, contaUpdate.getNumeroConta());
        
        Conta conta = contaMapper.updateDtoToEntity(contaUpdate);
        
        Conta updatedConta = contaService.update(id, conta);
        logger.info("Conta atualizada com sucesso. ID: {}", updatedConta.getId());
        return ResponseEntity.ok(updatedConta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConta(@PathVariable Long id) {
        logger.info("Deletando conta ID: {}", id);
        contaService.deleteById(id);
        logger.info("Conta deletada com sucesso. ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}