package com.github.gustavo_berti.back_end.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.PaymentDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.models.Payment;
import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;
import com.github.gustavo_berti.back_end.repositories.AuctionRepository;
import com.github.gustavo_berti.back_end.repositories.PaymentRepository;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private BidService bidService;

    public Payment insert(PaymentDTO dto) {
        Auction auction = auctionRepository.findById(dto.getAuctionId())
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("auction.notfound",
                        new Object[] { dto.getAuctionId() }, LocaleContextHolder.getLocale())));
        if (auction.getPayment() != null) {
            throw new IllegalArgumentException("Este leilão já foi pago.");
        }
        if (auction.getStatus() != null && !auction.getStatus().equals(AuctionStatus.CLOSED)) {
            throw new IllegalArgumentException("O leilão deve estar fechado para processar o pagamento.");
        }
        Double finalAmount = bidService.fetchValue(dto.getAuctionId());
        Payment payment = new Payment();
        payment.setAmount(finalAmount);
        payment.setDateHour(new Date());
        payment.setStatus("PAGO");
        Payment savedPayment = paymentRepository.save(payment);
        auction.setPayment(savedPayment);
        auctionRepository.save(auction);
        return savedPayment;
    }

    public Payment update(Payment payment) {
        Payment existingPayment = findById(payment.getId());
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setDateHour(payment.getDateHour());
        return paymentRepository.save(existingPayment);
    }

    public void delete(Long id) {
        Payment payment = findById(id);
        paymentRepository.delete(payment);
    }

    public Page<Payment> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

    public Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("payment.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

}