package com.liveauction.auction.scheduler;

import com.liveauction.auction.entity.Auction;
import com.liveauction.auction.entity.AuctionStatus;
import com.liveauction.auction.repository.AuctionRepository;
import com.liveauction.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;

    @Scheduled(fixedRate = 10000)
    @Transactional
    public void updateAuctionStatuses() {

        LocalDateTime now = LocalDateTime.now();

        // UPCOMING -> ACTIVE
        List<Auction> upcomingAuctions =
                auctionRepository.findByStatus(AuctionStatus.UPCOMING);

        for (Auction auction : upcomingAuctions) {

            if (!now.isBefore(auction.getStartTime())) {

                auction.setStatus(AuctionStatus.ACTIVE);

                auctionRepository.save(auction);
            }
        }

        // ACTIVE -> ENDED
        List<Auction> activeAuctions =
                auctionRepository.findByStatus(AuctionStatus.ACTIVE);

        for (Auction auction : activeAuctions) {

            if (!now.isBefore(auction.getEndTime())) {

                auction.setStatus(AuctionStatus.ENDED);

                // Find highest bid
                bidRepository
                        .findTopByAuctionIdOrderByAmountDesc(auction.getId())
                        .ifPresent(winner -> {

                            // Save winner bidder ID
                            auction.setWinnerId(
                                    winner.getBidderId()
                            );

                            System.out.println(
                                    "Auction ended: "
                                            + auction.getId()
                            );

                            System.out.println(
                                    "Winner bidder ID: "
                                            + winner.getBidderId()
                            );

                            System.out.println(
                                    "Winning amount: "
                                            + winner.getAmount()
                            );
                        });

                // Save auction with ENDED status and winnerId
                auctionRepository.save(auction);
            }
        }
    }
}