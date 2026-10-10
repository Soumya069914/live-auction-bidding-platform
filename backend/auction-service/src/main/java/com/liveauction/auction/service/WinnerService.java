package com.liveauction.auction.service;

import com.liveauction.auction.dto.WinnerResponse;
import com.liveauction.auction.entity.Auction;
import com.liveauction.auction.entity.AuctionStatus;
import com.liveauction.auction.entity.Bid;
import com.liveauction.auction.repository.AuctionRepository;
import com.liveauction.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WinnerService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;

    public WinnerResponse getWinner(Long auctionId) {

        // Find auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        // Winner is available only after auction ends
        if (auction.getStatus() != AuctionStatus.ENDED) {
            throw new RuntimeException(
                    "Auction has not ended yet"
            );
        }

        // Find highest bid
        Bid winner = bidRepository
                .findTopByAuctionIdOrderByAmountDesc(auctionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No bids found for this auction"
                        ));

        // Return clean response
        return new WinnerResponse(
                auction.getId(),
                winner.getBidderId(),
                winner.getAmount()
        );
    }
}