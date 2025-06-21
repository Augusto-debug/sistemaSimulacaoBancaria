package com.augusto.backend.controller;

import com.augusto.backend.config.JwtUtil;
import com.augusto.backend.domain.Usuario;
import com.augusto.backend.dto.AuthResponseDTO;
import com.augusto.backend.dto.LoginRequestDTO;
import com.augusto.backend.dto.RegisterRequestDTO;
import com.augusto.backend.services.UsuarioService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, 
                         UsuarioService usuarioService, 
                         JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha())
            );

            Usuario usuario = (Usuario) authentication.getPrincipal();
            String token = jwtUtil.generateToken(usuario.getEmail());

            AuthResponseDTO response = new AuthResponseDTO(
                token,
                "Bearer",
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        try {
            // Verificar se email já existe
            Optional<Usuario> existingUserByEmail = usuarioService.findByEmail(registerRequest.getEmail());
            if (existingUserByEmail.isPresent()) {
                return ResponseEntity.status(409).body("Email já está em uso");
            }

            // Verificar se CPF já existe
            Optional<Usuario> existingUserByCpf = usuarioService.findByCpf(registerRequest.getCpf());
            if (existingUserByCpf.isPresent()) {
                return ResponseEntity.status(409).body("CPF já está em uso");
            }

            // Criar novo usuário
            Usuario usuario = new Usuario();
            usuario.setNome(registerRequest.getNome());
            usuario.setCpf(registerRequest.getCpf());
            usuario.setEndereco(registerRequest.getEndereco());
            usuario.setEmail(registerRequest.getEmail());
            usuario.setSenha(registerRequest.getSenha());

            Usuario savedUser = usuarioService.createUser(usuario);
            String token = jwtUtil.generateToken(savedUser.getEmail());

            AuthResponseDTO response = new AuthResponseDTO(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getNome(),
                savedUser.getEmail()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao registrar usuário: " + e.getMessage());
        }
    }
} 