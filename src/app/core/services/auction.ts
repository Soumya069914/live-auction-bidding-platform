
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Auction } from '../models/auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private auctions: Auction[] = [
    {
      id: 1,
      title: 'Premium Vintage Watch',
      description: 'A vintage watch with timeless design and excellent craftsmanship.',
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=80',
      category: 'Fashion',
      startingPrice: 5000,
      currentPrice: 7500,
      minimumBidIncrement: 500,
      totalBids: 6,
      sellerName: 'Vintage Collections',
      startTime: '2026-10-01T10:00:00.000Z',
      endTime: '2026-10-30T18:00:00.000Z',
      status: 'LIVE'
    },
    {
      id: 2,
      title: 'Professional DSLR Camera',
      description: 'A professional DSLR camera for photography enthusiasts.',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      category: 'Electronics',
      startingPrice: 25000,
      currentPrice: 28000,
      minimumBidIncrement: 1000,
      totalBids: 3,
      sellerName: 'Camera World',
      startTime: '2026-10-10T10:00:00.000Z',
      endTime: '2026-11-10T18:00:00.000Z',
      status: 'UPCOMING'
    },
    {
      id: 3,
      title: 'Classic Royal Enfield Motorcycle',
      description: 'A classic motorcycle for collectors and enthusiasts.',
      imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      category: 'Vehicles',
      startingPrice: 80000,
      currentPrice: 95000,
      minimumBidIncrement: 2000,
      totalBids: 8,
      sellerName: 'Classic Motors',
      startTime: '2026-09-01T10:00:00.000Z',
      endTime: '2026-09-20T18:00:00.000Z',
      status: 'ENDED'
    },
    {
      id: 4,
      title: 'Antique Wooden Chess Set',
      description: 'An elegant wooden chess set for display or regular play.',
      imageUrl: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1000&q=80',
      category: 'Collectibles',
      startingPrice: 3000,
      currentPrice: 4500,
      minimumBidIncrement: 250,
      totalBids: 5,
      sellerName: 'Antique House',
      startTime: '2026-10-15T10:00:00.000Z',
      endTime: '2026-11-15T18:00:00.000Z',
      status: 'UPCOMING'
    },
    {
      id: 5,
      title: 'Luxury Designer Handbag',
      description: 'A designer handbag with a premium finish.',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      category: 'Fashion',
      startingPrice: 12000,
      currentPrice: 15000,
      minimumBidIncrement: 500,
      totalBids: 4,
      sellerName: 'Luxury Finds',
      startTime: '2026-09-01T10:00:00.000Z',
      endTime: '2026-09-15T18:00:00.000Z',
      status: 'ENDED'
    },
    {
      id: 6,
      title: 'Modern Gaming Laptop',
      description: 'A powerful laptop for gaming and productivity.',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
      category: 'Electronics',
      startingPrice: 60000,
      currentPrice: 65000,
      minimumBidIncrement: 1000,
      totalBids: 7,
      sellerName: 'Tech Store',
      startTime: '2026-10-05T10:00:00.000Z',
      endTime: '2026-11-05T18:00:00.000Z',
      status: 'LIVE'
    }
  ];

  getAuctions(): Observable<Auction[]> {
    return of([...this.auctions]);
  }

  getAuctionById(id: number): Observable<Auction | undefined> {
    const auction = this.auctions.find(item => item.id === id);
    return of(auction);
  }

  createAuction(auction: Auction): Observable<Auction> {
    const newAuction: Auction = {
      ...auction,
      id: this.getNextId()
    };

    this.auctions.unshift(newAuction);
    return of(newAuction);
  }

  private getNextId(): number {
    if (this.auctions.length === 0) {
      return 1;
    }

    return Math.max(...this.auctions.map(item => item.id)) + 1;
  }
}