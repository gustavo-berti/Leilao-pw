package com.github.gustavo_berti.back_end.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;

import java.util.NoSuchElementException;

@Component
public class AuthPersonProvider {

    @Autowired
    private PersonRepository userRepository;
   
    public Person getUsuarioAutenticado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;        

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
            System.out.println(username);
        } else {
            username = principal.toString();
            System.out.println("AAA "+username);
        }

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("Usuário autenticado não encontrado"));
    }
}