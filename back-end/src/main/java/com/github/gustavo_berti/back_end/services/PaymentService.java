package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Payment;
import com.github.gustavo_berti.back_end.repositories.PaymentRepository;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private MessageSource messageSource;

    public Payment insert(Payment payment) {
        return paymentRepository.save(payment);
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
                    new Object[]{id}, LocaleContextHolder.getLocale())));
    }

}