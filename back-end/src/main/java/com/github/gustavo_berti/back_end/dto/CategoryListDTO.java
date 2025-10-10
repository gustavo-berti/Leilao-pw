package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryListDTO {
    @NotNull
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String observation;
}
