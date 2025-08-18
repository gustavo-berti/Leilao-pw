package com.github.gustavo_berti.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.gustavo_berti.back_end.dto.ChangePasswordDTO;
import com.github.gustavo_berti.back_end.services.RecoverPasswordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recover-password")
public class RecoverPasswordController {
    @Autowired
    private RecoverPasswordService recoverPasswordService;

    @PostMapping("/generate/{email}")
    public ResponseEntity<String> recoverPassword(@PathVariable("email") String email) {
        recoverPasswordService.recoverPassword(email);
        return ResponseEntity.ok("Email de recuperação enviado com sucesso");
    }

    @PostMapping("/validate/{token}")
    public ResponseEntity<String> validateRecoverPassword(@PathVariable("token") String token) {
        recoverPasswordService.validateRecoverPassword(token);
        return ResponseEntity.ok("Token de recuperação válido");
    }

    @PutMapping("/change/{token}")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordDTO dto, @PathVariable("token") String token) {
        dto.setEmail(recoverPasswordService.validateRecoverPassword(token));
        recoverPasswordService.changePassword(dto.getEmail(), dto.getNewPassword());
        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}
