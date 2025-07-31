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
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "amount", nullable = false)
    @NotNull(message = "Lance não pode ser nulo")
    private double amount;
    @Column(name = "date_hour", nullable = false)
    @NotNull(message = "Data e hora não podem ser nulos")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHour;
    @ManyToOne
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;
    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
}
