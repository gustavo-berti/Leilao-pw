package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PersonUpdateDTO {
    @NotBlank(message = "O nome não pode estar em branco.")
    private String name;
    @NotBlank(message = "O email não pode estar em branco.")
    private String email;
}
