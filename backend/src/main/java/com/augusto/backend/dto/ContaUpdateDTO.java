package com.augusto.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ContaUpdateDTO {
    
    @JsonProperty("numeroConta")
    private String numeroConta;
    
    public ContaUpdateDTO() {}
    
    public ContaUpdateDTO(String numeroConta) {
        this.numeroConta = numeroConta;
    }
    
    public String getNumeroConta() {
        return numeroConta;
    }
    
    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }
} 