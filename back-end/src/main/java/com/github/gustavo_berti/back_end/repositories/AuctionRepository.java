package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.github.gustavo_berti.back_end.models.Auction;

public interface AuctionRepository extends JpaRepository<Auction, Long>, JpaSpecificationExecutor<Auction> {

}
