package com.github.gustavo_berti.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.gustavo_berti.back_end.dto.ChangePasswordDTO;
import com.github.gustavo_berti.back_end.dto.PersonListDTO;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.services.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/people")
public class PersonController {
    @Autowired
    private PersonService personService;

    @GetMapping
    public ResponseEntity<Page<PersonListDTO>> findAll(Pageable page) {
        return ResponseEntity.ok(personService.findAll(page));
    }

    @PostMapping
    public ResponseEntity<Person> insert(@Valid @RequestBody Person person) {
        return ResponseEntity.ok(personService.insert(person));
    }

    @PostMapping("/validate-password")
    public ResponseEntity<Boolean> validateCurrentPassword(@Valid @RequestBody ChangePasswordDTO dto) {
        boolean isValid = personService.validateCurrentPassword(dto.getEmail(), dto.getNewPassword());
        return ResponseEntity.ok(isValid);
    }

    @PutMapping
    public ResponseEntity<Person> update(@Valid @RequestBody PersonListDTO person) {
        return ResponseEntity.ok(personService.update(person));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Person> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
        return ResponseEntity.ok(personService.changePassword(dto.getEmail(), dto.getNewPassword()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        personService.delete(id);
        return ResponseEntity.ok("Person deleted successfully");
    }

}
