package com.github.gustavo_berti.back_end.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.github.gustavo_berti.back_end.models.Bid;

public interface BidRepository extends JpaRepository<Bid, Long> {

    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId")
    public List<Bid> findByAuctionID(Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.dateHour DESC LIMIT 1")
    public Bid findLastBid(Long auctionId);
}
