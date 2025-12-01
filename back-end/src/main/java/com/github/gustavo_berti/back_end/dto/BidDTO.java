package com.github.gustavo_berti.back_end.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BidDTO {
    @NotNull(message = "ID do leilão é obrigatório")
    private Long auctionId;
    @NotNull(message = "Valor do lance é obrigatório")
    private Double bidValue;
    @NotNull(message = "Email do usuário é obrigatório")
    private String userEmail;
}