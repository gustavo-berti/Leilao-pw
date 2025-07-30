package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.PersonRequestDTO;

@Service
public class AuthenticatorService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public String auth(PersonRequestDTO person) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(person.getEmail(), person.getPassword())
        );

        return jwtService.generateToken(authentication.getName());
    }
}

