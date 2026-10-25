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