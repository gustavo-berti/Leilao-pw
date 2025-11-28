package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.AuctionCreateDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.repositories.AuctionRepository;

@Service
public class AuctionService {
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private PersonService personService;
    @Autowired
    private MessageSource messageSource;

    public Auction insert(AuctionCreateDTO auction) {
        Auction newAuction = new Auction();
        newAuction.setTitle(auction.getTitle());
        newAuction.setDescription(auction.getDescription());
        newAuction.setDetailedDescription(auction.getDetailedDescription());
        newAuction.setDateHourStart(auction.getDateHourStart());
        newAuction.setDateHourEnd(auction.getDateHourEnd());
        newAuction.setStatus(auction.getStatus());
        newAuction.setIncrementValue(auction.getIncrementValue());
        newAuction.setMinimalBid(auction.getMinimalBid());
        newAuction.setCategory(auction.getCategory());
        newAuction.setPerson(personService.findByEmail(auction.getUserEmail()));
        return auctionRepository.save(newAuction);
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

    public Page<AuctionCreateDTO> findAll (Pageable pageable){
        return auctionRepository.findAll(pageable).map(auction -> {
                    AuctionCreateDTO dto = new AuctionCreateDTO();
                    dto.setId(auction.getId());
                    dto.setTitle(auction.getTitle());
                    dto.setDescription(auction.getDescription());
                    dto.setDetailedDescription(auction.getDetailedDescription());
                    dto.setDateHourStart(auction.getDateHourStart());
                    dto.setDateHourEnd(auction.getDateHourEnd());
                    dto.setStatus(auction.getStatus());
                    dto.setIncrementValue(auction.getIncrementValue());
                    dto.setMinimalBid(auction.getMinimalBid());
                    dto.setCategory(auction.getCategory());
                    dto.setUserEmail(auction.getPerson().getEmail());
                    return dto;
                });
    }

    public Auction findById(Long id){
        return auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("auction.notfound",
                    new Object[] {id}, LocaleContextHolder.getLocale())));
    }

}