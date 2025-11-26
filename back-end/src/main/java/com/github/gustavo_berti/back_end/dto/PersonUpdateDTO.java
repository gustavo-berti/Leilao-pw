package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PersonUpdateDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String email;
}
