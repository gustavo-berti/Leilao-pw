package com.github.gustavo_berti.back_end.models;

import java.util.Date;

import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
@Table(name = "Auctions")
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="title", nullable = false)
    @NotBlank(message = "Título não pode ficar em branco")
    @Size(max = 150, message = "Título deve ter no máximo 150 caracteres")
    private String title;
    @Column(name="description", nullable = false)
    @NotBlank(message = "Descrição não pode ficar em branco")
    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    private String description;
    @Column(name="detailed_description", nullable = false)
    @NotBlank(message = "Descrição detalhada não pode ficar em branco")
    @Size(max = 500, message = "Descrição detalhada deve ter no máximo 500 caracteres")
    private String detailedDescription;
    @Column(name="date_hour_start", nullable = false)
    @NotNull(message = "Data e hora de início não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHourStart;
    @Column(name="date_hour_end", nullable = false)
    @NotNull(message = "Data e hora de término não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHourEnd;
    @Column(name="status", nullable = false)
    @NotBlank(message = "Status não pode ficar em branco")
    private AuctionStatus status;
    @Column(name = "observations", nullable = true)
    @Size(max = 500, message = "Observações devem ter no máximo 500 caracteres")
    private String observations;
    @Column(name="increment_value", nullable = false)
    @NotNull(message = "Valor do incremento não pode ficar em branco")
    private Double incrementValue;
    @Column(name="minimal_bid", nullable = false)
    @NotNull(message = "Valor mínimo não pode ficar em branco")
    private Double minimalBid;
    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;
}
