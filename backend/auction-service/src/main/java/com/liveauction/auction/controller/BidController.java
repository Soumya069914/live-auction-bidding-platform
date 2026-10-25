package com.liveauction.auction.controller;

import com.liveauction.auction.dto.PlaceBidRequest;
import com.liveauction.auction.entity.Bid;
import com.liveauction.auction.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping("/{auctionId}/bids")
    public ResponseEntity<Bid> placeBid(
            @PathVariable Long auctionId,
            @Valid @RequestBody PlaceBidRequest request
    ) {

        Bid bid = bidService.placeBid(
                auctionId,
                request.getBidderId(),
                request.getAmount()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bid);
    }

    @GetMapping("/{auctionId}/bids")
    public ResponseEntity<List<Bid>> getAuctionBids(
            @PathVariable Long auctionId
    ) {

        return ResponseEntity.ok(
                bidService.getBidsByAuction(auctionId)
        );
    }

    @GetMapping("/bids/bidder/{bidderId}")
    public ResponseEntity<List<Bid>> getBidderBids(
            @PathVariable Long bidderId
    ) {

        return ResponseEntity.ok(
                bidService.getBidsByBidder(bidderId)
        );
    }
}