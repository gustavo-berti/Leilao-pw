package com.github.gustavo_berti.back_end.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.github.gustavo_berti.back_end.dto.PersonListDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.models.PersonProfile;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;
import com.github.gustavo_berti.back_end.repositories.ProfileRepository;
import com.github.gustavo_berti.utils.Const;

@Service
public class PersonService implements UserDetailsService {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private EmailService emailService;

    private void sendSuccessEmail(Person person) {
        Context context = new Context();
        context.setVariable("name", person.getName());
        emailService.emailTemplate(person.getEmail(), "Cadastrado com Sucesso", Const.templateSuccessfulEmail, context);
    }

    private void sendEmailChangePassword(Person person) {
        Context context = new Context();
        context.setVariable("name", person.getName());
        emailService.emailTemplate(person.getEmail(), "Senha Alterada com Sucesso", Const.templateChangePasswordEmail,
                context);
    }

    public Person insert(Person person) {
        person.setPassword(EncryptPassword(person.getPassword()));
        person.setActive(true);
        if (person.getPersonProfile() != null && !person.getPersonProfile().isEmpty()) {
            for (PersonProfile pp : person.getPersonProfile()) {
                Long profileId = pp.getProfile().getId();
                pp.setPerson(person);
                pp.setProfile(profileRepository.findById(profileId)
                        .orElseThrow(() -> new NotFoundException("Perfil não encontrado: " + profileId)));
            }
        }
        Person newPerson = personRepository.save(person);
        sendSuccessEmail(newPerson);
        return newPerson;
    }

    public Person update(PersonListDTO person) {
        Person existingPerson = findById(person.getId());
        existingPerson.setName(person.getName());
        existingPerson.setEmail(person.getEmail());
        PersonProfile profile = new PersonProfile();
        profile.setPerson(existingPerson);
        profile.setProfile(profileRepository.findByType(person.getProfile()));
        List<PersonProfile> profiles = existingPerson.getPersonProfile();
        profiles.clear();
        profiles.add(profile);
        existingPerson.setPersonProfile(profiles);
        return personRepository.save(existingPerson);
    }

    public Person changePassword(String email, String newPassword) {
        Person person = findByEmail(email);
        person.setPassword(EncryptPassword(newPassword));
        sendEmailChangePassword(person);
        return personRepository.save(person);
    }

    public void delete(Long id) {
        Person person = findById(id);
        person.setActive(false);
        personRepository.save(person);
    }

    public Page<PersonListDTO> findAll(Pageable pageable) {
        return personRepository.findAll(pageable)
                .map(person -> {
                    PersonListDTO dto = new PersonListDTO();
                    dto.setId(person.getId());
                    dto.setName(person.getName());
                    dto.setEmail(person.getEmail());
                    dto.setProfile(person.getPersonProfile().get(0).getProfile().getType());
                    return dto;
                });
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Person findByEmail(String email) {
        return personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound.email",
                        new Object[] { email }, LocaleContextHolder.getLocale())));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return personRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Pessoa não encontrada"));
    }

    private String EncryptPassword(String password) {
        BCryptPasswordEncoder encode = new BCryptPasswordEncoder();
        return encode.encode(password);
    }

    public boolean validateCurrentPassword(String email, String currentPassword) {
        Person person = findByEmail(email);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(currentPassword, person.getPassword());
    }

}
