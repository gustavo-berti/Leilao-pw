package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Bid;
import com.github.gustavo_berti.back_end.repositories.BidRepository;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private MessageSource messageSource;

    public Bid insert(Bid bid){
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

}
