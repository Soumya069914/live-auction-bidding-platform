package com.liveauction.auction.service;

import com.liveauction.auction.entity.Auction;
import com.liveauction.auction.entity.Bid;
import com.liveauction.auction.repository.AuctionRepository;
import com.liveauction.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Bid placeBid(
            Long auctionId,
            Long bidderId,
            BigDecimal amount
    ) {

        // Lock the auction row to prevent concurrent bid problems
        Auction auction = auctionRepository.findByIdForUpdate(auctionId)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found")
                );

        // Check auction status
        if (auction.getStatus()
                != com.liveauction.auction.entity.AuctionStatus.ACTIVE) {

            throw new RuntimeException(
                    "Auction is not active"
            );
        }

        // Check auction time
        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(auction.getStartTime())) {

            throw new RuntimeException(
                    "Auction has not started yet"
            );
        }

        if (now.isAfter(auction.getEndTime())) {

            throw new RuntimeException(
                    "Auction has ended"
            );
        }

        // Bid must be higher than current price
        if (amount.compareTo(auction.getCurrentPrice()) <= 0) {

            throw new RuntimeException(
                    "Bid must be higher than current price: "
                            + auction.getCurrentPrice()
            );
        }

        // Create bid
        Bid bid = Bid.builder()
                .auctionId(auctionId)
                .bidderId(bidderId)
                .amount(amount)
                .bidTime(now)
                .build();

        // Save bid
        Bid savedBid = bidRepository.save(bid);

        // Update current auction price
        auction.setCurrentPrice(amount);
        auctionRepository.save(auction);

        // Send real-time bid update through WebSocket
        messagingTemplate.convertAndSend(
                "/topic/auctions/" + auctionId,
                savedBid
        );

        return savedBid;
    }

    public List<Bid> getBidsByAuction(Long auctionId) {

        return bidRepository.findByAuctionIdOrderByAmountDesc(
                auctionId
        );
    }

    public List<Bid> getBidsByBidder(Long bidderId) {

        return bidRepository.findByBidderId(bidderId);
    }
}