package com.github.gustavo_berti.back_end.models;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "Payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "amount", nullable = false)
    @NotBlank(message = "Valor do pagamento não pode ficar em branco")
    private Double amount;
    @Column(name = "dateHour", nullable = false)
    @NotBlank(message = "Data e hora do pagamento não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHour;
    @Column(name = "status", nullable = false)
    @NotBlank(message = "Status do pagamento não pode ficar em branco")
    private String status;
    @ManyToOne
    @JoinColumn (name = "auction_id", nullable = true)
    private Auction auction;

}
