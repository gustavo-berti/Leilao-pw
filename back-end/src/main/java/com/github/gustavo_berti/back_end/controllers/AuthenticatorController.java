package com.github.gustavo_berti.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.gustavo_berti.back_end.dto.PersonAuthDTO;
import com.github.gustavo_berti.back_end.dto.PersonRequestDTO;
import com.github.gustavo_berti.back_end.services.AuthenticatorService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticatorController {
    @Autowired
    private AuthenticatorService authenticatorService;

    @PostMapping("/login")
    public PersonAuthDTO login(@RequestBody PersonRequestDTO person){
        return authenticatorService.auth(person);
    }

    @PostMapping("/validate")
    public boolean validate(@RequestBody PersonAuthDTO personAuthDTO) {
        return authenticatorService.validateToken(personAuthDTO);
    }

}