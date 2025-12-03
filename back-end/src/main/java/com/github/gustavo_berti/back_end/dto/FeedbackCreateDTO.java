package com.github.gustavo_berti.back_end.dto;

import java.util.Date;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackCreateDTO {
    @NotBlank(message = "Comentário não pode ficar em branco")
    private String comment;
    @NotNull(message = "Avaliação não pode ficar em branco")
    @Min(value = 1, message = "Avaliação deve ser no mínimo 1")
    @Max(value = 5, message = "Avaliação deve ser no máximo 5")
    private Integer rating;
    @NotNull(message = "Data e hora não podem ficar em branco")
    private Date dateHour;
    @NotNull(message = "Autor do feedback é obrigatório")
    private String authorEmail;
    @NotNull(message = "Destinatário do feedback é obrigatório")
    private String targetPersonEmail;
}
