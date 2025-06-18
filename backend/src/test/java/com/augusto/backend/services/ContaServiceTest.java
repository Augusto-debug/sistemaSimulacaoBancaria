package com.augusto.backend.services;

import com.augusto.backend.domain.Conta;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.exception.ResourceNotFoundException;
import com.augusto.backend.repository.ContaRepository;
import com.augusto.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do ContaService")
class ContaServiceTest {

    @Mock
    private ContaRepository contaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ContaService contaService;

    private Usuario usuarioTeste;
    private Conta contaTeste;
    private List<Conta> contasList;

    @BeforeEach
    void setUp() {
        usuarioTeste = new Usuario();
        usuarioTeste.setId(1L);
        usuarioTeste.setNome("João Silva");
        usuarioTeste.setCpf("12345678901");
        usuarioTeste.setEndereco("Rua Teste, 123");

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
    @DisplayName("Deve retornar todas as contas")
    void findAll_DeveRetornarTodasAsContas() {
        // Given
        when(contaRepository.findAll()).thenReturn(contasList);

        // When
        List<Conta> resultado = contaService.findAll();

        // Then
        assertThat(resultado).hasSize(2);
        assertThat(resultado).containsExactlyElementsOf(contasList);
        verify(contaRepository).findAll();
    }

    @Test
    @DisplayName("Deve encontrar conta por ID")
    void findById_DeveEncontrarContaPorId() {
        // Given
        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaTeste));

        // When
        Optional<Conta> resultado = contaService.findById(1L);

        // Then
        assertThat(resultado).isPresent();
        assertThat(resultado.get()).isEqualTo(contaTeste);
        verify(contaRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção para ID inválido")
    void findById_DeveLancarExcecaoParaIdInvalido() {
        // Given & When & Then
        assertThatThrownBy(() -> contaService.findById(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID deve ser um número positivo");

        assertThatThrownBy(() -> contaService.findById(0L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID deve ser um número positivo");

        assertThatThrownBy(() -> contaService.findById(-1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID deve ser um número positivo");
    }

    @Test
    @DisplayName("Deve encontrar conta por ID ou lançar exceção")
    void findByIdOrThrow_DeveEncontrarContaOuLancarExcecao() {
        // Given
        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaTeste));

        // When
        Conta resultado = contaService.findByIdOrThrow(1L);

        // Then
        assertThat(resultado).isEqualTo(contaTeste);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando conta não existe")
    void findByIdOrThrow_DeveLancarResourceNotFoundExceptionQuandoContaNaoExiste() {
        // Given
        when(contaRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> contaService.findByIdOrThrow(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Conta não encontrada com ID: 999");
    }

    @Test
    @DisplayName("Deve encontrar contas por ID do usuário")
    void findByUsuarioId_DeveEncontrarContasPorUsuarioId() {
        // Given
        when(contaRepository.findByUsuarioId(1L)).thenReturn(contasList);

        // When
        List<Conta> resultado = contaService.findByUsuarioId(1L);

        // Then
        assertThat(resultado).hasSize(2);
        assertThat(resultado).containsExactlyElementsOf(contasList);
        verify(contaRepository).findByUsuarioId(1L);
    }

    @Test
    @DisplayName("Deve salvar conta com sucesso")
    void save_DeveSalvarContaComSucesso() {
        // Given
        Conta novaConta = new Conta();
        novaConta.setNumeroConta("555555");
        novaConta.setUsuario(usuarioTeste);

        when(contaRepository.findAll()).thenReturn(Arrays.asList(contaTeste));
        when(contaRepository.save(any(Conta.class))).thenReturn(novaConta);

        // When
        Conta resultado = contaService.save(novaConta);

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getSaldo()).isEqualTo(BigDecimal.ZERO);
        verify(contaRepository).save(novaConta);
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar conta nula")
    void save_DeveLancarExcecaoAoSalvarContaNula() {
        // When & Then
        assertThatThrownBy(() -> contaService.save(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Conta não pode ser nula");
    }

    @Test
    @DisplayName("Deve criar conta com sucesso")
    void createConta_DeveCriarContaComSucesso() {
        // Given
        String numeroConta = "999999";
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTeste));
        when(contaRepository.findAll()).thenReturn(Arrays.asList(contaTeste));
        when(contaRepository.save(any(Conta.class))).thenReturn(contaTeste);

        // When
        Conta resultado = contaService.createConta(1L, numeroConta);

        // Then
        assertThat(resultado).isNotNull();
        verify(usuarioRepository).findById(1L);
        verify(contaRepository).save(any(Conta.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar conta com usuário inexistente")
    void createConta_DeveLancarExcecaoAoCriarContaComUsuarioInexistente() {
        // Given
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> contaService.createConta(999L, "123456"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuário não encontrado com ID: 999");
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar conta com número duplicado")
    void createConta_DeveLancarExcecaoAoCriarContaComNumeroDuplicado() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTeste));
        when(contaRepository.findAll()).thenReturn(Arrays.asList(contaTeste));

        // When & Then
        assertThatThrownBy(() -> contaService.createConta(1L, "123456"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Já existe uma conta com o número: 123456");
    }

    @Test
    @DisplayName("Deve atualizar conta com sucesso")
    void update_DeveAtualizarContaComSucesso() {
        // Given
        Conta contaAtualizada = new Conta();
        contaAtualizada.setNumeroConta("888888");

        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaTeste));
        when(contaRepository.findAll()).thenReturn(Arrays.asList(contaTeste));
        when(contaRepository.save(any(Conta.class))).thenReturn(contaTeste);

        // When
        Conta resultado = contaService.update(1L, contaAtualizada);

        // Then
        assertThat(resultado).isNotNull();
        verify(contaRepository).findById(1L);
        verify(contaRepository).save(any(Conta.class));
    }

    @Test
    @DisplayName("Deve deletar conta com sucesso")
    void deleteById_DeveDeletarContaComSucesso() {
        // Given
        when(contaRepository.existsById(1L)).thenReturn(true);

        // When
        contaService.deleteById(1L);

        // Then
        verify(contaRepository).existsById(1L);
        verify(contaRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar conta inexistente")
    void deleteById_DeveLancarExcecaoAoDeletarContaInexistente() {
        // Given
        when(contaRepository.existsById(999L)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> contaService.deleteById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Conta não encontrada com ID: 999");
    }

    @Test
    @DisplayName("Deve atualizar saldo com sucesso")
    void atualizarSaldo_DeveAtualizarSaldoComSucesso() {
        // Given
        BigDecimal novoSaldo = BigDecimal.valueOf(5000.00);
        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaTeste));
        when(contaRepository.save(any(Conta.class))).thenReturn(contaTeste);

        // When
        Conta resultado = contaService.atualizarSaldo(1L, novoSaldo);

        // Then
        assertThat(resultado).isNotNull();
        verify(contaRepository).findById(1L);
        verify(contaRepository).save(any(Conta.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar saldo com valor nulo")
    void atualizarSaldo_DeveLancarExcecaoAoAtualizarSaldoComValorNulo() {
        // When & Then
        assertThatThrownBy(() -> contaService.atualizarSaldo(1L, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Valor não pode ser nulo");
    }
} 