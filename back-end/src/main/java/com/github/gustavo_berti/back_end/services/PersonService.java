package com.github.gustavo_berti.back_end.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.github.gustavo_berti.back_end.dto.PersonListDTO;
import com.github.gustavo_berti.back_end.dto.PersonUpdateDTO;
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
        existingPerson.setActive(person.getActive());
        PersonProfile profile = new PersonProfile();
        profile.setPerson(existingPerson);
        profile.setProfile(profileRepository.findByType(person.getProfile()));
        List<PersonProfile> profiles = existingPerson.getPersonProfile();
        profiles.clear();
        profiles.add(profile);
        existingPerson.setPersonProfile(profiles);
        return personRepository.save(existingPerson);
    }

    public Person updateByEmail(String email, PersonUpdateDTO person) {
        Person personToUpdate = personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Pessoa não encontrada com email: " + email));
        if (!email.equals(person.getEmail())) {
            personRepository.findByEmail(person.getEmail()).ifPresent(existingPersonWithNewEmail -> {
                if (!existingPersonWithNewEmail.getId().equals(personToUpdate.getId())) {
                    throw new DataIntegrityViolationException("Este email já está em uso");
                }
            });
        }

        personToUpdate.setName(person.getName());
        personToUpdate.setEmail(person.getEmail());
        return personRepository.save(personToUpdate);
    }


    public Person uploadAvatar(String email, byte[] avatar) {
        Person person = findByEmail(email);
        person.setAvatar(avatar);
        return personRepository.save(person);
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

    public Page<PersonListDTO> findAllActive(Pageable pageable) {
        return personRepository.findAllActive(pageable)
                .map(person -> {
                    PersonListDTO dto = new PersonListDTO();
                    dto.setId(person.getId());
                    dto.setName(person.getName());
                    dto.setEmail(person.getEmail());
                    dto.setActive(person.isActive());
                    dto.setProfile(person.getPersonProfile().get(0).getProfile().getType());
                    return dto;
                });
    }

    public Page<PersonListDTO> findAllInactive(Pageable page) {
        return personRepository.findAllInactive(page)
                .map(person -> {
                    PersonListDTO dto = new PersonListDTO();
                    dto.setId(person.getId());
                    dto.setName(person.getName());
                    dto.setEmail(person.getEmail());
                    dto.setActive(person.isActive());
                    dto.setProfile(person.getPersonProfile().get(0).getProfile().getType());
                    return dto;
                });
    }

    public Page<PersonListDTO> findByName(String name, Pageable page) {
        return personRepository.findByName(name, page)
                .map(person -> {
                    PersonListDTO dto = new PersonListDTO();
                    dto.setId(person.getId());
                    dto.setName(person.getName());
                    dto.setEmail(person.getEmail());
                    dto.setActive(person.isActive());
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

    public Person restore(Long id) {
        Person person = findById(id);
        person.setActive(true);
        return personRepository.save(person);
    }

}
