package com.liveauction.auction.controller;

import com.liveauction.auction.dto.AuctionReviewSummaryResponse;
import com.liveauction.auction.dto.CreateReviewRequest;
import com.liveauction.auction.dto.SellerReputationResponse;
import com.liveauction.auction.dto.SellerReviewResponse;
import com.liveauction.auction.service.SellerReviewService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SellerReviewController {

    private final SellerReviewService sellerReviewService;

    /*
     * Create a review or update the existing review
     * for the same auction and authenticated buyer.
     */
    @PostMapping("/reviews")
    public ResponseEntity<SellerReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader) {

        SellerReviewResponse response =
                sellerReviewService.createReview(
                        request,
                        authorizationHeader
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /*
     * Get overall reputation for a seller.
     */
    @GetMapping("/sellers/{sellerId}/reputation")
    public ResponseEntity<SellerReputationResponse> getReputation(
            @PathVariable Long sellerId,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader) {

        return ResponseEntity.ok(
                sellerReviewService.getReputation(
                        sellerId,
                        authorizationHeader
                )
        );
    }

    /*
     * Get approved reviews across all auctions for a seller.
     */
    @GetMapping("/sellers/{sellerId}/reviews")
    public ResponseEntity<Page<SellerReviewResponse>> getReviews(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader) {

        return ResponseEntity.ok(
                sellerReviewService.getApprovedReviews(
                        sellerId,
                        page,
                        size,
                        authorizationHeader
                )
        );
    }

    /*
     * Get rating statistics and approved reviews
     * for one specific auction belonging to a seller.
     *
     * Example:
     * GET /api/sellers/5/reputation/auctions/40
     */
    @GetMapping(
            "/sellers/{sellerId}/reputation/auctions/{auctionId}"
    )
    public ResponseEntity<AuctionReviewSummaryResponse>
    getAuctionReviews(
            @PathVariable Long sellerId,
            @PathVariable Long auctionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader) {

        AuctionReviewSummaryResponse response =
                sellerReviewService.getAuctionReviews(
                        sellerId,
                        auctionId,
                        page,
                        size,
                        authorizationHeader
                );

        return ResponseEntity.ok(response);
    }

    /*
     * Approve or reject a pending review.
     * Only administrators may perform this action.
     */
    @PutMapping("/admin/reviews/{reviewId}/status")
    public ResponseEntity<SellerReviewResponse> updateReviewStatus(
            @PathVariable Long reviewId,
            @RequestParam String status,
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader) {

        SellerReviewResponse response =
                sellerReviewService.updateReviewStatus(
                        reviewId,
                        status,
                        authorizationHeader
                );

        return ResponseEntity.ok(response);
    }
}

