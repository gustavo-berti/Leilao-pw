package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.repositories.AuctionRepository;

@Service
public class AuctionService {
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private MessageSource messageSource;

    public Auction insert(Auction auction) {
        return auctionRepository.save(auction);
    }

    public Auction update(Auction auction) {
        Auction existingAuction = findById(auction.getId());
        existingAuction.setTitle(auction.getTitle());
        existingAuction.setDescription(auction.getDescription());
        existingAuction.setStatus(auction.getStatus());
        existingAuction.setObservations(auction.getObservations());
        return auctionRepository.save(existingAuction);
    }

    public void delete(Long id) {
        Auction auction = findById(id);
        auctionRepository.delete(auction);
    }

    public Page<Auction> findAll (Pageable pageable){
        return auctionRepository.findAll(pageable);
    }

    public Auction findById(Long id){
        return auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("auction.notfound",
                    new Object[] {id}, LocaleContextHolder.getLocale())));
    }

}