package com.github.gustavo_berti.back_end.services;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private MessageSource messageSource;

    public Person insert(Person person) {
        return personRepository.save(person);
    }

    public Person update(Person person) {
        Person existingPerson = findById(person.getId());
        existingPerson.setName(person.getName());
        existingPerson.setEmail(person.getEmail());
        return personRepository.save(existingPerson);
    }

    public void delete(Long id){
        Person person = findById(id);
        personRepository.delete(person);
    }

    public List<Person> findAll() {
        return personRepository.findAll();
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(messageSource.getMessage("{person.notfound}",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }
}
