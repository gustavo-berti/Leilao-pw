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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "Feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "comment", nullable = false)
    @NotBlank(message = "Comentário não pode ficar em branco")
    private String comment;
    @Column(name = "rating", nullable = false)
    @NotNull(message = "Avaliação não pode ficar em branco")
    @Min(value = 1, message = "Avaliação deve ser no mínimo 1")
    @Max(value = 5, message = "Avaliação deve ser no máximo 5")
    private Integer rating;
    @Column(name = "date_hour", nullable = false)
    @NotNull(message = "Data e hora não podem ficar em branco")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHour;
    @ManyToOne
    @JoinColumn(name = "author_person_id", nullable = false)
    @NotNull(message = "Autor do feedback é obrigatório")
    private Person author;
    @ManyToOne
    @JoinColumn(name = "target_person_id", nullable = false)
    @NotNull(message = "Destinatário do feedback é obrigatório")
    private Person target;

}
