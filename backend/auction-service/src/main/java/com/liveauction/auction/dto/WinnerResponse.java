package com.liveauction.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class WinnerResponse {

    private Long auctionId;

    private Long winnerId;

    private BigDecimal winningAmount;
}