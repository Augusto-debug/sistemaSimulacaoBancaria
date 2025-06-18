package com.augusto.backend.mapper;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.dto.ContaUpdateDTO;
import org.springframework.stereotype.Component;

@Component
public class ContaMapper {
    
    public Conta updateDtoToEntity(ContaUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Conta conta = new Conta();
        conta.setNumeroConta(dto.getNumeroConta());
        return conta;
    }
    
    public void updateEntityFromDto(Conta existingConta, ContaUpdateDTO dto) {
        if (existingConta == null || dto == null) {
            return;
        }
        
        if (dto.getNumeroConta() != null) {
            existingConta.setNumeroConta(dto.getNumeroConta());
        }
    }
} 