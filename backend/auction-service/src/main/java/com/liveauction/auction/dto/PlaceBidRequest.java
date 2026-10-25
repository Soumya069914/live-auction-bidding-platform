package com.liveauction.auction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PlaceBidRequest {

    @NotNull(message = "Bidder ID is required")
    private Long bidderId;

    @NotNull(message = "Bid amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Bid amount must be greater than 0"
    )
    private BigDecimal amount;

    public Long getBidderId() {
        return bidderId;
    }

    public void setBidderId(Long bidderId) {
        this.bidderId = bidderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}