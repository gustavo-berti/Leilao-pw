package com.github.gustavo_berti.back_end.models;

import java.sql.Date;

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
@Table(name = "Images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "date_hour", nullable = false)
    @NotBlank(message = "Data e hora não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHour;
    @Column(name = "image_name", nullable = false)
    @NotBlank(message = "Nome da imagem não pode ficar em branco")
    private String imageName;
    @ManyToOne
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;
    
}
