package com.github.gustavo_berti.back_end.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.github.gustavo_berti.back_end.models.Bid;

public interface BidRepository extends JpaRepository<Bid, Long> {

    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId")
    List<Bid> findByAuctionID(Long auctionId);
    
}
