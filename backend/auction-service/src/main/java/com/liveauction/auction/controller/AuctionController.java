package com.liveauction.auction.controller;

import com.liveauction.auction.dto.CreateAuctionRequest;
import com.liveauction.auction.entity.Auction;
import com.liveauction.auction.entity.AuctionStatus;
import com.liveauction.auction.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<Auction> createAuction(
            @Valid @RequestBody CreateAuctionRequest request
    ) {

        Auction auction = Auction.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startingPrice(request.getStartingPrice())
                .sellerId(request.getSellerId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(auctionService.createAuction(auction));
    }

    @GetMapping
    public ResponseEntity<List<Auction>> getAllAuctions() {
        return ResponseEntity.ok(
                auctionService.getAllAuctions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuctionById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                auctionService.getAuctionById(id)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Auction>> getAuctionsByStatus(
            @PathVariable AuctionStatus status
    ) {
        return ResponseEntity.ok(
                auctionService.getAuctionsByStatus(status)
        );
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Auction>> getAuctionsBySeller(
            @PathVariable Long sellerId
    ) {
        return ResponseEntity.ok(
                auctionService.getAuctionsBySeller(sellerId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auction> updateAuction(
            @PathVariable Long id,
            @RequestBody Auction auction
    ) {
        return ResponseEntity.ok(
                auctionService.updateAuction(id, auction)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuction(
            @PathVariable Long id
    ) {
        auctionService.deleteAuction(id);

        return ResponseEntity.noContent().build();
    }
}