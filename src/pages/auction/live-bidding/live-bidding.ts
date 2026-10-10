
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Bid {
  id: number;
  bidderName: string;
  amount: number;
  placedAt: Date;
}

@Component({
  selector: 'app-live-bidding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-bidding.html',
  styleUrl: './live-bidding.css'
})
export class LiveBidding implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  auctionId = 0;
  auctionTitle = 'Live Auction Item';
  currentPrice = 7500;
  startingPrice = 5000;
  minimumBidIncrement = 500;
  bidAmount: number | null = null;

  isLive = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  bids: Bid[] = [
    {
      id: 1,
      bidderName: 'AuctionUser',
      amount: 7500,
      placedAt: new Date()
    },
    {
      id: 2,
      bidderName: 'Collector24',
      amount: 7000,
      placedAt: new Date(Date.now() - 120000)
    },
    {
      id: 3,
      bidderName: 'BidMaster',
      amount: 6500,
      placedAt: new Date(Date.now() - 240000)
    }
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.router.navigate(['/auctions']);
      return;
    }

    this.auctionId = id;

    // Demo data only; replace with the auction API during backend integration.
    this.bidAmount = this.nextMinimumBid;
  }

  get nextMinimumBid(): number {
    return this.currentPrice + this.minimumBidIncrement;
  }

  get bidCount(): number {
    return this.bids.length;
  }

  placeBid(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isLive) {
      this.errorMessage = 'This auction is not currently accepting bids.';
      return;
    }

    if (
      this.bidAmount === null ||
      !Number.isFinite(this.bidAmount) ||
      this.bidAmount < this.nextMinimumBid
    ) {
      this.errorMessage =
        `Your bid must be at least ₹${this.nextMinimumBid.toLocaleString('en-IN')}.`;
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // Local simulation only. The backend must enforce bid concurrency.
    const bid: Bid = {
      id: Date.now(),
      bidderName: this.getCurrentBidderName(),
      amount: this.bidAmount,
      placedAt: new Date()
    };

    this.bids = [bid, ...this.bids];
    this.currentPrice = bid.amount;
    this.bidAmount = this.nextMinimumBid;
    this.successMessage = 'Demo bid placed successfully.';
    this.isSubmitting = false;
  }

  goBack(): void {
    this.router.navigate(['/auctions', this.auctionId]);
  }

  ngOnDestroy(): void {
    // WebSocket subscriptions will be cleaned up here when integrated.
  }

  private getCurrentBidderName(): string {
    try {
      const storedUser = localStorage.getItem('auction_user');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.fullName || user.username || 'You';
      }
    } catch {
      // Fall back to a generic display name.
    }

    return 'You';
  }
}