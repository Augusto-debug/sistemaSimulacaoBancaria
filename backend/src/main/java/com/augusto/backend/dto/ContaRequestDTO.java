package com.augusto.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class ContaRequestDTO {
    
    @JsonProperty("usuarioId")
    @NotNull(message = "ID do usuário é obrigatório")
    private Long usuarioId;
    
    @JsonProperty("numeroConta")
    @NotBlank(message = "Número da conta é obrigatório")
    private String numeroConta;
    
    public ContaRequestDTO() {}
    
    public ContaRequestDTO(Long usuarioId, String numeroConta) {
        this.usuarioId = usuarioId;
        this.numeroConta = numeroConta;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public String getNumeroConta() {
        return numeroConta;
    }
    
    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }
} 