package com.augusto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tipo;
    private Long userId;
    private String nome;
    private String email;
} 