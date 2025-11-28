package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.AuctionCreateDTO;
import com.github.gustavo_berti.back_end.dto.AuctionListDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.models.Person;
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
        validateAuctionDates(auction);
        if (auction.getMinimalBid() <= 0) {
            throw new IllegalArgumentException("Valor do lance mínimo deve ser maior que zero.");
        }
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

    public Auction update(AuctionCreateDTO auction) {
        validateAuctionDates(auction);
        Auction existingAuction = findById(auction.getId());
        validateBidValues(auction, existingAuction);
        validateUser(auction, existingAuction);
        existingAuction.setTitle(auction.getTitle());
        existingAuction.setDescription(auction.getDescription());
        existingAuction.setStatus(auction.getStatus());
        return auctionRepository.save(existingAuction);
    }

    public void delete(Long id) {
        Auction auction = findById(id);
        auctionRepository.delete(auction);
    }

    public Page<AuctionListDTO> findAll (Pageable pageable){
        return auctionRepository.findAll(pageable).map(auction -> {
                    AuctionListDTO dto = new AuctionListDTO();
                    dto.setId(auction.getId());
                    dto.setTitle(auction.getTitle());
                    dto.setDescription(auction.getDescription());
                    dto.setDateHourEnd(auction.getDateHourEnd());
                    dto.setStatus(auction.getStatus());
                    dto.setMinimalBid(auction.getMinimalBid());
                    dto.setCategory(auction.getCategory());
                    return dto;
                });
    }

    public Auction findById(Long id){
        return auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("auction.notfound",
                    new Object[] {id}, LocaleContextHolder.getLocale())));
    }

    private void validateAuctionDates(AuctionCreateDTO auction) {
        if (auction.getDateHourEnd().before(auction.getDateHourStart())) {
            throw new IllegalArgumentException("Data de término deve ser posterior à data de início.");
        }
    }

    private void validateUser(AuctionCreateDTO auction, Auction existingAuction) {
        Person user = personService.findByEmail(auction.getUserEmail());
        if (user == null) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }
        if (user.getId() != existingAuction.getPerson().getId()) {
            throw new IllegalArgumentException("Usuário não autorizado a atualizar este leilão.");
        }
    }

    private void validateBidValues(AuctionCreateDTO auction, Auction existingAuction) {
        if (auction.getIncrementValue() <= 0) {
            throw new IllegalArgumentException("Valor do incremento deve ser maior que zero.");
        } if (auction.getIncrementValue() <= existingAuction.getIncrementValue()) {
            throw new IllegalArgumentException("Valor do incremento deve ser maior que o valor atual.");
        } 
    }
}