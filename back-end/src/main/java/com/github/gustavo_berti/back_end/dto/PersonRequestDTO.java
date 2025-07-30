package com.github.gustavo_berti.back_end.dto;

import lombok.Data;

@Data
public class PersonRequestDTO {
    private String email;
    private String password;
}
