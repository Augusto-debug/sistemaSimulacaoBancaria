package com.augusto.backend.integration;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.dto.ContaRequestDTO;
import com.augusto.backend.dto.ContaUpdateDTO;
import com.augusto.backend.repository.ContaRepository;
import com.augusto.backend.repository.MovimentacaoRepository;
import com.augusto.backend.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@DisplayName("Testes de Integração - Contas")
class ContaIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private Usuario usuarioTeste;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // Limpar dados anteriores respeitando foreign keys
        // Primeiro, buscar e deletar movimentações
        movimentacaoRepository.deleteAll();
        movimentacaoRepository.flush();
        
        // Depois deletar contas
        contaRepository.deleteAll();
        contaRepository.flush();
        
        // Por último, deletar usuários
        usuarioRepository.deleteAll();
        usuarioRepository.flush();

        // Criar usuário de teste
        usuarioTeste = new Usuario();
        usuarioTeste.setNome("João Silva");
        usuarioTeste.setCpf("12345678901");
        usuarioTeste.setEndereco("Rua Teste, 123");
        usuarioTeste = usuarioRepository.save(usuarioTeste);
        usuarioRepository.flush();
    }

    @Test
    @DisplayName("Deve criar conta com sucesso")
    void criarConta_DeveCriarContaComSucesso() throws Exception {
        // Given
        ContaRequestDTO request = new ContaRequestDTO(usuarioTeste.getId(), "123456");

        // When & Then
        mockMvc.perform(post("/api/contas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroConta").value("123456"))
                .andExpect(jsonPath("$.saldo").value(0))
                .andExpect(jsonPath("$.usuario.id").value(usuarioTeste.getId()));

        // Verificar se foi salvo no banco
        assert contaRepository.count() == 1;
    }

    @Test
    @DisplayName("Deve listar todas as contas")
    void listarContas_DeveRetornarTodasAsContas() throws Exception {
        // Given - Criar algumas contas
        Conta conta1 = new Conta();
        conta1.setNumeroConta("123456");
        conta1.setSaldo(BigDecimal.valueOf(1000));
        conta1.setUsuario(usuarioTeste);
        contaRepository.save(conta1);

        Conta conta2 = new Conta();
        conta2.setNumeroConta("789012");
        conta2.setSaldo(BigDecimal.valueOf(2000));
        conta2.setUsuario(usuarioTeste);
        contaRepository.save(conta2);

        // When & Then
        mockMvc.perform(get("/api/contas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].numeroConta").value("123456"))
                .andExpect(jsonPath("$[1].numeroConta").value("789012"));
    }

    @Test
    @DisplayName("Deve buscar conta por ID")
    void buscarContaPorId_DeveRetornarContaCorreta() throws Exception {
        // Given
        Conta conta = new Conta();
        conta.setNumeroConta("123456");
        conta.setSaldo(BigDecimal.valueOf(1000));
        conta.setUsuario(usuarioTeste);
        conta = contaRepository.save(conta);

        // When & Then
        mockMvc.perform(get("/api/contas/" + conta.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(conta.getId()))
                .andExpect(jsonPath("$.numeroConta").value("123456"))
                .andExpect(jsonPath("$.saldo").value(1000));
    }

    @Test
    @DisplayName("Deve retornar 404 para conta inexistente")
    void buscarContaPorId_DeveRetornar404ParaContaInexistente() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/contas/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve buscar contas por usuário")
    void buscarContasPorUsuario_DeveRetornarContasDoUsuario() throws Exception {
        // Given
        Conta conta1 = new Conta();
        conta1.setNumeroConta("123456");
        conta1.setSaldo(BigDecimal.valueOf(1000));
        conta1.setUsuario(usuarioTeste);
        contaRepository.save(conta1);

        Conta conta2 = new Conta();
        conta2.setNumeroConta("789012");
        conta2.setSaldo(BigDecimal.valueOf(2000));
        conta2.setUsuario(usuarioTeste);
        contaRepository.save(conta2);

        // When & Then
        mockMvc.perform(get("/api/contas/usuario/" + usuarioTeste.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("Deve atualizar conta com sucesso")
    void atualizarConta_DeveAtualizarContaComSucesso() throws Exception {
        // Given
        Conta conta = new Conta();
        conta.setNumeroConta("123456");
        conta.setSaldo(BigDecimal.valueOf(1000));
        conta.setUsuario(usuarioTeste);
        conta = contaRepository.save(conta);

        ContaUpdateDTO request = new ContaUpdateDTO("999999");

        // When & Then
        mockMvc.perform(put("/api/contas/" + conta.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numeroConta").value("999999"));

        // Verificar se foi atualizado no banco
        Conta contaAtualizada = contaRepository.findById(conta.getId()).orElse(null);
        assert contaAtualizada != null;
        assert contaAtualizada.getNumeroConta().equals("999999");
    }

    @Test
    @DisplayName("Deve deletar conta com sucesso")
    void deletarConta_DeveDeletarContaComSucesso() throws Exception {
        // Given
        Conta conta = new Conta();
        conta.setNumeroConta("123456");
        conta.setSaldo(BigDecimal.valueOf(1000));
        conta.setUsuario(usuarioTeste);
        conta = contaRepository.save(conta);

        // When & Then
        mockMvc.perform(delete("/api/contas/" + conta.getId()))
                .andExpect(status().isNoContent());

        // Verificar se foi deletado do banco
        assert contaRepository.findById(conta.getId()).isEmpty();
    }
} 