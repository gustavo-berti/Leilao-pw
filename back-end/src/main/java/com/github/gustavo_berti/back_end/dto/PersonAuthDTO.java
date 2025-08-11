package com.github.gustavo_berti.back_end.dto;

import lombok.Data;

@Data
public class PersonAuthDTO {
    private String name;
    private String email;
    private String token;
    
}
