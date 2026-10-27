
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { PaymentService } from '../services/payment';

import {
  CreatePaymentOrderResponse,
  RazorpaySuccessResponse
} from '../models/payment';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  theme: {
    color: string;
  };

  handler: (
    response: RazorpaySuccessResponse
  ) => void;

  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open(): void;

  on(
    event: string,
    callback: (event: unknown) => void
  ): void;
}

interface RazorpayConstructor {
  new (
    options: RazorpayOptions
  ): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

@Component({
  selector: 'app-auction-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auction-payment.html',
  styleUrl: './auction-payment.css'
})
export class AuctionPaymentComponent implements OnDestroy {

  loading = false;
  message = '';
  success = false;

  private scriptPromise?: Promise<void>;
  private destroyed = false;

  constructor(
    private readonly paymentService: PaymentService
  ) {}

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  // ================================================
  // LOAD RAZORPAY CHECKOUT SCRIPT
  // ================================================

  private loadRazorpayScript(): Promise<void> {

    if (window.Razorpay) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise<void>(
      (resolve, reject) => {

        const existingScript =
          document.querySelector<HTMLScriptElement>(
            'script[data-razorpay-checkout]'
          );

        const script =
          existingScript ??
          document.createElement('script');

        const handleLoad = (): void => {

          if (window.Razorpay) {
            resolve();
          } else {
            reject(
              new Error(
                'Razorpay Checkout loaded without initializing.'
              )
            );
          }
        };

        const handleError = (): void => {
          reject(
            new Error(
              'Unable to load Razorpay Checkout.'
            )
          );
        };

        script.addEventListener(
          'load',
          handleLoad,
          { once: true }
        );

        script.addEventListener(
          'error',
          handleError,
          { once: true }
        );

        if (!existingScript) {

          script.src =
            'https://checkout.razorpay.com/v1/checkout.js';

          script.async = true;

          script.dataset['razorpayCheckout'] = 'true';

          document.head.appendChild(script);

        } else if (window.Razorpay) {

          resolve();
        }
      }
    ).catch((error: unknown) => {

      this.scriptPromise = undefined;

      throw error;
    });

    return this.scriptPromise;
  }

  // ================================================
  // START PAYMENT
  // ================================================

  async payNow(
    auctionId: number
  ): Promise<void> {

    if (
      this.loading ||
      this.destroyed
    ) {
      return;
    }

    this.loading = true;
    this.success = false;

    this.message =
      'Preparing your payment...';

    try {

      await this.loadRazorpayScript();

      if (this.destroyed) {
        return;
      }

      const order: CreatePaymentOrderResponse =
        await firstValueFrom(
          this.paymentService.createOrder(
            auctionId
          )
        );

      if (
        !order.razorpayOrderId ||
        !order.razorpayKeyId
      ) {
        throw new Error(
          'The backend returned incomplete order details.'
        );
      }

      if (
        !Number.isFinite(Number(order.amount)) ||
        Number(order.amount) <= 0
      ) {
        throw new Error(
          'The payment amount is invalid.'
        );
      }

      if (
        !Number.isInteger(Number(order.transactionId)) ||
        Number(order.transactionId) <= 0
      ) {
        throw new Error(
          'The backend did not return a valid transaction ID.'
        );
      }

      if (this.destroyed) {
        return;
      }

      this.openCheckout(order);

    } catch (error: unknown) {

      console.error(
        'Unable to start payment:',
        error
      );

      this.message =
        error instanceof Error
          ? error.message
          : 'Unable to start payment. Please try again.';

      this.loading = false;
    }
  }

  // ================================================
  // OPEN RAZORPAY CHECKOUT
  // ================================================

  private openCheckout(
    order: CreatePaymentOrderResponse
  ): void {

    const Razorpay = window.Razorpay;

    if (!Razorpay) {

      this.loading = false;

      this.message =
        'Razorpay Checkout is unavailable. Refresh and try again.';

      return;
    }

    let checkoutCompleted = false;
    let verificationInProgress = false;

    const checkout = new Razorpay({

      key: order.razorpayKeyId,

      // Convert rupees into paise.
      amount: Math.round(
        Number(order.amount) * 100
      ),

      currency: order.currency || 'INR',

      name: 'Live Auction Bidding Platform',

      description: order.title,

      order_id: order.razorpayOrderId,

      theme: {
        color: '#2563eb'
      },

      // ============================================
      // PAYMENT SUCCESS HANDLER
      // ============================================

      handler: async (
        response: RazorpaySuccessResponse
      ): Promise<void> => {

        if (
          verificationInProgress ||
          this.destroyed
        ) {
          return;
        }

        checkoutCompleted = true;
        verificationInProgress = true;

        this.message =
          'Payment received. Verifying with the server...';

        this.success = false;

        try {

          if (
            !response?.razorpay_payment_id ||
            !response?.razorpay_order_id ||
            !response?.razorpay_signature
          ) {
            throw new Error(
              'Razorpay returned incomplete verification details.'
            );
          }

          /*
           * IMPORTANT:
           * Pass both the Razorpay response and the
           * transaction ID returned by the backend.
           */

          const verificationResult =
            await firstValueFrom(
              this.paymentService.verifyPayment(
                response,
                order.transactionId
              )
            );

          console.log(
            'Payment verification response:',
            verificationResult
          );

          if (this.destroyed) {
            return;
          }

          this.success = true;

          this.message =
            'Payment verified successfully!';

        } catch (error: unknown) {

          console.error(
            'Payment verification failed:',
            error
          );

          if (this.destroyed) {
            return;
          }

          this.success = false;

          this.message =
            this.getErrorMessage(error);

        } finally {

          verificationInProgress = false;

          if (!this.destroyed) {
            this.loading = false;
          }
        }
      },

      // ============================================
      // CHECKOUT CLOSED
      // ============================================

      modal: {

        ondismiss: (): void => {

          if (
            !checkoutCompleted &&
            !verificationInProgress
          ) {

            this.loading = false;

            this.message =
              'Checkout closed. Check payment status before retrying.';
          }
        }
      }
    });

    // ================================================
    // PAYMENT FAILURE HANDLER
    // ================================================

    checkout.on(
      'payment.failed',
      (event: unknown): void => {

        console.error(
          'Razorpay payment failed:',
          event
        );

        this.success = false;

        this.message =
          'Payment failed. Check the transaction status before trying again.';

        this.loading = false;
      }
    );

    this.message =
      'Complete your payment in Razorpay Checkout.';

    checkout.open();
  }

  // ================================================
  // ERROR HANDLING
  // ================================================

  private getErrorMessage(
    error: unknown
  ): string {

    const httpError = error as {
      status?: number;
      error?: {
        detail?: string;
        message?: string;
        error?: string;
      };
    };

    const serverMessage =
      httpError?.error?.detail ??
      httpError?.error?.message ??
      httpError?.error?.error;

    if (serverMessage) {
      return String(serverMessage);
    }

    if (httpError?.status === 0) {
      return (
        'Cannot connect to the Payment Service. ' +
        'Check that it is running on port 8084.'
      );
    }

    if (httpError?.status === 400) {
      return (
        'The backend rejected the verification request. ' +
        'Check the transaction ID and verification details.'
      );
    }

    if (httpError?.status === 401) {
      return 'Please log in again to continue.';
    }

    if (httpError?.status === 403) {
      return (
        'Payment verification was rejected. ' +
        'Check your authentication and transaction ownership.'
      );
    }

    if (httpError?.status === 409) {
      return (
        'The transaction cannot be verified in its current state.'
      );
    }

    if (
      typeof httpError?.status === 'number' &&
      httpError.status >= 500
    ) {
      return (
        'The Payment Service encountered a server error. ' +
        'Check the backend logs.'
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return (
      'Payment verification could not be confirmed. ' +
      'Check your transaction status before retrying.'
    );
  }
}

