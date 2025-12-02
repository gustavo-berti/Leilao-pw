package com.github.gustavo_berti.back_end.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.gustavo_berti.back_end.dto.AuctionCreateDTO;
import com.github.gustavo_berti.back_end.dto.AuctionDetailDTO;
import com.github.gustavo_berti.back_end.dto.AuctionListDTO;
import com.github.gustavo_berti.back_end.models.Auction;
import com.github.gustavo_berti.back_end.models.enums.AuctionStatus;
import com.github.gustavo_berti.back_end.services.AuctionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    @Autowired
    private AuctionService auctionService;

    @GetMapping("/list")
    public ResponseEntity<Page<AuctionListDTO>> findAll(Pageable page, @RequestParam(required = false) String title,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dateHourEnd,
            @RequestParam(required = false) Long categoryId, @RequestParam(required = false) AuctionStatus status,
            @RequestParam(required = false) String orderBy, @RequestParam(required = false) String direction) {
        String validDirection = (direction != null && !direction.isEmpty()) ? direction : null;
        String validOrderBy = (orderBy != null && !orderBy.isEmpty()) ? orderBy : null;
        return ResponseEntity.ok(auctionService.findByFilter(page, validOrderBy, validDirection, title, dateHourEnd, categoryId, status));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<Page<AuctionListDTO>> findByUserEmail(@PathVariable("email") String email, Pageable page) {
        return ResponseEntity.ok(auctionService.findByUserEmail(email, page));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<AuctionDetailDTO> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(auctionService.getDetail(id));
    }

    @PostMapping
    public ResponseEntity<Auction> insert(@Valid @RequestBody AuctionCreateDTO auction) {
        return ResponseEntity.ok(auctionService.insert(auction));
    }

    @PutMapping
    public ResponseEntity<AuctionDetailDTO> update(@Valid @RequestBody AuctionCreateDTO auction) {
        return ResponseEntity.ok(auctionService.update(auction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok("Auction deleted successfully");
    }
}
