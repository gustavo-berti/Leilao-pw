package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank
    private String email;
    @NotBlank
    private String newPassword;
}
