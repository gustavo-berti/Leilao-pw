package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PersonAuthDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String email;
    @NotBlank
    private String token;
    @NotBlank
    private String role;
}
