package com.github.gustavo_berti.back_end.dto;

import java.util.Date;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImageCreateDTO {
    private Long id;
    @NotBlank(message = "Nome da imagem não pode ficar em branco")
    private String imageName;
    @NotBlank(message = "Data e hora não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHour;
    @NotBlank(message = "ID do leilão não pode ficar em branco")
    private Long auctionId;
}
