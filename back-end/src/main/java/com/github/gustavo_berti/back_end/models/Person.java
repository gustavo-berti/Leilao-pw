package com.github.gustavo_berti.back_end.models;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
@Table(name = "people")
public class Person implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "Nome não pode ficar em branco")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    @NotBlank(message = "Email não pode ficar em branco")
    @Email(message = "Formato de email inválido")
    @Size(max = 150, message = "Email deve ter no máximo 150 caracteres")
    private String email;

    @Column(name = "password", nullable = false)
    @NotBlank(message = "Senha não pode ficar em branco")
    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    private String password;

    @Column(name = "validation_code")
    private String validationCode;

    @Column(name = "validation_code_expiry")
    @Temporal(TemporalType.TIMESTAMP)
    private Date validationCodeExpiry;

    @Column(name = "active", nullable = false)
    @ColumnDefault("true")
    private boolean active;

    @Lob
    @Column(name = "profile_picture", nullable = true)
    private byte[] profilePicture;

    @Column(name = "person_category", nullable = true)
    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Setter(value = AccessLevel.NONE)
    private List<Category> categories;

    @Column(name = "person_auctions", nullable = true)
    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Setter(value = AccessLevel.NONE)
    private List<Auction> auctions;

    @Column(name = "person_profile", nullable = false)
    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(value = AccessLevel.NONE)
    private List<PersonProfile> personProfile;

    public void setPersonProfile(List<PersonProfile> personProfile) {
        for (PersonProfile p : personProfile) {
            p.setPerson(this);
        }
        this.personProfile = personProfile;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return personProfile.stream().map(user -> new SimpleGrantedAuthority(user.getProfile().getType().name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

}
