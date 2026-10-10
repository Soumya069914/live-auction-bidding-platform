import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveBidding } from './live-bidding';

describe('LiveBidding', () => {
  let component: LiveBidding;
  let fixture: ComponentFixture<LiveBidding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveBidding],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveBidding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
