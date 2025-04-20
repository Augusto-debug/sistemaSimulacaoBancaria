package com.augusto.backend.controller;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.services.ContaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = "http://localhost:5173")
public class ContaController {
    private ContaService contaService;

    ContaController (ContaService contaService) {
        this.contaService = contaService;
    }

    @GetMapping
    public ResponseEntity<List<Conta>> getAllContas() {
        List<Conta> contas = contaService.findAll();
        return ResponseEntity.ok(contas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> getContaById(@PathVariable Long id) {
        Optional<Conta> conta = contaService.findById(id);
        return conta.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Conta>> getContasByUsuarioId(@PathVariable Long usuarioId) {
        List<Conta> contas = contaService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(contas);
    }

    @PostMapping
    public ResponseEntity<Conta> createConta(@RequestBody Map<String, Object> payload) {
        Long usuarioId = Long.parseLong(payload.get("usuarioId").toString());
        String numeroConta = payload.get("numeroConta").toString();

        Conta novaConta = contaService.createConta(usuarioId, numeroConta);

        if (novaConta != null) {
            return ResponseEntity.ok(novaConta);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> updateConta(@PathVariable Long id, @RequestBody Conta conta) {
        Conta updatedConta = contaService.update(id, conta);
        if (updatedConta != null) {
            return ResponseEntity.ok(updatedConta);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConta(@PathVariable Long id) {
        contaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}