package com.augusto.backend.domain;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Table(name = "contas")
public class Conta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroConta;
    private BigDecimal saldo = BigDecimal.ZERO;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @JsonIgnore
    @OneToMany(mappedBy = "conta")
    private List<Movimentacao> movimentacoes = new ArrayList<>();
}