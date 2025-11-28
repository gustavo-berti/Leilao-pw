package com.github.gustavo_berti.back_end.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.gustavo_berti.back_end.models.Image;

public interface ImageRepository extends JpaRepository<Image, Long>{
    List<Image> findByAuctionId(Long auctionId);
}
