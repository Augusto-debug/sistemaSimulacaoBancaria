package com.augusto.backend.controller;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.dto.ContaRequestDTO;
import com.augusto.backend.dto.ContaUpdateDTO;
import com.augusto.backend.mapper.ContaMapper;
import com.augusto.backend.services.ContaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContaController.class)
@DisplayName("Testes do ContaController")
class ContaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContaService contaService;

    @MockBean
    private ContaMapper contaMapper;

    private Usuario usuarioTeste;
    private Conta contaTeste;
    private List<Conta> contasList;

    @BeforeEach
    void setUp() {
        usuarioTeste = new Usuario();
        usuarioTeste.setId(1L);
        usuarioTeste.setNome("João Silva");
        usuarioTeste.setCpf("12345678901");

        contaTeste = new Conta();
        contaTeste.setId(1L);
        contaTeste.setNumeroConta("123456");
        contaTeste.setSaldo(BigDecimal.valueOf(1000.00));
        contaTeste.setUsuario(usuarioTeste);

        Conta conta2 = new Conta();
        conta2.setId(2L);
        conta2.setNumeroConta("789012");
        conta2.setSaldo(BigDecimal.valueOf(2500.50));
        conta2.setUsuario(usuarioTeste);

        contasList = Arrays.asList(contaTeste, conta2);
    }

    @Test
    @DisplayName("GET /api/contas - Deve retornar todas as contas")
    void getAllContas_DeveRetornarTodasAsContas() throws Exception {
        when(contaService.findAll()).thenReturn(contasList);

        mockMvc.perform(get("/api/contas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].numeroConta").value("123456"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].numeroConta").value("789012"));

        verify(contaService).findAll();
    }

    @Test
    @DisplayName("GET /api/contas/{id} - Deve retornar conta por ID")
    void getContaById_DeveRetornarContaPorId() throws Exception {
        when(contaService.findById(1L)).thenReturn(Optional.of(contaTeste));

        mockMvc.perform(get("/api/contas/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.numeroConta").value("123456"))
                .andExpect(jsonPath("$.saldo").value(1000.00));

        verify(contaService).findById(1L);
    }

    @Test
    @DisplayName("GET /api/contas/{id} - Deve retornar 404 para conta inexistente")
    void getContaById_DeveRetornar404ParaContaInexistente() throws Exception {
        when(contaService.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/contas/999"))
                .andExpect(status().isNotFound());

        verify(contaService).findById(999L);
    }

    @Test
    @DisplayName("GET /api/contas/usuario/{usuarioId} - Deve retornar contas por usuário")
    void getContasByUsuarioId_DeveRetornarContasPorUsuario() throws Exception {
        when(contaService.findByUsuarioId(1L)).thenReturn(contasList);

        mockMvc.perform(get("/api/contas/usuario/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2));

        verify(contaService).findByUsuarioId(1L);
    }

    @Test
    @DisplayName("POST /api/contas - Deve criar nova conta")
    void createConta_DeveCriarNovaConta() throws Exception {
        ContaRequestDTO request = new ContaRequestDTO(1L, "999999");
        when(contaService.createConta(1L, "999999")).thenReturn(contaTeste);

        mockMvc.perform(post("/api/contas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.numeroConta").value("123456"));

        verify(contaService).createConta(1L, "999999");
    }

    @Test
    @DisplayName("PUT /api/contas/{id} - Deve atualizar conta")
    void updateConta_DeveAtualizarConta() throws Exception {
        ContaUpdateDTO request = new ContaUpdateDTO("888888");
        Conta contaMapeada = new Conta();
        contaMapeada.setNumeroConta("888888");

        when(contaMapper.updateDtoToEntity(any(ContaUpdateDTO.class))).thenReturn(contaMapeada);
        when(contaService.update(eq(1L), any(Conta.class))).thenReturn(contaTeste);

        mockMvc.perform(put("/api/contas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1));

        verify(contaMapper).updateDtoToEntity(any(ContaUpdateDTO.class));
        verify(contaService).update(eq(1L), any(Conta.class));
    }

    @Test
    @DisplayName("DELETE /api/contas/{id} - Deve deletar conta")
    void deleteConta_DeveDeletarConta() throws Exception {
        doNothing().when(contaService).deleteById(1L);

        mockMvc.perform(delete("/api/contas/1"))
                .andExpect(status().isNoContent());

        verify(contaService).deleteById(1L);
    }

    @Test
    @DisplayName("GET /api/contas/{id} - Deve lidar com ID inválido")
    void getContaById_DeveLidarComIdInvalido() throws Exception {
        when(contaService.findById(-1L)).thenThrow(new IllegalArgumentException("ID deve ser um número positivo"));

        mockMvc.perform(get("/api/contas/-1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/contas - Deve validar dados obrigatórios")
    void createConta_DeveValidarDadosObrigatorios() throws Exception {
        ContaRequestDTO request = new ContaRequestDTO(null, "123456");

        mockMvc.perform(post("/api/contas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
} 