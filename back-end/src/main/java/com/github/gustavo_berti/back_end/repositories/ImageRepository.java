package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.gustavo_berti.back_end.models.Image;

public interface ImageRepository extends JpaRepository<Image, Long>{
    
}
