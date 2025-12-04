package com.github.gustavo_berti.back_end.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;

public interface AuctionRepository extends JpaRepository<Auction, Long>, JpaSpecificationExecutor<Auction> {

    @Query("SELECT a FROM Auction a WHERE a.person.email = :email")
    Page<Auction> findByPersonEmail(String email, Pageable page);

    @Query("SELECT a FROM Auction a WHERE a.status = :status AND a.dateHourEnd < :now")
    List<Auction> findByStatusAndDateHourEndBefore(AuctionStatus status, Date now);

}
