
import {
  Component,
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
} from '../../../core/services/auction';

import {
  Auction
} from '../../../core/models/auction';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-auction.html',
  styleUrl: './create-auction.css'
})
export class CreateAuction {

  private auctionService = inject(AuctionService);

  private router = inject(Router);

  title = '';
  description = '';
  imageUrl = '';
  category = 'Electronics';

  startingPrice: number | null = null;
  minimumBidIncrement: number | null = 100;

  startTime = '';
  endTime = '';

  isSaving = false;
  errorMessage = '';
  successMessage = '';

  readonly categories = [
    'Electronics',
    'Fashion',
    'Collectibles',
    'Vehicles',
    'Home & Garden',
    'Art',
    'Sports',
    'Other'
  ];

  submitAuction(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const title = this.title.trim();
    const description = this.description.trim();
    const imageUrl = this.imageUrl.trim();

    if (!title) {
      this.errorMessage = 'Please enter a product title.';
      return;
    }

    if (title.length < 3 || title.length > 100) {
      this.errorMessage = 'Title must be between 3 and 100 characters.';
      return;
    }

    if (!description) {
      this.errorMessage = 'Please enter a product description.';
      return;
    }

    if (description.length < 10 || description.length > 2000) {
      this.errorMessage = 'Description must be between 10 and 2000 characters.';
      return;
    }

    if (!imageUrl || !this.isValidImageUrl(imageUrl)) {
      this.errorMessage = 'Please enter a valid HTTP or HTTPS image URL.';
      return;
    }

    if (
      this.startingPrice === null ||
      !Number.isFinite(this.startingPrice) ||
      this.startingPrice <= 0
    ) {
      this.errorMessage = 'Starting price must be greater than zero.';
      return;
    }

    if (
      this.minimumBidIncrement === null ||
      !Number.isFinite(this.minimumBidIncrement) ||
      this.minimumBidIncrement <= 0
    ) {
      this.errorMessage = 'Minimum bid increment must be greater than zero.';
      return;
    }

    if (!this.startTime || !this.endTime) {
      this.errorMessage = 'Please select both auction start and end times.';
      return;
    }

    const start = new Date(this.startTime);
    const end = new Date(this.endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      this.errorMessage = 'Please enter valid auction dates.';
      return;
    }

    if (start <= new Date()) {
      this.errorMessage = 'Auction start time must be in the future.';
      return;
    }

    if (end <= start) {
      this.errorMessage = 'Auction end time must be after its start time.';
      return;
    }

    const newAuction: Auction = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      category: this.category,
      startingPrice: this.startingPrice,
      currentPrice: this.startingPrice,
      totalBids: 0,
      sellerName: this.getSellerName(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'UPCOMING'
    };

    this.isSaving = true;

    this.auctionService.createAuction(newAuction).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Auction created successfully.';
        this.router.navigate(['/auctions']);
      },
      error: (error) => {
        console.error('Unable to create auction:', error);
        this.isSaving = false;
        this.errorMessage = 'Unable to create auction. Please try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/auctions']);
  }

  private isValidImageUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private getSellerName(): string {
    try {
      const storedUser = localStorage.getItem('auction_user');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.fullName || 'Auction Seller';
      }
    } catch (error) {
      console.error('Unable to read seller information:', error);
    }

    return 'Auction Seller';
  }
}