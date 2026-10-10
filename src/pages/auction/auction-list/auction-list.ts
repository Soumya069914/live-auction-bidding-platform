import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuctionService
} from '../../../app/core/services/auction';

import {
  Auction
} from '../../../app/core/models/auction';

@Component({
  selector: 'app-auction-list',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './auction-list.html',

  styleUrl: './auction-list.css'
})
export class AuctionList implements OnInit {

  private auctionService =
    inject(AuctionService);

  private router =
    inject(Router);

  auctions: Auction[] = [];

  filteredAuctions: Auction[] = [];

  searchTerm = '';

  selectedCategory = 'ALL';

  selectedStatus = 'ALL';

  sortOption = 'NEWEST';

  isLoading = false;

  errorMessage = '';

  ngOnInit(): void {

    this.loadAuctions();

  }

  loadAuctions(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.auctionService
      .getAuctions()
      .subscribe({

        next: (auctions) => {

          this.auctions = auctions;

          this.applyFilters();

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Unable to load auctions:',
            error
          );

          this.errorMessage =
            'Unable to load auctions. Please try again.';

          this.isLoading = false;

        }

      });

  }

  applyFilters(): void {

    let result =
      [...this.auctions];

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (search) {

      result = result.filter(
        auction =>
          auction.title
            .toLowerCase()
            .includes(search) ||

          auction.description
            .toLowerCase()
            .includes(search) ||

          auction.category
            .toLowerCase()
            .includes(search) ||

          auction.sellerName
            .toLowerCase()
            .includes(search)
      );

    }

    if (
      this.selectedCategory !== 'ALL'
    ) {

      result = result.filter(
        auction =>
          auction.category ===
          this.selectedCategory
      );

    }

    if (
      this.selectedStatus !== 'ALL'
    ) {

      result = result.filter(
        auction =>
          auction.status ===
          this.selectedStatus
      );

    }

    switch (this.sortOption) {

      case 'PRICE_LOW':

        result.sort(
          (a, b) =>
            a.currentPrice -
            b.currentPrice
        );

        break;

      case 'PRICE_HIGH':

        result.sort(
          (a, b) =>
            b.currentPrice -
            a.currentPrice
        );

        break;

      case 'BIDS_HIGH':

        result.sort(
          (a, b) =>
            b.totalBids -
            a.totalBids
        );

        break;

      case 'NEWEST':

      default:

        result.sort(
          (a, b) =>
            new Date(b.startTime).getTime() -
            new Date(a.startTime).getTime()
        );

        break;

    }

    this.filteredAuctions =
      result;

  }

  onSearchChange(): void {

    this.applyFilters();

  }

  onCategoryChange(): void {

    this.applyFilters();

  }

  onStatusChange(): void {

    this.applyFilters();

  }

  onSortChange(): void {

    this.applyFilters();

  }

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedCategory =
      'ALL';

    this.selectedStatus =
      'ALL';

    this.sortOption =
      'NEWEST';

    this.applyFilters();

  }

  viewAuction(
    auctionId: number
  ): void {

    this.router.navigate([
      '/auctions',
      auctionId
    ]);

  }

  get categories(): string[] {

    return [
      ...new Set(
        this.auctions.map(
          auction =>
            auction.category
        )
      )
    ];

  }

  get liveAuctionCount(): number {

    return this.auctions.filter(
      auction =>
        auction.status === 'LIVE'
    ).length;

  }

  get upcomingAuctionCount(): number {

    return this.auctions.filter(
      auction =>
        auction.status === 'UPCOMING'
    ).length;

  }

  get endedAuctionCount(): number {

    return this.auctions.filter(
      auction =>
        auction.status === 'ENDED'
    ).length;

  }

}