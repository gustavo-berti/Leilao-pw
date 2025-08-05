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

import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.services.AuctionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<Page<Auction>> findAll(Pageable page) {
        return ResponseEntity.ok(auctionService.findAll(page));
    }

    @PostMapping
    public ResponseEntity<Auction> insert(@Valid @RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.insert(auction));
    }

    @PutMapping
    public ResponseEntity<Auction> update(@Valid @RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.update(auction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok("Auction deleted successfully");
    }
}
