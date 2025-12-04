package com.github.gustavo_berti.back_end.schedulers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.github.gustavo_berti.back_end.services.AuctionService;

@Component
public class AuctionScheduler {
    @Autowired
    private AuctionService auctionService;

    @Scheduled(fixedRate = 60000)
    public void checkAuctions() {
        auctionService.processExpiredAuctions();
    }
}