package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.gustavo_berti.back_end.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
}
