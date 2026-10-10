package com.liveauction.auction.controller;

import com.liveauction.auction.dto.WinnerResponse;
import com.liveauction.auction.service.WinnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class WinnerController {

    private final WinnerService winnerService;

    @GetMapping("/{auctionId}/winner")
    public ResponseEntity<WinnerResponse> getWinner(
            @PathVariable Long auctionId
    ) {

        return ResponseEntity.ok(
                winnerService.getWinner(auctionId)
        );
    }
}