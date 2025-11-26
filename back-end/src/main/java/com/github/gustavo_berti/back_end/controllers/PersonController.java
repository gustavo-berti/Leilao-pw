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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.github.gustavo_berti.back_end.dto.ChangePasswordDTO;
import com.github.gustavo_berti.back_end.dto.PersonListDTO;
import com.github.gustavo_berti.back_end.dto.PersonUpdateDTO;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.services.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/people")
public class PersonController {
    @Autowired
    private PersonService personService;

    @GetMapping
    public ResponseEntity<Page<PersonListDTO>> findAllActive(Pageable page) {
        return ResponseEntity.ok(personService.findAllActive(page));
    }

    @GetMapping("/inactive")
    public ResponseEntity<Page<PersonListDTO>> findAllInactive(Pageable page) {
        return ResponseEntity.ok(personService.findAllInactive(page));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PersonListDTO>> findByName(@RequestParam(value = "name", required = false) String name, Pageable page) {
        if (name == null || name.isEmpty()) {
            return ResponseEntity.ok(personService.findAllActive(page));
        }
        return ResponseEntity.ok(personService.findByName(name, page));
    }

    @PostMapping("/create")
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

    @PutMapping("/update")
    public ResponseEntity<Person> updateByEmail(@RequestParam("email") String email, @Valid @RequestBody PersonUpdateDTO person) {
        return ResponseEntity.ok(personService.updateByEmail(email, person));
    }

    @PutMapping("/upload-avatar")
    public ResponseEntity<Person> uploadAvatar(@RequestParam("email") String email, @RequestParam("avatar") MultipartFile avatar) {
        try {
            return ResponseEntity.ok(personService.uploadAvatar(email, avatar.getBytes()));
        } catch (java.io.IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<Person> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
        return ResponseEntity.ok(personService.changePassword(dto.getEmail(), dto.getNewPassword()));
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<Person> restore(@PathVariable("id") Long id) {
        return ResponseEntity.ok(personService.restore(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        personService.delete(id);
        return ResponseEntity.ok("Person deleted successfully");
    }

}
