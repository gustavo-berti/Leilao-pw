package com.github.gustavo_berti.back_end.dto;

import java.util.Date;

import lombok.Data;

@Data
public class FeedbackListDTO {
    private Long id;
    private String comment;
    private Integer rating;
    private String personName;
    private String targetPersonName;
    private Date dateHour;
}