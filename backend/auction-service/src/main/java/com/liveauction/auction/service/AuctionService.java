package com.liveauction.auction.service;

import com.liveauction.auction.entity.Auction;
import com.liveauction.auction.entity.AuctionStatus;
import com.liveauction.auction.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;

    // Create auction
    public Auction createAuction(Auction auction) {

        // Validate auction time
        if (!auction.getStartTime().isBefore(auction.getEndTime())) {
            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        // Set initial current price
        auction.setCurrentPrice(auction.getStartingPrice());

        // New auctions start as UPCOMING
        auction.setStatus(AuctionStatus.UPCOMING);

        return auctionRepository.save(auction);
    }

    // Get all auctions
    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    // Get auction by ID
    public Auction getAuctionById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));
    }

    // Get auctions by status
    public List<Auction> getAuctionsByStatus(
            AuctionStatus status
    ) {
        return auctionRepository.findByStatus(status);
    }

    // Get auctions by seller
    public List<Auction> getAuctionsBySeller(Long sellerId) {
        return auctionRepository.findBySellerId(sellerId);
    }

    // Update auction
    public Auction updateAuction(
            Long id,
            Auction updatedAuction
    ) {

        Auction existingAuction = getAuctionById(id);

        // Validate updated auction time
        if (!updatedAuction.getStartTime()
                .isBefore(updatedAuction.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time"
            );
        }

        existingAuction.setTitle(
                updatedAuction.getTitle()
        );

        existingAuction.setDescription(
                updatedAuction.getDescription()
        );

        existingAuction.setStartingPrice(
                updatedAuction.getStartingPrice()
        );

        existingAuction.setStartTime(
                updatedAuction.getStartTime()
        );

        existingAuction.setEndTime(
                updatedAuction.getEndTime()
        );

        return auctionRepository.save(existingAuction);
    }

    // Delete auction
    public void deleteAuction(Long id) {

        Auction auction = getAuctionById(id);

        auctionRepository.delete(auction);
    }
}