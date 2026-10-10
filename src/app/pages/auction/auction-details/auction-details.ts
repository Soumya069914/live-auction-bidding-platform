
import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AuctionService
} from '../../../core/services/auction';

import {
  Auction
} from '../../../core/models/auction';

@Component({
  selector: 'app-auction-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './auction-details.html',
  styleUrl: './auction-details.css'
})
export class AuctionDetails implements OnInit {

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private auctionService = inject(AuctionService);

  auction: Auction | null = null;

  isLoading = true;

  errorMessage = '';

  ngOnInit(): void {
    const idParam =
      this.route.snapshot.paramMap.get('id');

    const auctionId = Number(idParam);

    if (
      !idParam ||
      !Number.isInteger(auctionId) ||
      auctionId <= 0
    ) {
      this.errorMessage = 'Invalid auction ID.';
      this.isLoading = false;
      return;
    }

    this.loadAuction(auctionId);
  }

  private loadAuction(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.auctionService.getAuctionById(id).subscribe({
      next: (auction) => {
        this.auction = auction ?? null;

        if (!this.auction) {
          this.errorMessage =
            'This auction could not be found.';
        }

        this.isLoading = false;
      },

      error: (error) => {
        console.error(
          'Unable to load auction details:',
          error
        );

        this.errorMessage =
          'Unable to load auction details. Please try again.';

        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/auctions']);
  }

  startBidding(): void {
    if (
      !this.auction ||
      this.auction.status !== 'LIVE'
    ) {
      return;
    }

    // Connect to the bidding page when that module is implemented.
    this.router.navigate([
      '/auctions',
      this.auction.id,
      'bid'
    ]);
  }
}