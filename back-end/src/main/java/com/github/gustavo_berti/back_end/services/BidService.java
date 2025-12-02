package com.github.gustavo_berti.back_end.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.BidDTO;
import com.github.gustavo_berti.back_end.exception.BidValidationException;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Bid;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.repositories.AuctionRepository;
import com.github.gustavo_berti.back_end.repositories.BidRepository;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private PersonRepository personRepository;


    public Bid insert(Bid bid){
        return bidRepository.save(bid);
    }

    public Bid insert(BidDTO dto){
        validateBidPerson(dto);
        Bid bid = new Bid();
        bid.setAmount(dto.getBidValue());
        bid.setAuction(auctionRepository.findById(dto.getAuctionId())
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("auction.notfound", 
                    new Object[]{ dto.getAuctionId() }, LocaleContextHolder.getLocale()))));
        bid.setPerson(personRepository.findByEmail(dto.getUserEmail())
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound", 
                    new Object[]{ dto.getUserEmail() }, LocaleContextHolder.getLocale()))));
        bid.setDateHour(new Date());
        return bidRepository.save(bid);
    }

    public Bid update(Bid bid){
        Bid existingBid = findById(bid.getId());
        existingBid.setAmount(bid.getAmount());
        existingBid.setDateHour(bid.getDateHour());
        return bidRepository.save(existingBid);
    }

    public void delete(Long id){
        Bid bid = findById(id);
        bidRepository.delete(bid);
    }

    public Page<Bid> findAll(Pageable pageable){
        return bidRepository.findAll(pageable);
    }

    public Bid findById(Long id){
        return bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("bid.notfound", 
                    new Object[]{ id }, LocaleContextHolder.getLocale())));
    }

    public Double fetchValue(Long auctionId) {
        List<Bid> bids = bidRepository.findByAuctionID(auctionId);
        if (bids.isEmpty()) {
            return 0.0;
        }
        double value = 0;
        for (Bid bid : bids) {
            value += bid.getAmount();
        }
        return value;
    }

    private void validateBidPerson(BidDTO dto) {
        Person person = personRepository.findByEmail(dto.getUserEmail())
            .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound", 
                new Object[]{ dto.getUserEmail() }, LocaleContextHolder.getLocale())));
        Bid lastBid = bidRepository.findLastBid(dto.getAuctionId());
        if (lastBid != null && lastBid.getPerson().getId().equals(person.getId())) {
            throw new BidValidationException(messageSource.getMessage("bid.sameperson", 
                new Object[]{ person.getEmail() }, LocaleContextHolder.getLocale()));
        }
    }

}
