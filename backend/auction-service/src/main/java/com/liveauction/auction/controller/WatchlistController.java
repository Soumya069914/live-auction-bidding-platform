package com.liveauction.auction.controller;

import com.liveauction.auction.entity.Watchlist;
import com.liveauction.auction.service.WatchlistService;
import com.liveauction.auction.client.AuthUserClient;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions/watchlist")
public class WatchlistController {


private final WatchlistService watchlistService;
    private final AuthUserClient authUserClient;
public WatchlistController(
            WatchlistService watchlistService,
AuthUserClient authUserClient) {
        this.watchlistService = watchlistService;
        this.authUserClient = authUserClient;
    }
// Add auction to watchlist
    @PostMapping("/{auctionId}")
    public ResponseEntity<?> addToWatchlist(
            @PathVariable Long auctionId,
            @RequestHeader("Authorization") String authorization) {
 try {
            String token = authorization.replaceFirst("(?i)^Bearer\\s+", "");
            Long userId = authUserClient.getUserId(token);
Watchlist watchlist =
                    watchlistService.addToWatchlist(userId, auctionId);
return ResponseEntity.status(HttpStatus.CREATED).body(watchlist);
