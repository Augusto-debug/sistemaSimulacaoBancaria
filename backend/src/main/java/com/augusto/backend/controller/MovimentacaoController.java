// MovimentacaoController.java
package com.augusto.backend.controller;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Movimentacao;
import com.augusto.backend.domain.Movimentacao.TipoMovimentacao;
import com.augusto.backend.services.ContaService;
import com.augusto.backend.services.MovimentacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/movimentacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class MovimentacaoController {

    private MovimentacaoService movimentacaoService;
    private ContaService contaService;

    MovimentacaoController (MovimentacaoService movimentacaoService, ContaService contaService) {
        this.movimentacaoService = movimentacaoService;
        this.contaService = contaService;
    }

    @GetMapping
    public ResponseEntity<List<Movimentacao>> getAllMovimentacoes() {
        List<Movimentacao> movimentacoes = movimentacaoService.findAll();
        return ResponseEntity.ok(movimentacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimentacao> getMovimentacaoById(@PathVariable Long id) {
        Optional<Movimentacao> movimentacao = movimentacaoService.findById(id);
        return movimentacao.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/conta/{contaId}")
    public ResponseEntity<List<Movimentacao>> getMovimentacoesByContaId(@PathVariable Long contaId) {
        List<Movimentacao> movimentacoes = movimentacaoService.findByContaId(contaId);
        return ResponseEntity.ok(movimentacoes);
    }

    @PostMapping
    public ResponseEntity<?> createMovimentacao(@RequestBody Map<String, Object> payload) {
        try {
            Long contaId = Long.parseLong(payload.get("contaId").toString());
            TipoMovimentacao tipo = TipoMovimentacao.valueOf(payload.get("tipo").toString().toUpperCase());
            BigDecimal valor = new BigDecimal(payload.get("valor").toString());
            LocalDate data = LocalDate.parse(payload.get("data").toString());

            Optional<Conta> optionalConta = contaService.findById(contaId);

            if (optionalConta.isPresent()) {
                Conta conta = optionalConta.get();

                Movimentacao novaMovimentacao = new Movimentacao();
                novaMovimentacao.setConta(conta);
                novaMovimentacao.setTipo(tipo);
                novaMovimentacao.setValor(valor);
                novaMovimentacao.setData(data);

                Movimentacao savedMovimentacao = movimentacaoService.save(novaMovimentacao);
                return ResponseEntity.ok(savedMovimentacao);
            }

            return ResponseEntity.badRequest().body("Conta não encontrada");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movimentacao> updateMovimentacao(@PathVariable Long id, @RequestBody Movimentacao movimentacao) {
        Movimentacao updatedMovimentacao = movimentacaoService.update(id, movimentacao);
        if (updatedMovimentacao != null) {
            return ResponseEntity.ok(updatedMovimentacao);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovimentacao(@PathVariable Long id) {
        movimentacaoService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}