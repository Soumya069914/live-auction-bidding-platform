import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { Auth } from '../../../app/core/services/auth';


interface DashboardUser {
  id?: number;
  fullName?: string;
  email?: string;
  role?: string;
}


interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
}


@Component({
  selector: 'app-dashboard',

  imports: [
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})


export class Dashboard implements OnInit, OnDestroy {

  private authService = inject(Auth);

  private router = inject(Router);


  user: DashboardUser = {

    fullName: 'Auction User',

    email: '',

    role: 'BUYER'

  };


  stats = {

    activeBids: 0,

    auctionsWon: 0,

    watchlistCount: 0,

    activitiesCount: 0

  };


  activities: Activity[] = [];


  featuredAuction = {

    title: 'Premium Vintage Watch',

    category: 'Collectibles',

    currentPrice: 12500,

    totalBids: 18,

    endsAt:
      new Date(
        Date.now() +
        1000 * 60 * 47 +
        1000 * 35
      )

  };


  remainingTime = '47m 35s';


  private countdownTimer?:
    ReturnType<typeof setInterval>;


  // =========================
  // INITIALIZATION
  // =========================

  ngOnInit(): void {

    this.loadUser();

    this.loadDashboardData();

    this.startAuctionCountdown();

  }


  // =========================
  // CLEANUP
  // =========================

  ngOnDestroy(): void {

    if (this.countdownTimer) {

      clearInterval(
        this.countdownTimer
      );

    }

  }


  // =========================
  // USER
  // =========================

  private loadUser(): void {

    const storedUser =
      localStorage.getItem(
        'auction_user'
      );


    if (!storedUser) {

      return;

    }


    try {

      const parsedUser =
        JSON.parse(
          storedUser
        ) as DashboardUser;


      this.user = {

        fullName:
          parsedUser.fullName ||
          'Auction User',

        email:
          parsedUser.email ||
          '',

        role:
          parsedUser.role ||
          'BUYER',

        id:
          parsedUser.id

      };

    } catch (error) {

      console.error(
        'Unable to load stored user:',
        error
      );

    }

  }


  // =========================
  // DASHBOARD DATA
  // =========================

  private loadDashboardData(): void {

    /*
     * Temporary frontend data.
     *
     * These values will later be
     * replaced with backend API data.
     */

    this.stats = {

      activeBids: 3,

      auctionsWon: 1,

      watchlistCount: 6,

      activitiesCount: 12

    };


    this.activities = [

      {

        icon: '🔥',

        title: 'Bid placed',

        description:
          'You placed a bid on Premium Vintage Watch.',

        time: '12 min ago'

      },


      {

        icon: '👀',

        title: 'Auction viewed',

        description:
          'You viewed a Classic Motorcycle auction.',

        time: '38 min ago'

      },


      {

        icon: '❤️',

        title: 'Added to watchlist',

        description:
          'You saved a Designer Camera to your watchlist.',

        time: '1 hr ago'

      }

    ];

  }


  // =========================
  // AUCTION COUNTDOWN
  // =========================

  private startAuctionCountdown(): void {

    this.updateCountdown();


    this.countdownTimer =
      setInterval(() => {

        this.updateCountdown();

      }, 1000);

  }


  private updateCountdown(): void {

    const difference =
      this.featuredAuction.endsAt.getTime() -
      Date.now();


    if (difference <= 0) {

      this.remainingTime =
        'Auction ended';


      if (this.countdownTimer) {

        clearInterval(
          this.countdownTimer
        );

      }

      return;

    }


    const totalSeconds =
      Math.floor(
        difference / 1000
      );


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


    if (hours > 0) {

      this.remainingTime =
        `${hours}h ${minutes}m ${seconds}s`;

    } else {

      this.remainingTime =
        `${minutes}m ${seconds}s`;

    }

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}