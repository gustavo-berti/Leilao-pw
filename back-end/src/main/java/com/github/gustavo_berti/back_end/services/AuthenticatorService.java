package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.PersonAuthDTO;
import com.github.gustavo_berti.back_end.dto.PersonRequestDTO;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;

@Service
public class AuthenticatorService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MessageSource messageSource;

    public PersonAuthDTO auth(PersonRequestDTO person) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(person.getEmail(), person.getPassword()));
        PersonAuthDTO personAuthDTO = new PersonAuthDTO();
        personAuthDTO.setName(personRepository.findByEmail(person.getEmail())
                .orElseThrow(() -> new RuntimeException(messageSource.getMessage("person.notfound.email",
                        new Object[] { person.getEmail() }, LocaleContextHolder.getLocale())))
                .getName());
        personAuthDTO.setEmail(person.getEmail());
        personAuthDTO.setToken(jwtService.generateToken(authentication.getName()));
        return personAuthDTO;
    }

    public boolean validateToken(PersonAuthDTO personAuthDTO) {
        return jwtService.validateToken(personAuthDTO.getToken(), personAuthDTO.getName());
    }
}
