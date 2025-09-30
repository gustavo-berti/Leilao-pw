package com.github.gustavo_berti.back_end.dto;

import lombok.Data;

@Data
public class PersonListDTO {
    private Long id;
    private String name;
    private String email;
    private String profile;
    private Boolean active;
}
