package com.github.gustavo_berti.back_end.dto;

import java.util.Date;

import com.github.gustavo_berti.back_end.models.Category;
import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuctionListDTO {
    private Long id;
    @NotBlank(message = "Título não pode ficar em branco")
    private String title;
    @NotBlank(message = "Descrição não pode ficar em branco")
    private String description;
    @NotNull(message = "Data e hora de término não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHourEnd;
    @NotNull(message = "Status não pode ficar em branco")
    private AuctionStatus status;
    @NotNull(message = "Valor mínimo não pode ficar em branco")
    private Double minimalBid;
    @NotNull(message = "Categoria não pode ficar em branco")
    private Category category;
}
