package com.github.gustavo_berti.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.gustavo_berti.back_end.models.Bid;
import com.github.gustavo_berti.back_end.services.BidService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    @Autowired
    private BidService bidService;

    @GetMapping
    public ResponseEntity<Page<Bid>> findAll(Pageable pageable){
        return ResponseEntity.ok(bidService.findAll(pageable));
    }

    @PostMapping
    public ResponseEntity<Bid> insert(@Valid @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.insert(bid));
    }

    @PutMapping
    public ResponseEntity<Bid> update(@Valid @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.update(bid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        bidService.delete(id);
        return ResponseEntity.ok("Bid deleted successfully");
    }
    
}
