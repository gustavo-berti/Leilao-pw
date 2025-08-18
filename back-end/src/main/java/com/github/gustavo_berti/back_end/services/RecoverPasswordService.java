package com.github.gustavo_berti.back_end.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;
import com.github.gustavo_berti.utils.Const;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class RecoverPasswordService {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private EmailService emailService;
    @Value("${jwt.secret}")
    private String jwtSecret;

    public void recoverPassword(String email) {
        Person person = findPersonByEmail(email);
        String token = Jwts.builder()
                .setSubject(person.getEmail())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
        String resetLink = "http://localhost:5173/recuperar-senha?token=" + token;
        Context context = new Context();
        context.setVariable("name", person.getName());
        context.setVariable("resetLink", resetLink);
        emailService.emailTemplate(person.getEmail(), "Recuperação de Senha", Const.templateRecoverPassword, context);
    }

    public void validateRecoverPassword(String token) {
        try {
            String email = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            findPersonByEmail(email);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new RuntimeException("Token expirado");
        } catch (io.jsonwebtoken.JwtException e) {
            throw new RuntimeException("Token inválido");
        }
    }

    public Person findPersonByEmail(String email) {
        return personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound.email",
                        new Object[] { email }, LocaleContextHolder.getLocale())));
    }
}
