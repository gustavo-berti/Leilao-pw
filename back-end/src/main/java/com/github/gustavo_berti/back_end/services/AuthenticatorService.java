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
import com.github.gustavo_berti.back_end.models.Person;
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
        Person personEntity = personRepository.findByEmail(person.getEmail())
                .orElseThrow(() -> new RuntimeException(messageSource.getMessage("person.notfound.email",
                        new Object[] { person.getEmail() }, LocaleContextHolder.getLocale())));
        personAuthDTO.setName(personEntity.getName());
        personAuthDTO.setEmail(person.getEmail());
        personAuthDTO.setToken(jwtService.generateToken(authentication.getName()));
        personAuthDTO.setRole(personEntity.getPersonProfile() != null && !personEntity.getPersonProfile().isEmpty()
                ? personEntity.getPersonProfile().get(0).getProfile().getType()
                : null);
        personAuthDTO.setProfilePicture(personEntity.getProfilePicture());
        return personAuthDTO;
    }

    public boolean validateToken(PersonAuthDTO personAuthDTO) {
        return jwtService.validateToken(personAuthDTO.getToken(), personAuthDTO.getName());
    }
}
