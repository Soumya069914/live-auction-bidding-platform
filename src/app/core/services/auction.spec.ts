import { TestBed } from '@angular/core/testing';

import {
  AuctionService
} from './auction';

describe('AuctionService', () => {

  let service: AuctionService;

  beforeEach(() => {

    TestBed.configureTestingModule({});

    service = TestBed.inject(
      AuctionService
    );

  });

  it('should be created', () => {

    expect(service).toBeTruthy();

  });

  it('should return auctions', () => {

    service.getAuctions().subscribe(
      auctions => {

        expect(auctions.length).toBeGreaterThan(0);

      }
    );

  });

  it('should find an auction by id', () => {

    service.getAuctionById(1).subscribe(
      auction => {

        expect(auction).toBeTruthy();

        expect(auction?.id).toBe(1);

      }
    );

  });

  it('should return undefined for an unknown auction id', () => {

    service.getAuctionById(999).subscribe(
      auction => {

        expect(auction).toBeUndefined();

      }
    );

  });

});